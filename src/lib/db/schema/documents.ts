import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { pfClientOrgs } from "./portal"
import { pfRequests } from "./requests"
import { pfPlatformUsers } from "./platform"

export const documentCategoryEnum = pgEnum("document_category", [
  "deliverable", "attachment", "contract", "report", "other",
])

export const pfDocuments = pgTable("pf_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => pfClientOrgs.id, { onDelete: "cascade" }),
  requestId: uuid("request_id").references(() => pfRequests.id, { onDelete: "set null" }),
  storagePath: text("storage_path").notNull(),
  fileName: text("file_name").notNull(),
  fileSizeBytes: text("file_size_bytes").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedBy: text("uploaded_by").notNull().references(() => pfPlatformUsers.id),
  isClientVisible: boolean("is_client_visible").notNull().default(true),
  category: documentCategoryEnum("category").notNull().default("other"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Document = typeof pfDocuments.$inferSelect
export type NewDocument = typeof pfDocuments.$inferInsert
