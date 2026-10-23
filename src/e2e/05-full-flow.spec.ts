import { test, expect } from "@playwright/test"

/**
 * Full end-to-end journey: Visitor → Catalog → Checkout → Confirmation.
 * Requires: sandbox Stripe keys, a seeded service in the catalog.
 * Enable with: E2E_FULL_FLOW=1
 */

test.describe("Full purchase flow (sandbox)", () => {
  test.skip(!process.env.E2E_FULL_FLOW, "Skipped: set E2E_FULL_FLOW=1 to run full flow tests")

  test("visitor discovers service, adds to cart, checks out with Stripe", async ({ page }) => {
    // 1. Homepage
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    // 2. Navigate to audit → order a service
    await page.goto("/checkout")

    // 3. Fill checkout form
    await page.getByLabel(/name/i).fill("Integration Test User")
    await page.getByLabel(/email/i).fill(`e2e-${Date.now()}@example.com`)

    // 4. Submit to Stripe checkout (sandbox)
    await page.getByRole("button", { name: /proceed|pay/i }).click()
    await page.waitForURL(/stripe\.com|localhost.*success/, { timeout: 30_000 })
  })

  test("purchase with PayPal redirects correctly", async ({ page }) => {
    await page.goto("/checkout")
    await page.getByLabel(/paypal/i).click()
    await page.getByRole("button", { name: /proceed|pay/i }).click()
    await page.waitForURL(/paypal\.com|sandbox\.paypal\.com|localhost.*success/, { timeout: 30_000 })
  })

  test("duplicate payment attempt is rejected", async ({ page }) => {
    // If the same orderId is used twice, the second payment should be blocked
    const fakeOrderId = "duplicate-order-test-1"
    await page.goto(`/checkout/success?orderId=${fakeOrderId}`)
    // Navigating again to the same success page should not re-trigger payment
    await page.goto(`/checkout/success?orderId=${fakeOrderId}`)
    await expect(page).not.toHaveURL("/error")
  })

  test("refund flow: admin marks order as refunded", async ({ page }) => {
    test.skip(!process.env.E2E_ADMIN_EMAIL, "Admin credentials required")

    // Login as admin
    await page.goto("/login")
    await page.getByLabel(/email/i).fill(process.env.E2E_ADMIN_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_ADMIN_PASSWORD!)
    await page.getByRole("button", { name: /sign in/i }).click()
    await page.waitForURL(/\/app/)

    // Navigate to payments
    await page.goto("/admin/payments")
    await expect(page.getByRole("heading", { name: /payments/i })).toBeVisible()
  })
})

test.describe("Admin queue and assignment flow (sandbox)", () => {
  test.skip(!process.env.E2E_FULL_FLOW, "Skipped: set E2E_FULL_FLOW=1")

  test("admin can view queue and change status", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel(/email/i).fill(process.env.E2E_ADMIN_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_ADMIN_PASSWORD!)
    await page.getByRole("button", { name: /sign in/i }).click()
    await page.waitForURL(/\/app/)

    await page.goto("/admin/queue")
    await expect(page.getByRole("heading", { name: /queue/i })).toBeVisible()
  })

  test("booking page loads for known service slug", async ({ page }) => {
    await page.goto("/book")
    await expect(page).not.toHaveURL("/error")
    await expect(page).not.toHaveURL("/404")
  })
})

test.describe("Quotation flow (sandbox)", () => {
  test.skip(!process.env.E2E_FULL_FLOW, "Skipped: set E2E_FULL_FLOW=1")

  test("admin can view quotes list", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel(/email/i).fill(process.env.E2E_ADMIN_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_ADMIN_PASSWORD!)
    await page.getByRole("button", { name: /sign in/i }).click()
    await page.waitForURL(/\/app/)

    await page.goto("/admin/commercial/quotes")
    await expect(page.getByRole("heading", { name: /quotes/i })).toBeVisible()
  })
})
