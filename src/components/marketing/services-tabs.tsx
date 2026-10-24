"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/components/shop/cart-provider"
import type { CartItem } from "@/types/catalog"

const SERVICES = [
  { id: "seo-audit",    cat: 0, name: "Auditoría SEO",            desc: "Revisión técnica y de contenido con una lista de mejoras priorizada.",       price: 120, prefix: "",      type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "seo-mensual",  cat: 0, name: "SEO mensual",              desc: "Optimización continua, contenido y enlaces, con reporte cada mes.",           price: 250, prefix: "desde", type: "mensual", priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "seo-local",    cat: 0, name: "SEO local",                desc: "Google Business Profile, reseñas y presencia en mapas.",                     price: 180, prefix: "",      type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "ai-search",    cat: 0, name: "Visibilidad en IA",        desc: "Que tu marca aparezca en las respuestas de ChatGPT, Gemini y Perplexity.",    price: 200, prefix: "desde", type: "mensual", priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "google-ads",   cat: 1, name: "Google Ads",               desc: "Búsqueda, Shopping y Performance Max con seguimiento de conversiones.",       price: 150, prefix: "desde", type: "mensual", priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "meta-ads",     cat: 1, name: "Meta Ads",                 desc: "Campañas en Facebook e Instagram con pruebas creativas semanales.",           price: 150, prefix: "desde", type: "mensual", priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "tiktok-ads",   cat: 1, name: "TikTok Ads",               desc: "Campañas y creatividades pensadas para el formato nativo.",                   price: 150, prefix: "desde", type: "mensual", priceType: "RECURRING" as const, billing: "monthly"   as const },
  { id: "ai-agent",     cat: 2, name: "Agente IA",                desc: "Un agente entrenado en WhatsApp o web que responde, califica y agenda.",     price: 350, prefix: "desde", type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "wa-auto",      cat: 2, name: "Automatización WhatsApp",  desc: "Flujos de bienvenida, seguimiento y recordatorios.",                         price: 280, prefix: "desde", type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "crm",          cat: 2, name: "Integración CRM",          desc: "Conectamos formularios, anuncios y chats con tu CRM.",                       price: 220, prefix: "desde", type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "meta-consult", cat: 3, name: "Consultoría Meta Business", desc: "Sesión 1:1 para resolver Business Manager, píxeles o accesos.",             price: 60,  prefix: "",      type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "meta-tech",    cat: 3, name: "Soporte técnico Meta",     desc: "WABA, cuentas bloqueadas, verificación y configuración de API.",              price: 90,  prefix: "desde", type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
  { id: "waba",         cat: 3, name: "Alta WhatsApp Business API", desc: "Verificación, número y plantillas listas para enviar.",                    price: 120, prefix: "",      type: "único",   priceType: "ONE_TIME"  as const, billing: "one_time"  as const },
]

const CATS = [
  {
    id: "seo",
    label: "SEO y búsqueda IA",
    count: 4,
    bg: "#345CFF",
    text: "#fff",
    chipBorder: "rgba(255,255,255,.7)",
    cardBg: "rgba(255,255,255,.1)",
    includes: [
      "Auditoría inicial",
      "Palabras clave con intención",
      "Optimización on-page",
      "GA4 y Search Console",
      "Reporte mensual",
    ],
  },
  {
    id: "ads",
    label: "Publicidad digital",
    count: 3,
    bg: "#D9FA62",
    text: "#202124",
    chipBorder: "#202124",
    cardBg: "rgba(32,33,36,.07)",
    includes: [
      "Estrategia por canal",
      "Píxeles y conversiones",
      "Pruebas creativas",
      "Optimización semanal",
      "Reporte mensual",
    ],
  },
  {
    id: "ia",
    label: "IA y automatización",
    count: 3,
    bg: "#E9E4FF",
    text: "#202124",
    chipBorder: "#202124",
    cardBg: "rgba(32,33,36,.07)",
    includes: [
      "Mapa de tu proceso",
      "Entrenamiento con tu info",
      "Integración con tus herramientas",
      "Pruebas antes de publicar",
      "30 días de ajustes",
    ],
  },
  {
    id: "meta",
    label: "Soporte Meta",
    count: 3,
    bg: "#FFFFFF",
    text: "#202124",
    chipBorder: "#202124",
    cardBg: "#F7F5EF",
    border: "1.5px solid #202124",
    includes: [
      "Diagnóstico antes de empezar",
      "Sesión documentada",
      "Guía de pasos a seguir",
      "Seguimiento 48h",
      "Resultado por escrito",
    ],
  },
]

const HASH_TO_IDX: Record<string, number> = { "#seo": 0, "#ads": 1, "#ia": 2, "#meta": 3 }

export function ServicesTabs() {
  const [active, setActive] = useState(0)
  const { addItem, removeItem, hasItem } = useCart()

  useEffect(() => {
    const hash = window.location.hash
    const idx = HASH_TO_IDX[hash]
    if (idx !== undefined) setActive(idx)
  }, [])

  const cat = CATS[active]
  const catServices = SERVICES.filter((s) => s.cat === active)

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

  const isLight = active !== 0

  return (
    <div style={{ fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)" }}>
      {/* Tab pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 0,
          padding: "0 0 0 0",
        }}
      >
        {CATS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            style={{
              fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 18px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all 0.2s",
              background: active === i ? "#202124" : "transparent",
              color: active === i ? "#fff" : "#202124",
              border: "1.5px solid #202124",
            }}
          >
            {c.label} {c.count}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        style={{
          background: cat.bg,
          color: cat.text,
          borderRadius: 40,
          padding: "clamp(32px, 5vw, 64px)",
          marginTop: 16,
          border: cat.border ?? "none",
          ...(active === 0 ? { background: "#345CFF" } : {}),
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 5vw, 64px)",
          }}
          className="services-panel-grid"
        >
          {/* Left: info */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: 0.6,
                marginBottom: 16,
              }}
            >
              {cat.label}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontSize: "clamp(56px, 7vw, 112px)",
                fontWeight: 400,
                lineHeight: 0.95,
                marginBottom: 24,
                color: cat.text,
              }}
            >
              {cat.label}
            </h2>
            <p style={{ fontSize: 19, lineHeight: 1.5, opacity: 0.8, marginBottom: 32, color: cat.text }}>
              {active === 0 && "Posiciona tu negocio donde buscan tus clientes — en Google y en los nuevos buscadores de IA."}
              {active === 1 && "Campañas de pago que convierten. Cada euro justificado con datos reales."}
              {active === 2 && "Automatiza la parte repetitiva para que tu equipo se enfoque en lo que importa."}
              {active === 3 && "Desbloquea, verifica y configura tu cuenta Meta sin perder tiempo ni dinero."}
            </p>

            {/* Siempre incluye chips */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  opacity: 0.55,
                  marginBottom: 12,
                }}
              >
                Siempre incluye
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cat.includes.map((inc) => (
                  <span
                    key={inc}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: `1.5px solid ${cat.chipBorder}`,
                      color: cat.text,
                      opacity: 0.85,
                    }}
                  >
                    {inc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: service cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {catServices.map((svc) => {
              const added = hasItem(svc.id)
              return (
                <div
                  key={svc.id}
                  style={{
                    background: isLight ? "#fff" : "rgba(255,255,255,.12)",
                    borderRadius: 20,
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    color: "#202124",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#202124", marginBottom: 4 }}>
                      {svc.name}
                    </p>
                    <p style={{ fontSize: 13, color: "#5F6168", lineHeight: 1.4 }}>{svc.desc}</p>
                    <p style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: "#202124" }}>
                      {svc.prefix && (
                        <span
                          style={{
                            fontFamily: "var(--font-mk-mono, monospace)",
                            fontSize: 11,
                            marginRight: 4,
                          }}
                        >
                          {svc.prefix}{" "}
                        </span>
                      )}
                      ${svc.price}
                      <span style={{ fontSize: 12, fontWeight: 400, color: "#5F6168", marginLeft: 4 }}>
                        {svc.type === "mensual" ? "/mes" : "pago único"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleService(svc)}
                    aria-label={added ? `Quitar ${svc.name}` : `Añadir ${svc.name}`}
                    style={{
                      flexShrink: 0,
                      padding: "8px 16px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: added ? "#D9FA62" : "#202124",
                      color: added ? "#202124" : "#fff",
                      border: added ? "1.5px solid #202124" : "1.5px solid #202124",
                    }}
                  >
                    {added ? "✓ Añadido" : "Añadir"}
                  </button>
                </div>
              )
            })}
            <a
              href="/pricing"
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 600,
                color: cat.text,
                opacity: 0.7,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Ver todos los precios →
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .services-panel-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>
    </div>
  )
}
