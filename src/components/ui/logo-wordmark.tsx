// Logo ClicKonversion v4 — identidad oficial
// Usar los SVGs de /public/brand/ en lugar del logo tipográfico manual.

interface LogoWordmarkProps {
  size?: "sm" | "md" | "lg" | "xl"
  /** "light" = sobre fondo claro (versión color), "dark" = sobre marino (versión blanca) */
  tone?: "light" | "dark"
  className?: string
}

const HEIGHTS: Record<string, number> = { sm: 22, md: 28, lg: 36, xl: 48 }

export function LogoWordmark({ size = "md", tone = "light", className }: LogoWordmarkProps) {
  const h = HEIGHTS[size]
  const src =
    tone === "dark"
      ? "/brand/clickonversion-logo-blanco.svg"
      : "/brand/clickonversion-logo-color.svg"
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="ClicKonversion"
      height={h}
      className={className}
      style={{ display: "block", height: h, width: "auto" }}
      draggable={false}
    />
  )
}

/** Isotipo (marca gráfica) para espacios pequeños: hero, widget WA, favicon. */
export function LogoSymbol({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  const src =
    inverted
      ? "/brand/clickonversion-isotipo-blanco.svg"
      : "/brand/clickonversion-isotipo-naranja.svg"
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      style={{ display: "block", width: size, height: "auto" }}
      draggable={false}
    />
  )
}
