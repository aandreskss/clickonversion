import Link             from "next/link"
import { db }           from "@/lib/db"
import { opportunities, companies } from "@/lib/db/schema"
import { inArray, desc, eq } from "drizzle-orm"
import { StageBadge }   from "@/components/ui/badge"
import { formatCurrency, formatRelativeDate, isOverdue } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import type { OpportunityStage } from "@/types/database"

const ACTIVE_STAGES: OpportunityStage[] = [
  "NEW", "QUALIFIED", "CONTACTED", "REPLIED",
  "AUDIT_SENT", "CALL_BOOKED", "PROPOSAL",
]


export default async function PipelinePage() {
  const rows = await db
    .select({
      id: opportunities.id,
      name: opportunities.name,
      stage: opportunities.stage,
      estimatedValue: opportunities.estimatedValue,
      mrrValue: opportunities.mrrValue,
      nextAction: opportunities.nextAction,
      nextActionAt: opportunities.nextActionAt,
      source: opportunities.source,
      createdAt: opportunities.createdAt,
      companyId: opportunities.companyId,
      companyName: companies.name,
      companyCity: companies.city,
      companyIndustry: companies.industry,
    })
    .from(opportunities)
    .leftJoin(companies, eq(opportunities.companyId, companies.id))
    .where(inArray(opportunities.stage, [...ACTIVE_STAGES, "NURTURE" as OpportunityStage]))
    .orderBy(desc(opportunities.createdAt))

  const byStage: Record<string, typeof rows> = {}
  for (const stage of [...ACTIVE_STAGES, "NURTURE" as OpportunityStage]) {
    byStage[stage] = rows.filter((o) => o.stage === stage)
  }

  const totalPipeline = rows.reduce((s, o) => s + Number(o.estimatedValue ?? 0), 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">
            {rows.length} active opportunities · {formatCurrency(totalPipeline)} total
          </p>
        </div>
        <Link
          href="/app/companies/new"
          className="px-4 py-2 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E54A15] transition-colors"
        >
          + Add Prospect
        </Link>
      </div>

      {/* Pipeline boards */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {[...ACTIVE_STAGES, "NURTURE" as OpportunityStage].map((stage) => {
            const cards = byStage[stage] ?? []
            const stageValue = cards.reduce((s, o) => s + Number(o.estimatedValue ?? 0), 0)

            return (
              <div key={stage} className="w-64 flex-shrink-0">
                {/* Column header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StageBadge stage={stage} />
                    <span className="text-xs text-slate-400">({cards.length})</span>
                  </div>
                  {stageValue > 0 && (
                    <span className="text-xs font-semibold text-slate-600">{formatCurrency(stageValue)}</span>
                  )}
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3">
                  {cards.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center">
                      <p className="text-xs text-slate-400">Empty</p>
                    </div>
                  ) : (
                    cards.map((opp) => {
                      const overdue = isOverdue(opp.nextActionAt?.toISOString() ?? null)
                      const noAction = !opp.nextAction

                      return (
                        <Link
                          key={opp.id}
                          href={`/app/companies/${opp.companyId ?? ""}`}
                          className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
                        >
                          <p className="text-sm font-semibold text-slate-900 leading-tight mb-0.5">
                            {opp.companyName ?? opp.name}
                          </p>
                          {opp.companyCity && (
                            <p className="text-xs text-slate-400 mb-2">
                              {opp.companyCity}
                              {opp.companyIndustry ? ` · ${opp.companyIndustry}` : ""}
                            </p>
                          )}

                          {opp.estimatedValue ? (
                            <p className="text-sm font-bold text-slate-800 mb-2">{formatCurrency(Number(opp.estimatedValue))}</p>
                          ) : null}

                          {/* Next action */}
                          <div className={`p-2 rounded-lg text-xs ${overdue || noAction ? "bg-amber-50" : "bg-slate-50"}`}>
                            {noAction ? (
                              <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <AlertTriangle size={11} />
                                No next action
                              </span>
                            ) : (
                              <>
                                <p className={`truncate ${overdue ? "text-amber-700" : "text-slate-600"}`}>
                                  {opp.nextAction}
                                </p>
                                {opp.nextActionAt && (
                                  <p className={`mt-0.5 ${overdue ? "text-red-500" : "text-slate-400"}`}>
                                    {formatRelativeDate(opp.nextActionAt.toISOString())}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </Link>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
