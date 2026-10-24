"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface HeroKeyProps {
  className?: string
}

export function HeroKey({ className }: HeroKeyProps) {
  const [on, setOn] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [mx, setMx] = useState(0)
  const [my, setMy] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    setMx(nx)
    setMy(ny)
  }, [reducedMotion])

  const handleMouseLeave = useCallback(() => {
    setMx(0)
    setMy(0)
  }, [])

  const handleClick = useCallback(() => {
    setOn((prev) => !prev)
    setClicks((prev) => prev + 1)
  }, [])

  const tiltX = reducedMotion ? 0 : -my * 6
  const tiltY = reducedMotion ? 0 : mx * 6
  const perspective = reducedMotion ? "none" : `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Pill naranja rotado */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          right: "5%",
          transform: "rotate(8deg)",
          background: "#FF6B2C",
          color: "white",
          border: "2px solid #202124",
          borderRadius: "999px",
          padding: "10px 18px",
          fontWeight: 700,
          fontSize: 15,
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
          whiteSpace: "nowrap",
          userSelect: "none",
          zIndex: 2,
        }}
      >
        CLICK! aquí
      </div>

      {/* Badge de clics */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "5%",
          background: "white",
          border: "1.5px solid #202124",
          borderRadius: 12,
          padding: "12px 16px",
          fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
          fontSize: 13,
          color: "#202124",
          userSelect: "none",
          zIndex: 2,
          lineHeight: 1.4,
        }}
      >
        <span style={{ color: "#5F6168", display: "block", fontSize: 11, marginBottom: 2 }}>clics →</span>
        <span style={{ fontWeight: 500, fontSize: 22 }}>{clicks}</span>
        {on && (
          <span
            style={{
              display: "block",
              marginTop: 4,
              background: "#D9FA62",
              borderRadius: "999px",
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 500,
              color: "#202124",
            }}
          >
            ON ✓
          </span>
        )}
      </div>

      {/* La tecla grande — con perspectiva 3D */}
      <div
        style={{
          transform: perspective,
          transition: reducedMotion ? "none" : "transform .1s ease-out",
          willChange: "transform",
          cursor: "pointer",
          position: "relative",
          zIndex: 3,
        }}
        onClick={handleClick}
        role="button"
        aria-label={on ? "Tecla encendida — clic para apagar" : "Tecla apagada — clic para encender"}
        aria-pressed={on}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick() }}
      >
        {/* Wrapper con sombra */}
        <div style={{ position: "relative", paddingBottom: 28 }}>
          {/* Chispas encima */}
          <div
            style={{
              position: "absolute",
              top: -40,
              left: 0,
              right: 0,
              height: 48,
              opacity: on ? 1 : 0,
              transition: "opacity .2s ease .08s",
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "28%",
                bottom: 0,
                width: 14,
                height: 26,
                borderRadius: "999px",
                background: "#FF6B2C",
                transform: "rotate(-35deg)",
                transformOrigin: "50% 100%",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "calc(50% - 7px)",
                bottom: 8,
                width: 14,
                height: 32,
                borderRadius: "999px",
                background: "#FF6B2C",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "28%",
                bottom: 0,
                width: 14,
                height: 26,
                borderRadius: "999px",
                background: "#FF6B2C",
                transform: "rotate(35deg)",
                transformOrigin: "50% 100%",
              }}
            />
          </div>

          {/* La tecla */}
          <div
            style={{
              width: 300,
              height: 220,
              background: on ? "#D9FA62" : "#FFFFFF",
              borderRadius: 66,
              border: "6px solid #202124",
              boxShadow: on ? "0 6px 0 #202124" : "0 28px 0 #202124",
              transform: on ? "translateY(22px)" : "translateY(0)",
              transition: "transform .12s ease, box-shadow .12s ease, background .2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              userSelect: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
                fontWeight: 700,
                fontSize: 108,
                color: "#202124",
                lineHeight: 1,
                letterSpacing: "-.04em",
              }}
            >
              c
            </span>
            <span
              style={{
                fontFamily: "var(--font-mk-serif, 'Instrument Serif', serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 120,
                color: "#345CFF",
                lineHeight: 1,
                marginTop: -6,
              }}
            >
              !
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
