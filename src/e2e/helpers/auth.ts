import type { Page } from "@playwright/test"

export const TEST_CLIENT = {
  email: process.env.E2E_CLIENT_EMAIL ?? "e2e-client@test.clickonversion.com",
  password: process.env.E2E_CLIENT_PASSWORD ?? "E2eTestPass!2026",
  orgName: "E2E Test Org",
}

export const TEST_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@test.clickonversion.com",
  password: process.env.E2E_ADMIN_PASSWORD ?? "E2eAdminPass!2026",
}

export async function loginAsClient(page: Page) {
  await page.goto("/portal/login")
  await page.getByLabel(/email/i).fill(TEST_CLIENT.email)
  await page.getByLabel(/password/i).fill(TEST_CLIENT.password)
  await page.getByRole("button", { name: /sign in|log in/i }).click()
  await page.waitForURL(/\/portal\/dashboard/)
}

export async function loginAsAdmin(page: Page) {
  await page.goto("/login")
  await page.getByLabel(/email/i).fill(TEST_ADMIN.email)
  await page.getByLabel(/password/i).fill(TEST_ADMIN.password)
  await page.getByRole("button", { name: /sign in|log in/i }).click()
  await page.waitForURL(/\/app/)
}
