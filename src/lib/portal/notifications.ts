import { db } from "@/lib/db"
import { pfNotifications } from "@/lib/db/schema"
import { eq, and, inArray, desc } from "drizzle-orm"
import type { PortalNotification } from "@/types/portal"

export async function getNotifications(userId: string): Promise<PortalNotification[]> {
  const rows = await db
    .select()
    .from(pfNotifications)
    .where(eq(pfNotifications.userId, userId))
    .orderBy(desc(pfNotifications.createdAt))
    .limit(50)

  return rows.map(mapNotification)
}

export async function markNotificationsRead(userId: string, ids: string[]): Promise<void> {
  await db
    .update(pfNotifications)
    .set({ isRead: true })
    .where(and(eq(pfNotifications.userId, userId), inArray(pfNotifications.id, ids)))
}

export async function markAllRead(userId: string): Promise<void> {
  await db
    .update(pfNotifications)
    .set({ isRead: true })
    .where(and(eq(pfNotifications.userId, userId), eq(pfNotifications.isRead, false)))
}

export async function createNotification(params: {
  userId: string
  type: string
  title: string
  body: string
  link?: string
  entityType?: string
  entityId?: string
}): Promise<void> {
  await db.insert(pfNotifications).values({
    userId: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    link: params.link ?? null,
    entityType: params.entityType as any ?? null,
    entityId: params.entityId ?? null,
  })
}

function mapNotification(row: typeof pfNotifications.$inferSelect): PortalNotification {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    title: row.title,
    body: row.body,
    link: row.link ?? null,
    isRead: row.isRead,
    entityType: row.entityType ?? null,
    entityId: row.entityId ?? null,
    createdAt: row.createdAt?.toISOString() ?? "",
  }
}
