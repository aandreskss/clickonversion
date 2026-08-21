import { createClient }    from "@/lib/supabase/server"
import { formatCurrency }  from "@/lib/utils"
import { StageBadge }      from "@/components/ui/badge"
import { GoalProgress }    from "@/components/crm/goal-progress"
import { TodayView }       from "@/components/crm/today-view"
import type { Opportunity } from "@/types/database"

const MRR_GOAL = 2000

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { data: wonOpps },
    { data: allOpps },
    { data: companies },
    { count: newCount },
    { count: contactedCount },
    { count: callCount },
    { count: proposalCount },
  ] = await Promise.all([
    supabase.from("opportunities").select("mrr_value, won_at").eq("stage", "WON"),
    supabase.from("opportunities").select("id, stage, company_id, name, next_action, next_action_at, estimated_value, mrr_value").neq("stage", "LOST"),
    supabase.from("companies").select("id, name, lifecycle_status").limit(1000),
    supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("stage", "NEW"),
    supabase.from("opportunities").select("id", { count: "exact", head: true }).in("stage", ["CONTACTED","REPLIED"]),
    supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("stage", "CALL_BOOKED"),
    supabase.from("opportunities").select("id", { count: "exact", head: true }).eq("stage", "PROPOSAL"),
  ])

  const currentMRR = wonOpps?.reduce((sum, o) => sum + (o.mrr_value ?? 0), 0) ?? 0
  const pipelineValue = allOpps?.reduce((sum, o) => sum + (o.estimated_value ?? 0), 0) ?? 0
  const wonCount = wonOpps?.length ?? 0
  const totalProspects = companies?.length ?? 0

  const today    = new Date()

  const { data: overdueOpps } = await supabase
    .from("opportunities")
    .select("id, name, next_action, next_action_at, stage, company_id")
    .not("stage", "in", '("WON","LOST")')
    .or(`next_action_at.lt.${today.toISOString()},next_action.is.null`)
    .order("next_action_at", { ascending: true })
    .limit(10)

  const { data: overdueTasks } = await supabase
    .from("tasks")
    .select("id, title, due_at, priority, company_id")
    .is("completed_at", null)
    .lt("due_at", today.toISOString())
    .order("due_at", { ascending: true })
    .limit(10)

  const KPI_CARDS = [
    { label: "Total Prospects",  value: String(totalProspects),         sub: "companies" },
    { label: "New",              value: String(newCount ?? 0),           sub: "this stage" },
    { label: "Contacted",        value: String(contactedCount ?? 0),     sub: "contacted + replied" },
    { label: "Calls Booked",     value: String(callCount ?? 0),          sub: "this stage" },
    { label: "Proposals",        value: String(proposalCount ?? 0),      sub: "active" },
    { label: "Won Clients",      value: String(wonCount),                sub: "total" },
    { label: "Pipeline",         value: formatCurrency(pipelineValue),   sub: "active value" },
    { label: "Current MRR",      value: formatCurrency(currentMRR),      sub: "won" },
  ]

  const recentOpps = (allOpps ?? []).slice(0, 5)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* MRR Goal */}
      <div className="mb-8">
        <GoalProgress current={currentMRR} goal={MRR_GOAL} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Today View + Recent Opps */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today */}
        <TodayView
          overdueOpps={overdueOpps ?? []}
          overdueTasks={overdueTasks ?? []}
        />

        {/* Active pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Active Pipeline</h2>
          {recentOpps.length === 0 ? (
            <p className="text-sm text-slate-400">No active opportunities. Add your first prospect.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOpps.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[180px]">{opp.name}</p>
                    <p className="text-xs text-slate-500">
                      {opp.next_action ?? <span className="text-amber-500 font-medium">No next action</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {opp.estimated_value ? (
                      <span className="text-xs font-semibold text-slate-700">{formatCurrency(opp.estimated_value)}</span>
                    ) : null}
                    <StageBadge stage={opp.stage as Opportunity["stage"]} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
