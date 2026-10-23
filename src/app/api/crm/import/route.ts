import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { companies, contacts, opportunities } from "@/lib/db/schema"
import { normalizeDomain, normalizeName, normalizeEmail } from "@/lib/normalize"
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
    company_name,
    website,
    city,
    state,
    industry,
    contact_name,
    email,
    phone,
    source,
    notes,
  } = body

  if (!company_name) {
    return NextResponse.json({ error: "company_name is required" }, { status: 400 })
  }

  const [company] = await db
    .insert(companies)
    .values({
      organizationId:   orgId,
      name:             company_name,
      normalizedName:   normalizeName(company_name),
      website:          website ?? null,
      normalizedDomain: normalizeDomain(website ?? ""),
      city:             city ?? null,
      state:            state ?? null,
      industry:         industry ?? null,
      phone:            phone ?? null,
      source:           source ?? null,
      notesSummary:     notes ?? null,
      lifecycleStatus:  "prospect",
    })
    .returning({ id: companies.id })

  if (!company) {
    return NextResponse.json({ error: "Failed to insert company" }, { status: 500 })
  }

  // Contact
  if (contact_name || email) {
    const [firstName, ...lastParts] = (contact_name ?? "").split(" ")
    await db.insert(contacts).values({
      organizationId:   orgId,
      companyId:        company.id,
      firstName:        firstName || email?.split("@")[0] || "Unknown",
      lastName:         lastParts.join(" ") || null,
      email:            email ?? null,
      normalizedEmail:  normalizeEmail(email ?? ""),
      phone:            phone ?? null,
      isPrimary:        true,
    })
  }

  // Opportunity
  await db.insert(opportunities).values({
    organizationId: orgId,
    companyId:      company.id,
    name:           `${company_name} — Growth`,
    stage:          "NEW",
    source:         source ?? null,
  })

  return NextResponse.json({ id: company.id })
}
