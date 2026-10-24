"use client"

import { useState } from "react"
import Link from "next/link"
import { LogoWordmark } from "@/components/ui/logo-wordmark"
import { useCart } from "@/components/shop/cart-provider"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { href: "/services",  label: "Servicios" },
  { href: "/pricing",   label: "Precios" },
  { href: "/projects",  label: "Proyectos" },
  { href: "/apps",      label: "Apps" },
  { href: "/about",     label: "Nosotros" },
  { href: "/resources", label: "Recursos" },
]

interface NavbarProps {
  active?: string
}

export function Navbar({ active }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const { items, count } = useCart()

  const cartTotal = items.reduce(
    (sum, item) => sum + item.displayPrice * item.quantity,
    0
  )

  return (
    <header
      style={{
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#F7F5EF",
        borderBottom: "1px solid #E2DED3",
      }}
      role="banner"
    >
      <div
        className="mk-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 32px",
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="ClicKonversion home"
          style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, textDecoration: "none" }}
        >
          <LogoWordmark size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden lg:flex"
          style={{ alignItems: "center", gap: 2 }}
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#202124",
                  background: isActive ? "#E9E4FF" : "transparent",
                  textDecoration: "none",
                  transition: "background .15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "#E9E4FF"
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop right */}
        <div
          className="hidden lg:flex"
          style={{ alignItems: "center", gap: 10, flexShrink: 0 }}
        >
          {/* Cart pill */}
          {count > 0 && (
            <Link
              href="/checkout"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1.5px solid #202124",
                background: "#D9FA62",
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 13,
                fontWeight: 500,
                color: "#202124",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Carrito {count} · ${cartTotal.toLocaleString("es-VE", { minimumFractionDigits: 0 })}
            </Link>
          )}

          <Link
            href="/portal/dashboard"
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: 15,
              fontWeight: 500,
              color: "#202124",
              textDecoration: "none",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#E9E4FF" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
          >
            Mi cuenta
          </Link>

          <Link
            href="/about#contacto"
            style={{
              padding: "12px 20px",
              borderRadius: "999px",
              fontSize: 15,
              fontWeight: 600,
              color: "#F7F5EF",
              background: "#202124",
              textDecoration: "none",
              transition: "background .15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#345CFF" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#202124" }}
          >
            Hablemos →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#202124" }}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className="lg:hidden"
        style={{
          maxHeight: open ? "85vh" : 0,
          overflow: "hidden",
          transition: "max-height .3s ease",
          borderTop: open ? "1px solid #E2DED3" : "none",
        }}
        aria-hidden={!open}
      >
        <nav
          style={{ padding: "12px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}
          aria-label="Menú móvil"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 500,
                color: "#202124",
                textDecoration: "none",
                background: active === link.href ? "#E9E4FF" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {count > 0 && (
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "999px",
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#202124",
                  background: "#D9FA62",
                  border: "1.5px solid #202124",
                  textDecoration: "none",
                  textAlign: "center",
                  fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                }}
              >
                Carrito {count} · ${cartTotal.toLocaleString("es-VE", { minimumFractionDigits: 0 })}
              </Link>
            )}
            <Link
              href="/portal/dashboard"
              onClick={() => setOpen(false)}
              style={{
                padding: "12px 20px",
                borderRadius: "999px",
                fontSize: 15,
                fontWeight: 500,
                color: "#202124",
                background: "transparent",
                border: "1.5px solid #E2DED3",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Mi cuenta
            </Link>
            <Link
              href="/about#contacto"
              onClick={() => setOpen(false)}
              style={{
                padding: "14px 20px",
                borderRadius: "999px",
                fontSize: 15,
                fontWeight: 600,
                color: "#F7F5EF",
                background: "#202124",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Hablemos →
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
