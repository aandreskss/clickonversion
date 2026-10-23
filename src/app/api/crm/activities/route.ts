import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { activities } from "@/lib/db/schema"
import { getServerEnv } from "@/lib/env"

export async function POST(req: Request) {
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
    company_id,
    opportunity_id,
    activity_type,
    title,
    body: activityBody,
    occurred_at,
  } = body

  if (!company_id || !activity_type || !title) {
    return NextResponse.json({ error: "company_id, activity_type, and title are required" }, { status: 400 })
  }

  const [activity] = await db
    .insert(activities)
    .values({
      organizationId: orgId,
      companyId:      company_id,
      opportunityId:  opportunity_id ?? null,
      activityType:   activity_type,
      title,
      body:           activityBody ?? null,
      occurredAt:     occurred_at ? new Date(occurred_at) : new Date(),
      createdBy:      session.user.id,
    })
    .returning({ id: activities.id })

  return NextResponse.json({ id: activity.id })
}
