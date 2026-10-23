import { createClient, createAdminClient } from "@/lib/supabase/server"
import { getPermissions, getDefaultStaffPermissions } from "@/lib/admin/permissions"
import type { AdminSession, AdminRole, Permission } from "@/types/admin"

export async function getAdminSession(): Promise<AdminSession | null> {
  // 1. Use session-aware client for auth
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()

  if (authError || !user) return null

  // 2. Use service-role client to read platform user record (bypasses RLS)
  const supabase = createAdminClient()
  const { data: platformUser, error: userError } = await supabase
    .from("pf_platform_users")
    .select("platform_role, admin_role, full_name")
    .eq("id", user.id)
    .single()

  if (userError || !platformUser) return null

  const platformRole = platformUser.platform_role as string
  if (platformRole !== "admin" && platformRole !== "staff") return null

  const adminRole = (platformUser.admin_role ?? null) as AdminRole | null

  let permissions: Permission[]
  if (adminRole) {
    permissions = getPermissions(adminRole)
  } else {
    permissions = getDefaultStaffPermissions()
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: (platformUser.full_name as string | null) ?? null,
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
  // Expand specialist-scoped permissions to their base equivalents
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
  requestAssignedSpecialistId: string | null
): boolean {
  // Non-specialists can always access all requests
  if (session.adminRole !== "specialist") return true

  // Specialists can only access requests assigned to them
  // requestAssignedSpecialistId here is the pf_specialist_profiles.id
  return requestAssignedSpecialistId !== null
}
