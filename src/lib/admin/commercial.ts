import { createAdminClient } from "@/lib/supabase/server"
import type {
  AdminService,
  AdminServicePrice,
  AdminQuote,
  AdminClient,
} from "@/types/admin"
import type { BillingSubscription } from "@/types/portal"
import Stripe from "stripe"

// ── Services ──────────────────────────────────────────────────────────────────

export async function getServices(): Promise<AdminService[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pf_service_catalog")
    .select("*, pf_service_prices ( * )")
    .order("sort_order", { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => mapService(row as Record<string, unknown>))
}

export async function getService(id: string): Promise<AdminService | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pf_service_catalog")
    .select("*, pf_service_prices ( * )")
    .eq("id", id)
    .single()

  if (error || !data) return null

  return mapService(data as Record<string, unknown>)
}

export async function createService(data: {
  slug: string
  category: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  isPublished?: boolean
  sortOrder?: number
}): Promise<AdminService> {
  const supabase = createAdminClient()

  const { data: service, error } = await supabase
    .from("pf_service_catalog")
    .insert({
      slug: data.slug,
      category: data.category,
      name_en: data.nameEn,
      name_es: data.nameEs,
      description_en: data.descriptionEn,
      description_es: data.descriptionEs,
      is_published: data.isPublished ?? false,
      sort_order: data.sortOrder ?? 0,
    })
    .select("*, pf_service_prices ( * )")
    .single()

  if (error || !service) throw new Error(error?.message ?? "Failed to create service")

  return mapService(service as Record<string, unknown>)
}

export async function updateService(
  id: string,
  data: Partial<{
    slug: string
    category: string
    nameEn: string
    nameEs: string
    descriptionEn: string
    descriptionEs: string
    isPublished: boolean
    sortOrder: number
  }>
): Promise<void> {
  const supabase = createAdminClient()

  const update: Record<string, unknown> = {}
  if (data.slug !== undefined) update.slug = data.slug
  if (data.category !== undefined) update.category = data.category
  if (data.nameEn !== undefined) update.name_en = data.nameEn
  if (data.nameEs !== undefined) update.name_es = data.nameEs
  if (data.descriptionEn !== undefined) update.description_en = data.descriptionEn
  if (data.descriptionEs !== undefined) update.description_es = data.descriptionEs
  if (data.isPublished !== undefined) update.is_published = data.isPublished
  if (data.sortOrder !== undefined) update.sort_order = data.sortOrder

  if (Object.keys(update).length === 0) return

  update.updated_at = new Date().toISOString()

  const { error } = await supabase.from("pf_service_catalog").update(update).eq("id", id)

  if (error) throw new Error(error.message)
}

export async function createServicePrice(data: {
  serviceId: string
  nameEn: string
  nameEs: string
  priceType: string
  basePriceUsd?: number
  billingPeriodVal?: string
  stripePriceId?: string
  paypalPlanId?: string
  isActive?: boolean
  sortOrder?: number
}): Promise<AdminServicePrice> {
  const supabase = createAdminClient()

  const { data: price, error } = await supabase
    .from("pf_service_prices")
    .insert({
      service_id: data.serviceId,
      name_en: data.nameEn,
      name_es: data.nameEs,
      price_type: data.priceType,
      base_price_usd: data.basePriceUsd ?? null,
      billing_period_val: data.billingPeriodVal ?? null,
      stripe_price_id: data.stripePriceId ?? null,
      paypal_plan_id: data.paypalPlanId ?? null,
      is_active: data.isActive ?? true,
      sort_order: data.sortOrder ?? 0,
    })
    .select()
    .single()

  if (error || !price) throw new Error(error?.message ?? "Failed to create price")

  return mapServicePrice(price as Record<string, unknown>)
}

export async function updateServicePrice(
  priceId: string,
  data: Partial<{
    nameEn: string
    nameEs: string
    basePriceUsd: number
    isActive: boolean
    sortOrder: number
  }>,
  changedBy: string,
  changedByEmail: string
): Promise<void> {
  const supabase = createAdminClient()

  // Record price history before changing basePriceUsd
  if (data.basePriceUsd !== undefined) {
    const { data: current, error: fetchError } = await supabase
      .from("pf_service_prices")
      .select("base_price_usd, service_id")
      .eq("id", priceId)
      .single()

    if (fetchError || !current) throw new Error("Price record not found")

    const { error: historyError } = await supabase
      .from("pf_catalog_price_history")
      .insert({
        price_id: priceId,
        service_id: (current as Record<string, unknown>).service_id as string,
        old_price_usd: (current as Record<string, unknown>).base_price_usd as number,
        new_price_usd: data.basePriceUsd,
        changed_by: changedBy,
        changed_by_email: changedByEmail,
        changed_at: new Date().toISOString(),
      })

    if (historyError) {
      console.error("Failed to record price history:", historyError.message)
    }
  }

  const update: Record<string, unknown> = {}
  if (data.nameEn !== undefined) update.name_en = data.nameEn
  if (data.nameEs !== undefined) update.name_es = data.nameEs
  if (data.basePriceUsd !== undefined) update.base_price_usd = data.basePriceUsd
  if (data.isActive !== undefined) update.is_active = data.isActive
  if (data.sortOrder !== undefined) update.sort_order = data.sortOrder

  if (Object.keys(update).length === 0) return

  update.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from("pf_service_prices")
    .update(update)
    .eq("id", priceId)

  if (error) throw new Error(error.message)
}

// ── Quotes ────────────────────────────────────────────────────────────────────

export async function getQuotes(filters?: {
  status?: string
  page?: number
  pageSize?: number
}): Promise<{ items: AdminQuote[]; total: number; page: number }> {
  const supabase = createAdminClient()

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("pf_quotes")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  if (filters?.status) query = query.eq("status", filters.status)

  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  return {
    items: (data ?? []).map((row) => mapQuote(row as Record<string, unknown>)),
    total: count ?? 0,
    page,
  }
}

export async function getQuote(id: string): Promise<AdminQuote | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("pf_quotes").select("*").eq("id", id).single()

  if (error || !data) return null

  return mapQuote(data as Record<string, unknown>)
}

export async function createQuote(data: {
  clientEmail: string
  clientName: string
  clientCompany?: string
  servicesRequested: Array<{ serviceId: string; priceId?: string; notes?: string }>
  clientNotes?: string
  scope?: string
  proposedPriceUsd?: number
  expiresAt?: string
}): Promise<AdminQuote> {
  const supabase = createAdminClient()

  const { data: quote, error } = await supabase
    .from("pf_quotes")
    .insert({
      client_email: data.clientEmail,
      client_name: data.clientName,
      client_company: data.clientCompany ?? null,
      services_requested: data.servicesRequested,
      status: "draft",
      client_notes: data.clientNotes ?? null,
      scope: data.scope ?? null,
      proposed_price_usd: data.proposedPriceUsd ?? null,
      expires_at: data.expiresAt ?? null,
    })
    .select()
    .single()

  if (error || !quote) throw new Error(error?.message ?? "Failed to create quote")

  return mapQuote(quote as Record<string, unknown>)
}

export async function updateQuote(
  id: string,
  data: Partial<{
    status: string
    scope: string | null
    proposedPriceUsd: number | null
    proposalNotes: string | null
    paymentLink: string | null
    proposalSentAt: string | null
    acceptedAt: string | null
    expiresAt: string | null
  }>
): Promise<void> {
  const supabase = createAdminClient()

  const update: Record<string, unknown> = {}
  if (data.status !== undefined) update.status = data.status
  if (data.scope !== undefined) update.scope = data.scope
  if (data.proposedPriceUsd !== undefined) update.proposed_price_usd = data.proposedPriceUsd
  if (data.proposalNotes !== undefined) update.proposal_notes = data.proposalNotes
  if (data.paymentLink !== undefined) update.payment_link = data.paymentLink
  if (data.proposalSentAt !== undefined) update.proposal_sent_at = data.proposalSentAt
  if (data.acceptedAt !== undefined) update.accepted_at = data.acceptedAt
  if (data.expiresAt !== undefined) update.expires_at = data.expiresAt

  if (Object.keys(update).length === 0) return

  update.updated_at = new Date().toISOString()

  const { error } = await supabase.from("pf_quotes").update(update).eq("id", id)

  if (error) throw new Error(error.message)
}

export async function createQuotePaymentLink(params: {
  quoteId: string
  amountUsd: number
  description: string
}): Promise<string> {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const link = await stripe.paymentLinks.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: params.description },
          unit_amount: Math.round(params.amountUsd * 100),
        },
        quantity: 1,
      },
    ],
    after_completion: {
      type: "hosted_confirmation",
      hosted_confirmation: { custom_message: "Thank you! Your payment has been received." },
    },
  })

  // Persist the payment link URL to the quote
  const supabase = createAdminClient()
  await supabase
    .from("pf_quotes")
    .update({
      payment_link: link.url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.quoteId)

  return link.url
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClients(filters?: {
  search?: string
  page?: number
  pageSize?: number
}): Promise<{ items: AdminClient[]; total: number; page: number }> {
  const supabase = createAdminClient()

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("pf_client_orgs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  if (filters?.search) query = query.ilike("name", `%${filters.search}%`)

  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  const orgs = data ?? []

  // Fetch member counts and request stats in parallel
  const [memberCountResults, requestResults] = await Promise.all([
    Promise.allSettled(
      orgs.map((org) =>
        supabase
          .from("pf_org_members")
          .select("id", { count: "exact", head: true })
          .eq("org_id", org.id as string)
      )
    ),
    Promise.allSettled(
      orgs.map((org) =>
        supabase
          .from("pf_requests")
          .select("id, status")
          .eq("org_id", org.id as string)
      )
    ),
  ])

  const items: AdminClient[] = orgs.map((org, i) => {
    const memberResult = memberCountResults[i]
    const memberCount =
      memberResult.status === "fulfilled" ? (memberResult.value.count ?? 0) : 0

    const requestResult = requestResults[i]
    let requestCount = 0
    let activeRequests = 0

    if (requestResult.status === "fulfilled" && requestResult.value.data) {
      const requests = requestResult.value.data as Array<{ status: string }>
      requestCount = requests.length
      activeRequests = requests.filter((r) =>
        ["in_progress", "active", "review", "waiting_client", "waiting_third_party"].includes(
          r.status
        )
      ).length
    }

    return {
      id: org.id as string,
      name: org.name as string,
      slug: org.slug as string,
      billingEmail: (org.billing_email as string | null) ?? null,
      createdAt: org.created_at as string,
      memberCount,
      requestCount,
      activeRequests,
    }
  })

  return { items, total: count ?? 0, page }
}

export async function getClient(orgId: string): Promise<AdminClient | null> {
  const supabase = createAdminClient()

  const [orgResult, memberResult, requestResult] = await Promise.all([
    supabase.from("pf_client_orgs").select("*").eq("id", orgId).single(),

    supabase
      .from("pf_org_members")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId),

    supabase.from("pf_requests").select("id, status").eq("org_id", orgId),
  ])

  if (orgResult.error || !orgResult.data) return null

  const org = orgResult.data as Record<string, unknown>
  const memberCount = memberResult.count ?? 0

  const requests = (requestResult.data ?? []) as Array<{ status: string }>
  const requestCount = requests.length
  const activeRequests = requests.filter((r) =>
    ["in_progress", "active", "review", "waiting_client", "waiting_third_party"].includes(r.status)
  ).length

  return {
    id: org.id as string,
    name: org.name as string,
    slug: org.slug as string,
    billingEmail: (org.billing_email as string | null) ?? null,
    createdAt: org.created_at as string,
    memberCount,
    requestCount,
    activeRequests,
  }
}

export async function getClientSubscriptions(orgId: string): Promise<BillingSubscription[]> {
  const supabase = createAdminClient()

  // Get all order_ids linked to this org via requests
  const { data: requestRows, error: requestError } = await supabase
    .from("pf_requests")
    .select("order_id")
    .eq("org_id", orgId)
    .not("order_id", "is", null)

  if (requestError) throw new Error(requestError.message)

  const orderIds = [
    ...new Set(
      (requestRows ?? [])
        .map((r) => r.order_id as string)
        .filter(Boolean)
    ),
  ]

  if (!orderIds.length) return []

  const { data: subscriptions, error: subError } = await supabase
    .from("pf_subscriptions")
    .select("*, pf_orders ( id, status, pf_order_items ( service_name ) )")
    .in("order_id", orderIds)

  if (subError) throw new Error(subError.message)

  return (subscriptions ?? []).map((sub) => {
    const rawOrder = (sub as Record<string, unknown>).pf_orders
    const order = Array.isArray(rawOrder) ? rawOrder[0] : rawOrder

    const rawItems = order
      ? (order as Record<string, unknown>).pf_order_items
      : null
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []
    const serviceName =
      items.length > 0
        ? (items[0] as Record<string, unknown>).service_name as string
        : "Subscription"

    return {
      id: (sub as Record<string, unknown>).id as string,
      provider: (sub as Record<string, unknown>).provider as string,
      providerSubscriptionId: (sub as Record<string, unknown>).provider_subscription_id as string,
      status: (sub as Record<string, unknown>).status as string,
      currentPeriodStart:
        ((sub as Record<string, unknown>).current_period_start as string | null) ?? null,
      currentPeriodEnd:
        ((sub as Record<string, unknown>).current_period_end as string | null) ?? null,
      cancelledAt: ((sub as Record<string, unknown>).cancelled_at as string | null) ?? null,
      serviceName,
    }
  })
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapService(row: Record<string, unknown>): AdminService {
  const rawPrices = row.pf_service_prices
  const prices = Array.isArray(rawPrices) ? rawPrices : rawPrices ? [rawPrices] : []

  return {
    id: row.id as string,
    slug: row.slug as string,
    category: row.category as string,
    nameEn: row.name_en as string,
    nameEs: row.name_es as string,
    descriptionEn: row.description_en as string,
    descriptionEs: row.description_es as string,
    isPublished: row.is_published as boolean,
    sortOrder: (row.sort_order as number) ?? 0,
    prices: (prices as Record<string, unknown>[]).map(mapServicePrice),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function mapServicePrice(row: Record<string, unknown>): AdminServicePrice {
  return {
    id: row.id as string,
    serviceId: row.service_id as string,
    nameEn: row.name_en as string,
    nameEs: row.name_es as string,
    priceType: row.price_type as string,
    basePriceUsd: (row.base_price_usd as number | null) ?? null,
    billingPeriodVal: (row.billing_period_val as string | null) ?? null,
    stripePriceId: (row.stripe_price_id as string | null) ?? null,
    paypalPlanId: (row.paypal_plan_id as string | null) ?? null,
    isActive: row.is_active as boolean,
    sortOrder: (row.sort_order as number) ?? 0,
  }
}

function mapQuote(row: Record<string, unknown>): AdminQuote {
  return {
    id: row.id as string,
    orderId: (row.order_id as string | null) ?? null,
    clientEmail: row.client_email as string,
    clientName: row.client_name as string,
    clientCompany: (row.client_company as string | null) ?? null,
    servicesRequested: (row.services_requested as Array<{
      serviceId: string
      priceId?: string
      notes?: string
    }>) ?? [],
    status: row.status as string,
    clientNotes: (row.client_notes as string | null) ?? null,
    scope: (row.scope as string | null) ?? null,
    proposedPriceUsd: (row.proposed_price_usd as number | null) ?? null,
    proposalNotes: (row.proposal_notes as string | null) ?? null,
    paymentLink: (row.payment_link as string | null) ?? null,
    proposalSentAt: (row.proposal_sent_at as string | null) ?? null,
    acceptedAt: (row.accepted_at as string | null) ?? null,
    expiresAt: (row.expires_at as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
