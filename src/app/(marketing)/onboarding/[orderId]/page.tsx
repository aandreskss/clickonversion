import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { pfOrders, pfOrderItems, pfServiceCatalog } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getPreBriefForm } from "@/lib/meetings/config"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

export const metadata: Metadata = {
  title:   "Onboarding — ClicKonversion",
  robots:  { index: false },
}

interface Props {
  params:       Promise<{ orderId: string }>
  searchParams: Promise<{ email?: string; lang?: string }>
}

export default async function OnboardingPage({ params, searchParams }: Props) {
  const { orderId }             = await params
  const { email, lang: rawLang } = await searchParams
  const lang = rawLang === "es" ? "es" : "en"

  // Fetch order — require email match to prevent order enumeration
  const whereClause = email
    ? and(eq(pfOrders.id, orderId), eq(pfOrders.clientEmail, email))
    : eq(pfOrders.id, orderId)

  const [orderRow] = await db
    .select({ id: pfOrders.id, clientName: pfOrders.clientName, clientEmail: pfOrders.clientEmail, status: pfOrders.status })
    .from(pfOrders)
    .where(whereClause)
    .limit(1)

  if (!orderRow || !["paid", "active"].includes(orderRow.status)) {
    notFound()
  }

  const orderItemRows = await db
    .select({
      id: pfOrderItems.id,
      serviceId: pfOrderItems.serviceId,
      serviceName: pfOrderItems.serviceName,
      onboardingFields: pfServiceCatalog.onboardingFields,
    })
    .from(pfOrderItems)
    .leftJoin(pfServiceCatalog, eq(pfOrderItems.serviceId, pfServiceCatalog.id))
    .where(eq(pfOrderItems.orderId, orderId))

  const order = { client_name: orderRow.clientName, client_email: orderRow.clientEmail }

  // Build onboarding items: services that have onboarding_fields
  const items = orderItemRows.filter(
    (item) =>
      item.onboardingFields &&
      Array.isArray(item.onboardingFields) &&
      (item.onboardingFields as unknown[]).length > 0
  ).map((item) => ({
    id: item.id,
    service_id: item.serviceId ?? "",
    service_name: item.serviceName,
    pf_service_catalog: { onboarding_fields: item.onboardingFields },
  }))

  if (items.length === 0) {
    return (
      <MarketingLayout>
        <main className="min-h-screen bg-[--color-obsidian] pt-24 pb-20">
          <div className="max-w-xl mx-auto px-4 text-center space-y-4">
            <h1 className="text-2xl font-bold text-[--color-warm-white]">
              {lang === "es" ? "Sin formularios pendientes" : "No onboarding forms pending"}
            </h1>
            <p className="text-[--color-muted]">
              {lang === "es"
                ? "Tu onboarding ya está completo o no tiene formularios asociados."
                : "Your onboarding is already complete or has no associated forms."}
            </p>
          </div>
        </main>
      </MarketingLayout>
    )
  }

  // Show first pending service's onboarding form
  const firstItem = items[0]
  const onboardingFields = firstItem.pf_service_catalog!.onboarding_fields as Array<{ key: string }>
  // Use discovery fields as fallback if no typed category available
  const fields = getPreBriefForm("onboarding")

  return (
    <MarketingLayout>
      <main className="min-h-screen bg-[--color-obsidian] pt-24 pb-20">
        <div className="max-w-xl mx-auto px-4">
          <div className="mb-6">
            <p className="text-sm font-semibold text-[--color-brand] uppercase tracking-widest mb-2">
              {lang === "es" ? "Paso final" : "Final step"}
            </p>
            <h1 className="text-3xl font-bold text-[--color-warm-white]">
              {lang === "es" ? "Onboarding" : "Onboarding"}
            </h1>
            <p className="text-[--color-muted] mt-2">
              {lang === "es"
                ? `Hola ${order.client_name}, completa este formulario para que nuestro equipo pueda empezar a trabajar en tu proyecto.`
                : `Hi ${order.client_name}, complete this form so our team can start working on your project.`}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 p-6">
            <OnboardingForm
              orderId={orderId}
              serviceId={firstItem.service_id}
              clientEmail={order.client_email}
              fields={fields}
              serviceName={firstItem.service_name}
              lang={lang}
            />
          </div>

          {items.length > 1 && (
            <p className="mt-4 text-xs text-center text-[--color-muted]">
              {lang === "es"
                ? `Tienes ${items.length} servicios. Te enviaremos el siguiente formulario por correo.`
                : `You have ${items.length} services. We'll send the next form by email.`}
            </p>
          )}
        </div>
      </main>
    </MarketingLayout>
  )
}
