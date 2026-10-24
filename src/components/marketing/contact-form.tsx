"use client"

import { useState } from "react"
import { sendContactAction } from "./contact-actions"

const NEEDS_OPTIONS = [
  "SEO",
  "Publicidad",
  "IA y automatización",
  "Soporte Meta",
  "SyncLead",
  "Aún no lo sé",
]

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const isValid = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  function toggleNeed(opt: string) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setStatus("loading")
    try {
      await sendContactAction({
        name: name.trim(),
        email: email.trim(),
        needs: selected,
        message: message.trim(),
      })
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          background: "#D9FA62",
          borderRadius: 24,
          padding: 40,
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mk-mono, monospace)",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#202124",
            opacity: 0.6,
            marginBottom: 12,
          }}
        >
          Mensaje enviado
        </p>
        <h3
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#202124",
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          ¡Gracias, {name}!
        </h3>
        <p style={{ fontSize: 16, color: "#3A3B40", lineHeight: 1.6 }}>
          Hemos recibido tu mensaje. Te responderemos en las próximas 24-48 horas hábiles.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
      }}
    >
      {/* Name + Email */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="contact-form-row">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="contact-name" style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>
            Nombre
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label htmlFor="contact-email" style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.com"
            required
            style={inputStyle}
          />
        </div>
      </div>

      {/* Needs multi-select */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#202124", marginBottom: 10 }}>
          ¿Qué necesitas?
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {NEEDS_OPTIONS.map((opt) => {
            const active = selected.includes(opt)
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleNeed(opt)}
                aria-pressed={active}
                style={{
                  padding: "7px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: active ? "#D9FA62" : "transparent",
                  color: "#202124",
                  border: "1.5px solid #202124",
                  fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      {/* Message */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label htmlFor="contact-message" style={{ fontSize: 13, fontWeight: 600, color: "#202124" }}>
          Mensaje
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntanos qué estás buscando..."
          style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
        />
      </div>

      {status === "error" && (
        <p style={{ fontSize: 13, color: "#FF6B2C" }}>
          Hubo un error al enviar. Escríbenos directamente a hello@clickonversion.com
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        style={{
          padding: "14px 28px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          cursor: isValid && status !== "loading" ? "pointer" : "not-allowed",
          background: isValid && status !== "loading" ? "#202124" : "#C0C0C0",
          color: "#fff",
          border: "none",
          transition: "all 0.2s",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
          alignSelf: "flex-start",
        }}
      >
        {status === "loading" ? "Enviando..." : "Enviar mensaje ↗"}
      </button>

      <style>{`
        @media (max-width: 640px) {
          .contact-form-row {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1.5px solid #E2DED3",
  fontSize: 15,
  color: "#202124",
  background: "#fff",
  fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
  outline: "none",
  width: "100%",
}
