"use client"

import { useState } from "react"
import { useCart } from "@/components/shop/cart-provider"
import type { CartItem } from "@/types/catalog"

const SERVICES = [
  { id: "seo-audit",    cat: 0, name: "Auditoría SEO",            desc: "Revisión técnica y de contenido con una lista de mejoras priorizada.",       price: 120, prefix: "",      type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "seo-mensual",  cat: 0, name: "SEO mensual",              desc: "Optimización continua, contenido y enlaces, con reporte cada mes.",           price: 250, prefix: "desde", type: "mensual" as const, priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "seo-local",    cat: 0, name: "SEO local",                desc: "Google Business Profile, reseñas y presencia en mapas.",                     price: 180, prefix: "",      type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "ai-search",    cat: 0, name: "Visibilidad en IA",        desc: "Que tu marca aparezca en las respuestas de ChatGPT, Gemini y Perplexity.",    price: 200, prefix: "desde", type: "mensual" as const, priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "google-ads",   cat: 1, name: "Google Ads",               desc: "Búsqueda, Shopping y Performance Max con seguimiento de conversiones.",       price: 150, prefix: "desde", type: "mensual" as const, priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "meta-ads",     cat: 1, name: "Meta Ads",                 desc: "Campañas en Facebook e Instagram con pruebas creativas semanales.",           price: 150, prefix: "desde", type: "mensual" as const, priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "tiktok-ads",   cat: 1, name: "TikTok Ads",               desc: "Campañas y creatividades pensadas para el formato nativo.",                   price: 150, prefix: "desde", type: "mensual" as const, priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "ai-agent",     cat: 2, name: "Agente IA",                desc: "Un agente entrenado en WhatsApp o web que responde, califica y agenda.",     price: 350, prefix: "desde", type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "wa-auto",      cat: 2, name: "Automatización WhatsApp",  desc: "Flujos de bienvenida, seguimiento y recordatorios.",                         price: 280, prefix: "desde", type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "crm",          cat: 2, name: "Integración CRM",          desc: "Conectamos formularios, anuncios y chats con tu CRM.",                       price: 220, prefix: "desde", type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "meta-consult", cat: 3, name: "Consultoría Meta Business", desc: "Sesión 1:1 para resolver Business Manager, píxeles o accesos.",             price: 60,  prefix: "",      type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "meta-tech",    cat: 3, name: "Soporte técnico Meta",     desc: "WABA, cuentas bloqueadas, verificación y configuración de API.",              price: 90,  prefix: "desde", type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "waba",         cat: 3, name: "Alta WhatsApp Business API", desc: "Verificación, número y plantillas listas para enviar.",                    price: 120, prefix: "",      type: "único"   as const, priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
]

const CAT_LABELS: Record<number, string> = {
  0: "SEO y búsqueda IA",
  1: "Publicidad digital",
  2: "IA y automatización",
  3: "Soporte Meta",
}

const FILTER_CATS = ["Todos", "SEO y búsqueda IA", "Publicidad digital", "IA y automatización", "Soporte Meta"]

export function PricingGrid() {
  const [catFilter, setCatFilter] = useState("Todos")
  const [typeFilter, setTypeFilter] = useState("Todos")
  const { addItem, removeItem, hasItem } = useCart()

  const filtered = SERVICES.filter((s) => {
    const catMatch = catFilter === "Todos" || CAT_LABELS[s.cat] === catFilter
    const typeMatch =
      typeFilter === "Todos" ||
      (typeFilter === "Pago único" && s.type === "único") ||
      (typeFilter === "Mensual" && s.type === "mensual")
    return catMatch && typeMatch
  })

  function toggleService(svc: typeof SERVICES[number]) {
    const item: CartItem = {
      key: svc.id,
      serviceId: svc.id,
      priceId: svc.id + "-price",
      quantity: 1,
      displayName: svc.name,
      displayPrice: svc.price,
      priceType: svc.priceType,
      billingPeriod: svc.billing,
      currency: "USD",
    }
    if (hasItem(svc.id)) {
      removeItem(svc.id)
    } else {
      addItem(item)
    }
  }

  return (
    <div style={{ fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)" }}>
      {/* Filters row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTER_CATS.map((label) => (
            <button
              key={label}
              onClick={() => setCatFilter(label)}
              aria-pressed={catFilter === label}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: catFilter === label ? "#202124" : "transparent",
                color: catFilter === label ? "#fff" : "#202124",
                border: "1.5px solid #202124",
                fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Type segmented */}
        <div
          style={{
            display: "flex",
            background: "#fff",
            borderRadius: 999,
            padding: 4,
            border: "1.5px solid #E2DED3",
            gap: 2,
          }}
        >
          {["Todos", "Pago único", "Mensual"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              aria-pressed={typeFilter === t}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: typeFilter === t ? "#D9FA62" : "transparent",
                color: "#202124",
                border: "none",
                fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((svc) => {
          const added = hasItem(svc.id)
          return (
            <article
              key={svc.id}
              style={{
                background: "#fff",
                borderRadius: 24,
                border: added ? "1.5px solid #202124" : "1.5px solid transparent",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                boxShadow: "0 1px 4px rgba(32,33,36,.06)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(32,33,36,.10)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
                ;(e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(32,33,36,.06)"
              }}
            >
              {/* Category + type dot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mk-mono, monospace)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#5F6168",
                  }}
                >
                  {CAT_LABELS[svc.cat]}
                </span>
                <span
                  title={svc.type === "mensual" ? "Mensual" : "Pago único"}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: svc.type === "mensual" ? "#FF6B2C" : "#345CFF",
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Name */}
              <h3 style={{ fontSize: 26, fontWeight: 600, color: "#202124", lineHeight: 1.1 }}>
                {svc.name}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 15, color: "#5F6168", lineHeight: 1.5, flex: 1 }}>{svc.desc}</p>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                {svc.prefix && (
                  <span
                    style={{
                      fontFamily: "var(--font-mk-mono, monospace)",
                      fontSize: 12,
                      color: "#5F6168",
                    }}
                  >
                    {svc.prefix}
                  </span>
                )}
                <span style={{ fontSize: 40, fontWeight: 600, color: "#202124", lineHeight: 1 }}>
                  ${svc.price}
                </span>
                <span style={{ fontSize: 14, color: "#5F6168" }}>
                  {svc.type === "mensual" ? "/mes" : "pago único"}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={() => toggleService(svc)}
                aria-label={added ? `Quitar ${svc.name}` : `Añadir ${svc.name}`}
                style={{
                  marginTop: 8,
                  padding: "10px 20px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: added ? "#D9FA62" : "#202124",
                  color: added ? "#202124" : "#fff",
                  border: added ? "1.5px solid #202124" : "1.5px solid #202124",
                  fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
                }}
              >
                {added ? "✓ Añadido" : "Añadir"}
              </button>
            </article>
          )
        })}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>
    </div>
  )
}
