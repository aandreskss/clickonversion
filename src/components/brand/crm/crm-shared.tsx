// Piezas compartidas de las páginas de plataformas CRM (Callbell, Kommo, Manychat).
// Solo la mecánica es compartida: cada página tiene su propio texto, orden de secciones y visuales,
// para que Google no las vea como contenido duplicado.
import Link from "next/link"
import { waLink } from "@/lib/whatsapp"
import type { ServiceContent } from "@/data/services"
import "./crm.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

export function CrmCrumbs({ name }: { name: string }) {
  return (
    <nav aria-label="Migas de pan">
      <ol className="ck-crumbs">
        <li><Link href="/">Inicio</Link></li>
        <li aria-hidden="true">/</li>
        <li><Link href="/services">Servicios</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>{name}</li>
      </ol>
    </nav>
  )
}

export function CrmJsonLd({ slug, name, description, faq }: { slug: string; name: string; description: string; faq: { q: string; a: string }[] }) {
  const url = `${siteUrl}/services/${slug}`
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        description,
        url,
        serviceType: "Implementación de CRM y automatización de WhatsApp",
        areaServed: ["Latinoamérica", "España", "Estados Unidos"],
        availableLanguage: "es",
        provider: { "@type": "Organization", name: "ClicKonversion", url: siteUrl },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Servicios", item: `${siteUrl}/services` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}

/** Preguntas frecuentes en acordeón nativo (sin JS). */
export function CrmFaq({ items, tone = "light" }: { items: { q: string; a: string }[]; tone?: "light" | "dark" }) {
  return (
    <div className={`crm-faq crm-faq-${tone}`}>
      {items.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>
            <span className="ck-mono crm-faq-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="crm-faq-q">{f.q}</span>
            <span className="crm-faq-plus" aria-hidden="true">+</span>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}

/**
 * Planes del servicio. Los precios salen de src/data/services.ts para no tener dos fuentes.
 * `variant` cambia el diseño: tickets (Callbell), columnas (Kommo) o fichas apiladas (Manychat).
 */
export function CrmPlans({ plans, variant, accent, waLabel }: { plans: ServiceContent["plans"]; variant: "tickets" | "columns" | "stack"; accent: string; waLabel: string }) {
  return (
    <div className={`crm-plans crm-plans-${variant}`} style={{ ["--crm-accent" as string]: accent }}>
      {plans.map((p, i) => {
        const custom = /personalizado/i.test(p.price)
        const featured = i === 1 && plans.length > 1
        return (
          <article key={p.name} className={`crm-plan${featured ? " is-featured" : ""}`}>
            {featured && <span className="crm-plan-flag ck-mono">EL MÁS PEDIDO</span>}
            <header>
              <span className="ck-mono crm-plan-n">PLAN {String(i + 1).padStart(2, "0")}</span>
              <h3>{p.name}</h3>
              <p className="crm-plan-note">{p.note}</p>
            </header>
            <p className="crm-plan-price">{p.price.replace(" (pago único)", "")}{!custom && <small> pago único</small>}</p>
            <ul>
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <a className={`ck-btn ${featured ? "ck-btn-primary" : "ck-btn-line"}`} href={waLink(`Hola, me interesa el plan ${p.name} de ${waLabel}`)} target="_blank" rel="noopener noreferrer">
              {custom ? "Cotizar a medida" : "Quiero este plan"} →
            </a>
          </article>
        )
      })}
    </div>
  )
}

export function CrmCrossLinks({ current }: { current: "callbell" | "kommo" | "manychat" }) {
  const all = [
    { slug: "callbell", name: "Callbell", line: "si lo que necesitas es que todo tu equipo atienda un mismo WhatsApp", bg: "#D3F2E3" },
    { slug: "kommo", name: "Kommo", line: "si lo que necesitas es un pipeline de ventas con seguimiento", bg: "#D6EBFF" },
    { slug: "manychat", name: "Manychat", line: "si lo que necesitas es convertir comentarios y DMs en leads", bg: "#FFDCC7" },
  ].filter((x) => x.slug !== current)
  return (
    <div className="crm-cross">
      {all.map((x) => (
        <Link key={x.slug} href={`/services/${x.slug}`} className="crm-cross-card" style={{ background: x.bg }}>
          <span className="ck-mono">¿Y {x.name}?</span>
          <strong>Mira {x.name} {x.line}.</strong>
          <span className="crm-cross-go" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  )
}
