import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pfPlatformUsers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getPermissions, getDefaultStaffPermissions } from "@/lib/admin/permissions"
import type { AdminSession, AdminRole, Permission } from "@/types/admin"

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const platformRole = (session.user as any).platformRole as string
  if (platformRole !== "admin" && platformRole !== "staff") return null

  const adminRole = ((session.user as any).adminRole ?? null) as AdminRole | null

  const [platformUser] = await db
    .select({ displayName: pfPlatformUsers.displayName })
    .from(pfPlatformUsers)
    .where(eq(pfPlatformUsers.id, session.user.id))
    .limit(1)

  const permissions: Permission[] = adminRole
    ? getPermissions(adminRole)
    : getDefaultStaffPermissions()

  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    fullName: platformUser?.displayName ?? null,
    platformRole: platformRole as "admin" | "staff",
    adminRole,
    permissions,
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) throw new Error("UNAUTHORIZED")
  return session
}

export function requirePermission(session: AdminSession, permission: Permission): void {
  const effective: Permission[] = [...session.permissions]
  if (effective.includes("queue:read:own") && !effective.includes("queue:read")) {
    effective.push("queue:read")
  }
  if (effective.includes("queue:update:own") && !effective.includes("queue:update")) {
    effective.push("queue:update")
  }
  if (!effective.includes(permission)) throw new Error("FORBIDDEN")
}

export function canAccessRequest(
  session: AdminSession,
  requestAssignedSpecialistId: string | null,
): boolean {
  if (session.adminRole !== "specialist") return true
  return requestAssignedSpecialistId !== null
}
