"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoWordmark } from "@/components/ui/logo-wordmark"
import { useCart } from "@/components/shop/cart-provider"
import { waLink } from "@/lib/whatsapp"

const NAV_LINKS = [
  { key: "services", href: "/services", label: "Servicios" },
  { key: "pricing", href: "/pricing", label: "Precios" },
  { key: "projects", href: "/projects", label: "Proyectos" },
  { key: "apps", href: "/apps", label: "Apps" },
  { key: "about", href: "/about", label: "Quiénes somos" },
  { key: "blog", href: "/blog", label: "Blog" },
]

interface NavbarProps {
  active?: string
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1" />
      <circle cx="9.5" cy="19.5" r="1.3" />
      <circle cx="17" cy="19.5" r="1.3" />
    </svg>
  )
}

export function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  return (
    <header style={{ position: "sticky", top: 12, zIndex: 50, padding: "12px 16px 0" }}>
      <nav
        aria-label="Principal"
        style={{
          maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: "8px 16px", padding: "8px 10px 8px 22px",
          background: "rgba(255,248,240,.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          border: "1.5px solid rgba(1,14,37,.1)", borderRadius: open ? 28 : 999,
        }}
      >
        <Link href="/" aria-label="ClicKonversion, ir al inicio" style={{ textDecoration: "none", padding: "2px 0" }}>
          <LogoWordmark size="md" />
        </Link>

        <div className="ck-navlinks">
          {NAV_LINKS.map((l) => (
            <Link key={l.key} href={l.href} className="ck-navlink" aria-current={active === l.key ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="ck-navstatus ck-mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5A6178", marginRight: 6 }}>
            <span className="ck-dot" />en línea
          </span>
          <Link href={count > 0 ? "/checkout" : "/pricing"} className="ck-icon-btn" aria-label={count > 0 ? `Ir al pago, ${count} en el carrito` : "Ver precios y carrito"}>
            <CartIcon />
            {count > 0 && <span className="ck-badge">{count}</span>}
          </Link>
          <a className="ck-btn ck-btn-dark" href={waLink("Hola, quiero hablar con ustedes")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 46, padding: "0 20px" }}>
            Hablemos →
          </a>
          <button
            type="button"
            className="ck-icon-btn ck-burger"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="ck-mobile-menu" style={{ width: "100%" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.key} href={l.href} className="ck-navlink" aria-current={active === l.key ? "page" : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/pricing" className="ck-btn ck-btn-primary" style={{ marginTop: 8 }} onClick={() => setOpen(false)}>
              Ver precios y paquetes ↗
            </Link>
            <span className="ck-hand" style={{ fontSize: 22, color: "#C94400", textAlign: "center" }}>te respondemos nosotros</span>
          </div>
        )}
      </nav>
    </header>
  )
}
