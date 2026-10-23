"use client"

import type { RequestPriority } from "@/types/admin"

interface PriorityBadgeProps {
  priority: RequestPriority
  size?: "sm" | "md"
}

const PRIORITY_CONFIG: Record<
  RequestPriority,
  { color: string; label: string; pulse?: boolean }
> = {
  low:    { color: "#8A9099", label: "Baja" },
  normal: { color: "#60A5FA", label: "Normal" },
  high:   { color: "#F97316", label: "Alta" },
  urgent: { color: "#EF4444", label: "Urgente", pulse: true },
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] ?? { color: "#8A9099", label: priority }
  const { color, label, pulse } = config

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : "text-sm px-3 py-1"

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${pulse ? "animate-pulse" : ""}`}
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  )
}
