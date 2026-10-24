import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { AppsWaitlistForm } from "@/components/marketing/apps-waitlist-form"

export const metadata: Metadata = {
  title: "Apps — SyncLead | ClicKonversion",
  description:
    "SyncLead: el CRM para leads de Meta Ads. Captura leads automáticamente, gestiona conversaciones y cierra más ventas.",
  alternates: {
    canonical: "https://www.clickonversion.com/apps",
  },
  openGraph: {
    title: "Apps — SyncLead | ClicKonversion",
    description:
      "SyncLead sincroniza cada lead de Meta Ads con tu CRM en tiempo real. Pipeline visual, WhatsApp integrado y agentes IA.",
    url: "https://www.clickonversion.com/apps",
    siteName: "ClicKonversion",
    locale: "es_ES",
    type: "website",
  },
}

const FEATURES = [
  {
    title: "Captura unificada",
    desc: "Todos tus leads de Meta Ads, formularios y WhatsApp en un solo lugar.",
    icon: "⚡",
  },
  {
    title: "Conversaciones",
    desc: "Responde desde el mismo panel. WhatsApp Business integrado desde el inicio.",
    icon: "💬",
  },
  {
    title: "Pipeline visual",
    desc: "Kanban drag-and-drop para mover leads a través de tu proceso de venta.",
    icon: "📊",
  },
  {
    title: "Atribución de ventas",
    desc: "Sabe exactamente qué campaña generó cada cliente cerrado.",
    icon: "🎯",
  },
]

const INTEGRATIONS = [
  "Meta Ads",
  "WhatsApp",
  "Google Ads",
  "Make",
  "Zapier",
  "CRM (por confirmar)",
]

export default function AppsPage() {
  return (
    <MarketingLayout active="apps">
      <div
        style={{
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        }}
      >
        {/* Hero dark */}
        <section
          style={{
            background: "#202124",
            padding: "clamp(120px, 15vw, 180px) clamp(16px, 5vw, 80px) clamp(80px, 10vw, 120px)",
          }}
          aria-label="SyncLead"
        >
          <div style={{ maxWidth: "88rem", margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.4)",
                marginBottom: 24,
              }}
            >
              SYNCLEAD — PRÓXIMAMENTE
            </p>
            <h1
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontSize: "clamp(60px, 9vw, 140px)",
                fontWeight: 400,
                lineHeight: 0.9,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: 32,
              }}
            >
              Cada lead,<br />
              en{" "}
              <em
                style={{
                  fontStyle: "normal",
                  fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                  color: "#D9FA62",
                }}
              >
                sync.
              </em>
            </h1>
            <p
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.6)",
                maxWidth: 540,
                marginBottom: 40,
              }}
            >
              El CRM diseñado para equipos que generan leads desde Meta Ads. Captura automática, pipeline visual y WhatsApp integrado.
            </p>
            {/* Waitlist form */}
            <AppsWaitlistForm />
          </div>
        </section>

        {/* Features */}
        <section
          style={{
            background: "#F7F5EF",
            padding: "clamp(80px, 10vw, 120px) clamp(16px, 5vw, 80px)",
          }}
          aria-label="Funcionalidades de SyncLead"
        >
          <div style={{ maxWidth: "88rem", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 400,
                color: "#202124",
                lineHeight: 1,
                marginBottom: 48,
              }}
            >
              Todo lo que<br />
              <em style={{ fontStyle: "italic" }}>necesitas.</em>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {FEATURES.map((feat) => (
                <div
                  key={feat.title}
                  style={{
                    background: "#fff",
                    borderRadius: 24,
                    padding: "28px 24px",
                    border: "1.5px solid #E2DED3",
                  }}
                >
                  <span style={{ fontSize: 28, display: "block", marginBottom: 16 }}>
                    {feat.icon}
                  </span>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#202124", marginBottom: 8 }}>
                    {feat.title}
                  </p>
                  <p style={{ fontSize: 15, color: "#5F6168", lineHeight: 1.5 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section
          style={{
            background: "#F7F5EF",
            padding: "0 clamp(16px, 5vw, 80px) clamp(64px, 8vw, 96px)",
          }}
          aria-label="Integraciones"
        >
          <div style={{ maxWidth: "88rem", margin: "0 auto" }}>
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
              INTEGRACIONES
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {INTEGRATIONS.map((intg) => (
                <span
                  key={intg}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "1.5px solid #202124",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#202124",
                  }}
                >
                  {intg}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA lime */}
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
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
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
                INCLUIDO GRATIS
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                  fontSize: "clamp(28px, 4vw, 48px)",
                  fontWeight: 400,
                  color: "#202124",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                SyncLead viene{" "}
                <em style={{ fontStyle: "italic" }}>incluido gratis</em>{" "}
                con servicios de Meta Ads.
              </h2>
            </div>
            <Link
              href="/services#ads"
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
              Ver servicios →
            </Link>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
