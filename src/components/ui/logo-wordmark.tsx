// Logo ClicKonversion v4 (manual de identidad)
// "Click" en marino (la máquina) + "on" en naranja (lo humano) + "v" flecha de crecimiento.
// El punto de la «i» es un globo de chat y sobre la «o» van 3 chispas trazadas a mano.

interface LogoWordmarkProps {
  size?: "sm" | "md" | "lg" | "xl"
  /** "light" = sobre fondos claros (marino), "dark" = sobre marino (blanco) */
  tone?: "light" | "dark"
  className?: string
}

const SIZES = { sm: 26, md: 30, lg: 40, xl: 56 }

export function LogoWordmark({ size = "md", tone = "light", className }: LogoWordmarkProps) {
  const fs = SIZES[size]
  const ink = tone === "dark" ? "#FFFFFF" : "#010E25"
  return (
    <span
      className={className}
      aria-label="ClicKonversion"
      role="img"
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: "var(--font-outfit), 'Outfit', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: fs,
        letterSpacing: "-0.045em",
        lineHeight: 1,
        color: ink,
        paddingTop: "0.42em",
        userSelect: "none",
      }}
    >
      <span aria-hidden="true">Cl</span>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>
        ı
        <svg viewBox="0 0 20 20" style={{ position: "absolute", left: "50%", bottom: "0.56em", width: "0.3em", height: "0.3em", transform: "translateX(-46%)", overflow: "visible" }}>
          <circle cx="11" cy="9" r="8" fill="#FE5C02" />
          <path d="M5 14 L1.5 19.5 L10 16.5 Z" fill="#FE5C02" />
        </svg>
      </span>
      <span aria-hidden="true">ck</span>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-block", color: "#FE5C02" }}>
        o
        <svg viewBox="0 0 40 26" style={{ position: "absolute", left: "50%", bottom: "0.57em", width: "0.42em", height: "0.27em", transform: "translateX(-50%)", overflow: "visible" }}>
          <path className="ck-sk" d="M7 23 Q5 16 2 12" />
          <path className="ck-sk" d="M20 21 Q19.5 12 21 3" />
          <path className="ck-sk" d="M33 23 Q36 16 38 12" />
        </svg>
      </span>
      <span aria-hidden="true" style={{ color: "#FE5C02" }}>n</span>
      <svg aria-hidden="true" viewBox="0 0 32 30" style={{ width: "0.6em", height: "0.56em", marginLeft: "0.02em", overflow: "visible" }}>
        <path className="ck-vk" d="M3 12 L13 27 L29 5" />
        <path className="ck-vk" d="M18 5 H29 V16" />
      </svg>
    </span>
  )
}

/** Símbolo: globo de chat con chispas (favicon, avatar, app). */
export function LogoSymbol({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  const bubble = inverted ? "#FFFFFF" : "#FE5C02"
  const dots = inverted ? "#FE5C02" : "#FFFFFF"
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width={size} height={size} style={{ overflow: "visible" }}>
      <path className={inverted ? "ck-sk-w" : "ck-sk-sym"} d="M20 14 Q17 9 14 6" />
      <path className={inverted ? "ck-sk-w" : "ck-sk-sym"} d="M32 12 Q31.5 6 33 1.5" />
      <path className={inverted ? "ck-sk-w" : "ck-sk-sym"} d="M44 14 Q47 9 50 6" />
      <circle cx="32" cy="38" r="19" fill={bubble} />
      <path d="M17 47 L11 59 L26 53 Z" fill={bubble} />
      <circle cx="24.5" cy="38" r="2.8" fill={dots} />
      <circle cx="32" cy="38" r="2.8" fill={dots} />
      <circle cx="39.5" cy="38" r="2.8" fill={dots} />
    </svg>
  )
}
