import { sql } from "drizzle-orm"
import { jsonb, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfPlatformUsers } from "./platform"
import { pfClientOrgs } from "./portal"
import { pfOrders, pfPayments, paymentProviderEnum } from "./orders"
import { pfServiceCatalog } from "./catalog"

export const reconciliationStatusEnum = pgEnum("reconciliation_status", [
  "matched", "discrepancy", "manual_review", "resolved",
])

export const pfAnalyticsEvents = pgTable("pf_analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventName: text("event_name").notNull(),
  userId: text("user_id").references(() => pfPlatformUsers.id, { onDelete: "set null" }),
  orgId: uuid("org_id").references(() => pfClientOrgs.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => pfOrders.id, { onDelete: "set null" }),
  serviceId: uuid("service_id").references(() => pfServiceCatalog.id, { onDelete: "set null" }),
  sessionId: text("session_id"),
  properties: jsonb("properties").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfPaymentReconciliation = pgTable("pf_payment_reconciliation", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => pfOrders.id),
  paymentId: uuid("payment_id").references(() => pfPayments.id),
  provider: paymentProviderEnum("provider").notNull(),
  providerAmount: numeric("provider_amount", { precision: 10, scale: 2 }).notNull(),
  internalAmount: numeric("internal_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  discrepancy: numeric("discrepancy", { precision: 10, scale: 2 }).generatedAlwaysAs(
    sql`provider_amount - internal_amount`,
  ),
  status: reconciliationStatusEnum("status").notNull().default("matched"),
  notes: text("notes"),
  resolvedBy: text("resolved_by").references(() => pfPlatformUsers.id),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
