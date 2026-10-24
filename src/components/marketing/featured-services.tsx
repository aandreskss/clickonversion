"use client"

import { useCart } from "@/components/shop/cart-provider"
import type { CartItem } from "@/types/catalog"

interface ServiceCard {
  id: string
  category: string
  name: string
  desc: string
  prefix: string
  price: number
  type: "one-time" | "monthly"
}

const SERVICES: ServiceCard[] = [
  {
    id: "seo-audit",
    category: "SEO",
    name: "Auditoría SEO",
    desc: "Análisis técnico completo de tu sitio web con hoja de ruta priorizada.",
    prefix: "",
    price: 120,
    type: "one-time",
  },
  {
    id: "meta-ads-mgmt",
    category: "Publicidad",
    name: "Gestión de Meta Ads",
    desc: "Campañas en Facebook e Instagram gestionadas por nuestro equipo.",
    prefix: "desde ",
    price: 150,
    type: "monthly",
  },
  {
    id: "meta-consult",
    category: "Soporte Meta",
    name: "Consultoría Meta Business",
    desc: "Sesión estratégica para resolver bloqueos y optimizar tu cuenta Meta.",
    prefix: "",
    price: 60,
    type: "one-time",
  },
  {
    id: "meta-tech",
    category: "Soporte Meta",
    name: "Soporte técnico Meta",
    desc: "Resolución de problemas técnicos en Meta Ads, Pixel, CAPI y Business Manager.",
    prefix: "desde ",
    price: 90,
    type: "one-time",
  },
  {
    id: "ai-agent",
    category: "IA y automatización",
    name: "Agente IA a medida",
    desc: "Desarrollo e implementación de un agente IA personalizado para tu negocio.",
    prefix: "desde ",
    price: 350,
    type: "one-time",
  },
]

function ServiceCardItem({ service }: { service: ServiceCard }) {
  const { addItem, hasItem } = useCart()
  const added = hasItem(service.id)

  function handleAdd() {
    if (added) return
    const item: CartItem = {
      key: service.id,
      serviceId: service.id,
      priceId: service.id + "-price",
      quantity: 1,
      displayName: service.name,
      displayPrice: service.price,
      priceType: service.type === "monthly" ? "RECURRING" : service.price === 0 ? "CUSTOM_QUOTE" : "ONE_TIME",
      billingPeriod: service.type === "monthly" ? "monthly" : "one_time",
      currency: "USD",
    }
    addItem(item)
  }

  return (
    <article
      style={{
        background: "white",
        borderRadius: 24,
        border: added ? "1.5px solid #202124" : "1.5px solid transparent",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "transform .25s ease, border-color .2s",
        cursor: "default",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)"
      }}
    >
      {/* Category row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
            fontSize: 11,
            color: "#5F6168",
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          {service.category}
        </span>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: service.type === "monthly" ? "#FF6B2C" : "#345CFF",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 12, color: "#5F6168" }}>
          {service.type === "monthly" ? "Mensual" : "Pago único"}
        </span>
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: "#202124",
          letterSpacing: "-.035em",
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {service.name}
      </h3>

      {/* Desc */}
      <p style={{ fontSize: 15, color: "#5F6168", lineHeight: 1.5, margin: 0, flexGrow: 1 }}>
        {service.desc}
      </p>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
        {service.prefix && (
          <span
            style={{
              fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
              fontSize: 13,
              color: "#5F6168",
            }}
          >
            {service.prefix}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
            fontSize: 40,
            fontWeight: 400,
            color: "#202124",
            lineHeight: 1,
          }}
        >
          ${service.price}
        </span>
        {service.type === "monthly" && (
          <span style={{ fontSize: 14, color: "#5F6168", marginLeft: 4 }}>/mes</span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleAdd}
        disabled={added}
        style={{
          padding: "12px 20px",
          borderRadius: "999px",
          border: added ? "1.5px solid #202124" : "1.5px solid #E2DED3",
          background: added ? "#D9FA62" : "transparent",
          color: "#202124",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
          cursor: added ? "default" : "pointer",
          transition: "background .2s, border-color .2s",
          textAlign: "center",
        }}
      >
        {added ? "✓ Añadido" : "Añadir servicio"}
      </button>
    </article>
  )
}

export function FeaturedServices() {
  return (
    <section style={{ padding: "100px 0", fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)" }}>
      <div className="mk-container">
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
            fontSize: 13,
            color: "#5F6168",
            marginBottom: 24,
            letterSpacing: ".04em",
          }}
        >
          05 — SERVICIOS DESTACADOS
        </p>

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(40px,5vw,72px)",
              fontWeight: 600,
              color: "#202124",
              letterSpacing: "-.045em",
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            Elige tu clic.
          </h2>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#345CFF", display: "inline-block" }} />
              <span style={{ fontSize: 14, color: "#5F6168" }}>Pago único</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B2C", display: "inline-block" }} />
              <span style={{ fontSize: 14, color: "#5F6168" }}>Mensual</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 40,
          }}
        >
          {SERVICES.map((s) => (
            <ServiceCardItem key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
