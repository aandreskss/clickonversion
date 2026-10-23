import { NextResponse } from "next/server"
import { getPublishedCatalog } from "@/lib/catalog/queries"

export const revalidate = 60  // Cache catalog for 60 seconds

export async function GET() {
  try {
    const catalog = await getPublishedCatalog()
    return NextResponse.json({ catalog })
  } catch (err) {
    console.error("[catalog] Failed to fetch catalog:", err)
    return NextResponse.json({ error: "Failed to load catalog" }, { status: 500 })
  }
}
