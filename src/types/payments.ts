export type PaymentProviderName = 'stripe' | 'paypal'

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'partially_paid'
  | 'paid'
  | 'quote_pending'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'unpaid'
  | 'paused'

export type QuoteStatus =
  | 'pending'
  | 'in_review'
  | 'proposal_sent'
  | 'accepted'
  | 'declined'
  | 'expired'

// ── Provider-agnostic interfaces ─────────────────────────────────────────────

export interface CreateCheckoutParams {
  orderId: string
  clientEmail: string
  clientName: string
  /** Items to charge now (one-time) */
  oneTimeItems: CheckoutLineItem[]
  /** Items to set up as subscriptions */
  recurringItems: CheckoutLineItem[]
  successUrl: string
  cancelUrl: string
  /** Used for Stripe mixed-cart: create customer before checkout */
  stripeCustomerId?: string
  /** Metadata forwarded to provider */
  metadata?: Record<string, string>
}

export interface CheckoutLineItem {
  priceId: string           // internal pf_service_prices.id
  stripePriceId?: string    // Stripe Price ID (for direct checkout)
  paypalPlanId?: string     // PayPal Plan ID (for subscriptions)
  name: string
  quantity: number
  unitAmountUsd: number
  billingPeriod: 'monthly' | 'quarterly' | 'annual' | 'one_time' | null
}

export interface CheckoutResult {
  checkoutId: string       // Stripe Session ID or PayPal Order/Subscription ID
  checkoutUrl: string      // Redirect the user here
  provider: PaymentProviderName
  /** PayPal subscription IDs (one per recurring line item) */
  paypalSubscriptionIds?: string[]
}

export interface PaymentStatusResult {
  checkoutId: string
  status: PaymentStatus
  amountUsd: number
  providerPaymentId?: string
  subscriptionId?: string
}

export interface RefundParams {
  providerPaymentId: string  // Stripe PaymentIntent ID or PayPal capture ID
  amountUsd: number
  reason?: string
}

export interface RefundResult {
  refundId: string
  status: 'pending' | 'succeeded' | 'failed'
  amountUsd: number
}

export interface SubscriptionResult {
  subscriptionId: string
  status: SubscriptionStatus
  currentPeriodEnd?: Date
}

// ── Provider interface ────────────────────────────────────────────────────────

export interface IPaymentProvider {
  readonly name: PaymentProviderName
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>
  getCheckoutStatus(checkoutId: string): Promise<PaymentStatusResult>
  issueRefund(params: RefundParams): Promise<RefundResult>
  cancelSubscription(subscriptionId: string): Promise<void>
  getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionResult>
}

// ── Webhook types ─────────────────────────────────────────────────────────────

export interface WebhookVerifyParams {
  rawBody: string
  signature: string
  /** For PayPal: additional headers needed for verification */
  headers?: Record<string, string>
}

export interface WebhookEvent {
  eventId: string
  eventType: string
  provider: PaymentProviderName
  payload: Record<string, unknown>
}

// ── Order creation ────────────────────────────────────────────────────────────

export interface CreateOrderParams {
  clientEmail: string
  clientName: string
  clientCompany?: string
  items: OrderItemInput[]
}

export interface OrderItemInput {
  serviceId: string
  priceId: string
  quantity: number
}

export interface OrderRecord {
  id: string
  orderNumber: string
  clientEmail: string
  clientName: string
  status: OrderStatus
  subtotalUsd: number
  taxUsd: number
  totalUsd: number
  recurringTotalUsd: number
  createdAt: string
}
