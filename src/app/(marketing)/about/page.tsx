import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ContactForm } from "@/components/marketing/contact-form"
import { TeamGrid } from "@/components/brand/team-grid"
import { ValueCube } from "@/components/brand/value-cube"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Quiénes somos — tres personas, cero tickets",
  description:
    "ClicKonversion es un estudio pequeño de estrategia, tecnología y crecimiento hecho en Venezuela. Conoce a Arnaldo, Abisai y Yoli: hablas con quien hace el trabajo.",
  alternates: { canonical: "https://www.clickonversion.com/about" },
  openGraph: {
    title: "Quiénes somos | ClicKonversion",
    description: "Tres personas. Cero tickets. Expertos que hablan como amigos.",
    url: "https://www.clickonversion.com/about",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

const SLIDERS = [
  { l: "Técnica", r: "Humana", v: 58 },
  { l: "Seria", r: "Divertida", v: 40 },
  { l: "Corporativa", r: "Cercana", v: 78 },
  { l: "Clásica", r: "Actual", v: 74 },
  { l: "Prudente", r: "Atrevida", v: 55 },
]
const SAY = ["Te escribimos hoy mismo con una propuesta.", "Esto no funcionó. Lo cambiamos así.", "El agente de IA responde y te pasa al cliente listo.", "¿Hablamos 15 minutos?"]
const DONT = ["Un ejecutivo de cuenta se pondrá en contacto.", "Resultados garantizados desde el primer día.", "Optimizamos sinergias para maximizar el ROI 360.", "Solicite una reunión a través del formulario."]

export default function AboutPage() {
  return (
    <MarketingLayout active="about">
      <section className="ck-dots" style={{ padding: "56px 0 72px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1240 }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>Quiénes somos</li></ol></nav>
          <h1 style={{ fontSize: "clamp(46px, 6.4vw, 96px)", lineHeight: 0.98 }}>Tres personas. <span style={{ color: "#FE5C02" }}>Cero tickets.</span></h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 640 }}>ClicKonversion es un estudio pequeño de estrategia, tecnología y crecimiento hecho en Venezuela. Hacemos SEO, anuncios, desarrollo web y agentes de IA, y te explicamos cada decisión.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero hablar con ustedes")} target="_blank" rel="noopener noreferrer">Habla con nosotros ↗</a>
            <Link className="ck-btn ck-btn-line" href="/projects">Ver proyectos</Link>
          </div>
        </div>
      </section>

      <section className="ck-section" style={{ background: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <span className="ck-eyebrow">El equipo</span>
              <h2 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Hablas con quien <span style={{ color: "#FE5C02" }}>hace el trabajo</span>.</h2>
            </div>
            <p style={{ maxWidth: 440, fontSize: 19, color: "#3A4158" }}>Un equipo pequeño a propósito: aquí no hay ejecutivos de cuenta, cada decisión te la explica quien la ejecuta.</p>
          </div>
          <TeamGrid />
        </div>
      </section>

      <section className="ck-section">
        <div className="ck-wrap">
          <div style={{ background: "#fff", borderRadius: 36, padding: "clamp(28px, 4vw, 52px)", display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center" }}>
            <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              <span className="ck-eyebrow">Personalidad</span>
              <h2 style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}>Dónde nos ubicamos</h2>
              <p style={{ color: "#5A6178", fontSize: 17 }}>Técnicos, pero humanos. Serios cuando toca, cercanos siempre.</p>
            </div>
            <div style={{ flex: "2 1 520px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
              {SLIDERS.map((s) => (
                <div key={s.l} style={{ display: "grid", gridTemplateColumns: "110px minmax(0, 1fr) 110px", alignItems: "center", gap: 16, fontSize: 15, color: "#3A4158" }}>
                  <span style={{ textAlign: "right" }}>{s.l}</span>
                  <div role="img" aria-label={`${s.v}% hacia ${s.r}`} style={{ position: "relative", height: 6, borderRadius: 999, background: "#ECEDF2" }}>
                    <span style={{ position: "absolute", top: "50%", left: `${s.v}%`, width: 22, height: 22, margin: "-11px 0 0 -11px", borderRadius: "50%", background: "#FE5C02", border: "2px solid #010E25" }} />
                  </div>
                  <span>{s.r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ck-section" style={{ background: "#010E25", color: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <span className="ck-eyebrow" style={{ color: "rgba(255,255,255,.7)" }}>Así hablamos</span>
              <h2 style={{ fontSize: "clamp(38px, 5vw, 64px)", color: "#fff" }}>Expertos que hablan <span style={{ color: "#FE5C02" }}>como amigos</span>.</h2>
            </div>
            <p className="ck-hand" style={{ fontSize: 28, color: "#FFDCC7", transform: "rotate(-3deg)" }}>tuteamos, siempre</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 20 }}>
            <div style={{ background: "#D3F2E3", color: "#010E25", borderRadius: 28, padding: 28 }}>
              <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "#1F6B42" }}>✓ DECIMOS</span>
              {SAY.map((t, i) => <p key={t} style={{ padding: "14px 0", borderBottom: i < SAY.length - 1 ? "1.5px solid rgba(1,14,37,.1)" : undefined, fontWeight: 500 }}>{t}</p>)}
            </div>
            <div style={{ background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.16)", borderRadius: 28, padding: 28 }}>
              <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "#FFB8B8" }}>✕ NO DECIMOS</span>
              {DONT.map((t, i) => <p key={t} style={{ padding: "14px 0", borderBottom: i < DONT.length - 1 ? "1.5px solid rgba(255,255,255,.1)" : undefined, color: "rgba(255,255,255,.7)", textDecoration: "line-through", textDecorationColor: "#FE5C02" }}>{t}</p>)}
            </div>
          </div>
        </div>
      </section>

      <ValueCube eyebrow="Valores" />

      <section id="contacto" style={{ paddingBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 56, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}><span className="ck-dot" />en línea desde Venezuela · para LATAM, España y EE. UU.</span>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 60px)" }}>¿Nos tomamos un café virtual?</h2>
            <p style={{ fontSize: 19, color: "#3A4158" }}>Cuéntanos qué necesitas y te respondemos antes de 24 horas. Si lo prefieres, escríbenos directo por WhatsApp.</p>
            <a className="ck-btn ck-btn-wa" style={{ alignSelf: "flex-start" }} href={waLink("Hola, quiero hablar con ustedes")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Escríbenos por WhatsApp</a>
          </div>
          <div style={{ flex: "1 1 480px", minWidth: 0, background: "#fff", borderRadius: 32, padding: "clamp(24px, 4vw, 44px)", boxShadow: "0 40px 80px -60px rgba(1,14,37,.5)" }}>
            <ContactForm />
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
