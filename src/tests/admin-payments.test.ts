import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
import { reconcilePayment, getDiscrepancies, resolveDiscrepancy, getUnifiedPayments } from "@/lib/admin/payments"

vi.mock("@/lib/db", () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), query: {} },
}))

// ── Mock helpers ──────────────────────────────────────────────────────────────

let rq: unknown[] = []

function chainWith(data: unknown) {
  const p = Promise.resolve(data)
  const c: any = {}
  ;["from","leftJoin","innerJoin","where","set","values","orderBy","limit","offset","onConflictDoUpdate","returning"].forEach(m => { c[m] = vi.fn(() => c) })
  c.then = (f: any, r: any) => p.then(f, r)
  c.catch = (f: any) => p.catch(f)
  return c
}

function next(...items: unknown[]) { rq.push(...items) }

function makeReconciliation(overrides: Record<string, unknown> = {}) {
  return {
    id: "rec-1",
    orderId: "order-1",
    paymentId: "pay-1",
    provider: "stripe",
    providerAmount: "100.00",
    internalAmount: "100.00",
    currency: "USD",
    discrepancy: "0.00",
    status: "matched",
    notes: null,
    resolvedBy: null,
    resolvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

beforeEach(() => {
  rq = []
  vi.mocked(db.select).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.insert).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.update).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.delete).mockImplementation(() => chainWith(rq.shift() ?? []))
})

// ── reconcilePayment ──────────────────────────────────────────────────────────

describe("reconcilePayment", () => {
  it("creates new reconciliation record when none exists", async () => {
    const record = makeReconciliation()
    next([])           // select: no existing record
    next([record])     // insert returning

    const result = await reconcilePayment({
      orderId: "order-1",
      paymentId: "pay-1",
      provider: "stripe",
      providerAmount: 100,
      internalAmount: 100,
      currency: "USD",
    })

    expect(result.status).toBe("matched")
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.update)).not.toHaveBeenCalled()
  })

  it("updates existing reconciliation record when one exists", async () => {
    const record = makeReconciliation()
    next([{ id: "rec-1" }])    // select: existing found
    next([record])              // update returning

    const result = await reconcilePayment({
      orderId: "order-1",
      paymentId: "pay-1",
      provider: "stripe",
      providerAmount: 100,
      internalAmount: 100,
      currency: "USD",
    })

    expect(result.id).toBe("rec-1")
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.insert)).not.toHaveBeenCalled()
  })

  it("sets status to matched when amounts are equal", async () => {
    const record = makeReconciliation({ status: "matched" })
    next([])
    next([record])

    const result = await reconcilePayment({
      orderId: "order-1",
      paymentId: "pay-1",
      provider: "stripe",
      providerAmount: 150.00,
      internalAmount: 150.00,
      currency: "USD",
    })

    expect(result.status).toBe("matched")
  })

  it("sets status to discrepancy when amounts differ", async () => {
    const record = makeReconciliation({ status: "discrepancy", providerAmount: "100.00", internalAmount: "95.00" })
    next([])
    next([record])

    const result = await reconcilePayment({
      orderId: "order-1",
      paymentId: "pay-1",
      provider: "stripe",
      providerAmount: 100,
      internalAmount: 95,
      currency: "USD",
    })

    expect(result.status).toBe("discrepancy")
  })
})

// ── getDiscrepancies ──────────────────────────────────────────────────────────

describe("getDiscrepancies", () => {
  it("returns paginated results with total count", async () => {
    const record = makeReconciliation({ status: "discrepancy" })
    // Promise.all: [rows query, count query]
    next([record])         // rows
    next([{ count: 1 }])  // count

    const result = await getDiscrepancies()

    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
  })

  it("returns empty when no discrepancies", async () => {
    next([])
    next([{ count: 0 }])

    const result = await getDiscrepancies()
    expect(result.items).toHaveLength(0)
    expect(result.total).toBe(0)
  })
})

// ── resolveDiscrepancy ────────────────────────────────────────────────────────

describe("resolveDiscrepancy", () => {
  it("updates reconciliation with resolved status", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    await resolveDiscrepancy({
      reconciliationId: "rec-1",
      resolvedBy: "admin-1",
      notes: "Confirmed duplicate",
    })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "resolved",
        resolvedBy: "admin-1",
        notes: "Confirmed duplicate",
        resolvedAt: expect.any(Date),
      })
    )
  })

  it("never calls db.delete", async () => {
    next([])  // update

    await resolveDiscrepancy({ reconciliationId: "rec-1", resolvedBy: "admin-1" })

    expect(vi.mocked(db.delete)).not.toHaveBeenCalled()
  })
})

// ── getUnifiedPayments ────────────────────────────────────────────────────────

describe("getUnifiedPayments", () => {
  it("returns paginated payments", async () => {
    const payment = {
      id: "pay-1", orderId: "order-1", provider: "stripe", status: "succeeded",
      amount: "100.00", currency: "USD", externalId: "pi_abc", type: "one_time",
      createdAt: new Date(), updatedAt: new Date(),
    }
    next([payment])        // rows
    next([{ count: 1 }])  // count

    const result = await getUnifiedPayments()

    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
  })
})
