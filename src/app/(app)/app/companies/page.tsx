import Link             from "next/link"
import { db }           from "@/lib/db"
import { companies, opportunities, contacts } from "@/lib/db/schema"
import { eq, desc, like, and, or, inArray, SQL } from "drizzle-orm"
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

  const filters: SQL[] = []
  if (q) {
    filters.push(
      or(
        like(companies.name, `%${q}%`),
        like(companies.normalizedDomain, `%${q}%`),
      )!
    )
  }
  if (industry) {
    filters.push(like(companies.industry, `%${industry}%`))
  }

  const whereClause = filters.length === 0
    ? undefined
    : filters.length === 1
      ? filters[0]
      : and(...(filters as [SQL, ...SQL[]]))

  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      city: companies.city,
      state: companies.state,
      industry: companies.industry,
      website: companies.website,
      source: companies.source,
      lifecycleStatus: companies.lifecycleStatus,
      createdAt: companies.createdAt,
    })
    .from(companies)
    .where(whereClause)
    .orderBy(desc(companies.createdAt))
    .limit(100)

  // Fetch related data for each company
  const companyIds = rows.map((c) => c.id)

  const [allOpps, allContacts] = companyIds.length > 0
    ? await Promise.all([
        db.select({
          id: opportunities.id,
          companyId: opportunities.companyId,
          stage: opportunities.stage,
          estimatedValue: opportunities.estimatedValue,
          mrrValue: opportunities.mrrValue,
          nextAction: opportunities.nextAction,
          nextActionAt: opportunities.nextActionAt,
        }).from(opportunities).where(inArray(opportunities.companyId, companyIds)),
        db.select({
          id: contacts.id,
          companyId: contacts.companyId,
          firstName: contacts.firstName,
          lastName: contacts.lastName,
          email: contacts.email,
          isPrimary: contacts.isPrimary,
        }).from(contacts).where(inArray(contacts.companyId, companyIds)),
      ])
    : [[], []]

  const oppsByCompany = new Map<string, typeof allOpps[0]>()
  for (const opp of allOpps) {
    if (!oppsByCompany.has(opp.companyId)) {
      oppsByCompany.set(opp.companyId, opp)
    }
  }

  const contactsByCompany = new Map<string, typeof allContacts[0]>()
  for (const contact of allContacts) {
    if (!contact.companyId) continue
    if (contact.isPrimary || !contactsByCompany.has(contact.companyId)) {
      contactsByCompany.set(contact.companyId, contact)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-sm text-slate-500 mt-1">{rows.length} prospects</p>
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
              {!rows.length ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No companies yet.{" "}
                    <Link href="/app/companies/new" className="text-[#FF5A1F] hover:underline">
                      Add your first prospect
                    </Link>
                  </td>
                </tr>
              ) : (
                rows.map((company) => {
                  const opp = oppsByCompany.get(company.id)
                  const contact = contactsByCompany.get(company.id)

                  return (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <Link href={`/app/companies/${company.id}`} className="hover:text-[#FF5A1F] transition-colors">
                          <p className="font-medium text-slate-900">{company.name}</p>
                          {contact && (
                            <p className="text-xs text-slate-400">{contact.firstName} {contact.lastName}</p>
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
                        {opp?.estimatedValue ? formatCurrency(Number(opp.estimatedValue)) : "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs hidden xl:table-cell max-w-[200px] truncate">
                        {opp?.nextAction ?? <span className="text-amber-500">Not set</span>}
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-xs hidden lg:table-cell">
                        {formatRelativeDate(company.createdAt.toISOString())}
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
