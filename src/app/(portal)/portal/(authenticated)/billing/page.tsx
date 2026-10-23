import type { Metadata } from "next"
import { getPortalSession } from "@/lib/portal/auth"
import { db } from "@/lib/db"
import { pfOrders, pfOrderItems, pfPayments, pfSubscriptions } from "@/lib/db/schema"
import { eq, and, inArray, desc } from "drizzle-orm"

export const metadata: Metadata = { title: "Billing — Portal" }

export default async function BillingPage() {
  const session = await getPortalSession()
  if (!session) return null

  const [rawOrders, rawSubscriptions] = await Promise.all([
    db
      .select()
      .from(pfOrders)
      .where(
        and(
          eq(pfOrders.clientEmail, session.email),
          inArray(pfOrders.status, ["paid", "pending_payment"] as const),
        )
      )
      .orderBy(desc(pfOrders.createdAt)),
    db
      .select()
      .from(pfSubscriptions)
      .where(inArray(pfSubscriptions.status, ["active", "past_due", "cancelled"] as const))
      .orderBy(desc(pfSubscriptions.createdAt)),
  ])

  // Load related items and payments for each order
  const orderIds = rawOrders.map((o) => o.id)
  const [allItems, allPayments, subOrders] = await Promise.all([
    orderIds.length
      ? db.select().from(pfOrderItems).where(inArray(pfOrderItems.orderId, orderIds))
      : Promise.resolve([]),
    orderIds.length
      ? db.select().from(pfPayments).where(inArray(pfPayments.orderId, orderIds)).orderBy(desc(pfPayments.createdAt))
      : Promise.resolve([]),
    rawSubscriptions.length
      ? db.select({ id: pfOrders.id, orderNumber: pfOrders.orderNumber })
          .from(pfOrders)
          .where(inArray(pfOrders.id, rawSubscriptions.map((s) => s.orderId)))
      : Promise.resolve([]),
  ])

  const orders = rawOrders.map((o) => ({
    ...o,
    items: allItems.filter((i) => i.orderId === o.id),
    payments: allPayments.filter((p) => p.orderId === o.id),
  }))

  const subOrderMap = new Map(subOrders.map((o) => [o.id, o.orderNumber]))
  const subscriptions = rawSubscriptions.map((s) => ({
    ...s,
    orderNumber: subOrderMap.get(s.orderId) ?? "—",
  }))

  const paymentStatusDot: Record<string, string> = {
    succeeded: "bg-[#22C55E]",
    pending:   "bg-[#F59E0B]",
    failed:    "bg-[#EF4444]",
    refunded:  "bg-[#8A9099]",
  }

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-[#546072] mt-1">Your orders, payments and subscriptions.</p>
      </div>

      {/* Active subscriptions */}
      {subscriptions.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-white mb-4">Active subscriptions</h2>
          <div className="space-y-2">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-[#14171A]">
                <div>
                  <p className="text-sm font-medium text-white">Order {sub.orderNumber}</p>
                  <p className="text-xs text-[#546072] mt-0.5 capitalize">
                    {sub.provider} · {sub.status}
                  </p>
                </div>
                <div className="text-right">
                  {sub.currentPeriodEnd && (
                    <p className="text-xs text-[#546072]">
                      Renews {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                  {sub.cancelledAt && (
                    <p className="text-xs text-[#EF4444]">
                      Cancelled {new Date(sub.cancelledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Order history */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Order history</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-[#546072]">No orders found.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const latestPayment = order.payments[0]

              return (
                <div key={order.id} className="rounded-xl border border-white/8 bg-[#14171A] overflow-hidden">
                  {/* Order header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
                    <div>
                      <p className="text-sm font-semibold text-white">{order.orderNumber}</p>
                      <p className="text-xs text-[#546072] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-white">${Number(order.totalUsd).toFixed(2)}</p>
                      {latestPayment && (
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${paymentStatusDot[latestPayment.status] ?? "bg-white/20"}`} />
                          <span className="text-xs text-[#546072] capitalize">{latestPayment.status}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Line items */}
                  <div className="divide-y divide-white/4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                        <span className="text-[#8A9099]">{item.serviceName}</span>
                        <span className="text-white">${Number(item.lineTotalUsd).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
