import { NextResponse, type NextRequest } from "next/server"
import { z }                              from "zod"
import { getPortalSession, requireOrgAdmin } from "@/lib/portal/auth"
import { db } from "@/lib/db"
import { pfClientOrgs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const PatchSchema = z.object({
  name: z.string().min(1).max(80).trim(),
})

export async function GET() {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  return NextResponse.json(session.org)
}

export async function PATCH(req: NextRequest) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  try {
    requireOrgAdmin(session)
  } catch {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  const parsed = PatchSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 })

  const [updated] = await db
    .update(pfClientOrgs)
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where(eq(pfClientOrgs.id, session.orgId))
    .returning({
      id: pfClientOrgs.id,
      name: pfClientOrgs.name,
      slug: pfClientOrgs.slug,
      createdAt: pfClientOrgs.createdAt,
    })

  if (!updated) {
    return NextResponse.json({ error: "Failed to update organization." }, { status: 500 })
  }

  return NextResponse.json(updated)
}
