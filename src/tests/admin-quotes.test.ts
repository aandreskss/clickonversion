import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
import { getQuotes, updateQuote, createQuotePaymentLink } from "@/lib/admin/commercial"

vi.mock("@/lib/db", () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), query: {} },
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

function makeQuote(overrides: Record<string, unknown> = {}) {
  return {
    id: "quote-1",
    clientEmail: "client@test.com",
    clientName: "Test Client",
    clientCompany: null,
    servicesRequested: [],
    status: "pending",
    clientNotes: null,
    scope: null,
    proposedPriceUsd: null,
    proposalNotes: null,
    paymentLink: null,
    proposalSentAt: null,
    acceptedAt: null,
    expiresAt: null,
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
  mockPaymentLinksCreate.mockClear()
})

// ── getQuotes ─────────────────────────────────────────────────────────────────

describe("getQuotes", () => {
  it("returns paginated quotes", async () => {
    const quote = makeQuote()
    next([quote])          // rows (first db.select call)
    next([{ count: 1 }])  // count (second db.select call)

    const result = await getQuotes()

    expect(result.items).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
  })

  it("returns empty list when no quotes", async () => {
    next([])
    next([{ count: 0 }])

    const result = await getQuotes()
    expect(result.items).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it("respects page parameter", async () => {
    next([])
    next([{ count: 25 }])

    const result = await getQuotes({ page: 2, pageSize: 10 })
    expect(result.page).toBe(2)
  })
})

// ── updateQuote ───────────────────────────────────────────────────────────────

describe("updateQuote", () => {
  it("maps proposedPriceUsd to string", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    await updateQuote("quote-1", { proposedPriceUsd: 999 })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ proposedPriceUsd: "999" })
    )
  })

  it("sets proposedPriceUsd to null when null passed", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    await updateQuote("quote-1", { proposedPriceUsd: null })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ proposedPriceUsd: null })
    )
  })

  it("does nothing when no fields provided", async () => {
    await updateQuote("quote-1", {})
    expect(vi.mocked(db.update)).not.toHaveBeenCalled()
  })

  it("updates status field directly", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    await updateQuote("quote-1", { status: "proposal_sent" })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ status: "proposal_sent" })
    )
  })
})

// ── createQuotePaymentLink ────────────────────────────────────────────────────

describe("createQuotePaymentLink", () => {
  it("calls Stripe to create payment link", async () => {
    next([])  // update quote with link

    await createQuotePaymentLink({
      quoteId: "quote-1",
      amountUsd: 500,
      description: "SEO Package",
    })

    expect(mockPaymentLinksCreate).toHaveBeenCalledTimes(1)
    expect(mockPaymentLinksCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 50000,  // $500 × 100
            }),
          }),
        ]),
      })
    )
  })

  it("persists payment link URL to quote", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    const url = await createQuotePaymentLink({
      quoteId: "quote-1",
      amountUsd: 500,
      description: "SEO Package",
    })

    expect(url).toBe("https://buy.stripe.com/test_link_123")
    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ paymentLink: "https://buy.stripe.com/test_link_123" })
    )
  })
})
