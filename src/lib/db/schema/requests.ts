import { boolean, date, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfPlatformUsers } from "./platform"
import { pfClientOrgs } from "./portal"
import { pfOrders, pfOrderItems } from "./orders"
import { pfServiceCatalog } from "./catalog"
import { pfSpecialistProfiles } from "./specialists"

export const requestStatusEnum = pgEnum("request_status", [
  "pending_onboarding",
  "active",
  "paused",
  "completed",
  "cancelled",
  "pending_payment",
  "queued",
  "waiting_client",
  "consultation_scheduled",
  "in_progress",
  "waiting_third_party",
  "review",
  "refunded",
])

export const milestoneStatusEnum = pgEnum("milestone_status", [
  "pending", "in_progress", "completed", "cancelled",
])

export const requestPriorityEnum = pgEnum("request_priority", [
  "low", "normal", "high", "urgent",
])

export const pfRequests = pgTable("pf_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => pfClientOrgs.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => pfOrders.id),
  orderItemId: uuid("order_item_id").references(() => pfOrderItems.id),
  serviceId: uuid("service_id").references(() => pfServiceCatalog.id),
  serviceName: text("service_name").notNull(),
  scope: text("scope"),
  status: requestStatusEnum("status").notNull().default("pending_onboarding"),
  priority: requestPriorityEnum("priority").notNull().default("normal"),
  assignedSpecialistId: uuid("assigned_specialist_id").references(() => pfSpecialistProfiles.id, { onDelete: "set null" }),
  specialistEmail: text("specialist_email"),
  blockedReason: text("blocked_reason"),
  waitingInfoMessage: text("waiting_info_message"),
  estimatedStart: date("estimated_start"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  refundedAt: timestamp("refunded_at", { withTimezone: true }),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfRequestMilestones = pgTable("pf_request_milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().references(() => pfRequests.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isClientVisible: boolean("is_client_visible").notNull().default(true),
  status: milestoneStatusEnum("status").notNull().default("pending"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfComments = pgTable("pf_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().references(() => pfRequests.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull().references(() => pfPlatformUsers.id),
  authorRole: text("author_role").$type<"client" | "staff" | "admin">().notNull(),
  body: text("body").notNull(),
  isInternal: boolean("is_internal").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfRequestStatusLog = pgTable("pf_request_status_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").notNull().references(() => pfRequests.id, { onDelete: "cascade" }),
  fromStatus: requestStatusEnum("from_status"),
  toStatus: requestStatusEnum("to_status").notNull(),
  changedBy: text("changed_by").references(() => pfPlatformUsers.id),
  changedByEmail: text("changed_by_email"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Request = typeof pfRequests.$inferSelect
export type NewRequest = typeof pfRequests.$inferInsert
export type RequestStatus = typeof requestStatusEnum.enumValues[number]
