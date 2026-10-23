import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./auth"

export const platformRoleEnum = pgEnum("platform_role", ["admin", "staff", "client"])
export const adminRoleEnum = pgEnum("admin_role", ["owner", "admin", "manager", "specialist"])

export const pfPlatformUsers = pgTable("pf_platform_users", {
  id: text("id").notNull().primaryKey().references(() => users.id, { onDelete: "cascade" }),
  platformRole: platformRoleEnum("platform_role").notNull().default("client"),
  adminRole: adminRoleEnum("admin_role"),
  displayName: text("display_name"),
  phone: text("phone"),
  timezone: text("timezone").notNull().default("America/New_York"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export type PlatformUser = typeof pfPlatformUsers.$inferSelect
export type NewPlatformUser = typeof pfPlatformUsers.$inferInsert
