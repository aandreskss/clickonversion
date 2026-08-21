import Link             from "next/link"
import { createClient } from "@/lib/supabase/server"
import { StageBadge }   from "@/components/ui/badge"
import { formatCurrency, formatRelativeDate, isOverdue } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import type { OpportunityStage } from "@/types/database"

const ACTIVE_STAGES: OpportunityStage[] = [
  "NEW", "QUALIFIED", "CONTACTED", "REPLIED",
  "AUDIT_SENT", "CALL_BOOKED", "PROPOSAL",
]


export default async function PipelinePage() {
  const supabase = await createClient()

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(`
      id, name, stage, estimated_value, mrr_value,
      next_action, next_action_at, source, created_at,
      company:companies(id, name, city, industry)
    `)
    .in("stage", [...ACTIVE_STAGES, "NURTURE"])
    .order("created_at", { ascending: false })

  const byStage: Record<string, typeof opportunities> = {}
  for (const stage of [...ACTIVE_STAGES, "NURTURE" as OpportunityStage]) {
    byStage[stage] = opportunities?.filter((o) => o.stage === stage) ?? []
  }

  const totalPipeline = opportunities?.reduce((s, o) => s + (o.estimated_value ?? 0), 0) ?? 0

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">
            {opportunities?.length ?? 0} active opportunities · {formatCurrency(totalPipeline)} total
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
            const stageValue = cards.reduce((s, o) => s + (o.estimated_value ?? 0), 0)

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
                      const overdue = isOverdue(opp.next_action_at)
                      const noAction = !opp.next_action
                      // Supabase returns arrays for joins; grab first element
                      const company = Array.isArray(opp.company) ? opp.company[0] : opp.company
                      const co = company as { id?: string; name?: string; city?: string; industry?: string } | null

                      return (
                        <Link
                          key={opp.id}
                          href={`/app/companies/${co?.id ?? ""}`}
                          className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
                        >
                          <p className="text-sm font-semibold text-slate-900 leading-tight mb-0.5">
                            {co?.name ?? opp.name}
                          </p>
                          {co?.city && (
                            <p className="text-xs text-slate-400 mb-2">
                              {co.city}
                              {co.industry ? ` · ${co.industry}` : ""}
                            </p>
                          )}

                          {opp.estimated_value ? (
                            <p className="text-sm font-bold text-slate-800 mb-2">{formatCurrency(opp.estimated_value)}</p>
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
                                  {opp.next_action}
                                </p>
                                {opp.next_action_at && (
                                  <p className={`mt-0.5 ${overdue ? "text-red-500" : "text-slate-400"}`}>
                                    {formatRelativeDate(opp.next_action_at)}
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
