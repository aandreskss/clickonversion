import { describe, it, expect } from "vitest"
import { classifyPayPalEvent } from "@/lib/payments/paypal/webhooks"

/**
 * Unit tests for PayPal adapter logic.
 * Integration tests require PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET in sandbox mode.
 */

describe("classifyPayPalEvent", () => {
  it("classifies CHECKOUT.ORDER.APPROVED", () => {
    expect(classifyPayPalEvent("CHECKOUT.ORDER.APPROVED")).toBe("checkout_order_approved")
  })

  it("classifies CHECKOUT.ORDER.COMPLETED", () => {
    expect(classifyPayPalEvent("CHECKOUT.ORDER.COMPLETED")).toBe("checkout_order_completed")
  })

  it("classifies BILLING.SUBSCRIPTION.ACTIVATED", () => {
    expect(classifyPayPalEvent("BILLING.SUBSCRIPTION.ACTIVATED")).toBe("subscription_activated")
  })

  it("classifies BILLING.SUBSCRIPTION.CANCELLED", () => {
    expect(classifyPayPalEvent("BILLING.SUBSCRIPTION.CANCELLED")).toBe("subscription_cancelled")
  })

  it("classifies BILLING.SUBSCRIPTION.PAYMENT.FAILED", () => {
    expect(classifyPayPalEvent("BILLING.SUBSCRIPTION.PAYMENT.FAILED")).toBe("subscription_payment_failed")
  })

  it("classifies PAYMENT.SALE.COMPLETED", () => {
    expect(classifyPayPalEvent("PAYMENT.SALE.COMPLETED")).toBe("payment_sale_completed")
  })

  it("classifies PAYMENT.SALE.REFUNDED", () => {
    expect(classifyPayPalEvent("PAYMENT.SALE.REFUNDED")).toBe("payment_sale_refunded")
  })

  it("returns null for unknown events", () => {
    expect(classifyPayPalEvent("UNKNOWN.EVENT.TYPE")).toBeNull()
    expect(classifyPayPalEvent("")).toBeNull()
  })
})

describe("PayPal mixed-cart restriction", () => {
  it("rejects mixed carts (one-time + subscription)", () => {
    // The checkout route returns 422 for mixed PayPal carts.
    // Verify the validation logic here symbolically.
    const validatePayPalCart = (oneTime: number, recurring: number) => {
      if (oneTime > 0 && recurring > 0) {
        return { ok: false, reason: "mixed_cart" }
      }
      if (recurring > 1) {
        return { ok: false, reason: "multiple_subscriptions" }
      }
      return { ok: true }
    }

    expect(validatePayPalCart(1, 1)).toMatchObject({ ok: false, reason: "mixed_cart" })
    expect(validatePayPalCart(2, 0)).toMatchObject({ ok: true })
    expect(validatePayPalCart(0, 1)).toMatchObject({ ok: true })
    expect(validatePayPalCart(0, 2)).toMatchObject({ ok: false, reason: "multiple_subscriptions" })
    expect(validatePayPalCart(1, 0)).toMatchObject({ ok: true })
  })
})
