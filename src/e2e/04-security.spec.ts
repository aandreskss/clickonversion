import { test, expect } from "@playwright/test"

test.describe("Security — public API routes", () => {
  test("portal API returns 401 without auth", async ({ request }) => {
    const routes = [
      "/api/portal/requests",
      "/api/portal/documents",
      "/api/portal/notifications",
      "/api/portal/org",
    ]
    for (const route of routes) {
      const res = await request.get(route)
      expect(res.status(), `Expected 401 for ${route}`).toBe(401)
    }
  })

  test("admin API returns 401 without auth", async ({ request }) => {
    const routes = [
      "/api/admin/queue",
      "/api/admin/specialists",
      "/api/admin/commercial/quotes",
      "/api/admin/payments",
    ]
    for (const route of routes) {
      const res = await request.get(route)
      expect(res.status(), `Expected 401 for ${route}`).toBe(401)
    }
  })

  test("portal API does not expose internal_notes in unauthenticated response", async ({ request }) => {
    const res = await request.get("/api/portal/requests")
    expect(res.status()).toBe(401)
    const body = await res.text()
    expect(body).not.toContain("internal_notes")
    expect(body).not.toContain("is_internal")
  })

  test("waitlist API rate-limits excessive submissions", async ({ request }) => {
    const payload = { email: "ratelimit-test@example.com" }
    // Send 4 requests — 4th should be rate-limited (limit is 3/hour)
    for (let i = 0; i < 3; i++) {
      await request.post("/api/apps/synclead/waitlist", { data: payload })
    }
    const res = await request.post("/api/apps/synclead/waitlist", { data: payload })
    expect(res.status()).toBe(429)
  })

  test("audit API rejects missing required fields", async ({ request }) => {
    const res = await request.post("/api/audit", {
      data: { name: "Test" }, // missing email, website, etc.
      headers: { "Content-Type": "application/json" },
    })
    expect([400, 422]).toContain(res.status())
  })

  test("webhook endpoints reject requests without valid signatures", async ({ request }) => {
    const res = await request.post("/api/webhooks/stripe", {
      data: { type: "payment_intent.succeeded" },
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "invalid-signature",
      },
    })
    expect([400, 401, 403]).toContain(res.status())
  })
})

test.describe("Security — CSRF and input validation", () => {
  test("API routes reject invalid JSON", async ({ request }) => {
    const res = await request.post("/api/apps/synclead/waitlist", {
      data: "not-json",
      headers: { "Content-Type": "application/json" },
    })
    expect([400, 422]).toContain(res.status())
  })

  test("API routes reject invalid email", async ({ request }) => {
    const res = await request.post("/api/apps/synclead/waitlist", {
      data: { email: "not-an-email" },
    })
    expect([400, 422]).toContain(res.status())
  })

  test("private routes are excluded from sitemap", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    const body = await res.text()
    expect(body).not.toContain("/portal")
    expect(body).not.toContain("/admin")
    expect(body).not.toContain("/app/")
    expect(body).not.toContain("/api/")
    expect(body).not.toContain("/checkout")
  })
})
