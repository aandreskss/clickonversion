"use client"

import { useCart } from "@/components/shop/cart-provider"
import { SERVICES } from "@/components/marketing/pricing-grid"
import type { CartItem } from "@/types/catalog"

/** Filas de servicios con precio real y botón para agregar/quitar del carrito. */
export function ServiceRows({ ids, dark = false }: { ids: string[]; dark?: boolean }) {
  const { addItem, removeItem, hasItem } = useCart()
  const list = ids.map((id) => SERVICES.find((s) => s.id === id)).filter((s): s is (typeof SERVICES)[number] => Boolean(s))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {list.map((svc) => {
        const inCart = hasItem(svc.id)
        const toggle = () => {
          if (inCart) return removeItem(svc.id)
          const item: CartItem = { key: svc.id, serviceId: svc.id, priceId: svc.id + "-price", quantity: 1, displayName: svc.name, displayPrice: svc.price, priceType: svc.priceType, billingPeriod: svc.billing, currency: "USD" }
          addItem(item)
        }
        return (
          <div key={svc.id} className={`ck-svc-row${dark ? " on-dark" : ""}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <span style={{ fontWeight: 600, fontSize: 16, color: dark ? "#fff" : "#010E25" }}>{svc.name}</span>
              <span style={{ fontSize: 14, color: dark ? "rgba(255,255,255,.72)" : "#3A4158" }}>{svc.desc}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "none" }}>
              <span style={{ fontWeight: 700, fontSize: 17, whiteSpace: "nowrap", color: dark ? "#fff" : "#010E25" }}>
                {svc.prefix && <span style={{ fontWeight: 400, fontSize: 13, marginRight: 4 }}>desde</span>}${svc.price}{svc.type === "mensual" && <span style={{ fontWeight: 400, fontSize: 13 }}>/mes</span>}
              </span>
              <button type="button" onClick={toggle} aria-pressed={inCart} aria-label={inCart ? `Quitar ${svc.name} del carrito` : `Agregar ${svc.name} al carrito`} className={`ck-btn ${inCart ? "ck-btn-added" : dark ? "ck-btn-primary on-dark" : "ck-btn-dark"}`} style={{ minHeight: 44, padding: "0 16px", fontSize: 14 }}>
                {inCart ? "Agregado ✓" : "Agregar +"}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
