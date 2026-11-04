"use client"

import { useRef, useState } from "react"
import { LogoSymbol } from "@/components/ui/logo-wordmark"

const REST = { rx: 6, ry: -12 }

/** Escena 3D del hero: capas a distintas profundidades que giran con el cursor.
 *  En móvil (<700px) solo se muestra el video — los flotantes se ocultan via CSS. */
export function HeroScene() {
  const [t, setT] = useState(REST)
  const frame = useRef<number | null>(null)

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => setT({ rx: REST.rx - y * 22, ry: REST.ry + x * 30 }))
  }

  return (
    <div
      className="ck-scene-wrap"
      onMouseMove={onMove}
      onMouseLeave={() => setT(REST)}
      style={{ flex: "1 1 440px", minWidth: 0, display: "flex", justifyContent: "center", perspective: 1400, padding: "24px 0" }}
    >
      <div className="ck-scene" style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}>

        {/* Tarjeta detrás — LA MÁQUINA */}
        <div className="ck-layer ck-layer-float" style={{ left: "34%", top: "3%", width: "62%", height: "68%", transform: "translateZ(-120px) rotate(5deg)" }}>
          <div style={{ width: "100%", height: "100%", background: "#010E25", borderRadius: 30, padding: 28, display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 40px 80px -40px rgba(1,14,37,.7)" }}>
            <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.6)" }}>LA MÁQUINA</span>
            <span className="ck-mono" style={{ fontSize: 14, color: "#fff", marginLeft: "auto" }}>[SEO] auditoría ✓</span>
            <span className="ck-mono" style={{ fontSize: 14, color: "#fff", marginLeft: "auto" }}>[ADS] campaña activa</span>
            <span className="ck-mono" style={{ fontSize: 14, color: "#FE5C02", marginLeft: "auto" }}>[IA] agente en línea ●</span>
          </div>
        </div>

        {/* Video — capa central, siempre visible */}
        <div className="ck-layer ck-layer-video" style={{ left: "14%", top: "4%", width: "47%", height: "84%", transform: "translateZ(0px) rotate(-4deg)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 32, border: "6px solid #010E25", background: "#010E25", boxShadow: "0 40px 70px -30px rgba(1,14,37,.65)", overflow: "hidden" }}>
            <video
              src="/video/clickonversion-reel.mp4"
              poster="/video/clickonversion-reel-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Video de ClicKonversion: del clic al chat"
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <span className="ck-mono ck-layer-float" style={{ position: "absolute", left: "50%", bottom: -14, transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 11.5, letterSpacing: ".08em", background: "#FE5C02", color: "#010E25", border: "1.5px solid #010E25", borderRadius: 999, padding: "6px 12px" }}>DEL CLIC AL CHAT</span>
        </div>

        {/* Flotantes — ocultos en móvil */}
        <div className="ck-layer ck-layer-float" style={{ left: "12%", top: "5%", transform: "translateZ(70px)" }}>
          <div className="ck-bob-3" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#D3F2E3", border: "1.5px solid #010E25", borderRadius: 999, padding: "8px 14px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}><span className="ck-dot" />respondemos hoy</div>
        </div>
        <div className="ck-layer ck-layer-float" style={{ left: "-3%", top: "34%", transform: "translateZ(60px)" }}>
          <div className="ck-bob-2"><span className="ck-tag" style={{ background: "#FFDCC7", fontSize: 15, padding: "8px 12px" }}>[ADS]</span></div>
        </div>
        <div className="ck-layer ck-layer-float" style={{ right: "0%", top: "42%", transform: "translateZ(100px)" }}>
          <div className="ck-bob-4"><span className="ck-tag" style={{ background: "#D6EBFF", fontSize: 15, padding: "8px 12px" }}>[SEO]</span></div>
        </div>
        <div className="ck-layer ck-layer-float" style={{ right: "28%", bottom: "1%", transform: "translateZ(40px)" }}>
          <div className="ck-bob"><span className="ck-tag" style={{ background: "#E4DEFF", fontSize: 15, padding: "8px 12px" }}>[IA]</span></div>
        </div>
        <div className="ck-layer ck-layer-float" style={{ right: "0%", bottom: "15%", width: "56%", transform: "translateZ(120px)" }}>
          <div className="ck-bob-2" style={{ background: "#fff", border: "1.5px solid #010E25", borderRadius: "20px 20px 20px 6px", padding: "14px 18px", fontSize: 16, fontWeight: 500, boxShadow: "0 24px 40px -24px rgba(1,14,37,.5)" }}>¡Hola! Cuéntanos qué vendes y te decimos por dónde empezaríamos.</div>
        </div>
        <div className="ck-layer ck-layer-float" style={{ left: "-1%", bottom: "4%", transform: "translateZ(150px)" }}>
          <div className="ck-bob" style={{ background: "#fff", borderRadius: 22, padding: "18px 22px", boxShadow: "0 30px 50px -26px rgba(1,14,37,.55)", display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>8<span style={{ color: "#FE5C02" }}>+</span></span>
            <span className="ck-mono" style={{ fontSize: 11.5, letterSpacing: ".08em", color: "#5A6178" }}>AÑOS · MARKETING DIGITAL</span>
          </div>
        </div>
        <div className="ck-layer ck-layer-float" style={{ right: "3%", top: "-3%", width: 88, height: 88, transform: "translateZ(180px)" }}>
          <div className="ck-bob-3" style={{ width: 88, height: 88, background: "#010E25", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 40px -20px rgba(1,14,37,.6)" }}>
            <LogoSymbol size={62} />
          </div>
        </div>

      </div>
    </div>
  )
}
