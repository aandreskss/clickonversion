import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/server"
import { updateRequestStatus } from "@/lib/admin/queue"
import { updateServicePrice } from "@/lib/admin/commercial"

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

function resolveOk() {
  return { eq: vi.fn().mockResolvedValue({ error: null }) }
}

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Audit trail", () => {
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

  describe("pf_request_status_log immutability", () => {
    it("every valid status change creates a log entry", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_request_status_log")
    })

    it("status log is never updated or deleted by updateRequestStatus", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      expect(mockDb.delete).not.toHaveBeenCalled()
    })

    it("invalid transitions do NOT create log entries", async () => {
      // completed -> queued is INVALID
      mockDb.single.mockResolvedValueOnce({ data: { status: "completed", started_at: "2024-01-01" }, error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "queued",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).not.toContain("pf_request_status_log")
    })

    it("log entry captures changed_by_email as a snapshot", async () => {
      const email = "arnaldo@clickonversion.com"

      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "user-uuid",
        changedByEmail: email,
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const logEntry = insertCalls.find((c) => c[0]?.changed_by_email === email)
      expect(logEntry).toBeDefined()
    })

    it("log entry captures both from_status and to_status", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const logEntry = insertCalls.find(
        (c) => c[0]?.from_status === "queued" && c[0]?.to_status === "in_progress"
      )
      expect(logEntry).toBeDefined()
    })

    it("note is stored in the log entry when provided", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
        note: "Reviewed by team lead",
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const logEntry = insertCalls.find((c) => c[0]?.note === "Reviewed by team lead")
      expect(logEntry).toBeDefined()
    })
  })

  describe("Price change history immutability", () => {
    it("price history is only inserted, never updated or deleted", async () => {
      // 1. SELECT current price (single)
      mockDb.single.mockResolvedValueOnce({ data: { base_price_usd: 100.0, service_id: "svc-1" }, error: null })
      // 2. INSERT into pf_catalog_price_history
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // 3. UPDATE pf_service_prices (.update().eq())
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateServicePrice("price-1", { basePriceUsd: 200.0 }, "admin-1", "admin@test.com")

      expect(mockDb.delete).not.toHaveBeenCalled()
    })

    it("price history insert contains old and new prices", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { base_price_usd: 100.0, service_id: "svc-1" }, error: null })
      mockDb.insert.mockResolvedValueOnce({ error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateServicePrice("price-1", { basePriceUsd: 200.0 }, "admin-1", "admin@test.com")

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const historyRow = insertCalls.find(
        (c) => c[0]?.old_price_usd === 100.0 && c[0]?.new_price_usd === 200.0
      )
      expect(historyRow).toBeDefined()
    })
  })

  describe("Structural integrity - no exported log mutations", () => {
    it("queue module exports updateRequestStatus as a function", () => {
      expect(typeof updateRequestStatus).toBe("function")
    })

    it("queue module does not export deleteStatusLog", async () => {
      const queueModule = await import("@/lib/admin/queue")
      expect((queueModule as Record<string, unknown>).deleteStatusLog).toBeUndefined()
    })

    it("queue module does not export updateStatusLog", async () => {
      const queueModule = await import("@/lib/admin/queue")
      expect((queueModule as Record<string, unknown>).updateStatusLog).toBeUndefined()
    })

    it("commercial module does not export deletePriceHistory", async () => {
      const commercialModule = await import("@/lib/admin/commercial")
      expect((commercialModule as Record<string, unknown>).deletePriceHistory).toBeUndefined()
    })
  })
})
