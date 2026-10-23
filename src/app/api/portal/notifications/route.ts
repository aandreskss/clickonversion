import { NextResponse }        from "next/server"
import { getPortalSession }    from "@/lib/portal/auth"
import {
  getNotifications,
  markAllRead,
} from "@/lib/portal/notifications"

export async function GET() {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const notifications = await getNotifications(session.userId)
  return NextResponse.json(notifications)
}

export async function PATCH() {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  await markAllRead(session.userId)
  return NextResponse.json({ ok: true })
}
