"use server"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CheckoutItem {
  id: string
  name: string
  price: number
  type: "único" | "mensual"
}

export interface CreatePayPalOrderInput {
  items: CheckoutItem[]
  name: string
  email: string
  company?: string
  whatsapp?: string
}

export interface CreatePayPalOrderResult {
  approvalUrl?: string
  orderId?: string
  error?: string
}

export interface SendTransferConfirmationInput {
  items: CheckoutItem[]
  name: string
  email: string
  company?: string
  whatsapp?: string
  totalToday: number
}

export interface SendTransferConfirmationResult {
  success?: boolean
  error?: string
}

// ── PayPal base URL ──────────────────────────────────────────────────────────

function getPayPalBaseUrl(): string {
  return process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

// ── PayPal OAuth Token ───────────────────────────────────────────────────────

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET son requeridos.")
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal token error: ${text}`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

// ── Create PayPal Order ──────────────────────────────────────────────────────

export async function createPayPalOrderAction(
  input: CreatePayPalOrderInput
): Promise<CreatePayPalOrderResult> {
  try {
    const { items, name, email, company, whatsapp } = input

    if (!email || !name || items.length === 0) {
      return { error: "Nombre, email e items son requeridos." }
    }

    const token = await getPayPalAccessToken()
    const baseUrl = getPayPalBaseUrl()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clickonversion.com"

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0)

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: items.map((item) => ({
            name: item.name,
            description: item.type === "mensual" ? "Servicio mensual (primer mes)" : "Pago único",
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
          })),
          custom_id: JSON.stringify({
            customerName: name,
            customerEmail: email,
            company: company ?? "",
            whatsapp: whatsapp ?? "",
          }).slice(0, 127), // PayPal limit
        },
      ],
      application_context: {
        brand_name: "ClicKonversion",
        locale: "es-ES",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${siteUrl}/checkout/success`,
        cancel_url: `${siteUrl}/checkout/cancel`,
      },
    }

    const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(orderPayload),
    })

    if (!res.ok) {
      const text = await res.text()
      return { error: `Error al crear la orden PayPal: ${text}` }
    }

    const data = (await res.json()) as {
      id: string
      links?: Array<{ rel: string; href: string }>
    }

    const approvalUrl = data.links?.find((l) => l.rel === "approve")?.href

    if (!approvalUrl) {
      return { error: "No se obtuvo la URL de aprobación de PayPal." }
    }

    return { approvalUrl, orderId: data.id }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}

// ── Capture PayPal Order (used by success page) ──────────────────────────────

export interface CapturePayPalOrderResult {
  success?: boolean
  orderId?: string
  payerEmail?: string
  totalAmount?: string
  currency?: string
  error?: string
}

export async function capturePayPalOrderAction(
  orderId: string
): Promise<CapturePayPalOrderResult> {
  try {
    if (!orderId) return { error: "orderId es requerido." }

    const token = await getPayPalAccessToken()
    const baseUrl = getPayPalBaseUrl()

    const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      const text = await res.text()
      // Already captured is OK (idempotency)
      if (res.status === 422 && text.includes("ORDER_ALREADY_CAPTURED")) {
        return { success: true, orderId }
      }
      return { error: `Error al capturar el pago: ${text}` }
    }

    const data = (await res.json()) as {
      id: string
      status: string
      payer?: { email_address?: string }
      purchase_units?: Array<{
        payments?: {
          captures?: Array<{
            amount?: { value?: string; currency_code?: string }
          }>
        }
      }>
    }

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
    const totalAmount = capture?.amount?.value
    const currency = capture?.amount?.currency_code

    return {
      success: true,
      orderId: data.id,
      payerEmail: data.payer?.email_address,
      totalAmount,
      currency,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}

// ── Send Transfer Confirmation ────────────────────────────────────────────────

export async function sendTransferConfirmationAction(
  input: SendTransferConfirmationInput
): Promise<SendTransferConfirmationResult> {
  try {
    const { items, name, email, company, whatsapp, totalToday } = input

    if (!email || !name || items.length === 0) {
      return { error: "Nombre, email e items son requeridos." }
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return { error: "Servicio de email no disponible." }
    }

    const itemsList = items
      .map((i) => `• ${i.name} (${i.type}) — $${i.price.toFixed(2)} USD`)
      .join("\n")

    const adminEmailText = `
Nueva solicitud de pago por transferencia bancaria

Cliente: ${name}
Email: ${email}
${company ? `Empresa: ${company}` : ""}
${whatsapp ? `WhatsApp: ${whatsapp}` : ""}

Servicios solicitados:
${itemsList}

Total a cobrar hoy: $${totalToday.toFixed(2)} USD

---
El cliente recibirá instrucciones de transferencia por email.
Confirmar el pago antes de activar los servicios.
    `.trim()

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ClicKonversion <notifications@clickonversion.com>",
        to: ["arnaldo@clickonversion.com"],
        subject: `Nueva solicitud por transferencia — ${name} ($${totalToday.toFixed(2)} USD)`,
        text: adminEmailText,
      }),
    })

    if (!emailRes.ok) {
      const text = await emailRes.text()
      return { error: `Error al enviar el email: ${text}` }
    }

    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}
