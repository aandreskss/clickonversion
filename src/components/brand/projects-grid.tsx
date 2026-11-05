"use client"

import Link from "next/link"
import { useState } from "react"
import { PROJECTS, type ProjectCategory } from "@/data/portfolio"
import { CATEGORY_LABEL, ProjectMedia, StatusTag } from "@/components/brand/portfolio-media"

const FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "web", label: "Sitios web" },
  { id: "ecommerce", label: "Tiendas en línea" },
  { id: "plataforma", label: "Plataformas" },
]

export function ProjectsGrid() {
  const [cur, setCur] = useState<"all" | ProjectCategory>("all")
  const list = PROJECTS.filter((p) => cur === "all" || p.categories.includes(cur))
  const count = (id: "all" | ProjectCategory) => (id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.categories.includes(id)).length)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>PORTAFOLIO WEB</span>
          <h2 style={{ fontSize: "clamp(32px, 3.8vw, 48px)" }}>Sitios, tiendas y plataformas</h2>
        </div>
        <div role="group" aria-label="Filtrar proyectos" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="ck-chip" aria-pressed={f.id === cur} onClick={() => setCur(f.id)}>
              {f.label} <span style={{ opacity: 0.6 }}>{count(f.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ck-pf-grid">
        {list.map((p, i) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className={`ck-pf-card ck-tilt ${i % 2 ? "ck-tilt-r" : "ck-tilt-l"}`}>
            <div className="ck-pf-media" style={{ background: p.cover.bg }}>
              <ProjectMedia p={p} priority={i < 2} />
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <StatusTag status={p.status} />
                {p.categories.map((c) => <span key={c} className="ck-tag">{CATEGORY_LABEL[c]}</span>)}
              </div>
              <h3 style={{ fontSize: 26, letterSpacing: "-0.03em" }}>{p.name}</h3>
              <p style={{ fontSize: 16, color: "#5A6178", margin: 0 }}>{p.summary}</p>
              <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>{p.sector} · {p.location}</span>
                <span style={{ fontWeight: 600, fontSize: 16 }}>Ver proyecto <span aria-hidden="true" style={{ color: "#FE5C02" }}>→</span></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
