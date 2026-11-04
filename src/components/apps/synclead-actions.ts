"use server"

import { getServerEnv } from "@/lib/env"
import { SYNCLEAD_PLANS, paypalPlanEnvKey, type SyncLeadBilling, type SyncLeadPlanId } from "@/data/synclead-plans"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

function paypalBase() {
  return getServerEnv().paypalMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
}

async function paypalToken(): Promise<string> {
  const { paypalClientId, paypalClientSecret } = getServerEnv()
  if (!paypalClientId || !paypalClientSecret) throw new Error("PayPal no está configurado")
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`PayPal auth: ${await res.text()}`)
  return ((await res.json()) as { access_token: string }).access_token
}

export interface SubscribeInput {
  plan: SyncLeadPlanId
  billing: SyncLeadBilling
  name: string
  email: string
  company?: string
  whatsapp?: string
}

export type SubscribeResult = { approveUrl: string } | { error: string }

/** Crea una suscripción de PayPal para un plan de SyncLead y devuelve la URL de aprobación. */
export async function createSyncLeadSubscriptionAction(input: SubscribeInput): Promise<SubscribeResult> {
  const plan = SYNCLEAD_PLANS.find((p) => p.id === input.plan)
  if (!plan || (input.billing !== "mensual" && input.billing !== "anual")) return { error: "Plan no válido." }
  const name = input.name?.trim() ?? ""
  const email = input.email?.trim() ?? ""
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Escribe tu nombre y un correo válido." }

  // El precio lo define el plan creado en PayPal (no el navegador).
  const planId = process.env[paypalPlanEnvKey(plan.id, input.billing)]
  if (!planId) return { error: "Este plan todavía no está activo para pagos en línea. Escríbenos por WhatsApp y lo activamos contigo." }

  try {
    const [given, ...rest] = name.split(" ")
    const res = await fetch(`${paypalBase()}/v1/billing/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await paypalToken()}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: { name: { given_name: given.slice(0, 140), surname: (rest.join(" ") || given).slice(0, 140) }, email_address: email },
        application_context: {
          brand_name: "ClicKonversion · SyncLead",
          locale: "es-ES",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${SITE_URL}/apps/synclead/gracias?plan=${plan.id}&billing=${input.billing}&company=${encodeURIComponent((input.company ?? "").slice(0, 80))}&wa=${encodeURIComponent((input.whatsapp ?? "").slice(0, 30))}`,
          cancel_url: `${SITE_URL}/apps/synclead?cancelado=1#planes`,
        },
      }),
      cache: "no-store",
    })
    if (!res.ok) {
      console.error("[synclead] PayPal subscription error", await res.text())
      return { error: "No pudimos iniciar el pago con PayPal. Intenta de nuevo o escríbenos por WhatsApp." }
    }
    const sub = (await res.json()) as { links?: { rel: string; href: string }[] }
    const approve = sub.links?.find((l) => l.rel === "approve")?.href
    return approve ? { approveUrl: approve } : { error: "PayPal no devolvió el enlace de pago." }
  } catch (e) {
    console.error("[synclead] subscribe failed", e)
    return { error: "No pudimos conectar con PayPal. Intenta de nuevo en unos minutos." }
  }
}

/** Consulta una suscripción (para la página de gracias). */
export async function getSyncLeadSubscription(id: string) {
  const res = await fetch(`${paypalBase()}/v1/billing/subscriptions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${await paypalToken()}` },
    cache: "no-store",
  })
  if (!res.ok) return null
  return (await res.json()) as {
    id: string
    status: string
    plan_id: string
    subscriber?: { email_address?: string; name?: { given_name?: string; surname?: string } }
  }
}
