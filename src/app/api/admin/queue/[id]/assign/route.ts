import { NextRequest, NextResponse } from "next/server"
import { assignSpecialist } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as { specialistId: string | null }

    const result = await assignSpecialist({
      requestId: id,
      specialistId: body.specialistId,
      assignedBy: session.userId,
      assignedByEmail: session.email,
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
