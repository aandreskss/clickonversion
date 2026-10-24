"use client"

import Link from "next/link"
import { LogoWordmark } from "@/components/ui/logo-wordmark"

const FOOTER_NAVEGA = [
  { href: "/",          label: "Inicio" },
  { href: "/services",  label: "Servicios" },
  { href: "/pricing",   label: "Precios" },
  { href: "/projects",  label: "Proyectos" },
  { href: "/about",     label: "Nosotros" },
  { href: "/resources", label: "Recursos" },
]

const FOOTER_SERVICIOS = [
  { href: "/services#seo",  label: "SEO técnico" },
  { href: "/services#seo",  label: "SEO local" },
  { href: "/services#seo",  label: "AI Search" },
  { href: "/services#ads",  label: "Google Ads" },
  { href: "/services#ads",  label: "Meta Ads" },
  { href: "/services#ads",  label: "TikTok Ads" },
  { href: "/services#ia",   label: "Automatización WhatsApp" },
  { href: "/services#ia",   label: "Agentes IA" },
  { href: "/services#meta", label: "Soporte Meta Business" },
]

const FOOTER_APPS = [
  { href: "/apps/synclead",     label: "SyncLead" },
  { href: "/portal/dashboard",  label: "Portal de clientes" },
  { href: "/pricing",           label: "Ver precios" },
  { href: "/checkout",          label: "Checkout" },
]

export function Footer() {
  return (
    <footer
      style={{
        margin: "16px",
        borderRadius: "40px",
        background: "#345CFF",
        color: "white",
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        overflow: "hidden",
      }}
      role="contentinfo"
    >
      <div
        style={{
          maxWidth: 1328,
          margin: "0 auto",
          padding: "96px 32px 40px",
        }}
      >
        {/* Upper: CTA gigante */}
        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontSize: "clamp(56px,9vw,152px)",
              fontWeight: 600,
              lineHeight: 0.88,
              letterSpacing: "-.05em",
              color: "white",
              margin: "0 0 40px",
            }}
          >
            Hagamos que todo haga{" "}
            <em
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#D9FA62",
              }}
            >
              clic.
            </em>
          </h2>

          <Link
            href="/about#contacto"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 28px",
              borderRadius: "999px",
              background: "#D9FA62",
              color: "#202124",
              fontWeight: 600,
              fontSize: 17,
              textDecoration: "none",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFFFF" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#D9FA62" }}
          >
            Empezar un proyecto ↗
          </Link>
        </div>

        {/* Link grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 40,
            marginBottom: 80,
            borderTop: "1px solid rgba(255,255,255,.2)",
            paddingTop: 48,
          }}
        >
          {/* NAVEGA */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                fontWeight: 400,
                color: "#E9E4FF",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              NAVEGA
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {FOOTER_NAVEGA.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    style={{ color: "white", textDecoration: "none", fontSize: 15, transition: "color .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D9FA62" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "white" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICIOS */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                fontWeight: 400,
                color: "#E9E4FF",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              SERVICIOS
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {FOOTER_SERVICIOS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{ color: "white", textDecoration: "none", fontSize: 15, transition: "color .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D9FA62" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "white" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* APPS Y CUENTA */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                fontWeight: 400,
                color: "#E9E4FF",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              APPS Y CUENTA
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {FOOTER_APPS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    style={{ color: "white", textDecoration: "none", fontSize: 15, transition: "color .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D9FA62" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "white" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SALUDA */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 12,
                fontWeight: 400,
                color: "#E9E4FF",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              SALUDA
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href="mailto:hello@clickonversion.com"
                style={{ color: "white", textDecoration: "none", fontSize: 15, transition: "color .15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D9FA62" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "white" }}
              >
                hello@clickonversion.com
              </a>
              <a
                href="#"
                style={{ color: "white", textDecoration: "none", fontSize: 15, transition: "color .15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D9FA62" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "white" }}
              >
                WhatsApp →
              </a>
              <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                {["Instagram", "LinkedIn", "TikTok"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    style={{ color: "white", textDecoration: "none", fontSize: 15, transition: "color .15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#D9FA62" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "white" }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wordmark gigante */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.2)",
            paddingTop: 40,
            marginBottom: 32,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: "clamp(40px,11.5vw,190px)",
              fontWeight: 600,
              letterSpacing: "-.05em",
              fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
              color: "white",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            click
            <span
              style={{
                position: "relative",
                background: "#D9FA62",
                borderRadius: "999px",
                padding: "0 .2em .06em",
                margin: "0 .04em",
                display: "inline-flex",
                alignItems: "center",
                color: "#202124",
              }}
            >
              ON
            </span>
            version
          </span>
        </div>

        {/* Fila legal */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
            fontSize: 12,
            color: "#E9E4FF",
          }}
        >
          <span>
            © 2026 Clickonversion ·{" "}
            <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>
              Privacidad
            </Link>{" "}
            ·{" "}
            <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>
              Términos
            </Link>
          </span>
          <span>Estrategia · Tecnología · Crecimiento</span>
          <span>Pequeños clics. Grandes cosas.</span>
        </div>
      </div>
    </footer>
  )
}
