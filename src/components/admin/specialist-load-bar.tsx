"use client"

interface SpecialistLoadBarProps {
  current:     number
  max:         number
  showLabel?:  boolean
}

function getBarColor(percentage: number): string {
  if (percentage > 90) return "#EF4444"
  if (percentage >= 70) return "#F59E0B"
  return "#22C55E"
}

export function SpecialistLoadBar({
  current,
  max,
  showLabel = true,
}: SpecialistLoadBarProps) {
  const safeMax = max > 0 ? max : 1
  const percentage = Math.min((current / safeMax) * 100, 100)
  const barColor = getBarColor(percentage)

  return (
    <div className="w-full">
      <div className="w-full bg-[#3D4A5C] rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-[#8A9099] mt-1">
          {current} / {max} activos
        </p>
      )}
    </div>
  )
}
