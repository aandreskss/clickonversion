import { describe, it, expect } from "vitest"
import { getPermissions, hasPermission, getDefaultStaffPermissions } from "@/lib/admin/permissions"

describe("Permission system", () => {
  describe("getPermissions", () => {
    it("owner gets all 15 permissions", () => {
      const perms = getPermissions("owner")
      expect(perms).toContain("dashboard:read")
      expect(perms).toContain("settings:write")
      expect(perms).toContain("team:write")
      expect(perms).toContain("payments:reconcile")
      expect(perms).toContain("specialists:write")
      expect(perms.length).toBeGreaterThanOrEqual(15)
    })

    it("owner has settings:write", () => {
      const perms = getPermissions("owner")
      expect(perms).toContain("settings:write")
    })

    it("admin cannot write settings", () => {
      const perms = getPermissions("admin")
      expect(perms).not.toContain("settings:write")
      expect(perms).toContain("settings:read")
    })

    it("manager cannot write commercial or specialists", () => {
      const perms = getPermissions("manager")
      expect(perms).not.toContain("commercial:write")
      expect(perms).not.toContain("specialists:write")
      expect(perms).toContain("commercial:read")
    })

    it("manager cannot write team", () => {
      const perms = getPermissions("manager")
      expect(perms).not.toContain("team:write")
      expect(perms).toContain("team:read")
    })

    it("specialist only gets queue:read:own and queue:update:own", () => {
      const perms = getPermissions("specialist")
      expect(perms).toEqual(["queue:read:own", "queue:update:own"])
      expect(perms.length).toBe(2)
      expect(perms).not.toContain("dashboard:read")
    })

    it("manager cannot reconcile payments", () => {
      const perms = getPermissions("manager")
      expect(perms).not.toContain("payments:reconcile")
    })

    it("admin has payments:reconcile", () => {
      const perms = getPermissions("admin")
      expect(perms).toContain("payments:reconcile")
    })

    it("manager has dashboard:read", () => {
      const perms = getPermissions("manager")
      expect(perms).toContain("dashboard:read")
    })

    it("admin has queue:assign", () => {
      const perms = getPermissions("admin")
      expect(perms).toContain("queue:assign")
    })
  })

  describe("hasPermission", () => {
    it("returns true when permission is in list", () => {
      expect(hasPermission(["queue:read", "dashboard:read"], "queue:read")).toBe(true)
    })

    it("returns false when permission is not in list", () => {
      expect(hasPermission(["queue:read"], "settings:write")).toBe(false)
    })

    it("empty list returns false for any permission", () => {
      expect(hasPermission([], "dashboard:read")).toBe(false)
    })

    it("exact match required — partial match does not count", () => {
      expect(hasPermission(["queue:read:own"], "queue:read")).toBe(false)
    })

    it("returns true for payments:reconcile when owner", () => {
      const ownerPerms = getPermissions("owner")
      expect(hasPermission(ownerPerms, "payments:reconcile")).toBe(true)
    })
  })

  describe("getDefaultStaffPermissions", () => {
    it("includes dashboard:read, queue:read, queue:update", () => {
      const perms = getDefaultStaffPermissions()
      expect(perms).toContain("dashboard:read")
      expect(perms).toContain("queue:read")
      expect(perms).toContain("queue:update")
    })

    it("does not include write permissions for sensitive areas", () => {
      const perms = getDefaultStaffPermissions()
      expect(perms).not.toContain("team:write")
      expect(perms).not.toContain("settings:write")
      expect(perms).not.toContain("commercial:write")
    })

    it("returns an array", () => {
      const perms = getDefaultStaffPermissions()
      expect(Array.isArray(perms)).toBe(true)
      expect(perms.length).toBeGreaterThan(0)
    })
  })
})
