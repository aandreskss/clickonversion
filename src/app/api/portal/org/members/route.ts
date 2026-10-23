import { NextResponse, type NextRequest } from "next/server"
import { getPortalSession, requireOrgAdmin } from "@/lib/portal/auth"
import { db } from "@/lib/db"
import { pfOrgMembers, pfPlatformUsers, users } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"

export async function GET() {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const rows = await db
    .select({
      id: pfOrgMembers.id,
      role: pfOrgMembers.role,
      joinedAt: pfOrgMembers.joinedAt,
      userId: pfOrgMembers.userId,
      userEmail: users.email,
      userDisplayName: pfPlatformUsers.displayName,
    })
    .from(pfOrgMembers)
    .leftJoin(pfPlatformUsers, eq(pfOrgMembers.userId, pfPlatformUsers.id))
    .leftJoin(users, eq(pfOrgMembers.userId, users.id))
    .where(eq(pfOrgMembers.orgId, session.orgId))
    .orderBy(asc(pfOrgMembers.joinedAt))

  const members = rows.map((m) => ({
    id: m.id,
    role: m.role,
    joined_at: m.joinedAt?.toISOString() ?? null,
    pf_platform_users: {
      id: m.userId,
      email: m.userEmail ?? "",
      full_name: m.userDisplayName ?? null,
      avatar_url: null as string | null,
    },
  }))

  return NextResponse.json(members)
}

export async function DELETE(req: NextRequest) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  try {
    requireOrgAdmin(session)
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  const memberId = req.nextUrl.searchParams.get("memberId")
  if (!memberId) return NextResponse.json({ error: "memberId required." }, { status: 400 })

  // Verify the member belongs to this org and is not an owner
  const [member] = await db
    .select({ id: pfOrgMembers.id, role: pfOrgMembers.role, userId: pfOrgMembers.userId })
    .from(pfOrgMembers)
    .where(and(eq(pfOrgMembers.id, memberId), eq(pfOrgMembers.orgId, session.orgId)))
    .limit(1)

  if (!member) return NextResponse.json({ error: "Member not found." }, { status: 404 })
  if (member.role === "owner") return NextResponse.json({ error: "Cannot remove owner." }, { status: 403 })
  if (member.userId === session.userId) return NextResponse.json({ error: "Cannot remove yourself." }, { status: 403 })

  await db
    .delete(pfOrgMembers)
    .where(and(eq(pfOrgMembers.id, memberId), eq(pfOrgMembers.orgId, session.orgId)))

  return NextResponse.json({ ok: true })
}
