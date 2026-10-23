import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfPlatformUsers } from "./platform"
import { pfServiceCatalog } from "./catalog"

export const pfSpecialistProfiles = pgTable("pf_specialist_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique().references(() => pfPlatformUsers.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  timezone: text("timezone").notNull().default("America/New_York"),
  maxConcurrent: integer("max_concurrent").notNull().default(3),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfSpecialistServices = pgTable("pf_specialist_services", {
  specialistId: uuid("specialist_id").notNull().references(() => pfSpecialistProfiles.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull().references(() => pfServiceCatalog.id, { onDelete: "cascade" }),
  enabled: boolean("enabled").notNull().default(true),
})

export type SpecialistProfile = typeof pfSpecialistProfiles.$inferSelect
