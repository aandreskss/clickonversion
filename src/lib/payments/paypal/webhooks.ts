import { getServerEnv } from "@/lib/env"
import type { WebhookVerifyParams, WebhookEvent } from "@/types/payments"

/**
 * Verify a PayPal webhook using PayPal's signature verification API.
 * PayPal does not use simple HMAC — it requires a round-trip to their API.
 *
 * Headers required (passed via params.headers):
 *   - paypal-auth-algo
 *   - paypal-cert-url
 *   - paypal-transmission-id
 *   - paypal-transmission-sig
 *   - paypal-transmission-time
 */
export async function verifyPayPalWebhook(params: WebhookVerifyParams): Promise<WebhookEvent> {
  const { paypalClientId, paypalClientSecret, paypalWebhookId, paypalMode } = getServerEnv()
  if (!paypalClientId || !paypalClientSecret || !paypalWebhookId) {
    throw new Error("PayPal webhook configuration is missing")
  }

  const baseUrl = paypalMode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

  // Obtain access token
  const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  const { access_token } = (await tokenRes.json()) as { access_token: string }

  const headers = params.headers ?? {}

  // Call PayPal verification endpoint
  const verifyRes = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo:          headers["paypal-auth-algo"],
      cert_url:           headers["paypal-cert-url"],
      transmission_id:    headers["paypal-transmission-id"],
      transmission_sig:   headers["paypal-transmission-sig"],
      transmission_time:  headers["paypal-transmission-time"],
      webhook_id:         paypalWebhookId,
      webhook_event:      JSON.parse(params.rawBody),
    }),
  })

  const result = (await verifyRes.json()) as { verification_status: string }
  if (result.verification_status !== "SUCCESS") {
    throw new Error(`PayPal webhook verification failed: ${result.verification_status}`)
  }

  const payload = JSON.parse(params.rawBody) as Record<string, unknown>
  return {
    eventId:   (payload.id as string) ?? crypto.randomUUID(),
    eventType: (payload.event_type as string) ?? "unknown",
    provider:  "paypal",
    payload,
  }
}

export type PayPalEventAction =
  | "checkout_order_approved"
  | "checkout_order_completed"
  | "subscription_activated"
  | "subscription_cancelled"
  | "subscription_payment_failed"
  | "payment_sale_completed"
  | "payment_sale_refunded"

export function classifyPayPalEvent(eventType: string): PayPalEventAction | null {
  const map: Record<string, PayPalEventAction> = {
    "CHECKOUT.ORDER.APPROVED":              "checkout_order_approved",
    "CHECKOUT.ORDER.COMPLETED":             "checkout_order_completed",
    "BILLING.SUBSCRIPTION.ACTIVATED":       "subscription_activated",
    "BILLING.SUBSCRIPTION.CANCELLED":       "subscription_cancelled",
    "BILLING.SUBSCRIPTION.PAYMENT.FAILED":  "subscription_payment_failed",
    "PAYMENT.SALE.COMPLETED":               "payment_sale_completed",
    "PAYMENT.SALE.REFUNDED":                "payment_sale_refunded",
  }
  return map[eventType] ?? null
}
