import { NextResponse, type NextRequest } from "next/server"
import { getPortalSession }               from "@/lib/portal/auth"
import { getRequest }                     from "@/lib/portal/requests"

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params

  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const request = await getRequest(id, session.orgId)
  if (!request) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 })

  return NextResponse.json(request)
}
