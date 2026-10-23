import { NextResponse } from "next/server"
import { getSpecialists } from "@/lib/admin/specialists"
import { requireAdminSession } from "@/lib/admin/auth"

export async function GET() {
  try {
    await requireAdminSession()
    const items = await getSpecialists()
    return NextResponse.json({ items, total: items.length })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
