import { NextRequest, NextResponse } from "next/server"
import { updateRequestStatus } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"
import type { AdminRequestStatus } from "@/types/admin"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as {
      newStatus: AdminRequestStatus
      note?: string
      waitingInfoMessage?: string
    }

    if (!body.newStatus) {
      return NextResponse.json({ error: "newStatus is required" }, { status: 400 })
    }

    const result = await updateRequestStatus({
      requestId: id,
      newStatus: body.newStatus,
      changedBy: session.userId,
      changedByEmail: session.email,
      note: body.note,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
