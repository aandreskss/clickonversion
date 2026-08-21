import { cn } from "@/lib/utils"
import type { OpportunityStage } from "@/types/database"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info" | "brand" | "muted"
  size?: "sm" | "md"
  className?: string
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        variant === "default" && "bg-white/8 text-[#B0B8C1] border border-white/10",
        variant === "success" && "bg-green-500/12 text-green-400 border border-green-500/20",
        variant === "warning" && "bg-amber-500/12 text-amber-400 border border-amber-500/20",
        variant === "danger"  && "bg-red-500/12  text-red-400  border border-red-500/20",
        variant === "info"    && "bg-blue-500/12 text-blue-400 border border-blue-500/20",
        variant === "brand"   && "bg-[#FF5A1F]/12 text-[#FF5A1F] border border-[#FF5A1F]/20",
        variant === "muted"   && "bg-white/5 text-[#546072] border border-white/8",
        className
      )}
    >
      {children}
    </span>
  )
}

const STAGE_CONFIG: Record<OpportunityStage, { label: string; variant: BadgeProps["variant"] }> = {
  NEW:          { label: "New",          variant: "muted"   },
  QUALIFIED:    { label: "Qualified",    variant: "info"    },
  CONTACTED:    { label: "Contacted",    variant: "default" },
  REPLIED:      { label: "Replied",      variant: "brand"   },
  AUDIT_SENT:   { label: "Audit Sent",   variant: "brand"   },
  CALL_BOOKED:  { label: "Call Booked",  variant: "warning" },
  PROPOSAL:     { label: "Proposal",     variant: "warning" },
  WON:          { label: "Won",          variant: "success" },
  LOST:         { label: "Lost",         variant: "danger"  },
  NURTURE:      { label: "Nurture",      variant: "muted"   },
}

export function StageBadge({ stage, className }: { stage: OpportunityStage; className?: string }) {
  const config = STAGE_CONFIG[stage]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: "low" | "normal" | "high" }) {
  const map = {
    low:    { label: "Low",    variant: "muted"   as const },
    normal: { label: "Normal", variant: "default" as const },
    high:   { label: "High",   variant: "warning" as const },
  }
  const { label, variant } = map[priority]
  return <Badge variant={variant}>{label}</Badge>
}
