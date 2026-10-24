"use client"

import { useState } from "react"

export function ResourcesNewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return
    setStatus("loading")
    // Simulate — no backend endpoint yet for newsletter
    await new Promise<void>((resolve) => setTimeout(resolve, 600))
    setStatus("success")
  }

  if (status === "success") {
    return (
      <p
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#202124",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        }}
      >
        ¡Suscrito! Te escribimos cuando publicamos algo nuevo.
      </p>
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
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@empresa.com"
        required
        style={{
          padding: "14px 20px",
          borderRadius: 999,
          border: "1.5px solid rgba(32,33,36,.25)",
          fontSize: 15,
          color: "#202124",
          background: "#fff",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
          outline: "none",
          minWidth: 240,
        }}
      />
      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        style={{
          padding: "14px 28px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 700,
          cursor: isValid && status !== "loading" ? "pointer" : "not-allowed",
          background: isValid && status !== "loading" ? "#202124" : "rgba(32,33,36,.3)",
          color: "#fff",
          border: "none",
          transition: "opacity 0.2s",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
          flexShrink: 0,
        }}
      >
        {status === "loading" ? "..." : "Suscribirme →"}
      </button>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>
    </form>
  )
}
