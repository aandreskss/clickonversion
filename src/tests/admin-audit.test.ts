import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
import { updateRequestStatus } from "@/lib/admin/queue"
import { updateServicePrice } from "@/lib/admin/commercial"

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

// ── Status log is append-only ─────────────────────────────────────────────────

describe("audit trail: status log immutability", () => {
  it("never calls db.delete on any transition", async () => {
    next([{ status: "queued", startedAt: null }])
    next([])  // update
    next([])  // insert log

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.delete)).not.toHaveBeenCalled()
  })

  it("always inserts status log entry (never updates it)", async () => {
    next([{ status: "in_progress", startedAt: new Date() }])
    next([])  // update request
    next([])  // insert log

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "completed",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    // db.insert called (for log), db.update called (for request status)
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
  })

  it("log entry is created even when no notification is needed", async () => {
    next([{ status: "queued", startedAt: null }])
    next([])  // update
    next([])  // insert log (no notification for in_progress)

    await updateRequestStatus({
      requestId: "req-1",
      newStatus: "in_progress",
      changedBy: "admin-1",
      changedByEmail: "admin@test.com",
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
  })
})

// ── Price history is append-only ──────────────────────────────────────────────

describe("audit trail: price history", () => {
  it("inserts price history when basePriceUsd changes", async () => {
    next([{ basePriceUsd: "100.00", serviceId: "svc-1" }])  // select current price
    next([])   // insert price history
    next([])   // update price

    await updateServicePrice(
      "price-1",
      { basePriceUsd: 150 },
      "admin-1",
      "admin@test.com",
    )

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
  })

  it("does NOT insert price history when only metadata changes (no basePriceUsd)", async () => {
    next([])  // update price

    await updateServicePrice(
      "price-1",
      { nameEn: "New Name" },
      "admin-1",
      "admin@test.com",
    )

    // No select (basePriceUsd not changing), no insert
    expect(vi.mocked(db.select)).not.toHaveBeenCalled()
    expect(vi.mocked(db.insert)).not.toHaveBeenCalled()
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
  })

  it("never calls db.delete for price history", async () => {
    next([{ basePriceUsd: "100.00", serviceId: "svc-1" }])
    next([])
    next([])

    await updateServicePrice(
      "price-1",
      { basePriceUsd: 120 },
      "admin-1",
      "admin@test.com",
    )

    expect(vi.mocked(db.delete)).not.toHaveBeenCalled()
  })

  it("price history captures old and new values", async () => {
    const insertChain = chainWith([])
    vi.mocked(db.insert).mockReturnValueOnce(insertChain as any)

    next([{ basePriceUsd: "99.00", serviceId: "svc-1" }])
    // insert chain already set above
    next([])  // update

    await updateServicePrice(
      "price-1",
      { basePriceUsd: 149 },
      "admin-1",
      "admin@test.com",
    )

    expect(insertChain.values).toHaveBeenCalledWith(
      expect.objectContaining({
        oldPriceUsd: "99.00",
        newPriceUsd: "149",
        changedByEmail: "admin@test.com",
      })
    )
  })
})
