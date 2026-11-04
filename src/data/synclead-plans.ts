// Planes de suscripción de SyncLead.
// ⚠️ Precios y límites PROPUESTOS: ajústalos antes de lanzar y vuelve a correr
// `node --env-file=.env.local scripts/create-synclead-paypal-plans.mjs` para crear los planes en PayPal.

export type SyncLeadBilling = "mensual" | "anual"
export type SyncLeadPlanId = "inicial" | "equipo" | "agencia"

export interface SyncLeadPlan {
  id: SyncLeadPlanId
  name: string
  pitch: string
  monthly: number
  /** Precio anual total (2 meses gratis = mensual × 10) */
  annual: number
  hot?: boolean
  limits: string[]
  features: string[]
}

export const SYNCLEAD_PLANS: SyncLeadPlan[] = [
  {
    id: "inicial",
    name: "Inicial",
    pitch: "Para negocios que reciben leads de Meta Ads y quieren dejar de perderlos.",
    monthly: 29,
    annual: 290,
    limits: ["2 usuarios", "1 cuenta de Meta Ads", "1 número de WhatsApp", "Hasta 500 leads al mes"],
    features: ["Sincronización de leads en tiempo real", "Pipeline visual (kanban)", "Importación CSV sin duplicados", "API de conversiones de Meta"],
  },
  {
    id: "equipo",
    name: "Equipo",
    pitch: "Para equipos de ventas que atienden por WhatsApp y quieren calificar mejor.",
    monthly: 69,
    annual: 690,
    hot: true,
    limits: ["5 usuarios", "3 cuentas de Meta Ads", "1 número de WhatsApp", "Hasta 2.000 leads al mes"],
    features: ["Todo lo del plan Inicial", "WhatsApp integrado en el CRM", "1 agente de IA que responde 24/7", "Calificación automática de leads", "Roles y registro de actividad"],
  },
  {
    id: "agencia",
    name: "Agencia",
    pitch: "Para agencias y negocios con varias marcas o sedes en una sola cuenta.",
    monthly: 149,
    annual: 1490,
    limits: ["15 usuarios", "10 empresas o clientes", "3 números de WhatsApp", "Hasta 10.000 leads al mes"],
    features: ["Todo lo del plan Equipo", "Multiempresa: un panel por cliente", "Agentes de IA ilimitados", "Soporte prioritario por WhatsApp"],
  },
]

/** Nombre de la variable de entorno con el ID del plan de PayPal. */
export function paypalPlanEnvKey(plan: SyncLeadPlanId, billing: SyncLeadBilling) {
  return `PAYPAL_PLAN_SYNCLEAD_${plan.toUpperCase()}_${billing === "anual" ? "ANUAL" : "MENSUAL"}`
}
