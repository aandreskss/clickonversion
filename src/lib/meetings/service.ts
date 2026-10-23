import { db } from "@/lib/db"
import {
  pfBookingRights,
  pfMeetings,
} from "@/lib/db/schema"
import { eq, and, gte, ne, count, sql } from "drizzle-orm"
import { getMeetingType } from "@/lib/meetings/config"
import type { BookingRightRecord, MeetingRecord, TokenValidation } from "@/types/meetings"
import { randomBytes } from "crypto"

// ── Booking rights ───────────────────────────────────────────────────────────

export async function createBookingRight(params: {
  orderId: string
  orderItemId: string
  serviceId: string
  meetingTypeSlug: string
  clientEmail: string
  clientName: string
  maxUses?: number
  expiresInDays?: number
}): Promise<BookingRightRecord> {
  const token = randomBytes(24).toString("hex")
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays ?? 90))

  const [data] = await db
    .insert(pfBookingRights)
    .values({
      orderId:         params.orderId,
      orderItemId:     params.orderItemId,
      serviceId:       params.serviceId,
      meetingTypeSlug: params.meetingTypeSlug,
      clientEmail:     params.clientEmail,
      clientName:      params.clientName,
      token,
      status:          "unused",
      maxUses:         params.maxUses ?? 1,
      usesCount:       0,
      expiresAt,
    })
    .returning()

  if (!data) throw new Error("Failed to create booking right")
  return mapBookingRight(data)
}

export async function validateBookingToken(token: string): Promise<TokenValidation> {
  const [data] = await db
    .select({
      id:              pfBookingRights.id,
      meetingTypeSlug: pfBookingRights.meetingTypeSlug,
      clientName:      pfBookingRights.clientName,
      clientEmail:     pfBookingRights.clientEmail,
      status:          pfBookingRights.status,
      usesCount:       pfBookingRights.usesCount,
      maxUses:         pfBookingRights.maxUses,
      expiresAt:       pfBookingRights.expiresAt,
    })
    .from(pfBookingRights)
    .where(eq(pfBookingRights.token, token))
    .limit(1)

  if (!data) {
    return { valid: false, reason: "Token not found" }
  }

  if (data.status === "cancelled") {
    return { valid: false, reason: "Booking right cancelled" }
  }

  if (data.status === "used" || data.usesCount >= data.maxUses) {
    return { valid: false, reason: "Booking right already used" }
  }

  if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
    return { valid: false, reason: "Booking right expired" }
  }

  return {
    valid:           true,
    meetingTypeSlug: data.meetingTypeSlug,
    clientName:      data.clientName,
    clientEmail:     data.clientEmail,
    expiresAt:       data.expiresAt?.toISOString() ?? "",
  }
}

export async function reserveBookingRight(token: string): Promise<{ rightId: string } | null> {
  const [right] = await db
    .select({
      id:        pfBookingRights.id,
      status:    pfBookingRights.status,
      usesCount: pfBookingRights.usesCount,
      maxUses:   pfBookingRights.maxUses,
      expiresAt: pfBookingRights.expiresAt,
    })
    .from(pfBookingRights)
    .where(eq(pfBookingRights.token, token))
    .limit(1)

  if (!right) return null
  if (right.usesCount >= right.maxUses) return null
  if (right.expiresAt && new Date(right.expiresAt) < new Date()) return null
  if (right.status === "cancelled" || right.status === "used") return null

  // Optimistic concurrency — only update if still unused
  const updated = await db
    .update(pfBookingRights)
    .set({ status: "reserved" })
    .where(
      and(
        eq(pfBookingRights.id, right.id),
        eq(pfBookingRights.status, "unused"),
      )
    )
    .returning({ id: pfBookingRights.id })

  if (!updated.length) return null
  return { rightId: right.id }
}

// ── Free call rate limiting ──────────────────────────────────────────────────

export async function checkFreeCallLimit(params: {
  clientEmail:     string
  meetingTypeSlug: string
}): Promise<{ allowed: boolean; reason?: string }> {
  const meetingType = getMeetingType(params.meetingTypeSlug)
  if (!meetingType?.freeLimit) return { allowed: true }

  const { count: limitCount, periodDays } = meetingType.freeLimit
  const since = new Date()
  since.setDate(since.getDate() - periodDays)

  const [{ existingCount }] = await db
    .select({ existingCount: count() })
    .from(pfMeetings)
    .where(
      and(
        eq(pfMeetings.clientEmail, params.clientEmail),
        eq(pfMeetings.meetingTypeSlug, params.meetingTypeSlug),
        ne(pfMeetings.status, "cancelled"),
        gte(pfMeetings.createdAt, since),
      )
    )

  const used = existingCount ?? 0
  if (used >= limitCount) {
    return {
      allowed: false,
      reason:  `You have already used your ${limitCount} free session(s) in the last ${periodDays} days.`,
    }
  }

  return { allowed: true }
}

// ── Meeting records ──────────────────────────────────────────────────────────

export async function createPendingMeeting(params: {
  meetingTypeSlug:  string
  clientEmail:      string
  clientName:       string
  preBriefData:     Record<string, unknown>
  bookingRightId?:  string
  orderId?:         string
}): Promise<MeetingRecord> {
  const [data] = await db
    .insert(pfMeetings)
    .values({
      meetingTypeSlug:  params.meetingTypeSlug,
      clientEmail:      params.clientEmail,
      clientName:       params.clientName,
      preBriefData:     params.preBriefData,
      bookingRightId:   params.bookingRightId ?? null,
      orderId:          params.orderId ?? null,
      status:           "pending",
    })
    .returning()

  if (!data) throw new Error("Failed to create pending meeting")
  return mapMeeting(data)
}

export async function confirmMeetingFromCalcom(params: {
  calcomBookingUid:  string
  clientEmail:       string
  clientName:        string
  clientTimezone:    string
  startTime:         string
  endTime:           string
  videoCallUrl?:     string
  specialistEmail?:  string
  meetingTypeSlug:   string
  bookingToken?:     string
  calcomPayload:     Record<string, unknown>
}): Promise<void> {
  // Find or create meeting record
  const [existing] = await db
    .select({ id: pfMeetings.id, bookingRightId: pfMeetings.bookingRightId })
    .from(pfMeetings)
    .where(eq(pfMeetings.calcomBookingUid, params.calcomBookingUid))
    .limit(1)

  if (existing) {
    // Update in-place (idempotent)
    await db
      .update(pfMeetings)
      .set({
        status:          "scheduled",
        clientTimezone:  params.clientTimezone,
        startTime:       new Date(params.startTime),
        endTime:         new Date(params.endTime),
        videoCallUrl:    params.videoCallUrl ?? null,
        specialistEmail: params.specialistEmail ?? null,
        calcomPayload:   params.calcomPayload,
      })
      .where(eq(pfMeetings.id, existing.id))
    return
  }

  // Try to match by token → booking right
  let bookingRightId: string | null = null
  if (params.bookingToken) {
    const [right] = await db
      .select({ id: pfBookingRights.id })
      .from(pfBookingRights)
      .where(eq(pfBookingRights.token, params.bookingToken))
      .limit(1)
    bookingRightId = right?.id ?? null
  }

  const [meeting] = await db
    .insert(pfMeetings)
    .values({
      meetingTypeSlug:  params.meetingTypeSlug,
      calcomBookingUid: params.calcomBookingUid,
      clientEmail:      params.clientEmail,
      clientName:       params.clientName,
      clientTimezone:   params.clientTimezone,
      startTime:        new Date(params.startTime),
      endTime:          new Date(params.endTime),
      videoCallUrl:     params.videoCallUrl ?? null,
      specialistEmail:  params.specialistEmail ?? null,
      bookingRightId,
      preBriefData:     {},
      status:           "scheduled",
      calcomPayload:    params.calcomPayload,
    })
    .returning({ id: pfMeetings.id })

  if (!meeting) throw new Error("Failed to create meeting from Cal.com booking")

  // Mark booking right as used
  if (bookingRightId) {
    await db
      .update(pfBookingRights)
      .set({
        status:    "used",
        usesCount: sql`${pfBookingRights.usesCount} + 1`,
        meetingId: meeting.id,
        usedAt:    new Date(),
      })
      .where(eq(pfBookingRights.id, bookingRightId))
  }
}

export async function rescheduleMeeting(params: {
  oldCalcomUid:   string
  newCalcomUid:   string
  newStartTime:   string
  newEndTime:     string
  clientTimezone: string
  videoCallUrl?:  string
  calcomPayload:  Record<string, unknown>
}): Promise<void> {
  const [old] = await db
    .select({ id: pfMeetings.id })
    .from(pfMeetings)
    .where(eq(pfMeetings.calcomBookingUid, params.oldCalcomUid))
    .limit(1)

  if (old) {
    await db
      .update(pfMeetings)
      .set({
        status:           "rescheduled",
        calcomBookingUid: params.newCalcomUid,
        startTime:        new Date(params.newStartTime),
        endTime:          new Date(params.newEndTime),
        clientTimezone:   params.clientTimezone,
        videoCallUrl:     params.videoCallUrl ?? null,
        calcomPayload:    params.calcomPayload,
      })
      .where(eq(pfMeetings.id, old.id))
  }
}

export async function cancelMeeting(params: {
  calcomBookingUid:   string
  cancellationReason?: string
}): Promise<void> {
  const [meeting] = await db
    .select({ id: pfMeetings.id, bookingRightId: pfMeetings.bookingRightId })
    .from(pfMeetings)
    .where(eq(pfMeetings.calcomBookingUid, params.calcomBookingUid))
    .limit(1)

  if (!meeting) return

  await db
    .update(pfMeetings)
    .set({
      status:             "cancelled",
      cancellationReason: params.cancellationReason ?? null,
    })
    .where(eq(pfMeetings.id, meeting.id))

  // Re-open the booking right so the client can rebook
  if (meeting.bookingRightId) {
    await db
      .update(pfBookingRights)
      .set({ status: "unused", meetingId: null, usedAt: null })
      .where(
        and(
          eq(pfBookingRights.id, meeting.bookingRightId),
          // Only re-open if currently reserved or used
          sql`${pfBookingRights.status} IN ('reserved', 'used')`,
        )
      )
  }
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapBookingRight(row: Record<string, unknown>): BookingRightRecord {
  return {
    id:              row.id as string,
    orderId:         row.orderId as string,
    orderItemId:     row.orderItemId as string,
    serviceId:       row.serviceId as string,
    meetingTypeSlug: row.meetingTypeSlug as string,
    clientEmail:     row.clientEmail as string,
    clientName:      row.clientName as string,
    token:           row.token as string,
    status:          row.status as BookingRightRecord["status"],
    maxUses:         row.maxUses as number,
    usesCount:       row.usesCount as number,
    meetingId:       (row.meetingId as string | null) ?? null,
    expiresAt:       row.expiresAt instanceof Date
      ? row.expiresAt.toISOString()
      : (row.expiresAt as string),
    usedAt:          row.usedAt instanceof Date
      ? row.usedAt.toISOString()
      : ((row.usedAt as string | null) ?? null),
    createdAt:       row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : (row.createdAt as string),
  }
}

function mapMeeting(row: Record<string, unknown>): MeetingRecord {
  return {
    id:               row.id as string,
    bookingRightId:   (row.bookingRightId as string | null) ?? null,
    orderId:          (row.orderId as string | null) ?? null,
    meetingTypeSlug:  row.meetingTypeSlug as string,
    calcomBookingUid: (row.calcomBookingUid as string | null) ?? null,
    clientEmail:      row.clientEmail as string,
    clientName:       row.clientName as string,
    clientTimezone:   (row.clientTimezone as string | null) ?? null,
    specialistEmail:  (row.specialistEmail as string | null) ?? null,
    startTime:        row.startTime instanceof Date
      ? row.startTime.toISOString()
      : ((row.startTime as string | null) ?? null),
    endTime:          row.endTime instanceof Date
      ? row.endTime.toISOString()
      : ((row.endTime as string | null) ?? null),
    videoCallUrl:     (row.videoCallUrl as string | null) ?? null,
    status:           row.status as MeetingRecord["status"],
    preBriefData:     (row.preBriefData as Record<string, unknown>) ?? {},
    cancellationReason: (row.cancellationReason as string | null) ?? null,
    createdAt:        row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : (row.createdAt as string),
  }
}
