import { NextResponse, type NextRequest } from "next/server"
import { z }                              from "zod"
import { getPortalSession, requireOrgAdmin, createInvitation } from "@/lib/portal/auth"

const InviteSchema = z.object({
  email: z.string().email().toLowerCase(),
  role:  z.enum(["admin", "member"]),
})

export async function POST(req: NextRequest) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  try {
    await requireOrgAdmin(session)
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  const parsed = InviteSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 })

  const { email, role } = parsed.data

  try {
    const invitation = await createInvitation({
      orgId:     session.orgId,
      email,
      role,
      invitedBy: session.userId,
    })
    return NextResponse.json(invitation, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create invitation." }, { status: 500 })
  }
}
