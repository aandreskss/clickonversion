import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ContactForm } from "@/components/marketing/contact-form"
import { HeroScene } from "@/components/brand/hero-scene"
import { FreeAuditSection, AdsSellSection } from "@/components/brand/home-promos"
import { MarqueeBands } from "@/components/brand/marquee-bands"
import { ValueCube } from "@/components/brand/value-cube"
import { TeamGrid } from "@/components/brand/team-grid"
import { LogoSymbol } from "@/components/ui/logo-wordmark"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: { absolute: "ClicKonversion — Marketing hecho por personas: SEO, Ads, IA y WhatsApp" },
  description:
    "SEO local y técnico, Meta y Google Ads, agentes de IA para WhatsApp, desarrollo web y medición de conversiones. Un equipo de tres personas que te explica cada decisión.",
  alternates: { canonical: "https://www.clickonversion.com" },
  openGraph: {
    title: "ClicKonversion — Marketing hecho por personas, para personas",
    description: "SEO, anuncios, agentes de IA, webs y medición explicados en cristiano. Hablas con nosotros, no con un ticket.",
    url: "https://www.clickonversion.com",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

const SERVICES = [
  { tag: "[SEO]", n: "01", bg: "#D6EBFF", q: "«Nadie me encuentra en Google.»", t: "SEO y búsqueda en IA", d: "SEO local, SEO técnico, Google Business y visibilidad en ChatGPT. Con reportes que entiendes." },
  { tag: "[ADS]", n: "02", bg: "#FFDCC7", q: "«Pago anuncios y no sé qué funciona.»", t: "Meta, Google y TikTok Ads", d: "Campañas y creativos que llevan a la gente a escribirte. Reporte semanal en lenguaje humano." },
  { tag: "[IA]", n: "03", bg: "#E4DEFF", q: "«Me escriben de noche y nadie responde.»", t: "Agentes IA y automatización", d: "El agente de IA responde, califica y te pasa al cliente listo. Tú cierras la venta." },
  { tag: "[CHAT]", n: "04", bg: "#D3F2E3", q: "«Se me pierden los mensajes.»", t: "WhatsApp y atención", d: "WhatsApp Business, CRM y seguimiento para que ningún cliente se quede esperando." },
  { tag: "[DEV]", n: "05", bg: "#010E25", dark: true, q: "«Mi web es lenta y no vende.»", t: "Desarrollo web y apps", d: "Páginas web, aplicaciones web, apps y landings optimizadas para convertir visitas en clientes." },
  { tag: "[TRACKING]", n: "06", bg: "#FFF8F0", line: true, q: "«No sé de dónde vienen mis ventas.»", t: "Configuración técnica y medición", d: "API de conversiones de Meta, píxel y conversiones en Google, Meta y TikTok Ads." },
]

const STEPS = [
  { n: "01", tag: "[15 MIN]", bg: "#D3F2E3", t: "Te escuchamos", d: "Una llamada corta para entender tu negocio, qué vendes y qué has probado." },
  { n: "02", tag: "[PLAN]", bg: "#D6EBFF", t: "Te explicamos el plan", d: "Qué haríamos, por qué y cuánto cuesta. Técnico, pero traducido a tu negocio." },
  { n: "03", tag: "[EN MARCHA]", bg: "#E4DEFF", t: "Lo hacemos y lo medimos", d: "Web, SEO, campañas o agentes funcionando. Medimos lo que importa: clientes reales." },
  { n: "04", tag: "[REPORTE]", bg: "#FFDCC7", t: "Te contamos qué pasó", d: "En lenguaje humano. Si algo no funcionó, te lo decimos y lo cambiamos." },
]


export default function HomePage() {
  return (
    <MarketingLayout>
      {/* HERO */}
      <section className="ck-dots" style={{ position: "relative", padding: "64px 0 120px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 56 }}>
          <div style={{ flex: "1 1 500px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="ck-tag" style={{ background: "#D6EBFF" }}>[SEO]</span>
              <span className="ck-tag" style={{ background: "#FFDCC7" }}>[ADS]</span>
              <span className="ck-tag" style={{ background: "#E4DEFF" }}>[IA]</span>
              <span className="ck-tag" style={{ background: "#D3F2E3" }}>[CHAT]</span>
              <span className="ck-tag" style={{ background: "#fff" }}>[DEV]</span>
              <span className="ck-tag" style={{ background: "#fff" }}>[TRACKING]</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 4.4vw, 80px)", lineHeight: 1 }}>
              <span style={{ display: "block" }}>Marketing hecho</span>
              <span style={{ display: "block" }}>
                por{" "}
                <span style={{ position: "relative", display: "inline-block", color: "#FE5C02" }}>
                  personas
                </span>
                ,
              </span>
              <span style={{ display: "block" }}>para personas.</span>
            </h1>
            <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 520 }}>
              SEO, anuncios, agentes de IA y webs explicados en cristiano. Hablas con nosotros, no con un ticket.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
              <Link className="ck-btn ck-btn-primary" href="/pricing">Ver precios y paquetes ↗</Link>
              <a className="ck-btn ck-btn-wa" href={waLink("Hola, quiero más clientes")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Escríbenos por WhatsApp</a>
            </div>
            <p className="ck-hand" style={{ fontSize: 26, color: "#C94400", transform: "rotate(-3deg)", transformOrigin: "left center", marginLeft: 6 }}>↳ te respondemos nosotros, no un bot</p>
          </div>
          <HeroScene />
        </div>
      </section>

      <MarqueeBands />

      <FreeAuditSection />

      {/* ESENCIA */}
      <section className="ck-section">
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <span className="ck-eyebrow">01 · La máquina y la mano</span>
              <h2 style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>Tecnología precisa. <span style={{ color: "#FE5C02" }}>Trato humano.</span></h2>
            </div>
            <p style={{ maxWidth: 420, color: "#5A6178" }}>Todo lo que hacemos tiene dos mitades: una precisa, de datos y código; otra humana, de escuchar, explicar y decir la verdad.</p>
          </div>
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 24 }}>
            <div className="ck-tilt ck-tilt-l" style={{ background: "#010E25", color: "#fff", borderRadius: 32, padding: "clamp(28px, 4vw, 48px)", minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
              <div className="ck-depth" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "rgba(255,255,255,.7)" }}>LA MÁQUINA · lo que hacemos</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["[IA]", "[SEO]", "[ADS]", "[AUTOMATIZACIÓN]", "[CRM]"].map((t) => <span key={t} className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "#fff" }}>Datos, algoritmos, campañas y código.</h3>
                <p style={{ color: "rgba(255,255,255,.78)", maxWidth: 440 }}>Rigor, medición y confianza. Cada decisión tiene un número detrás, y ese número es real.</p>
              </div>
            </div>
            <div className="ck-tilt ck-tilt-r" style={{ background: "#FFDCC7", borderRadius: 32, padding: "clamp(28px, 4vw, 48px)", minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
              <div className="ck-depth" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "#8A3300" }}>LA MANO · cómo lo hacemos</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["atención", "comunicación", "honestidad", "calidad humana"].map((t) => <span key={t} style={{ background: "#fff", borderRadius: 999, padding: "8px 16px", fontWeight: 600, fontSize: 15 }}>{t}</span>)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>Escuchar, explicar y responder rápido.</h3>
                <p style={{ color: "#3A4158", maxWidth: 440 }}>Hablas siempre con las mismas personas. Si algo no funciona, te lo decimos primero, sin maquillar números.</p>
              </div>
            </div>
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: 150, height: 150, transform: "translate(-50%, -50%)", zIndex: 5, pointerEvents: "none" }}>
              <div style={{ position: "relative", width: 150, height: 150, background: "#FFF8F0", borderRadius: "50%", border: "1.5px solid #010E25", boxShadow: "0 20px 40px -20px rgba(1,14,37,.5)" }}>
                <svg className="ck-ring" viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: 150, height: 150 }}>
                  <defs><path id="ckring" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
                  <text className="ck-ring-text"><textPath href="#ckring">¡CONVERTIMOS CLICS EN VENTAS! · </textPath></text>
                </svg>
                <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}><LogoSymbol size={58} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="ck-section" style={{ background: "#fff", borderRadius: "48px 48px 0 0" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 780 }}>
              <span className="ck-eyebrow">02 · Servicios</span>
              <h2 style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>Que te encuentren, te escriban y te <span style={{ color: "#FE5C02" }}>compren</span>.</h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link className="ck-btn ck-btn-dark" href="/services">Ver todos los servicios →</Link>
              <Link className="ck-btn ck-btn-primary" href="/pricing">Precios y paquetes ↗</Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <Link key={s.tag} href="/services" className="ck-svc" style={{ background: s.bg, border: s.line ? "1.5px solid #010E25" : undefined, color: s.dark ? "#fff" : "#010E25", borderRadius: 28, padding: 28, minHeight: 420, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="ck-tag" style={s.dark ? { color: "#fff", borderColor: "rgba(255,255,255,.6)" } : { background: s.line ? "#fff" : undefined }}>{s.tag}</span>
                  <span className="ck-mono" style={{ fontSize: 13, color: s.dark ? "rgba(255,255,255,.7)" : "#3A4158" }}>{s.n}</span>
                </div>
                <div className="ck-q" style={{ alignSelf: "flex-start", background: "#fff", color: "#010E25", border: s.line ? "1.5px solid #010E25" : undefined, borderRadius: "18px 18px 18px 6px", padding: "12px 16px", fontSize: 16, fontWeight: 500, boxShadow: "0 18px 30px -20px rgba(1,14,37,.45)" }}>{s.q}</div>
                <div className="ck-ttl" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: 28, color: s.dark ? "#fff" : undefined }}>{s.t}</h3>
                  <p style={{ fontSize: 16, color: s.dark ? "rgba(255,255,255,.8)" : "#2A3147" }}>{s.d}</p>
                  <span style={{ fontWeight: 600, fontSize: 16, textDecoration: "underline", textUnderlineOffset: 4, color: s.dark ? "#FFDCC7" : undefined }}>Así lo hacemos <span className="ck-arrow">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdsSellSection />

      {/* PROCESO */}
      <section className="ck-section" style={{ background: "#010E25", color: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>
            <span className="ck-eyebrow" style={{ color: "rgba(255,255,255,.7)" }}>03 · Cómo trabajamos</span>
            <h2 style={{ fontSize: "clamp(38px, 5vw, 68px)", color: "#fff" }}>Cuatro pasos. Cada uno, <span style={{ color: "#FE5C02" }}>un escalón</span> hacia arriba.</h2>
            <p className="ck-hand" style={{ fontSize: 28, color: "#FFDCC7", transform: "rotate(-2deg)", transformOrigin: "left" }}>↳ sin letra pequeña</p>
          </div>
          <div className="ck-steps" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: 28, alignItems: "start" }}>
            <svg className="ck-trail" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", left: "4%", top: -20, width: "92%", height: 300, overflow: "visible", pointerEvents: "none" }}>
              <path className="ck-trail-line" d="M0 100 C 30 92, 55 60, 100 0" vectorEffect="non-scaling-stroke" />
            </svg>
            {STEPS.map((s, i) => (
              <div key={s.n} className={`ck-step ck-s${i + 1}`} style={{ position: "relative", background: "#FFF8F0", color: "#010E25", borderRadius: 26, padding: 28, display: "flex", flexDirection: "column", gap: 18, minHeight: 300 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#FE5C02" }}>{s.n}</span>
                  <span className="ck-tag" style={{ background: s.bg }}>{s.tag}</span>
                </div>
                <h3 style={{ fontSize: 26 }}>{s.t}</h3>
                <p style={{ fontSize: 16, color: "#3A4158" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ValueCube />

      {/* EQUIPO */}
      <section id="equipo" className="ck-section" style={{ background: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 760 }}>
              <span className="ck-eyebrow">05 · Quiénes somos</span>
              <h2 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Hablas con quien <span style={{ color: "#FE5C02" }}>hace el trabajo</span>.</h2>
            </div>
            <p style={{ maxWidth: 440, fontSize: 19, color: "#3A4158" }}>Somos tres: Arnaldo, Abisai y Yoli. Un equipo pequeño a propósito: aquí no hay ejecutivos de cuenta, cada decisión te la explica quien la ejecuta.</p>
          </div>
          <TeamGrid />
          <div style={{ display: "flex", justifyContent: "flex-end" }}><span className="ck-hand" style={{ fontSize: 30, color: "#C94400", transform: "rotate(-3deg)" }}>— prometido, el equipo.</span></div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="ck-section">
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 64 }}>
          <div className="ck-reveal" style={{ flex: "1 1 480px", minWidth: 0, background: "#fff", borderRadius: 32, padding: "clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", gap: 20, boxShadow: "0 40px 80px -60px rgba(1,14,37,.5)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="ck-eyebrow">06 · Hablemos</span>
              <h2 style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>Cuéntanos de tu negocio</h2>
              <p className="ck-hand" style={{ fontSize: 26, color: "#C94400" }}>te leemos nosotros, no un robot ↓</p>
            </div>
            <ContactForm />
          </div>
          <div className="ck-phone-stage" style={{ flex: "1 1 380px", minWidth: 0, display: "flex", justifyContent: "center", perspective: 1300, padding: "32px 0", position: "relative" }}>
            <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "min(420px, 90%)", aspectRatio: "1 / 1", borderRadius: "50%", background: "#FFDCC7", transform: "translate(-50%, -50%)" }} />
            <div className="ck-phone" aria-hidden="true" style={{ position: "relative", width: 320, maxWidth: "100%", height: 620, borderRadius: 46, border: "10px solid #010E25", background: "#EFE7DD", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "30px 50px 80px -40px rgba(1,14,37,.65)" }}>
              <div style={{ background: "#010E25", color: "#fff", padding: "22px 18px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 42, height: 42, borderRadius: "50%", background: "#FE5C02", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><LogoSymbol size={30} inverted /></span>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}><strong style={{ fontWeight: 600, fontSize: 16 }}>ClicKonversion</strong><span style={{ fontSize: 13, color: "rgba(255,255,255,.75)" }}>te responde una persona</span></div>
              </div>
              <div style={{ flex: 1, padding: "18px 14px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "flex-end", fontSize: 14.5, lineHeight: 1.4 }}>
                <div className="ck-msg" style={{ alignSelf: "flex-start", maxWidth: "84%", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>¡Hola! Soy Arnaldo. Cuéntame de tu negocio y te digo por dónde empezaría.</div>
                <div className="ck-msg ck-m2" style={{ alignSelf: "flex-end", maxWidth: "84%", background: "#D3F2E3", borderRadius: "16px 16px 4px 16px", padding: "10px 14px" }}>Tengo una clínica y quiero más citas.</div>
                <div className="ck-msg ck-m3" style={{ alignSelf: "flex-start", maxWidth: "84%", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>¡Claro! ¿Hoy cómo te llegan los pacientes: Instagram, Google o recomendados?</div>
                <div className="ck-msg ck-m4" style={{ alignSelf: "flex-end", maxWidth: "84%", background: "#D3F2E3", borderRadius: "16px 16px 4px 16px", padding: "10px 14px" }}>Más que nada por Instagram.</div>
                <div className="ck-msg ck-m5" style={{ alignSelf: "flex-start", maxWidth: "84%", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>Perfecto. Te escribo hoy mismo con una propuesta.</div>
                <div className="ck-msg ck-m6 ck-typing" style={{ alignSelf: "flex-start", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "12px 14px" }}><span /><span /><span /></div>
              </div>
            </div>
            <p className="ck-hand" aria-hidden="true" style={{ position: "absolute", right: 0, bottom: 6, fontSize: 26, color: "#C94400", transform: "rotate(-6deg)" }}>así de simple ↗</p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
