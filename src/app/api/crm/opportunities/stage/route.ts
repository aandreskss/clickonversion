import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { opportunities, companies, activities } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getServerEnv } from "@/lib/env"

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orgId } = getServerEnv()
  if (!orgId) {
    return NextResponse.json({ error: "ORG_ID not configured" }, { status: 500 })
  }

  const body = await req.json()
  const {
    opportunity_id,
    company_id,
    stage,
    won_at,
    lost_at,
    lifecycle_status,
    activity_title,
  } = body

  if (!opportunity_id || !stage) {
    return NextResponse.json({ error: "opportunity_id and stage are required" }, { status: 400 })
  }

  // Update opportunity stage
  await db
    .update(opportunities)
    .set({
      stage,
      ...(won_at ? { wonAt: new Date(won_at) } : {}),
      ...(lost_at ? { lostAt: new Date(lost_at) } : {}),
    })
    .where(eq(opportunities.id, opportunity_id))

  // Update company lifecycle status if provided
  if (lifecycle_status && company_id) {
    await db
      .update(companies)
      .set({ lifecycleStatus: lifecycle_status })
      .where(eq(companies.id, company_id))
  }

  // Log system activity
  if (activity_title && company_id) {
    await db.insert(activities).values({
      organizationId: orgId,
      companyId:      company_id,
      opportunityId:  opportunity_id,
      activityType:   "system",
      title:          activity_title,
    })
  }

  return NextResponse.json({ ok: true })
}
