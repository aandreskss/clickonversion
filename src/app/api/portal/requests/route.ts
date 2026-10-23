import { NextResponse }     from "next/server"
import { getPortalSession } from "@/lib/portal/auth"
import { getRequests }      from "@/lib/portal/requests"

export async function GET() {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const requests = await getRequests(session.orgId)
  return NextResponse.json(requests)
}
