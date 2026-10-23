import { NextRequest, NextResponse } from "next/server"
import { verifyPayPalWebhook, classifyPayPalEvent } from "@/lib/payments/paypal/webhooks"
import { db } from "@/lib/db"
import {
  pfWebhookEvents,
  pfPayments,
  pfSubscriptions,
  pfOrders,
  pfOrderItems,
  pfServicePrices,
  pfBookingRights,
} from "@/lib/db/schema"
import { eq, and, count } from "drizzle-orm"
import { confirmPayment, updateOrderStatus } from "@/lib/orders/service"
import { createBookingRight } from "@/lib/meetings/service"
import { bookingRightGrantedEmail } from "@/lib/email/templates"
import { sendEmail } from "@/lib/email/service"
import { SITE_URL } from "@/lib/env"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Collect verification headers
  const headers: Record<string, string> = {}
  for (const key of [
    "paypal-auth-algo",
    "paypal-cert-url",
    "paypal-transmission-id",
    "paypal-transmission-sig",
    "paypal-transmission-time",
  ]) {
    const val = req.headers.get(key)
    if (val) headers[key] = val
  }

  // 1. Verify webhook signature
  let event
  try {
    event = await verifyPayPalWebhook({ rawBody, signature: "", headers })
  } catch (err) {
    console.error("[webhook/paypal] Verification failed:", err)
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 })
  }

  // 2. Idempotency check
  const [existing] = await db
    .select({ processed: pfWebhookEvents.processed })
    .from(pfWebhookEvents)
    .where(
      and(
        eq(pfWebhookEvents.provider, "paypal"),
        eq(pfWebhookEvents.eventId, event.eventId),
      )
    )
    .limit(1)

  if (existing?.processed) {
    return NextResponse.json({ received: true, skipped: true })
  }

  // 3. Store event
  try {
    await db
      .insert(pfWebhookEvents)
      .values({
        provider:  "paypal",
        eventId:   event.eventId,
        eventType: event.eventType,
        payload:   event.payload as Record<string, unknown>,
        processed: false,
      })
      .onConflictDoNothing()
  } catch (insertError) {
    console.error("[webhook/paypal] Failed to store event:", insertError)
  }

  // 4. Route to handler
  const action = classifyPayPalEvent(event.eventType)
  let processError: string | null = null

  try {
    if (action) {
      await handlePayPalEvent(action, event.payload)
    }
  } catch (err) {
    processError = err instanceof Error ? err.message : String(err)
    console.error("[webhook/paypal] Handler error:", err)
  }

  await db
    .update(pfWebhookEvents)
    .set({
      processed:   processError === null,
      processedAt: processError === null ? new Date() : null,
      error:       processError,
    })
    .where(
      and(
        eq(pfWebhookEvents.provider, "paypal"),
        eq(pfWebhookEvents.eventId, event.eventId),
      )
    )

  return NextResponse.json({ received: true })
}

async function handlePayPalEvent(
  action: NonNullable<ReturnType<typeof classifyPayPalEvent>>,
  payload: Record<string, unknown>
): Promise<void> {
  switch (action) {
    case "checkout_order_completed": {
      const resource  = payload.resource as Record<string, unknown>
      const orderId   = resource.custom_id as string | undefined
      const ppOrderId = resource.id as string | undefined

      if (!orderId || !ppOrderId) return

      // Find capture ID
      const purchaseUnits = resource.purchase_units as Array<{
        payments?: { captures?: Array<{ id: string }> }
      }> | undefined
      const captureId = purchaseUnits?.[0]?.payments?.captures?.[0]?.id

      const [payment] = await db
        .select({ id: pfPayments.id })
        .from(pfPayments)
        .where(
          and(
            eq(pfPayments.orderId, orderId),
            eq(pfPayments.provider, "paypal"),
            eq(pfPayments.status, "pending"),
          )
        )
        .limit(1)

      if (payment) {
        await confirmPayment({
          orderId,
          paymentId:         payment.id,
          providerPaymentId: captureId ?? ppOrderId,
          actor:             "paypal",
        })
        await provisionBookingRights(orderId)
      }
      break
    }

    case "subscription_activated": {
      const resource  = payload.resource as Record<string, unknown>
      const subId     = resource.id as string
      const customId  = resource.custom_id as string | undefined // orderId

      if (customId) {
        await db
          .insert(pfSubscriptions)
          .values({
            orderId:                customId,
            orderItemId:            customId,
            provider:               "paypal",
            providerSubscriptionId: subId,
            status:                 "active",
          })
          .onConflictDoNothing()

        await updateOrderStatus(customId, "paid", "paypal")
        await provisionBookingRights(customId)
      }
      break
    }

    case "subscription_cancelled": {
      const resource = payload.resource as Record<string, unknown>
      const subId    = resource.id as string

      await db
        .update(pfSubscriptions)
        .set({ status: "cancelled", cancelledAt: new Date() })
        .where(
          and(
            eq(pfSubscriptions.provider, "paypal"),
            eq(pfSubscriptions.providerSubscriptionId, subId),
          )
        )
      break
    }

    case "subscription_payment_failed": {
      const resource = payload.resource as Record<string, unknown>
      const subId    = resource.id as string

      await db
        .update(pfSubscriptions)
        .set({ status: "past_due" })
        .where(
          and(
            eq(pfSubscriptions.provider, "paypal"),
            eq(pfSubscriptions.providerSubscriptionId, subId),
          )
        )
      break
    }

    case "payment_sale_refunded": {
      const resource = payload.resource as Record<string, unknown>
      const saleId   = resource.id as string

      await db
        .update(pfPayments)
        .set({ status: "refunded" })
        .where(eq(pfPayments.providerPaymentId, saleId))
      break
    }

    default:
      break
  }
}

async function provisionBookingRights(orderId: string): Promise<void> {
  const [order] = await db
    .select({
      id:          pfOrders.id,
      clientEmail: pfOrders.clientEmail,
      clientName:  pfOrders.clientName,
    })
    .from(pfOrders)
    .where(eq(pfOrders.id, orderId))
    .limit(1)

  if (!order) return

  const items = await db
    .select({
      id:          pfOrderItems.id,
      serviceId:   pfOrderItems.serviceId,
      serviceName: pfOrderItems.serviceName,
      createsBookingRight:    pfServicePrices.createsBookingRight,
      bookingMeetingTypeSlug: pfServicePrices.bookingMeetingTypeSlug,
    })
    .from(pfOrderItems)
    .leftJoin(pfServicePrices, eq(pfOrderItems.priceId, pfServicePrices.id))
    .where(eq(pfOrderItems.orderId, orderId))

  for (const item of items) {
    if (!item.createsBookingRight || !item.bookingMeetingTypeSlug) continue

    // Check if a booking right already exists for this order item (idempotent)
    const [{ existingCount }] = await db
      .select({ existingCount: count() })
      .from(pfBookingRights)
      .where(
        and(
          eq(pfBookingRights.orderId, orderId),
          eq(pfBookingRights.orderItemId, item.id),
        )
      )

    if (existingCount > 0) continue

    const right = await createBookingRight({
      orderId,
      orderItemId:     item.id,
      serviceId:       item.serviceId,
      meetingTypeSlug: item.bookingMeetingTypeSlug,
      clientEmail:     order.clientEmail,
      clientName:      order.clientName,
    })

    const bookingUrl = `${SITE_URL}/book/${right.meetingTypeSlug}?token=${right.token}`
    const expiresAt  = new Date(right.expiresAt).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    })

    const { subject, html } = bookingRightGrantedEmail({
      clientName:  order.clientName,
      meetingName: item.serviceName,
      bookingUrl,
      expiresAt,
    })

    await sendEmail({ to: order.clientEmail, subject, html })
  }
}
