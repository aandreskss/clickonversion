import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/server"
import { updateRequestStatus, addAdminComment } from "@/lib/admin/queue"

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
  createClient: vi.fn(),
}))

// ── Mock helper ───────────────────────────────────────────────────────────────

function createMockSupabase() {
  const mock = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    in: vi.fn(),
    not: vi.fn(),
    neq: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    lt: vi.fn(),
    gt: vi.fn(),
    ilike: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    from: vi.fn(),
    or: vi.fn(),
  }

  const chainable = mock as Record<string, ReturnType<typeof vi.fn>>
  Object.keys(chainable).forEach((key) => {
    if (key !== "single" && key !== "maybeSingle") {
      chainable[key].mockReturnValue(mock)
    }
  })

  return mock
}

function resolveOk() {
  return { eq: vi.fn().mockResolvedValue({ error: null }) }
}

// Returns a sub-object for the members select() call that terminates with .eq()
// Usage: mockDb.select.mockReturnValueOnce(resolveMembers([{ user_id: "u1" }]))
// This isolates the members query eq from the main chain's eq calls.
function resolveMembers(members: Array<{ user_id: string }>) {
  return { eq: vi.fn().mockResolvedValue({ data: members, error: null }) }
}

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Admin notifications", () => {
  let mockDb: MockSupabase

  beforeEach(() => {
    mockDb = createMockSupabase()
    vi.mocked(createAdminClient).mockReturnValue(
      mockDb as unknown as ReturnType<typeof createAdminClient>
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("addAdminComment notification behavior", () => {
    it("calls pf_comments insert for public comment", async () => {
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // notifyOrgMembers: request query fails gracefully
      mockDb.single.mockResolvedValueOnce({ data: null, error: { message: "skip" } })

      await addAdminComment({
        requestId: "req-1",
        authorId: "admin-1",
        authorRole: "admin",
        body: "Update for client",
        isInternal: false,
      })

      expect(mockDb.from).toHaveBeenCalledWith("pf_comments")
    })

    it("creates notification when admin posts public comment and org members exist", async () => {
      // 1. pf_comments insert (terminal — no select involved)
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // 2. notifyOrgMembers: fetch request → select #1 (default chain) → single #1
      mockDb.single.mockResolvedValueOnce({
        data: { org_id: "org-1", service_name: "SEO Audit" },
        error: null,
      })
      // 3. notifyOrgMembers: members query → select #2 with terminal eq
      //    Queue one pass-through so select #1 consumes default, then #2 gets resolveMembers
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(resolveMembers([{ user_id: "u1" }, { user_id: "u2" }]))
      // 4. notifyOrgMembers: insert notifications (terminal)
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await addAdminComment({
        requestId: "req-1",
        authorId: "admin-1",
        authorRole: "admin",
        body: "Update for client",
        isInternal: false,
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_notifications")
    })

    it("does NOT create notification for internal comment", async () => {
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await addAdminComment({
        requestId: "req-1",
        authorId: "admin-1",
        authorRole: "admin",
        body: "Internal note",
        isInternal: true,
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).not.toContain("pf_notifications")
    })
  })

  describe("updateRequestStatus notifications", () => {
    it("creates notification when status changes to waiting_client", async () => {
      // 1. fetch current status → select #1 (default chain) → single #1
      mockDb.single.mockResolvedValueOnce({
        data: { status: "in_progress", started_at: "2024-01-01" },
        error: null,
      })
      // 2. update request → resolveOk (isolated eq)
      mockDb.update.mockReturnValueOnce(resolveOk())
      // 3. insert status log (terminal)
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // 4. notifyOrgMembers: fetch request → select #2 (default chain) → single #2
      mockDb.single.mockResolvedValueOnce({
        data: { org_id: "org-1", service_name: "SEO Audit" },
        error: null,
      })
      // 5. notifyOrgMembers: members query → select #3 with terminal eq
      //    Queue two pass-throughs so #1 and #2 consume defaults, #3 gets resolveMembers
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(resolveMembers([{ user_id: "u1" }]))
      // 6. notifyOrgMembers: insert notifications (terminal)
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "waiting_client",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_notifications")
    })

    it("creates notification when status changes to completed", async () => {
      // 1. fetch current status → select #1 → single #1
      mockDb.single.mockResolvedValueOnce({ data: { status: "review", started_at: "2024-01-01" }, error: null })
      // 2. update request → resolveOk
      mockDb.update.mockReturnValueOnce(resolveOk())
      // 3. insert status log
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // 4. notifyOrgMembers: fetch request → select #2 → single #2
      mockDb.single.mockResolvedValueOnce({ data: { org_id: "org-1", service_name: "SEO Audit" }, error: null })
      // 5. notifyOrgMembers: members query → select #3 with terminal eq
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(resolveMembers([{ user_id: "u1" }]))
      // 6. notifyOrgMembers: insert notifications
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "completed",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_notifications")
    })

    it("creates notification when status changes to review", async () => {
      // 1. fetch current status → select #1 → single #1
      mockDb.single.mockResolvedValueOnce({ data: { status: "in_progress", started_at: "2024-01-01" }, error: null })
      // 2. update request → resolveOk
      mockDb.update.mockReturnValueOnce(resolveOk())
      // 3. insert status log
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // 4. notifyOrgMembers: fetch request → select #2 → single #2
      mockDb.single.mockResolvedValueOnce({ data: { org_id: "org-1", service_name: "SEO Audit" }, error: null })
      // 5. notifyOrgMembers: members query → select #3 with terminal eq
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(resolveMembers([{ user_id: "u1" }]))
      // 6. notifyOrgMembers: insert notifications
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "review",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_notifications")
    })

    it("does NOT notify on queued -> in_progress transition", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // in_progress is NOT in notify list — no extra mocks

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).not.toContain("pf_notifications")
    })
  })
})
