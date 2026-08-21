import { notFound }     from "next/navigation"
import Link             from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StageBadge }   from "@/components/ui/badge"
import { formatCurrency, formatDate, formatRelativeDate, isOverdue } from "@/lib/utils"
import { ActivityTimeline }  from "@/components/crm/activity-timeline"
import { CompanyActions }    from "@/components/crm/company-actions"
import { ArrowLeft, Globe, Phone, MapPin, ExternalLink } from "lucide-react"
import type { OpportunityStage } from "@/types/database"

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: company },
    { data: activities },
    { data: tasks },
    { data: research },
  ] = await Promise.all([
    supabase
      .from("companies")
      .select(`
        *,
        opportunities(*),
        contacts(*)
      `)
      .eq("id", id)
      .single(),
    supabase
      .from("activities")
      .select("*")
      .eq("company_id", id)
      .order("occurred_at", { ascending: false })
      .limit(50),
    supabase
      .from("tasks")
      .select("*")
      .eq("company_id", id)
      .order("due_at", { ascending: true }),
    supabase
      .from("prospect_research")
      .select("*")
      .eq("company_id", id)
      .maybeSingle(),
  ])

  if (!company) notFound()

  const opp     = company.opportunities?.[0]
  const contact = company.contacts?.find((c: { is_primary: boolean }) => c.is_primary) ?? company.contacts?.[0]
  const openTasks = tasks?.filter((t) => !t.completed_at) ?? []

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/app/companies" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6">
        <ArrowLeft size={14} />
        Companies
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {company.website && (
              <a href={`https://${company.normalized_domain ?? company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#FF5A1F] transition-colors">
                <Globe size={13} />
                {company.normalized_domain ?? company.website}
              </a>
            )}
            {company.city && (
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin size={13} />
                {company.city}{company.state ? `, ${company.state}` : ""}
              </span>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#FF5A1F] transition-colors">
                <Phone size={13} />
                {company.phone}
              </a>
            )}
            {opp?.stage && <StageBadge stage={opp.stage as OpportunityStage} />}
          </div>
        </div>
        <CompanyActions company={company} opportunityId={opp?.id} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Opportunity */}
          {opp && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Active Opportunity</h2>
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Stage"       value={<StageBadge stage={opp.stage as OpportunityStage} />} />
                <Stat label="Est. Value"  value={formatCurrency(opp.estimated_value)} />
                <Stat label="MRR"         value={formatCurrency(opp.mrr_value)} />
                <Stat label="Close"       value={formatDate(opp.expected_close_date)} />
              </div>
              {/* Next action */}
              <div className={`mt-4 p-3 rounded-lg ${isOverdue(opp.next_action_at) ? "bg-amber-50 border border-amber-200" : "bg-slate-50"}`}>
                <p className="text-xs font-semibold text-slate-500 mb-1">Next Action</p>
                {opp.next_action ? (
                  <>
                    <p className="text-sm text-slate-900">{opp.next_action}</p>
                    {opp.next_action_at && (
                      <p className={`text-xs mt-1 ${isOverdue(opp.next_action_at) ? "text-amber-600" : "text-slate-400"}`}>
                        Due {formatRelativeDate(opp.next_action_at)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-amber-600 font-medium">⚠ No next action set</p>
                )}
              </div>
              {/* Links */}
              <div className="flex flex-wrap gap-2 mt-4">
                {opp.audit_url && <ExtLink href={opp.audit_url} label="Audit" />}
                {opp.loom_url && <ExtLink href={opp.loom_url} label="Loom" />}
                {opp.proposal_url && <ExtLink href={opp.proposal_url} label="Proposal" />}
              </div>
            </div>
          )}

          {/* Research */}
          {research && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Prospect Research</h2>
              <div className="grid gap-4">
                {[
                  ["SEO Issues", research.seo_issues],
                  ["Google Business", research.google_business_issues],
                  ["Ads Issues", research.ads_issues],
                  ["Website Issues", research.website_issues],
                  ["Conversion Issues", research.conversion_issues],
                  ["Opportunity Summary", research.opportunity_summary],
                  ["Personalization Notes", research.personalization_notes],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={String(label)}>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{String(label)}</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <ActivityTimeline activities={activities ?? []} companyId={id} opportunityId={opp?.id} />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Contact */}
          {contact && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Primary Contact</h2>
              <p className="font-medium text-slate-900">{contact.first_name} {contact.last_name}</p>
              {contact.job_title && <p className="text-xs text-slate-500">{contact.job_title}</p>}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="text-sm text-[#FF5A1F] hover:underline mt-1 block truncate">
                  {contact.email}
                </a>
              )}
              {contact.phone && <p className="text-sm text-slate-600 mt-0.5">{contact.phone}</p>}
              {contact.linkedin_url && (
                <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-[#FF5A1F] transition-colors mt-1 inline-flex items-center gap-1">
                  LinkedIn <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}

          {/* Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Open Tasks
              {openTasks.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
                  {openTasks.length}
                </span>
              )}
            </h2>
            {openTasks.length === 0 ? (
              <p className="text-sm text-slate-400">No open tasks.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {openTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-800">{task.title}</p>
                      {task.due_at && (
                        <p className={`text-xs ${isOverdue(task.due_at) ? "text-red-500" : "text-slate-400"}`}>
                          Due {formatRelativeDate(task.due_at)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Details</h2>
            <div className="flex flex-col gap-2">
              <Stat label="Industry" value={company.industry ?? "—"} />
              <Stat label="Source"   value={company.source ?? "—"} />
              <Stat label="Status"   value={company.lifecycle_status} />
              <Stat label="Added"    value={formatDate(company.created_at)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <div className="text-sm font-medium text-slate-800">{value}</div>
    </div>
  )
}

function ExtLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
    >
      {label}
      <ExternalLink size={11} />
    </a>
  )
}
