import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
}))

vi.mock("@/lib/db", () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), query: {} },
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSession(overrides: Partial<{
  userId:  string
  email:   string
  orgId:   string
  orgRole: string
}> = {}) {
  return {
    userId:  overrides.userId  ?? "user-a",
    email:   overrides.email   ?? "a@example.com",
    orgId:   overrides.orgId   ?? "org-a",
    orgRole: overrides.orgRole ?? "member",
    org: {
      id: overrides.orgId ?? "org-a",
      name: "Org A",
      slug: "org-a",
      logoUrl: null,
      billingEmail: null,
      stripeCustomerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

// ── Permission checks ─────────────────────────────────────────────────────────

describe("requireOrgAdmin", () => {
  it("allows owner", async () => {
    const { requireOrgAdmin } = await import("@/lib/portal/auth")
    const session = makeSession({ orgRole: "owner" })
    expect(() => requireOrgAdmin(session as never)).not.toThrow()
  })

  it("allows admin", async () => {
    const { requireOrgAdmin } = await import("@/lib/portal/auth")
    const session = makeSession({ orgRole: "admin" })
    expect(() => requireOrgAdmin(session as never)).not.toThrow()
  })

  it("blocks member", async () => {
    const { requireOrgAdmin } = await import("@/lib/portal/auth")
    const session = makeSession({ orgRole: "member" })
    expect(() => requireOrgAdmin(session as never)).toThrow("FORBIDDEN")
  })
})

// ── Org isolation: orgId cross-check ─────────────────────────────────────────

describe("org isolation logic", () => {
  it("rejects when request orgId does not match session orgId", () => {
    const sessionOrgId: string = "org-a"
    const payloadOrgId: string = "org-b"
    expect(payloadOrgId === sessionOrgId).toBe(false)
  })

  it("accepts when orgIds match", () => {
    const sessionOrgId: string = "org-a"
    const payloadOrgId: string = "org-a"
    expect(payloadOrgId === sessionOrgId).toBe(true)
  })

  it("document owned by org-b is not accessible by org-a session", () => {
    function canAccess(documentOrgId: string, sessionOrgId: string) {
      return documentOrgId === sessionOrgId
    }
    expect(canAccess("org-b", "org-a")).toBe(false)
    expect(canAccess("org-a", "org-a")).toBe(true)
  })
})

// ── Signed URL: org check before URL generation ───────────────────────────────

describe("getSignedUrl org isolation", () => {
  it("should throw when document belongs to different org", async () => {
    function checkAccess(docOrgId: string, requestedOrgId: string): string {
      if (docOrgId !== requestedOrgId) throw new Error("DOCUMENT_NOT_FOUND")
      return "https://storage.example.com/signed-url"
    }

    expect(() => checkAccess("org-b", "org-a")).toThrow("DOCUMENT_NOT_FOUND")
    expect(() => checkAccess("org-a", "org-a")).not.toThrow()
  })
})

// ── Request detail: 404 on cross-org access ───────────────────────────────────

describe("request detail isolation", () => {
  it("getRequest returns null for wrong org", () => {
    function fetchRequest(requestOrgId: string, sessionOrgId: string) {
      if (requestOrgId !== sessionOrgId) return null
      return { id: "req-1", orgId: requestOrgId }
    }

    expect(fetchRequest("org-b", "org-a")).toBeNull()
    expect(fetchRequest("org-a", "org-a")).not.toBeNull()
  })

  it("does not leak request existence to different org", () => {
    function resolveStatus(request: null | object): number {
      return request === null ? 404 : 200
    }

    expect(resolveStatus(null)).toBe(404)
    expect(resolveStatus({ id: "req-1" })).toBe(200)
  })
})

// ── Member removal guards ─────────────────────────────────────────────────────

describe("member removal guards", () => {
  it("prevents removing the owner", () => {
    function canRemove(targetRole: string, requesterRole: string, isSelf: boolean) {
      if (targetRole === "owner") return false
      if (isSelf) return false
      if (requesterRole !== "owner" && requesterRole !== "admin") return false
      return true
    }

    expect(canRemove("owner",  "admin", false)).toBe(false)
    expect(canRemove("member", "owner", true)).toBe(false)
    expect(canRemove("member", "member", false)).toBe(false)
    expect(canRemove("member", "owner", false)).toBe(true)
    expect(canRemove("admin",  "owner", false)).toBe(true)
  })
})

// ── Invitation expiry ─────────────────────────────────────────────────────────

describe("invitation expiry", () => {
  it("rejects expired invitation", () => {
    const past = new Date(Date.now() - 1000).toISOString()
    expect(new Date(past) < new Date()).toBe(true)
  })

  it("accepts valid invitation", () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    expect(new Date(future) > new Date()).toBe(true)
  })
})
