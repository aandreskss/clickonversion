"use client"

import { useState } from "react"

export function AppsWaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setStatus("loading")
    try {
      const res = await fetch("/api/apps/synclead/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          background: "#D9FA62",
          borderRadius: 16,
          padding: "16px 24px",
          display: "inline-block",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: "#202124" }}>
          ¡Ya estás en la lista! Te avisamos cuando esté listo.
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
        flexWrap: "wrap",
        gap: 10,
        fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label htmlFor="waitlist-email" className="sr-only">
          Email
        </label>
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@empresa.com"
          required
          style={{
            padding: "14px 20px",
            borderRadius: 999,
            border: "1.5px solid rgba(255,255,255,.2)",
            fontSize: 15,
            color: "#fff",
            background: "rgba(255,255,255,.1)",
            fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
            outline: "none",
            minWidth: 260,
          }}
        />
        {status === "error" && (
          <p style={{ fontSize: 12, color: "#FF6B2C", paddingLeft: 8 }}>
            Error al registrarse. Intenta de nuevo.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        style={{
          padding: "14px 28px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          cursor: isValid && status !== "loading" ? "pointer" : "not-allowed",
          background: isValid && status !== "loading" ? "#D9FA62" : "rgba(217,250,98,.4)",
          color: "#202124",
          border: "none",
          transition: "opacity 0.2s",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
          flexShrink: 0,
        }}
      >
        {status === "loading" ? "Registrando..." : "Unirme a la lista →"}
      </button>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>
    </form>
  )
}
