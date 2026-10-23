import { NextRequest, NextResponse } from "next/server"
import { getQuotes } from "@/lib/admin/commercial"
import { requireAdminSession } from "@/lib/admin/auth"

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession()

    const { searchParams } = req.nextUrl
    const status = searchParams.get("status") ?? undefined
    const page = parseInt(searchParams.get("page") ?? "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10)

    const result = await getQuotes({ status, page, pageSize })
    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
