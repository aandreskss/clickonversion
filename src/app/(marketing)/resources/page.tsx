import type { Metadata } from "next"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ResourcesNewsletterForm } from "@/components/marketing/resources-newsletter-form"

export const metadata: Metadata = {
  title: "Recursos para crecer | ClicKonversion",
  description:
    "Artículos, guías y casos de uso sobre SEO, publicidad digital, IA y automatización. Recursos prácticos para negocios en crecimiento.",
  alternates: {
    canonical: "https://www.clickonversion.com/resources",
  },
  openGraph: {
    title: "Recursos para crecer | ClicKonversion",
    description:
      "Recursos prácticos de marketing digital: SEO, Meta Ads, agentes IA y automatización.",
    url: "https://www.clickonversion.com/resources",
    siteName: "ClicKonversion",
    locale: "es_ES",
    type: "website",
  },
}

const PLACEHOLDER_ARTICLES = [
  { tag: "SEO", title: "Cómo aparecer en ChatGPT cuando tu cliente busca lo que vendes" },
  { tag: "Meta Ads", title: "Por qué tu ROAS de Meta Ads es mentira (y cómo medirlo bien)" },
  { tag: "IA", title: "Agente de WhatsApp: todo lo que necesitas saber antes de empezar" },
  { tag: "Automatización", title: "El stack mínimo para no perder ningún lead de tus campañas" },
]

export default function ResourcesPage() {
  return (
    <MarketingLayout active="resources">
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
          aria-label="Recursos"
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }}
            className="resources-hero-grid"
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
                RECURSOS
              </p>
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
                Recursos<br />
                para{" "}
                <em style={{ fontStyle: "italic" }}>crecer.</em>
              </h1>
            </div>
            <div>
              <p style={{ fontSize: 19, lineHeight: 1.6, color: "#5F6168", maxWidth: 440 }}>
                Artículos, guías y casos de uso sobre marketing digital real. Sin relleno, sin teoría — solo lo que funciona.
              </p>
              <p
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-mk-mono, monospace)",
                  fontSize: 12,
                  color: "#5F6168",
                  opacity: 0.6,
                }}
              >
                Pronto — artículos, guías y casos de uso
              </p>
            </div>
          </div>
        </section>

        {/* Featured article placeholder */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(48px, 6vw, 64px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Artículo destacado"
        >
          <div
            style={{
              aspectRatio: "4/3",
              background: "#345CFF",
              borderRadius: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "clamp(28px, 4vw, 48px)",
              maxHeight: 480,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mk-mono, monospace)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.5)",
                marginBottom: 12,
              }}
            >
              SEO · DESTACADO
            </span>
            <p
              style={{
                fontSize: "clamp(24px, 3.5vw, 44px)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                maxWidth: 560,
              }}
            >
              Cómo aparecer en ChatGPT cuando tu cliente busca lo que vendes
            </p>
            <p
              style={{
                marginTop: 12,
                fontFamily: "var(--font-mk-mono, monospace)",
                fontSize: 12,
                color: "rgba(255,255,255,.4)",
              }}
            >
              [Próximamente]
            </p>
          </div>
        </section>

        {/* Article grid */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Artículos"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {PLACEHOLDER_ARTICLES.map((art) => (
              <article
                key={art.title}
                style={{
                  background: "#fff",
                  border: "1.5px solid #E2DED3",
                  borderRadius: 24,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mk-mono, monospace)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#345CFF",
                  }}
                >
                  {art.tag}
                </span>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#202124", lineHeight: 1.3 }}>
                  {art.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mk-mono, monospace)",
                    fontSize: 11,
                    color: "#5F6168",
                    opacity: 0.5,
                  }}
                >
                  [Próximamente]
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter CTA lime */}
        <section style={{ padding: "0 16px clamp(64px, 8vw, 96px)" }}>
          <div
            style={{
              background: "#D9FA62",
              borderRadius: 40,
              padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)",
              maxWidth: "88rem",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 32,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mk-mono, monospace)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#202124",
                  opacity: 0.6,
                  marginBottom: 12,
                }}
              >
                NEWSLETTER
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 400,
                  color: "#202124",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Lo que funciona,<br />
                directo a tu inbox.
              </h2>
            </div>
            <ResourcesNewsletterForm />
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .resources-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MarketingLayout>
  )
}
