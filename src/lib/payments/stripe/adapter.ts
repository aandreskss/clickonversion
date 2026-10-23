import Stripe from "stripe"
import { getServerEnv } from "@/lib/env"
import type {
  IPaymentProvider,
  CreateCheckoutParams,
  CheckoutResult,
  PaymentStatusResult,
  RefundParams,
  RefundResult,
  SubscriptionResult,
} from "@/types/payments"

function getStripe(): Stripe {
  const key = getServerEnv().stripeSecretKey
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured")
  return new Stripe(key, { apiVersion: "2026-09-30.endive" })
}

/**
 * Mixed-cart strategy with Stripe:
 *   - ONE_TIME only  → Checkout Session (mode: "payment")
 *   - RECURRING only → Checkout Session (mode: "subscription")
 *   - MIXED          → Create customer first, add invoice items for one-time charges,
 *                       then Checkout Session (mode: "subscription"). Stripe includes
 *                       the pending invoice items in the subscription's first invoice.
 *
 * This means the user pays one invoice that covers both one-time and subscription items.
 */
export class StripeAdapter implements IPaymentProvider {
  readonly name = "stripe" as const

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const stripe = getStripe()
    const { orderId, clientEmail, clientName, oneTimeItems, recurringItems, successUrl, cancelUrl, metadata } = params

    const hasSubs  = recurringItems.length > 0
    const hasOnce  = oneTimeItems.length > 0
    const isMixed  = hasSubs && hasOnce

    const baseMetadata: Record<string, string> = {
      order_id: orderId,
      client_name: clientName,
      ...metadata,
    }

    let session: Stripe.Checkout.Session

    if (!hasSubs) {
      // ── Pure one-time payment ─────────────────────────────────────────────
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: clientEmail,
        line_items: oneTimeItems.map((item) => ({
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.unitAmountUsd * 100),
            product_data: { name: item.name },
          },
          quantity: item.quantity,
        })),
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: baseMetadata,
        payment_intent_data: { metadata: baseMetadata },
      })
    } else {
      // ── Subscription (possibly mixed) ─────────────────────────────────────
      let customerId = params.stripeCustomerId

      if (!customerId) {
        // Create or retrieve customer
        const existingList = await stripe.customers.list({ email: clientEmail, limit: 1 })
        if (existingList.data.length > 0) {
          customerId = existingList.data[0].id
        } else {
          const customer = await stripe.customers.create({
            email: clientEmail,
            name: clientName,
            metadata: baseMetadata,
          })
          customerId = customer.id
        }
      }

      // Attach one-time items as pending invoice items (included in first subscription invoice)
      if (isMixed) {
        await Promise.all(
          oneTimeItems.flatMap((item) =>
            Array.from({ length: item.quantity }, () =>
              stripe.invoiceItems.create({
                customer: customerId!,
                currency: "usd",
                amount: Math.round(item.unitAmountUsd * 100),
                description: item.name,
                metadata: baseMetadata,
              })
            )
          )
        )
      }

      // Build subscription line items — prefer stripePriceId if already created in Stripe
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = recurringItems.map((item) => {
        if (item.stripePriceId) {
          return { price: item.stripePriceId, quantity: item.quantity }
        }
        return {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.unitAmountUsd * 100),
            recurring: {
              interval: item.billingPeriod === "annual"    ? "year"
                      : item.billingPeriod === "quarterly" ? "month"  // 3-month approximation
                      : "month",
              interval_count: item.billingPeriod === "quarterly" ? 3 : 1,
            },
            product_data: { name: item.name },
          },
          quantity: item.quantity,
        }
      })

      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: lineItems,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: baseMetadata,
        subscription_data: { metadata: baseMetadata },
      })
    }

    return {
      checkoutId: session.id,
      checkoutUrl: session.url!,
      provider: "stripe",
    }
  }

  async getCheckoutStatus(sessionId: string): Promise<PaymentStatusResult> {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "subscription"],
    })

    const stripeStatus = session.payment_status
    const status =
      stripeStatus === "paid"      ? "succeeded"
      : stripeStatus === "unpaid"  ? "pending"
      : "failed"

    const amountUsd = (session.amount_total ?? 0) / 100

    const paymentIntent =
      session.payment_intent && typeof session.payment_intent !== "string"
        ? session.payment_intent
        : null

    const subscription =
      session.subscription && typeof session.subscription !== "string"
        ? session.subscription
        : null

    return {
      checkoutId: sessionId,
      status,
      amountUsd,
      providerPaymentId: paymentIntent?.id,
      subscriptionId:    subscription?.id,
    }
  }

  async issueRefund(params: RefundParams): Promise<RefundResult> {
    const stripe = getStripe()
    const refund = await stripe.refunds.create({
      payment_intent: params.providerPaymentId,
      amount: Math.round(params.amountUsd * 100),
      reason: "requested_by_customer",
    })

    return {
      refundId: refund.id,
      status: refund.status === "succeeded" ? "succeeded" : refund.status === "failed" ? "failed" : "pending",
      amountUsd: (refund.amount ?? 0) / 100,
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const stripe = getStripe()
    await stripe.subscriptions.cancel(subscriptionId)
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionResult> {
    const stripe = getStripe()
    const sub = await stripe.subscriptions.retrieve(subscriptionId)

    const statusMap: Record<string, SubscriptionResult["status"]> = {
      trialing:  "trialing",
      active:    "active",
      past_due:  "past_due",
      canceled:  "cancelled",
      unpaid:    "unpaid",
      paused:    "paused",
    }

    // current_period_end lives on the subscription's items in newer API versions
    const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end

    return {
      subscriptionId,
      status: statusMap[sub.status] ?? "active",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
    }
  }
}
