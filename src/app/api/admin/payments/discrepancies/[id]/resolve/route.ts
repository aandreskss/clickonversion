import { NextRequest, NextResponse } from "next/server"
import { resolveDiscrepancy } from "@/lib/admin/payments"
import { requireAdminSession } from "@/lib/admin/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminSession()
    const { id } = await params
    const body = (await req.json().catch(() => ({}))) as { notes?: string }

    await resolveDiscrepancy({
      reconciliationId: id,
      resolvedBy: session.email,
      notes: body.notes,
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
