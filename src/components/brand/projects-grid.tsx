"use client"

import { useState } from "react"

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Web y apps" },
  { id: "ads", label: "Ads" },
  { id: "seo", label: "SEO" },
  { id: "ia", label: "IA y WhatsApp" },
  { id: "tracking", label: "Tracking" },
]

// TODO: reemplazar por casos reales (cliente, qué hicimos y resultado medible, con su permiso).
const PROJECTS = [
  { cat: "web", bg: "#D6EBFF", tag: "[WEB]", tag2: "[SEO]", title: "[Cliente] · Rediseño de página web" },
  { cat: "ads", bg: "#FFDCC7", tag: "[ADS]", tag2: "[WHATSAPP]", title: "[Cliente] · Campañas de Meta a WhatsApp" },
  { cat: "seo", bg: "#D6EBFF", tag: "[SEO]", tag2: "[LOCAL]", title: "[Cliente] · SEO local y Google Business" },
  { cat: "ia", bg: "#E4DEFF", tag: "[IA]", tag2: "[CHAT]", title: "[Cliente] · Agente de IA para WhatsApp" },
  { cat: "tracking", bg: "#FFF8F0", tag: "[TRACKING]", tag2: "[META]", title: "[Cliente] · Píxel y API de conversiones" },
  { cat: "web", bg: "#D3F2E3", tag: "[LANDING]", tag2: "[ADS]", title: "[Cliente] · Landing para lanzamiento" },
]

export function ProjectsGrid() {
  const [cur, setCur] = useState("all")
  const list = PROJECTS.filter((p) => cur === "all" || p.cat === cur)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <h2 style={{ fontSize: "clamp(32px, 3.8vw, 48px)" }}>Proyectos de clientes</h2>
        <div role="group" aria-label="Filtrar proyectos" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.map((f) => <button key={f.id} type="button" className="ck-chip" aria-pressed={f.id === cur} onClick={() => setCur(f.id)}>{f.label}</button>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 24 }}>
        {list.map((p) => (
          <article key={p.title} className="ck-svc" style={{ background: "#fff", border: "1.5px solid #010E25", borderRadius: 30, overflow: "hidden", display: "flex", flexDirection: "column", color: "#010E25" }}>
            <div style={{ background: p.bg, aspectRatio: "4 / 3", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
              <div className="ck-q" style={{ width: "100%", height: "100%", borderRadius: 16, border: "1.5px solid #010E25", background: "repeating-linear-gradient(135deg,rgba(255,255,255,.7) 0 12px,rgba(255,255,255,.35) 12px 24px)", display: "flex", alignItems: "flex-end", padding: 14 }}>
                <span className="ck-mono" style={{ fontSize: 11, background: "#fff", padding: "5px 8px", borderRadius: 6, color: "#5A6178" }}>CAPTURA DEL PROYECTO</span>
              </div>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}><span className="ck-tag" style={{ background: p.bg }}>{p.tag}</span><span className="ck-tag">{p.tag2}</span></div>
              <h3 style={{ fontSize: 24, letterSpacing: "-0.03em" }}>{p.title}</h3>
              <p style={{ fontSize: 16, color: "#5A6178" }}>[Qué problema tenía el cliente y qué hicimos, en una o dos líneas.]</p>
              <span className="ck-mono" style={{ marginTop: "auto", alignSelf: "flex-start", fontSize: 12, background: "#D3F2E3", borderRadius: 8, padding: "6px 10px" }}>[RESULTADO MEDIBLE]</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
