import { db } from "@/lib/db"
import {
  pfServiceCatalog,
  pfServicePrices,
  pfCatalogPriceHistory,
  pfQuotes,
  pfClientOrgs,
  pfOrgMembers,
  pfRequests,
  pfSubscriptions,
  pfOrders,
  pfOrderItems,
} from "@/lib/db/schema"
import { eq, asc, desc, ilike, inArray, sql, and, isNotNull } from "drizzle-orm"
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
  const services = await db
    .select()
    .from(pfServiceCatalog)
    .orderBy(asc(pfServiceCatalog.sortOrder))

  if (services.length === 0) return []

  const serviceIds = services.map((s) => s.id)
  const prices = await db
    .select()
    .from(pfServicePrices)
    .where(inArray(pfServicePrices.serviceId, serviceIds))

  const pricesByServiceId = new Map<string, typeof prices>()
  for (const price of prices) {
    const list = pricesByServiceId.get(price.serviceId) ?? []
    list.push(price)
    pricesByServiceId.set(price.serviceId, list)
  }

  return services.map((service) => {
    const servicePrices = pricesByServiceId.get(service.id) ?? []
    return mapService(service as Record<string, unknown>, servicePrices as Record<string, unknown>[])
  })
}

export async function getService(id: string): Promise<AdminService | null> {
  const serviceRows = await db
    .select()
    .from(pfServiceCatalog)
    .where(eq(pfServiceCatalog.id, id))
    .limit(1)

  if (!serviceRows[0]) return null

  const prices = await db
    .select()
    .from(pfServicePrices)
    .where(eq(pfServicePrices.serviceId, id))

  return mapService(
    serviceRows[0] as Record<string, unknown>,
    prices as Record<string, unknown>[]
  )
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
  const inserted = await db
    .insert(pfServiceCatalog)
    .values({
      slug: data.slug,
      category: data.category as "seo" | "paid-media" | "automation" | "support",
      nameEn: data.nameEn,
      nameEs: data.nameEs,
      descriptionEn: data.descriptionEn,
      descriptionEs: data.descriptionEs,
      isPublished: data.isPublished ?? false,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning()

  if (!inserted[0]) throw new Error("Failed to create service")

  return mapService(inserted[0] as Record<string, unknown>, [])
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
  const update: Record<string, unknown> = {}
  if (data.slug !== undefined) update.slug = data.slug
  if (data.category !== undefined) update.category = data.category
  if (data.nameEn !== undefined) update.nameEn = data.nameEn
  if (data.nameEs !== undefined) update.nameEs = data.nameEs
  if (data.descriptionEn !== undefined) update.descriptionEn = data.descriptionEn
  if (data.descriptionEs !== undefined) update.descriptionEs = data.descriptionEs
  if (data.isPublished !== undefined) update.isPublished = data.isPublished
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder

  if (Object.keys(update).length === 0) return

  update.updatedAt = new Date()

  await db
    .update(pfServiceCatalog)
    .set(update as Partial<typeof pfServiceCatalog.$inferInsert>)
    .where(eq(pfServiceCatalog.id, id))
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
  const inserted = await db
    .insert(pfServicePrices)
    .values({
      serviceId: data.serviceId,
      nameEn: data.nameEn,
      nameEs: data.nameEs,
      priceType: data.priceType as "ONE_TIME" | "RECURRING" | "STARTING_AT" | "CUSTOM_QUOTE",
      basePriceUsd: data.basePriceUsd != null ? String(data.basePriceUsd) : null,
      billingPeriodVal:
        (data.billingPeriodVal as "monthly" | "quarterly" | "annual" | "one_time" | undefined) ??
        null,
      stripePriceId: data.stripePriceId ?? null,
      paypalPlanId: data.paypalPlanId ?? null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning()

  if (!inserted[0]) throw new Error("Failed to create price")

  return mapServicePrice(inserted[0] as Record<string, unknown>)
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
  // Record price history before changing basePriceUsd
  if (data.basePriceUsd !== undefined) {
    const currentRows = await db
      .select({ basePriceUsd: pfServicePrices.basePriceUsd, serviceId: pfServicePrices.serviceId })
      .from(pfServicePrices)
      .where(eq(pfServicePrices.id, priceId))
      .limit(1)

    if (!currentRows[0]) throw new Error("Price record not found")

    const current = currentRows[0]

    // pfCatalogPriceHistory is append-only
    const historyInsert = await db
      .insert(pfCatalogPriceHistory)
      .values({
        priceId,
        serviceId: current.serviceId,
        oldPriceUsd: current.basePriceUsd ?? null,
        newPriceUsd: String(data.basePriceUsd),
        changedBy,
        changedByEmail,
      })
      .catch((err: Error) => {
        console.error("Failed to record price history:", err.message)
        return null
      })

    void historyInsert
  }

  const update: Record<string, unknown> = {}
  if (data.nameEn !== undefined) update.nameEn = data.nameEn
  if (data.nameEs !== undefined) update.nameEs = data.nameEs
  if (data.basePriceUsd !== undefined) update.basePriceUsd = String(data.basePriceUsd)
  if (data.isActive !== undefined) update.isActive = data.isActive
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder

  if (Object.keys(update).length === 0) return

  update.updatedAt = new Date()

  await db
    .update(pfServicePrices)
    .set(update as Partial<typeof pfServicePrices.$inferInsert>)
    .where(eq(pfServicePrices.id, priceId))
}

// ── Quotes ────────────────────────────────────────────────────────────────────

export async function getQuotes(filters?: {
  status?: string
  page?: number
  pageSize?: number
}): Promise<{ items: AdminQuote[]; total: number; page: number }> {
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  const whereClause = filters?.status
    ? eq(
        pfQuotes.status,
        filters.status as
          | "pending"
          | "in_review"
          | "proposal_sent"
          | "accepted"
          | "declined"
          | "expired"
      )
    : undefined

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(pfQuotes)
      .where(whereClause)
      .orderBy(desc(pfQuotes.createdAt))
      .limit(pageSize)
      .offset(offset),

    db.select({ count: sql<number>`count(*)::int` }).from(pfQuotes).where(whereClause),
  ])

  return {
    items: rows.map((row) => mapQuote(row as Record<string, unknown>)),
    total: countResult[0]?.count ?? 0,
    page,
  }
}

export async function getQuote(id: string): Promise<AdminQuote | null> {
  const rows = await db
    .select()
    .from(pfQuotes)
    .where(eq(pfQuotes.id, id))
    .limit(1)

  if (!rows[0]) return null

  return mapQuote(rows[0] as Record<string, unknown>)
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
  const inserted = await db
    .insert(pfQuotes)
    .values({
      clientEmail: data.clientEmail,
      clientName: data.clientName,
      clientCompany: data.clientCompany ?? null,
      servicesRequested: data.servicesRequested,
      status: "pending",
      clientNotes: data.clientNotes ?? null,
      scope: data.scope ?? null,
      proposedPriceUsd: data.proposedPriceUsd != null ? String(data.proposedPriceUsd) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    })
    .returning()

  if (!inserted[0]) throw new Error("Failed to create quote")

  return mapQuote(inserted[0] as Record<string, unknown>)
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
  const update: Record<string, unknown> = {}
  if (data.status !== undefined) update.status = data.status
  if (data.scope !== undefined) update.scope = data.scope
  if (data.proposedPriceUsd !== undefined)
    update.proposedPriceUsd = data.proposedPriceUsd != null ? String(data.proposedPriceUsd) : null
  if (data.proposalNotes !== undefined) update.proposalNotes = data.proposalNotes
  if (data.paymentLink !== undefined) update.paymentLink = data.paymentLink
  if (data.proposalSentAt !== undefined)
    update.proposalSentAt = data.proposalSentAt ? new Date(data.proposalSentAt) : null
  if (data.acceptedAt !== undefined)
    update.acceptedAt = data.acceptedAt ? new Date(data.acceptedAt) : null
  if (data.expiresAt !== undefined)
    update.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null

  if (Object.keys(update).length === 0) return

  update.updatedAt = new Date()

  await db
    .update(pfQuotes)
    .set(update as Partial<typeof pfQuotes.$inferInsert>)
    .where(eq(pfQuotes.id, id))
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
  await db
    .update(pfQuotes)
    .set({
      paymentLink: link.url,
      updatedAt: new Date(),
    })
    .where(eq(pfQuotes.id, params.quoteId))

  return link.url
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClients(filters?: {
  search?: string
  page?: number
  pageSize?: number
}): Promise<{ items: AdminClient[]; total: number; page: number }> {
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  const whereClause = filters?.search
    ? ilike(pfClientOrgs.name, `%${filters.search}%`)
    : undefined

  const [orgs, countResult] = await Promise.all([
    db
      .select()
      .from(pfClientOrgs)
      .where(whereClause)
      .orderBy(desc(pfClientOrgs.createdAt))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pfClientOrgs)
      .where(whereClause),
  ])

  if (orgs.length === 0) {
    return { items: [], total: countResult[0]?.count ?? 0, page }
  }

  const orgIds = orgs.map((o) => o.id)

  // Fetch member counts and request stats in parallel
  const [memberCountResults, requestResults] = await Promise.all([
    Promise.allSettled(
      orgIds.map((orgId) =>
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(pfOrgMembers)
          .where(eq(pfOrgMembers.orgId, orgId))
      )
    ),
    Promise.allSettled(
      orgIds.map((orgId) =>
        db
          .select({ id: pfRequests.id, status: pfRequests.status })
          .from(pfRequests)
          .where(eq(pfRequests.orgId, orgId))
      )
    ),
  ])

  const items: AdminClient[] = orgs.map((org, i) => {
    const memberResult = memberCountResults[i]
    const memberCount =
      memberResult.status === "fulfilled" ? (memberResult.value[0]?.count ?? 0) : 0

    const requestResult = requestResults[i]
    let requestCount = 0
    let activeRequests = 0

    if (requestResult.status === "fulfilled") {
      const requests = requestResult.value
      requestCount = requests.length
      activeRequests = requests.filter((r) =>
        ["in_progress", "active", "review", "waiting_client", "waiting_third_party"].includes(
          r.status
        )
      ).length
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      billingEmail: org.billingEmail ?? null,
      createdAt: org.createdAt instanceof Date ? org.createdAt.toISOString() : String(org.createdAt),
      memberCount,
      requestCount,
      activeRequests,
    }
  })

  return { items, total: countResult[0]?.count ?? 0, page }
}

export async function getClient(orgId: string): Promise<AdminClient | null> {
  const [orgRows, memberCountResult, requestRows] = await Promise.all([
    db.select().from(pfClientOrgs).where(eq(pfClientOrgs.id, orgId)).limit(1),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pfOrgMembers)
      .where(eq(pfOrgMembers.orgId, orgId)),

    db
      .select({ id: pfRequests.id, status: pfRequests.status })
      .from(pfRequests)
      .where(eq(pfRequests.orgId, orgId)),
  ])

  if (!orgRows[0]) return null

  const org = orgRows[0]
  const memberCount = memberCountResult[0]?.count ?? 0

  const requests = requestRows
  const requestCount = requests.length
  const activeRequests = requests.filter((r) =>
    ["in_progress", "active", "review", "waiting_client", "waiting_third_party"].includes(r.status)
  ).length

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    billingEmail: org.billingEmail ?? null,
    createdAt: org.createdAt instanceof Date ? org.createdAt.toISOString() : String(org.createdAt),
    memberCount,
    requestCount,
    activeRequests,
  }
}

export async function getClientSubscriptions(orgId: string): Promise<BillingSubscription[]> {
  // Get all order_ids linked to this org via requests
  const requestRows = await db
    .select({ orderId: pfRequests.orderId })
    .from(pfRequests)
    .where(and(eq(pfRequests.orgId, orgId), isNotNull(pfRequests.orderId)))

  const orderIds = [
    ...new Set(requestRows.map((r) => r.orderId as string).filter(Boolean)),
  ]

  if (!orderIds.length) return []

  const subscriptions = await db
    .select()
    .from(pfSubscriptions)
    .where(inArray(pfSubscriptions.orderId, orderIds))

  if (subscriptions.length === 0) return []

  // Fetch order items for service names
  const subOrderIds = [...new Set(subscriptions.map((s) => s.orderId))]
  const orderItemRows = await db
    .select({
      orderId: pfOrderItems.orderId,
      serviceName: pfOrderItems.serviceName,
    })
    .from(pfOrderItems)
    .where(inArray(pfOrderItems.orderId, subOrderIds))

  const serviceNameByOrderId = new Map<string, string>()
  for (const item of orderItemRows) {
    if (!serviceNameByOrderId.has(item.orderId)) {
      serviceNameByOrderId.set(item.orderId, item.serviceName)
    }
  }

  return subscriptions.map((sub) => ({
    id: sub.id,
    provider: sub.provider,
    providerSubscriptionId: sub.providerSubscriptionId,
    status: sub.status,
    currentPeriodStart: sub.currentPeriodStart
      ? (sub.currentPeriodStart instanceof Date
          ? sub.currentPeriodStart.toISOString()
          : String(sub.currentPeriodStart))
      : null,
    currentPeriodEnd: sub.currentPeriodEnd
      ? (sub.currentPeriodEnd instanceof Date
          ? sub.currentPeriodEnd.toISOString()
          : String(sub.currentPeriodEnd))
      : null,
    cancelledAt: sub.cancelledAt
      ? (sub.cancelledAt instanceof Date
          ? sub.cancelledAt.toISOString()
          : String(sub.cancelledAt))
      : null,
    serviceName: serviceNameByOrderId.get(sub.orderId) ?? "Subscription",
  }))
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapService(
  row: Record<string, unknown>,
  prices: Record<string, unknown>[]
): AdminService {
  const toIso = (v: unknown): string =>
    v instanceof Date ? v.toISOString() : String(v)

  return {
    id: row.id as string,
    slug: row.slug as string,
    category: row.category as string,
    nameEn: (row.nameEn ?? row.name_en) as string,
    nameEs: (row.nameEs ?? row.name_es) as string,
    descriptionEn: (row.descriptionEn ?? row.description_en) as string,
    descriptionEs: (row.descriptionEs ?? row.description_es) as string,
    isPublished: (row.isPublished ?? row.is_published) as boolean,
    sortOrder: ((row.sortOrder ?? row.sort_order) as number) ?? 0,
    prices: prices.map(mapServicePrice),
    createdAt: toIso(row.createdAt ?? row.created_at),
    updatedAt: toIso(row.updatedAt ?? row.updated_at),
  }
}

function mapServicePrice(row: Record<string, unknown>): AdminServicePrice {
  return {
    id: row.id as string,
    serviceId: (row.serviceId ?? row.service_id) as string,
    nameEn: (row.nameEn ?? row.name_en) as string,
    nameEs: (row.nameEs ?? row.name_es) as string,
    priceType: (row.priceType ?? row.price_type) as string,
    basePriceUsd:
      (row.basePriceUsd ?? row.base_price_usd) != null
        ? Number(row.basePriceUsd ?? row.base_price_usd)
        : null,
    billingPeriodVal: ((row.billingPeriodVal ?? row.billing_period_val) as string | null) ?? null,
    stripePriceId: ((row.stripePriceId ?? row.stripe_price_id) as string | null) ?? null,
    paypalPlanId: ((row.paypalPlanId ?? row.paypal_plan_id) as string | null) ?? null,
    isActive: (row.isActive ?? row.is_active) as boolean,
    sortOrder: ((row.sortOrder ?? row.sort_order) as number) ?? 0,
  }
}

function mapQuote(row: Record<string, unknown>): AdminQuote {
  const toIso = (v: unknown): string | null => {
    if (v == null) return null
    return v instanceof Date ? v.toISOString() : String(v)
  }

  return {
    id: row.id as string,
    orderId: ((row.orderId ?? row.order_id) as string | null) ?? null,
    clientEmail: (row.clientEmail ?? row.client_email) as string,
    clientName: (row.clientName ?? row.client_name) as string,
    clientCompany: ((row.clientCompany ?? row.client_company) as string | null) ?? null,
    servicesRequested:
      ((row.servicesRequested ?? row.services_requested) as Array<{
        serviceId: string
        priceId?: string
        notes?: string
      }>) ?? [],
    status: row.status as string,
    clientNotes: ((row.clientNotes ?? row.client_notes) as string | null) ?? null,
    scope: (row.scope as string | null) ?? null,
    proposedPriceUsd:
      (row.proposedPriceUsd ?? row.proposed_price_usd) != null
        ? Number(row.proposedPriceUsd ?? row.proposed_price_usd)
        : null,
    proposalNotes: ((row.proposalNotes ?? row.proposal_notes) as string | null) ?? null,
    paymentLink: ((row.paymentLink ?? row.payment_link) as string | null) ?? null,
    proposalSentAt: toIso(row.proposalSentAt ?? row.proposal_sent_at),
    acceptedAt: toIso(row.acceptedAt ?? row.accepted_at),
    expiresAt: toIso(row.expiresAt ?? row.expires_at),
    createdAt: toIso(row.createdAt ?? row.created_at) ?? "",
    updatedAt: toIso(row.updatedAt ?? row.updated_at) ?? "",
  }
}
