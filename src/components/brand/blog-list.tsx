"use client"

import { useState } from "react"
import Link from "next/link"
import { POSTS, formatDate, type BlogCategory } from "@/data/blog"

const CATS: ("all" | BlogCategory)[] = ["all", "SEO", "ADS", "IA", "CHAT", "DEV", "TRACKING"]

export function BlogList() {
  const [cat, setCat] = useState<"all" | BlogCategory>("all")
  const [q, setQ] = useState("")
  const query = q.trim().toLowerCase()
  const list = POSTS.filter((p) => (cat === "all" || p.cat === cat) && (!query || (p.title + " " + p.excerpt).toLowerCase().includes(query)))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", flex: "1 1 360px", maxWidth: 520 }}>
          <label htmlFor="blog-q" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Buscar artículos</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
          <input id="blog-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar: píxel, SEO local, agentes IA…" style={{ width: "100%", minHeight: 56, padding: "0 20px 0 52px", borderRadius: 999, border: "1.5px solid #010E25", background: "#fff", font: "inherit", fontSize: 17, color: "#010E25" }} />
        </div>
        <div role="group" aria-label="Filtrar por tema" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATS.map((c) => <button key={c} type="button" className="ck-chip" aria-pressed={c === cat} onClick={() => setCat(c)}>{c === "all" ? "Todos" : `[${c}]`}</button>)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
        <h2 style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}>Artículos</h2>
        <span className="ck-mono" style={{ fontSize: 13, color: "#5A6178" }}>{list.length} {list.length === 1 ? "ARTÍCULO" : "ARTÍCULOS"}</span>
      </div>

      {list.length === 0 && (
        <div style={{ background: "#fff", border: "1.5px dashed #010E25", borderRadius: 28, padding: 48, textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="ck-hand" style={{ fontSize: 32, color: "#C94400" }}>no encontramos nada con eso</span>
          <p style={{ color: "#5A6178" }}>Prueba otra palabra o pregúntanos por WhatsApp: quizás sea nuestro próximo artículo.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 24 }}>
        {list.map((p) => {
          const body = (
            <>
              <div style={{ position: "relative", aspectRatio: "16 / 10", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: p.cover.bg }}>
                <span className="ck-cover-g" style={{ fontSize: 44, color: p.cover.fg }}>{p.cover.glyph}</span>
                <span className="ck-mono" style={{ position: "absolute", left: 16, bottom: 14, fontSize: 11, background: "#fff", color: "#010E25", borderRadius: 6, padding: "4px 8px" }}>{p.readMin} MIN</span>
                {!p.published && <span className="ck-mono" style={{ position: "absolute", right: 16, top: 14, fontSize: 11, background: "#010E25", color: "#fff", borderRadius: 6, padding: "4px 8px" }}>PRÓXIMAMENTE</span>}
              </div>
              <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <span className="ck-tag" style={{ alignSelf: "flex-start" }}>[{p.cat}]</span>
                <h3 style={{ fontSize: 23, letterSpacing: "-0.03em" }}>{p.title}</h3>
                <p style={{ fontSize: 16, color: "#5A6178" }}>{p.excerpt}</p>
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, color: "#5A6178", paddingTop: 8 }}><span>{p.author}</span><span>{formatDate(p.date)}</span></div>
              </div>
            </>
          )
          return p.published
            ? <Link key={p.slug} href={`/blog/${p.slug}`} className="ck-post">{body}</Link>
            : <article key={p.slug} className="ck-post" style={{ opacity: .85 }}>{body}</article>
        })}
      </div>
    </div>
  )
}
