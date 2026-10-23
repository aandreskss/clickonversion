import { boolean, date, integer, numeric, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "./auth"

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const organizationMembers = pgTable(
  "organization_members",
  {
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: text("role").$type<"owner" | "admin" | "member">().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.userId] })],
)

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  normalizedName: text("normalized_name"),
  website: text("website"),
  normalizedDomain: text("normalized_domain"),
  phone: text("phone"),
  industry: text("industry"),
  city: text("city"),
  state: text("state"),
  country: text("country").notNull().default("US"),
  source: text("source"),
  lifecycleStatus: text("lifecycle_status")
    .$type<"prospect" | "active_client" | "past_client" | "disqualified">()
    .notNull()
    .default("prospect"),
  googleReviewsCount: integer("google_reviews_count"),
  notesSummary: text("notes_summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  jobTitle: text("job_title"),
  email: text("email"),
  normalizedEmail: text("normalized_email"),
  phone: text("phone"),
  linkedinUrl: text("linkedin_url"),
  instagramUrl: text("instagram_url"),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const opportunities = pgTable("opportunities", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  primaryContactId: uuid("primary_contact_id").references(() => contacts.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  service: text("service"),
  stage: text("stage")
    .$type<"NEW" | "QUALIFIED" | "CONTACTED" | "REPLIED" | "AUDIT_SENT" | "CALL_BOOKED" | "PROPOSAL" | "WON" | "LOST" | "NURTURE">()
    .notNull()
    .default("NEW"),
  source: text("source"),
  estimatedValue: numeric("estimated_value", { precision: 12, scale: 2 }),
  mrrValue: numeric("mrr_value", { precision: 12, scale: 2 }),
  probability: integer("probability"),
  firstContactedAt: timestamp("first_contacted_at", { withTimezone: true }),
  lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
  nextAction: text("next_action"),
  nextActionAt: timestamp("next_action_at", { withTimezone: true }),
  auditUrl: text("audit_url"),
  loomUrl: text("loom_url"),
  proposalUrl: text("proposal_url"),
  proposalSentAt: timestamp("proposal_sent_at", { withTimezone: true }),
  expectedCloseDate: date("expected_close_date"),
  wonAt: timestamp("won_at", { withTimezone: true }),
  lostAt: timestamp("lost_at", { withTimezone: true }),
  lostReason: text("lost_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, { onDelete: "set null" }),
  activityType: text("activity_type")
    .$type<"note" | "email" | "call" | "linkedin" | "instagram" | "loom" | "audit" | "meeting" | "proposal" | "system">()
    .notNull(),
  title: text("title").notNull(),
  body: text("body"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  dueAt: timestamp("due_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  priority: text("priority").$type<"low" | "normal" | "high">().notNull().default("normal"),
  assignedTo: text("assigned_to").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const auditRequests = pgTable("audit_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "set null" }),
  firstName: text("first_name").notNull(),
  workEmail: text("work_email").notNull(),
  companyName: text("company_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  mainService: text("main_service").notNull(),
  city: text("city").notNull(),
  primaryGoal: text("primary_goal").notNull(),
  phone: text("phone"),
  budgetRange: text("budget_range"),
  currentChallenge: text("current_challenge"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  landingPage: text("landing_page"),
  referrer: text("referrer"),
  honeypotTriggered: boolean("honeypot_triggered").notNull().default(false),
  companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
  contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const prospectResearch = pgTable("prospect_research", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: uuid("company_id").notNull().unique().references(() => companies.id, { onDelete: "cascade" }),
  seoIssues: text("seo_issues"),
  googleBusinessIssues: text("google_business_issues"),
  adsIssues: text("ads_issues"),
  websiteIssues: text("website_issues"),
  conversionIssues: text("conversion_issues"),
  opportunitySummary: text("opportunity_summary"),
  personalizationNotes: text("personalization_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
