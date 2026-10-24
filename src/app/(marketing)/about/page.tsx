import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ContactForm } from "@/components/marketing/contact-form"

export const metadata: Metadata = {
  title: "Nosotros — El equipo detrás del clic | ClicKonversion",
  description:
    "ClicKonversion es una agencia de growth marketing que combina SEO, publicidad digital, IA y automatización en un solo sistema conectado.",
  alternates: {
    canonical: "https://www.clickonversion.com/about",
  },
  openGraph: {
    title: "Nosotros — El equipo detrás del clic | ClicKonversion",
    description:
      "Conoce el equipo y la filosofía detrás de ClicKonversion. Estrategia, tecnología y crecimiento honesto.",
    url: "https://www.clickonversion.com/about",
    siteName: "ClicKonversion",
    locale: "es_ES",
    type: "website",
  },
}

const VALUES = [
  {
    num: "01",
    name: "Estrategia",
    desc: "Primero entendemos tu negocio. Después elegimos los canales.",
    bg: "#345CFF",
    text: "#fff",
  },
  {
    num: "02",
    name: "Tecnología",
    desc: "IA y automatización donde ahorran tiempo de verdad, no por moda.",
    bg: "#E9E4FF",
    text: "#202124",
  },
  {
    num: "03",
    name: "Crecimiento",
    desc: "Medimos lo que importa y te lo contamos con honestidad.",
    bg: "#D9FA62",
    text: "#202124",
  },
]

export default function AboutPage() {
  return (
    <MarketingLayout active="about">
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
          aria-label="Nosotros"
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }}
            className="about-hero-grid"
          >
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
                NOSOTROS
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                  fontSize: "clamp(60px, 8.5vw, 132px)",
                  fontWeight: 400,
                  lineHeight: 0.9,
                  color: "#202124",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                El equipo<br />
                detrás del{" "}
                <em style={{ fontStyle: "italic" }}>clic.</em>
              </h1>
            </div>
            <div>
              <p
                style={{
                  fontSize: 21,
                  lineHeight: 1.6,
                  color: "#5F6168",
                  maxWidth: 440,
                }}
              >
                Somos el equipo que buscabas: expertos en SEO, publicidad, IA y automatización que hablan claro, muestran su trabajo y construyen sistemas que siguen funcionando.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Nuestros valores"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.num}
                style={{
                  background: v.bg,
                  color: v.text,
                  borderRadius: 28,
                  padding: 28,
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mk-mono, monospace)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                    color: v.text,
                  }}
                >
                  {v.num}
                </p>
                <div>
                  <p
                    style={{
                      fontSize: 40,
                      fontWeight: 700,
                      color: v.text,
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                  >
                    {v.name}
                  </p>
                  <p style={{ fontSize: 16, color: v.text, opacity: 0.75, lineHeight: 1.5 }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Quiénes somos"
        >
          <h2
            style={{
              fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 400,
              color: "#202124",
              lineHeight: 1,
              marginBottom: 40,
            }}
          >
            Quiénes{" "}
            <em style={{ fontStyle: "italic" }}>somos.</em>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  background: "#fff",
                  border: "1.5px dashed #E2DED3",
                  borderRadius: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mk-mono, monospace)",
                    fontSize: 13,
                    color: "#5F6168",
                    opacity: 0.5,
                  }}
                >
                  [foto]
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact section */}
        <section
          id="contacto"
          style={{
            padding: "0 16px clamp(64px, 8vw, 96px)",
          }}
          aria-label="Contacto"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 40,
              padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)",
              maxWidth: "88rem",
              margin: "0 auto",
            }}
          >
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(48px, 6vw, 80px)" }}
              className="contact-grid"
            >
              {/* Left: info */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mk-mono, monospace)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#5F6168",
                    marginBottom: 16,
                  }}
                >
                  CONTACTO
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                    fontSize: "clamp(40px, 5vw, 72px)",
                    fontWeight: 400,
                    color: "#202124",
                    lineHeight: 1,
                    marginBottom: 20,
                  }}
                >
                  Hagámoslo{" "}
                  <em style={{ fontStyle: "italic" }}>realidad.</em>
                </h2>
                <p style={{ fontSize: 18, color: "#5F6168", lineHeight: 1.6, marginBottom: 32 }}>
                  ¿Listo para dar el siguiente paso? Cuéntanos qué necesitas y te respondemos antes de 24 horas.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mk-mono, monospace)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#5F6168",
                        opacity: 0.6,
                        marginBottom: 4,
                      }}
                    >
                      Email
                    </p>
                    <a
                      href="mailto:hello@clickonversion.com"
                      style={{ fontSize: 16, color: "#345CFF", fontWeight: 600, textDecoration: "none" }}
                    >
                      hello@clickonversion.com
                    </a>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mk-mono, monospace)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#5F6168",
                        opacity: 0.6,
                        marginBottom: 4,
                      }}
                    >
                      WhatsApp
                    </p>
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 16, color: "#345CFF", fontWeight: 600, textDecoration: "none" }}
                    >
                      Escribir por WhatsApp →
                    </a>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mk-mono, monospace)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#5F6168",
                        opacity: 0.6,
                        marginBottom: 4,
                      }}
                    >
                      Horario
                    </p>
                    <p style={{ fontSize: 15, color: "#5F6168" }}>Lun–Vie · 9:00–18:00 GMT-5</p>
                  </div>
                </div>
              </div>

              {/* Right: form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid,
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MarketingLayout>
  )
}
