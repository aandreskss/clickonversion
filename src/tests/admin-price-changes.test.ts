import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/server"
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

// Helper for update().eq() terminal queries
function resolveOk() {
  return { eq: vi.fn().mockResolvedValue({ error: null }) }
}

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── Tests ─────────────────────────────────────────────────────────────────────
// updateServicePrice flow:
// 1. SELECT pf_service_prices.single() — gets current price
// 2. INSERT pf_catalog_price_history — records old/new
// 3. UPDATE pf_service_prices.eq() — applies new price

describe("Price change safety", () => {
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

  it("records price history when basePriceUsd changes", async () => {
    // 1. SELECT current price
    mockDb.single.mockResolvedValueOnce({ data: { base_price_usd: 500.0, service_id: "svc-1" }, error: null })
    // 2. INSERT history
    mockDb.insert.mockResolvedValueOnce({ error: null })
    // 3. UPDATE price
    mockDb.update.mockReturnValueOnce(resolveOk())

    await updateServicePrice("price-1", { basePriceUsd: 750.0 }, "admin-1", "admin@test.com")

    const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
    expect(fromCalls).toContain("pf_catalog_price_history")

    const insertCalls = vi.mocked(mockDb.insert).mock.calls
    const historyInsert = insertCalls.find(
      (c) => c[0]?.old_price_usd === 500.0 && c[0]?.new_price_usd === 750.0
    )
    expect(historyInsert).toBeDefined()
  })

  it("does NOT insert price history when only nameEn changes", async () => {
    // No SELECT needed (no price change), goes straight to UPDATE
    mockDb.update.mockReturnValueOnce(resolveOk())

    await updateServicePrice("price-1", { nameEn: "New Name" }, "admin-1", "admin@test.com")

    const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
    expect(fromCalls).not.toContain("pf_catalog_price_history")
  })

  it("stores changedByEmail in history record", async () => {
    const testEmail = "test@admin.com"

    mockDb.single.mockResolvedValueOnce({ data: { base_price_usd: 100.0, service_id: "svc-1" }, error: null })
    mockDb.insert.mockResolvedValueOnce({ error: null })
    mockDb.update.mockReturnValueOnce(resolveOk())

    await updateServicePrice("price-1", { basePriceUsd: 200.0 }, "admin-1", testEmail)

    const insertCalls = vi.mocked(mockDb.insert).mock.calls
    const historyInsert = insertCalls.find((c) => c[0]?.changed_by_email === testEmail)
    expect(historyInsert).toBeDefined()
  })

  it("never updates pf_order_items when price changes", async () => {
    mockDb.single.mockResolvedValueOnce({ data: { base_price_usd: 100.0, service_id: "svc-1" }, error: null })
    mockDb.insert.mockResolvedValueOnce({ error: null })
    mockDb.update.mockReturnValueOnce(resolveOk())

    await updateServicePrice("price-1", { basePriceUsd: 200.0 }, "admin-1", "admin@test.com")

    const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
    expect(fromCalls).not.toContain("pf_order_items")
  })

  it("price history insert captures service_id from the fetched record", async () => {
    mockDb.single.mockResolvedValueOnce({ data: { base_price_usd: 200.0, service_id: "svc-abc" }, error: null })
    mockDb.insert.mockResolvedValueOnce({ error: null })
    mockDb.update.mockReturnValueOnce(resolveOk())

    await updateServicePrice("price-1", { basePriceUsd: 300.0 }, "admin-1", "admin@test.com")

    const insertCalls = vi.mocked(mockDb.insert).mock.calls
    const historyInsert = insertCalls.find((c) => c[0]?.service_id === "svc-abc")
    expect(historyInsert).toBeDefined()
  })

  it("does nothing when empty data is passed", async () => {
    await updateServicePrice("price-1", {}, "admin-1", "admin@test.com")

    expect(mockDb.update).not.toHaveBeenCalled()
    expect(mockDb.insert).not.toHaveBeenCalled()
  })
})
