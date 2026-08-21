import { NextResponse }  from "next/server"
import { createClient }  from "@/lib/supabase/server"
import { csvSanitize }   from "@/lib/utils"

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .single()

  if (!membership) return new NextResponse("Forbidden", { status: 403 })

  const { data: companies, error } = await supabase
    .from("companies")
    .select(`
      name, website, city, state, industry, phone, source, lifecycle_status,
      notes_summary, created_at,
      opportunities(stage, estimated_value, mrr_value, next_action),
      contacts(first_name, last_name, email, phone, is_primary)
    `)
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: false })

  if (error) return new NextResponse("Export failed", { status: 500 })

  const HEADERS = [
    "company_name", "website", "city", "state", "industry",
    "phone", "source", "lifecycle_status",
    "contact_name", "contact_email", "contact_phone",
    "stage", "estimated_value", "mrr_value", "next_action",
    "notes", "created_at",
  ]

  const rows = (companies ?? []).map((co) => {
    const opp     = co.opportunities?.[0]
    const contact = co.contacts?.find((c) => c.is_primary) ?? co.contacts?.[0]
    const contactName = contact
      ? [contact.first_name, contact.last_name].filter(Boolean).join(" ")
      : ""

    return [
      csvSanitize(co.name),
      csvSanitize(co.website),
      csvSanitize(co.city),
      csvSanitize(co.state),
      csvSanitize(co.industry),
      csvSanitize(co.phone),
      csvSanitize(co.source),
      csvSanitize(co.lifecycle_status),
      csvSanitize(contactName),
      csvSanitize(contact?.email),
      csvSanitize(contact?.phone),
      csvSanitize(opp?.stage),
      csvSanitize(opp?.estimated_value),
      csvSanitize(opp?.mrr_value),
      csvSanitize(opp?.next_action),
      csvSanitize(co.notes_summary),
      csvSanitize(co.created_at),
    ].map((v) => `"${v.replace(/"/g, '""')}"`).join(",")
  })

  const csv = [HEADERS.join(","), ...rows].join("\r\n")
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      "Content-Type":        "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clickonversion-companies-${date}.csv"`,
    },
  })
}
