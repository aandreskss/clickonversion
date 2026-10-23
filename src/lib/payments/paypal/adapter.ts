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

/**
 * PayPal REST API v2 adapter — native fetch, no deprecated SDK.
 *
 * IMPORTANT LIMITATIONS vs Stripe:
 *   - PayPal Orders API and Subscriptions API are separate flows.
 *     You cannot mix a one-time payment and a subscription in a single PayPal checkout.
 *   - Mixed carts with PayPal require separate checkout sessions (or use Stripe instead).
 *   - PayPal subscriptions require pre-created billing Plans.
 *     If a plan is not pre-registered, this adapter creates it inline (slower).
 *   - PayPal webhook verification calls PayPal's verification API (not HMAC like Stripe).
 */
export class PayPalAdapter implements IPaymentProvider {
  readonly name = "paypal" as const

  private get baseUrl(): string {
    const env = getServerEnv()
    return env.paypalMode === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com"
  }

  private async getAccessToken(): Promise<string> {
    const { paypalClientId, paypalClientSecret } = getServerEnv()
    if (!paypalClientId || !paypalClientSecret) {
      throw new Error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET is not configured")
    }

    const credentials = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")
    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      // Tokens are valid 32400s — next.js fetch cache handles reuse
      next: { revalidate: 30000 },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`PayPal auth failed: ${text}`)
    }

    const data = (await res.json()) as { access_token: string }
    return data.access_token
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await this.getAccessToken()
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": crypto.randomUUID(), // idempotency key
        ...(init?.headers ?? {}),
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`PayPal API error ${res.status}: ${text}`)
    }
    return res.json() as Promise<T>
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const { orderId, clientEmail, oneTimeItems, recurringItems, successUrl, cancelUrl } = params

    const hasSubs = recurringItems.length > 0
    const hasOnce = oneTimeItems.length > 0

    if (hasSubs && hasOnce) {
      throw new Error(
        "PayPal does not support mixed one-time + subscription carts in a single checkout. " +
        "Use Stripe for mixed carts, or split into separate PayPal sessions."
      )
    }

    if (hasSubs) {
      return this.createSubscriptionCheckout(params)
    }

    // ── One-time payment via Orders API v2 ───────────────────────────────────
    const purchaseUnits = [
      {
        reference_id: orderId,
        description: `ClicKonversion order ${orderId}`,
        amount: {
          currency_code: "USD",
          value: oneTimeItems
            .reduce((sum, i) => sum + i.unitAmountUsd * i.quantity, 0)
            .toFixed(2),
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: oneTimeItems
                .reduce((sum, i) => sum + i.unitAmountUsd * i.quantity, 0)
                .toFixed(2),
            },
          },
        },
        items: oneTimeItems.map((item) => ({
          name: item.name.slice(0, 127),
          quantity: String(item.quantity),
          unit_amount: { currency_code: "USD", value: item.unitAmountUsd.toFixed(2) },
          category: "DIGITAL_GOODS",
        })),
        custom_id: orderId,
      },
    ]

    const order = await this.request<PayPalOrder>("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: purchaseUnits,
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "ClicKonversion",
              locale: "en-US",
              user_action: "PAY_NOW",
              return_url: `${successUrl}?paypal_order_id={id}&token={token}`,
              cancel_url: cancelUrl,
            },
          },
        },
        application_context: {
          return_url: `${successUrl}?paypal_order_id=PAYPAL_ORDER_ID`,
          cancel_url: cancelUrl,
          payer: { email_address: clientEmail },
        },
      }),
    })

    const approveLink = order.links.find((l: PayPalLink) => l.rel === "payer-action")
    if (!approveLink) throw new Error("PayPal: no approval URL in response")

    return {
      checkoutId: order.id,
      checkoutUrl: approveLink.href,
      provider: "paypal",
    }
  }

  private async createSubscriptionCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const { orderId, recurringItems, successUrl, cancelUrl } = params

    // PayPal only supports ONE subscription per approval flow.
    // For multiple recurring items, create multiple subscriptions (requires multiple approvals).
    // For simplicity: take the first recurring item; additional items throw a warning.
    if (recurringItems.length > 1) {
      throw new Error(
        "PayPal supports only one subscription per checkout flow. " +
        "Use Stripe for carts with multiple recurring services."
      )
    }

    const item = recurringItems[0]

    // If a PayPal Plan ID already exists in the DB, use it. Otherwise create inline.
    let planId = item.paypalPlanId
    if (!planId) {
      planId = await this.createInlinePlan(item.name, item.unitAmountUsd, item.billingPeriod)
    }

    const subscription = await this.request<PayPalSubscription>("/v1/billing/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        plan_id: planId,
        custom_id: orderId,
        application_context: {
          brand_name: "ClicKonversion",
          locale: "en-US",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${successUrl}?subscription_id=SUBSCRIPTION_ID`,
          cancel_url: cancelUrl,
        },
      }),
    })

    const approveLink = subscription.links.find((l: PayPalLink) => l.rel === "approve")
    if (!approveLink) throw new Error("PayPal: no subscription approval URL in response")

    return {
      checkoutId: subscription.id,
      checkoutUrl: approveLink.href,
      provider: "paypal",
      paypalSubscriptionIds: [subscription.id],
    }
  }

  private async createInlinePlan(
    name: string,
    priceUsd: number,
    period: string | null
  ): Promise<string> {
    const intervalUnit = period === "annual" ? "YEAR" : "MONTH"
    const intervalCount = period === "quarterly" ? 3 : 1

    // Create a product first
    const product = await this.request<{ id: string }>("/v1/catalogs/products", {
      method: "POST",
      body: JSON.stringify({
        name: name.slice(0, 127),
        type: "SERVICE",
        category: "SOFTWARE",
      }),
    })

    const plan = await this.request<{ id: string }>("/v1/billing/plans", {
      method: "POST",
      body: JSON.stringify({
        product_id: product.id,
        name: name.slice(0, 127),
        status: "ACTIVE",
        billing_cycles: [
          {
            frequency: { interval_unit: intervalUnit, interval_count: intervalCount },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: { value: priceUsd.toFixed(2), currency_code: "USD" },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      }),
    })

    return plan.id
  }

  async getCheckoutStatus(checkoutId: string): Promise<PaymentStatusResult> {
    // Try as a one-time order first
    try {
      const order = await this.request<PayPalOrder>(`/v2/checkout/orders/${checkoutId}`)
      const statusMap: Record<string, PaymentStatusResult["status"]> = {
        COMPLETED:        "succeeded",
        APPROVED:         "processing",
        CREATED:          "pending",
        VOIDED:           "cancelled",
        PAYER_ACTION_REQUIRED: "pending",
      }
      const amount = parseFloat(
        order.purchase_units?.[0]?.amount?.value ?? "0"
      )
      return {
        checkoutId,
        status: statusMap[order.status] ?? "pending",
        amountUsd: amount,
        providerPaymentId: order.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      }
    } catch {
      // Fall back to subscription
      const sub = await this.request<PayPalSubscription>(`/v1/billing/subscriptions/${checkoutId}`)
      const statusMap: Record<string, PaymentStatusResult["status"]> = {
        ACTIVE:    "succeeded",
        APPROVED:  "processing",
        SUSPENDED: "pending",
        CANCELLED: "cancelled",
        EXPIRED:   "cancelled",
      }
      return {
        checkoutId,
        status: statusMap[sub.status] ?? "pending",
        amountUsd: 0,
        subscriptionId: sub.id,
      }
    }
  }

  async issueRefund(params: RefundParams): Promise<RefundResult> {
    const refund = await this.request<{ id: string; status: string; amount?: { value: string } }>(
      `/v2/payments/captures/${params.providerPaymentId}/refund`,
      {
        method: "POST",
        body: JSON.stringify({
          amount: { value: params.amountUsd.toFixed(2), currency_code: "USD" },
          note_to_payer: params.reason ?? "Refund issued by ClicKonversion",
        }),
      }
    )

    return {
      refundId: refund.id,
      status: refund.status === "COMPLETED" ? "succeeded" : "pending",
      amountUsd: parseFloat(refund.amount?.value ?? String(params.amountUsd)),
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.request(`/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason: "Cancelled by client request" }),
    })
  }

  async getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionResult> {
    const sub = await this.request<PayPalSubscription>(
      `/v1/billing/subscriptions/${subscriptionId}`
    )

    const statusMap: Record<string, SubscriptionResult["status"]> = {
      ACTIVE:    "active",
      SUSPENDED: "past_due",
      CANCELLED: "cancelled",
      EXPIRED:   "cancelled",
      APPROVAL_PENDING: "trialing",
      APPROVED:  "trialing",
    }

    return {
      subscriptionId,
      status: statusMap[sub.status] ?? "active",
      currentPeriodEnd: sub.billing_info?.next_billing_time
        ? new Date(sub.billing_info.next_billing_time)
        : undefined,
    }
  }

  /** Capture a PayPal Order (called after user approves on PayPal side) */
  async captureOrder(paypalOrderId: string): Promise<string> {
    const result = await this.request<{ purchase_units: Array<{ payments: { captures: Array<{ id: string }> } }> }>(
      `/v2/checkout/orders/${paypalOrderId}/capture`,
      { method: "POST", body: "{}" }
    )
    return result.purchase_units[0]?.payments?.captures[0]?.id ?? paypalOrderId
  }
}

// ── PayPal API response types (minimal, not exhaustive) ──────────────────────

interface PayPalLink { rel: string; href: string; method?: string }

interface PayPalOrder {
  id: string
  status: string
  links: PayPalLink[]
  purchase_units?: Array<{
    amount?: { value?: string }
    payments?: { captures?: Array<{ id: string }> }
  }>
}

interface PayPalSubscription {
  id: string
  status: string
  links: PayPalLink[]
  billing_info?: { next_billing_time?: string }
}
