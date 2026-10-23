import { describe, it, expect, vi, beforeEach } from "vitest"
import { STATUS_TRANSITIONS } from "@/types/admin"
import { db } from "@/lib/db"
import { updateRequestStatus } from "@/lib/admin/queue"

vi.mock("@/lib/db", () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), query: {} },
}))

// ── Mock helpers ──────────────────────────────────────────────────────────────

let rq: unknown[] = []

function chainWith(data: unknown) {
  const p = Promise.resolve(data)
  const c: any = {}
  ;["from","leftJoin","innerJoin","where","set","values","orderBy","limit","offset","onConflictDoUpdate","returning"].forEach(m => { c[m] = vi.fn(() => c) })
  c.then = (f: any, r: any) => p.then(f, r)
  c.catch = (f: any) => p.catch(f)
  return c
}

function next(...items: unknown[]) { rq.push(...items) }

beforeEach(() => {
  rq = []
  vi.mocked(db.select).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.insert).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.update).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.delete).mockImplementation(() => chainWith(rq.shift() ?? []))
})

// ── STATUS_TRANSITIONS map ────────────────────────────────────────────────────

describe("STATUS_TRANSITIONS map", () => {
  it("queued can transition to in_progress and consultation_scheduled", () => {
    expect(STATUS_TRANSITIONS["queued"]).toContain("in_progress")
    expect(STATUS_TRANSITIONS["queued"]).toContain("consultation_scheduled")
  })

  it("completed has no valid forward transitions", () => {
    const from = STATUS_TRANSITIONS["completed"] ?? []
    expect(from).not.toContain("in_progress")
    expect(from).not.toContain("queued")
  })

  it("in_progress can transition to completed, waiting_client, review, cancelled", () => {
    const allowed = STATUS_TRANSITIONS["in_progress"] ?? []
    expect(allowed).toContain("completed")
    expect(allowed).toContain("waiting_client")
    expect(allowed).toContain("review")
    expect(allowed).toContain("cancelled")
  })
})

// ── updateRequestStatus: validation ──────────────────────────────────────────

describe("updateRequestStatus validation", () => {
  it("returns error when request not found", async () => {
    next([]) // select returns empty
    const result = await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "user-1",
      changedByEmail: "admin@test.com",
    })
    expect(result).toEqual({ success: false, error: "Request not found" })
  })

  it("returns error for invalid transition", async () => {
    next([{ status: "completed", startedAt: null }]) // current status
    const result = await updateRequestStatus({
      requestId: "req-1",
      newStatus: "queued",
      changedBy: "user-1",
      changedByEmail: "admin@test.com",
    })
    expect(result.success).toBe(false)
    expect(result.error).toMatch(/Invalid transition/)
  })

  it("succeeds for valid transition queued → in_progress", async () => {
    next([{ status: "queued", startedAt: null }])  // select: current
    next([])                                        // update request
    next([])                                        // insert status log
    const result = await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "user-1",
      changedByEmail: "admin@test.com",
    })
    expect(result).toEqual({ success: true })
  })
})

// ── updateRequestStatus: DB side effects ──────────────────────────────────────

describe("updateRequestStatus DB side effects", () => {
  it("inserts a status log entry on valid transition", async () => {
    next([{ status: "queued", startedAt: null }])
    next([])  // update
    next([])  // insert log

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "user-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
  })

  it("never calls db.delete", async () => {
    next([{ status: "queued", startedAt: null }])
    next([])
    next([])

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "user-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.delete)).not.toHaveBeenCalled()
  })

  it("sets completedAt when transitioning to completed", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    next([{ status: "in_progress", startedAt: new Date() }])
    next([])  // insert log (update chain already set above)

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "completed",
      changedBy: "user-1",
      changedByEmail: "admin@test.com",
    })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ completedAt: expect.any(Date) })
    )
  })
})

// ── Notifications ─────────────────────────────────────────────────────────────

describe("updateRequestStatus notifications", () => {
  it("triggers notifications for waiting_client status", async () => {
    next([{ status: "in_progress", startedAt: new Date() }])  // current
    next([])  // update request
    next([])  // insert status log
    next([{ orgId: "org-1", serviceName: "SEO" }])            // select request (notify)
    next([{ userId: "user-1" }, { userId: "user-2" }])        // select org members
    next([])  // insert notifications

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "waiting_client",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    // 3 selects: current status + orgId lookup + members
    expect(vi.mocked(db.select)).toHaveBeenCalledTimes(3)
    // 2 inserts: status log + notifications
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(2)
  })

  it("does NOT trigger notifications for in_progress status", async () => {
    next([{ status: "queued", startedAt: null }])
    next([])  // update
    next([])  // insert log

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.select)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
  })

  it("skips notification insert when no org members found", async () => {
    next([{ status: "in_progress", startedAt: new Date() }])
    next([])
    next([])
    next([{ orgId: "org-1", serviceName: "SEO" }])
    next([])   // empty members list

    const result = await updateRequestStatus({
      requestId: "req-1",
      newStatus: "waiting_client",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(result.success).toBe(true)
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
  })
})
