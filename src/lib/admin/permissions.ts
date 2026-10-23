import type { AdminRole, Permission } from "@/types/admin"

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  owner: [
    "dashboard:read",
    "queue:read",
    "queue:update",
    "queue:assign",
    "specialists:read",
    "specialists:write",
    "commercial:read",
    "commercial:write",
    "payments:read",
    "payments:reconcile",
    "analytics:read",
    "team:read",
    "team:write",
    "settings:read",
    "settings:write",
  ],
  admin: [
    "dashboard:read",
    "queue:read",
    "queue:update",
    "queue:assign",
    "specialists:read",
    "specialists:write",
    "commercial:read",
    "commercial:write",
    "payments:read",
    "payments:reconcile",
    "analytics:read",
    "team:read",
    "team:write",
    "settings:read",
  ],
  manager: [
    "dashboard:read",
    "queue:read",
    "queue:update",
    "queue:assign",
    "specialists:read",
    "commercial:read",
    "payments:read",
    "analytics:read",
    "team:read",
  ],
  specialist: [
    "queue:read:own",
    "queue:update:own",
  ],
}

export function getPermissions(role: AdminRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(permissions: Permission[], required: Permission): boolean {
  return permissions.includes(required)
}

export function getDefaultStaffPermissions(): Permission[] {
  return ["dashboard:read", "queue:read", "queue:update"]
}
