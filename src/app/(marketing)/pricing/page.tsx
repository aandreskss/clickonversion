import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { PricingGrid } from "@/components/marketing/pricing-grid"
import { CartBar } from "@/components/marketing/cart-bar"
import { PricingPackages, PackageBuilder } from "@/components/brand/pricing-packages"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Precios y paquetes de marketing digital — sin letra pequeña",
  description:
    "Precios publicados de SEO, Meta, Google y TikTok Ads, agentes IA, WhatsApp y soporte Meta. Elige un paquete, suma servicios o arma el tuyo con descuento. Paga con PayPal o tarjeta.",
  alternates: { canonical: "https://www.clickonversion.com/pricing" },
  openGraph: {
    title: "Precios claros. Sin letra pequeña. | ClicKonversion",
    description: "Paquetes, servicios sueltos y un armador de paquetes con descuento. Pago seguro con PayPal.",
    url: "https://www.clickonversion.com/pricing",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

const FAQS = [
  { q: "¿Cómo funcionan los servicios mensuales?", a: "Se cobran el mismo día de cada mes y puedes cancelar desde tu panel cuando quieras, sin permanencia." },
  { q: "¿Qué significa «desde»?", a: "Es el precio base. Si tu caso necesita más alcance, te enviamos el ajuste antes de empezar y tú decides." },
  { q: "¿Qué métodos de pago aceptan?", a: "Tarjeta de crédito o débito, PayPal y transferencia bancaria." },
  { q: "¿La inversión en anuncios está incluida?", a: "No. El presupuesto de anuncios lo pagas directo a Meta, Google o TikTok. Nuestro precio es la gestión." },
  { q: "¿Emiten factura?", a: "Sí. Todas las facturas quedan disponibles para descargar en tu panel de cliente." },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
}

const REVIEWS = [
  { cls: "ck-rev-1", dark: false, tag: "[ADS]", tagBg: "#FFDCC7" },
  { cls: "ck-rev-2", dark: true, tag: "[SEO]", tagBg: "#D6EBFF" },
  { cls: "ck-rev-3", dark: false, tag: "[IA]", tagBg: "#E4DEFF" },
]

function Plus() {
  return <span className="ck-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span>
}

export default function PricingPage() {
  return (
    <MarketingLayout
      active="pricing"
      whatsapp={{ message: "¿Dudas entre dos paquetes? Escríbenos y te decimos cuál te conviene, sin venderte de más.", replies: ["¿Qué paquete me conviene?", "Ayúdenme a armarlo", "Quiero pagar por transferencia"] }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />

      <section className="ck-dots" style={{ padding: "56px 0 40px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>Precios</li></ol></nav>
          <h1 style={{ fontSize: "clamp(46px, 6.4vw, 96px)", lineHeight: 0.98, maxWidth: 1000 }}>
            Precios claros. <span style={{ color: "#FE5C02" }}>Sin letra pequeña.</span>
          </h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 680 }}>
            Elige un paquete, suma servicios sueltos o arma el tuyo con descuento. Pagas con PayPal, tarjeta o transferencia y te escribimos el mismo día para empezar.
          </p>
        </div>
      </section>

      <section id="paquetes" style={{ padding: "40px 0 96px" }}>
        <div className="ck-wrap">
          <PricingPackages />
          <ul style={{ listStyle: "none", margin: "48px 0 0", padding: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 28px", fontSize: 16, fontWeight: 500 }}>
            <li>✓ Pago seguro con PayPal</li>
            <li>✓ Sin permanencia</li>
            <li>✓ Te escribimos el mismo día</li>
            <li>✓ Reportes que entiendes</li>
          </ul>
        </div>
      </section>

      <section id="sueltos" className="ck-section" style={{ background: "#fff", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
              <span className="ck-eyebrow">Servicios sueltos</span>
              <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)" }}>¿Solo necesitas una cosa? <span style={{ color: "#FE5C02" }}>Llévala sola.</span></h2>
            </div>
            <p style={{ maxWidth: 420, color: "#5A6178" }}>Suma al carrito lo que necesites. Si llevas tres o más, te conviene armar tu paquete con descuento.</p>
          </div>
          <PricingGrid />
        </div>
      </section>

      <section id="armar" className="ck-section">
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div className="ck-reveal" style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 760 }}>
            <span className="ck-eyebrow">Arma tu paquete</span>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)" }}>Tu paquete, <span style={{ color: "#FE5C02" }}>a tu medida</span>.</h2>
            <p style={{ color: "#5A6178" }}>Marca lo que necesitas. Con 3 servicios ahorras 10%; con 5 o más, 15%.</p>
          </div>
          <PackageBuilder />
        </div>
      </section>

      <section id="resenas" className="ck-section" style={{ background: "#FFDCC7", borderRadius: 48 }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 56 }}>
          <div className="ck-reveal" style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 700 }}>
              <span className="ck-eyebrow" style={{ color: "#8A3300" }}>Reseñas de clientes</span>
              <h2 style={{ fontSize: "clamp(38px, 5vw, 68px)" }}>Hablan ellos, no nosotros.</h2>
            </div>
            <div style={{ background: "#010E25", color: "#fff", borderRadius: 24, padding: "20px 26px", display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>[4,9]</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span aria-label="5 estrellas" style={{ color: "#FE5C02", fontSize: 20, letterSpacing: 2 }}>★★★★★</span><span className="ck-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.75)" }}>[XX] RESEÑAS EN GOOGLE</span></div>
            </div>
          </div>
          {/* TODO: reemplazar por reseñas reales de clientes (nombre, negocio y texto con su permiso) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 28, alignItems: "start" }}>
            {REVIEWS.map((r) => (
              <figure key={r.cls} className={`ck-rev ${r.cls}`} style={{ margin: 0, background: r.dark ? "#010E25" : "#fff", color: r.dark ? "#fff" : "#010E25", border: r.dark ? undefined : "1.5px solid #010E25", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 20, boxShadow: `8px 10px 0 ${r.dark ? "#FE5C02" : "#010E25"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span aria-label="5 estrellas" style={{ color: "#FE5C02", fontSize: 20, letterSpacing: 2 }}>★★★★★</span><span className="ck-tag" style={{ background: r.tagBg }}>{r.tag}</span></div>
                <blockquote style={{ margin: 0, fontSize: 20, lineHeight: 1.45, fontWeight: 500 }}>«[Reseña real del cliente: qué problema tenía y qué cambió después de trabajar con ustedes. 2 o 3 líneas.]»</blockquote>
                <figcaption style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}><strong style={{ fontWeight: 600 }}>[Nombre Apellido]</strong><span style={{ fontSize: 14, color: r.dark ? "rgba(255,255,255,.75)" : "#5A6178" }}>[Negocio · Ciudad]</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ck-section">
        <div className="ck-wrap ck-reveal" style={{ maxWidth: 1100, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24 }}>
          <span className="ck-eyebrow">Nuestra promesa</span>
          <h2 style={{ fontSize: "clamp(38px, 5.2vw, 72px)" }}>Si algo no funciona, <span style={{ color: "#FE5C02" }}>te lo decimos primero</span> y lo cambiamos.</h2>
          <p style={{ fontSize: 20, color: "#3A4158", maxWidth: 680 }}>Prometemos lo que medimos. Nada de «resultados garantizados» ni de reportes que no se entienden.</p>
          <span className="ck-hand" style={{ fontSize: 30, color: "#C94400", transform: "rotate(-3deg)" }}>— Arnaldo, Abisai y Yoli</span>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 56 }}>
          <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="ck-eyebrow">Pagos y dudas</span>
            <h2 style={{ fontSize: "clamp(36px, 4.4vw, 58px)" }}>Antes de pagar, lo que más nos preguntan</h2>
            <a className="ck-btn ck-btn-wa" style={{ alignSelf: "flex-start" }} href={waLink("Hola, tengo una duda sobre los precios")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Pregúntanos por WhatsApp</a>
          </div>
          <div style={{ flex: "2 1 560px", minWidth: 0 }}>
            {FAQS.map((f, i) => (
              <details key={f.q} className="ck-faq" open={i === 0}><summary>{f.q}<Plus /></summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      <CartBar />
    </MarketingLayout>
  )
}
