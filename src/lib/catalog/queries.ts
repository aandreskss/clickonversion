import { db } from "@/lib/db"
import { pfServiceCatalog, pfServicePrices } from "@/lib/db/schema"
import { eq, inArray, and } from "drizzle-orm"
import type { ServiceCatalogItem, ServicePrice } from "@/types/catalog"

export async function getPublishedCatalog(): Promise<ServiceCatalogItem[]> {
  const services = await db
    .select()
    .from(pfServiceCatalog)
    .where(eq(pfServiceCatalog.isPublished, true))
    .orderBy(pfServiceCatalog.sortOrder)

  if (!services.length) return []

  const prices = await db
    .select()
    .from(pfServicePrices)
    .where(inArray(pfServicePrices.serviceId, services.map((s) => s.id)))

  return services.map((svc) => ({
    id: svc.id,
    slug: svc.slug,
    category: svc.category as ServiceCatalogItem["category"],
    nameEn: svc.nameEn,
    nameEs: svc.nameEs,
    descriptionEn: svc.descriptionEn,
    descriptionEs: svc.descriptionEs,
    isPublished: svc.isPublished,
    sortOrder: svc.sortOrder,
    deliverables: (svc.deliverables as string[]) ?? [],
    requirements: (svc.requirements as string[]) ?? [],
    onboardingFields: (svc.onboardingFields as ServiceCatalogItem["onboardingFields"]) ?? [],
    prices: prices
      .filter((p) => p.serviceId === svc.id)
      .map(toPrice),
  }))
}

export async function getCatalogItemBySlug(slug: string): Promise<ServiceCatalogItem | null> {
  const [svc] = await db
    .select()
    .from(pfServiceCatalog)
    .where(and(eq(pfServiceCatalog.slug, slug), eq(pfServiceCatalog.isPublished, true)))
    .limit(1)

  if (!svc) return null

  const prices = await db
    .select()
    .from(pfServicePrices)
    .where(eq(pfServicePrices.serviceId, svc.id))

  return {
    id: svc.id,
    slug: svc.slug,
    category: svc.category as ServiceCatalogItem["category"],
    nameEn: svc.nameEn,
    nameEs: svc.nameEs,
    descriptionEn: svc.descriptionEn,
    descriptionEs: svc.descriptionEs,
    isPublished: svc.isPublished,
    sortOrder: svc.sortOrder,
    deliverables: (svc.deliverables as string[]) ?? [],
    requirements: (svc.requirements as string[]) ?? [],
    onboardingFields: (svc.onboardingFields as ServiceCatalogItem["onboardingFields"]) ?? [],
    prices: prices.map(toPrice),
  }
}

export async function validateCartItems(
  items: Array<{ serviceId: string; priceId: string; quantity: number }>,
): Promise<ValidatedItem[]> {
  if (items.length === 0) return []

  const priceIds = items.map((i) => i.priceId)
  const prices = await db
    .select({
      price: pfServicePrices,
      serviceSlug: pfServiceCatalog.slug,
      servicePublished: pfServiceCatalog.isPublished,
    })
    .from(pfServicePrices)
    .innerJoin(pfServiceCatalog, eq(pfServicePrices.serviceId, pfServiceCatalog.id))
    .where(and(inArray(pfServicePrices.id, priceIds), eq(pfServicePrices.isActive, true), eq(pfServiceCatalog.isPublished, true)))

  return items.map((item) => {
    const found = prices.find((p) => p.price.id === item.priceId && p.price.serviceId === item.serviceId)
    if (!found) throw new Error(`Price ${item.priceId} is not valid or no longer available`)

    const p = found.price
    return {
      serviceId: item.serviceId,
      priceId: item.priceId,
      quantity: item.quantity,
      unitPriceUsd: Number(p.basePriceUsd ?? 0),
      lineTotalUsd: Number(p.basePriceUsd ?? 0) * item.quantity,
      priceType: p.priceType as ValidatedItem["priceType"],
      billingPeriod: p.billingPeriodVal as ValidatedItem["billingPeriod"],
      serviceName: p.nameEn,
      priceTierName: p.nameEn,
      stripePriceId: p.stripePriceId ?? undefined,
      paypalPlanId: p.paypalPlanId ?? undefined,
    }
  })
}

export interface ValidatedItem {
  serviceId: string
  priceId: string
  quantity: number
  unitPriceUsd: number
  lineTotalUsd: number
  priceType: "ONE_TIME" | "RECURRING" | "STARTING_AT" | "CUSTOM_QUOTE"
  billingPeriod: "monthly" | "quarterly" | "annual" | "one_time" | null
  serviceName: string
  priceTierName: string
  stripePriceId?: string
  paypalPlanId?: string
}

function toPrice(row: typeof pfServicePrices.$inferSelect): ServicePrice {
  return {
    id: row.id,
    serviceId: row.serviceId,
    nameEn: row.nameEn,
    nameEs: row.nameEs,
    priceType: row.priceType as ServicePrice["priceType"],
    basePriceUsd: row.basePriceUsd ? Number(row.basePriceUsd) : null,
    billingPeriod: row.billingPeriodVal as ServicePrice["billingPeriod"],
    stripePriceId: row.stripePriceId,
    paypalPlanId: row.paypalPlanId,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  }
}
