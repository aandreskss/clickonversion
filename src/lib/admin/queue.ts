import { createAdminClient } from "@/lib/supabase/server"
import type {
  AdminRequest,
  QueueFilters,
  StatusLogEntry,
  AdminRequestStatus,
  RequestPriority,
} from "@/types/admin"
import { STATUS_TRANSITIONS } from "@/types/admin"
import type { RequestMilestone, Comment, MilestoneStatus } from "@/types/portal"

// ── Public API ────────────────────────────────────────────────────────────────

export async function getQueue(filters: QueueFilters): Promise<{
  items: AdminRequest[]
  total: number
  page: number
}> {
  const supabase = createAdminClient()
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("pf_requests")
    .select(
      `
      *,
      pf_client_orgs ( id, name, slug ),
      pf_specialist_profiles ( id, display_name, pf_platform_users ( email ) )
    `,
      { count: "exact" }
    )

  if (filters.status?.length) query = query.in("status", filters.status)
  if (filters.priority?.length) query = query.in("priority", filters.priority)
  if (filters.specialistId) query = query.eq("assigned_specialist_id", filters.specialistId)
  if (filters.search) query = query.ilike("service_name", `%${filters.search}%`)

  const sortBy = filters.sortBy ?? "created_at"
  const sortDir = filters.sortDir ?? "desc"
  query = query.order(sortBy, { ascending: sortDir === "asc" })

  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query
  if (error) throw error

  return {
    items: (data ?? []).map((row) => mapAdminRequest(row as Record<string, unknown>)),
    total: count ?? 0,
    page,
  }
}

export async function getQueueItem(id: string): Promise<{
  request: AdminRequest
  milestones: RequestMilestone[]
  comments: Comment[]
  statusLog: StatusLogEntry[]
} | null> {
  const supabase = createAdminClient()

  const [requestResult, milestonesResult, commentsResult, statusLogResult] = await Promise.all([
    supabase
      .from("pf_requests")
      .select(
        `
        *,
        pf_client_orgs ( id, name, slug ),
        pf_specialist_profiles ( id, display_name, pf_platform_users ( email ) )
      `
      )
      .eq("id", id)
      .single(),

    supabase
      .from("pf_request_milestones")
      .select("*")
      .eq("request_id", id)
      .order("sort_order", { ascending: true }),

    supabase
      .from("pf_comments")
      .select("*, pf_platform_users ( id, email, full_name, avatar_url )")
      .eq("request_id", id)
      .order("created_at", { ascending: true }),

    supabase
      .from("pf_request_status_log")
      .select("*")
      .eq("request_id", id)
      .order("created_at", { ascending: true }),
  ])

  if (requestResult.error || !requestResult.data) return null

  const request = mapAdminRequest(requestResult.data as Record<string, unknown>)

  const milestones: RequestMilestone[] = (milestonesResult.data ?? []).map((m) => ({
    id: m.id as string,
    requestId: m.request_id as string,
    title: m.title as string,
    description: (m.description as string | null) ?? null,
    isClientVisible: m.is_client_visible as boolean,
    status: m.status as MilestoneStatus,
    dueDate: (m.due_date as string | null) ?? null,
    completedAt: (m.completed_at as string | null) ?? null,
    sortOrder: (m.sort_order as number) ?? 0,
  }))

  const comments: Comment[] = (commentsResult.data ?? []).map((c) => {
    const rawAuthor = c.pf_platform_users
    const author = Array.isArray(rawAuthor) ? rawAuthor[0] : rawAuthor
    return {
      id: c.id as string,
      requestId: c.request_id as string,
      authorId: c.author_id as string,
      authorRole: c.author_role as "client" | "staff" | "admin",
      body: c.body as string,
      isInternal: c.is_internal as boolean,
      createdAt: c.created_at as string,
      updatedAt: c.updated_at as string,
      author: author
        ? {
            id: author.id as string,
            email: author.email as string,
            fullName: (author.full_name as string | null) ?? null,
            avatarUrl: (author.avatar_url as string | null) ?? null,
          }
        : undefined,
    }
  })

  const statusLog: StatusLogEntry[] = (statusLogResult.data ?? []).map((l) => ({
    id: l.id as string,
    requestId: l.request_id as string,
    fromStatus: (l.from_status as AdminRequestStatus | null) ?? null,
    toStatus: l.to_status as AdminRequestStatus,
    changedBy: (l.changed_by as string | null) ?? null,
    changedByEmail: (l.changed_by_email as string | null) ?? null,
    note: (l.note as string | null) ?? null,
    createdAt: l.created_at as string,
  }))

  return { request, milestones, comments, statusLog }
}

export async function updateRequestStatus(params: {
  requestId: string
  newStatus: AdminRequestStatus
  changedBy: string
  changedByEmail: string
  note?: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from("pf_requests")
    .select("status, started_at")
    .eq("id", params.requestId)
    .single()

  if (fetchError || !current) return { success: false, error: "Request not found" }

  const currentStatus = current.status as AdminRequestStatus
  const validTransitions = STATUS_TRANSITIONS[currentStatus] ?? []

  if (!validTransitions.includes(params.newStatus)) {
    return {
      success: false,
      error: `Invalid transition: ${currentStatus} → ${params.newStatus}`,
    }
  }

  const now = new Date().toISOString()
  const updateData: Record<string, unknown> = {
    status: params.newStatus,
    updated_at: now,
  }

  if (params.newStatus === "in_progress" && !current.started_at) {
    updateData.started_at = now
  }
  if (params.newStatus === "completed") updateData.completed_at = now
  if (params.newStatus === "cancelled") updateData.cancelled_at = now
  if (params.newStatus === "refunded") updateData.refunded_at = now

  const { error: updateError } = await supabase
    .from("pf_requests")
    .update(updateData)
    .eq("id", params.requestId)

  if (updateError) return { success: false, error: updateError.message }

  const { error: logError } = await supabase.from("pf_request_status_log").insert({
    request_id: params.requestId,
    from_status: currentStatus,
    to_status: params.newStatus,
    changed_by: params.changedBy,
    changed_by_email: params.changedByEmail,
    note: params.note ?? null,
  })

  if (logError) {
    // Log failure should not fail the whole operation — status already updated
    console.error("Failed to insert status log:", logError.message)
  }

  if (["waiting_client", "completed", "review"].includes(params.newStatus)) {
    await notifyOrgMembers(params.requestId, params.newStatus)
  }

  return { success: true }
}

export async function assignSpecialist(params: {
  requestId: string
  specialistId: string | null
  assignedBy: string
  assignedByEmail: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  if (params.specialistId !== null) {
    const { data: profile, error: profileError } = await supabase
      .from("pf_specialist_profiles")
      .select("max_concurrent")
      .eq("id", params.specialistId)
      .single()

    if (profileError || !profile) return { success: false, error: "Specialist not found" }

    const { count, error: countError } = await supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .eq("assigned_specialist_id", params.specialistId)
      .in("status", [
        "in_progress",
        "active",
        "consultation_scheduled",
        "waiting_third_party",
        "review",
      ])

    if (countError) return { success: false, error: countError.message }

    const maxConcurrent = profile.max_concurrent as number
    if ((count ?? 0) >= maxConcurrent) {
      return {
        success: false,
        error: `Specialist at capacity (${count}/${maxConcurrent})`,
      }
    }
  }

  const { error: updateError } = await supabase
    .from("pf_requests")
    .update({
      assigned_specialist_id: params.specialistId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.requestId)

  if (updateError) return { success: false, error: updateError.message }

  return { success: true }
}

export async function updateRequestDetails(
  requestId: string,
  data: Partial<{
    priority: RequestPriority
    estimatedStart: string | null
    scope: string | null
    blockedReason: string | null
    waitingInfoMessage: string | null
    internalNotes: string | null
    specialistEmail: string | null
  }>
): Promise<void> {
  const supabase = createAdminClient()
  const update: Record<string, unknown> = {}

  if (data.priority !== undefined) update.priority = data.priority
  if (data.estimatedStart !== undefined) update.estimated_start = data.estimatedStart
  if (data.scope !== undefined) update.scope = data.scope
  if (data.blockedReason !== undefined) update.blocked_reason = data.blockedReason
  if (data.waitingInfoMessage !== undefined) update.waiting_info_message = data.waitingInfoMessage
  if (data.internalNotes !== undefined) update.internal_notes = data.internalNotes
  if (data.specialistEmail !== undefined) update.specialist_email = data.specialistEmail

  if (Object.keys(update).length === 0) return

  update.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from("pf_requests")
    .update(update)
    .eq("id", requestId)

  if (error) throw new Error(error.message)
}

export async function addAdminComment(params: {
  requestId: string
  authorId: string
  authorRole: "admin" | "staff"
  body: string
  isInternal: boolean
}): Promise<void> {
  if (!params.body.trim()) throw new Error("Comment body cannot be empty")

  const supabase = createAdminClient()

  const { error } = await supabase.from("pf_comments").insert({
    request_id: params.requestId,
    author_id: params.authorId,
    author_role: params.authorRole,
    body: params.body.trim(),
    is_internal: params.isInternal,
  })

  if (error) throw new Error(error.message)

  if (!params.isInternal) {
    await notifyOrgMembers(params.requestId, "new_comment")
  }
}

export async function createMilestone(params: {
  requestId: string
  title: string
  description?: string
  isClientVisible: boolean
  dueDate?: string
  sortOrder?: number
}): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase.from("pf_request_milestones").insert({
    request_id: params.requestId,
    title: params.title,
    description: params.description ?? null,
    is_client_visible: params.isClientVisible,
    due_date: params.dueDate ?? null,
    sort_order: params.sortOrder ?? 0,
    status: "pending",
  })

  if (error) throw new Error(error.message)
}

export async function updateMilestone(
  milestoneId: string,
  data: Partial<{
    title: string
    description: string | null
    isClientVisible: boolean
    status: MilestoneStatus
    dueDate: string | null
    completedAt: string | null
  }>
): Promise<void> {
  const supabase = createAdminClient()
  const update: Record<string, unknown> = {}

  if (data.title !== undefined) update.title = data.title
  if (data.description !== undefined) update.description = data.description
  if (data.isClientVisible !== undefined) update.is_client_visible = data.isClientVisible
  if (data.status !== undefined) update.status = data.status
  if (data.dueDate !== undefined) update.due_date = data.dueDate
  if (data.completedAt !== undefined) update.completed_at = data.completedAt

  if (Object.keys(update).length === 0) return

  const { error } = await supabase
    .from("pf_request_milestones")
    .update(update)
    .eq("id", milestoneId)

  if (error) throw new Error(error.message)
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function notifyOrgMembers(requestId: string, event: string): Promise<void> {
  const supabase = createAdminClient()

  const { data: req, error: reqError } = await supabase
    .from("pf_requests")
    .select("org_id, service_name")
    .eq("id", requestId)
    .single()

  if (reqError || !req) return

  const { data: members, error: membersError } = await supabase
    .from("pf_org_members")
    .select("user_id")
    .eq("org_id", req.org_id as string)

  if (membersError || !members?.length) return

  const serviceName = req.service_name as string

  const titleMap: Record<string, string> = {
    new_comment: `Nuevo mensaje en ${serviceName}`,
    waiting_client: `Acción requerida: ${serviceName}`,
    completed: `Servicio completado: ${serviceName}`,
    review: `En revisión: ${serviceName}`,
  }

  const bodyMap: Record<string, string> = {
    new_comment: "El equipo dejó un nuevo mensaje.",
    waiting_client: "Estamos esperando tu respuesta.",
    completed: "Tu servicio ha sido completado.",
    review: "Tu entregable está en revisión final.",
  }

  const notifications = members.map((m) => ({
    user_id: m.user_id as string,
    type: event,
    title: titleMap[event] ?? `Actualización en ${serviceName}`,
    body: bodyMap[event] ?? "Hay una actualización en tu solicitud.",
    link: `/portal/requests/${requestId}`,
    entity_type: "request",
    entity_id: requestId,
    is_read: false,
  }))

  await supabase.from("pf_notifications").insert(notifications)
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapAdminRequest(row: Record<string, unknown>): AdminRequest {
  const rawOrg = row.pf_client_orgs
  const org = Array.isArray(rawOrg) ? rawOrg[0] : rawOrg

  const rawSpec = row.pf_specialist_profiles
  const spec = Array.isArray(rawSpec) ? rawSpec[0] : rawSpec

  let specUser: Record<string, unknown> | null = null
  if (spec) {
    const rawSpecUser = (spec as Record<string, unknown>).pf_platform_users
    specUser = Array.isArray(rawSpecUser) ? rawSpecUser[0] : rawSpecUser
  }

  return {
    id: row.id as string,
    orgId: row.org_id as string,
    orderId: (row.order_id as string | null) ?? null,
    orderItemId: (row.order_item_id as string | null) ?? null,
    serviceId: (row.service_id as string | null) ?? null,
    serviceName: row.service_name as string,
    scope: (row.scope as string | null) ?? null,
    status: row.status as AdminRequestStatus,
    priority: ((row.priority as RequestPriority) ?? "normal") as RequestPriority,
    specialistEmail: (row.specialist_email as string | null) ?? null,
    assignedSpecialistId: (row.assigned_specialist_id as string | null) ?? null,
    estimatedStart: (row.estimated_start as string | null) ?? null,
    startedAt: (row.started_at as string | null) ?? null,
    completedAt: (row.completed_at as string | null) ?? null,
    cancelledAt: (row.cancelled_at as string | null) ?? null,
    refundedAt: (row.refunded_at as string | null) ?? null,
    blockedReason: (row.blocked_reason as string | null) ?? null,
    waitingInfoMessage: (row.waiting_info_message as string | null) ?? null,
    internalNotes: (row.internal_notes as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    org: org
      ? {
          id: (org as Record<string, unknown>).id as string,
          name: (org as Record<string, unknown>).name as string,
          slug: (org as Record<string, unknown>).slug as string,
        }
      : undefined,
    specialist: spec
      ? {
          id: (spec as Record<string, unknown>).id as string,
          displayName: (spec as Record<string, unknown>).display_name as string,
          user: specUser
            ? { email: (specUser as Record<string, unknown>).email as string }
            : undefined,
        }
      : undefined,
  }
}
