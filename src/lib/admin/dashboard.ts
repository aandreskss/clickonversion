import { createAdminClient } from "@/lib/supabase/server"
import type { DashboardMetrics } from "@/types/admin"

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = createAdminClient()

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const todayIso = now.toISOString()

  const [
    collectedResult,
    recurringResult,
    ordersNewResult,
    ordersPendingResult,
    ordersTotalResult,
    requestsPendingResult,
    requestsActiveResult,
    requestsWaitingClientResult,
    requestsOverdueResult,
    consultationsResult,
    topServicesResult,
    paymentsPaidResult,
    paymentsPendingResult,
    paymentsFailedResult,
  ] = await Promise.allSettled([
    // Revenue: collected last 30d (paid orders)
    supabase
      .from("pf_orders")
      .select("total_usd")
      .eq("status", "paid")
      .gte("created_at", thirtyDaysAgo),

    // Revenue: recurring MRR from active subscriptions
    supabase
      .from("pf_orders")
      .select("recurring_total_usd")
      .eq("status", "paid")
      .gt("recurring_total_usd", 0),

    // Orders: new last 30d
    supabase
      .from("pf_orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo),

    // Orders: pending
    supabase
      .from("pf_orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "pending_payment"]),

    // Orders: total
    supabase.from("pf_orders").select("id", { count: "exact", head: true }),

    // Requests: pending (queued)
    supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "queued"),

    // Requests: active (in_progress)
    supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "in_progress"),

    // Requests: waiting_client
    supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "waiting_client"),

    // Requests: overdue (estimated_start < now AND not terminal)
    supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .not("estimated_start", "is", null)
      .lt("estimated_start", todayIso)
      .not("status", "in", '("completed","cancelled","refunded")'),

    // Consultations upcoming 7 days
    supabase
      .from("pf_bookings")
      .select("id", { count: "exact", head: true })
      .gte("scheduled_at", todayIso)
      .lte("scheduled_at", sevenDaysFromNow),

    // Top services from paid orders
    supabase
      .from("pf_order_items")
      .select("service_id, service_name, pf_orders!inner ( status )")
      .eq("pf_orders.status", "paid"),

    // Payments: paid
    supabase
      .from("pf_payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "succeeded"),

    // Payments: pending
    supabase
      .from("pf_payments")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "processing"]),

    // Payments: failed
    supabase
      .from("pf_payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "failed"),
  ])

  // ── Revenue ──────────────────────────────────────────────────────────────────

  let collected = 0
  if (collectedResult.status === "fulfilled" && collectedResult.value.data) {
    collected = (collectedResult.value.data as Array<{ total_usd: number }>).reduce(
      (sum, o) => sum + (o.total_usd ?? 0),
      0
    )
  }

  let recurring = 0
  if (recurringResult.status === "fulfilled" && recurringResult.value.data) {
    recurring = (recurringResult.value.data as Array<{ recurring_total_usd: number }>).reduce(
      (sum, o) => sum + (o.recurring_total_usd ?? 0),
      0
    )
  }

  // projected = recurring (includes past_due as approximation)
  const projected = recurring

  // ── Orders ───────────────────────────────────────────────────────────────────

  const newLast30d =
    ordersNewResult.status === "fulfilled" ? (ordersNewResult.value.count ?? 0) : 0
  const ordersPending =
    ordersPendingResult.status === "fulfilled" ? (ordersPendingResult.value.count ?? 0) : 0
  const ordersTotal =
    ordersTotalResult.status === "fulfilled" ? (ordersTotalResult.value.count ?? 0) : 0

  // ── Requests ─────────────────────────────────────────────────────────────────

  const reqPending =
    requestsPendingResult.status === "fulfilled" ? (requestsPendingResult.value.count ?? 0) : 0
  const reqActive =
    requestsActiveResult.status === "fulfilled" ? (requestsActiveResult.value.count ?? 0) : 0
  const reqWaitingClient =
    requestsWaitingClientResult.status === "fulfilled"
      ? (requestsWaitingClientResult.value.count ?? 0)
      : 0
  const reqOverdue =
    requestsOverdueResult.status === "fulfilled" ? (requestsOverdueResult.value.count ?? 0) : 0

  // ── Consultations ─────────────────────────────────────────────────────────────

  const upcoming7d =
    consultationsResult.status === "fulfilled" ? (consultationsResult.value.count ?? 0) : 0

  // ── Top Services ──────────────────────────────────────────────────────────────

  type ServiceRow = { service_id: string; service_name: string }
  let topServices: DashboardMetrics["topServices"] = []

  if (topServicesResult.status === "fulfilled" && topServicesResult.value.data) {
    const rows = topServicesResult.value.data as ServiceRow[]
    const counts = new Map<string, { serviceId: string; serviceName: string; count: number }>()

    for (const row of rows) {
      const key = row.service_id ?? row.service_name
      const existing = counts.get(key)
      if (existing) {
        existing.count++
      } else {
        counts.set(key, {
          serviceId: row.service_id ?? "",
          serviceName: row.service_name ?? "",
          count: 1,
        })
      }
    }

    topServices = Array.from(counts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // ── Payment Status ────────────────────────────────────────────────────────────

  const paid =
    paymentsPaidResult.status === "fulfilled" ? (paymentsPaidResult.value.count ?? 0) : 0
  const paymentPending =
    paymentsPendingResult.status === "fulfilled" ? (paymentsPendingResult.value.count ?? 0) : 0
  const failed =
    paymentsFailedResult.status === "fulfilled" ? (paymentsFailedResult.value.count ?? 0) : 0

  return {
    revenue: {
      collected,
      recurring,
      projected,
      currency: "usd",
    },
    orders: {
      newLast30d,
      pending: ordersPending,
      total: ordersTotal,
    },
    requests: {
      pending: reqPending,
      active: reqActive,
      waitingClient: reqWaitingClient,
      overdue: reqOverdue,
    },
    consultations: {
      upcoming7d,
    },
    topServices,
    paymentStatus: {
      paid,
      pending: paymentPending,
      failed,
    },
  }
}
