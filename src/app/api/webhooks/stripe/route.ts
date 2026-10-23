import { NextRequest, NextResponse } from "next/server"
import { verifyStripeWebhook, classifyStripeEvent } from "@/lib/payments/stripe/webhooks"
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
import { confirmPayment, failPayment, updateOrderStatus } from "@/lib/orders/service"
import { createBookingRight } from "@/lib/meetings/service"
import { bookingRightGrantedEmail } from "@/lib/email/templates"
import { sendEmail } from "@/lib/email/service"
import { SITE_URL } from "@/lib/env"
import type Stripe from "stripe"

/** Stripe requires the raw body, not parsed JSON */
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const rawBody   = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""

  // 1. Verify signature
  let event
  try {
    event = verifyStripeWebhook({ rawBody, signature })
  } catch (err) {
    console.error("[webhook/stripe] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  // 2. Idempotency check — skip already-processed events
  const [existing] = await db
    .select({ processed: pfWebhookEvents.processed })
    .from(pfWebhookEvents)
    .where(
      and(
        eq(pfWebhookEvents.provider, "stripe"),
        eq(pfWebhookEvents.eventId, event.eventId),
      )
    )
    .limit(1)

  if (existing?.processed) {
    return NextResponse.json({ received: true, skipped: true })
  }

  // 3. Store event (before processing — prevents duplicate if handler crashes)
  try {
    await db
      .insert(pfWebhookEvents)
      .values({
        provider:  "stripe",
        eventId:   event.eventId,
        eventType: event.eventType,
        payload:   event.payload as Record<string, unknown>,
        processed: false,
      })
      .onConflictDoNothing()
  } catch (insertError) {
    console.error("[webhook/stripe] Failed to store event:", insertError)
  }

  // 4. Route to handler
  const action = classifyStripeEvent(event.eventType)
  let processError: string | null = null

  try {
    if (action) {
      await handleStripeEvent(action, event.payload as unknown as Stripe.Event)
    }
  } catch (err) {
    processError = err instanceof Error ? err.message : String(err)
    console.error("[webhook/stripe] Handler error:", err)
  }

  // 5. Mark as processed (or record error)
  await db
    .update(pfWebhookEvents)
    .set({
      processed:   processError === null,
      processedAt: processError === null ? new Date() : null,
      error:       processError,
    })
    .where(
      and(
        eq(pfWebhookEvents.provider, "stripe"),
        eq(pfWebhookEvents.eventId, event.eventId),
      )
    )

  // Always return 200 to Stripe (non-200 triggers retries)
  return NextResponse.json({ received: true })
}

async function handleStripeEvent(
  action: ReturnType<typeof classifyStripeEvent>,
  event: Stripe.Event
): Promise<void> {
  switch (action) {
    case "checkout_completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id
      if (!orderId) return

      const [payment] = await db
        .select({ id: pfPayments.id })
        .from(pfPayments)
        .where(
          and(
            eq(pfPayments.orderId, orderId),
            eq(pfPayments.providerCheckoutId, session.id),
          )
        )
        .limit(1)

      if (session.payment_status === "paid" && payment) {
        const piId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id
        const subId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id

        await confirmPayment({
          orderId,
          paymentId:         payment.id,
          providerPaymentId: piId ?? session.id,
          subscriptionId:    subId ?? undefined,
          actor:             "stripe",
        })

        // Register subscription record
        if (subId) {
          await db
            .insert(pfSubscriptions)
            .values({
              orderId,
              orderItemId:            orderId, // will be refined via invoice events
              provider:               "stripe",
              providerSubscriptionId: subId,
              status:                 "active",
            })
            .onConflictDoNothing()
        }

        // Create booking rights for advisory-type order items
        await provisionBookingRights(orderId, session.metadata?.client_email ?? "")
      }
      break
    }

    case "checkout_expired": {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id
      if (!orderId) return
      await updateOrderStatus(orderId, "cancelled", "stripe")

      const [payment] = await db
        .select({ id: pfPayments.id })
        .from(pfPayments)
        .where(
          and(
            eq(pfPayments.orderId, orderId),
            eq(pfPayments.providerCheckoutId, session.id),
          )
        )
        .limit(1)

      if (payment) {
        await failPayment({ paymentId: payment.id, failureCode: "session_expired" })
      }
      break
    }

    case "invoice_payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      // In Stripe API 2026+, subscription reference is accessed via lines or parent
      const invoiceRaw = invoice as unknown as { subscription?: string | { id: string } }
      const subRef = invoiceRaw.subscription
      const subId = typeof subRef === "string" ? subRef : subRef?.id

      if (subId) {
        await db
          .update(pfSubscriptions)
          .set({ status: "past_due" })
          .where(
            and(
              eq(pfSubscriptions.provider, "stripe"),
              eq(pfSubscriptions.providerSubscriptionId, subId),
            )
          )
      }
      break
    }

    case "subscription_cancelled": {
      const sub = event.data.object as Stripe.Subscription
      await db
        .update(pfSubscriptions)
        .set({ status: "cancelled", cancelledAt: new Date() })
        .where(
          and(
            eq(pfSubscriptions.provider, "stripe"),
            eq(pfSubscriptions.providerSubscriptionId, sub.id),
          )
        )
      break
    }

    case "refund_issued": {
      const charge = event.data.object as Stripe.Charge
      if (charge.refunded) {
        // Find payment by PaymentIntent ID
        const piId = typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id

        if (piId) {
          await db
            .update(pfPayments)
            .set({ status: "refunded" })
            .where(eq(pfPayments.providerPaymentId, piId))
        }
      }
      break
    }

    default:
      // Unhandled events are acknowledged but not processed
      break
  }
}

async function provisionBookingRights(orderId: string, _clientEmailHint: string): Promise<void> {
  // Fetch order and items that create booking rights
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
      priceId:     pfOrderItems.priceId,
      serviceName: pfOrderItems.serviceName,
      createsBookingRight:      pfServicePrices.createsBookingRight,
      bookingMeetingTypeSlug:   pfServicePrices.bookingMeetingTypeSlug,
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
