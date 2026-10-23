import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq, and, gte } from "drizzle-orm"

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = schema.parse(body)

    const [tokenRecord] = await db
      .select()
      .from(verificationTokens)
      .where(and(eq(verificationTokens.token, token), gte(verificationTokens.expires, new Date())))
      .limit(1)

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.update(users).set({ password: hashedPassword }).where(eq(users.email, tokenRecord.identifier))
    await db.delete(verificationTokens).where(eq(verificationTokens.token, token))

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Invalid request." }, { status: 400 })
    console.error("[reset-password]", err)
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 })
  }
}
