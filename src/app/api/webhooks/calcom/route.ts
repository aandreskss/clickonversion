import { getServerEnv } from "@/lib/env"
import {
  confirmMeetingFromCalcom,
  rescheduleMeeting,
  cancelMeeting,
} from "@/lib/meetings/service"
import {
  bookingConfirmedEmail,
  bookingConfirmedEmailEs,
  bookingCancelledEmail,
  bookingRescheduledEmail,
  meetingBookedAdminEmail,
} from "@/lib/email/templates"
import { sendEmail } from "@/lib/email/service"
import { getMeetingType } from "@/lib/meetings/config"
import type { CalcomWebhookPayload } from "@/types/meetings"
import { createHmac } from "crypto"

export const dynamic = "force-dynamic"

function verifyCalcomWebhook(rawBody: string, signature: string, secret: string): boolean {
  // Cal.com sends: X-Cal-Signature-256: sha256=<hmac>
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex")
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return diff === 0
}

function formatStartTime(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone:     timezone,
      weekday:      "long",
      month:        "long",
      day:          "numeric",
      year:         "numeric",
      hour:         "numeric",
      minute:       "2-digit",
      hour12:       true,
      timeZoneName: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const { calcomWebhookSecret } = getServerEnv()

  const signature = req.headers.get("X-Cal-Signature-256") ?? ""

  if (calcomWebhookSecret) {
    if (!verifyCalcomWebhook(rawBody, signature, calcomWebhookSecret)) {
      return Response.json({ error: "Invalid signature" }, { status: 401 })
    }
  }

  let body: CalcomWebhookPayload
  try {
    body = JSON.parse(rawBody) as CalcomWebhookPayload
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { triggerEvent, payload } = body

  // Idempotency: confirmMeetingFromCalcom uses calcom_booking_uid UNIQUE constraint
  // to naturally deduplicate — no separate webhook_events insert needed for calcom.

  try {
    const attendee        = payload.attendees?.[0]
    const clientEmail     = attendee?.email ?? ""
    const clientName      = attendee?.name ?? ""
    const clientTimezone  = attendee?.timeZone ?? "UTC"
    const videoCallUrl    = payload.videoCallData?.url
    const specialistEmail = payload.organizer?.email
    const bookingToken    = payload.metadata?.bookingToken

    // Try to resolve meeting type slug from payload
    const meetingTypeSlug = payload.eventTypeSlug ?? payload.metadata?.meetingTypeSlug ?? "discovery"
    const meetingType = getMeetingType(meetingTypeSlug)

    if (triggerEvent === "BOOKING_CREATED" || triggerEvent === "BOOKING_CONFIRMED") {
      await confirmMeetingFromCalcom({
        calcomBookingUid:  payload.uid,
        clientEmail,
        clientName,
        clientTimezone,
        startTime:         payload.startTime,
        endTime:           payload.endTime,
        videoCallUrl,
        specialistEmail,
        meetingTypeSlug,
        bookingToken,
        calcomPayload:     payload as unknown as Record<string, unknown>,
      })

      const formattedTime = formatStartTime(payload.startTime, clientTimezone)

      // Client confirmation email (try Spanish first based on metadata, fallback English)
      const lang = payload.metadata?.lang ?? "en"

      if (lang === "es") {
        const { subject, html } = bookingConfirmedEmailEs({
          clientName,
          meetingName:   meetingType?.nameEs ?? payload.title,
          startTime:     formattedTime,
          clientTimezone,
          videoCallUrl,
        })
        await sendEmail({ to: clientEmail, subject, html })
      } else {
        const { subject, html } = bookingConfirmedEmail({
          clientName,
          meetingName:    meetingType?.nameEn ?? payload.title,
          startTime:      formattedTime,
          clientTimezone,
          videoCallUrl,
          meetingTypeSlug,
        })
        await sendEmail({ to: clientEmail, subject, html })
      }

      // Admin notification
      const { subject: adminSubject, html: adminHtml } = meetingBookedAdminEmail({
        clientName,
        clientEmail,
        meetingName:     meetingType?.nameEn ?? payload.title,
        startTime:       formattedTime,
        clientTimezone,
        preBriefSummary: JSON.stringify(payload.metadata ?? {}, null, 2),
      })
      await sendEmail({ to: specialistEmail ?? "arnaldo@clickonversion.com", subject: adminSubject, html: adminHtml })
    }

    if (triggerEvent === "BOOKING_RESCHEDULED") {
      const rescheduleUid = payload.rescheduleUid ?? payload.uid
      await rescheduleMeeting({
        oldCalcomUid:  rescheduleUid,
        newCalcomUid:  payload.uid,
        newStartTime:  payload.startTime,
        newEndTime:    payload.endTime,
        clientTimezone,
        videoCallUrl,
        calcomPayload: payload as unknown as Record<string, unknown>,
      })

      const formattedTime = formatStartTime(payload.startTime, clientTimezone)
      const { subject, html } = bookingRescheduledEmail({
        clientName,
        meetingName:   meetingType?.nameEn ?? payload.title,
        newStartTime:  formattedTime,
        clientTimezone,
        videoCallUrl,
      })
      await sendEmail({ to: clientEmail, subject, html })
    }

    if (triggerEvent === "BOOKING_CANCELLED") {
      await cancelMeeting({
        calcomBookingUid:   payload.uid,
        cancellationReason: payload.cancellationReason,
      })

      const formattedTime = formatStartTime(payload.startTime, clientTimezone)
      const { subject, html } = bookingCancelledEmail({
        clientName,
        meetingName: meetingType?.nameEn ?? payload.title,
        startTime:   formattedTime,
        reason:      payload.cancellationReason,
      })
      await sendEmail({ to: clientEmail, subject, html })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error("[calcom-webhook] processing error:", err)
    // Still return 200 so Cal.com doesn't retry indefinitely
    return Response.json({ error: "Processing failed" }, { status: 200 })
  }
}
