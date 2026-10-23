import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createAdminClient } from "@/lib/supabase/server"
import { assignSpecialist, addAdminComment, updateRequestDetails } from "@/lib/admin/queue"

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: vi.fn(),
  createClient: vi.fn(),
}))

// ── Mock helper ───────────────────────────────────────────────────────────────
// Strategy: all methods return the same `mock` object (chainable).
// - Use `mockDb.single.mockResolvedValueOnce(...)` for queries ending in .single()
// - Use `mockDb.maybeSingle.mockResolvedValueOnce(...)` for .maybeSingle()
// - For queries that terminate WITHOUT .single() (update/insert/eq at end),
//   configure the update/insert method to return a sub-object that resolves:
//   mockDb.update.mockReturnValueOnce({ eq: vi.fn().mockResolvedValue({ error: null }) })

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

  // All methods are chainable by default
  const chainable = mock as Record<string, ReturnType<typeof vi.fn>>
  Object.keys(chainable).forEach((key) => {
    if (key !== "single" && key !== "maybeSingle") {
      chainable[key].mockReturnValue(mock)
    }
  })

  return mock
}

// Helper: creates a terminal chain that resolves the update/insert
function resolveOk() {
  const terminal = { eq: vi.fn().mockResolvedValue({ error: null }) }
  return terminal
}

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Queue operations", () => {
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

  describe("assignSpecialist", () => {
    it("assigns specialist when below capacity", async () => {
      // 1st query: profile fetch — ends with .single()
      mockDb.single.mockResolvedValueOnce({ data: { max_concurrent: 5 }, error: null })
      // 2nd query: count fetch — ends with .in() — configure in to resolve
      mockDb.in.mockResolvedValueOnce({ count: 3, error: null })
      // 3rd query: update — ends with .update(...).eq() — configure update to return terminal
      mockDb.update.mockReturnValueOnce(resolveOk())

      const result = await assignSpecialist({
        requestId: "req-1",
        specialistId: "spec-1",
        assignedBy: "user-1",
        assignedByEmail: "admin@test.com",
      })

      expect(result.success).toBe(true)
    })

    it("rejects assignment when specialist at max capacity", async () => {
      // 1st query: profile fetch
      mockDb.single.mockResolvedValueOnce({ data: { max_concurrent: 3 }, error: null })
      // 2nd query: count fetch — count equals max
      mockDb.in.mockResolvedValueOnce({ count: 3, error: null })
      // No update expected (returns early)

      const result = await assignSpecialist({
        requestId: "req-1",
        specialistId: "spec-1",
        assignedBy: "user-1",
        assignedByEmail: "admin@test.com",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("capacity")
    })

    it("allows unassigning by passing null specialistId", async () => {
      // No capacity check when specialistId is null — goes straight to update
      mockDb.update.mockReturnValueOnce(resolveOk())

      const result = await assignSpecialist({
        requestId: "req-1",
        specialistId: null,
        assignedBy: "user-1",
        assignedByEmail: "admin@test.com",
      })

      // No capacity check when unassigning
      expect(mockDb.single).not.toHaveBeenCalled()
      expect(mockDb.from).toHaveBeenCalledWith("pf_requests")
      expect(result.success).toBe(true)
    })

    it("returns error when specialist profile not found", async () => {
      mockDb.single.mockResolvedValueOnce({ data: null, error: { message: "Not found" } })

      const result = await assignSpecialist({
        requestId: "req-1",
        specialistId: "nonexistent-spec",
        assignedBy: "user-1",
        assignedByEmail: "admin@test.com",
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe("addAdminComment", () => {
    it("inserts comment into pf_comments table", async () => {
      // insert resolves directly (no .single() needed)
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // notifyOrgMembers: request query fails gracefully
      mockDb.single.mockResolvedValueOnce({ data: null, error: { message: "skip" } })

      await addAdminComment({
        requestId: "req-1",
        authorId: "admin-1",
        authorRole: "admin",
        body: "Hello client",
        isInternal: false,
      })

      expect(mockDb.from).toHaveBeenCalledWith("pf_comments")
    })

    it("does not insert into pf_notifications for internal comment", async () => {
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await addAdminComment({
        requestId: "req-1",
        authorId: "admin-1",
        authorRole: "admin",
        body: "Internal note",
        isInternal: true,
      })

      const calls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(calls).not.toContain("pf_notifications")
    })

    it("throws on whitespace-only body", async () => {
      await expect(
        addAdminComment({
          requestId: "req-1",
          authorId: "admin-1",
          authorRole: "admin",
          body: "   ",
          isInternal: false,
        })
      ).rejects.toThrow()
    })

    it("throws on empty string body", async () => {
      await expect(
        addAdminComment({
          requestId: "req-1",
          authorId: "admin-1",
          authorRole: "admin",
          body: "",
          isInternal: false,
        })
      ).rejects.toThrow()
    })
  })

  describe("updateRequestDetails", () => {
    it("only sends priority when only priority provided", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateRequestDetails("req-1", { priority: "high" })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      expect(updateCalls[0][0]).toHaveProperty("priority", "high")
      expect(updateCalls[0][0]).not.toHaveProperty("scope")
    })

    it("does nothing if no data provided", async () => {
      await updateRequestDetails("req-1", {})

      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it("sends scope field when provided", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateRequestDetails("req-1", { scope: "Full SEO audit" })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      expect(updateCalls[0][0]).toHaveProperty("scope", "Full SEO audit")
    })

    it("sends multiple fields when multiple are provided", async () => {
      mockDb.update.mockReturnValueOnce(resolveOk())

      await updateRequestDetails("req-1", { priority: "urgent", internalNotes: "Rush job" })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      expect(updateCalls[0][0]).toHaveProperty("priority", "urgent")
      expect(updateCalls[0][0]).toHaveProperty("internal_notes", "Rush job")
    })
  })
})
