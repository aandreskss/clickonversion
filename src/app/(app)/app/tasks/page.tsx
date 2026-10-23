import { db }              from "@/lib/db"
import { tasks, companies } from "@/lib/db/schema"
import { isNull, eq, asc }  from "drizzle-orm"
import { PriorityBadge }    from "@/components/ui/badge"
import { formatRelativeDate, isOverdue, isDueToday } from "@/lib/utils"
import { TaskActions }      from "@/components/crm/task-actions"

export default async function TasksPage() {
  const rows = await db
    .select({
      id:          tasks.id,
      title:       tasks.title,
      description: tasks.description,
      dueAt:       tasks.dueAt,
      priority:    tasks.priority,
      companyId:   tasks.companyId,
      companyName: companies.name,
    })
    .from(tasks)
    .leftJoin(companies, eq(tasks.companyId, companies.id))
    .where(isNull(tasks.completedAt))
    .orderBy(asc(tasks.dueAt))

  type NormalizedTask = {
    id: string
    title: string
    description: string | null
    due_at: string | null
    priority: string
    company: { id: string; name: string } | null
  }

  const normalized: NormalizedTask[] = rows.map((t) => ({
    id:          t.id,
    title:       t.title,
    description: t.description ?? null,
    due_at:      t.dueAt?.toISOString() ?? null,
    priority:    t.priority,
    company:     t.companyId && t.companyName
      ? { id: t.companyId, name: t.companyName }
      : null,
  }))

  const overdue  = normalized.filter((t) => t.due_at && isOverdue(t.due_at))
  const today    = normalized.filter((t) => t.due_at && isDueToday(t.due_at))
  const upcoming = normalized.filter((t) => !t.due_at || (!isOverdue(t.due_at) && !isDueToday(t.due_at)))

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        <p className="text-sm text-slate-500 mt-1">{normalized.length} open tasks</p>
      </div>

      {normalized.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">No open tasks. You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <TaskGroup title="Overdue"   tasks={overdue}   accent="red" />
          <TaskGroup title="Due Today" tasks={today}     accent="amber" />
          <TaskGroup title="Upcoming"  tasks={upcoming}  accent="slate" />
        </div>
      )}
    </div>
  )
}

function TaskGroup({
  title,
  tasks,
  accent,
}: {
  title: string
  tasks: Array<{
    id: string
    title: string
    description: string | null
    due_at: string | null
    priority: string
    company: { id: string; name: string } | null
  }>
  accent: "red" | "amber" | "slate"
}) {
  if (tasks.length === 0) return null

  const accentColors = {
    red:   "text-red-600 border-red-200 bg-red-50/50",
    amber: "text-amber-600 border-amber-200 bg-amber-50/50",
    slate: "text-slate-600 border-slate-200 bg-slate-50/50",
  }

  return (
    <div>
      <h2 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">
        {title} ({tasks.length})
      </h2>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-4 rounded-xl border ${accentColors[accent]} bg-white`}
          >
            <TaskActions taskId={task.id} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                <PriorityBadge priority={task.priority as "low" | "normal" | "high"} />
              </div>
              {task.description && (
                <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
              )}
              <div className="flex items-center gap-3 mt-1.5">
                {task.company && (
                  <span className="text-xs text-[#FF5A1F]">{task.company.name}</span>
                )}
                {task.due_at && (
                  <span className={`text-xs ${isOverdue(task.due_at) ? "text-red-500" : "text-slate-400"}`}>
                    {formatRelativeDate(task.due_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
