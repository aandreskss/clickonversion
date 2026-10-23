import { NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users, pfPlatformUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createOrgForUser } from "@/lib/portal/auth"

const schema = z.object({
  fullName: z.string().min(1).max(100),
  orgName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, orgName, email, password } = schema.parse(body)

    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = crypto.randomUUID()

    // Create auth user
    await db.insert(users).values({
      id: userId,
      email,
      name: fullName,
      password: hashedPassword,
    })

    // Create platform user record
    await db.insert(pfPlatformUsers).values({
      id: userId,
      platformRole: "client",
      displayName: fullName,
    })

    // Create client org
    await createOrgForUser({ userId, userEmail: email, orgName })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data." }, { status: 400 })
    }
    console.error("[register]", err)
    return NextResponse.json({ error: "Registration failed." }, { status: 500 })
  }
}
