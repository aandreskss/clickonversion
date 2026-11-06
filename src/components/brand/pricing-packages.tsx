"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useCart } from "@/components/shop/cart-provider"
import { SERVICES } from "@/components/marketing/pricing-grid"
import type { CartItem } from "@/types/catalog"

type Svc = (typeof SERVICES)[number]

const fmt = (n: number) => "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

/** Descuento por volumen (usado solo en "arma tu paquete"). */
export function volumeDiscount(n: number) {
  return n >= 5 ? 0.15 : n >= 3 ? 0.1 : 0
}

function totals(list: Svc[], disc: number) {
  const once = list.filter((s) => s.type !== "monthly").reduce((a, s) => a + s.price, 0)
  const monthly = list.filter((s) => s.type === "monthly").reduce((a, s) => a + s.price, 0)
  return { once, monthly, onceD: Math.round(once * (1 - disc)), monthlyD: Math.round(monthly * (1 - disc)) }
}

/** Convierte precios en líneas de carrito. */
function bundleLines(id: string, name: string, once: number, monthly: number): CartItem[] {
  const lines: CartItem[] = []
  if (once > 0) lines.push({ key: `${id}:${id}-unico`, serviceId: id, priceId: `${id}-unico`, quantity: 1, displayName: `${name} · pago único`, displayPrice: once, priceType: "ONE_TIME", billingPeriod: "one_time", currency: "USD" })
  if (monthly > 0) lines.push({ key: `${id}:${id}-mensual`, serviceId: id, priceId: `${id}-mensual`, quantity: 1, displayName: `${name} · mensual`, displayPrice: monthly, priceType: "RECURRING", billingPeriod: "monthly", currency: "USD" })
  return lines
}

const PACKAGES = [
  {
    id: "pkg-arranque",
    tag: "[ARRANQUE]",
    tagBg: "#D6EBFF",
    name: "Arranque",
    pitch: "Para empezar a vender con una base bien hecha y bien medida.",
    monthly: 0,
    once: 390,
    setupLabel: "Sin mensualidad · tuyo para siempre",
    features: [
      "Landing optimizada para conversión",
      "Píxel de Meta + API de conversiones",
      "Conversiones de Google Ads",
      "Google Business optimizado",
      "WhatsApp conectado a tu web",
    ],
    hot: false,
    note: null,
  },
  {
    id: "pkg-crecimiento",
    tag: "[CRECIMIENTO]",
    tagBg: "#FFDCC7",
    name: "Crecimiento",
    pitch: "Para llenar tu WhatsApp de conversaciones con clientes cada semana.",
    monthly: 630,
    once: 150,
    setupLabel: "Configuración inicial: $150 (pago único)",
    features: [
      "Gestión de Meta Ads",
      "4 anuncios creados al mes (Reels o posts)",
      "SEO local + Google Business",
      "Medición en Meta / Google / TikTok",
      "WhatsApp Business + CRM",
      "Reporte semanal en lenguaje humano",
    ],
    hot: true,
    note: "↳ con este empieza la mayoría",
  },
  {
    id: "pkg-escala",
    tag: "[ESCALA]",
    tagBg: "#E4DEFF",
    name: "Escala",
    pitch: "Para crecer en varios canales con un agente de IA trabajando 24/7.",
    monthly: 1190,
    once: 350,
    setupLabel: "Configuración inicial: $350 (pago único)",
    features: [
      "Todo lo de Crecimiento",
      "8 anuncios al mes con variantes A/B",
      "Gestión de Google Ads",
      "Agente IA para WhatsApp",
      "SEO técnico + 2 artículos al mes",
      "Reunión mensual de estrategia",
    ],
    hot: false,
    note: null,
  },
]

export function PricingPackages() {
  const { addItem, hasItem } = useCart()

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 32, alignItems: "start", perspective: 1400 }}>
      {PACKAGES.map((p) => {
        const lines = bundleLines(p.id, `Paquete ${p.name}`, p.once, p.monthly)
        const inCart = lines.length > 0 && lines.every((l) => hasItem(l.key))
        const add = () => lines.forEach((l) => { if (!hasItem(l.key)) addItem(l) })
        const dark = p.hot
        return (
          <article key={p.id} className={`ck-plan${p.hot ? " ck-plan-hot" : ""}`} style={{ position: "relative", background: dark ? "#010E25" : "#fff", color: dark ? "#fff" : "#010E25", border: `1.5px solid ${dark ? "#FE5C02" : "#010E25"}`, borderRadius: 32, padding: 32, display: "flex", flexDirection: "column", gap: 22, boxShadow: dark ? "0 50px 80px -50px rgba(1,14,37,.8)" : undefined }}>
            {p.hot && <span style={{ position: "absolute", top: -18, right: 28, background: "#FE5C02", color: "#010E25", border: "1.5px solid #010E25", borderRadius: 999, padding: "8px 16px", fontWeight: 700, fontSize: 14, transform: "rotate(3deg)" }}>el más elegido</span>}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="ck-tag" style={{ alignSelf: "flex-start", background: p.tagBg }}>{p.tag}</span>
              <h3 style={{ fontSize: 34, color: dark ? "#fff" : undefined }}>{p.name}</h3>
              <p style={{ fontSize: 16, color: dark ? "rgba(255,255,255,.78)" : "#5A6178" }}>{p.pitch}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{fmt(p.monthly || p.once)}</span>
                <span className="ck-mono" style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.7)" : "#5A6178" }}>{p.monthly ? "/mes" : "pago único"}</span>
              </div>
              <span style={{ fontSize: 14, color: dark ? "rgba(255,255,255,.65)" : "#5A6178" }}>{p.setupLabel}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button type="button" className={`ck-btn ${inCart ? "ck-btn-added" : p.hot ? "ck-btn-primary on-dark" : "ck-btn-dark"}`} onClick={add}>{inCart ? "En el carrito ✓" : "Agregar al carrito"}</button>
              <Link href="/checkout" className="ck-pp" onClick={add} aria-label={`Pagar paquete ${p.name} con PayPal`}><span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#009CDE" }}>Pal</span></Link>
            </div>
            <div style={{ height: 1.5, background: dark ? "rgba(255,255,255,.14)" : "rgba(1,14,37,.1)" }} />
            <ul className={`ck-check${dark ? " on-dark" : ""}`} style={{ fontSize: 16 }}>
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            {p.note && <span className="ck-hand" style={{ fontSize: 24, color: dark ? "#FFDCC7" : "#FE5C02", transform: "rotate(-2deg)" }}>{p.note}</span>}
          </article>
        )
      })}
    </div>
  )
}

export function PackageBuilder() {
  const { addItem, hasItem } = useCart()
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const chosen = useMemo(() => SERVICES.filter((s) => picked[s.id] && !s.quote), [picked])
  const n = chosen.length
  const disc = volumeDiscount(n)
  const t = totals(chosen, disc)
  const plural = (k: number) => (k === 1 ? " servicio" : " servicios")
  const next =
    n === 0 ? "Elige al menos un servicio para empezar"
    : n < 3 ? `Agrega ${3 - n}${plural(3 - n)} más y ahorra 10%`
    : n < 5 ? `¡Ahorras 10%! Agrega ${5 - n}${plural(5 - n)} más y ahorra 15%`
    : "¡Tienes el máximo descuento: 15%!"
  const id = "bundle-" + chosen.map((s) => s.id).join("-")
  const lines = bundleLines(id, `Paquete a tu medida (${n}${plural(n)})`, t.onceD, t.monthlyD)
  const inCart = n > 0 && lines.every((l) => hasItem(l.key))

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: "999 1 520px", minWidth: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 10 }}>
        {SERVICES.filter((s) => !s.quote).map((s) => {
          const on = !!picked[s.id]
          return (
            <button key={s.id} type="button" className="ck-opt" aria-pressed={on} onClick={() => setPicked((p) => ({ ...p, [s.id]: !p[s.id] }))}>
              <span className="ck-box" aria-hidden="true">
                {on && <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#010E25" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>}
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>{s.type === "monthly" ? "MENSUAL" : "PAGO ÚNICO"}</span>
              </span>
              <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{s.prefix ? "desde " : ""}{fmt(s.price)}{s.type === "monthly" ? "/mes" : ""}</span>
            </button>
          )
        })}
      </div>
      <aside aria-label="Resumen de tu paquete" style={{ flex: "1 1 340px", minWidth: 0, position: "sticky", top: 110, background: "#010E25", color: "#fff", borderRadius: 32, padding: 28, display: "flex", flexDirection: "column", gap: 20, boxShadow: "0 50px 80px -50px rgba(1,14,37,.8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "rgba(255,255,255,.7)" }}>TU PAQUETE</span>
          <span className="ck-tag" style={{ background: "#FFDCC7" }}>{n}{plural(n)}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="ck-meter" aria-hidden="true"><span style={{ width: `${Math.min(n / 5, 1) * 100}%` }} /></div>
          <span style={{ fontSize: 15, color: "#FFDCC7" }} aria-live="polite">{next}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,.75)" }}>Pagos únicos</span><span style={{ fontWeight: 600 }}>{fmt(t.onceD)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,.75)" }}>Mensual</span><span style={{ fontWeight: 600 }}>{fmt(t.monthlyD)}/mes</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "rgba(255,255,255,.75)" }}>Descuento</span><span style={{ fontWeight: 600, color: "#FE5C02" }}>{disc ? `−${Math.round(disc * 100)}%` : "—"}</span></div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,.16)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 16 }}>Primer pago</span>
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{fmt(t.onceD + t.monthlyD)}</span>
        </div>
        <button type="button" className={`ck-btn ${inCart ? "ck-btn-added" : "ck-btn-primary on-dark"}`} disabled={n === 0} style={{ width: "100%", minHeight: 56, fontSize: 17 }} onClick={() => lines.forEach((l) => { if (!hasItem(l.key)) addItem(l) })}>
          {inCart ? "En el carrito ✓" : "Agregar mi paquete al carrito"}
        </button>
        {inCart && <Link href="/checkout" className="ck-pp"><span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#009CDE" }}>Pal</span></Link>}
        <span className="ck-hand" style={{ fontSize: 22, color: "#FFDCC7", textAlign: "center" }}>¿dudas? lo armamos contigo por WhatsApp</span>
      </aside>
    </div>
  )
}
