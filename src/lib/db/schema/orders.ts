import { boolean, jsonb, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./auth"
import { pfServiceCatalog, pfServicePrices, priceTypeEnum, billingPeriodEnum } from "./catalog"

export const paymentProviderEnum = pgEnum("payment_provider", ["stripe", "paypal"])
export const orderStatusEnum = pgEnum("order_status", [
  "draft", "pending_payment", "partially_paid", "paid", "quote_pending", "cancelled", "refunded",
])
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", "processing", "succeeded", "failed", "cancelled", "refunded", "partially_refunded",
])
export const paymentTypeEnum = pgEnum("payment_type_enum", [
  "one_time", "subscription_initial", "subscription_renewal",
])
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing", "active", "past_due", "cancelled", "unpaid", "paused",
])
export const quoteStatusEnum = pgEnum("quote_status", [
  "pending", "in_review", "proposal_sent", "accepted", "declined", "expired",
])

export const pfOrders = pgTable("pf_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name").notNull(),
  clientCompany: text("client_company"),
  userId: text("user_id").references(() => users.id),
  status: orderStatusEnum("status").notNull().default("draft"),
  currency: text("currency").notNull().default("USD"),
  subtotalUsd: numeric("subtotal_usd", { precision: 10, scale: 2 }).notNull().default("0"),
  taxUsd: numeric("tax_usd", { precision: 10, scale: 2 }).notNull().default("0"),
  totalUsd: numeric("total_usd", { precision: 10, scale: 2 }).notNull().default("0"),
  recurringTotalUsd: numeric("recurring_total_usd", { precision: 10, scale: 2 }).notNull().default("0"),
  itemsSnapshot: jsonb("items_snapshot").notNull().default([]),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfOrderItems = pgTable("pf_order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => pfOrders.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull().references(() => pfServiceCatalog.id),
  priceId: uuid("price_id").references(() => pfServicePrices.id),
  quantity: numeric("quantity").notNull().default("1"),
  unitPriceUsd: numeric("unit_price_usd", { precision: 10, scale: 2 }).notNull(),
  lineTotalUsd: numeric("line_total_usd", { precision: 10, scale: 2 }).notNull(),
  priceType: priceTypeEnum("price_type").notNull(),
  billingPeriodVal: billingPeriodEnum("billing_period_val"),
  serviceName: text("service_name").notNull(),
  priceTierName: text("price_tier_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfPayments = pgTable("pf_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => pfOrders.id),
  provider: paymentProviderEnum("provider").notNull(),
  providerPaymentId: text("provider_payment_id"),
  providerCheckoutId: text("provider_checkout_id"),
  amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  paymentType: paymentTypeEnum("payment_type").notNull(),
  failureCode: text("failure_code"),
  failureMessage: text("failure_message"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfSubscriptions = pgTable("pf_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => pfOrders.id),
  orderItemId: uuid("order_item_id").notNull().references(() => pfOrderItems.id),
  provider: paymentProviderEnum("provider").notNull(),
  providerSubscriptionId: text("provider_subscription_id").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfQuotes = pgTable("pf_quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => pfOrders.id),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name").notNull(),
  clientCompany: text("client_company"),
  servicesRequested: jsonb("services_requested").notNull().default([]),
  status: quoteStatusEnum("status").notNull().default("pending"),
  clientNotes: text("client_notes"),
  scope: text("scope"),
  proposedPriceUsd: numeric("proposed_price_usd", { precision: 10, scale: 2 }),
  proposalNotes: text("proposal_notes"),
  paymentLink: text("payment_link"),
  proposalSentAt: timestamp("proposal_sent_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfWebhookEvents = pgTable("pf_webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: paymentProviderEnum("provider").notNull(),
  eventId: text("event_id").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  processed: boolean("processed").notNull().default(false),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfPaymentAudit = pgTable("pf_payment_audit", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: text("entity_type").$type<"order" | "payment" | "subscription" | "quote">().notNull(),
  entityId: uuid("entity_id").notNull(),
  action: text("action").notNull(),
  actor: text("actor"),
  previousState: jsonb("previous_state"),
  newState: jsonb("new_state"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Order = typeof pfOrders.$inferSelect
export type NewOrder = typeof pfOrders.$inferInsert
export type OrderItem = typeof pfOrderItems.$inferSelect
export type Payment = typeof pfPayments.$inferSelect
export type Quote = typeof pfQuotes.$inferSelect
