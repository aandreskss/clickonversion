import { NextRequest, NextResponse } from "next/server"
import { addAdminComment } from "@/lib/admin/queue"
import { requireAdminSession } from "@/lib/admin/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminSession()
    const { id } = await params
    const body = (await req.json()) as { body: string; isInternal?: boolean }

    if (!body.body?.trim()) {
      return NextResponse.json({ error: "body is required" }, { status: 400 })
    }

    await addAdminComment({
      requestId: id,
      authorId: session.userId,
      authorRole: session.platformRole === "admin" ? "admin" : "staff",
      body: body.body.trim(),
      isInternal: body.isInternal ?? false,
    })

    // Return a synthetic comment for optimistic UI
    const comment = {
      id: crypto.randomUUID(),
      requestId: id,
      authorId: session.userId,
      authorRole: session.platformRole === "admin" ? "admin" : "staff",
      body: body.body.trim(),
      isInternal: body.isInternal ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: session.userId,
        email: session.email,
        fullName: session.fullName,
        avatarUrl: null,
      },
    }

    return NextResponse.json({ comment })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error"
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
