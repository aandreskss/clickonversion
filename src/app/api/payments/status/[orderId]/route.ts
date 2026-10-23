import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { pfOrders } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
  }

  try {
    const [order] = await db
      .select({
        id:               pfOrders.id,
        orderNumber:      pfOrders.orderNumber,
        status:           pfOrders.status,
        totalUsd:         pfOrders.totalUsd,
        recurringTotalUsd: pfOrders.recurringTotalUsd,
        createdAt:        pfOrders.createdAt,
      })
      .from(pfOrders)
      .where(eq(pfOrders.id, orderId))
      .limit(1)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Only expose status — never expose internal payment IDs
    return NextResponse.json({
      orderId:           order.id,
      orderNumber:       order.orderNumber,
      status:            order.status,
      totalUsd:          order.totalUsd,
      recurringTotalUsd: order.recurringTotalUsd,
      createdAt:         order.createdAt?.toISOString(),
    })
  } catch (err) {
    console.error("[payments/status] GET:", err)
    return NextResponse.json({ error: "Failed to fetch order status" }, { status: 500 })
  }
}
