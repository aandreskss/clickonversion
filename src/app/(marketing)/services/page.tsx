import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { CartBar } from "@/components/marketing/cart-bar"
import { ServiceRows } from "@/components/brand/service-rows"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Servicios de marketing digital: SEO, Ads, creación de anuncios, agentes IA, WhatsApp, webs y medición",
  description:
    "SEO local y técnico, Meta, Google y TikTok Ads, creación de anuncios, agentes de IA para WhatsApp, CRM, desarrollo web y configuración de píxel y API de conversiones. Precios publicados y un equipo que te explica cada decisión.",
  alternates: { canonical: "https://www.clickonversion.com/services" },
  openGraph: {
    title: "Servicios de marketing digital | ClicKonversion",
    description: "SEO, Ads, IA, WhatsApp, webs y medición. Todo publicado, sin letra pequeña.",
    url: "https://www.clickonversion.com/services",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

const FAQS = [
  { q: "¿Cuánto tiempo tarda en verse resultados?", a: "Depende del canal. SEO toma entre 3 y 6 meses. Publicidad de pago puede generar resultados desde la primera semana. Automatizaciones, desde el día de lanzamiento." },
  { q: "¿Puedo contratar servicios de más de un área?", a: "Sí. Muchos clientes combinan SEO con Meta Ads, o un agente IA con automatización de WhatsApp. Agrega los que necesitas al carrito o arma tu paquete con descuento." },
  { q: "¿Qué pasa si quiero cancelar un servicio mensual?", a: "Sin permanencia. Puedes cancelar desde tu panel de cliente cuando quieras, sin penalización." },
  { q: "¿Ustedes crean los anuncios o solo los gestionan?", a: "Las dos cosas. Podemos crear los anuncios (guion, diseño, edición de video y textos) y también gestionarlos en Meta, TikTok y Google. Si ya tienes tus piezas, solo gestionamos." },
  { q: "¿Necesito una página web para hacer anuncios?", a: "No siempre. Muchas campañas llevan directo a WhatsApp. Si hace falta, armamos una landing optimizada para convertir." },
  { q: "¿Qué es la API de conversiones de Meta y por qué la necesito?", a: "Es una conexión que envía los eventos de tu negocio a Meta desde tu servidor, además del píxel del navegador. Así se pierden menos datos y tus anuncios aprenden mejor." },
  { q: "¿Trabajan con empresas fuera de Venezuela?", a: "Sí. Atendemos clientes en Estados Unidos, España, México, Colombia y Venezuela, tanto en inglés como en español." },
]

type Block = {
  id: string
  tag: string
  n: string
  bg: string
  dark?: boolean
  border?: boolean
  reverse?: boolean
  h2: React.ReactNode
  p: string
  includes: string[]
  ideal: string
  ids: string[]
  details: { slug: string; label: string }[]
  quote?: string
  /** Fila "a cotizar" cuando el servicio no tiene precio publicado */
  quoteRow?: { title: string; desc: string; msg: string }
  viz: React.ReactNode
}

const card = { boxShadow: "0 40px 70px -40px rgba(1,14,37,.55)" }

const VIZ_SEO = (
  <div className="ck-viz" style={{ position: "relative", width: "min(460px, 100%)", display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ background: "#fff", border: "1.5px solid #010E25", borderRadius: 999, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 16 }}>
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>dentista cerca de mí
    </div>
    <div className="ck-pop" style={{ background: "#fff", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 6, ...card }}>
      <span className="ck-mono" style={{ fontSize: 12, color: "#1F7A45" }}>tunegocio.com › citas</span>
      <span style={{ fontSize: 20, fontWeight: 600, color: "#1A3FB0" }}>[Tu negocio] — Agenda tu cita hoy</span>
      <span style={{ fontSize: 14, color: "#5A6178" }}>★★★★★ · reseñas reales · Abierto ahora</span>
    </div>
    <div style={{ background: "#010E25", color: "#fff", borderRadius: 22, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6, transform: "translateZ(30px)" }}>
      <span className="ck-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>RESPUESTA DE IA</span>
      <span style={{ fontSize: 15 }}>Una buena opción cerca de ti es <strong style={{ color: "#FFDCC7", fontWeight: 600 }}>[Tu negocio]</strong>, con buenas reseñas y citas el mismo día.</span>
    </div>
  </div>
)

const VIZ_ADS = (
  <div className="ck-viz ck-viz-r" style={{ position: "relative", width: "min(380px, 100%)", background: "#fff", border: "1.5px solid #010E25", borderRadius: 26, ...card }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16 }}>
      <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#FE5C02", flex: "none" }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}><strong style={{ fontSize: 15, fontWeight: 600 }}>[Tu marca]</strong><span style={{ fontSize: 12, color: "#5A6178" }}>Publicidad</span></div>
    </div>
    <div className="ck-stripes" style={{ aspectRatio: "1 / 1", display: "flex", alignItems: "flex-end", padding: 14, ["--a" as string]: "#FFE7D8", ["--b" as string]: "#FFF1E8" } as React.CSSProperties}>
      <span className="ck-mono" style={{ fontSize: 11, background: "#fff", padding: "5px 8px", borderRadius: 6, color: "#5A6178" }}>CREATIVO · foto real del producto</span>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 16px" }}>
      <span style={{ fontSize: 15, fontWeight: 600 }}>¿Lo quieres? Escríbenos</span>
      <span style={{ background: "#010E25", color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Enviar mensaje</span>
    </div>
    <div className="ck-pop ck-bob" style={{ position: "absolute", right: -20, top: 24, background: "#D3F2E3", border: "1.5px solid #010E25", borderRadius: 16, padding: "10px 14px", display: "flex", flexDirection: "column" }}>
      <span className="ck-mono" style={{ fontSize: 11, color: "#3A4158" }}>MENSAJES</span>
      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.04em" }}>nuevos <span style={{ color: "#C94400" }}>↗</span></span>
    </div>
  </div>
)

const VIZ_IA = (
  <div className="ck-viz" style={{ width: "min(400px, 100%)", background: "#EFE7DD", border: "1.5px solid #010E25", borderRadius: 28, padding: 18, display: "flex", flexDirection: "column", gap: 10, fontSize: 15, ...card }}>
    <div style={{ alignSelf: "flex-end", background: "#D3F2E3", borderRadius: "16px 16px 4px 16px", padding: "10px 14px" }}>¿Tienen cita para mañana?</div>
    <div className="ck-pop" style={{ alignSelf: "flex-start", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 14px", maxWidth: "86%" }}>Sí: a las 10:00 o a las 15:00. ¿Cuál te queda mejor?</div>
    <div style={{ alignSelf: "flex-end", background: "#D3F2E3", borderRadius: "16px 16px 4px 16px", padding: "10px 14px" }}>A las 15:00</div>
    <div className="ck-pop" style={{ alignSelf: "flex-start", background: "#fff", borderRadius: "16px 16px 16px 4px", padding: "10px 14px", maxWidth: "86%" }}>¡Listo! Te paso con el equipo para confirmar.</div>
    <span className="ck-mono" style={{ alignSelf: "center", fontSize: 12, background: "#010E25", color: "#fff", padding: "6px 10px", borderRadius: 8, marginTop: 6 }}>[AGENTE IA] → cliente listo para cerrar</span>
  </div>
)

const VIZ_CHAT = (
  <div className="ck-viz ck-viz-r" style={{ width: "min(460px, 100%)", background: "#fff", border: "1.5px solid #010E25", borderRadius: 28, padding: 18, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, fontSize: 13, ...card }}>
    {[["NUEVO", "#D6EBFF", ["María · clínica", "Luis · tienda"]], ["CONVERSANDO", "#FFDCC7", ["Ana · taller"]], ["CLIENTE", "#D3F2E3", ["Pedro · spa ✓", "Sofía · café ✓"]]].map(([h, bg, items]) => (
      <div key={h as string} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="ck-mono" style={{ fontSize: 11, color: "#5A6178" }}>{h as string}</span>
        {(items as string[]).map((t) => <span key={t} className={h === "CONVERSANDO" ? "ck-pop" : undefined} style={{ background: bg as string, borderRadius: 12, padding: 10 }}>{t}</span>)}
      </div>
    ))}
  </div>
)

const VIZ_DEV = (
  <div className="ck-viz" style={{ position: "relative", width: "min(480px, 100%)", background: "#FFF8F0", borderRadius: 22, color: "#010E25", boxShadow: "0 40px 80px -40px rgba(0,0,0,.8)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", borderBottom: "1.5px solid rgba(1,14,37,.1)" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FE5C02" }} /><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFDCC7" }} /><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#D3F2E3" }} />
      <span className="ck-mono" style={{ marginLeft: 10, fontSize: 12, color: "#5A6178", background: "#fff", borderRadius: 999, padding: "4px 12px" }}>tunegocio.com</span>
    </div>
    <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ display: "block", width: "70%", height: 22, borderRadius: 6, background: "#010E25" }} />
      <span style={{ display: "block", width: "48%", height: 22, borderRadius: 6, background: "#FE5C02" }} />
      <span style={{ display: "block", width: "86%", height: 10, borderRadius: 6, background: "#E6E8EE" }} />
      <span style={{ display: "block", width: "64%", height: 10, borderRadius: 6, background: "#E6E8EE" }} />
      <span style={{ display: "block", width: 150, height: 38, borderRadius: 999, background: "#FE5C02", border: "1.5px solid #010E25", marginTop: 6 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginTop: 8 }}><span style={{ height: 60, borderRadius: 12, background: "#D6EBFF" }} /><span style={{ height: 60, borderRadius: 12, background: "#FFDCC7" }} /><span style={{ height: 60, borderRadius: 12, background: "#E4DEFF" }} /></div>
    </div>
    <div className="ck-pop" style={{ position: "absolute", right: -18, bottom: -18, display: "flex", flexDirection: "column", gap: 6 }}>
      <span className="ck-tag" style={{ background: "#D3F2E3" }}>[MÓVIL PRIMERO]</span>
      <span className="ck-tag" style={{ background: "#D6EBFF" }}>[SEO LISTO]</span>
      <span className="ck-tag" style={{ background: "#fff" }}>[CARGA RÁPIDA]</span>
    </div>
  </div>
)

const VIZ_TRACK = (
  <div className="ck-viz ck-viz-r" style={{ width: "min(440px, 100%)", background: "#010E25", color: "#fff", borderRadius: 26, padding: 22, display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 40px 80px -40px rgba(1,14,37,.7)" }}>
    <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.65)" }}>EVENTOS · EN VIVO</span>
    {[["Meta · PageView", "píxel + API ✓", false], ["Meta · Lead", "deduplicado ✓", true], ["Google Ads · Conversión", "✓", false], ["TikTok · CompleteRegistration", "✓", false], ["Meta · Purchase", "event_id ✓", false]].map(([a, b, hot]) => (
      <div key={a as string} className={`ck-mono${hot ? " ck-pop" : ""}`} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "10px 12px", borderRadius: 10, background: hot ? "#FE5C02" : "rgba(255,255,255,.06)", color: hot ? "#010E25" : "#fff" }}>
        <span>{a as string}</span><span style={{ color: hot ? "#010E25" : "#8BE3B4" }}>{b as string}</span>
      </div>
    ))}
  </div>
)

const VIZ_CREATIVE = (
  <div className="ck-viz" style={{ position: "relative", width: "min(460px, 100%)", height: 400 }}>
    <div style={{ position: "absolute", left: 0, top: 10, width: 200, aspectRatio: "9 / 16", background: "#010E25", border: "1.5px solid #010E25", borderRadius: 26, overflow: "hidden", transform: "rotate(-5deg)", ...card }}>
      <div className="ck-stripes" style={{ position: "absolute", inset: 0, ["--a" as string]: "#1B2A47", ["--b" as string]: "#132039" } as React.CSSProperties} />
      <span className="ck-tag" style={{ position: "absolute", left: 12, top: 12, color: "#fff", borderColor: "rgba(255,255,255,.6)", fontSize: 11 }}>[TIKTOK · 9:16]</span>
      <div className="ck-pop" style={{ position: "absolute", left: 12, right: 12, top: "38%", background: "#fff", borderRadius: 12, padding: "8px 10px", fontSize: 14, fontWeight: 700, lineHeight: 1.2, color: "#010E25" }}>«¿Por qué nadie te escribe?»</div>
      <div style={{ position: "absolute", left: 12, right: 12, bottom: 14, display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="ck-mono" style={{ fontSize: 10.5, color: "rgba(255,255,255,.75)" }}>GANCHO · 0:00–0:03</span>
        <span style={{ display: "block", height: 4, borderRadius: 4, background: "rgba(255,255,255,.2)" }}><span style={{ display: "block", width: "28%", height: 4, borderRadius: 4, background: "#FE5C02" }} /></span>
      </div>
    </div>
    <div style={{ position: "absolute", right: 0, top: 0, width: 230, background: "#fff", border: "1.5px solid #010E25", borderRadius: 22, overflow: "hidden", transform: "rotate(3deg)", ...card }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12 }}><span style={{ width: 28, height: 28, borderRadius: "50%", background: "#010E25", flex: "none" }} /><div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}><strong style={{ fontSize: 13, fontWeight: 600 }}>[Tu marca]</strong><span style={{ fontSize: 11, color: "#5A6178" }}>Publicidad</span></div></div>
      <div className="ck-stripes" style={{ aspectRatio: "4 / 5", display: "flex", alignItems: "flex-end", padding: 10, ["--a" as string]: "#FFE7D8", ["--b" as string]: "#FFF1E8" } as React.CSSProperties}><span className="ck-tag" style={{ background: "#fff", fontSize: 11 }}>[META · 4:5]</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, padding: "10px 12px" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Escríbenos hoy</span><span style={{ background: "#010E25", color: "#fff", borderRadius: 999, padding: "6px 10px", fontSize: 11.5, fontWeight: 600 }}>WhatsApp</span></div>
    </div>
    <div className="ck-pop ck-bob" style={{ position: "absolute", right: 24, bottom: 0, display: "flex", gap: 6 }}>
      <span className="ck-tag" style={{ background: "#D3F2E3" }}>[VARIANTE A]</span>
      <span className="ck-tag" style={{ background: "#E4DEFF" }}>[VARIANTE B]</span>
    </div>
  </div>
)

const BLOCKS: Block[] = [
  { id: "seo", tag: "[SEO]", n: "01", bg: "#D6EBFF", h2: "SEO local, SEO técnico y visibilidad en IA: que te encuentren en Google y en ChatGPT", p: "Posicionamos tu negocio donde tus clientes buscan: Google, Google Maps y asistentes como ChatGPT, Gemini y Perplexity. Ordenamos tu web por dentro y tu ficha de Google Business por fuera, con reportes que entiendes.", includes: ["Auditoría inicial priorizada", "Palabras clave con intención", "Optimización on-page y técnica", "Google Business, GA4 y Search Console"], ideal: "tienes un negocio local o una web que nadie encuentra.", ids: ["seo-audit", "seo-mensual", "seo-local", "ai-search"], details: [{ slug: "seo", label: "SEO" }, { slug: "local-seo", label: "SEO local" }, { slug: "technical-seo", label: "SEO técnico" }, { slug: "ecommerce-seo", label: "SEO ecommerce" }, { slug: "ai-seo", label: "SEO con IA · GEO · AEO" }], viz: VIZ_SEO },
  { id: "ads", tag: "[ADS]", n: "02", bg: "#FFDCC7", reverse: true, h2: "Gestión de Meta Ads, Google Ads y TikTok Ads que llenan tu WhatsApp", p: "Campañas en Facebook, Instagram, Google y TikTok pensadas para que la gente te escriba o te compre, no solo para sumar «me gusta». Probamos, medimos y movemos el presupuesto a lo que funciona.", includes: ["Estrategia por canal", "Píxeles y conversiones configurados", "Pruebas creativas semanales", "Reporte en lenguaje humano"], ideal: "ya pagas anuncios y no sabes qué funciona, o quieres empezar bien desde el día uno.", ids: ["meta-ads", "google-ads", "tiktok-ads"], details: [{ slug: "meta-ads", label: "Meta Ads" }, { slug: "google-ads", label: "Google Ads" }, { slug: "tiktok-ads", label: "TikTok Ads" }], viz: VIZ_ADS },
  { id: "creativos", tag: "[CREATIVOS]", n: "03", bg: "#FFFFFF", border: true, h2: "Creación de anuncios para Meta Ads, TikTok Ads y Google: piezas que frenan el scroll", p: "Pensamos, escribimos, diseñamos y editamos los anuncios que van en tus campañas. Cada pieza nace para su plataforma y su formato, con un gancho en los primeros segundos y un llamado claro a escribirte o comprarte.", includes: ["Guiones y conceptos para Reels, TikToks y Stories", "Edición de video vertical con subtítulos", "Anuncios estáticos y carruseles", "Adaptación a 1:1, 4:5 y 9:16", "Variantes para pruebas A/B", "Textos del anuncio y llamados a la acción", "Creativos para clic a WhatsApp y catálogo", "Entrega lista para subir a cada plataforma"], ideal: "tus anuncios ya no llaman la atención, o quieres empezar con piezas hechas para cada plataforma.", ids: ["ad-creatives"], details: [], viz: VIZ_CREATIVE },
  { id: "ia", tag: "[IA]", n: "04", bg: "#E4DEFF", reverse: true, h2: "Agentes de IA para WhatsApp y automatización", p: "Un agente de IA que responde a cualquier hora, resuelve las preguntas de siempre, califica al cliente y te lo pasa listo para cerrar. Automatizamos bienvenidas, seguimientos y recordatorios con Make, n8n o Zapier.", includes: ["Mapa de tu proceso", "Entrenamiento con tu información", "Paso a una persona cuando hace falta", "30 días de ajustes"], ideal: "te escriben de noche, los fines de semana o más de lo que puedes responder.", ids: ["ai-agent", "wa-auto"], details: [{ slug: "ai-agents", label: "Agentes IA" }, { slug: "chatbots", label: "Chatbots" }, { slug: "automation-tools", label: "Make · n8n · Zapier" }], viz: VIZ_IA },
  { id: "chat", tag: "[CHAT]", n: "05", bg: "#D3F2E3", h2: "WhatsApp Business API y CRM para no perder ni un cliente", p: "Damos de alta tu WhatsApp Business API, conectamos formularios, anuncios y chats con tu CRM, y ordenamos las etapas de venta para que nadie se quede esperando. Trabajamos con Callbell, Kommo, WATI y B2Chat.", includes: ["Alta y verificación de WABA", "CRM con etapas de venta", "Plantillas y respuestas rápidas", "Seguimiento a quien no compró"], ideal: "vendes por WhatsApp y se te pierden los mensajes entre tantos chats.", ids: ["waba", "crm"], details: [{ slug: "whatsapp-business", label: "WhatsApp Business" }, { slug: "callbell", label: "Callbell" }, { slug: "kommo", label: "Kommo CRM" }, { slug: "wati", label: "WATI" }, { slug: "b2chat", label: "B2Chat" }], viz: VIZ_CHAT },
  { id: "dev", tag: "[DEV]", n: "06", bg: "#010E25", dark: true, reverse: true, h2: "Desarrollo de páginas web, aplicaciones web, apps y landings que convierten", p: "Diseñamos y programamos webs rápidas, pensadas para el móvil y listas para SEO y medición desde el primer día. También construimos aplicaciones web y apps a medida, como nuestro propio CRM SyncLead.", includes: ["Landing pages para conversión", "Páginas web corporativas", "Aplicaciones web y paneles", "Apps a medida"], ideal: "tu web es lenta, no vende o necesitas una herramienta propia.", ids: [], details: [], viz: VIZ_DEV },
  { id: "tracking", tag: "[TRACKING]", n: "07", bg: "#FFFFFF", border: true, h2: "Configuración técnica: API de conversiones de Meta, píxel y medición en Google y TikTok", p: "Si no se mide, no se puede mejorar. Instalamos el píxel de Meta y la API de conversiones, configuramos las conversiones de Google Ads y el píxel de TikTok, y resolvemos Business Manager, cuentas bloqueadas y verificaciones.", includes: ["Píxel de Meta + API de conversiones", "Conversiones de Google Ads y GA4", "Píxel de TikTok y eventos", "Business Manager, accesos y verificación"], ideal: "no sabes de dónde vienen tus ventas o tus campañas «no aprenden».", ids: ["meta-tech", "meta-consult"], details: [{ slug: "meta-business", label: "Meta Business" }, { slug: "troubleshooting", label: "Resolución de problemas" }, { slug: "consulting", label: "Consultoría" }], viz: VIZ_TRACK },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
}

export default function ServicesPage() {
  return (
    <MarketingLayout active="services" whatsapp={{ message: "¿No sabes qué servicio necesitas? Cuéntanos qué vendes y te recomendamos por dónde empezar.", replies: ["Quiero más clientes", "Necesito una web", "Quiero configurar mi píxel"] }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="ck-dots" style={{ padding: "56px 0 72px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>Servicios</li></ol></nav>
          <h1 style={{ fontSize: "clamp(44px, 6.2vw, 92px)", lineHeight: 0.98, maxWidth: 1100 }}>Servicios de marketing digital que traen <span style={{ color: "#FE5C02" }}>clientes reales</span>.</h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 760 }}>SEO local y técnico, Meta, Google y TikTok Ads, creación de anuncios, agentes de IA para WhatsApp, desarrollo web y apps, y medición de conversiones. Un equipo de tres personas que te explica cada decisión.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} aria-label="Ir a un servicio">
            {BLOCKS.map((b) => (
              <a key={b.id} className="ck-tag" href={`#${b.id}`} style={{ background: b.dark ? "#010E25" : b.bg, color: b.dark ? "#fff" : undefined, padding: "8px 12px" }}>{b.tag}</a>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <Link className="ck-btn ck-btn-primary" href="/pricing">Ver precios y paquetes ↗</Link>
            <a className="ck-btn ck-btn-wa" href={waLink("Hola, ¿qué servicio necesito?")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />¿Cuál necesito? Pregúntanos</a>
            <span className="ck-hand" style={{ fontSize: 26, color: "#C94400", transform: "rotate(-3deg)" }}>↳ te lo decimos en 15 min</span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1272, margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 24 }}>
        {BLOCKS.map((b) => {
          const sub = b.dark ? "rgba(255,255,255,.82)" : "#2A3147"
          return (
            <section key={b.id} id={b.id} style={{ background: b.bg, color: b.dark ? "#fff" : "#010E25", border: b.border ? "1.5px solid #010E25" : undefined, borderRadius: 44, padding: "clamp(28px, 5vw, 72px)", scrollMarginTop: 100 }}>
              <div style={{ display: "flex", flexWrap: b.reverse ? "wrap-reverse" : "wrap", flexDirection: b.reverse ? "row-reverse" : "row", alignItems: "center", gap: 56 }}>
                <div className="ck-reveal" style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span className="ck-tag" style={b.dark ? { color: "#fff", borderColor: "rgba(255,255,255,.6)" } : { background: "#fff" }}>{b.tag}</span>
                    <span className="ck-mono" style={{ fontSize: 13, color: b.dark ? "rgba(255,255,255,.7)" : "#3A4158" }}>{b.n} / {String(BLOCKS.length).padStart(2, "0")}</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(30px, 3.6vw, 50px)", color: b.dark ? "#fff" : undefined }}>{b.h2}</h2>
                  <p style={{ color: sub }}>{b.p}</p>
                  <ul className={`ck-check${b.dark ? " on-dark" : ""}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "10px 20px", fontSize: 16 }}>
                    {b.includes.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <p style={{ fontSize: 16, color: sub }}><strong style={{ fontWeight: 600, color: b.dark ? "#fff" : "#010E25" }}>Ideal si…</strong> {b.ideal}</p>

                  {b.ids.length > 0 ? (
                    <ServiceRows ids={b.ids} dark={b.dark} />
                  ) : (
                    <div className={`ck-svc-row${b.dark ? " on-dark" : ""}`}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>{b.quoteRow?.title ?? "Web, landing o app a medida"}</span>
                        <span style={{ fontSize: 14, color: b.dark ? "rgba(255,255,255,.72)" : "#5A6178" }}>{b.quoteRow?.desc ?? "Te enviamos una propuesta con precio cerrado según el alcance."}</span>
                      </div>
                      <a className={`ck-btn ck-btn-primary${b.dark ? " on-dark" : ""}`} href={waLink(b.quoteRow?.msg ?? "Hola, quiero cotizar una web o app")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 44, padding: "0 16px", fontSize: 14 }}>Cotizar por WhatsApp ↗</a>
                    </div>
                  )}

                  {b.details.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                      <span className="ck-mono" style={{ fontSize: 12, color: b.dark ? "rgba(255,255,255,.7)" : "#3A4158", marginRight: 4 }}>VER EN DETALLE:</span>
                      {b.details.map((d) => (
                        <Link key={d.slug} href={`/services/${d.slug}`} style={{ fontSize: 15, fontWeight: 600, color: b.dark ? "#FFDCC7" : "#010E25", textUnderlineOffset: 4 }}>{d.label} →</Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ck-viz-stage" style={{ flex: "1 1 400px", minWidth: 0 }} aria-hidden="true">{b.viz}</div>
              </div>
            </section>
          )
        })}
      </div>

      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
          <div className="ck-reveal" style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="ck-eyebrow">Preguntas frecuentes</span>
            <h2 style={{ fontSize: "clamp(36px, 4.4vw, 58px)" }}>Lo que nos preguntan antes de empezar</h2>
            <p className="ck-hand" style={{ fontSize: 26, color: "#C94400", transform: "rotate(-2deg)", transformOrigin: "left" }}>¿otra duda? escríbenos ↘</p>
          </div>
          <div style={{ flex: "2 1 560px", minWidth: 0 }}>
            {FAQS.map((f, i) => (
              <details key={f.q} className="ck-faq" open={i === 0}>
                <summary>{f.q}<span className="ck-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 16px clamp(48px, 6vw, 80px)" }}>
        <div className="ck-reveal ck-cta-dark" style={{ maxWidth: 1240, margin: "0 auto", background: "#010E25", border: "1.5px solid #010E25", borderRadius: 44, padding: "clamp(32px, 6vw, 80px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 64px)" }}>¿No sabes cuál necesitas?</h2>
            <p style={{ fontSize: 20 }}>Cuéntanos qué vendes y te decimos por dónde empezaríamos. Quince minutos, sin compromiso.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a className="ck-btn ck-btn-dark" href={waLink("Hola, ¿por dónde empiezo?")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 56, fontSize: 17 }}>Escríbenos por WhatsApp ↗</a>
            <Link className="ck-btn ck-btn-line" href="/pricing#armar" style={{ minHeight: 56, fontSize: 17 }}>Arma tu paquete</Link>
          </div>
        </div>
      </section>

      <CartBar />
    </MarketingLayout>
  )
}
