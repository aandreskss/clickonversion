"use server"

interface InvoiceItem {
  name: string
  description: string
  quantity: number
  unitPrice: number
}

interface CreatePayPalInvoiceInput {
  clientEmail: string
  clientName: string
  items: InvoiceItem[]
  dueDate: string
  notes: string
  currency: string
}

interface PayPalInvoiceResult {
  invoiceId?: string
  invoiceUrl?: string
  dashboardUrl?: string
  error?: string
}

// ── PayPal OAuth Token ────────────────────────────────────────────────────────

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET son requeridos.")
  }

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com"

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
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

// ── Create PayPal Invoice ─────────────────────────────────────────────────────

export async function createPayPalInvoiceAction(
  input: CreatePayPalInvoiceInput
): Promise<PayPalInvoiceResult> {
  try {
    const { clientEmail, clientName, items, dueDate, notes, currency } = input

    if (!clientEmail || !clientName || !items.length) {
      return { error: "Email, nombre e items son requeridos." }
    }

    const token = await getPayPalAccessToken()

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com"

    const lineItems = items.map((item) => ({
      name: item.name,
      description: item.description || undefined,
      quantity: String(item.quantity),
      unit_amount: {
        currency_code: currency,
        value: item.unitPrice.toFixed(2),
      },
    }))

    const invoicePayload = {
      detail: {
        invoice_date: new Date().toISOString().split("T")[0],
        currency_code: currency,
        note: notes || undefined,
        payment_term: {
          term_type: "DUE_ON_DATE_SPECIFIED",
          due_date: dueDate,
        },
      },
      invoicer: {
        name: { full_name: "ClicKonversion" },
        email_address: process.env.PAYPAL_INVOICER_EMAIL ?? "arnaldo@clickonversion.com",
      },
      primary_recipients: [
        {
          billing_info: {
            name: { full_name: clientName },
            email_address: clientEmail,
          },
        },
      ],
      items: lineItems,
    }

    // Create the invoice
    const createRes = await fetch(`${baseUrl}/v2/invoicing/invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(invoicePayload),
    })

    if (!createRes.ok) {
      const text = await createRes.text()
      return { error: `Error al crear la factura PayPal: ${text}` }
    }

    const createdData = (await createRes.json()) as {
      id: string
      detail?: { metadata?: { recipient_view_url?: string }; invoice_number?: string }
      links?: Array<{ rel: string; href: string }>
    }

    const invoiceId = createdData.id

    // Send the invoice
    const sendRes = await fetch(`${baseUrl}/v2/invoicing/invoices/${invoiceId}/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ send_to_recipient: true }),
    })

    if (!sendRes.ok) {
      const text = await sendRes.text()
      return {
        invoiceId,
        error: `Factura creada pero no enviada: ${text}`,
      }
    }

    // Fetch invoice detail to get confirmed payer-view URL
    let invoiceUrl: string | undefined
    try {
      const detailRes = await fetch(`${baseUrl}/v2/invoicing/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (detailRes.ok) {
        const detail = (await detailRes.json()) as {
          links?: Array<{ rel: string; href: string }>
        }
        invoiceUrl = detail.links?.find((l) => l.rel === "payer-view")?.href
      }
    } catch {
      // fallback: try links from create response
      const links = createdData.links ?? []
      invoiceUrl = links.find((l) => l.rel === "payer-view")?.href
    }

    // Always include admin dashboard link
    const dashboardUrl = `https://www.paypal.com/invoice/details/${invoiceId}`

    return { invoiceId, invoiceUrl, dashboardUrl }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}
