import { createAdminClient } from "@/lib/supabase/server"
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
  const supabase = createAdminClient()

  const { error } = await supabase.from("pf_analytics_events").insert({
    event_name: params.eventName,
    user_id: params.userId ?? null,
    org_id: params.orgId ?? null,
    order_id: params.orderId ?? null,
    service_id: params.serviceId ?? null,
    session_id: params.sessionId ?? null,
    properties: params.properties ?? {},
  })

  if (error) {
    // Non-fatal — analytics failure should not break user flows
    console.error("Failed to record analytics event:", error.message)
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
  const supabase = createAdminClient()

  let query = supabase
    .from("pf_analytics_events")
    .select("id, user_id, session_id")
    .eq("event_name", eventName)

  if (options?.from) query = query.gte("created_at", options.from)
  if (options?.to) query = query.lte("created_at", options.to)
  if (options?.orgId) query = query.eq("org_id", options.orgId)
  if (options?.serviceId) query = query.eq("service_id", options.serviceId)

  const { data, error } = await query

  if (error) return { count: 0, uniqueUsers: 0, uniqueSessions: 0 }

  const rows = data ?? []
  const uniqueUsers = new Set(rows.map((r) => r.user_id).filter(Boolean)).size
  const uniqueSessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size

  return {
    count: rows.length,
    uniqueUsers,
    uniqueSessions,
  }
}

// ── Funnel Metrics ────────────────────────────────────────────────────────────

export async function getFunnelMetrics(options?: {
  from?: string
  to?: string
  serviceId?: string
}): Promise<FunnelMetrics> {
  const supabase = createAdminClient()

  const eventNames: AnalyticsEventName[] = [
    "service_viewed",
    "add_to_cart",
    "checkout_started",
    "purchase_confirmed",
    "consultation_booked",
    "service_completed",
    "repurchase",
  ]

  // Fetch all events in parallel
  const results = await Promise.allSettled(
    eventNames.map((eventName) => {
      let query = supabase
        .from("pf_analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_name", eventName)

      if (options?.from) query = query.gte("created_at", options.from)
      if (options?.to) query = query.lte("created_at", options.to)
      if (options?.serviceId) query = query.eq("service_id", options.serviceId)

      return query
    })
  )

  const getCnt = (i: number): number => {
    const result = results[i]
    return result.status === "fulfilled" ? (result.value.count ?? 0) : 0
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
  const supabase = createAdminClient()

  const limit = options?.limit ?? 50
  const offset = options?.offset ?? 0

  let query = supabase
    .from("pf_analytics_events")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (options?.eventName) query = query.eq("event_name", options.eventName)
  if (options?.orgId) query = query.eq("org_id", options.orgId)
  if (options?.serviceId) query = query.eq("service_id", options.serviceId)
  if (options?.userId) query = query.eq("user_id", options.userId)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  const items: AnalyticsEvent[] = (data ?? []).map((row) => ({
    id: row.id as string,
    eventName: row.event_name as string,
    userId: (row.user_id as string | null) ?? null,
    orgId: (row.org_id as string | null) ?? null,
    orderId: (row.order_id as string | null) ?? null,
    serviceId: (row.service_id as string | null) ?? null,
    sessionId: (row.session_id as string | null) ?? null,
    properties: (row.properties as Record<string, unknown>) ?? {},
    createdAt: row.created_at as string,
  }))

  return { items, total: count ?? 0 }
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
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pf_analytics_events")
    .select("created_at")
    .eq("event_name", eventName)
    .gte("created_at", options.from)
    .lte("created_at", options.to)
    .order("created_at", { ascending: true })

  if (error) return []

  const rows = data ?? []
  const granularity = options.granularity ?? "day"
  const buckets = new Map<string, number>()

  for (const row of rows) {
    const d = new Date(row.created_at as string)
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
}
