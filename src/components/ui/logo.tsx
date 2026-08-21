import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  showWordmark?: boolean
  className?: string
}

const HEIGHTS: Record<string, number> = { sm: 28, md: 36, lg: 48 }
const TEXTS:   Record<string, string> = { sm: "text-base", md: "text-xl", lg: "text-2xl" }

export function Logo({
  variant = "light",
  size = "md",
  showWordmark = true,
  className,
}: LogoProps) {
  const h       = HEIGHTS[size]
  const isLight = variant === "light"

  // Light variant (dark backgrounds): white C+arrow, dark hole, orange K
  // Dark variant (light backgrounds): black C+arrow, white hole, orange K
  const cFill    = isLight ? "#FFFFFF" : "#0B0D0F"
  const holeFill = isLight ? "#0B0D0F" : "#FFFFFF"

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* CK symbol — exact paths from brand files, coordinate space 0-310 × 0-330 */}
      <svg
        height={h}
        viewBox="0 0 310 330"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ width: "auto", flexShrink: 0 }}
      >
        {/* C outer arc */}
        <path fill={cFill}    d="M190 0 C86 0 18 70 18 165 C18 260 86 330 190 330 L190 270 C124 270 79 226 79 165 C79 104 124 60 190 60 Z"/>
        {/* C inner counter */}
        <path fill={holeFill} d="M189 88 C139 88 105 119 105 165 C105 211 139 242 189 242 L189 206 C161 206 143 188 143 165 C143 142 161 124 189 124 Z"/>
        {/* Arrow */}
        <path fill={cFill}    d="M105 145 H190 L161 116 L183 94 L250 165 L183 236 L161 214 L190 185 H105 Z"/>
        {/* K */}
        <path fill="#FF5A1F"  d="M222 0 H300 L207 117 L250 161 L208 204 L300 330 H220 L160 248 L205 205 L160 160 L205 116 L160 72 Z"/>
      </svg>

      {showWordmark && (
        <>
          {/* Orange divider — matches brand horizontal logo files 04/05 */}
          <div
            aria-hidden="true"
            style={{ width: 1.5, height: h * 0.64, borderRadius: 1, flexShrink: 0 }}
            className="bg-[#FF5A1F]"
          />
          <span
            className={cn(
              TEXTS[size],
              "font-extrabold tracking-tight leading-none select-none",
              isLight ? "text-white" : "text-[#0B0D0F]",
            )}
          >
            Clic<span className="text-[#FF5A1F]">Konversion</span>
          </span>
        </>
      )}
    </div>
  )
}
