import { db }             from "@/lib/db"
import { companies, opportunities, tasks } from "@/lib/db/schema"
import { eq, ne, inArray, not, or, and, isNull, lt, asc, sql } from "drizzle-orm"
import { formatCurrency }  from "@/lib/utils"
import { StageBadge }      from "@/components/ui/badge"
import { GoalProgress }    from "@/components/crm/goal-progress"
import { TodayView }       from "@/components/crm/today-view"
import type { Opportunity } from "@/types/database"

const MRR_GOAL = 2000

export default async function DashboardPage() {
  const today = new Date()

  const [
    wonOpps,
    allOpps,
    allCompanies,
    [{ count: newCount }],
    [{ count: contactedCount }],
    [{ count: callCount }],
    [{ count: proposalCount }],
    overdueOpps,
    overdueTasks,
  ] = await Promise.all([
    db.select({ mrrValue: opportunities.mrrValue, wonAt: opportunities.wonAt })
      .from(opportunities)
      .where(eq(opportunities.stage, "WON")),

    db.select({
      id: opportunities.id,
      stage: opportunities.stage,
      companyId: opportunities.companyId,
      name: opportunities.name,
      nextAction: opportunities.nextAction,
      nextActionAt: opportunities.nextActionAt,
      estimatedValue: opportunities.estimatedValue,
      mrrValue: opportunities.mrrValue,
    })
      .from(opportunities)
      .where(ne(opportunities.stage, "LOST")),

    db.select({ id: companies.id, name: companies.name, lifecycleStatus: companies.lifecycleStatus })
      .from(companies)
      .limit(1000),

    db.select({ count: sql<number>`count(*)::int` }).from(opportunities).where(eq(opportunities.stage, "NEW")),
    db.select({ count: sql<number>`count(*)::int` }).from(opportunities).where(inArray(opportunities.stage, ["CONTACTED", "REPLIED"])),
    db.select({ count: sql<number>`count(*)::int` }).from(opportunities).where(eq(opportunities.stage, "CALL_BOOKED")),
    db.select({ count: sql<number>`count(*)::int` }).from(opportunities).where(eq(opportunities.stage, "PROPOSAL")),

    db.select({
      id: opportunities.id,
      name: opportunities.name,
      next_action: opportunities.nextAction,
      next_action_at: sql<string | null>`${opportunities.nextActionAt}::text`,
      stage: opportunities.stage,
      company_id: opportunities.companyId,
    })
      .from(opportunities)
      .where(
        and(
          not(inArray(opportunities.stage, ["WON", "LOST"])),
          or(lt(opportunities.nextActionAt, today), isNull(opportunities.nextAction)),
        )
      )
      .orderBy(asc(opportunities.nextActionAt))
      .limit(10),

    db.select({
      id: tasks.id,
      title: tasks.title,
      due_at: sql<string | null>`${tasks.dueAt}::text`,
      priority: tasks.priority,
      company_id: tasks.companyId,
    })
      .from(tasks)
      .where(and(isNull(tasks.completedAt), lt(tasks.dueAt, today)))
      .orderBy(asc(tasks.dueAt))
      .limit(10),
  ])

  const currentMRR = wonOpps.reduce((sum, o) => sum + Number(o.mrrValue ?? 0), 0)
  const pipelineValue = allOpps.reduce((sum, o) => sum + Number(o.estimatedValue ?? 0), 0)
  const wonCount = wonOpps.length
  const totalProspects = allCompanies.length

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

  const recentOpps = allOpps.slice(0, 5)

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
          overdueOpps={overdueOpps}
          overdueTasks={overdueTasks}
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
                      {opp.nextAction ?? <span className="text-amber-500 font-medium">No next action</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {opp.estimatedValue ? (
                      <span className="text-xs font-semibold text-slate-700">{formatCurrency(Number(opp.estimatedValue))}</span>
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
