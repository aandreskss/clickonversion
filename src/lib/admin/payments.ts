import { createAdminClient } from "@/lib/supabase/server"
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
  const supabase = createAdminClient()

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("pf_payments")
    .select(
      `
      *,
      pf_orders ( id, order_number, client_email, client_name )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: filters?.sortDir === "asc" })

  if (filters?.provider) query = query.eq("provider", filters.provider)
  if (filters?.status) query = query.eq("status", filters.status)
  if (filters?.search) {
    query = query.or(
      `provider_payment_id.ilike.%${filters.search}%,pf_orders.client_email.ilike.%${filters.search}%`
    )
  }

  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  const items: UnifiedPayment[] = (data ?? []).map((row) => {
    const rawOrder = (row as Record<string, unknown>).pf_orders
    const order = Array.isArray(rawOrder) ? rawOrder[0] : rawOrder

    return {
      id: row.id as string,
      orderId: row.order_id as string,
      orderNumber: order ? (order as Record<string, unknown>).order_number as string : "",
      provider: row.provider as "stripe" | "paypal",
      providerPaymentId: (row.provider_payment_id as string | null) ?? null,
      amountUsd: row.amount_usd as number,
      currency: row.currency as string,
      status: row.status as string,
      paymentType: row.payment_type as string,
      clientEmail: order
        ? (order as Record<string, unknown>).client_email as string
        : "",
      clientName: order
        ? (order as Record<string, unknown>).client_name as string
        : "",
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }
  })

  return { items, total: count ?? 0, page }
}

export async function getOrderPayments(orderId: string): Promise<UnifiedPayment[]> {
  const supabase = createAdminClient()

  const [paymentsResult, orderResult] = await Promise.all([
    supabase
      .from("pf_payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false }),

    supabase
      .from("pf_orders")
      .select("id, order_number, client_email, client_name")
      .eq("id", orderId)
      .single(),
  ])

  if (paymentsResult.error) throw new Error(paymentsResult.error.message)

  const order = orderResult.data as Record<string, unknown> | null

  return (paymentsResult.data ?? []).map((row) => ({
    id: row.id as string,
    orderId: row.order_id as string,
    orderNumber: order ? (order.order_number as string) : "",
    provider: row.provider as "stripe" | "paypal",
    providerPaymentId: (row.provider_payment_id as string | null) ?? null,
    amountUsd: row.amount_usd as number,
    currency: row.currency as string,
    status: row.status as string,
    paymentType: row.payment_type as string,
    clientEmail: order ? (order.client_email as string) : "",
    clientName: order ? (order.client_name as string) : "",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
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
  const supabase = createAdminClient()

  const discrepancy = Math.round((params.providerAmount - params.internalAmount) * 100) / 100
  const status: ReconciliationRecord["status"] =
    discrepancy === 0
      ? "matched"
      : Math.abs(discrepancy) < 0.01
        ? "matched"
        : "discrepancy"

  // Upsert reconciliation record — if one exists for this payment, update it
  const { data: existing } = await supabase
    .from("pf_payment_reconciliation")
    .select("id")
    .eq("payment_id", params.paymentId)
    .maybeSingle()

  let record: Record<string, unknown>

  if (existing) {
    const { data, error } = await supabase
      .from("pf_payment_reconciliation")
      .update({
        provider_amount: params.providerAmount,
        internal_amount: params.internalAmount,
        currency: params.currency,
        status,
        notes: params.notes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", (existing as Record<string, unknown>).id as string)
      .select()
      .single()

    if (error || !data) throw new Error(error?.message ?? "Failed to update reconciliation")
    record = data as Record<string, unknown>
  } else {
    const { data, error } = await supabase
      .from("pf_payment_reconciliation")
      .insert({
        order_id: params.orderId,
        payment_id: params.paymentId,
        provider: params.provider,
        provider_amount: params.providerAmount,
        internal_amount: params.internalAmount,
        currency: params.currency,
        status,
        notes: params.notes ?? null,
      })
      .select()
      .single()

    if (error || !data) throw new Error(error?.message ?? "Failed to create reconciliation")
    record = data as Record<string, unknown>
  }

  return mapReconciliation(record)
}

export async function getDiscrepancies(filters?: {
  status?: ReconciliationRecord["status"]
  page?: number
  pageSize?: number
}): Promise<{ items: ReconciliationRecord[]; total: number; page: number }> {
  const supabase = createAdminClient()

  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("pf_payment_reconciliation")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  } else {
    // By default show non-resolved discrepancies
    query = query.in("status", ["discrepancy", "manual_review"])
  }

  query = query.range(offset, offset + pageSize - 1)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  return {
    items: (data ?? []).map((row) => mapReconciliation(row as Record<string, unknown>)),
    total: count ?? 0,
    page,
  }
}

export async function resolveDiscrepancy(params: {
  reconciliationId: string
  resolvedBy: string
  notes?: string
}): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("pf_payment_reconciliation")
    .update({
      status: "resolved",
      resolved_by: params.resolvedBy,
      resolved_at: new Date().toISOString(),
      notes: params.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.reconciliationId)

  if (error) throw new Error(error.message)
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapReconciliation(row: Record<string, unknown>): ReconciliationRecord {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    paymentId: (row.payment_id as string | null) ?? null,
    provider: row.provider as string,
    providerAmount: row.provider_amount as number,
    internalAmount: row.internal_amount as number,
    currency: row.currency as string,
    // discrepancy is a generated column in the DB; fall back to manual calc
    discrepancy:
      (row.discrepancy as number | null) ??
      Math.round(
        ((row.provider_amount as number) - (row.internal_amount as number)) * 100
      ) / 100,
    status: row.status as ReconciliationRecord["status"],
    notes: (row.notes as string | null) ?? null,
    resolvedBy: (row.resolved_by as string | null) ?? null,
    resolvedAt: (row.resolved_at as string | null) ?? null,
    createdAt: row.created_at as string,
  }
}
