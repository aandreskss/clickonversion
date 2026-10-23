import Stripe from "stripe"
import { getServerEnv } from "@/lib/env"
import type { WebhookVerifyParams, WebhookEvent } from "@/types/payments"

function getStripe(): Stripe {
  const key = getServerEnv().stripeSecretKey
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured")
  return new Stripe(key, { apiVersion: "2026-09-30.endive" })
}

/**
 * Verify and parse a Stripe webhook event.
 * rawBody must be the request body as a string (NOT parsed JSON).
 */
export function verifyStripeWebhook(params: WebhookVerifyParams): WebhookEvent {
  const stripe = getStripe()
  const secret = getServerEnv().stripeWebhookSecret
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not configured")

  const event = stripe.webhooks.constructEvent(params.rawBody, params.signature, secret)

  return {
    eventId: event.id,
    eventType: event.type,
    provider: "stripe",
    payload: event as unknown as Record<string, unknown>,
  }
}

/**
 * Map Stripe event types to internal actions.
 * Returns null for unhandled events (caller should return 200 immediately).
 */
export function classifyStripeEvent(eventType: string): StripeEventAction | null {
  const map: Record<string, StripeEventAction> = {
    "checkout.session.completed":        "checkout_completed",
    "checkout.session.expired":          "checkout_expired",
    "payment_intent.succeeded":          "payment_succeeded",
    "payment_intent.payment_failed":     "payment_failed",
    "invoice.paid":                      "invoice_paid",
    "invoice.payment_failed":            "invoice_payment_failed",
    "customer.subscription.created":     "subscription_created",
    "customer.subscription.updated":     "subscription_updated",
    "customer.subscription.deleted":     "subscription_cancelled",
    "charge.refunded":                   "refund_issued",
  }
  return map[eventType] ?? null
}

export type StripeEventAction =
  | "checkout_completed"
  | "checkout_expired"
  | "payment_succeeded"
  | "payment_failed"
  | "invoice_paid"
  | "invoice_payment_failed"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "refund_issued"
