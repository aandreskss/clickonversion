import Link               from "next/link"
import { AlertTriangle, Clock } from "lucide-react"
import { formatRelativeDate } from "@/lib/utils"

interface OverdueOpp {
  id: string
  name: string
  next_action: string | null
  next_action_at: string | null
  stage: string
  company_id: string
}

interface OverdueTask {
  id: string
  title: string
  due_at: string | null
  priority: string
  company_id: string | null
}

interface TodayViewProps {
  overdueOpps:  OverdueOpp[]
  overdueTasks: OverdueTask[]
}

export function TodayView({ overdueOpps, overdueTasks }: TodayViewProps) {
  const totalItems = overdueOpps.length + overdueTasks.length

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-slate-900">What needs attention today</h2>
        {totalItems > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full">
            {totalItems}
          </span>
        )}
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-3">
            <span className="text-green-500 text-lg">✓</span>
          </div>
          <p className="text-sm font-medium text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">No overdue follow-ups or tasks.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Overdue opportunities */}
          {overdueOpps.slice(0, 5).map((opp) => (
            <Link
              key={opp.id}
              href={`/app/companies/${opp.company_id}`}
              className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50/50 hover:bg-amber-50 transition-colors"
            >
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{opp.name}</p>
                <p className="text-xs text-slate-500">
                  {opp.next_action
                    ? `Action: ${opp.next_action}`
                    : <span className="text-amber-600 font-medium">No next action set</span>
                  }
                </p>
                {opp.next_action_at && (
                  <p className="text-xs text-red-500 mt-0.5">
                    Due {formatRelativeDate(opp.next_action_at)}
                  </p>
                )}
              </div>
            </Link>
          ))}

          {/* Overdue tasks */}
          {overdueTasks.slice(0, 5).map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/50"
            >
              <Clock size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                {task.due_at && (
                  <p className="text-xs text-red-500 mt-0.5">
                    Due {formatRelativeDate(task.due_at)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {(overdueOpps.length > 5 || overdueTasks.length > 5) && (
            <p className="text-xs text-slate-400 text-center mt-1">
              + more items — check Pipeline and Tasks
            </p>
          )}
        </div>
      )}
    </div>
  )
}
