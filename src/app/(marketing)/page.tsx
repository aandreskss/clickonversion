import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { HeroKey } from "@/components/marketing/hero-key"
import { MarqueeStrip } from "@/components/marketing/marquee-strip"
import { HowWeWork } from "@/components/marketing/how-we-work"
import { FeaturedServices } from "@/components/marketing/featured-services"
import { AiFlow } from "@/components/marketing/ai-flow"
import { SyncLeadPreview } from "@/components/marketing/synclead-preview"

export const metadata: Metadata = {
  title: "ClicKonversion — SEO, Meta Ads, Agentes IA y Automatización",
  description:
    "Combinamos SEO, publicidad digital, IA y automatización para que las marcas ambiciosas crezcan de forma más inteligente.",
  alternates: {
    canonical: "https://www.clickonversion.com",
    languages: {
      "en": "https://www.clickonversion.com",
      "es": "https://www.clickonversion.com/es",
    },
  },
  openGraph: {
    title: "ClicKonversion — SEO, Meta Ads, IA & WhatsApp Business",
    description: "SEO, Meta Ads, agentes IA y automatización — un sistema integrado que convierte visibilidad en clientes.",
    url: "https://www.clickonversion.com",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClicKonversion — SEO, Meta Ads, IA & WhatsApp Business",
    description: "SEO, Meta Ads, agentes IA y automatización — un sistema integrado que convierte visibilidad en clientes.",
  },
}

const MK_FONT = "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)"
const MK_MONO = "var(--font-mk-mono, 'JetBrains Mono', monospace)"
const MK_SERIF = "var(--font-mk-serif, 'Instrument Serif', serif)"

/* ── Section 1: Hero ─────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      style={{
        padding: "80px 0 60px",
        fontFamily: MK_FONT,
      }}
    >
      <div className="mk-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Left col */}
          <div>
            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              {["[SEO]", "[ADS]", "[IA]", "[AUTOMATIZACIÓN]"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: MK_MONO,
                    fontSize: 13,
                    border: "1.5px solid #202124",
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: "#202124",
                    background: "transparent",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* H1 */}
            <h1
              style={{
                fontSize: "clamp(72px,10.5vw,168px)",
                fontWeight: 600,
                lineHeight: 0.86,
                letterSpacing: "-.06em",
                color: "#202124",
                margin: "0 0 32px",
              }}
            >
              Pequeños clics.{" "}
              <em
                style={{
                  fontFamily: MK_SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#345CFF",
                }}
              >
                Grandes
              </em>{" "}
              cosas.
            </h1>

            {/* Párrafo */}
            <p
              style={{
                fontSize: 20,
                color: "#3A3B40",
                lineHeight: 1.5,
                margin: "0 0 40px",
                maxWidth: 520,
              }}
            >
              Combinamos SEO, publicidad digital, IA y automatización para que las
              marcas ambiciosas crezcan de forma más inteligente.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link
                href="/services"
                className="mk-btn-cobalt"
                style={{
                  padding: "18px 28px",
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: 17,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Descubre lo que hacemos ↗
              </Link>
              <Link
                href="/about#contacto"
                className="mk-btn-outline"
                style={{
                  padding: "18px 28px",
                  borderRadius: "999px",
                  fontWeight: 600,
                  fontSize: 17,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Hagámoslo realidad
              </Link>
            </div>
          </div>

          {/* Right col: interactive key */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 440 }}>
            <HeroKey />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 3: Todo lo que tu crecimiento necesita ─────── */
function ServicesCards() {
  return (
    <section style={{ padding: "100px 0", fontFamily: MK_FONT }}>
      <div className="mk-container">
        <p
          style={{
            fontFamily: MK_MONO,
            fontSize: 13,
            color: "#5F6168",
            marginBottom: 24,
            letterSpacing: ".04em",
          }}
        >
          02 — LO BUENO ↗
        </p>

        <h2
          style={{
            fontSize: "clamp(48px,6.5vw,96px)",
            fontWeight: 600,
            color: "#202124",
            letterSpacing: "-.05em",
            lineHeight: 0.9,
            margin: "0 0 56px",
          }}
        >
          Todo lo que tu{" "}
          <em style={{ fontFamily: MK_SERIF, fontStyle: "italic", fontWeight: 400, color: "#345CFF" }}>
            crecimiento
          </em>{" "}
          necesita.
        </h2>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Card 1: SEO - Cobalt */}
          <div
            className="mk-color-card mk-color-card--tilt-left"
            style={{
              background: "#345CFF",
              position: "relative",
            }}
          >
            {/* Decoration */}
            <div
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,.2)",
              }}
              aria-hidden="true"
            />
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 32,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#D9FA62",
              }}
              aria-hidden="true"
            />
            <p
              style={{
                fontFamily: MK_MONO,
                fontSize: 12,
                color: "rgba(255,255,255,.7)",
                letterSpacing: ".08em",
                margin: "0 0 24px",
              }}
            >
              01 / SEO Y BÚSQUEDA IA
            </p>
            <h3
              style={{
                fontSize: "clamp(48px,5vw,72px)",
                fontWeight: 600,
                color: "white",
                letterSpacing: "-.04em",
                lineHeight: 0.9,
                margin: "0 0 20px",
              }}
            >
              Aparece primero.
            </h3>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 17, lineHeight: 1.5, marginBottom: 28 }}>
              SEO técnico, local y de IA para que aparezcas cuando tu cliente te busca.
            </p>
            <Link
              href="/services#seo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Ver servicios SEO →
            </Link>
          </div>

          {/* Card 2: Publicidad - Lime */}
          <div
            className="mk-color-card mk-color-card--tilt-right"
            style={{
              background: "#D9FA62",
              marginTop: 80,
            }}
          >
            <p
              style={{
                fontFamily: MK_MONO,
                fontSize: 12,
                color: "#5F6168",
                letterSpacing: ".08em",
                margin: "0 0 24px",
              }}
            >
              02 / PUBLICIDAD DIGITAL
            </p>
            <h3
              style={{
                fontSize: "clamp(48px,5vw,72px)",
                fontWeight: 600,
                color: "#202124",
                letterSpacing: "-.04em",
                lineHeight: 0.9,
                margin: "0 0 20px",
              }}
            >
              Hazte{" "}
              <em style={{ fontFamily: MK_SERIF, fontStyle: "italic", fontWeight: 400 }}>notar.</em>
            </h3>
            <p style={{ color: "#3A3B40", fontSize: 17, lineHeight: 1.5, marginBottom: 28 }}>
              Campañas de Google, Meta y TikTok que generan resultados predecibles.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Google Ads", bg: "#202124", color: "white" },
                { label: "Meta Ads", bg: "#202124", color: "white" },
                { label: "TikTok Ads", bg: "#FF6B2C", color: "white" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  style={{
                    background: chip.bg,
                    color: chip.color,
                    borderRadius: "999px",
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: IA - Lavender */}
          <div
            className="mk-color-card mk-color-card--tilt-left"
            style={{
              background: "#E9E4FF",
            }}
          >
            <p
              style={{
                fontFamily: MK_MONO,
                fontSize: 12,
                color: "#5F6168",
                letterSpacing: ".08em",
                margin: "0 0 24px",
              }}
            >
              03 / IA Y AUTOMATIZACIÓN
            </p>
            <h3
              style={{
                fontSize: "clamp(48px,5vw,72px)",
                fontWeight: 600,
                color: "#202124",
                letterSpacing: "-.04em",
                lineHeight: 0.9,
                margin: "0 0 20px",
              }}
            >
              Trabaja mejor.
            </h3>
            <p style={{ color: "#3A3B40", fontSize: 17, lineHeight: 1.5, marginBottom: 28 }}>
              Agentes IA, automatizaciones de WhatsApp y CRM para que tu equipo se enfoque en cerrar.
            </p>
            {/* Mini chat */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  background: "#F7F5EF",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#202124",
                  alignSelf: "flex-start",
                  maxWidth: "80%",
                }}
              >
                Hola, ¿cuánto vale el SEO?
              </div>
              <div
                style={{
                  background: "#202124",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "white",
                  alignSelf: "flex-end",
                  maxWidth: "80%",
                }}
              >
                ¡Hola! Depende del alcance. ¿Me cuentas más sobre tu web?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 4: Expertise ───────────────────────────────── */
const EXPERTISE_ITEMS = [
  { num: "01", name: "SEO técnico",             tags: ["SEO"] },
  { num: "02", name: "SEO local",               tags: ["SEO"] },
  { num: "03", name: "AI Search",               tags: ["SEO"] },
  { num: "04", name: "Google Ads",              tags: ["ADS"] },
  { num: "05", name: "Meta Ads",                tags: ["ADS"] },
  { num: "06", name: "TikTok Ads",              tags: ["ADS"] },
  { num: "07", name: "Automatización WhatsApp", tags: ["IA"] },
  { num: "08", name: "Agentes IA",              tags: ["IA"] },
  { num: "09", name: "CRM",                     tags: ["OPS"] },
  { num: "10", name: "Soporte Meta Business",   tags: ["OPS"] },
]

function ExpertiseSection() {
  return (
    <section style={{ padding: "100px 0", fontFamily: MK_FONT }}>
      <div className="mk-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
          {/* Left sticky */}
          <div style={{ position: "sticky", top: 100 }}>
            <p
              style={{
                fontFamily: MK_MONO,
                fontSize: 13,
                color: "#5F6168",
                marginBottom: 24,
                letterSpacing: ".04em",
              }}
            >
              03 — EXPERTISE ↗
            </p>
            <h2
              style={{
                fontSize: "clamp(40px,4.5vw,72px)",
                fontWeight: 600,
                color: "#202124",
                letterSpacing: "-.05em",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              Se nos dan bien{" "}
              <em style={{ fontFamily: MK_SERIF, fontStyle: "italic", fontWeight: 400, color: "#345CFF" }}>
                muchas
              </em>{" "}
              cosas.
            </h2>
          </div>

          {/* Right: list */}
          <div>
            {EXPERTISE_ITEMS.map((item, i) => (
              <div key={item.num}>
                <div className="mk-expertise-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <span
                      style={{
                        fontFamily: MK_MONO,
                        fontSize: 13,
                        color: "#5F6168",
                        minWidth: 24,
                        flexShrink: 0,
                      }}
                    >
                      {item.num}
                    </span>
                    <span
                      style={{
                        fontSize: "clamp(22px,3vw,36px)",
                        fontWeight: 600,
                        color: "#202124",
                        letterSpacing: "-.03em",
                        lineHeight: 1,
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: MK_MONO,
                          fontSize: 11,
                          border: "1.5px solid #D6D2C6",
                          borderRadius: 6,
                          padding: "3px 8px",
                          color: "#5F6168",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {i < EXPERTISE_ITEMS.length - 1 && (
                  <div style={{ height: 1, background: "#D6D2C6", margin: "0 16px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section 7: Proyectos (placeholder) ─────────────────── */
function ProjectsSection() {
  return (
    <section style={{ padding: "100px 0", fontFamily: MK_FONT }}>
      <div className="mk-container">
        <p
          style={{
            fontFamily: MK_MONO,
            fontSize: 13,
            color: "#5F6168",
            marginBottom: 24,
            letterSpacing: ".04em",
          }}
        >
          06 — TRABAJO QUE HABLA
        </p>

        <h2
          style={{
            fontSize: "clamp(40px,5.5vw,88px)",
            fontWeight: 600,
            color: "#202124",
            letterSpacing: "-.05em",
            lineHeight: 0.9,
            margin: "0 0 56px",
          }}
        >
          Buen trabajo.{" "}
          <em style={{ fontFamily: MK_SERIF, fontStyle: "italic", fontWeight: 400, color: "#345CFF" }}>
            Impacto
          </em>{" "}
          real.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Case 1 */}
          <div>
            <div
              style={{
                aspectRatio: "4 / 3",
                background: "#345CFF",
                borderRadius: 24,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  background: "#FF6B2C",
                  color: "white",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontFamily: MK_MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: ".08em",
                }}
              >
                RESULTADO POR VERIFICAR
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: "#202124", letterSpacing: "-.03em", margin: "0 0 8px" }}>
              Caso de estudio 01
            </h3>
            <p style={{ color: "#5F6168", fontSize: 15, margin: 0 }}>SEO · Automatización</p>
          </div>

          {/* Case 2 — offset */}
          <div style={{ marginTop: 120 }}>
            <div
              style={{
                aspectRatio: "4 / 3",
                background: "#D9FA62",
                borderRadius: 24,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  background: "#FF6B2C",
                  color: "white",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  fontFamily: MK_MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: ".08em",
                }}
              >
                RESULTADO POR VERIFICAR
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: "#202124", letterSpacing: "-.03em", margin: "0 0 8px" }}>
              Caso de estudio 02
            </h3>
            <p style={{ color: "#5F6168", fontSize: 15, margin: 0 }}>Meta Ads · CRM</p>
          </div>
        </div>

        <p
          style={{
            fontFamily: MK_MONO,
            fontSize: 13,
            color: "#5F6168",
            marginTop: 32,
            textAlign: "center",
          }}
        >
          Marcadores de posición — solo se publicarán resultados verificados.
        </p>
      </div>
    </section>
  )
}

/* ── Section 10: CTA final ──────────────────────────────── */
function CtaSection() {
  return (
    <section
      style={{
        background: "#D9FA62",
        margin: "0 16px",
        borderRadius: "40px",
        padding: "80px 0",
        fontFamily: MK_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Tecla decorativa */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: -60,
          width: 280,
          height: 200,
          background: "#345CFF",
          borderRadius: 56,
          border: "5px solid #202124",
          transform: "rotate(-12deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          opacity: 0.8,
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: MK_FONT,
            fontWeight: 700,
            fontSize: 100,
            color: "white",
            lineHeight: 1,
            letterSpacing: "-.04em",
          }}
        >
          c
        </span>
        <span
          style={{
            fontFamily: MK_SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 112,
            color: "#D9FA62",
            lineHeight: 1,
          }}
        >
          !
        </span>
      </div>

      <div className="mk-container" style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: MK_MONO,
            fontSize: 13,
            color: "#5F6168",
            marginBottom: 24,
            letterSpacing: ".04em",
          }}
        >
          09 — ¿LISTO PARA CRECER?
        </p>

        <h2
          style={{
            fontSize: "clamp(64px,11vw,184px)",
            fontWeight: 600,
            color: "#202124",
            letterSpacing: "-.06em",
            lineHeight: 0.84,
            margin: "0 0 48px",
            maxWidth: "80%",
          }}
        >
          Todo empieza con un clic.
        </h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link
            href="/about#contacto"
            className="mk-btn-ink"
            style={{
              padding: "18px 28px",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: 17,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Agenda una llamada gratis ↗
          </Link>
          <Link
            href="/pricing"
            className="mk-btn-outline-lime"
            style={{
              padding: "18px 28px",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: 17,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Ver precios
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <MarqueeStrip />
      <ServicesCards />
      <ExpertiseSection />
      <HowWeWork />
      <FeaturedServices />
      <ProjectsSection />
      <AiFlow />
      <SyncLeadPreview />
      <CtaSection />
    </MarketingLayout>
  )
}
