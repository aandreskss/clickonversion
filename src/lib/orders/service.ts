import { db } from "@/lib/db"
import { pfOrders, pfOrderItems, pfQuotes, pfPayments, pfPaymentAudit } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import type { OrderRecord } from "@/types/payments"
import type { ValidatedItem } from "@/lib/catalog/queries"
import { calculateOrderTotals, splitValidatedItems } from "./splits"

export async function createOrder(params: {
  clientEmail: string
  clientName: string
  clientCompany?: string
  validatedItems: ValidatedItem[]
}): Promise<OrderRecord> {
  const { clientEmail, clientName, clientCompany, validatedItems } = params
  const totals = calculateOrderTotals(validatedItems)

  const snapshot = validatedItems.map((i) => ({
    serviceId: i.serviceId,
    priceId: i.priceId,
    serviceName: i.serviceName,
    priceTierName: i.priceTierName,
    priceType: i.priceType,
    unitPriceUsd: i.unitPriceUsd,
    quantity: i.quantity,
    lineTotalUsd: i.lineTotalUsd,
  }))

  const { quotes } = splitValidatedItems(validatedItems)
  const initialStatus = totals.hasPayableItems ? "pending_payment" : "quote_pending"

  const orderNumber = `CK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Date.now()).slice(-4)}`

  const [order] = await db
    .insert(pfOrders)
    .values({
      orderNumber,
      clientEmail,
      clientName,
      clientCompany: clientCompany ?? null,
      status: initialStatus as any,
      currency: "USD",
      subtotalUsd: String(totals.subtotalUsd),
      taxUsd: String(totals.taxUsd),
      totalUsd: String(totals.totalUsd),
      recurringTotalUsd: String(totals.recurringTotalUsd),
      itemsSnapshot: snapshot,
    })
    .returning()

  await db.insert(pfOrderItems).values(
    validatedItems.map((i) => ({
      orderId: order.id,
      serviceId: i.serviceId,
      priceId: i.priceId,
      quantity: String(i.quantity),
      unitPriceUsd: String(i.unitPriceUsd),
      lineTotalUsd: String(i.lineTotalUsd),
      priceType: i.priceType as any,
      billingPeriodVal: (i.billingPeriod as any) ?? null,
      serviceName: i.serviceName,
      priceTierName: i.priceTierName,
    })),
  )

  if (quotes.length > 0) {
    await db.insert(pfQuotes).values({
      orderId: order.id,
      clientEmail,
      clientName,
      clientCompany: clientCompany ?? null,
      servicesRequested: quotes.map((q) => ({
        service_id: q.serviceId,
        price_id: q.priceId,
        name: q.serviceName,
        tier: q.priceTierName,
      })),
    })
  }

  await db.insert(pfPaymentAudit).values({
    entityType: "order",
    entityId: order.id,
    action: "created",
    actor: "system",
    newState: { status: initialStatus, total_usd: totals.totalUsd },
  })

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    clientEmail: order.clientEmail,
    clientName: order.clientName,
    status: order.status,
    subtotalUsd: Number(order.subtotalUsd),
    taxUsd: Number(order.taxUsd),
    totalUsd: Number(order.totalUsd),
    recurringTotalUsd: Number(order.recurringTotalUsd),
    createdAt: order.createdAt?.toISOString() ?? "",
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  actor = "system",
): Promise<void> {
  const [prev] = await db.select({ status: pfOrders.status }).from(pfOrders).where(eq(pfOrders.id, orderId)).limit(1)

  await db.update(pfOrders).set({ status: status as any }).where(eq(pfOrders.id, orderId))

  await db.insert(pfPaymentAudit).values({
    entityType: "order",
    entityId: orderId,
    action: "status_changed",
    actor,
    previousState: { status: prev?.status },
    newState: { status },
  })
}

export async function createPaymentRecord(params: {
  orderId: string
  provider: string
  providerCheckoutId: string
  amountUsd: number
  paymentType: string
}): Promise<string> {
  const [payment] = await db
    .insert(pfPayments)
    .values({
      orderId: params.orderId,
      provider: params.provider as any,
      providerCheckoutId: params.providerCheckoutId,
      amountUsd: String(params.amountUsd),
      currency: "USD",
      status: "pending",
      paymentType: params.paymentType as any,
    })
    .returning({ id: pfPayments.id })

  return payment.id
}

export async function confirmPayment(params: {
  orderId: string
  paymentId: string
  providerPaymentId: string
  subscriptionId?: string
  actor: string
}): Promise<void> {
  await db
    .update(pfPayments)
    .set({ status: "succeeded", providerPaymentId: params.providerPaymentId })
    .where(eq(pfPayments.id, params.paymentId))

  await updateOrderStatus(params.orderId, "paid", params.actor)

  if (params.subscriptionId) {
    await db.insert(pfPaymentAudit).values({
      entityType: "subscription",
      entityId: params.orderId,
      action: "subscription_created",
      actor: params.actor,
      newState: { subscription_id: params.subscriptionId },
    })
  }
}

export async function failPayment(params: {
  paymentId: string
  failureCode?: string
  failureMessage?: string
}): Promise<void> {
  await db
    .update(pfPayments)
    .set({
      status: "failed",
      failureCode: params.failureCode ?? null,
      failureMessage: params.failureMessage ?? null,
    })
    .where(eq(pfPayments.id, params.paymentId))
}
