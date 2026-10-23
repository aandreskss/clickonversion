import { NextResponse, type NextRequest } from "next/server"
import { z }                              from "zod"
import { getPortalSession, acceptInvitation } from "@/lib/portal/auth"
import { db } from "@/lib/db"
import { pfOrgInvitations, pfClientOrgs } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

const AcceptSchema = z.object({
  token: z.string().min(1),
})

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.json({ error: "Token required." }, { status: 400 })

  const [inv] = await db
    .select({
      id: pfOrgInvitations.id,
      email: pfOrgInvitations.email,
      role: pfOrgInvitations.role,
      status: pfOrgInvitations.status,
      expiresAt: pfOrgInvitations.expiresAt,
      orgName: pfClientOrgs.name,
    })
    .from(pfOrgInvitations)
    .leftJoin(pfClientOrgs, eq(pfOrgInvitations.orgId, pfClientOrgs.id))
    .where(
      and(
        eq(pfOrgInvitations.token, token),
        eq(pfOrgInvitations.status, "pending"),
      )
    )
    .limit(1)

  if (!inv) return NextResponse.json({ error: "Invalid or expired invitation." }, { status: 404 })

  if (inv.expiresAt && inv.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invitation has expired." }, { status: 410 })
  }

  return NextResponse.json({
    valid:   true,
    email:   inv.email,
    role:    inv.role,
    orgName: inv.orgName ?? "Unknown Organization",
  })
}

export async function POST(req: NextRequest) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const parsed = AcceptSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 })

  let result: { orgId: string }
  try {
    result = await acceptInvitation(parsed.data.token, session.userId)
  } catch {
    return NextResponse.json({ error: "Invalid, expired, or already accepted invitation." }, { status: 400 })
  }

  return NextResponse.json({ orgId: result.orgId })
}
