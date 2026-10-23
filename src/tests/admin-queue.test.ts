import { describe, it, expect, vi, beforeEach } from "vitest"
import { db } from "@/lib/db"
import { assignSpecialist, addAdminComment, updateRequestDetails } from "@/lib/admin/queue"

vi.mock("@/lib/db", () => ({
  db: { select: vi.fn(), insert: vi.fn(), update: vi.fn(), delete: vi.fn(), query: {} },
}))

vi.mock("@/lib/admin/specialists", () => ({
  canAssignToSpecialist: vi.fn(),
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

beforeEach(async () => {
  rq = []
  vi.mocked(db.select).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.insert).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.update).mockImplementation(() => chainWith(rq.shift() ?? []))
  vi.mocked(db.delete).mockImplementation(() => chainWith(rq.shift() ?? []))

  const { canAssignToSpecialist } = await import("@/lib/admin/specialists")
  vi.mocked(canAssignToSpecialist).mockResolvedValue({ canAssign: true, currentLoad: 1, maxConcurrent: 3 })
})

// ── assignSpecialist ──────────────────────────────────────────────────────────

describe("assignSpecialist", () => {
  it("succeeds when specialist has capacity", async () => {
    const { canAssignToSpecialist } = await import("@/lib/admin/specialists")
    vi.mocked(canAssignToSpecialist).mockResolvedValueOnce({ canAssign: true, currentLoad: 1, maxConcurrent: 3 })
    next([])  // update request

    const result = await assignSpecialist({
      requestId: "req-1",
      specialistId: "spec-1",
      assignedBy: "admin-1",
      assignedByEmail: "admin@test.com",
    })

    expect(result).toEqual({ success: true })
    expect(vi.mocked(db.update)).toHaveBeenCalledTimes(1)
  })

  it("returns error when specialist at capacity", async () => {
    const { canAssignToSpecialist } = await import("@/lib/admin/specialists")
    vi.mocked(canAssignToSpecialist).mockResolvedValueOnce({ canAssign: false, currentLoad: 3, maxConcurrent: 3 })

    const result = await assignSpecialist({
      requestId: "req-1",
      specialistId: "spec-1",
      assignedBy: "admin-1",
      assignedByEmail: "admin@test.com",
    })

    expect(result.success).toBe(false)
    expect(result.error).toMatch(/capacity/)
    expect(vi.mocked(db.update)).not.toHaveBeenCalled()
  })

  it("succeeds when clearing specialist (null)", async () => {
    next([])  // update

    const result = await assignSpecialist({
      requestId: "req-1",
      specialistId: null,
      assignedBy: "admin-1",
      assignedByEmail: "admin@test.com",
    })

    expect(result).toEqual({ success: true })
    // canAssignToSpecialist should NOT be called when clearing
    const { canAssignToSpecialist } = await import("@/lib/admin/specialists")
    expect(vi.mocked(canAssignToSpecialist)).not.toHaveBeenCalled()
  })
})

// ── addAdminComment ───────────────────────────────────────────────────────────

describe("addAdminComment", () => {
  it("throws when body is empty", async () => {
    await expect(
      addAdminComment({ requestId: "req-1", authorId: "admin-1", authorRole: "admin", body: "", isInternal: false })
    ).rejects.toThrow("Comment body cannot be empty")
  })

  it("throws when body is only whitespace", async () => {
    await expect(
      addAdminComment({ requestId: "req-1", authorId: "admin-1", authorRole: "admin", body: "   ", isInternal: false })
    ).rejects.toThrow("Comment body cannot be empty")
  })

  it("inserts comment for valid body", async () => {
    next([])   // insert comment
    next([{ orgId: "org-1", serviceName: "SEO" }])
    next([{ userId: "user-1" }])
    next([])   // notifications

    await addAdminComment({
      requestId: "req-1",
      authorId: "admin-1",
      authorRole: "admin",
      body: "Great progress",
      isInternal: false,
    })

    expect(vi.mocked(db.insert)).toHaveBeenCalledTimes(2)
  })
})

// ── updateRequestDetails ──────────────────────────────────────────────────────

describe("updateRequestDetails", () => {
  it("updates only provided fields", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    await updateRequestDetails("req-1", { priority: "high" })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({ priority: "high" })
    )
    expect(chain.set).not.toHaveBeenCalledWith(
      expect.objectContaining({ scope: expect.anything() })
    )
  })

  it("does nothing when no fields provided", async () => {
    await updateRequestDetails("req-1", {})
    expect(vi.mocked(db.update)).not.toHaveBeenCalled()
  })

  it("updates multiple fields when provided", async () => {
    const chain = chainWith([])
    vi.mocked(db.update).mockReturnValueOnce(chain as any)

    await updateRequestDetails("req-1", {
      priority: "high",
      scope: "Full SEO audit",
      internalNotes: "Urgent",
    })

    expect(chain.set).toHaveBeenCalledWith(
      expect.objectContaining({
        priority: "high",
        scope: "Full SEO audit",
        internalNotes: "Urgent",
      })
    )
  })
})
