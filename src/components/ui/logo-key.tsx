"use client"
import { useState } from "react"

interface LogoKeyProps {
  size?: number      // px del contenedor (default 200)
  interactive?: boolean
  className?: string
}

export function LogoKey({ size = 200, interactive = true, className }: LogoKeyProps) {
  const [pressed, setPressed] = useState(false)

  const radius = Math.round(44 / 200 * size)
  const handleClick = () => {
    if (!interactive) return
    setPressed((p) => !p)
  }

  return (
    <button
      onClick={handleClick}
      style={{
        width: size,
        height: Math.round(size * 0.7),
        position: "relative",
        cursor: interactive ? "pointer" : "default",
        background: "none",
        border: "none",
        padding: 0,
        display: "inline-flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
      aria-label={pressed ? "Tecla presionada" : "Tecla c!"}
      aria-pressed={pressed}
    >
      {/* Chispas encima (aparecen al presionar) */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Math.round(size * 0.18),
          opacity: pressed ? 1 : 0,
          transition: "opacity 0.2s ease 0.08s",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "30%",
            bottom: 0,
            width: Math.round(size * 0.045),
            height: Math.round(size * 0.13),
            borderRadius: "999px",
            background: "#FF6B2C",
            transform: "rotate(-35deg)",
            transformOrigin: "50% 100%",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "calc(50% - " + Math.round(size * 0.022) + "px)",
            bottom: Math.round(size * 0.03),
            width: Math.round(size * 0.045),
            height: Math.round(size * 0.155),
            borderRadius: "999px",
            background: "#FF6B2C",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "30%",
            bottom: 0,
            width: Math.round(size * 0.045),
            height: Math.round(size * 0.13),
            borderRadius: "999px",
            background: "#FF6B2C",
            transform: "rotate(35deg)",
            transformOrigin: "50% 100%",
          }}
        />
      </span>

      {/* La tecla */}
      <span
        className={className}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: Math.round(size * 0.62),
          background: pressed ? "#D9FA62" : "#FFFFFF",
          borderRadius: radius,
          border: `${Math.max(2, Math.round(size * 0.03))}px solid #202124`,
          boxShadow: pressed
            ? `0 ${Math.round(size * 0.015)}px 0 #202124`
            : `0 ${Math.round(size * 0.07)}px 0 #202124`,
          transform: pressed ? `translateY(${Math.round(size * 0.055)}px)` : "translateY(0)",
          transition: "transform .12s ease, box-shadow .12s ease, background .2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: Math.round(size * 0.02),
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
            fontWeight: 700,
            fontSize: Math.round(size * 0.36),
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
            fontSize: Math.round(size * 0.4),
            color: "#345CFF",
            lineHeight: 1,
            marginTop: Math.round(size * -0.02),
          }}
        >
          !
        </span>
      </span>
    </button>
  )
}
