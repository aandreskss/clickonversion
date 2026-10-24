"use client"

import { useState, useRef } from "react"

const FLOW_STEPS = [
  { id: "msg",      label: "MENSAJE",  desc: "El lead llega por WhatsApp, web o anuncio." },
  { id: "agent",    label: "AGENTE",   desc: "El agente IA clasifica, responde y cualifica." },
  { id: "decision", label: "DECISIÓN", desc: "Evalúa intención, urgencia y encaje." },
  { id: "action",   label: "ACCIÓN",   desc: "Agenda, envía propuesta o activa secuencia." },
  { id: "handoff",  label: "TRASPASO", desc: "El humano toma el control en el momento justo." },
]

export function AiFlow() {
  const [active, setActive] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function runFlow() {
    if (running) return
    setRunning(true)
    setActive(null)

    FLOW_STEPS.forEach((_, i) => {
      const t = setTimeout(() => {
        setActive(i)
        if (i === FLOW_STEPS.length - 1) {
          setTimeout(() => setRunning(false), 600)
        }
      }, i * 700)
      if (i === 0) timerRef.current = t
    })
  }

  return (
    <section
      style={{
        background: "#202124",
        margin: "0 16px",
        borderRadius: "40px",
        padding: "80px 0",
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
      }}
    >
      <div className="mk-container">
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
            fontSize: 13,
            color: "#D9FA62",
            marginBottom: 24,
            letterSpacing: ".04em",
          }}
        >
          07 — MÁS INTELIGENTE CON IA
        </p>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 56,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(40px,5.5vw,88px)",
              fontWeight: 600,
              color: "#F7F5EF",
              letterSpacing: "-.05em",
              lineHeight: 0.9,
              margin: 0,
              maxWidth: 700,
            }}
          >
            Deja que la IA haga el trabajo{" "}
            <em
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#D9FA62",
              }}
            >
              pesado.
            </em>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16 }}>
            <p style={{ color: "#5F6168", fontSize: 17, margin: 0, textAlign: "right", maxWidth: 280, lineHeight: 1.5 }}>
              Automatizamos la captación, calificación y seguimiento para que tu equipo se enfoque en cerrar.
            </p>
            <button
              onClick={runFlow}
              disabled={running}
              style={{
                padding: "14px 24px",
                borderRadius: "999px",
                background: running ? "#3A3B40" : "#D9FA62",
                color: "#202124",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: running ? "not-allowed" : "pointer",
                transition: "background .2s",
                whiteSpace: "nowrap",
              }}
            >
              {running ? "Ejecutando..." : "▶ Ejecutar un flujo"}
            </button>
          </div>
        </div>

        {/* Flow cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {FLOW_STEPS.map((step, i) => {
            const isActive = active !== null && i <= active
            const isCurrent = active === i
            return (
              <div
                key={step.id}
                style={{
                  background: isActive ? "#D9FA62" : "#2A2B2F",
                  borderRadius: 20,
                  padding: "24px 20px",
                  transition: "background .35s ease, transform .25s ease",
                  transform: isCurrent ? "scale(1.04)" : "scale(1)",
                  border: isCurrent ? "1.5px solid #D9FA62" : "1.5px solid transparent",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                    fontSize: 11,
                    fontWeight: 500,
                    color: isActive ? "#202124" : "#5F6168",
                    letterSpacing: ".1em",
                    margin: "0 0 12px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} / {step.label}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: isActive ? "#202124" : "#5F6168",
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
