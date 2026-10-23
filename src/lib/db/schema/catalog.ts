import { boolean, integer, jsonb, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfPlatformUsers } from "./platform"

export const priceTypeEnum = pgEnum("price_type", ["ONE_TIME", "RECURRING", "STARTING_AT", "CUSTOM_QUOTE"])
export const billingPeriodEnum = pgEnum("billing_period", ["monthly", "quarterly", "annual", "one_time"])
export const serviceCategoryEnum = pgEnum("service_category", ["seo", "paid-media", "automation", "support"])

export const pfServiceCatalog = pgTable("pf_service_catalog", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  category: serviceCategoryEnum("category").notNull(),
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionEs: text("description_es").notNull().default(""),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  deliverables: jsonb("deliverables").notNull().default([]),
  requirements: jsonb("requirements").notNull().default([]),
  onboardingFields: jsonb("onboarding_fields").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfServicePrices = pgTable("pf_service_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").notNull().references(() => pfServiceCatalog.id, { onDelete: "cascade" }),
  nameEn: text("name_en").notNull(),
  nameEs: text("name_es").notNull(),
  priceType: priceTypeEnum("price_type").notNull(),
  basePriceUsd: numeric("base_price_usd", { precision: 10, scale: 2 }),
  billingPeriodVal: billingPeriodEnum("billing_period_val"),
  stripePriceId: text("stripe_price_id"),
  paypalPlanId: text("paypal_plan_id"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createsBookingRight: boolean("creates_booking_right").notNull().default(false),
  bookingMeetingTypeSlug: text("booking_meeting_type_slug"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfCatalogPriceHistory = pgTable("pf_catalog_price_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceId: uuid("service_id").notNull().references(() => pfServiceCatalog.id, { onDelete: "cascade" }),
  priceId: uuid("price_id").references(() => pfServicePrices.id, { onDelete: "set null" }),
  oldPriceUsd: numeric("old_price_usd", { precision: 10, scale: 2 }),
  newPriceUsd: numeric("new_price_usd", { precision: 10, scale: 2 }),
  changedBy: text("changed_by").references(() => pfPlatformUsers.id, { onDelete: "set null" }),
  changedByEmail: text("changed_by_email"),
  effectiveDate: text("effective_date").notNull().default("CURRENT_DATE"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type ServiceCatalog = typeof pfServiceCatalog.$inferSelect
export type ServicePrice = typeof pfServicePrices.$inferSelect
