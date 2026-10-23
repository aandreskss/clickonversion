import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateCartItems } from "@/lib/catalog/queries"
import { createOrder } from "@/lib/orders/service"

const CreateOrderSchema = z.object({
  clientEmail:   z.string().email(),
  clientName:    z.string().min(2).max(100),
  clientCompany: z.string().max(100).optional(),
  items: z.array(z.object({
    serviceId: z.string().uuid(),
    priceId:   z.string().uuid(),
    quantity:  z.number().int().positive().max(10),
  })).min(1).max(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    const parsed = CreateOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { clientEmail, clientName, clientCompany, items } = parsed.data

    // Server-side price validation — rejects unavailable or invalid items
    const validatedItems = await validateCartItems(items)

    const order = await createOrder({
      clientEmail,
      clientName,
      clientCompany,
      validatedItems,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order"
    console.error("[orders] POST:", err)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
