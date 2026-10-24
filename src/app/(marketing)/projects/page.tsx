import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

export const metadata: Metadata = {
  title: "Proyectos — Trabajo que habla | ClicKonversion",
  description:
    "Casos de éxito y proyectos de ClicKonversion. Solo publicamos resultados verificados.",
  alternates: {
    canonical: "https://www.clickonversion.com/projects",
  },
  openGraph: {
    title: "Proyectos — Trabajo que habla | ClicKonversion",
    description: "Casos reales con resultados reales. Sin métricas de vanidad.",
    url: "https://www.clickonversion.com/projects",
    siteName: "ClicKonversion",
    locale: "es_ES",
    type: "website",
  },
}

const PLACEHOLDERS = [
  { color: "#345CFF", sector: "E-commerce", text: "#fff" },
  { color: "#D9FA62", sector: "SaaS B2B", text: "#202124" },
  { color: "#E9E4FF", sector: "Servicios locales", text: "#202124" },
  { color: "#202124", sector: "Inmobiliaria", text: "#fff" },
]

export default function ProjectsPage() {
  return (
    <MarketingLayout active="projects">
      <div
        style={{
          background: "#F7F5EF",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        }}
      >
        {/* Hero */}
        <section
          style={{
            padding: "clamp(120px, 15vw, 180px) clamp(16px, 5vw, 80px) clamp(64px, 8vw, 96px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Proyectos"
        >
          <p
            style={{
              fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#5F6168",
              marginBottom: 24,
            }}
          >
            PROYECTOS
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }}
            className="projects-hero-grid"
          >
            <h1
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontSize: "clamp(60px, 8vw, 120px)",
                fontWeight: 400,
                lineHeight: 0.9,
                color: "#202124",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Trabajo que{" "}
              <em style={{ fontStyle: "italic" }}>habla.</em>
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: "#5F6168", maxWidth: 440 }}>
              Solo publicamos casos con resultados verificados. Datos reales, sin métricas de vanidad.
            </p>
          </div>
        </section>

        {/* Cases staggered grid */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Casos de clientes"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
            className="cases-grid"
          >
            {PLACEHOLDERS.map((p, i) => (
              <div
                key={p.sector}
                style={{
                  marginTop: i % 2 === 1 ? 80 : 0,
                }}
              >
                <div
                  style={{
                    aspectRatio: "4/3",
                    background: p.color,
                    borderRadius: 28,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 28,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      background: "#FF6B2C",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mk-mono, monospace)",
                    }}
                  >
                    RESULTADO POR VERIFICAR
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: p.text,
                        opacity: 0.6,
                        marginBottom: 6,
                        fontFamily: "var(--font-mk-mono, monospace)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {p.sector}
                    </p>
                    <p style={{ fontSize: 22, fontWeight: 700, color: p.text }}>
                      [Cliente]
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              marginTop: 48,
              fontFamily: "var(--font-mk-mono, monospace)",
              fontSize: 12,
              color: "#5F6168",
              opacity: 0.7,
            }}
          >
            Solo publicaremos casos con resultados verificados.
          </p>
        </section>

        {/* CTA lime */}
        <section style={{ padding: "0 16px clamp(64px, 8vw, 96px)" }}>
          <div
            style={{
              background: "#D9FA62",
              borderRadius: 40,
              padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)",
              maxWidth: "88rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 24,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 400,
                color: "#202124",
                lineHeight: 1,
                margin: 0,
              }}
            >
              ¿Quieres ser<br />
              el próximo{" "}
              <em style={{ fontStyle: "italic" }}>caso?</em>
            </h2>
            <Link
              href="/book"
              style={{
                background: "#202124",
                color: "#fff",
                borderRadius: 999,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Hablemos →
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .projects-hero-grid,
          .cases-grid {
            grid-template-columns: 1fr !important;
          }
          .cases-grid > div {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </MarketingLayout>
  )
}
