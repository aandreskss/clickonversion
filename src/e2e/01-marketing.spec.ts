import { test, expect } from "@playwright/test"

test.describe("Marketing — navigation and indexability", () => {
  test("homepage loads and has primary CTA", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/ClicKonversion/)
    await expect(page.getByRole("link", { name: /Get a Free Audit/i }).first()).toBeVisible()
  })

  test("navbar contains Apps link", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: "Apps" })).toBeVisible()
  })

  test("/apps catalog loads", async ({ page }) => {
    await page.goto("/apps")
    await expect(page).toHaveTitle(/Apps/)
    await expect(page.getByRole("heading", { name: /SyncLead/i })).toBeVisible()
  })

  test("/apps/synclead landing loads", async ({ page }) => {
    await page.goto("/apps/synclead")
    await expect(page).toHaveTitle(/SyncLead/)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("link", { name: /Request early access/i })).toBeVisible()
  })

  test("/apps/synclead has waitlist form", async ({ page }) => {
    await page.goto("/apps/synclead#waitlist")
    const input = page.getByLabel(/email address/i)
    await expect(input).toBeVisible()
  })

  test("/audit page loads", async ({ page }) => {
    await page.goto("/audit")
    await expect(page).toHaveTitle(/Audit/)
  })

  test("sitemap.xml is accessible and includes /apps", async ({ page }) => {
    const res = await page.goto("/sitemap.xml")
    expect(res?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain("/apps")
    expect(body).toContain("/apps/synclead")
  })

  test("robots.txt disallows private routes", async ({ page }) => {
    const res = await page.goto("/robots.txt")
    expect(res?.status()).toBe(200)
    const body = await page.content()
    expect(body).toContain("Disallow: /portal/")
    expect(body).toContain("Disallow: /admin/")
    expect(body).toContain("Disallow: /api/")
  })

  test("404 page renders for unknown routes", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist")
    expect(res?.status()).toBe(404)
  })
})

test.describe("Marketing — mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/")
    const toggle = page.getByRole("button", { name: /open navigation/i })
    await toggle.click()
    await expect(page.getByRole("navigation", { name: /mobile navigation/i })).toBeVisible()
    await page.getByRole("button", { name: /close navigation/i }).click()
    await expect(page.getByRole("navigation", { name: /mobile navigation/i })).toBeHidden()
  })

  test("/apps loads on mobile", async ({ page }) => {
    await page.goto("/apps")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })
})
