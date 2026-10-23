// ── Platform users ───────────────────────────────────────────────────────────

export type PlatformRole = "admin" | "staff" | "client"

export interface PlatformUser {
  id:           string
  email:        string
  fullName:     string | null
  avatarUrl:    string | null
  platformRole: PlatformRole
  createdAt:    string
}

// ── Organizations ────────────────────────────────────────────────────────────

export type OrgMemberRole = "owner" | "admin" | "member"

export interface ClientOrg {
  id:               string
  name:             string
  slug:             string
  logoUrl:          string | null
  billingEmail:     string | null
  stripeCustomerId: string | null
  createdAt:        string
  updatedAt:        string
}

export interface OrgMember {
  id:        string
  orgId:     string
  userId:    string
  role:      OrgMemberRole
  invitedBy: string | null
  joinedAt:  string
  user?:     Pick<PlatformUser, "id" | "email" | "fullName" | "avatarUrl">
}

export interface OrgInvitation {
  id:          string
  orgId:       string
  email:       string
  role:        OrgMemberRole
  token:       string
  invitedBy:   string | null
  status:      "pending" | "accepted" | "expired" | "cancelled"
  acceptedAt:  string | null
  expiresAt:   string
  createdAt:   string
}

// ── Portal session ───────────────────────────────────────────────────────────

export interface PortalSession {
  userId:  string
  email:   string
  orgId:   string
  orgRole: OrgMemberRole
  org:     ClientOrg
}

// ── Requests ─────────────────────────────────────────────────────────────────

export type RequestStatus =
  | "pending_payment"
  | "pending_onboarding"
  | "queued"
  | "waiting_client"
  | "consultation_scheduled"
  | "in_progress"
  | "active"
  | "waiting_third_party"
  | "review"
  | "paused"
  | "completed"
  | "cancelled"
  | "refunded"

export interface PortalRequest {
  id:               string
  orgId:            string
  orderId:          string | null
  orderItemId:      string | null
  serviceId:        string | null
  serviceName:      string
  scope:            string | null
  status:           RequestStatus
  specialistEmail:  string | null
  estimatedStart:   string | null
  startedAt:        string | null
  completedAt:      string | null
  createdAt:        string
  updatedAt:        string
}

export type MilestoneStatus = "pending" | "in_progress" | "completed" | "cancelled"

export interface RequestMilestone {
  id:              string
  requestId:       string
  title:           string
  description:     string | null
  isClientVisible: boolean
  status:          MilestoneStatus
  dueDate:         string | null
  completedAt:     string | null
  sortOrder:       number
}

export interface Comment {
  id:         string
  requestId:  string
  authorId:   string
  authorRole: "client" | "staff" | "admin"
  body:       string
  isInternal: boolean
  createdAt:  string
  updatedAt:  string
  author?:    Pick<PlatformUser, "id" | "email" | "fullName" | "avatarUrl">
}

// ── Documents ────────────────────────────────────────────────────────────────

export type DocumentCategory = "deliverable" | "attachment" | "contract" | "report" | "other"

export interface PortalDocument {
  id:              string
  orgId:           string
  requestId:       string | null
  storagePath:     string
  fileName:        string
  fileSizeBytes:   number
  mimeType:        string
  uploadedBy:      string
  isClientVisible: boolean
  category:        DocumentCategory
  createdAt:       string
  uploader?:       Pick<PlatformUser, "id" | "email" | "fullName">
}

// ── Billing (from existing pf_* tables) ──────────────────────────────────────

export interface BillingOrder {
  id:               string
  orderNumber:      string
  status:           string
  totalUsd:         number
  recurringTotalUsd: number
  createdAt:        string
  items:            BillingOrderItem[]
}

export interface BillingOrderItem {
  id:           string
  serviceName:  string
  priceTierName: string
  priceType:    string
  unitPriceUsd: number
  lineTotalUsd: number
}

export interface BillingSubscription {
  id:                     string
  provider:               string
  providerSubscriptionId: string
  status:                 string
  currentPeriodStart:     string | null
  currentPeriodEnd:       string | null
  cancelledAt:            string | null
  serviceName:            string
}

// ── Notifications ────────────────────────────────────────────────────────────

export interface PortalNotification {
  id:         string
  userId:     string
  type:       string
  title:      string
  body:       string
  link:       string | null
  isRead:     boolean
  entityType: string | null
  entityId:   string | null
  createdAt:  string
}
