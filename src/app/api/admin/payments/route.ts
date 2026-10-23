import { NextRequest, NextResponse } from "next/server"
import { getUnifiedPayments } from "@/lib/admin/payments"
import { requireAdminSession } from "@/lib/admin/auth"

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession()

    const { searchParams } = req.nextUrl
    const provider = searchParams.get("provider") as "stripe" | "paypal" | null
    const status = searchParams.get("status") ?? undefined
    const search = searchParams.get("search") ?? undefined
    const page = parseInt(searchParams.get("page") ?? "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10)
    const sortDir = (searchParams.get("sortDir") ?? "desc") as "asc" | "desc"

    const result = await getUnifiedPayments({
      provider: provider ?? undefined,
      status,
      search,
      page,
      pageSize,
      sortDir,
    })

    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
