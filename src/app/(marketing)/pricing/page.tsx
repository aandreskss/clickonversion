import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { PricingGrid } from "@/components/marketing/pricing-grid"
import { CartBar } from "@/components/marketing/cart-bar"

export const metadata: Metadata = {
  title: "Precios — Todo publicado, sin sorpresas | ClicKonversion",
  description:
    "Precios claros de todos nuestros servicios: SEO, publicidad digital, agentes IA, automatización WhatsApp y soporte Meta. Sin letra pequeña.",
  alternates: {
    canonical: "https://www.clickonversion.com/pricing",
  },
  openGraph: {
    title: "Precios — Todo publicado, sin sorpresas | ClicKonversion",
    description:
      "Precios publicados de todos nuestros servicios de marketing digital. Sin letra pequeña, sin comisiones ocultas.",
    url: "https://www.clickonversion.com/pricing",
    siteName: "ClicKonversion",
    locale: "es_ES",
    type: "website",
  },
}

const FAQS = [
  {
    q: "¿Cómo funcionan los servicios mensuales?",
    a: "Se cobran el mismo día de cada mes y puedes cancelar desde tu panel cuando quieras, sin permanencia.",
  },
  {
    q: "¿Qué significa «desde»?",
    a: 'Es el precio base. Si tu caso necesita más alcance, te enviamos el ajuste antes de empezar y tú decides.',
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Tarjeta de crédito o débito, PayPal y transferencia bancaria.",
  },
  {
    q: "¿Emiten factura?",
    a: "Sí. Todas las facturas quedan disponibles para descargar en tu panel de cliente.",
  },
]

export default function PricingPage() {
  return (
    <MarketingLayout active="pricing">
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
          aria-label="Precios"
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "end" }}
            className="pricing-hero-grid"
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
                PRECIOS — TODO PUBLICADO
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                  fontSize: "clamp(64px, 8.5vw, 132px)",
                  fontWeight: 400,
                  lineHeight: 0.9,
                  color: "#202124",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Precios<br />
                claros. Sin{" "}
                <em style={{ fontStyle: "italic" }}>sorpresas.</em>
              </h1>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontSize: 19, lineHeight: 1.6, color: "#5F6168", maxWidth: 440 }}>
                Publicamos todos los precios porque creemos que la transparencia no es un diferencial — es lo mínimo.
              </p>
              {/* Legend */}
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#345CFF",
                      display: "block",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#5F6168" }}>Pago único</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#FF6B2C",
                      display: "block",
                    }}
                  />
                  <span style={{ fontSize: 13, color: "#5F6168" }}>Mensual</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing grid */}
        <section
          style={{
            padding: "0 clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
        >
          <PricingGrid />
        </section>

        {/* Lavender band */}
        <section
          style={{
            background: "#E9E4FF",
            padding: "clamp(48px, 6vw, 72px) clamp(16px, 5vw, 80px)",
          }}
          aria-label="Paquetes completos"
        >
          <div
            style={{
              maxWidth: "88rem",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
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
              ¿Necesitas un{" "}
              <em style={{ fontStyle: "italic" }}>paquete</em>{" "}
              completo?
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
                whiteSpace: "nowrap",
              }}
            >
              Pedir una propuesta →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section
          style={{
            padding: "clamp(64px, 8vw, 96px) clamp(16px, 5vw, 80px)",
            maxWidth: "88rem",
            margin: "0 auto",
          }}
          aria-label="Preguntas sobre pagos"
        >
          <h2
            style={{
              fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 400,
              color: "#202124",
              lineHeight: 1,
              marginBottom: 48,
            }}
          >
            Sobre los{" "}
            <em style={{ fontStyle: "italic" }}>pagos.</em>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxWidth: 720 }}>
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                style={{ borderBottom: "1.5px solid #E2DED3" }}
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
                  <span style={{ fontSize: 20, flexShrink: 0, color: "#5F6168" }} aria-hidden>
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
      </div>

      <CartBar />

      <style>{`
        @media (max-width: 768px) {
          .pricing-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MarketingLayout>
  )
}
