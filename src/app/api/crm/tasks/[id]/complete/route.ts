import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await db
    .update(tasks)
    .set({ completedAt: new Date() })
    .where(eq(tasks.id, id))

  return NextResponse.json({ ok: true })
}
