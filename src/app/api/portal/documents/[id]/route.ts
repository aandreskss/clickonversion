import { NextResponse, type NextRequest } from "next/server"
import { getPortalSession }               from "@/lib/portal/auth"
import { getSignedUrl, deleteDocument }   from "@/lib/portal/documents"

interface Params { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params

  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get("orgId")
  if (!orgId || orgId !== session.orgId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  try {
    const url = await getSignedUrl(id, session.orgId)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params

  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get("orgId") ?? session.orgId

  try {
    await deleteDocument(id, orgId)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "NOT_FOUND or FORBIDDEN" }, { status: 404 })
  }
}
