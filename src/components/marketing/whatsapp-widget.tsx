"use client"

import { useState, useEffect } from "react"
import { LogoSymbol } from "@/components/ui/logo-wordmark"
import { waLink } from "@/lib/whatsapp"

export interface WhatsAppWidgetProps {
  message?: string
  replies?: string[]
}

const DEFAULT_MESSAGE = "¡Hola! Somos Arnaldo, Abisai y Yoli. ¿Te ayudamos a elegir por dónde empezar?"
const DEFAULT_REPLIES = ["Quiero más clientes", "Quiero ver precios", "Tengo una duda"]
const DISMISSED_KEY = "ck_wa_dismissed"

/** Botón flotante de WhatsApp con un chat que "escribe" y respuestas rápidas. */
export function WhatsAppWidget({ message = DEFAULT_MESSAGE, replies = DEFAULT_REPLIES }: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return
    const t = setTimeout(() => setOpen(true), 5000)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setOpen(false)
    localStorage.setItem(DISMISSED_KEY, "1")
  }

  return (
    <div className="ck-wa-wrap">
      {open && (
        <div className="ck-wa-pop" role="dialog" aria-label="Mensaje de ClicKonversion">
          <div className="ck-wa-head">
            <span style={{ width: 38, height: 38, borderRadius: "50%", background: "#FE5C02", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <LogoSymbol size={26} inverted />
            </span>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
              <strong style={{ fontWeight: 600, fontSize: 15 }}>ClicKonversion</strong>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(255,255,255,.8)" }}>
                <span className="ck-dot" style={{ width: 7, height: 7 }} />en línea · te responde una persona
              </span>
            </div>
            <button className="ck-wa-x" type="button" aria-label="Cerrar mensaje" onClick={dismiss}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="ck-wa-body">
            <div className="ck-wa-typing ck-typing" aria-hidden="true"><span /><span /><span /></div>
            <div className="ck-wa-msg">{message}</div>
            <div className="ck-wa-qrs">
              {replies.map((r) => (
                <a key={r} className="ck-wa-qr" href={waLink(`Hola, ${r.charAt(0).toLowerCase()}${r.slice(1)}`)} target="_blank" rel="noopener noreferrer">{r}</a>
              ))}
            </div>
          </div>
        </div>
      )}
      <a className="ck-wa-float" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <span className="ck-wa-label" aria-hidden="true">¿Hablamos por WhatsApp?</span>
        <span className="ck-wa-btn">
          <span className="ck-wa-wig">
            <svg aria-hidden="true" viewBox="0 0 24 24" width={32} height={32} style={{ overflow: "visible" }}>
              <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" fill="none" stroke="#010E25" strokeWidth={1.8} strokeLinejoin="round" />
              <path fill="#010E25" d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.5.8 1.3 1.6 2.2 2.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.3.1.4.2.4.4 0 .5-.2 1.2-.7 1.5-.5.4-1.3.6-2.3.3-1.6-.5-3.6-2.2-4.5-3.8-.7-1.2-.6-2.2-.3-2.8z" />
            </svg>
          </span>
          {open && <span className="ck-wa-badge" aria-hidden="true">1</span>}
        </span>
      </a>
    </div>
  )
}
