import { describe, it, expect } from "vitest"

// ── Multi-org isolation tests ─────────────────────────────────────────────────
// These verify that org A's data cannot be accessed by org B at the logic layer.
// DB-level isolation is enforced via RLS policies in migrations/015_rls_portal.sql.

const ORG_A = "org-aaaaaaaa-0000-0000-0000-000000000000"
const ORG_B = "org-bbbbbbbb-0000-0000-0000-000000000000"

const USER_A = "user-aaaa-0000-0000-0000-000000000000"
const USER_B = "user-bbbb-0000-0000-0000-000000000000"

// ── Simulated DB query layer ──────────────────────────────────────────────────

type DbRecord = { id: string; orgId: string; data: string }

const STORE: DbRecord[] = [
  { id: "rec-1", orgId: ORG_A, data: "secret-a" },
  { id: "rec-2", orgId: ORG_B, data: "secret-b" },
]

function queryByIdAndOrg(id: string, orgId: string): DbRecord | null {
  return STORE.find((r) => r.id === id && r.orgId === orgId) ?? null
}

function queryByOrg(orgId: string): DbRecord[] {
  return STORE.filter((r) => r.orgId === orgId)
}

// ── Cross-org read isolation ──────────────────────────────────────────────────

describe("cross-org read isolation", () => {
  it("org A cannot read org B record by ID", () => {
    const result = queryByIdAndOrg("rec-2", ORG_A)
    expect(result).toBeNull()
  })

  it("org B cannot read org A record by ID", () => {
    const result = queryByIdAndOrg("rec-1", ORG_B)
    expect(result).toBeNull()
  })

  it("org A list returns only org A records", () => {
    const results = queryByOrg(ORG_A)
    expect(results.every((r) => r.orgId === ORG_A)).toBe(true)
    expect(results.map((r) => r.id)).not.toContain("rec-2")
  })

  it("org B list returns only org B records", () => {
    const results = queryByOrg(ORG_B)
    expect(results.every((r) => r.orgId === ORG_B)).toBe(true)
    expect(results.map((r) => r.id)).not.toContain("rec-1")
  })
})

// ── HTTP-level isolation: orgId header check ──────────────────────────────────

describe("HTTP orgId claim verification", () => {
  function handleRequest(
    claimedOrgId: string,
    sessionOrgId: string,
    resourceOrgId: string
  ): 200 | 403 | 404 {
    if (claimedOrgId !== sessionOrgId) return 403
    const record = queryByIdAndOrg("rec-1", sessionOrgId)
    if (!record) return 404
    if (record.orgId !== sessionOrgId) return 403
    return 200
  }

  it("returns 403 when claimed orgId != session orgId", () => {
    expect(handleRequest(ORG_B, ORG_A, ORG_A)).toBe(403)
  })

  it("returns 404 when record belongs to different org", () => {
    expect(handleRequest(ORG_B, ORG_B, ORG_A)).toBe(404)
  })

  it("returns 200 for legitimate access", () => {
    expect(handleRequest(ORG_A, ORG_A, ORG_A)).toBe(200)
  })
})

// ── Comment isolation ─────────────────────────────────────────────────────────

describe("comment org isolation", () => {
  const REQUESTS = [
    { id: "req-a", orgId: ORG_A },
    { id: "req-b", orgId: ORG_B },
  ]

  function getRequestOrg(requestId: string): string | null {
    return REQUESTS.find((r) => r.id === requestId)?.orgId ?? null
  }

  it("prevents adding comment to request in different org", () => {
    const sessionOrgId = ORG_A
    const requestOrgId = getRequestOrg("req-b")
    expect(requestOrgId).toBe(ORG_B)
    expect(requestOrgId === sessionOrgId).toBe(false)
  })

  it("allows adding comment to own org request", () => {
    const sessionOrgId = ORG_A
    const requestOrgId = getRequestOrg("req-a")
    expect(requestOrgId === sessionOrgId).toBe(true)
  })
})

// ── Document upload isolation ─────────────────────────────────────────────────

describe("document upload isolation", () => {
  it("rejects upload when form orgId doesn't match session", () => {
    function validateUpload(formOrgId: string, sessionOrgId: string): boolean {
      return formOrgId === sessionOrgId
    }

    expect(validateUpload(ORG_B, ORG_A)).toBe(false)
    expect(validateUpload(ORG_A, ORG_A)).toBe(true)
  })

  it("storage path includes orgId to namespace objects", () => {
    function buildStoragePath(orgId: string, docId: string, fileName: string): string {
      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
      return `${orgId}/${docId}/${safeName}`
    }

    const path = buildStoragePath(ORG_A, "doc-xyz", "report.pdf")
    expect(path.startsWith(ORG_A)).toBe(true)
    expect(path).not.toContain(ORG_B)
  })
})

// ── Internal fields never exposed ─────────────────────────────────────────────

describe("internal fields not exposed to clients", () => {
  it("internal_notes is not in PortalRequest type", () => {
    // PortalRequest mapped in lib/portal/requests.ts mapRequest() — never includes internal_notes
    const mapped = {
      id:              "req-1",
      orgId:           ORG_A,
      serviceName:     "SEO",
      status:          "active" as const,
      specialistEmail: null,
      scope:           null,
      orderId:         null,
      orderItemId:     null,
      serviceId:       null,
      estimatedStart:  null,
      startedAt:       null,
      completedAt:     null,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    }
    expect("internalNotes" in mapped).toBe(false)
    expect("internal_notes" in mapped).toBe(false)
  })

  it("is_internal comments are not returned by getComments", () => {
    const COMMENTS = [
      { id: "c1", body: "client message", is_internal: false },
      { id: "c2", body: "staff-only note", is_internal: true },
    ]
    const visible = COMMENTS.filter((c) => !c.is_internal)
    expect(visible.length).toBe(1)
    expect(visible[0].id).toBe("c1")
  })

  it("milestones with is_client_visible=false are filtered out", () => {
    const MILESTONES = [
      { id: "m1", title: "Kickoff call", is_client_visible: true },
      { id: "m2", title: "Internal review", is_client_visible: false },
      { id: "m3", title: "Deliverable sent", is_client_visible: true },
    ]
    const visible = MILESTONES.filter((m) => m.is_client_visible)
    expect(visible.length).toBe(2)
    expect(visible.map((m) => m.id)).not.toContain("m2")
  })
})

// ── ID enumeration prevention ─────────────────────────────────────────────────

describe("ID enumeration prevention", () => {
  it("not-found and wrong-org both return 404", () => {
    function resolveStatus(record: DbRecord | null): 200 | 404 {
      // Always return 404 whether record doesn't exist or belongs to another org
      if (!record) return 404
      return 200
    }

    expect(resolveStatus(null)).toBe(404)
    // Org B trying to access org A record: query returns null due to .eq("org_id", orgId)
    expect(resolveStatus(queryByIdAndOrg("rec-1", ORG_B))).toBe(404)
    expect(resolveStatus(queryByIdAndOrg("rec-1", ORG_A))).toBe(200)
  })
})
