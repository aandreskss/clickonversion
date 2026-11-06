"use client"

import Image from "next/image"
import { useState } from "react"
import { ADS, type AdPlatform } from "@/data/ads"

const PLATFORM_BG: Record<AdPlatform, string> = { "Meta Ads": "#FFDCC7", "TikTok Ads": "#E4DEFF", "Google Ads": "#D6EBFF" }

/** Galería de anuncios creados por el equipo, filtrable por plataforma. */
export function AdsShowcase() {
  const platforms = Array.from(new Set(ADS.map((a) => a.platform)))
  const [cur, setCur] = useState<"all" | AdPlatform>("all")
  if (ADS.length === 0) return null
  const list = ADS.filter((a) => cur === "all" || a.platform === cur)
  const examples = ADS.every((a) => a.example)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 720 }}>
          <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>ANUNCIOS · HECHOS POR NOSOTROS</span>
          <h2 style={{ fontSize: "clamp(32px, 3.8vw, 48px)" }}>Anuncios que creamos para Meta, TikTok y Google</h2>
          <p style={{ margin: 0, fontSize: 17 }}>Guion, diseño, edición y textos. Mostramos el sector y la plataforma, nunca el nombre del cliente.</p>
          {examples && <span className="ck-mono" style={{ alignSelf: "flex-start", fontSize: 12, background: "#FFDCC7", border: "1.5px solid #010E25", borderRadius: 8, padding: "6px 10px" }}>PIEZAS DE EJEMPLO · PRONTO, ANUNCIOS REALES</span>}
        </div>
        {platforms.length > 1 && (
          <div role="group" aria-label="Filtrar anuncios por plataforma" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(["all", ...platforms] as const).map((p) => (
              <button key={p} type="button" className="ck-chip" aria-pressed={cur === p} onClick={() => setCur(p)}>{p === "all" ? "Todos" : p}</button>
            ))}
          </div>
        )}
      </div>
      <div className="ck-ads-grid">
        {list.map((a, i) => (
          <figure key={a.id} className={`ck-ad ck-tilt ${i % 2 ? "ck-tilt-r" : "ck-tilt-l"}`} style={{ margin: 0 }}>
            <div className="ck-ad-media" style={{ aspectRatio: a.ratio }}>
              {a.kind === "video" ? (
                <video autoPlay muted loop playsInline preload="metadata" poster={a.poster} aria-label={`Anuncio de ${a.sector} en ${a.platform}`}>
                  <source src={a.src} />
                </video>
              ) : (
                <Image src={a.src} alt={`Anuncio de ${a.sector} en ${a.platform} (${a.format})`} fill sizes="(max-width: 760px) 50vw, 300px" style={{ objectFit: "cover" }} />
              )}
            </div>
            <figcaption style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px 4px 4px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <span className="ck-tag" style={{ background: PLATFORM_BG[a.platform] }}>{a.platform.toUpperCase()}</span>
                <span className="ck-tag">{a.format.toUpperCase()}</span>
                {a.example && <span className="ck-tag" style={{ background: "#FFF8F0", borderStyle: "dashed" }}>EJEMPLO</span>}
              </div>
              <strong style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>{a.sector}</strong>
              {a.note && <span style={{ fontSize: 15, color: "#5A6178" }}>{a.note}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
