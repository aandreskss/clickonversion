import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const pfAppWaitlist = pgTable("pf_app_waitlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  appSlug: text("app_slug").notNull().default("synclead"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
