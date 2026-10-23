import { describe, it, expect } from "vitest"
import { splitValidatedItems, calculateOrderTotals } from "@/lib/orders/splits"
import type { ValidatedItem } from "@/lib/catalog/queries"

const makeItem = (overrides: Partial<ValidatedItem> = {}): ValidatedItem => ({
  serviceId:      "aaaaaaaa-0000-0000-0000-000000000001",
  priceId:        "bbbbbbbb-0000-0000-0000-000000000001",
  quantity:       1,
  unitPriceUsd:   100,
  lineTotalUsd:   100,
  priceType:      "ONE_TIME",
  billingPeriod:  "one_time",
  serviceName:    "SEO Audit",
  priceTierName:  "Standard",
  ...overrides,
})

describe("splitValidatedItems", () => {
  it("correctly splits one-time items", () => {
    const items = [makeItem({ priceType: "ONE_TIME" })]
    const { oneTime, recurring, quotes } = splitValidatedItems(items)
    expect(oneTime).toHaveLength(1)
    expect(recurring).toHaveLength(0)
    expect(quotes).toHaveLength(0)
  })

  it("correctly splits recurring items", () => {
    const items = [makeItem({ priceType: "RECURRING", billingPeriod: "monthly" })]
    const { oneTime, recurring, quotes } = splitValidatedItems(items)
    expect(oneTime).toHaveLength(0)
    expect(recurring).toHaveLength(1)
    expect(quotes).toHaveLength(0)
  })

  it("routes STARTING_AT to quotes", () => {
    const items = [makeItem({ priceType: "STARTING_AT" })]
    const { quotes } = splitValidatedItems(items)
    expect(quotes).toHaveLength(1)
  })

  it("routes CUSTOM_QUOTE to quotes", () => {
    const items = [makeItem({ priceType: "CUSTOM_QUOTE" })]
    const { quotes } = splitValidatedItems(items)
    expect(quotes).toHaveLength(1)
  })

  it("handles mixed cart correctly", () => {
    const items = [
      makeItem({ priceType: "ONE_TIME",    priceId: "b1", unitPriceUsd: 120, lineTotalUsd: 120 }),
      makeItem({ priceType: "RECURRING",   priceId: "b2", unitPriceUsd: 180, lineTotalUsd: 180, billingPeriod: "monthly" }),
      makeItem({ priceType: "STARTING_AT", priceId: "b3", unitPriceUsd: 350, lineTotalUsd: 350 }),
    ]
    const { oneTime, recurring, quotes } = splitValidatedItems(items)
    expect(oneTime).toHaveLength(1)
    expect(recurring).toHaveLength(1)
    expect(quotes).toHaveLength(1)
  })
})

describe("calculateOrderTotals", () => {
  it("calculates correct totals for one-time only cart", () => {
    const items = [makeItem({ unitPriceUsd: 120, lineTotalUsd: 120 })]
    const totals = calculateOrderTotals(items)
    expect(totals.totalUsd).toBe(120)
    expect(totals.recurringTotalUsd).toBe(0)
    expect(totals.hasPayableItems).toBe(true)
    expect(totals.hasQuoteItems).toBe(false)
    expect(totals.nextBillingDate).toBeNull()
  })

  it("calculates correct totals for recurring only cart", () => {
    const items = [makeItem({ priceType: "RECURRING", billingPeriod: "monthly", unitPriceUsd: 180, lineTotalUsd: 180 })]
    const totals = calculateOrderTotals(items)
    expect(totals.totalUsd).toBe(180)           // first month
    expect(totals.recurringTotalUsd).toBe(180)  // ongoing
    expect(totals.nextBillingDate).not.toBeNull()
  })

  it("calculates correct totals for mixed cart", () => {
    const items = [
      makeItem({ priceType: "ONE_TIME",  priceId: "b1", unitPriceUsd: 120, lineTotalUsd: 120 }),
      makeItem({ priceType: "RECURRING", priceId: "b2", unitPriceUsd: 180, lineTotalUsd: 180, billingPeriod: "monthly" }),
    ]
    const totals = calculateOrderTotals(items)
    expect(totals.totalUsd).toBe(300)           // 120 + 180 today
    expect(totals.recurringTotalUsd).toBe(180)  // only the recurring part
    expect(totals.hasPayableItems).toBe(true)
  })

  it("sets hasQuoteItems for quote-only cart", () => {
    const items = [makeItem({ priceType: "CUSTOM_QUOTE", unitPriceUsd: 0, lineTotalUsd: 0 })]
    const totals = calculateOrderTotals(items)
    expect(totals.hasPayableItems).toBe(false)
    expect(totals.hasQuoteItems).toBe(true)
    expect(totals.totalUsd).toBe(0)
  })

  it("handles quantity > 1 correctly", () => {
    const items = [makeItem({ quantity: 3, unitPriceUsd: 70, lineTotalUsd: 210 })]
    const totals = calculateOrderTotals(items)
    expect(totals.totalUsd).toBe(210)
  })
})
