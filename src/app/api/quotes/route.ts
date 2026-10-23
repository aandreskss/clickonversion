import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { pfQuotes } from "@/lib/db/schema"

const QuoteSchema = z.object({
  clientEmail:   z.string().email(),
  clientName:    z.string().min(2).max(100),
  clientCompany: z.string().max(100).optional(),
  clientNotes:   z.string().max(2000).optional(),
  services: z.array(z.object({
    serviceId: z.string().uuid(),
    priceId:   z.string().uuid().optional(),
    notes:     z.string().max(500).optional(),
  })).min(1).max(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    const parsed = QuoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { clientEmail, clientName, clientCompany, clientNotes, services } = parsed.data

    const [quote] = await db
      .insert(pfQuotes)
      .values({
        clientEmail,
        clientName,
        clientCompany:     clientCompany ?? null,
        clientNotes:       clientNotes ?? null,
        servicesRequested: services,
      })
      .returning({ id: pfQuotes.id })

    return NextResponse.json({ quoteId: quote.id }, { status: 201 })
  } catch (err) {
    console.error("[quotes] POST:", err)
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 })
  }
}
