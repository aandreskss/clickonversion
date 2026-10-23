import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/server"
import { reconcilePayment, getDiscrepancies, resolveDiscrepancy, getUnifiedPayments } from "@/lib/admin/payments"

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
  createClient: vi.fn(),
}))

// ── Mock helper ───────────────────────────────────────────────────────────────

function createMockSupabase() {
  const mock = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    in: vi.fn(),
    not: vi.fn(),
    neq: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    lt: vi.fn(),
    gt: vi.fn(),
    ilike: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    from: vi.fn(),
    or: vi.fn(),
  }

  const chainable = mock as Record<string, ReturnType<typeof vi.fn>>
  Object.keys(chainable).forEach((key) => {
    if (key !== "single" && key !== "maybeSingle") {
      chainable[key].mockReturnValue(mock)
    }
  })

  return mock
}

// For queries that end with .update().eq()
function resolveOk() {
  return { eq: vi.fn().mockResolvedValue({ error: null }) }
}

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Payment reconciliation", () => {
  let mockDb: MockSupabase

  beforeEach(() => {
    mockDb = createMockSupabase()
    vi.mocked(createAdminClient).mockReturnValue(
      mockDb as unknown as ReturnType<typeof createAdminClient>
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("reconcilePayment", () => {
    // reconcilePayment flow:
    // 1. SELECT .maybeSingle() — check for existing record
    // 2. INSERT (if no existing) or UPDATE (if existing)
    // INSERT branch: .insert().single() — returns new record
    // We test the INSERT branch (no existing record)

    it("creates matched record when amounts are equal", async () => {
      // No existing record
      mockDb.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
      // INSERT returns new record via single()
      mockDb.single.mockResolvedValueOnce({
        data: {
          id: "rec-1", order_id: "ord-1", payment_id: "pay-1", provider: "stripe",
          provider_amount: 500.0, internal_amount: 500.0, currency: "usd",
          status: "matched", notes: null, resolved_by: null, resolved_at: null,
          created_at: "2024-01-01", discrepancy: 0,
        },
        error: null,
      })

      await reconcilePayment({
        orderId: "ord-1", paymentId: "pay-1", provider: "stripe",
        providerAmount: 500.0, internalAmount: 500.0, currency: "usd",
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const rec = insertCalls.find((c) => c[0]?.status === "matched")
      expect(rec).toBeDefined()
    })

    it("creates discrepancy record when amounts differ", async () => {
      mockDb.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
      mockDb.single.mockResolvedValueOnce({
        data: {
          id: "rec-2", order_id: "ord-1", payment_id: "pay-1", provider: "paypal",
          provider_amount: 500.0, internal_amount: 499.5, currency: "usd",
          status: "discrepancy", notes: null, resolved_by: null, resolved_at: null,
          created_at: "2024-01-01", discrepancy: 0.5,
        },
        error: null,
      })

      await reconcilePayment({
        orderId: "ord-1", paymentId: "pay-1", provider: "paypal",
        providerAmount: 500.0, internalAmount: 499.5, currency: "usd",
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const rec = insertCalls.find((c) => c[0]?.status === "discrepancy")
      expect(rec).toBeDefined()
    })

    it("passes both amounts to the insert call", async () => {
      mockDb.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
      mockDb.single.mockResolvedValueOnce({
        data: {
          id: "rec-3", order_id: "ord-1", payment_id: "pay-1", provider: "stripe",
          provider_amount: 500.0, internal_amount: 495.0, currency: "usd",
          status: "discrepancy", notes: null, resolved_by: null, resolved_at: null,
          created_at: "2024-01-01", discrepancy: 5.0,
        },
        error: null,
      })

      await reconcilePayment({
        orderId: "ord-1", paymentId: "pay-1", provider: "stripe",
        providerAmount: 500.0, internalAmount: 495.0, currency: "usd",
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const call = insertCalls.find((c) => c[0]?.provider_amount === 500.0)
      expect(call).toBeDefined()
      expect(call?.[0]?.internal_amount).toBe(495.0)
    })

    it("inserts into pf_payment_reconciliation table", async () => {
      mockDb.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
      mockDb.single.mockResolvedValueOnce({
        data: {
          id: "rec-4", order_id: "ord-1", payment_id: "pay-1", provider: "stripe",
          provider_amount: 100.0, internal_amount: 100.0, currency: "usd",
          status: "matched", notes: null, resolved_by: null, resolved_at: null,
          created_at: "2024-01-01", discrepancy: 0,
        },
        error: null,
      })

      await reconcilePayment({
        orderId: "ord-1", paymentId: "pay-1", provider: "stripe",
        providerAmount: 100.0, internalAmount: 100.0, currency: "usd",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_payment_reconciliation")
    })
  })

  describe("getDiscrepancies", () => {
    it("queries with status IN discrepancy and manual_review by default", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getDiscrepancies()

      const inCalls = vi.mocked(mockDb.in).mock.calls
      const statusFilter = inCalls.find((c) => c[0] === "status")
      expect(statusFilter?.[1]).toContain("discrepancy")
      expect(statusFilter?.[1]).toContain("manual_review")
      expect(statusFilter?.[1]).not.toContain("matched")
      expect(statusFilter?.[1]).not.toContain("resolved")
    })

    it("queries pf_payment_reconciliation table", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getDiscrepancies()

      expect(mockDb.from).toHaveBeenCalledWith("pf_payment_reconciliation")
    })

    it("returns empty items when no discrepancies", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      const result = await getDiscrepancies()

      expect(result.items).toHaveLength(0)
      expect(result.total).toBe(0)
    })
  })

  describe("resolveDiscrepancy", () => {
    // resolveDiscrepancy: from("pf_payment_reconciliation").update({...}).eq("id", ...)
    // Terminal: .update().eq() — use resolveOk()

    it("sets status to resolved", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await resolveDiscrepancy({
        reconciliationId: "rec-1",
        resolvedBy: "admin-1",
        notes: "Verified with Stripe dashboard",
      })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      const resolved = updateCalls.find((c) => c[0]?.status === "resolved")
      expect(resolved).toBeDefined()
    })

    it("stores resolution notes in the update payload", async () => {
      const testNotes = "Confirmed correct amount"
      mockDb.update.mockReturnValueOnce(resolveOk())

      await resolveDiscrepancy({
        reconciliationId: "rec-1",
        resolvedBy: "admin-1",
        notes: testNotes,
      })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      const rec = updateCalls.find((c) => c[0]?.notes === testNotes)
      expect(rec).toBeDefined()
    })

    it("records resolved_by in the update payload", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await resolveDiscrepancy({
        reconciliationId: "rec-1",
        resolvedBy: "admin-uuid-123",
        notes: "Confirmed",
      })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      const rec = updateCalls.find((c) => c[0]?.resolved_by === "admin-uuid-123")
      expect(rec).toBeDefined()
    })

    it("updates the correct reconciliation record by id", async () => {
      const terminal = resolveOk()
      mockDb.update.mockReturnValueOnce(terminal)

      await resolveDiscrepancy({
        reconciliationId: "rec-specific-id",
        resolvedBy: "admin-1",
        notes: "Done",
      })

      // The eq call on the terminal object should have been called with the id
      expect(terminal.eq).toHaveBeenCalledWith("id", "rec-specific-id")
    })
  })

  describe("getUnifiedPayments", () => {
    it("queries pf_payments table", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getUnifiedPayments()

      expect(mockDb.from).toHaveBeenCalledWith("pf_payments")
    })

    it("filters by provider when provided", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getUnifiedPayments({ provider: "stripe" })

      const eqCalls = vi.mocked(mockDb.eq).mock.calls
      const providerFilter = eqCalls.find((c) => c[0] === "provider" && c[1] === "stripe")
      expect(providerFilter).toBeDefined()
    })

    it("returns items array with total", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 5, error: null })

      const result = await getUnifiedPayments()

      expect(result.total).toBe(5)
      expect(Array.isArray(result.items)).toBe(true)
    })
  })
})
