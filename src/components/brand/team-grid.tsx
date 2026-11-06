import Image from "next/image"
import Link from "next/link"
import { TEAM } from "@/data/team"

/** Fichas del equipo: retrato inclinado (placeholder hasta tener fotos reales), dato y bio. */
export function TeamGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "48px 32px" }}>
      {TEAM.map((m) => {
        const first = m.name.split(" ")[0]
        return (
          <article key={m.name} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ padding: "16px 18px 0" }}>
              <div className={`ck-portrait ${m.tilt}`} style={{ position: "relative", width: "100%", aspectRatio: "4 / 5" }}>
                <div
                  className="ck-stripes"
                  style={{ position: "absolute", inset: 0, borderRadius: 30, border: "1.5px solid #010E25", display: "flex", alignItems: "flex-end", padding: 20, boxShadow: "0 50px 80px -50px rgba(1,14,37,.6)", ["--a" as string]: m.stripes[0], ["--b" as string]: m.stripes[1] } as React.CSSProperties}
                >
                  {!m.photo && <span className="ck-mono" style={{ fontSize: 11.5, color: "#5A6178", background: "#fff", padding: "6px 10px", borderRadius: 8 }}>FOTO · {first}, luz natural</span>}
                  {m.photo && <Image src={m.photo} alt={m.name} fill sizes="(max-width: 760px) 100vw, 400px" style={{ objectFit: "cover", objectPosition: "50% 22%", borderRadius: 29 }} />}
                </div>
                <div style={{ position: "absolute", right: -16, top: -22, zIndex: 2, background: "#010E25", borderRadius: 999, padding: "8px 16px", transform: `rotate(${m.sticker}deg)`, boxShadow: "0 16px 30px -16px rgba(1,14,37,.6)" }}>
                  <span className="ck-hand" style={{ fontSize: 22, color: "#fff" }}>¡hola, soy {first}!</span>
                </div>
                <div style={{ position: "absolute", left: -14, bottom: 64, background: "#fff", border: "1.5px solid #010E25", borderRadius: 18, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 2, boxShadow: "0 20px 40px -24px rgba(1,14,37,.5)" }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{m.years}<span style={{ color: "#FE5C02" }}>+</span></span>
                  <span className="ck-mono" style={{ fontSize: 11, letterSpacing: ".08em", color: "#5A6178" }}>AÑOS · {m.yearsArea}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px 12px" }}>
                <h3 style={{ fontSize: 30 }}>{m.name}</h3>
                <span style={{ display: "inline-flex", gap: 14 }}>
                  {m.cv && <Link href={m.cv} style={{ fontWeight: 600, fontSize: 15, color: "#C94400" }}>Ver mi CV →</Link>}
                  {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: 15, color: "#C94400" }}>LinkedIn ↗</a>}
                </span>
              </div>
              <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".06em", color: "#C94400" }}>{m.role}</span>
              <p style={{ fontSize: 17, color: "#3A4158" }}>{m.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {m.tags.map((t, i) => <span key={i} className="ck-tag" style={{ background: t.bg }}>{t.label}</span>)}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
