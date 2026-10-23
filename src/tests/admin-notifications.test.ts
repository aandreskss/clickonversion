import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
import { updateRequestStatus, addAdminComment } from "@/lib/admin/queue"

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

// ── Comment notifications ─────────────────────────────────────────────────────

describe("addAdminComment notifications", () => {
  it("internal comment does NOT trigger notifications", async () => {
    next([])  // insert comment

    await addAdminComment({
      requestId: "req-1",
      authorId: "admin-1",
      authorRole: "admin",
      body: "Internal note",
      isInternal: true,
    })

    // Only 1 insert (comment), no selects for notifications
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.select)).not.toHaveBeenCalled()
  })

  it("public comment triggers notifications", async () => {
    next([])   // insert comment
    next([{ orgId: "org-1", serviceName: "SEO" }])  // select request (notify)
    next([{ userId: "user-1" }])                     // select org members
    next([])   // insert notifications

    await addAdminComment({
      requestId: "req-1",
      authorId: "admin-1",
      authorRole: "admin",
      body: "Public update",
      isInternal: false,
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(db.select)).toHaveBeenCalledTimes(2)
  })

  it("public comment with no members: no notification insert", async () => {
    next([])
    next([{ orgId: "org-1", serviceName: "SEO" }])
    next([])  // empty members

    await addAdminComment({
      requestId: "req-1",
      authorId: "admin-1",
      authorRole: "admin",
      body: "Hello",
      isInternal: false,
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
  })
})

// ── Status transition notifications ──────────────────────────────────────────

describe("status transition notifications", () => {
  it("review status triggers notifications", async () => {
    next([{ status: "in_progress", startedAt: new Date() }])
    next([])   // update
    next([])   // insert log
    next([{ orgId: "org-1", serviceName: "SEO" }])
    next([{ userId: "user-1" }])
    next([])   // notifications

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "review",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(2)
  })

  it("cancelled status does NOT trigger notifications", async () => {
    next([{ status: "in_progress", startedAt: new Date() }])
    next([])  // update
    next([])  // insert log

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "cancelled",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.select)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
  })

  it("waiting_third_party does NOT trigger notifications", async () => {
    next([{ status: "in_progress", startedAt: new Date() }])
    next([])
    next([])

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "waiting_third_party",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.select)).toHaveBeenCalledTimes(1)
  })
})
