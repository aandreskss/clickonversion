import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { randomBytes } from "crypto"

const schema = z.object({ email: z.string().email() })

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid email." }, { status: 400 })

  const { email } = parsed.data

  // Always return success to prevent user enumeration
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })

  if (user) {
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db
      .insert(verificationTokens)
      .values({ identifier: email, token, expires })
      .onConflictDoUpdate({ target: [verificationTokens.identifier], set: { token, expires } })

    const resetUrl = `${process.env.AUTH_URL}/portal/reset-password?token=${token}`

    // Send email via Resend
    const { sendPasswordResetEmail } = await import("@/lib/email/service")
    await sendPasswordResetEmail({ to: email, resetUrl }).catch(console.error)
  }

  return NextResponse.json({ success: true })
}
