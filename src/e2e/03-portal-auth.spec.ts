import { test, expect } from "@playwright/test"

test.describe("Portal — auth flows", () => {
  test("portal login page renders", async ({ page }) => {
    await page.goto("/portal/login")
    await expect(page).toHaveTitle(/login|sign in/i)
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("portal register page renders", async ({ page }) => {
    await page.goto("/portal/register")
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test("portal forgot-password page renders", async ({ page }) => {
    await page.goto("/portal/forgot-password")
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test("accessing portal without auth redirects to login", async ({ page }) => {
    await page.goto("/portal/dashboard")
    await expect(page).toHaveURL(/\/portal\/login/)
  })

  test("accessing portal requests without auth redirects to login", async ({ page }) => {
    await page.goto("/portal/requests")
    await expect(page).toHaveURL(/\/portal\/login/)
  })

  test("accessing portal documents without auth redirects to login", async ({ page }) => {
    await page.goto("/portal/documents")
    await expect(page).toHaveURL(/\/portal\/login/)
  })

  test("invalid login shows error", async ({ page }) => {
    await page.goto("/portal/login")
    await page.getByLabel(/email/i).fill("notexist@example.com")
    await page.getByLabel(/password/i).fill("wrongpassword")
    await page.getByRole("button", { name: /sign in|log in/i }).click()
    // Should stay on login page with error message
    await expect(page).toHaveURL(/\/portal\/login/)
    await expect(page.getByRole("alert").or(page.getByText(/invalid|incorrect|error/i))).toBeVisible()
  })
})

/**
 * Authenticated portal tests — require a seeded test account.
 * Run with E2E_PORTAL_ENABLED=1 and E2E_CLIENT_EMAIL / E2E_CLIENT_PASSWORD set.
 */
test.describe("Portal — authenticated (sandbox)", () => {
  test.skip(!process.env.E2E_PORTAL_ENABLED, "Skipped: set E2E_PORTAL_ENABLED=1 to run portal auth tests")

  test("login and reach dashboard", async ({ page }) => {
    await page.goto("/portal/login")
    await page.getByLabel(/email/i).fill(process.env.E2E_CLIENT_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_CLIENT_PASSWORD!)
    await page.getByRole("button", { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/portal\/dashboard/)
    await expect(page.getByText(/dashboard/i).first()).toBeVisible()
  })

  test("portal shows request list", async ({ page }) => {
    await page.goto("/portal/login")
    await page.getByLabel(/email/i).fill(process.env.E2E_CLIENT_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_CLIENT_PASSWORD!)
    await page.getByRole("button", { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/portal\/dashboard/)
    await page.goto("/portal/requests")
    await expect(page).toHaveURL(/\/portal\/requests/)
  })

  test("org A cannot access org B request by URL manipulation", async ({ page }) => {
    // Login as org A
    await page.goto("/portal/login")
    await page.getByLabel(/email/i).fill(process.env.E2E_CLIENT_EMAIL!)
    await page.getByLabel(/password/i).fill(process.env.E2E_CLIENT_PASSWORD!)
    await page.getByRole("button", { name: /sign in|log in/i }).click()
    await page.waitForURL(/\/portal\/dashboard/)

    // Try to access a known request from a different org
    const fakeRequestId = process.env.E2E_OTHER_ORG_REQUEST_ID ?? "00000000-0000-0000-0000-000000000001"
    await page.goto(`/portal/requests/${fakeRequestId}`)
    // Should see 404, not the request content
    const status = await page.evaluate(() => document.title)
    const body = await page.textContent("body")
    expect(body).not.toContain("internal_notes")
    // Either 404 or redirect to requests list
    const url = page.url()
    const isForbidden = url.includes("/portal/requests") && !url.includes(fakeRequestId)
    const is404 = (await page.title()).toLowerCase().includes("404") || (body ?? "").includes("not found")
    expect(isForbidden || is404).toBeTruthy()
  })
})
