"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import type { GalleryShot } from "@/data/portfolio-gallery"

export function ProjectGallery({ shots, name }: { shots: GalleryShot[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const desktop = shots.filter((s) => s.device === "desktop")
  const mobile = shots.filter((s) => s.device === "mobile")
  const close = useCallback(() => setOpen(null), [])
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + shots.length) % shots.length)), [shots.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") move(1)
      if (e.key === "ArrowLeft") move(-1)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [open, close, move])

  if (!shots.length) return null
  const cur = open === null ? null : shots[open]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>GALERÍA</span>
          <h2 style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}>Así se ve, de arriba a abajo</h2>
        </div>
        <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>{shots.length} CAPTURAS · TOCA PARA AMPLIAR</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>ESCRITORIO</span>
        <div className="ck-gal-desk">
          {desktop.map((s) => {
            const i = shots.indexOf(s)
            const strip = s.h / s.w < 0.3
            return (
              <button key={s.src} type="button" className={`ck-gal-item${strip ? " is-strip" : ""}`} onClick={() => setOpen(i)} aria-label={`Ampliar: ${s.label}`}>
                <span className="ck-gal-frame" style={{ aspectRatio: strip ? `${s.w} / ${s.h}` : "16 / 10" }}>
                  <Image src={s.src} alt={`${name}: ${s.label}`} fill sizes={strip ? "(max-width: 900px) 100vw, 1200px" : "(max-width: 760px) 100vw, 600px"} style={{ objectFit: "cover", objectPosition: "top" }} />
                </span>
                <span className="ck-gal-label">{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {mobile.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>VERSIÓN MÓVIL</span>
          <div className="ck-gal-mob">
            {mobile.map((s) => {
              const i = shots.indexOf(s)
              return (
                <button key={s.src} type="button" className="ck-gal-item" onClick={() => setOpen(i)} aria-label={`Ampliar: ${s.label}`}>
                  <span className="ck-gal-phone">
                    <Image src={s.src} alt={`${name}: ${s.label}`} fill sizes="240px" style={{ objectFit: "cover", objectPosition: "top" }} />
                  </span>
                  <span className="ck-gal-label">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {cur && (
        <div className="ck-gal-lightbox" role="dialog" aria-modal="true" aria-label={cur.label} onClick={close}>
          <div className="ck-gal-lb-inner" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, color: "#fff" }}>
              <span className="ck-mono" style={{ fontSize: 13 }}>{cur.label} · {open! + 1}/{shots.length}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="ck-gal-nav" onClick={() => move(-1)} aria-label="Anterior">←</button>
                <button type="button" className="ck-gal-nav" onClick={() => move(1)} aria-label="Siguiente">→</button>
                <button type="button" className="ck-gal-nav" onClick={close} aria-label="Cerrar">✕</button>
              </div>
            </div>
            <div className={`ck-gal-lb-img${cur.device === "mobile" ? " is-mobile" : ""}`}>
              <Image src={cur.src} alt={`${name}: ${cur.label}`} width={cur.w} height={cur.h} sizes="(max-width: 900px) 100vw, 1200px" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
