import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { pfOrgMembers, pfClientOrgs, pfRequests, pfOrgInvitations, pfOrders, pfOrderItems } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import { randomBytes } from "crypto"
import type { PortalSession, ClientOrg, OrgInvitation, OrgMemberRole } from "@/types/portal"

// ── Session resolution ───────────────────────────────────────────────────────

export async function getPortalSession(): Promise<PortalSession | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const membership = await db
    .select({
      orgId: pfOrgMembers.orgId,
      role: pfOrgMembers.role,
      org: {
        id: pfClientOrgs.id,
        name: pfClientOrgs.name,
        slug: pfClientOrgs.slug,
        logoUrl: pfClientOrgs.logoUrl,
        billingEmail: pfClientOrgs.billingEmail,
        stripeCustomerId: pfClientOrgs.stripeCustomerId,
        createdAt: pfClientOrgs.createdAt,
        updatedAt: pfClientOrgs.updatedAt,
      },
    })
    .from(pfOrgMembers)
    .innerJoin(pfClientOrgs, eq(pfOrgMembers.orgId, pfClientOrgs.id))
    .where(eq(pfOrgMembers.userId, session.user.id))
    .orderBy(pfOrgMembers.joinedAt)
    .limit(1)

  if (!membership.length) return null

  const { orgId, role, org } = membership[0]

  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    orgId,
    orgRole: role as OrgMemberRole,
    org: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      billingEmail: org.billingEmail,
      stripeCustomerId: org.stripeCustomerId,
      createdAt: org.createdAt?.toISOString() ?? "",
      updatedAt: org.updatedAt?.toISOString() ?? "",
    },
  }
}

export async function requirePortalSession(): Promise<PortalSession> {
  const session = await getPortalSession()
  if (!session) throw new Error("UNAUTHORIZED")
  return session
}

export function requireOrgAdmin(session: PortalSession): void {
  if (session.orgRole !== "owner" && session.orgRole !== "admin") {
    throw new Error("FORBIDDEN")
  }
}

// ── Org creation ──────────────────────────────────────────────────────────────

export async function createOrgForUser(params: {
  userId: string
  userEmail: string
  orgName: string
}): Promise<{ orgId: string }> {
  const slug = await uniqueSlug(slugify(params.orgName))

  const [org] = await db
    .insert(pfClientOrgs)
    .values({ name: params.orgName, slug, billingEmail: params.userEmail })
    .returning({ id: pfClientOrgs.id })

  await db.insert(pfOrgMembers).values({
    orgId: org.id,
    userId: params.userId,
    role: "owner",
  })

  await linkOrdersToOrg({ orgId: org.id, clientEmail: params.userEmail })

  return { orgId: org.id }
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base
  for (let attempt = 0; attempt < 10; attempt++) {
    const existing = await db
      .select({ id: pfClientOrgs.id })
      .from(pfClientOrgs)
      .where(eq(pfClientOrgs.slug, slug))
      .limit(1)

    if (!existing.length) return slug
    slug = `${base}-${attempt + 1}`
  }
  return `${base}-${Date.now()}`
}

async function linkOrdersToOrg(params: { orgId: string; clientEmail: string }): Promise<void> {
  const paidOrders = await db
    .select({ id: pfOrders.id, status: pfOrders.status })
    .from(pfOrders)
    .where(and(eq(pfOrders.clientEmail, params.clientEmail), inArray(pfOrders.status, ["paid", "active" as any])))

  if (!paidOrders.length) return

  const orderIds = paidOrders.map((o) => o.id)
  const items = await db
    .select({
      id: pfOrderItems.id,
      orderId: pfOrderItems.orderId,
      serviceId: pfOrderItems.serviceId,
      serviceName: pfOrderItems.serviceName,
    })
    .from(pfOrderItems)
    .where(inArray(pfOrderItems.orderId, orderIds))

  if (!items.length) return

  const existing = await db
    .select({ orderItemId: pfRequests.orderItemId })
    .from(pfRequests)
    .where(eq(pfRequests.orgId, params.orgId))

  const existingItemIds = new Set(existing.map((r) => r.orderItemId))

  const toInsert = items
    .filter((i) => !existingItemIds.has(i.id))
    .map((i) => ({
      orgId: params.orgId,
      orderId: i.orderId,
      orderItemId: i.id,
      serviceId: i.serviceId,
      serviceName: i.serviceName,
      status: "pending_onboarding" as const,
    }))

  if (toInsert.length) {
    await db.insert(pfRequests).values(toInsert)
  }
}

// ── Invitations ──────────────────────────────────────────────────────────────

export async function createInvitation(params: {
  orgId: string
  email: string
  role: OrgMemberRole
  invitedBy: string
}): Promise<OrgInvitation> {
  // Cancel any existing pending invite
  await db
    .update(pfOrgInvitations)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(pfOrgInvitations.orgId, params.orgId),
        eq(pfOrgInvitations.email, params.email.toLowerCase()),
        eq(pfOrgInvitations.status, "pending"),
      ),
    )

  const token = randomBytes(24).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const [inv] = await db
    .insert(pfOrgInvitations)
    .values({
      orgId: params.orgId,
      email: params.email.toLowerCase(),
      role: params.role,
      token,
      invitedBy: params.invitedBy,
      expiresAt,
      status: "pending",
    })
    .returning()

  return mapInvitation(inv)
}

export async function acceptInvitation(token: string, userId: string): Promise<{ orgId: string }> {
  const [inv] = await db
    .select()
    .from(pfOrgInvitations)
    .where(eq(pfOrgInvitations.token, token))
    .limit(1)

  if (!inv) throw new Error("INVITATION_NOT_FOUND")
  if (inv.status !== "pending") throw new Error("INVITATION_USED")
  if (inv.expiresAt && inv.expiresAt < new Date()) throw new Error("INVITATION_EXPIRED")

  await db
    .insert(pfOrgMembers)
    .values({ orgId: inv.orgId, userId, role: inv.role })
    .onConflictDoUpdate({
      target: [pfOrgMembers.orgId, pfOrgMembers.userId],
      set: { role: inv.role },
    })

  await db
    .update(pfOrgInvitations)
    .set({ status: "accepted", acceptedAt: new Date() })
    .where(eq(pfOrgInvitations.id, inv.id))

  const userRow = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  })
  if (userRow?.email) {
    await linkOrdersToOrg({ orgId: inv.orgId, clientEmail: userRow.email })
  }

  return { orgId: inv.orgId }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapInvitation(row: typeof pfOrgInvitations.$inferSelect): OrgInvitation {
  return {
    id: row.id,
    orgId: row.orgId,
    email: row.email,
    role: row.role as OrgMemberRole,
    token: row.token,
    invitedBy: row.invitedBy ?? null,
    status: row.status as OrgInvitation["status"],
    acceptedAt: row.acceptedAt?.toISOString() ?? null,
    expiresAt: row.expiresAt?.toISOString() ?? "",
    createdAt: row.createdAt?.toISOString() ?? "",
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}
