import { NextRequest, NextResponse } from "next/server"
import { createMilestone } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as {
      title: string
      description?: string
      isClientVisible?: boolean
      dueDate?: string
    }

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    await createMilestone({
      requestId: id,
      title: body.title.trim(),
      description: body.description,
      isClientVisible: body.isClientVisible ?? false,
      dueDate: body.dueDate,
    })

    const milestone = {
      id: crypto.randomUUID(),
      requestId: id,
      title: body.title.trim(),
      description: body.description ?? null,
      isClientVisible: body.isClientVisible ?? false,
      status: "pending",
      dueDate: body.dueDate ?? null,
      completedAt: null,
      sortOrder: 0,
    }

    return NextResponse.json({ milestone })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
