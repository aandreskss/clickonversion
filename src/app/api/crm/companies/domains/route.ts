import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { companies } from "@/lib/db/schema"
import { isNotNull } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await db
    .select({ normalizedDomain: companies.normalizedDomain })
    .from(companies)
    .where(isNotNull(companies.normalizedDomain))

  const domains = rows.map((r) => r.normalizedDomain).filter(Boolean) as string[]
  return NextResponse.json(domains)
}
