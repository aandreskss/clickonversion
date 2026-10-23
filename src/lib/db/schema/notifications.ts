import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfPlatformUsers } from "./platform"

export const pfNotifications = pgTable("pf_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => pfPlatformUsers.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  link: text("link"),
  isRead: boolean("is_read").notNull().default(false),
  entityType: text("entity_type").$type<"request" | "document" | "milestone">(),
  entityId: uuid("entity_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Notification = typeof pfNotifications.$inferSelect
