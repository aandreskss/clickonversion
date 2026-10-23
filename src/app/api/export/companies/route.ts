import { NextResponse }      from "next/server"
import { auth }              from "@/lib/auth"
import { db }                from "@/lib/db"
import { companies, contacts, opportunities, organizationMembers } from "@/lib/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import { csvSanitize }       from "@/lib/utils"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  // Resolve org membership
  const [membership] = await db
    .select({ organizationId: organizationMembers.organizationId })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, session.user.id))
    .limit(1)

  if (!membership) return new NextResponse("Forbidden", { status: 403 })

  // Fetch companies with related contacts and opportunities
  const rows = await db
    .select({
      id:              companies.id,
      name:            companies.name,
      website:         companies.website,
      city:            companies.city,
      state:           companies.state,
      industry:        companies.industry,
      phone:           companies.phone,
      source:          companies.source,
      lifecycleStatus: companies.lifecycleStatus,
      notesSummary:    companies.notesSummary,
      createdAt:       companies.createdAt,
    })
    .from(companies)
    .where(eq(companies.organizationId, membership.organizationId))
    .orderBy(desc(companies.createdAt))

  if (!rows) return new NextResponse("Export failed", { status: 500 })

  // Fetch related contacts and opportunities in bulk
  const companyIds = rows.map((c) => c.id)

  let allContacts: {
    id: string
    companyId: string | null
    firstName: string
    lastName: string | null
    email: string | null
    phone: string | null
    isPrimary: boolean
  }[] = []

  let allOpportunities: {
    id: string
    companyId: string
    stage: string
    estimatedValue: string | null
    mrrValue: string | null
    nextAction: string | null
  }[] = []

  if (companyIds.length > 0) {
    allContacts = await db
      .select({
        id:        contacts.id,
        companyId: contacts.companyId,
        firstName: contacts.firstName,
        lastName:  contacts.lastName,
        email:     contacts.email,
        phone:     contacts.phone,
        isPrimary: contacts.isPrimary,
      })
      .from(contacts)
      .where(inArray(contacts.companyId, companyIds))

    allOpportunities = await db
      .select({
        id:             opportunities.id,
        companyId:      opportunities.companyId,
        stage:          opportunities.stage,
        estimatedValue: opportunities.estimatedValue,
        mrrValue:       opportunities.mrrValue,
        nextAction:     opportunities.nextAction,
      })
      .from(opportunities)
      .where(inArray(opportunities.companyId, companyIds))
  }

  const HEADERS = [
    "company_name", "website", "city", "state", "industry",
    "phone", "source", "lifecycle_status",
    "contact_name", "contact_email", "contact_phone",
    "stage", "estimated_value", "mrr_value", "next_action",
    "notes", "created_at",
  ]

  const csvRows = rows.map((co) => {
    const coContacts = allContacts.filter((c) => c.companyId === co.id)
    const coOpps     = allOpportunities.filter((o) => o.companyId === co.id)

    const opp     = coOpps[0]
    const contact = coContacts.find((c) => c.isPrimary) ?? coContacts[0]
    const contactName = contact
      ? [contact.firstName, contact.lastName].filter(Boolean).join(" ")
      : ""

    return [
      csvSanitize(co.name),
      csvSanitize(co.website),
      csvSanitize(co.city),
      csvSanitize(co.state),
      csvSanitize(co.industry),
      csvSanitize(co.phone),
      csvSanitize(co.source),
      csvSanitize(co.lifecycleStatus),
      csvSanitize(contactName),
      csvSanitize(contact?.email),
      csvSanitize(contact?.phone),
      csvSanitize(opp?.stage),
      csvSanitize(opp?.estimatedValue),
      csvSanitize(opp?.mrrValue),
      csvSanitize(opp?.nextAction),
      csvSanitize(co.notesSummary),
      csvSanitize(co.createdAt?.toISOString()),
    ].map((v) => `"${v.replace(/"/g, '""')}"`).join(",")
  })

  const csv  = [HEADERS.join(","), ...csvRows].join("\r\n")
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clickonversion-companies-${date}.csv"`,
    },
  })
}
