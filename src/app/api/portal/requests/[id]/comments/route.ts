import { NextResponse, type NextRequest } from "next/server"
import { z }                              from "zod"
import { getPortalSession }               from "@/lib/portal/auth"
import { getComments, addComment }        from "@/lib/portal/requests"

interface Params { params: Promise<{ id: string }> }

const PostSchema = z.object({
  body:  z.string().min(1).max(2000),
  orgId: z.string().uuid(),
})

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params

  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const comments = await getComments(id, session.orgId)
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params

  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const parsed = PostSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 })

  const { body, orgId } = parsed.data
  if (orgId !== session.orgId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  try {
    const comment = await addComment({
      requestId:  id,
      orgId:      session.orgId,
      authorId:   session.userId,
      authorRole: "client",
      body,
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to post comment."
    if (message === "REQUEST_NOT_FOUND") {
      return NextResponse.json({ error: "Request not found." }, { status: 404 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
