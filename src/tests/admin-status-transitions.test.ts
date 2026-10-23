import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { STATUS_TRANSITIONS } from "@/types/admin"
import { createAdminClient } from "@/lib/supabase/server"
import { updateRequestStatus } from "@/lib/admin/queue"

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

// Helper: update().eq() terminal
function resolveOk() {
  return { eq: vi.fn().mockResolvedValue({ error: null }) }
}

// Helper: notify query — select().eq() returns members list
function notifyMembers(members: Array<{ user_id: string }>) {
  // notifyOrgMembers calls:
  // 1. from("pf_requests").select("org_id, service_name").eq("id", ...).single()
  // 2. from("pf_org_members").select("user_id").eq("org_id", ...) [no .single()]
  // 3. from("pf_notifications").insert(...)
  // We configure single for #1 and eq for #2
  return { data: members, error: null }
}

type MockSupabase = ReturnType<typeof createMockSupabase>

// ── STATUS_TRANSITIONS static map ────────────────────────────────────────────

describe("Status transitions", () => {
  describe("STATUS_TRANSITIONS map", () => {
    it("pending_payment can only go to queued or cancelled", () => {
      expect(STATUS_TRANSITIONS.pending_payment).toEqual(["queued", "cancelled"])
    })

    it("completed can only go to refunded", () => {
      expect(STATUS_TRANSITIONS.completed).toEqual(["refunded"])
    })

    it("refunded has no valid transitions", () => {
      expect(STATUS_TRANSITIONS.refunded).toEqual([])
    })

    it("in_progress can go to review, waiting_client, waiting_third_party, completed, cancelled", () => {
      const transitions = STATUS_TRANSITIONS.in_progress
      expect(transitions).toContain("review")
      expect(transitions).toContain("waiting_client")
      expect(transitions).toContain("waiting_third_party")
      expect(transitions).toContain("completed")
      expect(transitions).toContain("cancelled")
    })

    it("review can go to completed or back to in_progress", () => {
      expect(STATUS_TRANSITIONS.review).toContain("completed")
      expect(STATUS_TRANSITIONS.review).toContain("in_progress")
      expect(STATUS_TRANSITIONS.review.length).toBe(2)
    })

    it("cancelled can go to refunded", () => {
      expect(STATUS_TRANSITIONS.cancelled).toContain("refunded")
    })

    it("queued can go to in_progress, waiting_client, consultation_scheduled, cancelled", () => {
      const transitions = STATUS_TRANSITIONS.queued
      expect(transitions).toContain("in_progress")
      expect(transitions).toContain("waiting_client")
      expect(transitions).toContain("consultation_scheduled")
      expect(transitions).toContain("cancelled")
    })

    it("waiting_client can return to in_progress or queued", () => {
      expect(STATUS_TRANSITIONS.waiting_client).toContain("in_progress")
      expect(STATUS_TRANSITIONS.waiting_client).toContain("queued")
    })

    it("all 13 status keys are present in the map", () => {
      const expectedKeys = [
        "pending_payment", "pending_onboarding", "queued", "waiting_client",
        "consultation_scheduled", "in_progress", "active", "waiting_third_party",
        "review", "paused", "completed", "cancelled", "refunded",
      ]
      expectedKeys.forEach((key) => {
        expect(STATUS_TRANSITIONS).toHaveProperty(key)
      })
    })
  })

  // ── updateRequestStatus function ──────────────────────────────────────────

  describe("updateRequestStatus", () => {
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

    it("allows valid transition queued -> in_progress", async () => {
      // 1. fetch current status
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      // 2. update request (status + started_at)
      mockDb.update.mockReturnValueOnce(resolveOk())
      // 3. insert status log
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // in_progress is NOT in notify list — no more mocks needed

      const result = await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      expect(result.success).toBe(true)
    })

    it("rejects invalid transition completed -> queued", async () => {
      mockDb.single.mockResolvedValueOnce({
        data: { status: "completed", started_at: "2024-01-01" },
        error: null,
      })

      const result = await updateRequestStatus({
        requestId: "req-1",
        newStatus: "queued",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("Invalid transition")
    })

    it("inserts row in pf_request_status_log for valid transition", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
        note: "Starting work",
      })

      const fromCalls = vi.mocked(mockDb.from).mock.calls.map((c) => c[0])
      expect(fromCalls).toContain("pf_request_status_log")
    })

    it("delete is never called by updateRequestStatus", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "in_progress", started_at: "2024-01-01" }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // review triggers notification — mock gracefully
      mockDb.single.mockResolvedValueOnce({ data: null, error: { message: "skip" } })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "review",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      expect(mockDb.delete).not.toHaveBeenCalled()
    })

    it("sets started_at when transitioning to in_progress with no prior start", async () => {
      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      const requestUpdate = updateCalls.find((c) => c[0]?.started_at !== undefined)
      expect(requestUpdate).toBeDefined()
    })

    it("sets completed_at when transitioning to completed", async () => {
      // 1. fetch current status → select #1 → single #1
      mockDb.single.mockResolvedValueOnce({ data: { status: "review", started_at: "2024-01-01" }, error: null })
      // 2. update request → resolveOk (isolated eq)
      mockDb.update.mockReturnValueOnce(resolveOk())
      // 3. insert status log (terminal)
      mockDb.insert.mockResolvedValueOnce({ error: null })
      // 4. notifyOrgMembers: fetch request → select #2 → single #2
      mockDb.single.mockResolvedValueOnce({ data: { org_id: "org-1", service_name: "SEO" }, error: null })
      // 5. notifyOrgMembers: members query → select #3 with terminal eq
      //    Queue two pass-throughs (#1 and #2) so #3 gets resolveMembers
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(mockDb)
      mockDb.select.mockReturnValueOnce(
        { eq: vi.fn().mockResolvedValue({ data: [{ user_id: "u1" }], error: null }) }
      )
      // 6. notifyOrgMembers: insert notifications (terminal)
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "completed",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      const updateCalls = vi.mocked(mockDb.update).mock.calls
      const requestUpdate = updateCalls.find((c) => c[0]?.completed_at !== undefined)
      expect(requestUpdate).toBeDefined()
    })

    it("records changed_by_email in status log insert", async () => {
      const testEmail = "admin@clickonversion.com"

      mockDb.single.mockResolvedValueOnce({ data: { status: "queued", started_at: null }, error: null })
      mockDb.update.mockReturnValueOnce(resolveOk())
      mockDb.insert.mockResolvedValueOnce({ error: null })

      await updateRequestStatus({
        requestId: "req-1",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: testEmail,
      })

      const insertCalls = vi.mocked(mockDb.insert).mock.calls
      const logInsert = insertCalls.find((c) => c[0]?.changed_by_email === testEmail)
      expect(logInsert).toBeDefined()
    })

    it("returns error when request not found", async () => {
      mockDb.single.mockResolvedValueOnce({ data: null, error: { message: "Not found" } })

      const result = await updateRequestStatus({
        requestId: "nonexistent",
        newStatus: "in_progress",
        changedBy: "admin-1",
        changedByEmail: "admin@test.com",
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
