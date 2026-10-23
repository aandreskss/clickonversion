import { NextRequest, NextResponse } from "next/server"
import { getQueueItem, updateRequestDetails } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"
import type { RequestPriority } from "@/types/admin"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const data = await getQueueItem(id)
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(data)
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
      priority: RequestPriority
      estimatedStart: string | null
      scope: string | null
      blockedReason: string | null
      waitingInfoMessage: string | null
      internalNotes: string | null
    }>

    await updateRequestDetails(id, body)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
