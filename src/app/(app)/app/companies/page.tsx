import Link             from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StageBadge }   from "@/components/ui/badge"
import { formatRelativeDate, formatCurrency } from "@/lib/utils"
import { Plus, Search, Download } from "lucide-react"
import type { OpportunityStage } from "@/types/database"

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stage?: string; industry?: string }>
}) {
  const { q, industry } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("companies")
    .select(`
      id, name, city, state, industry, website, source, lifecycle_status, created_at,
      opportunities(id, stage, estimated_value, mrr_value, next_action, next_action_at),
      contacts(id, first_name, last_name, email, is_primary)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (q) {
    query = query.or(`name.ilike.%${q}%,normalized_domain.ilike.%${q}%`)
  }
  if (industry) {
    query = query.ilike("industry", `%${industry}%`)
  }

  const { data: companies } = await query

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">{companies?.length ?? 0} prospects</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/export/companies"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </a>
          <Link
            href="/app/companies/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E54A15] transition-colors"
          >
            <Plus size={16} />
            Add Company
          </Link>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search companies…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F]/60"
          />
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Industry</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Value</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Next Action</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!companies?.length ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No companies yet.{" "}
                    <Link href="/app/companies/new" className="text-[#FF5A1F] hover:underline">
                      Add your first prospect
                    </Link>
                  </td>
                </tr>
              ) : (
                companies.map((company) => {
                  const opp = company.opportunities?.[0]
                  const contact = company.contacts?.find((c) => c.is_primary) ?? company.contacts?.[0]

                  return (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/app/companies/${company.id}`} className="hover:text-[#FF5A1F] transition-colors">
                          <p className="font-medium text-slate-900">{company.name}</p>
                          {contact && (
                            <p className="text-xs text-slate-400">{contact.first_name} {contact.last_name}</p>
                          )}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate-600 hidden md:table-cell">
                        {company.city ? `${company.city}${company.state ? ", " + company.state : ""}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600 hidden lg:table-cell">
                        {company.industry ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        {opp?.stage ? (
                          <StageBadge stage={opp.stage as OpportunityStage} />
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-700 font-medium hidden xl:table-cell">
                        {opp?.estimated_value ? formatCurrency(opp.estimated_value) : "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs hidden xl:table-cell max-w-[200px] truncate">
                        {opp?.next_action ?? <span className="text-amber-500">Not set</span>}
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-xs hidden lg:table-cell">
                        {formatRelativeDate(company.created_at)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
