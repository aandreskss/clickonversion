"use client"

import Link from "next/link"
import { useCart } from "@/components/shop/cart-provider"
import type { CartItem } from "@/types/catalog"

function formatSummary(items: CartItem[]): { today: number; monthly: number } {
  let today = 0
  let monthly = 0
  for (const item of items) {
    if (item.billingPeriod === "monthly") {
      monthly += item.displayPrice * item.quantity
    } else {
      today += item.displayPrice * item.quantity
    }
  }
  return { today, monthly }
}

export function CartBar() {
  const { items, count } = useCart()

  if (count === 0) return null

  const { today, monthly } = formatSummary(items)

  const label =
    `${count} servicio${count === 1 ? "" : "s"} · ` +
    (today > 0 ? `$${today} hoy` : "") +
    (today > 0 && monthly > 0 ? " + " : "") +
    (monthly > 0 ? `$${monthly}/mes` : "")

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carrito de servicios"
      style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(calc(100% - 32px), 720px)",
        background: "#202124",
        color: "#fff",
        borderRadius: 999,
        padding: "10px 10px 10px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "0 12px 40px rgba(32,33,36,.25)",
        zIndex: 9000,
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, flexShrink: 1, minWidth: 0 }}>
        {label}
      </span>
      <Link
        href="/checkout"
        style={{
          background: "#D9FA62",
          color: "#202124",
          borderRadius: 999,
          padding: "10px 20px",
          fontSize: 14,
          fontWeight: 700,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85" }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1" }}
      >
        Ir al pago →
      </Link>
    </div>
  )
}
