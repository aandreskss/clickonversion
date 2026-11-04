import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { getSyncLeadSubscription } from "@/components/apps/synclead-actions"
import { SYNCLEAD_PLANS } from "@/data/synclead-plans"
import { sendEmailWithAdminCopy } from "@/lib/email/service"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = { title: "¡Gracias por suscribirte a SyncLead!", robots: { index: false, follow: false } }

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ""
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string)

export default async function SyncLeadThanksPage({ params, searchParams }: Props) {
  const { slug } = await params
  if (slug !== "synclead") notFound()
  const sp = await searchParams
  const subId = one(sp.subscription_id)
  const plan = SYNCLEAD_PLANS.find((p) => p.id === one(sp.plan))
  const billing = one(sp.billing) === "anual" ? "anual" : "mensual"

  let ok = false
  let email = ""
  let name = ""
  if (subId) {
    try {
      const sub = await getSyncLeadSubscription(subId)
      ok = !!sub && ["ACTIVE", "APPROVED", "APPROVAL_PENDING"].includes(sub.status)
      email = sub?.subscriber?.email_address ?? ""
      name = [sub?.subscriber?.name?.given_name, sub?.subscriber?.name?.surname].filter(Boolean).join(" ")
      if (ok && email) {
        const planTxt = plan ? `${plan.name} (${billing})` : "—"
        await sendEmailWithAdminCopy({
          clientEmail: email,
          subject: "Tu suscripción a SyncLead está lista",
          html: `<p>Hola ${esc(name || "")},</p><p>Gracias por suscribirte a <strong>SyncLead ${esc(planTxt)}</strong>. Hoy mismo te escribimos para activar tu cuenta y conectar tu Meta Ads y tu WhatsApp contigo.</p><p>— Arnaldo, Abisai y Yoli · ClicKonversion</p>`,
          adminSubject: `[SyncLead] Nueva suscripción: ${planTxt}`,
          adminHtml: `<p>Nueva suscripción de SyncLead.</p><ul><li>Plan: ${esc(planTxt)}</li><li>Nombre: ${esc(name)}</li><li>Correo: ${esc(email)}</li><li>Empresa: ${esc(one(sp.company))}</li><li>WhatsApp: ${esc(one(sp.wa))}</li><li>ID PayPal: ${esc(subId)}</li></ul><p>Activa la cuenta en SyncLead y escríbele hoy.</p>`,
        })
      }
    } catch (e) {
      console.error("[synclead] thank-you check failed", e)
    }
  }

  return (
    <MarketingLayout active="apps" whatsapp={{ message: "¡Gracias por suscribirte! Si quieres adelantar la activación, escríbenos ahora.", replies: ["Quiero activar mi cuenta", "Tengo una duda"] }}>
      <section className="ck-dots" style={{ padding: "80px 0 120px" }}>
        <div className="ck-wrap" style={{ maxWidth: 760, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22 }}>
          <span style={{ width: 96, height: 96, borderRadius: "50%", background: ok ? "#D3F2E3" : "#FFDCC7", border: "1.5px solid #010E25", display: "flex", alignItems: "center", justifyContent: "center", animation: "ck-popin .5s cubic-bezier(.2,1.6,.4,1) both" }}>
            {ok
              ? <svg aria-hidden="true" viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="#010E25" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
              : <span style={{ fontSize: 40, fontWeight: 700 }}>!</span>}
          </span>
          {ok ? (
            <>
              <h1 style={{ fontSize: "clamp(40px, 5vw, 68px)" }}>¡Listo{name ? `, ${name.split(" ")[0]}` : ""}! Ya eres parte de <span style={{ color: "#FE5C02" }}>SyncLead</span>.</h1>
              <p style={{ fontSize: 20, color: "#3A4158" }}>Tu suscripción {plan ? <strong>{plan.name} ({billing})</strong> : null} quedó registrada en PayPal. Hoy mismo te escribimos{email ? <> a <strong>{email}</strong></> : null} para activar tu cuenta y conectar tu Meta Ads y tu WhatsApp contigo.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: "clamp(36px, 4.6vw, 60px)" }}>No pudimos confirmar tu suscripción</h1>
              <p style={{ fontSize: 19, color: "#3A4158" }}>Si PayPal ya te cobró, no te preocupes: escríbenos y lo revisamos contigo ahora mismo.</p>
            </>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
            <a className="ck-btn ck-btn-wa" href={waLink(`Hola, me acabo de suscribir a SyncLead${plan ? ` (plan ${plan.name})` : ""}`)} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Escribirnos por WhatsApp</a>
            <Link className="ck-btn ck-btn-line" href="/apps/synclead">Volver a SyncLead</Link>
          </div>
          <span className="ck-hand" style={{ fontSize: 26, color: "#C94400", transform: "rotate(-3deg)" }}>te escribimos hoy, prometido</span>
        </div>
      </section>
    </MarketingLayout>
  )
}
