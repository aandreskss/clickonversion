import { db } from "@/lib/db"
import {
  pfRequests, pfRequestMilestones, pfComments, pfRequestStatusLog,
  pfClientOrgs, pfSpecialistProfiles, pfPlatformUsers, pfOrgMembers,
  pfNotifications, users,
} from "@/lib/db/schema"
import { eq, and, inArray, asc, desc, ilike, sql } from "drizzle-orm"
import type {
  AdminRequest, QueueFilters, StatusLogEntry, AdminRequestStatus, RequestPriority,
} from "@/types/admin"
import { STATUS_TRANSITIONS } from "@/types/admin"
import type { RequestMilestone, Comment, MilestoneStatus } from "@/types/portal"

export async function getQueue(filters: QueueFilters): Promise<{
  items: AdminRequest[]
  total: number
  page: number
}> {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20
  const offset = (page - 1) * pageSize

  const where: ReturnType<typeof and>[] = []
  if (filters.status?.length) where.push(inArray(pfRequests.status, filters.status as any[]))
  if (filters.priority?.length) where.push(inArray(pfRequests.priority, filters.priority as any[]))
  if (filters.specialistId) where.push(eq(pfRequests.assignedSpecialistId, filters.specialistId))
  if (filters.search) where.push(ilike(pfRequests.serviceName, `%${filters.search}%`))

  const [rows, countResult] = await Promise.all([
    db
      .select({
        request: pfRequests,
        orgName: pfClientOrgs.name,
        orgSlug: pfClientOrgs.slug,
        specialistDisplayName: pfSpecialistProfiles.displayName,
        specialistUserId: pfSpecialistProfiles.userId,
        specialistUserEmail: users.email,
      })
      .from(pfRequests)
      .leftJoin(pfClientOrgs, eq(pfRequests.orgId, pfClientOrgs.id))
      .leftJoin(pfSpecialistProfiles, eq(pfRequests.assignedSpecialistId, pfSpecialistProfiles.id))
      .leftJoin(pfPlatformUsers, eq(pfSpecialistProfiles.userId, pfPlatformUsers.id))
      .leftJoin(users, eq(pfPlatformUsers.id, users.id))
      .where(where.length ? and(...where) : undefined)
      .orderBy(filters.sortDir === "asc" ? asc(pfRequests.createdAt) : desc(pfRequests.createdAt))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ n: sql<number>`count(*)::int` })
      .from(pfRequests)
      .where(where.length ? and(...where) : undefined),
  ])

  return {
    items: rows.map(({ request, orgName, orgSlug, specialistDisplayName, specialistUserEmail }) =>
      mapAdminRequest(request, orgName, orgSlug, specialistDisplayName, specialistUserEmail),
    ),
    total: countResult[0]?.n ?? 0,
    page,
  }
}

export async function getQueueItem(id: string): Promise<{
  request: AdminRequest
  milestones: RequestMilestone[]
  comments: Comment[]
  statusLog: StatusLogEntry[]
} | null> {
  const [requestRows, milestones, commentRows, statusLog] = await Promise.all([
    db
      .select({
        request: pfRequests,
        orgName: pfClientOrgs.name,
        orgSlug: pfClientOrgs.slug,
        specialistDisplayName: pfSpecialistProfiles.displayName,
        specialistUserEmail: users.email,
      })
      .from(pfRequests)
      .leftJoin(pfClientOrgs, eq(pfRequests.orgId, pfClientOrgs.id))
      .leftJoin(pfSpecialistProfiles, eq(pfRequests.assignedSpecialistId, pfSpecialistProfiles.id))
      .leftJoin(pfPlatformUsers, eq(pfSpecialistProfiles.userId, pfPlatformUsers.id))
      .leftJoin(users, eq(pfPlatformUsers.id, users.id))
      .where(eq(pfRequests.id, id))
      .limit(1),

    db.select().from(pfRequestMilestones).where(eq(pfRequestMilestones.requestId, id)).orderBy(asc(pfRequestMilestones.sortOrder)),

    db
      .select({ comment: pfComments, authorEmail: users.email, authorName: pfPlatformUsers.displayName })
      .from(pfComments)
      .leftJoin(pfPlatformUsers, eq(pfComments.authorId, pfPlatformUsers.id))
      .leftJoin(users, eq(pfPlatformUsers.id, users.id))
      .where(eq(pfComments.requestId, id))
      .orderBy(asc(pfComments.createdAt)),

    db.select().from(pfRequestStatusLog).where(eq(pfRequestStatusLog.requestId, id)).orderBy(asc(pfRequestStatusLog.createdAt)),
  ])

  if (!requestRows.length) return null

  const { request, orgName, orgSlug, specialistDisplayName, specialistUserEmail } = requestRows[0]

  return {
    request: mapAdminRequest(request, orgName, orgSlug, specialistDisplayName, specialistUserEmail),
    milestones: milestones.map((m) => ({
      id: m.id, requestId: m.requestId, title: m.title, description: m.description ?? null,
      isClientVisible: m.isClientVisible, status: m.status as MilestoneStatus,
      dueDate: m.dueDate ?? null, completedAt: m.completedAt?.toISOString() ?? null, sortOrder: m.sortOrder,
    })),
    comments: commentRows.map(({ comment, authorEmail, authorName }) => ({
      id: comment.id, requestId: comment.requestId, authorId: comment.authorId,
      authorRole: comment.authorRole as Comment["authorRole"], body: comment.body, isInternal: comment.isInternal,
      createdAt: comment.createdAt?.toISOString() ?? "", updatedAt: comment.updatedAt?.toISOString() ?? "",
      author: authorEmail ? { id: comment.authorId, email: authorEmail, fullName: authorName ?? null, avatarUrl: null } : undefined,
    })),
    statusLog: statusLog.map((l) => ({
      id: l.id, requestId: l.requestId, fromStatus: l.fromStatus as AdminRequestStatus | null,
      toStatus: l.toStatus as AdminRequestStatus, changedBy: l.changedBy ?? null,
      changedByEmail: l.changedByEmail ?? null, note: l.note ?? null, createdAt: l.createdAt?.toISOString() ?? "",
    })),
  }
}

export async function updateRequestStatus(params: {
  requestId: string
  newStatus: AdminRequestStatus
  changedBy: string
  changedByEmail: string
  note?: string
}): Promise<{ success: boolean; error?: string }> {
  const [current] = await db
    .select({ status: pfRequests.status, startedAt: pfRequests.startedAt })
    .from(pfRequests)
    .where(eq(pfRequests.id, params.requestId))
    .limit(1)

  if (!current) return { success: false, error: "Request not found" }

  const currentStatus = current.status as AdminRequestStatus
  const validTransitions = STATUS_TRANSITIONS[currentStatus] ?? []
  if (!validTransitions.includes(params.newStatus)) {
    return { success: false, error: `Invalid transition: ${currentStatus} → ${params.newStatus}` }
  }

  const now = new Date()
  const update: Record<string, unknown> = { status: params.newStatus }
  if (params.newStatus === "in_progress" && !current.startedAt) update.startedAt = now
  if (params.newStatus === "completed") update.completedAt = now
  if (params.newStatus === "cancelled") update.cancelledAt = now
  if (params.newStatus === "refunded") update.refundedAt = now

  await db.update(pfRequests).set(update).where(eq(pfRequests.id, params.requestId))

  await db.insert(pfRequestStatusLog).values({
    requestId: params.requestId,
    fromStatus: currentStatus as any,
    toStatus: params.newStatus as any,
    changedBy: params.changedBy,
    changedByEmail: params.changedByEmail,
    note: params.note ?? null,
  }).catch((err) => console.error("Failed to insert status log:", err))

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
  if (params.specialistId !== null) {
    const { canAssign, currentLoad, maxConcurrent } = await import("@/lib/admin/specialists")
      .then((m) => m.canAssignToSpecialist(params.specialistId!))

    if (!canAssign) {
      return { success: false, error: `Specialist at capacity (${currentLoad}/${maxConcurrent})` }
    }
  }

  await db
    .update(pfRequests)
    .set({ assignedSpecialistId: params.specialistId })
    .where(eq(pfRequests.id, params.requestId))

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
  }>,
): Promise<void> {
  const update: Record<string, unknown> = {}
  if (data.priority !== undefined) update.priority = data.priority
  if (data.estimatedStart !== undefined) update.estimatedStart = data.estimatedStart
  if (data.scope !== undefined) update.scope = data.scope
  if (data.blockedReason !== undefined) update.blockedReason = data.blockedReason
  if (data.waitingInfoMessage !== undefined) update.waitingInfoMessage = data.waitingInfoMessage
  if (data.internalNotes !== undefined) update.internalNotes = data.internalNotes
  if (data.specialistEmail !== undefined) update.specialistEmail = data.specialistEmail
  if (!Object.keys(update).length) return

  await db.update(pfRequests).set(update).where(eq(pfRequests.id, requestId))
}

export async function addAdminComment(params: {
  requestId: string
  authorId: string
  authorRole: "admin" | "staff"
  body: string
  isInternal: boolean
}): Promise<void> {
  if (!params.body.trim()) throw new Error("Comment body cannot be empty")

  await db.insert(pfComments).values({
    requestId: params.requestId,
    authorId: params.authorId,
    authorRole: params.authorRole,
    body: params.body.trim(),
    isInternal: params.isInternal,
  })

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
  await db.insert(pfRequestMilestones).values({
    requestId: params.requestId,
    title: params.title,
    description: params.description ?? null,
    isClientVisible: params.isClientVisible,
    dueDate: params.dueDate ?? null,
    sortOrder: params.sortOrder ?? 0,
    status: "pending",
  })
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
  }>,
): Promise<void> {
  const update: Record<string, unknown> = {}
  if (data.title !== undefined) update.title = data.title
  if (data.description !== undefined) update.description = data.description
  if (data.isClientVisible !== undefined) update.isClientVisible = data.isClientVisible
  if (data.status !== undefined) update.status = data.status
  if (data.dueDate !== undefined) update.dueDate = data.dueDate
  if (data.completedAt !== undefined) update.completedAt = data.completedAt ? new Date(data.completedAt) : null
  if (!Object.keys(update).length) return

  await db.update(pfRequestMilestones).set(update).where(eq(pfRequestMilestones.id, milestoneId))
}

// ── Internal helpers ──────────────────────────────────────────────────────────

async function notifyOrgMembers(requestId: string, event: string): Promise<void> {
  const [req] = await db
    .select({ orgId: pfRequests.orgId, serviceName: pfRequests.serviceName })
    .from(pfRequests)
    .where(eq(pfRequests.id, requestId))
    .limit(1)

  if (!req) return

  const members = await db
    .select({ userId: pfOrgMembers.userId })
    .from(pfOrgMembers)
    .where(eq(pfOrgMembers.orgId, req.orgId))

  if (!members.length) return

  const titleMap: Record<string, string> = {
    new_comment: `Nuevo mensaje en ${req.serviceName}`,
    waiting_client: `Acción requerida: ${req.serviceName}`,
    completed: `Servicio completado: ${req.serviceName}`,
    review: `En revisión: ${req.serviceName}`,
  }
  const bodyMap: Record<string, string> = {
    new_comment: "El equipo dejó un nuevo mensaje.",
    waiting_client: "Estamos esperando tu respuesta.",
    completed: "Tu servicio ha sido completado.",
    review: "Tu entregable está en revisión final.",
  }

  await db.insert(pfNotifications).values(
    members.map((m) => ({
      userId: m.userId,
      type: event,
      title: titleMap[event] ?? `Actualización en ${req.serviceName}`,
      body: bodyMap[event] ?? "Hay una actualización en tu solicitud.",
      link: `/portal/requests/${requestId}`,
      entityType: "request" as const,
      entityId: requestId,
    })),
  )
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapAdminRequest(
  row: typeof pfRequests.$inferSelect,
  orgName: string | null,
  orgSlug: string | null,
  specialistDisplayName: string | null,
  specialistUserEmail: string | null,
): AdminRequest {
  return {
    id: row.id,
    orgId: row.orgId,
    orderId: row.orderId ?? null,
    orderItemId: row.orderItemId ?? null,
    serviceId: row.serviceId ?? null,
    serviceName: row.serviceName,
    scope: row.scope ?? null,
    status: row.status as AdminRequestStatus,
    priority: (row.priority ?? "normal") as RequestPriority,
    specialistEmail: row.specialistEmail ?? null,
    assignedSpecialistId: row.assignedSpecialistId ?? null,
    estimatedStart: row.estimatedStart ?? null,
    startedAt: row.startedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
    refundedAt: row.refundedAt?.toISOString() ?? null,
    blockedReason: row.blockedReason ?? null,
    waitingInfoMessage: row.waitingInfoMessage ?? null,
    internalNotes: row.internalNotes ?? null,
    createdAt: row.createdAt?.toISOString() ?? "",
    updatedAt: row.updatedAt?.toISOString() ?? "",
    org: orgName ? { id: row.orgId, name: orgName, slug: orgSlug ?? "" } : undefined,
    specialist: specialistDisplayName
      ? { id: row.assignedSpecialistId!, displayName: specialistDisplayName, user: { email: specialistUserEmail ?? "" } }
      : undefined,
  }
}
