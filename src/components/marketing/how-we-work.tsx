"use client"

import { useState } from "react"

const STEPS = [
  {
    num: "01",
    label: "Descubrir",
    desc: "Analizamos tu negocio, tu mercado y tus competidores para identificar las oportunidades de mayor impacto.",
    shape: {
      width: "34%",
      height: "34%",
      borderRadius: "50%",
      background: "#D9FA62",
      rotate: "0deg",
    },
  },
  {
    num: "02",
    label: "Construir",
    desc: "Diseñamos e implementamos el sistema de crecimiento: SEO, campañas, automatizaciones y herramientas a medida.",
    shape: {
      width: "56%",
      height: "56%",
      borderRadius: "36px",
      background: "#345CFF",
      rotate: "12deg",
    },
  },
  {
    num: "03",
    label: "Optimizar",
    desc: "Medimos cada variable, iteramos con datos y ajustamos hasta que el sistema funcione de forma previsible.",
    shape: {
      width: "78%",
      height: "42%",
      borderRadius: "999px",
      background: "#E9E4FF",
      rotate: "-8deg",
    },
  },
  {
    num: "04",
    label: "Crecer",
    desc: "Escalamos lo que funciona, exploramos nuevos canales y construimos ventajas competitivas sostenibles.",
    shape: {
      width: "80%",
      height: "80%",
      borderRadius: "50%",
      background: "#FF6B2C",
      rotate: "0deg",
    },
  },
]

export function HowWeWork() {
  const [active, setActive] = useState(0)
  const step = STEPS[active]

  return (
    <section
      style={{
        background: "#E9E4FF",
        margin: "40px 16px",
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
            color: "#5F6168",
            marginBottom: 40,
            letterSpacing: ".04em",
          }}
        >
          04 — CÓMO TRABAJAMOS ↗
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* Left: Steps accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {STEPS.map((s, i) => {
              const isActive = active === i
              return (
                <button
                  key={s.num}
                  onClick={() => setActive(i)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "20px 24px",
                    borderRadius: 20,
                    background: isActive ? "white" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "background .2s",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isActive ? 12 : 0 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
                        fontSize: 12,
                        color: "#5F6168",
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#202124",
                        letterSpacing: "-.03em",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {isActive && (
                    <p style={{ fontSize: 16, color: "#3A3B40", lineHeight: 1.55, margin: 0 }}>
                      {s.desc}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Right: Shape panel */}
          <div
            style={{
              background: "white",
              borderRadius: 32,
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: step.shape.width,
                height: step.shape.height,
                borderRadius: step.shape.borderRadius,
                background: step.shape.background,
                transform: `rotate(${step.shape.rotate})`,
                transition: "all .7s cubic-bezier(.6,-0.3,.3,1.3)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
