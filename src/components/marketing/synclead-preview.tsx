"use client"

import { useState } from "react"
import Link from "next/link"

const TABS = ["Captura", "Chats", "Negocios", "Ventas"]

const TAB_CONTENT: Record<string, React.ReactNode> = {
  "Captura": (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["@maria.g — Facebook Lead", "@carlos.m — Instagram DM", "@petroleo.ve — Web Form", "@ana.b — WhatsApp"].map((lead, i) => (
          <div
            key={i}
            style={{
              background: "#2A2B2F",
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: "#F7F5EF", fontSize: 14 }}>{lead}</span>
            <span
              style={{
                background: "#D9FA62",
                color: "#202124",
                borderRadius: "999px",
                padding: "2px 10px",
                fontSize: 11,
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
              }}
            >
              NUEVO
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
  "Chats": (
    <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ background: "#2A2B2F", borderRadius: 10, padding: "10px 14px", alignSelf: "flex-start", maxWidth: "80%", color: "#F7F5EF", fontSize: 14 }}>
        Hola, me interesa el servicio de SEO.
      </div>
      <div style={{ background: "#D9FA62", borderRadius: 10, padding: "10px 14px", alignSelf: "flex-end", maxWidth: "80%", color: "#202124", fontSize: 14 }}>
        ¡Hola! Perfecto, te cuento todo sobre nuestro plan de SEO técnico. ¿Tienes web actualmente?
      </div>
      <div style={{ background: "#2A2B2F", borderRadius: 10, padding: "10px 14px", alignSelf: "flex-start", maxWidth: "80%", color: "#F7F5EF", fontSize: 14 }}>
        Sí, en WordPress.
      </div>
    </div>
  ),
  "Negocios": (
    <div style={{ padding: "20px 0", display: "flex", gap: 8, overflowX: "auto" }}>
      {[
        { label: "Nuevo", count: 8, color: "#345CFF" },
        { label: "Calificado", count: 4, color: "#FF6B2C" },
        { label: "Propuesta", count: 2, color: "#E9E4FF" },
        { label: "Ganado", count: 1, color: "#D9FA62" },
      ].map((col) => (
        <div
          key={col.label}
          style={{
            background: "#2A2B2F",
            borderRadius: 12,
            padding: "12px 14px",
            minWidth: 120,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
            <span style={{ fontSize: 12, color: "#A9AAB0" }}>{col.label}</span>
          </div>
          <span style={{ color: "#F7F5EF", fontWeight: 600, fontSize: 22 }}>{col.count}</span>
        </div>
      ))}
    </div>
  ),
  "Ventas": (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
        <span style={{ fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)", fontSize: 40, color: "#D9FA62", fontWeight: 400 }}>$2,340</span>
        <span style={{ color: "#5F6168", fontSize: 14 }}>cerrado este mes</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[["SEO Auditoría", "$120"], ["Meta Ads x2", "$300"], ["Agente IA", "$350"]].map(([n, p]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", color: "#A9AAB0", fontSize: 14 }}>
            <span>{n}</span>
            <span style={{ color: "#F7F5EF" }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  ),
}

export function SyncLeadPreview() {
  const [tab, setTab] = useState("Captura")

  return (
    <section style={{ padding: "100px 0", fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)" }}>
      <div className="mk-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left col */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                fontSize: 13,
                color: "#5F6168",
                marginBottom: 24,
                letterSpacing: ".04em",
              }}
            >
              08 — NUESTRAS HERRAMIENTAS
            </p>

            <h2
              style={{
                fontSize: "clamp(40px,5vw,72px)",
                fontWeight: 600,
                color: "#202124",
                letterSpacing: "-.045em",
                lineHeight: 0.9,
                margin: "0 0 32px",
              }}
            >
              Creamos herramientas, no solo{" "}
              <em
                style={{
                  fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#345CFF",
                }}
              >
                estrategias.
              </em>
            </h2>

            {/* SyncLead logo mini */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#202124",
                borderRadius: 12,
                padding: "8px 14px",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                  fontSize: 16,
                  color: "#D9FA62",
                  fontWeight: 500,
                  letterSpacing: "-.02em",
                }}
              >
                SyncLead
              </span>
              <span
                style={{
                  background: "#D9FA62",
                  color: "#202124",
                  borderRadius: "999px",
                  padding: "2px 8px",
                  fontSize: 11,
                  fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                }}
              >
                BETA
              </span>
            </div>

            <p style={{ color: "#3A3B40", fontSize: 17, lineHeight: 1.55, marginBottom: 32 }}>
              SyncLead es nuestro CRM para leads de Meta Ads. Captura, califica y convierte de forma automática — incluido gratis en todos los planes de publicidad.
            </p>

            <Link
              href="/apps/synclead"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                borderRadius: "999px",
                background: "#202124",
                color: "#F7F5EF",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                transition: "background .15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#345CFF" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#202124" }}
            >
              Conoce SyncLead ↗
            </Link>
          </div>

          {/* Right col: Terminal */}
          <div
            style={{
              background: "#202124",
              borderRadius: 24,
              overflow: "hidden",
              border: "1.5px solid #2A2B2F",
            }}
          >
            {/* Terminal header */}
            <div
              style={{
                background: "#2A2B2F",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ flex: 1 }} />
              <span
                style={{
                  fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                  fontSize: 12,
                  color: "#5F6168",
                }}
              >
                synclead · dashboard
              </span>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #2A2B2F" }}>
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "10px 16px",
                    background: tab === t ? "#202124" : "transparent",
                    border: "none",
                    borderBottom: tab === t ? "2px solid #D9FA62" : "2px solid transparent",
                    color: tab === t ? "#F7F5EF" : "#5F6168",
                    fontSize: 13,
                    fontWeight: tab === t ? 500 : 400,
                    cursor: "pointer",
                    fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
                    transition: "color .15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: "0 20px 20px", minHeight: 200 }}>
              {TAB_CONTENT[tab]}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
