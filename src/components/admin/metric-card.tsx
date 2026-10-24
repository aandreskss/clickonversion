import type { ComponentType } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MetricCardProps {
  title:     string
  value:     number | string
  subtitle?: string
  icon:      ComponentType<{ className?: string }>
  variant?:  "default" | "success" | "warning" | "danger"
  trend?:    { value: number; label: string }
  prefix?:   string
  suffix?:   string
}

const VARIANT_COLORS: Record<NonNullable<MetricCardProps["variant"]>, string> = {
  default: "#60A5FA",
  success: "#22C55E",
  warning: "#F59E0B",
  danger:  "#EF4444",
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
  prefix,
  suffix,
}: MetricCardProps) {
  const iconColor = VARIANT_COLORS[variant]
  const isPositiveTrend = trend && trend.value >= 0

  return (
    <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[#8A9099] text-sm font-medium">{title}</p>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <span style={{ color: iconColor }} className="flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold text-[#F7F7F3]">
          {prefix && <span className="text-xl mr-0.5">{prefix}</span>}
          {typeof value === "number" ? value.toLocaleString("es-ES") : value}
          {suffix && <span className="text-xl ml-0.5">{suffix}</span>}
        </span>
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <div
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: isPositiveTrend ? "#22C55E" : "#EF4444" }}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositiveTrend ? "+" : ""}
                {trend.value}%
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-[#8A9099] text-sm">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  )
}
