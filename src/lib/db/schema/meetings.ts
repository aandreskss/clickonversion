import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfOrders, pfOrderItems } from "./orders"
import { pfServiceCatalog } from "./catalog"

export const bookingRightStatusEnum = pgEnum("booking_right_status", [
  "unused", "reserved", "used", "expired", "cancelled",
])

export const meetingStatusEnum = pgEnum("meeting_status", [
  "pending", "scheduled", "rescheduled", "cancelled", "completed", "no_show",
])

export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "pending", "submitted", "reviewed", "complete",
])

export const pfBookingRights = pgTable("pf_booking_rights", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => pfOrders.id),
  orderItemId: uuid("order_item_id").notNull().references(() => pfOrderItems.id),
  serviceId: uuid("service_id").notNull().references(() => pfServiceCatalog.id),
  meetingTypeSlug: text("meeting_type_slug").notNull(),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name").notNull(),
  token: text("token").notNull().unique(),
  status: bookingRightStatusEnum("status").notNull().default("unused"),
  maxUses: integer("max_uses").notNull().default(1),
  usesCount: integer("uses_count").notNull().default(0),
  meetingId: uuid("meeting_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfMeetings = pgTable("pf_meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingRightId: uuid("booking_right_id").references(() => pfBookingRights.id),
  orderId: uuid("order_id").references(() => pfOrders.id),
  meetingTypeSlug: text("meeting_type_slug").notNull(),
  calcomBookingUid: text("calcom_booking_uid").unique(),
  calcomEventTypeId: integer("calcom_event_type_id"),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name").notNull(),
  clientTimezone: text("client_timezone"),
  specialistEmail: text("specialist_email"),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  videoCallUrl: text("video_call_url"),
  status: meetingStatusEnum("status").notNull().default("pending"),
  preBriefData: jsonb("pre_brief_data").notNull().default({}),
  cancellationReason: text("cancellation_reason"),
  rescheduledFromId: uuid("rescheduled_from_id"),
  calcomPayload: jsonb("calcom_payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const pfOnboardingResponses = pgTable("pf_onboarding_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => pfOrders.id),
  orderItemId: uuid("order_item_id").references(() => pfOrderItems.id),
  serviceId: uuid("service_id").notNull().references(() => pfServiceCatalog.id),
  clientEmail: text("client_email").notNull(),
  responses: jsonb("responses").notNull().default({}),
  status: onboardingStatusEnum("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedBy: text("reviewed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
