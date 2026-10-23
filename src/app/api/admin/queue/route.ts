import { NextRequest, NextResponse } from "next/server"
import { getQueue } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"
import type { AdminRequestStatus, RequestPriority } from "@/types/admin"

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdminSession()
    void session

    const { searchParams } = req.nextUrl
    const statusParam = searchParams.get("status")
    const priorityParam = searchParams.get("priority")
    const search = searchParams.get("search") ?? undefined
    const page = parseInt(searchParams.get("page") ?? "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10)
    const specialistId = searchParams.get("specialistId") ?? undefined

    const status = statusParam
      ? (statusParam.split(",") as AdminRequestStatus[])
      : undefined

    const priority = priorityParam
      ? (priorityParam.split(",") as RequestPriority[])
      : undefined

    const result = await getQueue({
      status,
      priority,
      search,
      specialistId,
      page,
      pageSize,
    })

    return NextResponse.json(result)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
