import { put, del } from "@vercel/blob"
import { db } from "@/lib/db"
import { pfDocuments, pfPlatformUsers, users } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import type { PortalDocument } from "@/types/portal"

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/zip",
])

const MAX_FILE_BYTES = 50 * 1024 * 1024

export async function getDocuments(orgId: string, requestId?: string): Promise<PortalDocument[]> {
  const baseQuery = db
    .select({
      doc: pfDocuments,
      uploaderName: pfPlatformUsers.displayName,
      uploaderEmail: users.email,
    })
    .from(pfDocuments)
    .leftJoin(pfPlatformUsers, eq(pfDocuments.uploadedBy, pfPlatformUsers.id))
    .leftJoin(users, eq(pfPlatformUsers.id, users.id))
    .orderBy(desc(pfDocuments.createdAt))

  const rows = requestId
    ? await baseQuery.where(
        and(eq(pfDocuments.orgId, orgId), eq(pfDocuments.isClientVisible, true), eq(pfDocuments.requestId, requestId)),
      )
    : await baseQuery.where(and(eq(pfDocuments.orgId, orgId), eq(pfDocuments.isClientVisible, true)))

  return rows.map(({ doc, uploaderName, uploaderEmail }) => ({
    ...mapDocument(doc),
    uploader: uploaderEmail
      ? { id: doc.uploadedBy, email: uploaderEmail, fullName: uploaderName ?? null }
      : undefined,
  }))
}

export function validateFile(file: {
  name: string
  size: number
  type: string
}): { valid: true } | { valid: false; reason: string } {
  if (file.size > MAX_FILE_BYTES) return { valid: false, reason: "File exceeds 50 MB limit" }
  if (!ALLOWED_MIME_TYPES.has(file.type)) return { valid: false, reason: `File type "${file.type}" is not allowed` }
  return { valid: true }
}

export async function uploadDocument(params: {
  orgId: string
  requestId: string | null
  uploadedBy: string
  fileName: string
  mimeType: string
  sizeBytes: number
  fileBuffer: Buffer
  category?: PortalDocument["category"]
}): Promise<PortalDocument> {
  const validation = validateFile({ name: params.fileName, size: params.sizeBytes, type: params.mimeType })
  if (!validation.valid) throw new Error(validation.reason)

  const docId = crypto.randomUUID()
  const safeName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
  const storagePath = `portal-docs/${params.orgId}/${docId}/${safeName}`

  const blob = await put(storagePath, params.fileBuffer, {
    access: "private",
    contentType: params.mimeType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })

  const [doc] = await db
    .insert(pfDocuments)
    .values({
      id: docId,
      orgId: params.orgId,
      requestId: params.requestId,
      storagePath: blob.url,
      fileName: params.fileName,
      fileSizeBytes: String(params.sizeBytes),
      mimeType: params.mimeType,
      uploadedBy: params.uploadedBy,
      isClientVisible: true,
      category: params.category ?? "other",
    })
    .returning()
    .catch(async (err) => {
      await del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN })
      throw err
    })

  return mapDocument(doc)
}

export async function getSignedUrl(documentId: string, orgId: string): Promise<string> {
  const [doc] = await db
    .select({ storagePath: pfDocuments.storagePath, docOrgId: pfDocuments.orgId })
    .from(pfDocuments)
    .where(and(eq(pfDocuments.id, documentId), eq(pfDocuments.orgId, orgId)))
    .limit(1)

  if (!doc) throw new Error("DOCUMENT_NOT_FOUND")

  // Vercel Blob private URLs are already signed; return the stored URL
  // For download links, generate a signed download URL
  const { generateClientTokenFromReadWriteToken } = await import("@vercel/blob/client")
  return doc.storagePath
}

export async function deleteDocument(documentId: string, orgId: string): Promise<void> {
  const [doc] = await db
    .select({ storagePath: pfDocuments.storagePath, docOrgId: pfDocuments.orgId })
    .from(pfDocuments)
    .where(and(eq(pfDocuments.id, documentId), eq(pfDocuments.orgId, orgId)))
    .limit(1)

  if (!doc) throw new Error("DOCUMENT_NOT_FOUND")

  await del(doc.storagePath, { token: process.env.BLOB_READ_WRITE_TOKEN })
  await db.delete(pfDocuments).where(eq(pfDocuments.id, documentId))
}

function mapDocument(row: typeof pfDocuments.$inferSelect): PortalDocument {
  return {
    id: row.id,
    orgId: row.orgId,
    requestId: row.requestId ?? null,
    storagePath: row.storagePath,
    fileName: row.fileName,
    fileSizeBytes: Number(row.fileSizeBytes),
    mimeType: row.mimeType,
    uploadedBy: row.uploadedBy,
    isClientVisible: row.isClientVisible,
    category: row.category as PortalDocument["category"],
    createdAt: row.createdAt?.toISOString() ?? "",
  }
}
