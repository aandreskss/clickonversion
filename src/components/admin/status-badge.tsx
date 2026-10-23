"use client"

import type { AdminRequestStatus } from "@/types/admin"

interface StatusBadgeProps {
  status: AdminRequestStatus
  size?: "sm" | "md"
}

const STATUS_CONFIG: Record<
  AdminRequestStatus,
  { color: string; label: string }
> = {
  pending_payment:        { color: "#546072", label: "Pend. pago" },
  pending_onboarding:     { color: "#546072", label: "En cola" },
  queued:                 { color: "#3B82F6", label: "En cola" },
  waiting_client:         { color: "#F59E0B", label: "Esp. cliente" },
  consultation_scheduled: { color: "#8B5CF6", label: "Asesoría prog." },
  in_progress:            { color: "#FF5A1F", label: "En progreso" },
  active:                 { color: "#FF5A1F", label: "En progreso" },
  waiting_third_party:    { color: "#F97316", label: "Esp. tercero" },
  review:                 { color: "#6366F1", label: "En revisión" },
  paused:                 { color: "#F59E0B", label: "En pausa" },
  completed:              { color: "#22C55E", label: "Completado" },
  cancelled:              { color: "#EF4444", label: "Cancelado" },
  refunded:               { color: "#3D4A5C", label: "Reembolsado" },
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { color: "#546072", label: status }
  const { color, label } = config

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : "text-sm px-3 py-1"

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
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
