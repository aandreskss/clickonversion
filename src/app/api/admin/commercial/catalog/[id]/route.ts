import { NextRequest, NextResponse } from "next/server"
import { updateService } from "@/lib/admin/commercial"
import { requireAdminSession } from "@/lib/admin/auth"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as Partial<{
      isPublished: boolean
      nameEn: string
      nameEs: string
      category: string
      sortOrder: number
    }>

    await updateService(id, body)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
