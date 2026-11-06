import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { SYNCLEAD_PLANS } from "@/data/synclead-plans"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Apps: SyncLead CRM para leads de Meta Ads",
  description: "Las herramientas que construimos para vender más por WhatsApp. SyncLead: CRM para leads de Meta Ads con pipeline, WhatsApp, agentes de IA y API de conversiones. Planes desde $29 al mes.",
  alternates: { canonical: "https://www.clickonversion.com/apps" },
  openGraph: {
    title: "Apps | ClicKonversion",
    description: "SyncLead: tus leads de Meta Ads, en tu pipeline. Solos.",
    url: "https://www.clickonversion.com/apps",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

export default function AppsPage() {
  const from = Math.min(...SYNCLEAD_PLANS.map((p) => p.monthly))
  return (
    <MarketingLayout active="apps" whatsapp={{ message: "¿Quieres ver SyncLead por dentro? Te hacemos una demo de 15 minutos.", replies: ["Quiero una demo de SyncLead", "Necesito una app a medida", "Tengo una duda"] }}>
      <section className="ck-dots" style={{ padding: "56px 0 56px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>Apps</li></ol></nav>
          <h1 style={{ fontSize: "clamp(46px, 6.4vw, 96px)", lineHeight: 0.98, maxWidth: 1000 }}>Software que hicimos para <span style={{ color: "#FE5C02" }}>vender más por WhatsApp</span>.</h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 700 }}>Herramientas para resolver lo que vemos todos los días con nuestros clientes: leads que se pierden y mensajes sin responder. Úsalas con suscripción mensual o anual.</p>
        </div>
      </section>

      <section style={{ padding: "0 16px 72px" }}>
        <Link href="/apps/synclead" className="ck-svc" style={{ maxWidth: 1240, margin: "0 auto", background: "#010E25", color: "#fff", borderRadius: 44, padding: "clamp(28px, 5vw, 64px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 56 }}>
          <div className="ck-ttl" style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="ck-tag" style={{ background: "#FE5C02" }}>DISPONIBLE</span>
              <span className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>[CRM]</span>
              <span className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>[META ADS]</span>
              <span className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>[WHATSAPP]</span>
            </div>
            <h2 style={{ fontSize: "clamp(40px, 5vw, 72px)", color: "#fff" }}>SyncLead</h2>
            <p style={{ fontSize: 22, color: "#FFDCC7", fontWeight: 500 }}>Tus leads de Meta Ads, en tu pipeline. Solos.</p>
            <p style={{ color: "rgba(255,255,255,.8)" }}>Pipeline visual, WhatsApp integrado, agentes de IA que responden al instante y API de conversiones de Meta para que tus anuncios aprendan de ventas reales.</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
              <span className="ck-btn ck-btn-primary on-dark">Ver planes y funciones →</span>
              <span style={{ fontSize: 18 }}>desde <strong style={{ fontSize: 28, letterSpacing: "-0.04em" }}>${from}</strong>/mes</span>
            </div>
          </div>
          <div className="ck-q" style={{ flex: "1 1 400px", minWidth: 0, display: "flex", justifyContent: "center" }} aria-hidden="true">
            <div style={{ width: "min(480px, 100%)", background: "#FFF8F0", color: "#010E25", borderRadius: 22, overflow: "hidden", boxShadow: "0 50px 90px -40px rgba(0,0,0,.8)" }}>
              <div style={{ background: "#1B2A47", padding: "10px 14px", display: "flex", gap: 12, color: "#fff", fontSize: 12 }}><span className="ck-mono" style={{ fontSize: 10.5, border: "1px solid rgba(255,255,255,.5)", borderRadius: 5, padding: "2px 7px" }}>SYNCLEAD</span><span style={{ color: "#FE5C02" }}>Leads</span><span>Campañas</span></div>
              <div style={{ padding: 14, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, fontSize: 12 }}>
                {[["NUEVO", "#fff"], ["CONTACTADO", "#FFDCC7"], ["CLIENTE", "#D3F2E3"]].map(([h, bg]) => (
                  <div key={h} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span className="ck-mono" style={{ fontSize: 10, color: "#5A6178" }}>{h}</span>
                    <span style={{ background: bg, border: bg === "#fff" ? "1.5px solid #010E25" : undefined, borderRadius: 10, padding: 9 }}>Lead</span>
                    <span style={{ background: bg, border: bg === "#fff" ? "1.5px solid #010E25" : undefined, borderRadius: 10, padding: 9, opacity: .7 }}>Lead</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section style={{ padding: "0 16px clamp(80px, 10vw, 120px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 20 }}>
          <div style={{ background: "#fff", border: "1.5px dashed #010E25", borderRadius: 36, padding: "clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "#5A6178" }}>PRÓXIMAMENTE</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>Más apps en camino</h2>
            <p style={{ color: "#5A6178" }}>Estamos construyendo nuevas herramientas para atención y ventas por WhatsApp. Déjanos tu WhatsApp y te avisamos primero.</p>
            <a className="ck-btn ck-btn-wa" style={{ alignSelf: "flex-start" }} href={waLink("Hola, avísenme cuando salgan nuevas apps")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Avísenme</a>
          </div>
          <div style={{ background: "#FFDCC7", borderRadius: 36, padding: "clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "#8A3300" }}>[DEV] · A MEDIDA</span>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>¿Necesitas una app propia?</h2>
            <p style={{ color: "#3A4158" }}>Construimos aplicaciones web y apps a medida para tu operación, como hicimos con SyncLead.</p>
            <Link className="ck-btn ck-btn-dark" style={{ alignSelf: "flex-start" }} href="/services#dev">Ver desarrollo a medida →</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
