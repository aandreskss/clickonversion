import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg" | "xl"
  type?: "horizontal" | "compact" | "isotipo"
  className?: string
}

const HEIGHTS: Record<string, number> = { sm: 28, md: 36, lg: 48, xl: 64 }

export function Logo({
  variant = "light",
  size = "md",
  type = "horizontal",
  className,
}: LogoProps) {
  const h = HEIGHTS[size]

  const src = (() => {
    if (type === "isotipo") {
      return variant === "light"
        ? "/logos/03_isotipo_claro.png"
        : "/logos/07_isotipo_oscuro.png"
    }
    if (type === "compact") {
      return variant === "light"
        ? "/logos/02_logo_compacto_claro.png"
        : "/logos/06_logo_compacto_oscuro.png"
    }
    // horizontal (default)
    return variant === "light"
      ? "/logos/01_logo_horizontal_claro.png"
      : "/logos/05_logo_horizontal_oscuro.png"
  })()

  const aspectRatios: Record<string, number> = {
    horizontal: 4.2,
    compact: 1.6,
    isotipo: 1,
  }

  const ratio = aspectRatios[type] ?? 4.2
  const w = Math.round(h * ratio)

  return (
    <Image
      src={src}
      alt="ClicKonversion — Strategy · Technology · Growth"
      width={w}
      height={h}
      priority
      className={cn("object-contain", className)}
      style={{ height: h, width: "auto", maxWidth: w }}
    />
  )
}
