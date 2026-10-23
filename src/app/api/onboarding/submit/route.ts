import { getServerEnv } from "@/lib/env"
import { onboardingSubmittedAdminEmail, onboardingConfirmedClientEmail } from "@/lib/email/templates"
import { sendEmail } from "@/lib/email/service"
import { SITE_URL } from "@/lib/env"
import { db } from "@/lib/db"
import { pfOrders, pfOnboardingResponses, pfServiceCatalog } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"

export const dynamic = "force-dynamic"

const bodySchema = z.object({
  orderId:     z.string().uuid(),
  serviceId:   z.string().min(1),
  clientEmail: z.string().email(),
  responses:   z.record(z.string(), z.unknown()),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Validation failed" }, { status: 422 })
  }

  const { orderId, serviceId, clientEmail, responses } = parsed.data

  // Verify the order belongs to this client
  const [order] = await db
    .select({
      id:          pfOrders.id,
      clientName:  pfOrders.clientName,
      clientEmail: pfOrders.clientEmail,
      status:      pfOrders.status,
    })
    .from(pfOrders)
    .where(and(eq(pfOrders.id, orderId), eq(pfOrders.clientEmail, clientEmail)))
    .limit(1)

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 })
  }

  // Upsert onboarding response (idempotent — unique on order_id + service_id)
  let onboardingId: string
  try {
    const [onboarding] = await db
      .insert(pfOnboardingResponses)
      .values({
        orderId,
        serviceId,
        clientEmail,
        responses,
        status:      "submitted",
        submittedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [pfOnboardingResponses.orderId, pfOnboardingResponses.serviceId],
        set: {
          responses,
          status:      "submitted",
          submittedAt: new Date(),
        },
      })
      .returning({ id: pfOnboardingResponses.id })

    onboardingId = onboarding.id
  } catch (insertErr) {
    console.error("[onboarding] insert error:", insertErr)
    return Response.json({ error: "Failed to save onboarding" }, { status: 500 })
  }

  // Fetch service name for email
  const [service] = await db
    .select({ nameEn: pfServiceCatalog.nameEn })
    .from(pfServiceCatalog)
    .where(eq(pfServiceCatalog.id, serviceId))
    .limit(1)

  const serviceName = service?.nameEn ?? "your service"

  // Admin notification
  const { notificationEmail } = getServerEnv()
  const reviewUrl = `${SITE_URL}/app/onboarding/${onboardingId}`

  const { subject: adminSubject, html: adminHtml } = onboardingSubmittedAdminEmail({
    clientName:  order.clientName,
    clientEmail: order.clientEmail,
    serviceName,
    orderId:     orderId.slice(0, 8).toUpperCase(),
    reviewUrl,
  })
  await sendEmail({ to: notificationEmail ?? "arnaldo@clickonversion.com", subject: adminSubject, html: adminHtml })

  // Client confirmation
  const { subject: clientSubject, html: clientHtml } = onboardingConfirmedClientEmail({
    clientName:  order.clientName,
    serviceName,
    nextSteps: [
      "Our team will review your responses within 1 business day.",
      "You'll receive a kickoff call invitation to align on goals and timelines.",
      "We'll start work after the kickoff is completed.",
    ],
  })
  await sendEmail({ to: clientEmail, subject: clientSubject, html: clientHtml })

  return Response.json({ ok: true, onboardingId }, { status: 201 })
}
