"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatedLogo } from "@/components/ui/animated-logo"
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

/** "Apps" lleva a /apps; al pasar el cursor (o con el teclado) despliega SyncLead. */
function AppsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc) }
  }, [open])

  return (
    <div ref={ref} className="ck-dd" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href="/apps"
        className="ck-navlink ck-dd-btn"
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={() => setOpen(true)}
      >
        Apps
        <span className="ck-dd-new">SYNCLEAD</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6" /></svg>
      </Link>
      {open && (
        <div className="ck-dd-panel">
          <Link href="/apps/synclead" className="ck-dd-item" onClick={() => setOpen(false)}>
            <span className="ck-dd-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#010E25" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></svg>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.3 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 16 }}>SyncLead <span className="ck-mono" style={{ fontSize: 10.5, background: "#FE5C02", borderRadius: 6, padding: "2px 6px" }}>CRM</span></span>
              <span style={{ fontSize: 14, color: "#5A6178" }}>Tus leads de Meta Ads, con WhatsApp e IA</span>
            </span>
          </Link>
          <Link href="/apps/synclead#planes" className="ck-dd-item ck-dd-sub" onClick={() => setOpen(false)}>Planes y precios de SyncLead <span className="ck-arrow">→</span></Link>
          <div style={{ height: 1, background: "rgba(1,14,37,.1)", margin: "4px 0" }} />
          <Link href="/apps" className="ck-dd-item ck-dd-sub" onClick={() => setOpen(false)}>Ver todas las apps <span className="ck-arrow">→</span></Link>
        </div>
      )}
    </div>
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
          border: "1.5px solid rgba(1,14,37,.1)", borderRadius: open ? 28 : 999, transition: "border-radius .3s",
        }}
      >
        <Link href="/" aria-label="ClicKonversion, ir al inicio" style={{ textDecoration: "none", padding: "2px 0" }}>
          <AnimatedLogo size="md" />
        </Link>

        <div className="ck-navlinks">
          {NAV_LINKS.map((l) =>
            l.key === "apps" ? (
              <AppsMenu key={l.key} active={active === "apps"} />
            ) : (
              <Link key={l.key} href={l.href} className="ck-navlink" aria-current={active === l.key ? "page" : undefined}>
                {l.label}
              </Link>
            )
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="ck-navstatus ck-mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5A6178", marginRight: 6 }}>
            <span className="ck-dot" />en línea
          </span>
          <Link href={count > 0 ? "/checkout" : "/pricing"} className="ck-icon-btn" aria-label={count > 0 ? `Ir al pago, ${count} en el carrito` : "Ver precios y carrito"}>
            <CartIcon />
            {count > 0 && <span className="ck-badge">{count}</span>}
          </Link>
          <a className="ck-btn ck-btn-dark ck-nav-cta" href={waLink("Hola, quiero hablar con ustedes")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 46, padding: "0 20px" }}>
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
              <div key={l.key} style={{ display: "contents" }}>
                <Link href={l.href} className="ck-navlink" aria-current={active === l.key ? "page" : undefined} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
                {l.key === "apps" && (
                  <Link href="/apps/synclead" className="ck-navlink" style={{ fontSize: 18, paddingLeft: 32, display: "flex", alignItems: "center", gap: 10 }} onClick={() => setOpen(false)}>
                    ↳ SyncLead <span className="ck-mono" style={{ fontSize: 11, background: "#FE5C02", borderRadius: 6, padding: "2px 7px" }}>CRM</span>
                  </Link>
                )}
              </div>
            ))}
            <Link href="/pricing" className="ck-btn ck-btn-primary" style={{ marginTop: 8 }} onClick={() => setOpen(false)}>
              Ver precios y paquetes ↗
            </Link>
            <a className="ck-btn ck-btn-wa" href={waLink("Hola, quiero hablar con ustedes")} target="_blank" rel="noopener noreferrer">
              <span className="ck-dot" />Hablemos por WhatsApp
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
