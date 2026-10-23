import { db } from "@/lib/db"
import { pfOrders, pfRequests, pfPayments, pfOrderItems, pfMeetings } from "@/lib/db/schema"
import { eq, gte, lte, gt, inArray, notInArray, count, sum, and, isNotNull, lt } from "drizzle-orm"
import type { DashboardMetrics } from "@/types/admin"

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const [
    collectedRows,
    recurringRows,
    newOrdersCount,
    pendingOrdersCount,
    totalOrdersCount,
    pendingReqCount,
    activeReqCount,
    waitingClientCount,
    overdueReqCount,
    upcomingConsultCount,
    topServicesRows,
    paidPaymentsCount,
    pendingPaymentsCount,
    failedPaymentsCount,
  ] = await Promise.allSettled([
    db.select({ totalUsd: pfOrders.totalUsd }).from(pfOrders).where(and(eq(pfOrders.status, "paid"), gte(pfOrders.createdAt, thirtyDaysAgo))),
    db.select({ recurringTotalUsd: pfOrders.recurringTotalUsd }).from(pfOrders).where(and(eq(pfOrders.status, "paid"), gt(pfOrders.recurringTotalUsd, "0"))),
    db.select({ n: count() }).from(pfOrders).where(gte(pfOrders.createdAt, thirtyDaysAgo)),
    db.select({ n: count() }).from(pfOrders).where(inArray(pfOrders.status, ["pending_payment" as any])),
    db.select({ n: count() }).from(pfOrders),
    db.select({ n: count() }).from(pfRequests).where(eq(pfRequests.status, "queued")),
    db.select({ n: count() }).from(pfRequests).where(eq(pfRequests.status, "in_progress")),
    db.select({ n: count() }).from(pfRequests).where(eq(pfRequests.status, "waiting_client")),
    db.select({ n: count() }).from(pfRequests).where(
      and(isNotNull(pfRequests.estimatedStart), lt(pfRequests.estimatedStart, now.toISOString().split("T")[0]),
        notInArray(pfRequests.status, ["completed", "cancelled", "refunded"]))
    ),
    db.select({ n: count() }).from(pfMeetings).where(and(gte(pfMeetings.startTime, now), lte(pfMeetings.startTime, sevenDaysFromNow))),
    db.select({ serviceId: pfOrderItems.serviceId, serviceName: pfOrderItems.serviceName }).from(pfOrderItems).innerJoin(pfOrders, and(eq(pfOrderItems.orderId, pfOrders.id), eq(pfOrders.status, "paid"))),
    db.select({ n: count() }).from(pfPayments).where(eq(pfPayments.status, "succeeded")),
    db.select({ n: count() }).from(pfPayments).where(inArray(pfPayments.status, ["pending", "processing"])),
    db.select({ n: count() }).from(pfPayments).where(eq(pfPayments.status, "failed")),
  ])

  const collected =
    collectedRows.status === "fulfilled"
      ? collectedRows.value.reduce((s, r) => s + Number(r.totalUsd ?? 0), 0)
      : 0

  const recurring =
    recurringRows.status === "fulfilled"
      ? recurringRows.value.reduce((s, r) => s + Number(r.recurringTotalUsd ?? 0), 0)
      : 0

  const n = (r: PromiseSettledResult<Array<{ n: number }>>) =>
    r.status === "fulfilled" ? (r.value[0]?.n ?? 0) : 0

  let topServices: DashboardMetrics["topServices"] = []
  if (topServicesRows.status === "fulfilled") {
    const counts = new Map<string, { serviceId: string; serviceName: string; count: number }>()
    for (const row of topServicesRows.value) {
      const key = row.serviceId ?? row.serviceName
      const existing = counts.get(key)
      if (existing) existing.count++
      else counts.set(key, { serviceId: row.serviceId ?? "", serviceName: row.serviceName ?? "", count: 1 })
    }
    topServices = Array.from(counts.values()).sort((a, b) => b.count - a.count).slice(0, 5)
  }

  return {
    revenue: { collected, recurring, projected: recurring, currency: "usd" },
    orders: { newLast30d: n(newOrdersCount), pending: n(pendingOrdersCount), total: n(totalOrdersCount) },
    requests: { pending: n(pendingReqCount), active: n(activeReqCount), waitingClient: n(waitingClientCount), overdue: n(overdueReqCount) },
    consultations: { upcoming7d: n(upcomingConsultCount) },
    topServices,
    paymentStatus: { paid: n(paidPaymentsCount), pending: n(pendingPaymentsCount), failed: n(failedPaymentsCount) },
  }
}
