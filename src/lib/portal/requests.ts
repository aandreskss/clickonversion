import { db } from "@/lib/db"
import { pfRequests, pfRequestMilestones, pfComments, pfPlatformUsers, pfNotifications, users } from "@/lib/db/schema"
import { eq, and, desc, asc } from "drizzle-orm"
import type { PortalRequest, RequestMilestone, Comment } from "@/types/portal"

// ── Requests ─────────────────────────────────────────────────────────────────

export async function getRequests(orgId: string): Promise<PortalRequest[]> {
  const rows = await db
    .select()
    .from(pfRequests)
    .where(eq(pfRequests.orgId, orgId))
    .orderBy(desc(pfRequests.createdAt))

  return rows.map(mapRequest)
}

export async function getRequest(id: string, orgId: string): Promise<PortalRequest | null> {
  const [row] = await db
    .select()
    .from(pfRequests)
    .where(and(eq(pfRequests.id, id), eq(pfRequests.orgId, orgId)))
    .limit(1)

  return row ? mapRequest(row) : null
}

// ── Milestones ────────────────────────────────────────────────────────────────

export async function getMilestones(requestId: string, orgId: string): Promise<RequestMilestone[]> {
  const request = await getRequest(requestId, orgId)
  if (!request) return []

  const rows = await db
    .select()
    .from(pfRequestMilestones)
    .where(and(eq(pfRequestMilestones.requestId, requestId), eq(pfRequestMilestones.isClientVisible, true)))
    .orderBy(asc(pfRequestMilestones.sortOrder))

  return rows.map(mapMilestone)
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function getComments(requestId: string, orgId: string): Promise<Comment[]> {
  const request = await getRequest(requestId, orgId)
  if (!request) return []

  const rows = await db
    .select({
      comment: pfComments,
      authorName: pfPlatformUsers.displayName,
      authorEmail: users.email,
    })
    .from(pfComments)
    .leftJoin(pfPlatformUsers, eq(pfComments.authorId, pfPlatformUsers.id))
    .leftJoin(users, eq(pfPlatformUsers.id, users.id))
    .where(and(eq(pfComments.requestId, requestId), eq(pfComments.isInternal, false)))
    .orderBy(asc(pfComments.createdAt))

  return rows.map(({ comment, authorName, authorEmail }) => ({
    ...mapComment(comment),
    author: authorEmail
      ? { id: comment.authorId, email: authorEmail, fullName: authorName ?? null, avatarUrl: null }
      : undefined,
  }))
}

export async function addComment(params: {
  requestId: string
  orgId: string
  authorId: string
  authorRole: "client" | "staff" | "admin"
  body: string
}): Promise<Comment> {
  const request = await getRequest(params.requestId, params.orgId)
  if (!request) throw new Error("REQUEST_NOT_FOUND")

  const [comment] = await db
    .insert(pfComments)
    .values({
      requestId: params.requestId,
      authorId: params.authorId,
      authorRole: params.authorRole,
      body: params.body,
      isInternal: false,
    })
    .returning()

  // Notify specialist on new client comment
  if (request.specialistEmail && params.authorRole === "client") {
    const specialist = await db.query.pfPlatformUsers.findFirst({
      where: (t, { eq }) => eq(t.id, params.authorId),
    })
    const specialistUser = await db.query.users.findFirst({
      where: (u, { eq: eqFn }) => eqFn(u.email, request.specialistEmail!),
    })
    if (specialistUser && specialistUser.id !== params.authorId) {
      await db.insert(pfNotifications).values({
        userId: specialistUser.id,
        type: "new_comment",
        title: "New message",
        body: `A client left a message on "${request.serviceName}"`,
        link: `/portal/requests/${params.requestId}`,
        entityType: "request",
        entityId: params.requestId,
      })
    }
  }

  return mapComment(comment)
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapRequest(row: typeof pfRequests.$inferSelect): PortalRequest {
  return {
    id: row.id,
    orgId: row.orgId,
    orderId: row.orderId ?? null,
    orderItemId: row.orderItemId ?? null,
    serviceId: row.serviceId ?? null,
    serviceName: row.serviceName,
    scope: row.scope ?? null,
    status: row.status as PortalRequest["status"],
    specialistEmail: row.specialistEmail ?? null,
    estimatedStart: row.estimatedStart ?? null,
    startedAt: row.startedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt?.toISOString() ?? "",
    updatedAt: row.updatedAt?.toISOString() ?? "",
  }
}

function mapMilestone(row: typeof pfRequestMilestones.$inferSelect): RequestMilestone {
  return {
    id: row.id,
    requestId: row.requestId,
    title: row.title,
    description: row.description ?? null,
    isClientVisible: row.isClientVisible,
    status: row.status as RequestMilestone["status"],
    dueDate: row.dueDate ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    sortOrder: row.sortOrder,
  }
}

function mapComment(row: typeof pfComments.$inferSelect): Comment {
  return {
    id: row.id,
    requestId: row.requestId,
    authorId: row.authorId,
    authorRole: row.authorRole as Comment["authorRole"],
    body: row.body,
    isInternal: row.isInternal,
    createdAt: row.createdAt?.toISOString() ?? "",
    updatedAt: row.updatedAt?.toISOString() ?? "",
  }
}
