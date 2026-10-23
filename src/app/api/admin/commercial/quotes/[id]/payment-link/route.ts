import { NextRequest, NextResponse } from "next/server"
import { createQuotePaymentLink } from "@/lib/admin/commercial"
import { requireAdminSession } from "@/lib/admin/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as {
      amountUsd: number
      description?: string
    }

    if (!body.amountUsd || body.amountUsd <= 0) {
      return NextResponse.json({ error: "amountUsd must be positive" }, { status: 400 })
    }

    const url = await createQuotePaymentLink({
      quoteId: id,
      amountUsd: body.amountUsd,
      description: body.description ?? "Propuesta ClicKonversion",
    })

    return NextResponse.json({ url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
