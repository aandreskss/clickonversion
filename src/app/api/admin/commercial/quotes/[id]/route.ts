import { NextRequest, NextResponse } from "next/server"
import { getQuote, updateQuote } from "@/lib/admin/commercial"
import { requireAdminSession } from "@/lib/admin/auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const quote = await getQuote(id)
    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(quote)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as Partial<{
      status: string
      scope: string | null
      proposedPriceUsd: number | null
      proposalNotes: string | null
      paymentLink: string | null
      proposalSentAt: string | null
      acceptedAt: string | null
      expiresAt: string | null
    }>

    await updateQuote(id, body)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
