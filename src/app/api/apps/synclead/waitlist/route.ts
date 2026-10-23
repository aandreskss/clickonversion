import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { pfAppWaitlist } from "@/lib/db/schema"

const schema = z.object({
  email: z.string().email(),
})

// In-memory rate limit: 3 submissions per IP per hour
const attempts = new Map<string, { count: number; window: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now - rec.window > 3_600_000) {
    attempts.set(ip, { count: 1, window: now })
    return false
  }
  if (rec.count >= 3) return true
  rec.count++
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const { email } = parsed.data

  try {
    await db
      .insert(pfAppWaitlist)
      .values({ email: email.toLowerCase(), appSlug: "synclead", source: "synclead_landing" })
      .onConflictDoNothing()
  } catch (err) {
    // Non-blocking — log and continue
    console.error("Waitlist insert error:", err)
  }

  return NextResponse.json({ ok: true })
}
