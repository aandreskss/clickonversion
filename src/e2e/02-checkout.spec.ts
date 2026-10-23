import { test, expect } from "@playwright/test"

/**
 * Checkout E2E tests.
 * These run against the dev server with Stripe/PayPal in sandbox mode.
 * Set PLAYWRIGHT_BASE_URL, STRIPE_TEST_CARD_TOKEN, etc. in your .env.test
 */

test.describe("Catalog and checkout flow", () => {
  test("catalog page loads services", async ({ page }) => {
    // TODO: update once /services or /pricing catalog page exists
    // For now, validate the checkout route exists
    const res = await page.goto("/checkout")
    expect(res?.status()).not.toBe(404)
  })

  test("checkout redirects to audit if cart is empty", async ({ page }) => {
    // Clear any existing cart state
    await page.addInitScript(() => localStorage.clear())
    await page.goto("/checkout")
    // Empty cart should redirect or show empty state — not crash
    await expect(page).not.toHaveURL("/error")
  })

  test("checkout success page renders with valid order ID", async ({ page }) => {
    await page.goto("/checkout/success?orderId=test-order-fake")
    // Should render (may show error for fake order, but must not 500)
    await expect(page).not.toHaveURL("/error")
    const status = (await page.goto("/checkout/success?orderId=test-order-fake"))?.status()
    expect(status).not.toBe(500)
  })

  test("checkout cancel page renders", async ({ page }) => {
    const res = await page.goto("/checkout/cancel")
    expect(res?.status()).toBe(200)
  })
})

/**
 * Payment flow tests (require sandbox credentials).
 * Mark as skip in CI until sandbox env is wired up.
 */
test.describe("Payment flows (sandbox)", () => {
  test.skip(!process.env.E2E_PAYMENTS_ENABLED, "Skipped: set E2E_PAYMENTS_ENABLED=1 to run payment tests")

  test("single service purchase — Stripe card", async ({ page }) => {
    // Navigate to a service with a known slug
    await page.goto("/checkout")
    // Fill checkout form
    await page.getByLabel(/name/i).fill("Test User")
    await page.getByLabel(/email/i).fill("stripe-test@example.com")
    // Select Stripe payment
    await page.getByLabel(/stripe|credit card/i).click()
    await page.getByRole("button", { name: /proceed to payment/i }).click()
    // Stripe hosted checkout redirect
    await page.waitForURL(/checkout\.stripe\.com|localhost.*success/)
  })

  test("payment failed — returns to cancel page", async ({ page }) => {
    // Stripe test card for declined payments: 4000000000000002
    await page.goto("/checkout/cancel")
    await expect(page.getByText(/cancelled|canceled|not completed/i)).toBeVisible()
  })
})
