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

export interface PayPalInvoiceSummary {
  id: string
  status: string
  invoiceNumber?: string
  invoiceDate?: string
  dueDate?: string
  recipientName?: string
  recipientEmail?: string
  amount?: string
  currency?: string
  payerViewUrl?: string
  dashboardUrl: string
}

export interface ListPayPalInvoicesResult {
  invoices?: PayPalInvoiceSummary[]
  totalItems?: number
  error?: string
}

// ── PayPal base URL ───────────────────────────────────────────────────────────

function paypalBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"
}

// ── PayPal OAuth Token ────────────────────────────────────────────────────────

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET son requeridos.")
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
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
    const baseUrl = paypalBaseUrl()

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
      // Use business_name (not name.full_name) so PayPal renders the company
      // profile set up in the account, not a personal name.
      invoicer: {
        business_name: process.env.PAYPAL_BUSINESS_NAME ?? "ClicKonversion",
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
      links?: Array<{ rel: string; href: string }>
    }

    const invoiceId = createdData.id

    // Send the invoice — send_to_invoicer gives admin a copy too
    const sendRes = await fetch(`${baseUrl}/v2/invoicing/invoices/${invoiceId}/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ send_to_recipient: true, send_to_invoicer: true }),
    })

    if (!sendRes.ok) {
      const text = await sendRes.text()
      return {
        invoiceId,
        dashboardUrl: `https://www.paypal.com/invoice/details/${invoiceId}`,
        error: `Factura creada pero no enviada: ${text}`,
      }
    }

    // Fetch invoice detail to get payer-view URL after send
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
      invoiceUrl = createdData.links?.find((l) => l.rel === "payer-view")?.href
    }

    return {
      invoiceId,
      invoiceUrl,
      dashboardUrl: `https://www.paypal.com/invoice/details/${invoiceId}`,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}

// ── List PayPal Invoices ──────────────────────────────────────────────────────

export async function listPayPalInvoicesAction(
  page = 1,
  pageSize = 25
): Promise<ListPayPalInvoicesResult> {
  try {
    const token = await getPayPalAccessToken()
    const baseUrl = paypalBaseUrl()

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
      total_required: "true",
    })

    const res = await fetch(`${baseUrl}/v2/invoicing/invoices?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const text = await res.text()
      return { error: `Error al obtener facturas: ${text}` }
    }

    const data = (await res.json()) as {
      total_items?: number
      items?: Array<{
        id: string
        status: string
        detail?: {
          invoice_number?: string
          invoice_date?: string
          payment_term?: { due_date?: string }
          currency_code?: string
        }
        primary_recipients?: Array<{
          billing_info?: {
            name?: { full_name?: string }
            email_address?: string
          }
        }>
        amount?: { currency_code?: string; value?: string }
        links?: Array<{ rel: string; href: string }>
      }>
    }

    const invoices: PayPalInvoiceSummary[] = (data.items ?? []).map((inv) => {
      const recipient = inv.primary_recipients?.[0]?.billing_info
      return {
        id: inv.id,
        status: inv.status,
        invoiceNumber: inv.detail?.invoice_number,
        invoiceDate: inv.detail?.invoice_date,
        dueDate: inv.detail?.payment_term?.due_date,
        recipientName: recipient?.name?.full_name,
        recipientEmail: recipient?.email_address,
        amount: inv.amount?.value,
        currency: inv.amount?.currency_code ?? inv.detail?.currency_code,
        payerViewUrl: inv.links?.find((l) => l.rel === "payer-view")?.href,
        dashboardUrl: `https://www.paypal.com/invoice/details/${inv.id}`,
      }
    })

    return { invoices, totalItems: data.total_items }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}
