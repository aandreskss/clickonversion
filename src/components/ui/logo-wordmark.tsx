"use client"

interface LogoWordmarkProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

// El logo: "click" + píldora lime "ON" con 3 chispas naranjas encima + "version"
// La píldora ON: fondo lime #D9FA62, border-radius 999px, padding 0 .2em .06em
// Chispas: 3 barras naranjas (#FF6B2C) de .09em × .2-.24em, rotadas -35°, 0°, 35°
//          posicionadas en top: -.42em sobre la píldora

const SIZES = { sm: 22, md: 28, lg: 36, xl: 48 }

export function LogoWordmark({ size = "md", className }: LogoWordmarkProps) {
  const fs = SIZES[size]
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "-.05em",
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        color: "#202124",
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
        }}
      >
        {/* Chispas */}
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "-.42em",
            height: ".32em",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "20%",
              bottom: 0,
              width: ".09em",
              height: ".2em",
              borderRadius: "999px",
              background: "#FF6B2C",
              transform: "rotate(-35deg)",
              transformOrigin: "50% 100%",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "calc(50% - .045em)",
              bottom: ".05em",
              width: ".09em",
              height: ".24em",
              borderRadius: "999px",
              background: "#FF6B2C",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "20%",
              bottom: 0,
              width: ".09em",
              height: ".2em",
              borderRadius: "999px",
              background: "#FF6B2C",
              transform: "rotate(35deg)",
              transformOrigin: "50% 100%",
            }}
          />
        </span>
        ON
      </span>
      version
    </span>
  )
}
