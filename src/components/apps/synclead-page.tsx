import Link from "next/link"
import type { App } from "@/data/apps"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { SyncLeadPricing } from "./synclead-pricing"
import { SYNCLEAD_PLANS } from "@/data/synclead-plans"
import { waLink } from "@/lib/whatsapp"

const FEATURES = [
  { tag: "[SYNC]", bg: "#D6EBFF", t: "Leads de Meta Ads en tiempo real", d: "Cada persona que llena tu formulario de Meta aparece en tu pipeline al instante. Sin exportar, sin hojas de cálculo." },
  { tag: "[KANBAN]", bg: "#FFDCC7", t: "Pipeline visual", d: "Arrastra cada lead por tus etapas (Nuevo → Contactado → Calificado → Cliente) y sabe siempre dónde está cada oportunidad." },
  { tag: "[WHATSAPP]", bg: "#D3F2E3", t: "WhatsApp Business integrado", d: "Envía y recibe mensajes desde SyncLead. Tu equipo conversa sin cambiar de herramienta." },
  { tag: "[IA]", bg: "#E4DEFF", t: "Agentes de IA que responden al instante", d: "Saludan al lead por WhatsApp, lo califican y te lo pasan listo, a cualquier hora. Funcionan con Claude, GPT, Gemini y más." },
  { tag: "[SCORE]", bg: "#FFF8F0", t: "Calificación automática", d: "Define reglas y perfiles de puntuación: SyncLead clasifica cada lead según qué tan listo está para comprar." },
  { tag: "[CAPI]", bg: "#010E25", dark: true, t: "API de conversiones de Meta", d: "Cada venta confirmada se envía a Meta como Purchase, para que tus anuncios optimicen por ventas reales y no solo por formularios." },
  { tag: "[EQUIPO]", bg: "#D6EBFF", t: "Roles y trabajo en equipo", d: "Asigna leads, define permisos (Dueño, Admin, Manager, Agente) y revisa cada acción en el registro de actividad." },
  { tag: "[CSV]", bg: "#FFDCC7", t: "Importa leads de cualquier fuente", d: "¿Ya tienes leads en una hoja? Impórtalos por CSV: SyncLead detecta y une duplicados antes de que ensucien tu pipeline." },
]

const FAQS = [
  { q: "¿SyncLead funciona con cualquier cuenta de Meta Ads?", a: "Sí. Se conecta a cualquier Business Manager mediante la API oficial de Meta. Necesitas acceso de administrador; nosotros te guiamos en la conexión." },
  { q: "¿Necesito una cuenta de WhatsApp Business API?", a: "Para usar los mensajes dentro de SyncLead, sí: una cuenta oficial de WhatsApp Business API conectada por Meta. Si aún no la tienes, también te ayudamos a darla de alta." },
  { q: "¿Los agentes de IA responden en español?", a: "Sí. Son multilingües: tú configuras el idioma y la personalidad. La mayoría de nuestros clientes usan agentes en español para Latinoamérica." },
  { q: "¿Mis datos de Meta Ads están seguros?", a: "Los tokens de acceso de Meta se guardan cifrados con AES-256-GCM. SyncLead nunca guarda tu contraseña de Meta y puedes revocar el acceso cuando quieras." },
  { q: "¿Cómo se cobra y cómo cancelo?", a: "La suscripción se cobra con PayPal cada mes o cada año, según el plan que elijas. Puedes cancelarla cuando quieras desde tu cuenta de PayPal o escribiéndonos." },
  { q: "¿Qué pasa después de pagar?", a: "Te escribimos el mismo día para activar tu cuenta y conectar tu Meta Ads y tu WhatsApp contigo, paso a paso." },
]

const STEPS = [
  { n: "01", t: "Conecta Meta y WhatsApp", d: "Te ayudamos a conectar tu Business Manager y tu número de WhatsApp. Una sola vez." },
  { n: "02", t: "Recibe y califica", d: "Los leads llegan solos al pipeline y el agente de IA los saluda y califica." },
  { n: "03", t: "Responde, cierra y mide", d: "Tu equipo cierra por WhatsApp y cada venta vuelve a Meta para que tus anuncios aprendan." },
]

function Plus() {
  return <span className="ck-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>
}

export function SyncLeadPage({ app, cancelled = false }: { app: App; cancelled?: boolean }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "SyncLead",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: "CRM para leads de Meta Ads con pipeline visual, WhatsApp integrado, agentes de IA y API de conversiones de Meta.",
        url: `${siteUrl}/apps/synclead`,
        publisher: { "@id": `${siteUrl}/#organization` },
        offers: SYNCLEAD_PLANS.map((p) => ({ "@type": "Offer", name: `SyncLead ${p.name}`, price: p.monthly, priceCurrency: "USD", category: "subscription" })),
      },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  }

  return (
    <MarketingLayout active="apps" whatsapp={{ message: "¿Quieres ver SyncLead por dentro? Te hacemos una demo de 15 minutos por WhatsApp o videollamada.", replies: ["Quiero una demo de SyncLead", "¿Qué plan me conviene?", "Tengo una duda"] }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="ck-dots" style={{ padding: "56px 0 96px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 56 }}>
          <div style={{ flex: "1 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
            <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li><Link href="/apps">Apps</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>SyncLead</li></ol></nav>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="ck-tag" style={{ background: "#FE5C02" }}>CRM PARA META ADS</span>
              <span className="ck-tag" style={{ background: "#D3F2E3" }}>[WHATSAPP]</span>
              <span className="ck-tag" style={{ background: "#E4DEFF" }}>[IA]</span>
            </div>
            <h1 style={{ fontSize: "clamp(46px, 6vw, 88px)", lineHeight: 0.98 }}>Tus leads de Meta Ads, en tu pipeline. <span style={{ color: "#FE5C02" }}>Solos.</span></h1>
            <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 560 }}>SyncLead reúne los leads de tus anuncios, los ordena en un pipeline visual y deja que tu equipo, o un agente de IA, responda por WhatsApp. Todo en un solo lugar.</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
              <a className="ck-btn ck-btn-primary" href="#planes">Ver planes ↓</a>
              <a className="ck-btn ck-btn-wa" href={waLink("Hola, quiero una demo de SyncLead")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Pedir una demo</a>
            </div>
            <p className="ck-hand" style={{ fontSize: 26, color: "#C94400", transform: "rotate(-3deg)", transformOrigin: "left center" }}>↳ hecho por nosotros, con soporte en español</p>
          </div>

          <div className="ck-viz-stage" style={{ flex: "1 1 460px", minWidth: 0 }} aria-hidden="true">
            <div className="ck-viz" style={{ position: "relative", width: "min(560px, 100%)", background: "#FFF8F0", color: "#010E25", borderRadius: 26, border: "1.5px solid #010E25", boxShadow: "0 50px 90px -40px rgba(1,14,37,.6)" }}>
              <div style={{ background: "#010E25", borderRadius: "24px 24px 0 0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, color: "#fff", fontSize: 13 }}>
                <span className="ck-mono" style={{ fontSize: 11, border: "1.5px solid rgba(255,255,255,.5)", borderRadius: 6, padding: "3px 8px" }}>SYNCLEAD</span>
                <span>Panel</span><span style={{ color: "#FE5C02" }}>Leads</span><span>Campañas</span><span>Reportes</span>
                <span style={{ marginLeft: "auto", width: 26, height: 26, borderRadius: "50%", background: "#E4DEFF", color: "#010E25", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>CK</span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, fontSize: 12.5 }}>
                {[
                  ["NUEVO", [["#fff", "Lead nuevo", "META ADS · ahora", true], ["#fff", "Lead", "META ADS · 4 min", false]]],
                  ["CONTACTADO", [["#FFDCC7", "Lead", "WHATSAPP", false]]],
                  ["CALIFICADO", [["#E4DEFF", "Lead", "IA · caliente", false]]],
                  ["CLIENTE", [["#D3F2E3", "Cliente ✓", "PURCHASE → META", false]]],
                ].map(([h, items]) => (
                  <div key={h as string} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span className="ck-mono" style={{ fontSize: 10, color: "#5A6178" }}>{h as string}</span>
                    {(items as [string, string, string, boolean][]).map(([bg, t, s, hot], i) => (
                      <span key={i} className={hot ? "ck-pop ck-msg" : undefined} style={{ background: bg, border: bg === "#fff" ? "1.5px solid #010E25" : undefined, borderRadius: 12, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                        <strong style={{ fontWeight: 600 }}>{t}</strong><span className="ck-mono" style={{ fontSize: 9.5, color: "#C94400" }}>{s}</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="ck-pop ck-bob" style={{ position: "absolute", right: -22, bottom: -26, width: 240, background: "#EFE7DD", border: "1.5px solid #010E25", borderRadius: 18, padding: 12, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <span style={{ alignSelf: "flex-start", background: "#fff", borderRadius: "12px 12px 12px 4px", padding: "8px 10px" }}>¡Hola! Vi que te interesa la promo. ¿Para qué fecha la quieres?</span>
                <span className="ck-mono" style={{ alignSelf: "flex-start", fontSize: 10, background: "#010E25", color: "#fff", borderRadius: 6, padding: "3px 7px" }}>AGENTE IA · respondió en segundos</span>
              </div>
              <div className="ck-pop ck-bob-2" style={{ position: "absolute", left: -20, top: 70, background: "#FE5C02", border: "1.5px solid #010E25", borderRadius: 14, padding: "8px 12px", fontSize: 13, fontWeight: 700 }}>+1 lead nuevo</div>
            </div>
          </div>
        </div>
      </section>

      {/* ANTES / DESPUÉS */}
      <section className="ck-section" style={{ background: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 780 }}>
            <span className="ck-eyebrow">El problema</span>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)" }}>Los leads se pierden entre hojas de cálculo y chats. <span style={{ color: "#FE5C02" }}>SyncLead los ordena.</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 20 }}>
            <div className="ck-tilt ck-tilt-l" style={{ background: "#FFF8F0", border: "1.5px solid rgba(1,14,37,.14)", borderRadius: 32, padding: "clamp(24px, 4vw, 40px)" }}>
              <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "#8A1F1F" }}>✕ SIN SYNCLEAD</span>
              {["Exportas leads de Meta a mano, cuando te acuerdas.", "Nadie sabe quién respondió a quién.", "Los leads de la noche esperan hasta el lunes.", "Meta optimiza por formularios, no por ventas."].map((t) => <p key={t} style={{ padding: "14px 0", borderBottom: "1.5px solid rgba(1,14,37,.08)", color: "#5A6178" }}>{t}</p>)}
            </div>
            <div className="ck-tilt ck-tilt-r" style={{ background: "#D3F2E3", border: "1.5px solid #010E25", borderRadius: 32, padding: "clamp(24px, 4vw, 40px)" }}>
              <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "#1F6B42" }}>✓ CON SYNCLEAD</span>
              {["Cada lead llega solo, en el momento.", "Cada conversación tiene dueño y etapa.", "Un agente de IA responde al instante, 24/7.", "Cada venta vuelve a Meta con la API de conversiones."].map((t) => <p key={t} style={{ padding: "14px 0", borderBottom: "1.5px solid rgba(1,14,37,.1)", fontWeight: 500 }}>{t}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONES */}
      <section className="ck-section">
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
              <span className="ck-eyebrow">Funciones</span>
              <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)" }}>Todo lo que tu equipo necesita para <span style={{ color: "#FE5C02" }}>no perder un lead</span>.</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(270px, 100%), 1fr))", gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.t} className="ck-lift" style={{ background: f.bg, color: f.dark ? "#fff" : "#010E25", border: f.bg === "#FFF8F0" ? "1.5px solid #010E25" : undefined, borderRadius: 26, padding: 24, display: "flex", flexDirection: "column", gap: 12, minHeight: 230 }}>
                <span className="ck-tag" style={f.dark ? { alignSelf: "flex-start", color: "#fff", borderColor: "rgba(255,255,255,.6)" } : { alignSelf: "flex-start", background: "#fff" }}>{f.tag}</span>
                <h3 style={{ fontSize: 22, letterSpacing: "-0.02em", color: f.dark ? "#fff" : undefined }}>{f.t}</h3>
                <p style={{ fontSize: 15.5, color: f.dark ? "rgba(255,255,255,.8)" : "#2A3147" }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="ck-section" style={{ background: "#010E25", color: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 780 }}>
            <span className="ck-eyebrow" style={{ color: "rgba(255,255,255,.7)" }}>Cómo funciona</span>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)", color: "#fff" }}>Del anuncio a la venta, <span style={{ color: "#FE5C02" }}>en tres pasos</span>.</h2>
          </div>
          <div className="ck-steps" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 28 }}>
            {STEPS.map((s) => (
              <div key={s.n} className="ck-step" style={{ background: "#FFF8F0", color: "#010E25", borderRadius: 26, padding: 28, display: "flex", flexDirection: "column", gap: 14, minHeight: 240 }}>
                <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#FE5C02" }}>{s.n}</span>
                <h3 style={{ fontSize: 26 }}>{s.t}</h3>
                <p style={{ fontSize: 16, color: "#3A4158" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="ck-section" style={{ scrollMarginTop: 90 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
            <span className="ck-eyebrow">Planes</span>
            <h2 style={{ fontSize: "clamp(38px, 5vw, 68px)", maxWidth: 900 }}>Elige tu plan y empieza <span style={{ color: "#FE5C02" }}>esta semana</span>.</h2>
            <p style={{ color: "#5A6178", maxWidth: 620 }}>Te acompañamos en la conexión de Meta y WhatsApp. Sin permanencia, cancelas cuando quieras.</p>
          </div>
          <SyncLeadPricing cancelled={cancelled} />
        </div>
      </section>

      {/* INCLUIDO CON SERVICIOS */}
      {app.includedWithServices && (
        <section style={{ padding: "0 16px 72px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", background: "#E4DEFF", border: "1.5px solid #010E25", borderRadius: 40, padding: "clamp(28px, 5vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
              <span className="ck-hand" style={{ fontSize: 28, color: "#C94400" }}>¿contratas Meta Ads o automatización con nosotros?</span>
              <h2 style={{ fontSize: "clamp(30px, 3.6vw, 46px)" }}>SyncLead viene incluido con nuestros servicios de Meta Ads y automatización.</h2>
            </div>
            <Link className="ck-btn ck-btn-dark" href="/services#ads">Ver servicios →</Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ paddingBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
          <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="ck-eyebrow">Preguntas frecuentes</span>
            <h2 style={{ fontSize: "clamp(36px, 4.4vw, 58px)" }}>Lo que nos preguntan de SyncLead</h2>
            <a className="ck-btn ck-btn-wa" style={{ alignSelf: "flex-start" }} href={waLink("Hola, tengo una duda sobre SyncLead")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Pregúntanos</a>
          </div>
          <div style={{ flex: "2 1 560px", minWidth: 0 }}>
            {FAQS.map((f, i) => <details key={f.q} className="ck-faq" open={i === 0}><summary>{f.q}<Plus /></summary><p>{f.a}</p></details>)}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
