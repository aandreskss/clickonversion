import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PayPalAdapter } from "@/lib/payments/paypal/adapter"
import { db } from "@/lib/db"
import { pfPayments } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { confirmPayment, updateOrderStatus } from "@/lib/orders/service"

const CaptureSchema = z.object({
  paypalOrderId: z.string(),
  orderId:       z.string().uuid(),
})

/**
 * Called by our checkout success page after PayPal redirects back.
 * Captures the approved PayPal order and marks the internal order as paid.
 *
 * IMPORTANT: The canonical source of truth is still the webhook.
 * This route provides immediate UX feedback; the webhook handles any edge cases.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    const parsed = CaptureSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { paypalOrderId, orderId } = parsed.data
    const adapter = new PayPalAdapter()

    // Capture payment
    const captureId = await adapter.captureOrder(paypalOrderId)

    // Retrieve pending payment record for this order
    const [payment] = await db
      .select({ id: pfPayments.id, amountUsd: pfPayments.amountUsd })
      .from(pfPayments)
      .where(
        and(
          eq(pfPayments.orderId, orderId),
          eq(pfPayments.provider, "paypal"),
          eq(pfPayments.status, "pending"),
        )
      )
      .limit(1)

    if (payment) {
      await confirmPayment({
        orderId,
        paymentId:         payment.id,
        providerPaymentId: captureId,
        actor:             "paypal_capture",
      })
    } else {
      // Payment record not found — still update order (webhook may have already processed)
      await updateOrderStatus(orderId, "paid", "paypal_capture")
    }

    return NextResponse.json({ success: true, captureId })
  } catch (err) {
    console.error("[payments/paypal/capture] POST:", err)
    return NextResponse.json(
      { error: "Failed to capture PayPal payment" },
      { status: 500 }
    )
  }
}
