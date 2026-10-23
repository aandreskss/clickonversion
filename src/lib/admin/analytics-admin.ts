import { db } from "@/lib/db"
import { pfAnalyticsEvents } from "@/lib/db/schema"
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm"
import type { AnalyticsEventName, FunnelMetrics, AnalyticsEvent } from "@/types/admin"

// ── Record Event ──────────────────────────────────────────────────────────────

export async function recordEvent(params: {
  eventName: AnalyticsEventName
  userId?: string
  orgId?: string
  orderId?: string
  serviceId?: string
  sessionId?: string
  properties?: Record<string, unknown>
}): Promise<void> {
  try {
    await db.insert(pfAnalyticsEvents).values({
      eventName: params.eventName,
      userId: params.userId ?? null,
      orgId: params.orgId ?? null,
      orderId: params.orderId ?? null,
      serviceId: params.serviceId ?? null,
      sessionId: params.sessionId ?? null,
      properties: params.properties ?? {},
    })
  } catch (err) {
    // Non-fatal — analytics failure should not break user flows
    console.error(
      "Failed to record analytics event:",
      err instanceof Error ? err.message : String(err)
    )
  }
}

// ── Event Summary ─────────────────────────────────────────────────────────────

export async function getEventSummary(
  eventName: AnalyticsEventName,
  options?: {
    from?: string
    to?: string
    orgId?: string
    serviceId?: string
  }
): Promise<{ count: number; uniqueUsers: number; uniqueSessions: number }> {
  try {
    const conditions = [eq(pfAnalyticsEvents.eventName, eventName)]
    if (options?.from) conditions.push(gte(pfAnalyticsEvents.createdAt, new Date(options.from)))
    if (options?.to) conditions.push(lte(pfAnalyticsEvents.createdAt, new Date(options.to)))
    if (options?.orgId) conditions.push(eq(pfAnalyticsEvents.orgId, options.orgId))
    if (options?.serviceId) conditions.push(eq(pfAnalyticsEvents.serviceId, options.serviceId))

    const rows = await db
      .select({
        userId: pfAnalyticsEvents.userId,
        sessionId: pfAnalyticsEvents.sessionId,
      })
      .from(pfAnalyticsEvents)
      .where(and(...conditions))

    const uniqueUsers = new Set(rows.map((r) => r.userId).filter(Boolean)).size
    const uniqueSessions = new Set(rows.map((r) => r.sessionId).filter(Boolean)).size

    return {
      count: rows.length,
      uniqueUsers,
      uniqueSessions,
    }
  } catch {
    return { count: 0, uniqueUsers: 0, uniqueSessions: 0 }
  }
}

// ── Funnel Metrics ────────────────────────────────────────────────────────────

export async function getFunnelMetrics(options?: {
  from?: string
  to?: string
  serviceId?: string
}): Promise<FunnelMetrics> {
  const eventNames: AnalyticsEventName[] = [
    "service_viewed",
    "add_to_cart",
    "checkout_started",
    "purchase_confirmed",
    "consultation_booked",
    "service_completed",
    "repurchase",
  ]

  // Fetch all event counts in parallel
  const results = await Promise.allSettled(
    eventNames.map((eventName) => {
      const conditions = [eq(pfAnalyticsEvents.eventName, eventName)]
      if (options?.from)
        conditions.push(gte(pfAnalyticsEvents.createdAt, new Date(options.from)))
      if (options?.to)
        conditions.push(lte(pfAnalyticsEvents.createdAt, new Date(options.to)))
      if (options?.serviceId)
        conditions.push(eq(pfAnalyticsEvents.serviceId, options.serviceId))

      return db
        .select({ count: sql<number>`count(*)::int` })
        .from(pfAnalyticsEvents)
        .where(and(...conditions))
    })
  )

  const getCnt = (i: number): number => {
    const result = results[i]
    return result.status === "fulfilled" ? (result.value[0]?.count ?? 0) : 0
  }

  const serviceViewed = getCnt(0)
  const addToCart = getCnt(1)
  const checkoutStarted = getCnt(2)
  const purchaseConfirmed = getCnt(3)
  const consultationBooked = getCnt(4)
  const serviceCompleted = getCnt(5)
  const repurchase = getCnt(6)

  // Conversion rates as percentages (0-100)
  const cartRate = serviceViewed > 0 ? Math.round((addToCart / serviceViewed) * 100) : 0
  const checkoutRate = addToCart > 0 ? Math.round((checkoutStarted / addToCart) * 100) : 0
  const purchaseRate =
    checkoutStarted > 0 ? Math.round((purchaseConfirmed / checkoutStarted) * 100) : 0

  return {
    serviceViewed,
    addToCart,
    checkoutStarted,
    purchaseConfirmed,
    consultationBooked,
    serviceCompleted,
    repurchase,
    cartRate,
    checkoutRate,
    purchaseRate,
  }
}

// ── Recent Events ─────────────────────────────────────────────────────────────

export async function getRecentEvents(options?: {
  eventName?: AnalyticsEventName
  orgId?: string
  serviceId?: string
  userId?: string
  limit?: number
  offset?: number
}): Promise<{ items: AnalyticsEvent[]; total: number }> {
  const limit = options?.limit ?? 50
  const offset = options?.offset ?? 0

  const conditions = []
  if (options?.eventName) conditions.push(eq(pfAnalyticsEvents.eventName, options.eventName))
  if (options?.orgId) conditions.push(eq(pfAnalyticsEvents.orgId, options.orgId))
  if (options?.serviceId) conditions.push(eq(pfAnalyticsEvents.serviceId, options.serviceId))
  if (options?.userId) conditions.push(eq(pfAnalyticsEvents.userId, options.userId))

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(pfAnalyticsEvents)
      .where(whereClause)
      .orderBy(desc(pfAnalyticsEvents.createdAt))
      .limit(limit)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pfAnalyticsEvents)
      .where(whereClause),
  ])

  const items: AnalyticsEvent[] = rows.map((row) => ({
    id: row.id,
    eventName: row.eventName,
    userId: row.userId ?? null,
    orgId: row.orgId ?? null,
    orderId: row.orderId ?? null,
    serviceId: row.serviceId ?? null,
    sessionId: row.sessionId ?? null,
    properties: (row.properties as Record<string, unknown>) ?? {},
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  }))

  return { items, total: countResult[0]?.count ?? 0 }
}

// ── Time-Series ───────────────────────────────────────────────────────────────

export async function getEventTimeSeries(
  eventName: AnalyticsEventName,
  options: {
    from: string
    to: string
    granularity?: "day" | "week" | "month"
  }
): Promise<Array<{ date: string; count: number }>> {
  try {
    const rows = await db
      .select({ createdAt: pfAnalyticsEvents.createdAt })
      .from(pfAnalyticsEvents)
      .where(
        and(
          eq(pfAnalyticsEvents.eventName, eventName),
          gte(pfAnalyticsEvents.createdAt, new Date(options.from)),
          lte(pfAnalyticsEvents.createdAt, new Date(options.to))
        )
      )
      .orderBy(asc(pfAnalyticsEvents.createdAt))

    const granularity = options.granularity ?? "day"
    const buckets = new Map<string, number>()

    for (const row of rows) {
      const d = new Date(
        row.createdAt instanceof Date ? row.createdAt : String(row.createdAt)
      )
      let key: string

      if (granularity === "month") {
        key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
      } else if (granularity === "week") {
        // ISO week start (Monday)
        const dayOfWeek = d.getUTCDay() === 0 ? 6 : d.getUTCDay() - 1
        const weekStart = new Date(d.getTime() - dayOfWeek * 86400000)
        key = weekStart.toISOString().slice(0, 10)
      } else {
        key = d.toISOString().slice(0, 10)
      }

      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))
  } catch {
    return []
  }
}
