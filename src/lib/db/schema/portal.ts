import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfPlatformUsers } from "./platform"

export const orgMemberRoleEnum = pgEnum("org_member_role", ["owner", "admin", "member"])
export const invitationStatusEnum = pgEnum("invitation_status", ["pending", "accepted", "expired", "cancelled"])

export const pfClientOrgs = pgTable("pf_client_orgs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  billingEmail: text("billing_email"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfOrgMembers = pgTable("pf_org_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => pfClientOrgs.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => pfPlatformUsers.id, { onDelete: "cascade" }),
  role: orgMemberRoleEnum("role").notNull().default("member"),
  invitedBy: text("invited_by").references(() => pfPlatformUsers.id),
  joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfOrgInvitations = pgTable("pf_org_invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => pfClientOrgs.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: orgMemberRoleEnum("role").notNull().default("member"),
  token: text("token").notNull().unique(),
  invitedBy: text("invited_by").references(() => pfPlatformUsers.id),
  status: invitationStatusEnum("status").notNull().default("pending"),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type ClientOrg = typeof pfClientOrgs.$inferSelect
export type OrgMember = typeof pfOrgMembers.$inferSelect
