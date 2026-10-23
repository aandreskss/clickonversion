import { NextRequest, NextResponse } from "next/server"
import { updateMilestone } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"
import type { MilestoneStatus } from "@/types/portal"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as Partial<{
      title: string
      description: string | null
      isClientVisible: boolean
      status: MilestoneStatus
      dueDate: string | null
      completedAt: string | null
    }>

    await updateMilestone(id, body)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
