import { formatCurrency } from "@/lib/utils"

interface GoalProgressProps {
  current: number
  goal: number
}

export function GoalProgress({ current, goal }: GoalProgressProps) {
  const pct     = Math.min(Math.round((current / goal) * 100), 100)
  const reached = current >= goal

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">MRR Goal</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{formatCurrency(current)}</span>
            <span className="text-sm text-slate-400">/ {formatCurrency(goal)}</span>
          </div>
        </div>
        <div className="text-right">
          <span
            className="text-2xl font-bold"
            style={{ color: reached ? "#22C55E" : "#FF5A1F" }}
          >
            {pct}%
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            {reached ? "Goal reached!" : `${formatCurrency(goal - current)} to go`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: reached
              ? "linear-gradient(90deg, #22C55E, #16A34A)"
              : "linear-gradient(90deg, #FF5A1F, #FF8A50)",
          }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-label={`MRR progress: ${formatCurrency(current)} of ${formatCurrency(goal)} goal`}
        />
      </div>

      {/* Milestones */}
      <div className="mt-3 flex justify-between">
        {[0, 25, 50, 75, 100].map((m) => (
          <span
            key={m}
            className="text-xs"
            style={{ color: pct >= m ? "#FF5A1F" : "#CBD5E1" }}
          >
            {m}%
          </span>
        ))}
      </div>
    </div>
  )
}
