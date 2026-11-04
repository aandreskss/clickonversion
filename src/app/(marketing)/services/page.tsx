import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ServicesTabs } from "@/components/marketing/services-tabs"
import { CartBar } from "@/components/marketing/cart-bar"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Servicios — SEO, Publicidad, IA y WhatsApp | ClicKonversion",
  description:
    "Cuatro áreas de crecimiento digital: SEO y búsqueda IA, publicidad digital, automatización con IA y WhatsApp Business. Precios claros, resultados reales.",
  alternates: { canonical: "https://www.clickonversion.com/services" },
  openGraph: {
    title: "Servicios — SEO, Publicidad, IA y WhatsApp | ClicKonversion",
    description: "SEO, Meta Ads, agentes IA, automatización WhatsApp. Todo publicado, sin letra pequeña.",
    url: "https://www.clickonversion.com/services",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

const STEPS = [
  { n: "01", bg: "#D3F2E3", t: "Te escuchamos", d: "Llamada de 20 min para entender tu negocio, qué vendes y qué has probado.", dots: 1 },
  { n: "02", bg: "#D6EBFF", t: "Propuesta clara", d: "Scope escrito, precio fijo, sin letra pequeña. Te explicamos el plan.", dots: 2 },
  { n: "03", bg: "#E4DEFF", t: "Manos a la obra", d: "Empezamos y te mantenemos informado en cada paso.", dots: 3 },
  { n: "04", bg: "#FFDCC7", t: "Reporte honesto", d: "Los datos que importan, explicados en lenguaje humano.", dots: 4 },
]

const FAQS = [
  { q: "¿Cuánto tiempo tarda en verse resultados?", a: "Depende del canal. SEO toma entre 3 y 6 meses. Publicidad de pago puede generar resultados desde la primera semana. Automatizaciones, desde el día de lanzamiento." },
  { q: "¿Puedo contratar servicios de más de un área?", a: "Sí. Muchos clientes combinan SEO con Meta Ads, o Agente IA con Automatización WhatsApp. Añade los que necesitas al carrito y gestionamos todo desde un solo equipo." },
  { q: "¿Qué pasa si quiero cancelar un servicio mensual?", a: "Sin permanencia. Puedes cancelar desde tu panel de cliente cuando quieras, sin penalización." },
  { q: "¿Trabajan con empresas fuera de España y Latinoamérica?", a: "Sí. Atendemos clientes en Estados Unidos, España, México, Colombia y Venezuela, tanto en inglés como en español." },
]

export default function ServicesPage() {
  return (
    <MarketingLayout active="services">

      {/* Hero */}
      <section className="ck-dots" style={{ padding: "clamp(72px, 10vw, 120px) 0 clamp(56px, 7vw, 88px)" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 820 }}>
          <span className="ck-eyebrow">4 áreas · Un solo equipo</span>
          <h1 style={{ fontSize: "clamp(44px, 6.5vw, 92px)", lineHeight: 0.95 }}>
            Cuatro formas de hacer <span style={{ color: "#FE5C02" }}>clic.</span>
          </h1>
          <p style={{ fontSize: "clamp(17px, 1.6vw, 20px)", color: "#3A4158", maxWidth: 540 }}>
            SEO, publicidad, inteligencia artificial y WhatsApp Business — cuatro disciplinas que convierten visibilidad en clientes reales.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span className="ck-tag" style={{ background: "#D6EBFF" }}>[SEO]</span>
            <span className="ck-tag" style={{ background: "#FFDCC7" }}>[ADS]</span>
            <span className="ck-tag" style={{ background: "#E4DEFF" }}>[IA]</span>
            <span className="ck-tag" style={{ background: "#D3F2E3" }}>[CHAT]</span>
          </div>
        </div>
      </section>

      {/* Services tabs */}
      <section style={{ paddingBottom: "clamp(64px, 8vw, 100px)" }}>
        <ServicesTabs />
      </section>

      {/* Process */}
      <section className="ck-section" style={{ background: "#010E25" }}>
        <div className="ck-wrap">
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 56 }}>
            <span className="ck-eyebrow" style={{ color: "rgba(255,255,255,.5)" }}>PROCESO</span>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 68px)", color: "#fff" }}>
              Así se ve <span style={{ color: "#FE5C02" }}>trabajar juntos.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {STEPS.map((step) => (
              <div key={step.n} style={{ background: "rgba(255,255,255,.05)", borderRadius: 24, padding: "28px 24px", border: "1px solid rgba(255,255,255,.08)" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                  {[1, 2, 3, 4].map((d) => (
                    <span key={d} style={{ width: 10, height: 10, borderRadius: "50%", background: d <= step.dots ? "#FE5C02" : "rgba(255,255,255,.18)", display: "block" }} />
                  ))}
                </div>
                <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.45)" }}>{step.n}</span>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "8px 0 6px" }}>{step.t}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.5, margin: 0 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ck-section">
        <div className="ck-wrap" style={{ maxWidth: 760 }}>
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            <span className="ck-eyebrow">FAQ</span>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
              Lo que <span style={{ color: "#FE5C02" }}>siempre</span> nos preguntan.
            </h2>
          </div>
          <div>
            {FAQS.map((faq) => (
              <details key={faq.q} className="ck-faq">
                <summary>
                  {faq.q}
                  <span className="ck-plus" aria-hidden="true">+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 16px clamp(72px, 9vw, 112px)" }}>
        <div style={{ background: "#FE5C02", borderRadius: 40, padding: "clamp(48px, 6vw, 72px) clamp(32px, 5vw, 64px)", maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="ck-eyebrow" style={{ color: "rgba(1,14,37,.55)" }}>¿NO SABES CUÁL ELEGIR?</span>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", color: "#010E25" }}>
              Te ayudamos a elegir,{" "}
              <span style={{ fontStyle: "italic" }}>sin compromiso.</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/audit" className="ck-btn ck-btn-dark">Pide una auditoría gratis →</Link>
            <a className="ck-btn ck-btn-wa" href={waLink("Hola, tengo preguntas sobre los servicios")} target="_blank" rel="noopener noreferrer">
              <span className="ck-dot" />Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <CartBar />
    </MarketingLayout>
  )
}
