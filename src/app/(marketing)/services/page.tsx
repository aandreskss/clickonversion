import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ServicesTabs } from "@/components/marketing/services-tabs"
import { CartBar } from "@/components/marketing/cart-bar"

export const metadata: Metadata = {
  title: "Servicios — SEO, Publicidad, IA y Soporte Meta | ClicKonversion",
  description:
    "Cuatro áreas de crecimiento digital: SEO y búsqueda IA, publicidad digital, automatización con IA y soporte Meta. Precios claros, resultados reales.",
  alternates: {
    canonical: "https://www.clickonversion.com/services",
  },
  openGraph: {
    title: "Servicios — SEO, Publicidad, IA y Soporte Meta | ClicKonversion",
    description:
      "SEO, Meta Ads, agentes IA, automatización WhatsApp y soporte Meta. Todo publicado, sin letra pequeña.",
    url: "https://www.clickonversion.com/services",
    siteName: "ClicKonversion",
    locale: "es_ES",
    type: "website",
  },
}

const STEPS = [
  {
    title: "Llamada de 20 min",
    desc: "Entendemos tu negocio, tu situación y qué tiene sentido para ti.",
    dots: 1,
  },
  {
    title: "Propuesta clara",
    desc: "Scope escrito, precio fijo, sin letra pequeña.",
    dots: 2,
  },
  {
    title: "Manos a la obra",
    desc: "Empezamos y te mantenemos informado en cada paso.",
    dots: 3,
  },
  {
    title: "Reporte honesto",
    desc: "Los datos que importan, explicados sin tecnicismos.",
    dots: 4,
  },
]

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en verse resultados?",
    a: "Depende del canal. SEO toma entre 3 y 6 meses. Publicidad de pago puede generar resultados desde la primera semana. Automatizaciones, desde el día de lanzamiento.",
  },
  {
    q: "¿Puedo contratar servicios de más de un área?",
    a: "Sí. Muchos clientes combinan SEO con Meta Ads, o Agente IA con Automatización WhatsApp. Añade los que necesitas al carrito y gestionamos todo desde un solo equipo.",
  },
  {
    q: "¿Qué pasa si quiero cancelar un servicio mensual?",
    a: "Sin permanencia. Puedes cancelar desde tu panel de cliente cuando quieras, sin penalización.",
  },
  {
    q: "¿Trabajan con empresas fuera de España y Latinoamérica?",
    a: "Sí. Atendemos clientes en Estados Unidos, España, México, Colombia y Venezuela, tanto en inglés como en español.",
  },
]

export default function ServicesPage() {
  return (
    <MarketingLayout active="services">
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
          aria-label="Servicios"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }} className="hero-grid">
            <div>
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
                SERVICIOS — 4 ÁREAS, UN SOLO EQUIPO
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                  fontSize: "clamp(64px, 9vw, 140px)",
                  fontWeight: 400,
                  lineHeight: 0.9,
                  color: "#202124",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Cuatro<br />
                formas de<br />
                hacer{" "}
                <em style={{ fontStyle: "italic" }}>clic.</em>
              </h1>
            </div>
            <div>
              <p
                style={{
                  fontSize: 19,
                  lineHeight: 1.6,
                  color: "#5F6168",
                  maxWidth: 440,
                }}
              >
                SEO, publicidad, inteligencia artificial y soporte Meta — cuatro disciplinas que se refuerzan entre sí para convertir visibilidad en clientes reales.
              </p>
            </div>
          </div>
        </section>

        {/* Services tabs */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
        >
          <ServicesTabs />
        </section>

        {/* Process: Así se ve trabajar juntos */}
        <section
          style={{
            background: "#202124",
            padding: "clamp(64px, 8vw, 96px) clamp(16px, 5vw, 80px)",
          }}
          aria-label="Proceso de trabajo"
        >
          <div style={{ maxWidth: "88rem", margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-mk-mono, monospace)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.4)",
                marginBottom: 16,
              }}
            >
              PROCESO
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontSize: "clamp(40px, 6vw, 80px)",
                fontWeight: 400,
                color: "#fff",
                lineHeight: 1,
                marginBottom: 56,
              }}
            >
              Así se ve{" "}
              <em style={{ fontStyle: "italic", color: "#D9FA62" }}>trabajar juntos.</em>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 24,
              }}
            >
              {STEPS.map((step) => (
                <div
                  key={step.title}
                  style={{
                    background: "rgba(255,255,255,.05)",
                    borderRadius: 24,
                    padding: "28px 24px",
                    border: "1px solid rgba(255,255,255,.08)",
                  }}
                >
                  {/* Progress dots */}
                  <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                    {[1, 2, 3, 4].map((dot) => (
                      <span
                        key={dot}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: dot <= step.dots ? "#D9FA62" : "rgba(255,255,255,.2)",
                          display: "block",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                    {step.title}
                  </p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{
            padding: "clamp(64px, 8vw, 96px) clamp(16px, 5vw, 80px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Preguntas frecuentes"
        >
          <h2
            style={{
              fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 400,
              color: "#202124",
              lineHeight: 1,
              marginBottom: 48,
            }}
          >
            Lo que{" "}
            <em style={{ fontStyle: "italic" }}>siempre</em>{" "}
            nos preguntan.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 720 }}>
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                style={{
                  borderBottom: "1.5px solid #E2DED3",
                  padding: "0 0 0 0",
                }}
              >
                <summary
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#202124",
                    padding: "20px 0",
                    cursor: "pointer",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {faq.q}
                  <span
                    style={{
                      fontSize: 20,
                      flexShrink: 0,
                      color: "#5F6168",
                    }}
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p
                  style={{
                    fontSize: 16,
                    color: "#5F6168",
                    lineHeight: 1.6,
                    paddingBottom: 20,
                    margin: 0,
                  }}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section
          style={{
            padding: "0 16px clamp(64px, 8vw, 96px)",
          }}
        >
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
            <p
              style={{
                fontFamily: "var(--font-mk-mono, monospace)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#202124",
                opacity: 0.6,
              }}
            >
              ¿NO SABES CUÁL ELEGIR?
            </p>
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
              Te ayudamos a elegir<br />
              <em style={{ fontStyle: "italic" }}>sin compromiso.</em>
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
                display: "inline-block",
              }}
            >
              Agenda una llamada gratis →
            </Link>
          </div>
        </section>
      </div>

      <CartBar />

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MarketingLayout>
  )
}
