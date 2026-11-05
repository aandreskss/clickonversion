import Image from "next/image"
import type { PortfolioProject, ProjectStatus } from "@/data/portfolio"

export const STATUS_BG: Record<ProjectStatus, string> = {
  "En línea": "#D3F2E3",
  "En desarrollo": "#D6EBFF",
  "En aprobación": "#FFDCC7",
  "Propuesta de rediseño": "#E4DEFF",
}

export const CATEGORY_LABEL = { web: "WEB", ecommerce: "E-COMMERCE", plataforma: "PLATAFORMA" } as const

export function hostOf(url?: string) {
  if (!url) return ""
  try { return new URL(url).hostname.replace(/^www\./, "") } catch { return url }
}

export function StatusTag({ status }: { status: ProjectStatus }) {
  return (
    <span className="ck-tag" style={{ background: STATUS_BG[status], gap: 6 }}>
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: status === "En línea" ? "#1F9D55" : "#010E25" }} />
      {status}
    </span>
  )
}

/** Portada de marca para proyectos sin capturas */
function BrandCover({ p }: { p: PortfolioProject }) {
  return (
    <div className="ck-pf-browser" style={{ background: p.cover.bg, display: "flex", flexDirection: "column" }}>
      <div className="ck-pf-bar"><i /><i /><i /><span>{hostOf(p.url) || p.slug}</span></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, padding: "8%", color: p.cover.fg }}>
        <span className="ck-mono" style={{ fontSize: 12, color: p.cover.accent }}>{p.sector.toUpperCase()}</span>
        <strong style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{p.client}</strong>
        <span style={{ display: "flex", gap: 6 }} aria-hidden="true">
          {["#FE5C02", "#E4DEFF", "#D6EBFF", "#FFDCC7", "#D3F2E3"].map((c) => <span key={c} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: "1.5px solid rgba(255,255,255,.4)" }} />)}
        </span>
      </div>
    </div>
  )
}

/** Navegador + celular con las capturas del proyecto */
export function ProjectMedia({ p, priority = false, size = "card" }: { p: PortfolioProject; priority?: boolean; size?: "card" | "hero" }) {
  if (!p.shots) return <BrandCover p={p} />
  const sizes = size === "hero" ? "(max-width: 900px) 100vw, 1100px" : "(max-width: 760px) 100vw, 560px"
  return (
    <>
      <div className="ck-pf-browser">
        <div className="ck-pf-bar"><i /><i /><i /><span>{hostOf(p.url)}</span></div>
        <div className="ck-pf-shot">
          <Image src={p.shots.desktop} alt={`Captura de escritorio de ${p.name}`} fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: "top" }} />
        </div>
      </div>
      <div className="ck-pf-phone ck-depth">
        <Image src={p.shots.mobile} alt={`Captura en celular de ${p.name}`} fill sizes={size === "hero" ? "260px" : "140px"} priority={priority} style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
    </>
  )
}
