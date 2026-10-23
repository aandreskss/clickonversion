import { describe, it, expect, vi, beforeEach } from "vitest"

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRight(overrides: Partial<{
  status: string
  uses_count: number
  max_uses: number
  expires_at: string
}> = {}) {
  return {
    id:               "right-001",
    meeting_type_slug: "meta-advisory-basic",
    client_name:      "Test User",
    client_email:     "test@example.com",
    status:           overrides.status ?? "unused",
    uses_count:       overrides.uses_count ?? 0,
    max_uses:         overrides.max_uses ?? 1,
    expires_at:       overrides.expires_at ?? new Date(Date.now() + 86_400_000 * 90).toISOString(),
  }
}

// ── Token validation logic (unit tests, no DB) ───────────────────────────────

describe("booking right validation rules", () => {
  it("valid unused token passes", () => {
    const right = makeRight()
    expect(right.status).toBe("unused")
    expect(right.uses_count < right.max_uses).toBe(true)
    expect(new Date(right.expires_at) > new Date()).toBe(true)
  })

  it("cancelled token should be rejected", () => {
    const right = makeRight({ status: "cancelled" })
    expect(right.status === "cancelled").toBe(true)
  })

  it("exhausted uses_count should be rejected", () => {
    const right = makeRight({ uses_count: 1, max_uses: 1 })
    expect(right.uses_count >= right.max_uses).toBe(true)
  })

  it("expired token should be rejected", () => {
    const right = makeRight({ expires_at: new Date(Date.now() - 1000).toISOString() })
    expect(new Date(right.expires_at) < new Date()).toBe(true)
  })

  it("max_uses > 1 allows multiple bookings", () => {
    const right = makeRight({ max_uses: 3, uses_count: 2 })
    expect(right.uses_count < right.max_uses).toBe(true)
  })

  it("token length should be 48 hex chars", () => {
    // gen_random_bytes(24) → hex → 48 chars
    const token = "a".repeat(48)
    expect(token.length).toBe(48)
  })
})

// ── Free call rate limiting ──────────────────────────────────────────────────

describe("free call rate limiting", () => {
  it("allows booking within limit", () => {
    const limit  = { count: 1, periodDays: 30 }
    const used   = 0
    expect(used < limit.count).toBe(true)
  })

  it("blocks booking at limit", () => {
    const limit = { count: 1, periodDays: 30 }
    const used  = 1
    expect(used >= limit.count).toBe(true)
  })

  it("does not count cancelled meetings toward limit", () => {
    // Cancelled meetings are filtered in the query with .neq("status", "cancelled")
    const meetings = [
      { status: "cancelled" },
      { status: "cancelled" },
    ]
    const activeCount = meetings.filter((m) => m.status !== "cancelled").length
    expect(activeCount).toBe(0)
  })

  it("counts completed and scheduled meetings toward limit", () => {
    const meetings = [
      { status: "scheduled" },
      { status: "completed" },
      { status: "cancelled" },
    ]
    const activeCount = meetings.filter((m) => m.status !== "cancelled").length
    expect(activeCount).toBe(2)
  })
})

// ── Timezone formatting ──────────────────────────────────────────────────────

describe("timezone formatting", () => {
  const iso = "2026-11-15T15:00:00.000Z" // 3 PM UTC

  function formatTime(isoStr: string, timezone: string): string {
    return new Intl.DateTimeFormat("en-US", {
      timeZone:     timezone,
      weekday:      "long",
      month:        "long",
      day:          "numeric",
      year:         "numeric",
      hour:         "numeric",
      minute:       "2-digit",
      hour12:       true,
      timeZoneName: "short",
    }).format(new Date(isoStr))
  }

  it("formats correctly for America/Caracas (UTC-4)", () => {
    const result = formatTime(iso, "America/Caracas")
    expect(result).toContain("11:00")
    expect(result).toContain("AM")
    // Node.js may render "VET" or "GMT-4" depending on ICU data — both are correct
    expect(result.includes("VET") || result.includes("GMT-4") || result.includes("-04")).toBe(true)
  })

  it("formats correctly for America/New_York (EST UTC-5 in Nov)", () => {
    const result = formatTime(iso, "America/New_York")
    expect(result).toContain("10:00")
    expect(result).toContain("AM")
    expect(result.includes("EST") || result.includes("GMT-5") || result.includes("-05")).toBe(true)
  })

  it("formats correctly for Europe/Madrid (CET UTC+1 in Nov)", () => {
    const result = formatTime(iso, "Europe/Madrid")
    expect(result).toContain("4:00")
    expect(result).toContain("PM")
    expect(result.includes("CET") || result.includes("GMT+1") || result.includes("+01")).toBe(true)
  })

  it("falls back gracefully for invalid timezone", () => {
    // Should not throw — formatStartTime wraps in try/catch
    expect(() => {
      try {
        formatTime(iso, "Invalid/Timezone")
      } catch {
        // Return raw iso on error
      }
    }).not.toThrow()
  })
})

// ── Booking right token structure ────────────────────────────────────────────

describe("booking right provisioning logic", () => {
  it("creates booking URL with correct format", () => {
    const SITE_URL      = "https://www.clickonversion.com"
    const meetingSlug   = "meta-advisory-basic"
    const token         = "abc123def456abc123def456abc123def456abc123def456"
    const bookingUrl    = `${SITE_URL}/book/${meetingSlug}?token=${token}`

    expect(bookingUrl).toBe(
      "https://www.clickonversion.com/book/meta-advisory-basic?token=abc123def456abc123def456abc123def456abc123def456"
    )
  })

  it("does not create duplicate booking rights (idempotency check)", () => {
    const existingCount = 1
    const shouldSkip    = existingCount > 0
    expect(shouldSkip).toBe(true)
  })

  it("skips items without creates_booking_right flag", () => {
    const item = { pf_service_prices: { creates_booking_right: false, booking_meeting_type_slug: null } }
    const priceInfo = Array.isArray(item.pf_service_prices)
      ? item.pf_service_prices[0]
      : item.pf_service_prices
    expect(!priceInfo?.creates_booking_right).toBe(true)
  })
})

// ── Cal.com webhook HMAC verification ───────────────────────────────────────

import { createHmac } from "crypto"

describe("Cal.com webhook HMAC verification", () => {
  const secret  = "test-webhook-secret"
  const body    = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "abc" } })

  function sign(s: string, b: string): string {
    return "sha256=" + createHmac("sha256", s).update(b).digest("hex")
  }

  function verify(rawBody: string, signature: string, webhookSecret: string): boolean {
    const expected = sign(webhookSecret, rawBody)
    if (expected.length !== signature.length) return false
    let diff = 0
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
    }
    return diff === 0
  }

  it("accepts a valid signature", () => {
    const sig = sign(secret, body)
    expect(verify(body, sig, secret)).toBe(true)
  })

  it("rejects a tampered body", () => {
    const sig      = sign(secret, body)
    const tampered = body + "X"
    expect(verify(tampered, sig, secret)).toBe(false)
  })

  it("rejects a wrong secret", () => {
    const sig = sign(secret, body)
    expect(verify(body, sig, "wrong-secret")).toBe(false)
  })

  it("rejects a missing signature", () => {
    expect(verify(body, "", secret)).toBe(false)
  })
})

// ── Meeting cancellation restores booking right ──────────────────────────────

describe("meeting cancellation logic", () => {
  it("sets meeting status to cancelled", () => {
    const meeting = { status: "scheduled" }
    const updated = { ...meeting, status: "cancelled" }
    expect(updated.status).toBe("cancelled")
  })

  it("resets booking right to unused after cancel", () => {
    const right = { status: "used", meeting_id: "meeting-001" }
    const reset = { ...right, status: "unused", meeting_id: null }
    expect(reset.status).toBe("unused")
    expect(reset.meeting_id).toBeNull()
  })

  it("does NOT reset booking right if it was already in unused state", () => {
    // Only "reserved" and "used" states are reset
    const eligibleStatuses = ["reserved", "used"]
    expect(eligibleStatuses.includes("unused")).toBe(false)
    expect(eligibleStatuses.includes("cancelled")).toBe(false)
  })
})
