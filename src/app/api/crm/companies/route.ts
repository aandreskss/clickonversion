import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { companies, opportunities } from "@/lib/db/schema"
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
    name,
    normalized_name,
    website,
    normalized_domain,
    city,
    state,
    industry,
    phone,
    source,
    lifecycle_status,
    notes_summary,
  } = body

  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }

  const [company] = await db
    .insert(companies)
    .values({
      organizationId:   orgId,
      name,
      normalizedName:   normalized_name ?? null,
      website:          website ?? null,
      normalizedDomain: normalized_domain ?? null,
      city:             city ?? null,
      state:            state ?? null,
      industry:         industry ?? null,
      phone:            phone ?? null,
      source:           source ?? null,
      lifecycleStatus:  lifecycle_status ?? "prospect",
      notesSummary:     notes_summary ?? null,
    })
    .returning({ id: companies.id })

  if (!company) {
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
  }

  // Create opportunity automatically
  await db.insert(opportunities).values({
    organizationId: orgId,
    companyId:      company.id,
    name:           `${name} — Growth`,
    stage:          "NEW",
    source:         source ?? null,
  })

  return NextResponse.json({ id: company.id })
}
