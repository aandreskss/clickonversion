import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
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

// ── Price history write conditions ────────────────────────────────────────────

describe("updateServicePrice: price history", () => {
  it("writes price history when basePriceUsd changes", async () => {
    next([{ basePriceUsd: "99.00", serviceId: "svc-1" }])  // select current
    next([])  // insert history
    next([])  // update price

    await updateServicePrice("price-1", { basePriceUsd: 149 }, "admin-1", "admin@test.com")

    expect(vi.mocked(db.select)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
  })

  it("does NOT write price history when only name changes", async () => {
    next([])  // update price (no select or insert for history)

    await updateServicePrice("price-1", { nameEn: "New Name" }, "admin-1", "admin@test.com")

    expect(vi.mocked(db.select)).not.toHaveBeenCalled()
    expect(vi.mocked(db.insert)).not.toHaveBeenCalled()
  })

  it("does NOT write price history when only isActive changes", async () => {
    next([])  // update price

    await updateServicePrice("price-1", { isActive: false }, "admin-1", "admin@test.com")

    expect(vi.mocked(db.select)).not.toHaveBeenCalled()
    expect(vi.mocked(db.insert)).not.toHaveBeenCalled()
  })

  it("price history captures old and new values with changedByEmail", async () => {
    const insertChain = chainWith([])
    vi.mocked(db.insert).mockReturnValueOnce(insertChain as any)

    next([{ basePriceUsd: "99.00", serviceId: "svc-1" }])
    // insert chain already set above
    next([])  // update

    await updateServicePrice("price-1", { basePriceUsd: 149 }, "admin-1", "admin@test.com")

    expect(insertChain.values).toHaveBeenCalledWith(
      expect.objectContaining({
        oldPriceUsd: "99.00",
        newPriceUsd: "149",
        changedByEmail: "admin@test.com",
        serviceId: "svc-1",
      })
    )
  })
})

// ── Order items immutability ──────────────────────────────────────────────────

describe("updateServicePrice: order items immutability", () => {
  it("never updates pf_order_items when price changes", async () => {
    next([{ basePriceUsd: "99.00", serviceId: "svc-1" }])
    next([])  // insert history
    next([])  // update pf_service_prices

    await updateServicePrice("price-1", { basePriceUsd: 200 }, "admin-1", "admin@test.com")

    // db.update called once (for pf_service_prices), never for pf_order_items
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(db.delete)).not.toHaveBeenCalled()
  })

  it("does nothing when no fields provided", async () => {
    await updateServicePrice("price-1", {}, "admin-1", "admin@test.com")

    expect(vi.mocked(db.select)).not.toHaveBeenCalled()
    expect(vi.mocked(db.insert)).not.toHaveBeenCalled()
    expect(vi.mocked(db.update)).not.toHaveBeenCalled()
  })
})
