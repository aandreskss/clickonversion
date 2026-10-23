export type MeetingStatus =
  | 'pending'
  | 'scheduled'
  | 'rescheduled'
  | 'cancelled'
  | 'completed'
  | 'no_show'

export type BookingRightStatus = 'unused' | 'reserved' | 'used' | 'expired' | 'cancelled'
export type OnboardingStatus = 'pending' | 'submitted' | 'reviewed' | 'complete'

// ── Meeting type config ──────────────────────────────────────────────────────

export type PreBriefCategory =
  | 'discovery'
  | 'meta'
  | 'seo'
  | 'waba'
  | 'automation'
  | 'technical'
  | 'onboarding'
  | 'followup'

export interface MeetingTypeConfig {
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  durationMin: number
  priceUsd: number | null        // null = custom/configurable
  isFree: boolean
  requiresBookingRight: boolean
  includedWithService: boolean
  requiresActiveSubscription: boolean
  calcomEventSlug: string        // e.g. "discovery-15min" → cal.com/username/discovery-15min
  preBriefCategory: PreBriefCategory
  /** For free calls: max bookings per period */
  freeLimit?: { count: number; periodDays: number }
}

// ── Pre-booking form fields ──────────────────────────────────────────────────

export interface PreBriefField {
  key: string
  labelEn: string
  labelEs: string
  type: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'number'
  required: boolean
  placeholderEn?: string
  placeholderEs?: string
  options?: Array<{ value: string; labelEn: string; labelEs: string }>
  sensitive?: boolean   // flag — field MUST NOT collect passwords or tokens
}

// ── DB record types ──────────────────────────────────────────────────────────

export interface BookingRightRecord {
  id: string
  orderId: string
  orderItemId: string
  serviceId: string
  meetingTypeSlug: string
  clientEmail: string
  clientName: string
  token: string
  status: BookingRightStatus
  maxUses: number
  usesCount: number
  meetingId: string | null
  expiresAt: string
  usedAt: string | null
  createdAt: string
}

export interface MeetingRecord {
  id: string
  bookingRightId: string | null
  orderId: string | null
  meetingTypeSlug: string
  calcomBookingUid: string | null
  clientEmail: string
  clientName: string
  clientTimezone: string | null
  specialistEmail: string | null
  startTime: string | null
  endTime: string | null
  videoCallUrl: string | null
  status: MeetingStatus
  preBriefData: Record<string, unknown>
  cancellationReason: string | null
  createdAt: string
}

export interface OnboardingResponseRecord {
  id: string
  orderId: string
  serviceId: string
  clientEmail: string
  responses: Record<string, unknown>
  status: OnboardingStatus
  submittedAt: string | null
  createdAt: string
}

// ── Cal.com webhook payload ──────────────────────────────────────────────────

export interface CalcomAttendee {
  email: string
  name: string
  timeZone: string
}

export interface CalcomWebhookPayload {
  triggerEvent:
    | 'BOOKING_CREATED'
    | 'BOOKING_RESCHEDULED'
    | 'BOOKING_CANCELLED'
    | 'BOOKING_CONFIRMED'
    | 'MEETING_ENDED'
  createdAt: string
  payload: {
    uid: string
    title: string
    startTime: string
    endTime: string
    attendees: CalcomAttendee[]
    organizer: CalcomAttendee
    eventTypeId?: number
    eventTypeSlug?: string
    videoCallData?: { url: string; type: string }
    metadata?: Record<string, string>
    cancelledBy?: string
    cancellationReason?: string
    rescheduleUid?: string
  }
}

// ── Validate token response (public, minimal) ────────────────────────────────

export interface TokenValidation {
  valid: boolean
  meetingTypeSlug?: string
  clientName?: string
  clientEmail?: string
  expiresAt?: string
  reason?: string
}
