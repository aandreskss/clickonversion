import { db } from "@/lib/db"
import { pfBookingRights } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getMeetingType } from "@/lib/meetings/config"
import {
  validateBookingToken,
  checkFreeCallLimit,
  createPendingMeeting,
} from "@/lib/meetings/service"
import { z } from "zod"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  meetingTypeSlug: z.string().min(1).max(80),
  clientName:      z.string().min(1).max(120),
  clientEmail:     z.string().email(),
  preBriefData:    z.record(z.string(), z.unknown()),
  bookingToken:    z.string().optional(),
  lang:            z.enum(["en", "es"]).optional().default("en"),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 422 })
  }

  const { meetingTypeSlug, clientName, clientEmail, preBriefData, bookingToken, lang } = parsed.data

  const meetingType = getMeetingType(meetingTypeSlug)
  if (!meetingType) {
    return Response.json({ error: "Unknown meeting type" }, { status: 404 })
  }

  // Gate: paid meeting types require a valid booking token
  if (meetingType.requiresBookingRight) {
    if (!bookingToken) {
      return Response.json({ error: "Booking token required for this session type" }, { status: 403 })
    }

    const validation = await validateBookingToken(bookingToken)
    if (!validation.valid) {
      return Response.json({ error: validation.reason ?? "Invalid booking token" }, { status: 403 })
    }

    // Ensure the token is for this meeting type
    if (validation.meetingTypeSlug && validation.meetingTypeSlug !== meetingTypeSlug) {
      return Response.json({ error: "Token is not valid for this meeting type" }, { status: 403 })
    }
  }

  // Gate: free calls — check rate limit
  if (meetingType.isFree && meetingType.freeLimit) {
    const limit = await checkFreeCallLimit({ clientEmail, meetingTypeSlug })
    if (!limit.allowed) {
      return Response.json({ error: limit.reason ?? "Free call limit reached" }, { status: 429 })
    }
  }

  // Resolve booking right id from token
  let bookingRightId: string | undefined
  if (bookingToken) {
    const [right] = await db
      .select({ id: pfBookingRights.id })
      .from(pfBookingRights)
      .where(eq(pfBookingRights.token, bookingToken))
      .limit(1)
    bookingRightId = right?.id
  }

  const meeting = await createPendingMeeting({
    meetingTypeSlug,
    clientEmail,
    clientName,
    preBriefData,
    bookingRightId,
  })

  // Build the Cal.com embed link — token and meeting ID passed as metadata
  const calLink = buildCalLink(meetingType.calcomEventSlug, {
    name:           clientName,
    email:          clientEmail,
    meetingId:      meeting.id,
    bookingToken:   bookingToken ?? "",
    meetingTypeSlug,
    lang,
  })

  return Response.json({ meetingId: meeting.id, calLink }, { status: 201 })
}

function buildCalLink(
  eventSlug: string,
  meta: Record<string, string>
): string {
  const CAL_USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME ?? ""
  const base = `${CAL_USERNAME}/${eventSlug}`
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(meta)) {
    if (v) params.set(`metadata[${k}]`, v)
  }
  return `${base}?${params.toString()}`
}
