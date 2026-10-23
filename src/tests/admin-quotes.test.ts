import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/server"
import { getQuotes, updateQuote, createQuotePaymentLink } from "@/lib/admin/commercial"

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
  createClient: vi.fn(),
}))

const mockPaymentLinksCreate = vi.fn().mockResolvedValue({
  url: "https://buy.stripe.com/test_link_123",
})

vi.mock("stripe", () => {
  return {
    default: class MockStripe {
      paymentLinks = { create: mockPaymentLinksCreate }
    },
  }
})

// ── Mock helpers ──────────────────────────────────────────────────────────────

function resolveOk() {
  return { eq: vi.fn().mockResolvedValue({ error: null }) }
}

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

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Quotes management", () => {
  let mockDb: MockSupabase

  beforeEach(() => {
    mockDb = createMockSupabase()
    vi.mocked(createAdminClient).mockReturnValue(
      mockDb as unknown as ReturnType<typeof createAdminClient>
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    mockPaymentLinksCreate.mockResolvedValue({ url: "https://buy.stripe.com/test_link_123" })
  })

  describe("getQuotes", () => {
    it("queries pf_quotes table", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getQuotes()

      expect(mockDb.from).toHaveBeenCalledWith("pf_quotes")
    })

    it("filters by status when status provided", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getQuotes({ status: "draft" })

      const eqCalls = vi.mocked(mockDb.eq).mock.calls
      const statusFilter = eqCalls.find((c) => c[0] === "status" && c[1] === "draft")
      expect(statusFilter).toBeDefined()
    })

    it("does not filter by status when no status provided", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 0, error: null })

      await getQuotes()

      const eqCalls = vi.mocked(mockDb.eq).mock.calls
      const statusFilter = eqCalls.find((c) => c[0] === "status")
      expect(statusFilter).toBeUndefined()
    })

    it("returns items array from response", async () => {
      const mockQuote = {
        id: "q-1",
        order_id: null,
        client_email: "client@test.com",
        client_name: "Test Client",
        client_company: null,
        services_requested: [],
        status: "draft",
        client_notes: null,
        scope: null,
        proposed_price_usd: null,
        proposal_notes: null,
        payment_link: null,
        proposal_sent_at: null,
        accepted_at: null,
        expires_at: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      }

      mockDb.range.mockResolvedValueOnce({ data: [mockQuote], count: 1, error: null })

      const result = await getQuotes()

      expect(result.items).toHaveLength(1)
      expect(result.items[0].clientEmail).toBe("client@test.com")
    })

    it("returns pagination metadata", async () => {
      mockDb.range.mockResolvedValueOnce({ data: [], count: 42, error: null })

      const result = await getQuotes({ page: 2 })

      expect(result.total).toBe(42)
      expect(result.page).toBe(2)
    })
  })

  describe("updateQuote", () => {
    it("updates status field correctly", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateQuote("quote-1", { status: "proposal_sent" })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      expect(updateCalls[0][0]).toHaveProperty("status", "proposal_sent")
    })

    it("updates proposedPriceUsd as proposed_price_usd in DB", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateQuote("quote-1", { proposedPriceUsd: 1500 })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      expect(updateCalls[0][0]).toHaveProperty("proposed_price_usd", 1500)
    })

    it("does not call update when no data provided", async () => {
      await updateQuote("quote-1", {})

      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it("updates paymentLink as payment_link in DB", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateQuote("quote-1", { paymentLink: "https://buy.stripe.com/abc123" })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      expect(updateCalls[0][0]).toHaveProperty("payment_link", "https://buy.stripe.com/abc123")
    })
  })

  describe("createQuotePaymentLink", () => {
    // createQuotePaymentLink flow:
    // 1. Stripe paymentLinks.create() → returns { url }
    // 2. from("pf_quotes").update({ payment_link, updated_at }).eq("id", quoteId)
    // Terminal: .update().eq() — use resolveOk()

    it("calls Stripe paymentLinks.create", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await createQuotePaymentLink({
        quoteId: "quote-1",
        amountUsd: 500,
        description: "SEO Audit Service",
      })

      expect(mockPaymentLinksCreate).toHaveBeenCalled()
    })

    it("updates pf_quotes with payment_link after Stripe call", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await createQuotePaymentLink({
        quoteId: "quote-1",
        amountUsd: 500,
        description: "SEO Service",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_quotes")

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      const quoteUpdate = updateCalls.find((c) => c[0]?.payment_link !== undefined)
      expect(quoteUpdate).toBeDefined()
      expect(quoteUpdate?.[0]?.payment_link).toBe("https://buy.stripe.com/test_link_123")
    })

    it("returns the Stripe payment link URL", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      const result = await createQuotePaymentLink({
        quoteId: "quote-1",
        amountUsd: 500,
        description: "SEO Service",
      })

      expect(result).toBe("https://buy.stripe.com/test_link_123")
    })
  })
})
