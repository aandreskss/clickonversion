import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdminSession } from "@/lib/admin/auth"
import { db } from "@/lib/db"
import { pfQuotes, pfPaymentAudit } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const UpdateQuoteSchema = z.object({
  status:           z.enum(["pending", "in_review", "proposal_sent", "accepted", "declined", "expired"]).optional(),
  scope:            z.string().max(5000).optional(),
  proposedPriceUsd: z.number().positive().optional(),
  proposalNotes:    z.string().max(5000).optional(),
  paymentLink:      z.string().url().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let session
  try {
    session = await requireAdminSession()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const [quote] = await db
    .select()
    .from(pfQuotes)
    .where(eq(pfQuotes.id, id))
    .limit(1)

  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ quote })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let session
  try {
    session = await requireAdminSession()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json() as unknown
  const parsed = UpdateQuoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updateData: Partial<typeof pfQuotes.$inferInsert> = {}

  if (parsed.data.status)           updateData.status           = parsed.data.status
  if (parsed.data.scope)            updateData.scope            = parsed.data.scope
  if (parsed.data.proposedPriceUsd) updateData.proposedPriceUsd = String(parsed.data.proposedPriceUsd)
  if (parsed.data.proposalNotes)    updateData.proposalNotes    = parsed.data.proposalNotes
  if (parsed.data.paymentLink)      updateData.paymentLink      = parsed.data.paymentLink

  if (parsed.data.status === "proposal_sent") {
    updateData.proposalSentAt = new Date()
  }
  if (parsed.data.status === "accepted") {
    updateData.acceptedAt = new Date()
  }

  const [quote] = await db
    .update(pfQuotes)
    .set(updateData)
    .where(eq(pfQuotes.id, id))
    .returning()

  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Audit trail
  await db.insert(pfPaymentAudit).values({
    entityType: "quote",
    entityId:   id,
    action:     `quote_${parsed.data.status ?? "updated"}`,
    actor:      session.email ?? "admin",
    newState:   parsed.data,
  })

  return NextResponse.json({ quote })
}
