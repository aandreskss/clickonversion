// Crea el producto "SyncLead" y sus 6 planes (3 planes × mensual/anual) en PayPal.
// Uso:  node --env-file=.env.local scripts/create-synclead-paypal-plans.mjs
// Copia las líneas PAYPAL_PLAN_SYNCLEAD_* que imprime al final en tu .env.local (y en Vercel).
// Si cambias precios en src/data/synclead-plans.ts, actualiza PLANS aquí y vuelve a correrlo.

const PLANS = [
  { id: "inicial", name: "Inicial", monthly: 29, annual: 290 },
  { id: "equipo", name: "Equipo", monthly: 69, annual: 690 },
  { id: "agencia", name: "Agencia", monthly: 149, annual: 1490 },
]

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE = "sandbox" } = process.env
if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.error("Faltan PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET en el entorno.")
  process.exit(1)
}
const BASE = PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

async function api(path, body, token) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`)
  return res.json()
}

const auth = await fetch(BASE + "/v1/oauth2/token", {
  method: "POST",
  headers: { Authorization: "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials",
})
if (!auth.ok) throw new Error("PayPal auth: " + (await auth.text()))
const { access_token: token } = await auth.json()

const product = await api("/v1/catalogs/products", { name: "SyncLead", description: "CRM para leads de Meta Ads con WhatsApp y agentes de IA", type: "SERVICE", category: "SOFTWARE" }, token)
console.log(`Producto creado (${PAYPAL_MODE}): ${product.id}\n`)

const lines = []
for (const p of PLANS) {
  for (const [billing, price, unit] of [["MENSUAL", p.monthly, "MONTH"], ["ANUAL", p.annual, "YEAR"]]) {
    const plan = await api("/v1/billing/plans", {
      product_id: product.id,
      name: `SyncLead ${p.name} · ${billing.toLowerCase()}`,
      status: "ACTIVE",
      billing_cycles: [{ frequency: { interval_unit: unit, interval_count: 1 }, tenure_type: "REGULAR", sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: price.toFixed(2), currency_code: "USD" } } }],
      payment_preferences: { auto_bill_outstanding: true, payment_failure_threshold: 2 },
    }, token)
    lines.push(`PAYPAL_PLAN_SYNCLEAD_${p.id.toUpperCase()}_${billing}=${plan.id}`)
  }
}
console.log("Agrega estas líneas a .env.local y a Vercel:\n\n" + lines.join("\n"))
