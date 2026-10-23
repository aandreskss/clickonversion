import { NextRequest, NextResponse } from "next/server"
import { getSpecialist, updateSpecialist } from "@/lib/admin/specialists"
import { requireAdminSession } from "@/lib/admin/auth"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const specialist = await getSpecialist(id)
    if (!specialist) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(specialist)
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
      displayName: string
      bio: string | null
      timezone: string
      maxConcurrent: number
      isActive: boolean
    }>

    await updateSpecialist(id, body)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
