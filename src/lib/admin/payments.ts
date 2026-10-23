import { db } from "@/lib/db"
import { pfPayments, pfOrders, pfPaymentReconciliation } from "@/lib/db/schema"
import { eq, and, desc, asc, inArray, sql } from "drizzle-orm"
import type { UnifiedPayment, ReconciliationRecord } from "@/types/admin"

// ── Unified Payments ──────────────────────────────────────────────────────────

export async function getUnifiedPayments(filters?: {
  provider?: "stripe" | "paypal"
  status?: string
  search?: string
  page?: number
  pageSize?: number
  sortDir?: "asc" | "desc"
}): Promise<{ items: UnifiedPayment[]; total: number; page: number }> {
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  const orderDir =
    filters?.sortDir === "asc" ? asc(pfPayments.createdAt) : desc(pfPayments.createdAt)

  // Build where conditions
  const conditions = []
  if (filters?.provider) conditions.push(eq(pfPayments.provider, filters.provider))
  if (filters?.status)
    conditions.push(
      eq(
        pfPayments.status,
        filters.status as
          | "pending"
          | "processing"
          | "succeeded"
          | "failed"
          | "cancelled"
          | "refunded"
          | "partially_refunded"
      )
    )

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Fetch payments with order join
  const rows = await db
    .select({
      id: pfPayments.id,
      orderId: pfPayments.orderId,
      provider: pfPayments.provider,
      providerPaymentId: pfPayments.providerPaymentId,
      amountUsd: pfPayments.amountUsd,
      currency: pfPayments.currency,
      status: pfPayments.status,
      paymentType: pfPayments.paymentType,
      createdAt: pfPayments.createdAt,
      updatedAt: pfPayments.updatedAt,
      orderNumber: pfOrders.orderNumber,
      clientEmail: pfOrders.clientEmail,
      clientName: pfOrders.clientName,
    })
    .from(pfPayments)
    .leftJoin(pfOrders, eq(pfPayments.orderId, pfOrders.id))
    .where(whereClause)
    .orderBy(orderDir)
    .limit(pageSize)
    .offset(offset)

  // Count query
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(pfPayments)
    .where(whereClause)

  let items: UnifiedPayment[] = rows.map((row) => ({
    id: row.id,
    orderId: row.orderId,
    orderNumber: row.orderNumber ?? "",
    provider: row.provider as "stripe" | "paypal",
    providerPaymentId: row.providerPaymentId ?? null,
    amountUsd: Number(row.amountUsd),
    currency: row.currency,
    status: row.status,
    paymentType: row.paymentType,
    clientEmail: row.clientEmail ?? "",
    clientName: row.clientName ?? "",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  }))

  // Search filter applied in-memory (covers providerPaymentId and joined clientEmail)
  if (filters?.search) {
    const search = filters.search.toLowerCase()
    items = items.filter(
      (item) =>
        (item.providerPaymentId ?? "").toLowerCase().includes(search) ||
        item.clientEmail.toLowerCase().includes(search)
    )
  }

  return { items, total: countResult[0]?.count ?? 0, page }
}

export async function getOrderPayments(orderId: string): Promise<UnifiedPayment[]> {
  const [payments, orderRows] = await Promise.all([
    db
      .select()
      .from(pfPayments)
      .where(eq(pfPayments.orderId, orderId))
      .orderBy(desc(pfPayments.createdAt)),

    db
      .select({
        id: pfOrders.id,
        orderNumber: pfOrders.orderNumber,
        clientEmail: pfOrders.clientEmail,
        clientName: pfOrders.clientName,
      })
      .from(pfOrders)
      .where(eq(pfOrders.id, orderId))
      .limit(1),
  ])

  const order = orderRows[0] ?? null

  return payments.map((row) => ({
    id: row.id,
    orderId: row.orderId,
    orderNumber: order ? order.orderNumber : "",
    provider: row.provider as "stripe" | "paypal",
    providerPaymentId: row.providerPaymentId ?? null,
    amountUsd: Number(row.amountUsd),
    currency: row.currency,
    status: row.status,
    paymentType: row.paymentType,
    clientEmail: order ? order.clientEmail : "",
    clientName: order ? order.clientName : "",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt),
  }))
}

// ── Reconciliation ────────────────────────────────────────────────────────────

export async function reconcilePayment(params: {
  orderId: string
  paymentId: string
  provider: string
  providerAmount: number
  internalAmount: number
  currency: string
  notes?: string
}): Promise<ReconciliationRecord> {
  const discrepancy = Math.round((params.providerAmount - params.internalAmount) * 100) / 100
  const status: ReconciliationRecord["status"] =
    discrepancy === 0
      ? "matched"
      : Math.abs(discrepancy) < 0.01
        ? "matched"
        : "discrepancy"

  // Check if a reconciliation record already exists for this payment
  const existing = await db
    .select({ id: pfPaymentReconciliation.id })
    .from(pfPaymentReconciliation)
    .where(eq(pfPaymentReconciliation.paymentId, params.paymentId))
    .limit(1)

  let record: Record<string, unknown>

  if (existing.length > 0) {
    const updated = await db
      .update(pfPaymentReconciliation)
      .set({
        providerAmount: String(params.providerAmount),
        internalAmount: String(params.internalAmount),
        currency: params.currency,
        status,
        notes: params.notes ?? null,
        updatedAt: new Date(),
      })
      .where(eq(pfPaymentReconciliation.id, existing[0].id))
      .returning()

    if (!updated[0]) throw new Error("Failed to update reconciliation")
    record = updated[0] as Record<string, unknown>
  } else {
    const inserted = await db
      .insert(pfPaymentReconciliation)
      .values({
        orderId: params.orderId,
        paymentId: params.paymentId,
        provider: params.provider as "stripe" | "paypal",
        providerAmount: String(params.providerAmount),
        internalAmount: String(params.internalAmount),
        currency: params.currency,
        status,
        notes: params.notes ?? null,
      })
      .returning()

    if (!inserted[0]) throw new Error("Failed to create reconciliation")
    record = inserted[0] as Record<string, unknown>
  }

  return mapReconciliation(record)
}

export async function getDiscrepancies(filters?: {
  status?: ReconciliationRecord["status"]
  page?: number
  pageSize?: number
}): Promise<{ items: ReconciliationRecord[]; total: number; page: number }> {
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  const whereClause = filters?.status
    ? eq(pfPaymentReconciliation.status, filters.status)
    : inArray(pfPaymentReconciliation.status, ["discrepancy", "manual_review"])

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(pfPaymentReconciliation)
      .where(whereClause)
      .orderBy(desc(pfPaymentReconciliation.createdAt))
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: sql<number>`count(*)::int` })
      .from(pfPaymentReconciliation)
      .where(whereClause),
  ])

  return {
    items: rows.map((row) => mapReconciliation(row as Record<string, unknown>)),
    total: countResult[0]?.count ?? 0,
    page,
  }
}

export async function resolveDiscrepancy(params: {
  reconciliationId: string
  resolvedBy: string
  notes?: string
}): Promise<void> {
  await db
    .update(pfPaymentReconciliation)
    .set({
      status: "resolved",
      resolvedBy: params.resolvedBy,
      resolvedAt: new Date(),
      notes: params.notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(pfPaymentReconciliation.id, params.reconciliationId))
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapReconciliation(row: Record<string, unknown>): ReconciliationRecord {
  const providerAmount = Number(row.providerAmount ?? row.provider_amount)
  const internalAmount = Number(row.internalAmount ?? row.internal_amount)
  const rawDiscrepancy = row.discrepancy

  const toIso = (v: unknown): string | null => {
    if (v == null) return null
    return v instanceof Date ? v.toISOString() : String(v)
  }

  return {
    id: row.id as string,
    orderId: (row.orderId ?? row.order_id) as string,
    paymentId: ((row.paymentId ?? row.payment_id) as string | null) ?? null,
    provider: row.provider as string,
    providerAmount,
    internalAmount,
    currency: row.currency as string,
    // discrepancy is a generated column in the DB; fall back to manual calc
    discrepancy:
      rawDiscrepancy != null
        ? Number(rawDiscrepancy)
        : Math.round((providerAmount - internalAmount) * 100) / 100,
    status: row.status as ReconciliationRecord["status"],
    notes: (row.notes as string | null) ?? null,
    resolvedBy: ((row.resolvedBy ?? row.resolved_by) as string | null) ?? null,
    resolvedAt: toIso(row.resolvedAt ?? row.resolved_at),
    createdAt: toIso(row.createdAt ?? row.created_at) ?? "",
  }
}
