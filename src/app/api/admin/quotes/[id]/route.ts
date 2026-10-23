import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient, createAdminClient } from "@/lib/supabase/server"

const UpdateQuoteSchema = z.object({
  status:           z.enum(["pending", "in_review", "proposal_sent", "accepted", "declined", "expired"]).optional(),
  scope:            z.string().max(5000).optional(),
  proposedPriceUsd: z.number().positive().optional(),
  proposalNotes:    z.string().max(5000).optional(),
  paymentLink:      z.string().url().optional(),
})

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return user
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from("pf_quotes")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ quote: data })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json() as unknown
  const parsed = UpdateQuoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const update: Record<string, unknown> = {}

  if (parsed.data.status) update.status = parsed.data.status
  if (parsed.data.scope) update.scope = parsed.data.scope
  if (parsed.data.proposedPriceUsd) update.proposed_price_usd = parsed.data.proposedPriceUsd
  if (parsed.data.proposalNotes) update.proposal_notes = parsed.data.proposalNotes
  if (parsed.data.paymentLink) update.payment_link = parsed.data.paymentLink

  if (parsed.data.status === "proposal_sent") {
    update.proposal_sent_at = new Date().toISOString()
  }
  if (parsed.data.status === "accepted") {
    update.accepted_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from("pf_quotes")
    .update(update)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  // Audit trail
  await supabase.from("pf_payment_audit").insert({
    entity_type: "quote",
    entity_id:   id,
    action:      `quote_${parsed.data.status ?? "updated"}`,
    actor:       admin.email ?? "admin",
    new_state:   parsed.data,
  })

  return NextResponse.json({ quote: data })
}
