"use client"

import { useState, useTransition } from "react"
import { SYNCLEAD_PLANS, type SyncLeadBilling, type SyncLeadPlan } from "@/data/synclead-plans"
import { createSyncLeadSubscriptionAction } from "./synclead-actions"
import { waLink } from "@/lib/whatsapp"

const fmt = (n: number) => "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

export function SyncLeadPricing({ cancelled = false }: { cancelled?: boolean }) {
  const [billing, setBilling] = useState<SyncLeadBilling>("mensual")
  const [plan, setPlan] = useState<SyncLeadPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!plan) return
    const f = new FormData(e.currentTarget)
    setError(null)
    start(async () => {
      const r = await createSyncLeadSubscriptionAction({
        plan: plan.id,
        billing,
        name: String(f.get("name") ?? ""),
        email: String(f.get("email") ?? ""),
        company: String(f.get("company") ?? ""),
        whatsapp: String(f.get("whatsapp") ?? ""),
      })
      if ("approveUrl" in r) window.location.href = r.approveUrl
      else setError(r.error)
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {cancelled && (
        <div role="status" style={{ alignSelf: "center", background: "#FFDCC7", border: "1.5px solid #010E25", borderRadius: 16, padding: "12px 18px", fontSize: 16 }}>
          Cancelaste el pago en PayPal. No se hizo ningún cobro. ¿Te ayudamos a elegir plan? <a href={waLink("Hola, tengo dudas con los planes de SyncLead")} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "#010E25" }}>Escríbenos →</a>
        </div>
      )}
      <div className="ck-seg" role="group" aria-label="Forma de cobro" style={{ alignSelf: "center" }}>
        <button type="button" aria-pressed={billing === "mensual"} onClick={() => setBilling("mensual")}>Mensual</button>
        <button type="button" aria-pressed={billing === "anual"} onClick={() => setBilling("anual")}>Anual <span style={{ background: "#FE5C02", color: "#010E25", borderRadius: 999, padding: "2px 8px", fontSize: 13, marginLeft: 4 }}>2 meses gratis</span></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 24, alignItems: "start", perspective: 1400 }}>
        {SYNCLEAD_PLANS.map((p) => {
          const dark = !!p.hot
          const price = billing === "anual" ? Math.round(p.annual / 12) : p.monthly
          return (
            <article key={p.id} className={`ck-plan${p.hot ? " ck-plan-hot" : ""}`} style={{ position: "relative", background: dark ? "#010E25" : "#fff", color: dark ? "#fff" : "#010E25", border: `1.5px solid ${dark ? "#FE5C02" : "#010E25"}`, borderRadius: 32, padding: 32, display: "flex", flexDirection: "column", gap: 22 }}>
              {p.hot && <span style={{ position: "absolute", top: -18, right: 28, background: "#FE5C02", color: "#010E25", border: "1.5px solid #010E25", borderRadius: 999, padding: "8px 16px", fontWeight: 700, fontSize: 14, transform: "rotate(3deg)" }}>el más elegido</span>}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="ck-tag" style={{ alignSelf: "flex-start", background: dark ? "#FFDCC7" : "#E4DEFF" }}>[{p.name.toUpperCase()}]</span>
                <h3 style={{ fontSize: 34, color: dark ? "#fff" : undefined }}>{p.name}</h3>
                <p style={{ fontSize: 16, color: dark ? "rgba(255,255,255,.78)" : "#5A6178" }}>{p.pitch}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 60, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{fmt(price)}</span>
                  <span className="ck-mono" style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.7)" : "#5A6178" }}>USD/mes</span>
                </div>
                <span style={{ fontSize: 14, color: dark ? "rgba(255,255,255,.7)" : "#5A6178" }}>
                  {billing === "anual" ? `${fmt(p.annual)} al año · ahorras ${fmt(p.monthly * 12 - p.annual)}` : "Cobro mensual · cancela cuando quieras"}
                </span>
              </div>
              <button type="button" className={`ck-btn ${dark ? "ck-btn-primary on-dark" : "ck-btn-dark"}`} onClick={() => { setPlan(p); setError(null) }}>Suscribirme a {p.name}</button>
              <div style={{ height: 1.5, background: dark ? "rgba(255,255,255,.14)" : "rgba(1,14,37,.1)" }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.limits.map((l) => <span key={l} className="ck-mono" style={{ fontSize: 12, padding: "5px 9px", borderRadius: 8, background: dark ? "rgba(255,255,255,.08)" : "#FFF8F0", border: `1px solid ${dark ? "rgba(255,255,255,.2)" : "rgba(1,14,37,.14)"}` }}>{l}</span>)}
              </div>
              <ul className={`ck-check${dark ? " on-dark" : ""}`} style={{ fontSize: 16 }}>
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </article>
          )
        })}
      </div>
      <p style={{ textAlign: "center", fontSize: 15, color: "#5A6178" }}>Precios en USD. Pago seguro con PayPal o tarjeta a través de PayPal. Sin permanencia: cancelas cuando quieras desde PayPal o escribiéndonos.</p>

      {plan && (
        <>
          <button type="button" aria-label="Cerrar" onClick={() => setPlan(null)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(1,14,37,.45)", border: 0, cursor: "pointer", width: "100%", height: "100%" }} />
          <div role="dialog" aria-modal="true" aria-label={`Suscripción SyncLead ${plan.name}`} style={{ position: "fixed", zIndex: 91, left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "min(480px, calc(100vw - 32px))", maxHeight: "calc(100vh - 32px)", overflowY: "auto", background: "#FFF8F0", border: "1.5px solid #010E25", borderRadius: 28, padding: 28, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 40px 80px -30px rgba(1,14,37,.6)", animation: "ck-popin .35s cubic-bezier(.2,1.4,.4,1) both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="ck-eyebrow">SyncLead · plan {plan.name}</span>
                <h3 style={{ fontSize: 28 }}>{billing === "anual" ? `${fmt(plan.annual)} al año` : `${fmt(plan.monthly)} al mes`}</h3>
              </div>
              <button type="button" className="ck-icon-btn" aria-label="Cerrar" onClick={() => setPlan(null)}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["name", "Tu nombre", "text", "name", true], ["email", "Correo", "email", "email", true], ["company", "Empresa (opcional)", "text", "organization", false], ["whatsapp", "WhatsApp (opcional)", "tel", "tel", false]].map(([n, l, t, ac, req]) => (
                <label key={n as string} style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, fontSize: 15 }}>
                  {l as string}
                  <input name={n as string} type={t as string} autoComplete={ac as string} required={req as boolean} style={{ minHeight: 50, padding: "0 16px", borderRadius: 14, border: "1.5px solid rgba(1,14,37,.2)", background: "#fff", font: "inherit", fontWeight: 400, fontSize: 16, color: "#010E25" }} />
                </label>
              ))}
              {error && <p role="alert" style={{ background: "#FFE1E1", borderRadius: 12, padding: "10px 14px", fontSize: 15, color: "#8A1F1F" }}>{error}</p>}
              <button type="submit" className="ck-pp" disabled={pending} aria-label="Continuar a PayPal" style={{ opacity: pending ? 0.6 : 1 }}>
                {pending ? <span style={{ fontStyle: "normal", fontSize: 16, color: "#010E25" }}>Abriendo PayPal…</span> : <><span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#009CDE" }}>Pal</span></>}
              </button>
              <span style={{ fontSize: 13, color: "#5A6178", textAlign: "center" }}>Te llevamos a PayPal para confirmar. Puedes pagar con tu cuenta o con tarjeta.</span>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
