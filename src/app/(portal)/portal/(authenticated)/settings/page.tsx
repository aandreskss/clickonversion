import type { Metadata } from "next"
import { getPortalSession } from "@/lib/portal/auth"
import { db } from "@/lib/db"
import { pfOrgMembers, pfOrgInvitations, pfPlatformUsers, users } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"
import { OrgSettingsForm } from "@/components/portal/org-settings-form"
import { MembersPanel } from "@/components/portal/members-panel"

export const metadata: Metadata = { title: "Settings — Portal" }

export default async function SettingsPage() {
  const session = await getPortalSession()
  if (!session) return null

  const [rawMembers, invitations] = await Promise.all([
    db
      .select({
        id: pfOrgMembers.id,
        role: pfOrgMembers.role,
        joinedAt: pfOrgMembers.joinedAt,
        userId: pfOrgMembers.userId,
        userEmail: users.email,
        userDisplayName: pfPlatformUsers.displayName,
      })
      .from(pfOrgMembers)
      .leftJoin(pfPlatformUsers, eq(pfOrgMembers.userId, pfPlatformUsers.id))
      .leftJoin(users, eq(pfOrgMembers.userId, users.id))
      .where(eq(pfOrgMembers.orgId, session.orgId))
      .orderBy(asc(pfOrgMembers.joinedAt)),
    db
      .select()
      .from(pfOrgInvitations)
      .where(
        and(
          eq(pfOrgInvitations.orgId, session.orgId),
          eq(pfOrgInvitations.status, "pending"),
        )
      ),
  ])

  // Shape members to match what MembersPanel expects
  const members = rawMembers.map((m) => ({
    id: m.id,
    role: m.role,
    joined_at: m.joinedAt?.toISOString() ?? null,
    pf_platform_users: {
      id: m.userId,
      email: m.userEmail ?? "",
      full_name: m.userDisplayName ?? null,
      avatar_url: null as string | null,
    },
  }))

  const pendingInvitations = invitations.map((inv) => ({
    id: inv.id,
    email: inv.email,
    role: inv.role,
    status: inv.status,
    expires_at: inv.expiresAt?.toISOString() ?? null,
    created_at: inv.createdAt?.toISOString() ?? null,
  }))

  const isAdmin = session.orgRole === "owner" || session.orgRole === "admin"

  return (
    <div className="space-y-8 max-w-2xl pb-24 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#546072] mt-1">Manage your organization and team.</p>
      </div>

      {/* Org info */}
      <OrgSettingsForm
        org={session.org}
        canEdit={isAdmin}
      />

      {/* Team */}
      <MembersPanel
        orgId={session.orgId}
        currentUserId={session.userId}
        currentRole={session.orgRole}
        members={members}
        pendingInvitations={pendingInvitations}
        canManage={isAdmin}
      />
    </div>
  )
}
