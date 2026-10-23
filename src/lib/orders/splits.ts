import type { CartItem, CartSplit } from "@/types/catalog"
import type { ValidatedItem } from "@/lib/catalog/queries"

/**
 * Split validated cart items into three buckets:
 *   - oneTimeItems:  chargeable now, single payment
 *   - recurringItems: creates subscription(s)
 *   - quoteItems:    STARTING_AT or CUSTOM_QUOTE — removed from payment flow, goes to quote
 *
 * Called server-side after price validation. Never called from the browser.
 */
export function splitValidatedItems(items: ValidatedItem[]): {
  oneTime:   ValidatedItem[]
  recurring: ValidatedItem[]
  quotes:    ValidatedItem[]
} {
  return {
    oneTime:   items.filter((i) => i.priceType === "ONE_TIME"),
    recurring: items.filter((i) => i.priceType === "RECURRING"),
    quotes:    items.filter((i) => i.priceType === "STARTING_AT" || i.priceType === "CUSTOM_QUOTE"),
  }
}

/** Client-side split for preview display in cart/checkout UI */
export function splitCartItems(items: CartItem[]): CartSplit {
  return {
    oneTimeItems:   items.filter((i) => i.priceType === "ONE_TIME"),
    recurringItems: items.filter((i) => i.priceType === "RECURRING"),
    quoteItems:     items.filter((i) => i.priceType === "STARTING_AT" || i.priceType === "CUSTOM_QUOTE"),
  }
}

export interface OrderTotals {
  subtotalUsd:       number
  taxUsd:            number   // 0 for now — future use
  totalUsd:          number   // what's charged today
  recurringTotalUsd: number   // monthly charge after today
  hasPayableItems:   boolean
  hasQuoteItems:     boolean
  nextBillingDate:   string | null
}

export function calculateOrderTotals(items: ValidatedItem[]): OrderTotals {
  const { oneTime, recurring, quotes } = splitValidatedItems(items)

  const oneTimeTotal   = oneTime.reduce((s, i) => s + i.lineTotalUsd, 0)
  const recurringTotal = recurring.reduce((s, i) => s + i.lineTotalUsd, 0)
  const todayCharge    = oneTimeTotal + recurringTotal   // subscription first invoice

  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

  return {
    subtotalUsd:       todayCharge,
    taxUsd:            0,
    totalUsd:          todayCharge,
    recurringTotalUsd: recurringTotal,
    hasPayableItems:   todayCharge > 0,
    hasQuoteItems:     quotes.length > 0,
    nextBillingDate:   recurringTotal > 0 ? nextMonth.toISOString() : null,
  }
}
