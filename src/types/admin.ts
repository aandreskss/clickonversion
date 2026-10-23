// ── Admin roles & permissions ─────────────────────────────────────────────────

export type AdminRole = "owner" | "admin" | "manager" | "specialist"

export type Permission =
  | "dashboard:read"
  | "queue:read"
  | "queue:update"
  | "queue:assign"
  | "queue:read:own"
  | "queue:update:own"
  | "specialists:read"
  | "specialists:write"
  | "commercial:read"
  | "commercial:write"
  | "payments:read"
  | "payments:reconcile"
  | "analytics:read"
  | "team:read"
  | "team:write"
  | "settings:read"
  | "settings:write"

export interface AdminSession {
  userId:       string
  email:        string
  fullName:     string | null
  platformRole: "admin" | "staff"
  adminRole:    AdminRole | null
  permissions:  Permission[]
}

// ── Request statuses (extended) ───────────────────────────────────────────────

export type AdminRequestStatus =
  | "pending_payment"
  | "pending_onboarding"     // legacy — maps to "queued" in display
  | "queued"
  | "waiting_client"
  | "consultation_scheduled"
  | "in_progress"
  | "active"                 // legacy — maps to "in_progress" in display
  | "waiting_third_party"
  | "review"
  | "paused"                 // legacy — maps to "waiting_client" in display
  | "completed"
  | "cancelled"
  | "refunded"

export type RequestPriority = "low" | "normal" | "high" | "urgent"

// Valid transitions — admin enforces these at the API layer
export const STATUS_TRANSITIONS: Record<AdminRequestStatus, AdminRequestStatus[]> = {
  pending_payment:         ["queued", "cancelled"],
  pending_onboarding:      ["queued", "in_progress", "waiting_client", "cancelled"],
  queued:                  ["in_progress", "waiting_client", "consultation_scheduled", "cancelled"],
  consultation_scheduled:  ["in_progress", "waiting_client", "cancelled"],
  in_progress:             ["review", "waiting_client", "waiting_third_party", "completed", "cancelled"],
  active:                  ["in_progress", "review", "waiting_client", "completed", "cancelled"],
  waiting_client:          ["in_progress", "queued", "cancelled"],
  waiting_third_party:     ["in_progress", "review", "cancelled"],
  paused:                  ["in_progress", "waiting_client", "cancelled"],
  review:                  ["completed", "in_progress"],
  completed:               ["refunded"],
  cancelled:               ["refunded"],
  refunded:                [],
}

export interface StatusLogEntry {
  id:             string
  requestId:      string
  fromStatus:     AdminRequestStatus | null
  toStatus:       AdminRequestStatus
  changedBy:      string | null
  changedByEmail: string | null
  note:           string | null
  createdAt:      string
}

// ── Specialists ───────────────────────────────────────────────────────────────

export interface SpecialistProfile {
  id:            string
  userId:        string
  displayName:   string
  bio:           string | null
  timezone:      string
  maxConcurrent: number
  isActive:      boolean
  createdAt:     string
  updatedAt:     string
  // Computed at query time
  currentLoad?:   number
  enabledServices?: string[]
  user?: {
    email:    string
    fullName: string | null
    avatarUrl: string | null
  }
}

// ── Admin queue ───────────────────────────────────────────────────────────────

export interface AdminRequest {
  id:                   string
  orgId:                string
  orderId:              string | null
  orderItemId:          string | null
  serviceId:            string | null
  serviceName:          string
  scope:                string | null
  status:               AdminRequestStatus
  priority:             RequestPriority
  specialistEmail:      string | null
  assignedSpecialistId: string | null
  estimatedStart:       string | null
  startedAt:            string | null
  completedAt:          string | null
  cancelledAt:          string | null
  refundedAt:           string | null
  blockedReason:        string | null
  waitingInfoMessage:   string | null
  internalNotes:        string | null
  createdAt:            string
  updatedAt:            string
  // Relations
  org?: {
    id:   string
    name: string
    slug: string
  }
  specialist?: {
    id:          string
    displayName: string
    user?:       { email: string }
  }
}

export interface QueueFilters {
  status?:       AdminRequestStatus[]
  priority?:     RequestPriority[]
  specialistId?: string
  search?:       string
  page?:         number
  pageSize?:     number
  sortBy?:       "created_at" | "updated_at" | "estimated_start" | "priority"
  sortDir?:      "asc" | "desc"
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  revenue: {
    collected:  number   // paid orders (last 30d)
    recurring:  number   // sum of active subscription amounts per month
    projected:  number   // all subscription amounts including past_due
    currency:   string
  }
  orders: {
    newLast30d: number
    pending:    number
    total:      number
  }
  requests: {
    pending:       number  // queued
    active:        number  // in_progress
    waitingClient: number  // waiting_client
    overdue:       number  // estimated_start < today AND not completed/cancelled
  }
  consultations: {
    upcoming7d: number
  }
  topServices: Array<{
    serviceId:   string
    serviceName: string
    count:       number
  }>
  paymentStatus: {
    paid:    number
    pending: number
    failed:  number
  }
}

// ── Commercial ────────────────────────────────────────────────────────────────

export interface AdminService {
  id:            string
  slug:          string
  category:      string
  nameEn:        string
  nameEs:        string
  descriptionEn: string
  descriptionEs: string
  isPublished:   boolean
  sortOrder:     number
  prices:        AdminServicePrice[]
  createdAt:     string
  updatedAt:     string
}

export interface AdminServicePrice {
  id:              string
  serviceId:       string
  nameEn:          string
  nameEs:          string
  priceType:       string
  basePriceUsd:    number | null
  billingPeriodVal: string | null
  stripePriceId:   string | null
  paypalPlanId:    string | null
  isActive:        boolean
  sortOrder:       number
}

export interface AdminQuote {
  id:                string
  orderId:           string | null
  clientEmail:       string
  clientName:        string
  clientCompany:     string | null
  servicesRequested: Array<{ serviceId: string; priceId?: string; notes?: string }>
  status:            string
  clientNotes:       string | null
  scope:             string | null
  proposedPriceUsd:  number | null
  proposalNotes:     string | null
  paymentLink:       string | null
  proposalSentAt:    string | null
  acceptedAt:        string | null
  expiresAt:         string | null
  createdAt:         string
  updatedAt:         string
}

export interface AdminClient {
  id:           string
  name:         string
  slug:         string
  billingEmail: string | null
  createdAt:    string
  // Computed
  memberCount?:    number
  requestCount?:   number
  activeRequests?: number
}

// ── Payments ──────────────────────────────────────────────────────────────────

export interface UnifiedPayment {
  id:                string
  orderId:           string
  orderNumber:       string
  provider:          "stripe" | "paypal"
  providerPaymentId: string | null
  amountUsd:         number
  currency:          string
  status:            string
  paymentType:       string
  clientEmail:       string
  clientName:        string
  createdAt:         string
  updatedAt:         string
}

export interface ReconciliationRecord {
  id:             string
  orderId:        string
  paymentId:      string | null
  provider:       string
  providerAmount: number
  internalAmount: number
  currency:       string
  discrepancy:    number
  status:         "matched" | "discrepancy" | "manual_review" | "resolved"
  notes:          string | null
  resolvedBy:     string | null
  resolvedAt:     string | null
  createdAt:      string
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export type AnalyticsEventName =
  | "service_viewed"
  | "add_to_cart"
  | "checkout_started"
  | "purchase_confirmed"
  | "consultation_booked"
  | "service_completed"
  | "repurchase"

export interface AnalyticsEvent {
  id:         string
  eventName:  string
  userId:     string | null
  orgId:      string | null
  orderId:    string | null
  serviceId:  string | null
  sessionId:  string | null
  properties: Record<string, unknown>
  createdAt:  string
}

export interface FunnelMetrics {
  serviceViewed:        number
  addToCart:            number
  checkoutStarted:      number
  purchaseConfirmed:    number
  consultationBooked:   number
  serviceCompleted:     number
  repurchase:           number
  // Conversion rates (%)
  cartRate:             number  // add_to_cart / service_viewed
  checkoutRate:         number  // checkout_started / add_to_cart
  purchaseRate:         number  // purchase_confirmed / checkout_started
}
