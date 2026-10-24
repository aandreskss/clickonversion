import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { db } from "@/lib/db"
import { pfServiceCatalog, pfServicePrices } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Servicios — Catálogo de precios | ClicKonversion",
  description:
    "Explora todos nuestros servicios de growth marketing: SEO, Meta Ads, automatización con IA y soporte. Precios claros, sin sorpresas.",
  alternates: {
    canonical: "https://www.clickonversion.com/catalog",
  },
}

const CATEGORY_LABELS: Record<string, string> = {
  seo: "SEO",
  "paid-media": "Paid Media",
  automation: "Automation",
  support: "Support",
}

const CATEGORY_COLORS: Record<string, string> = {
  seo: "#78E6B3",
  "paid-media": "#FFCB86",
  automation: "#7885FF",
  support: "#FF5A1F",
}

export default async function CatalogPage() {
  const services = await db
    .select()
    .from(pfServiceCatalog)
    .where(eq(pfServiceCatalog.isPublished, true))
    .orderBy(asc(pfServiceCatalog.sortOrder))

  const serviceIds = services.map((s) => s.id)

  let priceMap = new Map<string, { basePriceUsd: string | null; billingPeriodVal: string | null; nameEn: string }>()

  if (serviceIds.length > 0) {
    const { inArray } = await import("drizzle-orm")
    const prices = await db
      .select()
      .from(pfServicePrices)
      .where(inArray(pfServicePrices.serviceId, serviceIds))

    for (const price of prices) {
      if (price.isActive && !priceMap.has(price.serviceId)) {
        priceMap.set(price.serviceId, {
          basePriceUsd: price.basePriceUsd,
          billingPeriodVal: price.billingPeriodVal,
          nameEn: price.nameEn,
        })
      }
    }
  }

  function formatPrice(serviceId: string): string {
    const price = priceMap.get(serviceId)
    if (!price || price.basePriceUsd == null) return "Custom quote"
    const amount = `$${parseFloat(price.basePriceUsd).toLocaleString("en-US")}`
    const period = price.billingPeriodVal === "one_time" ? " one-time" :
      price.billingPeriodVal === "monthly" ? "/mo" :
      price.billingPeriodVal === "quarterly" ? "/quarter" :
      price.billingPeriodVal === "annual" ? "/yr" : ""
    return `${amount}${period}`
  }

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#101827]">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#4E5D6E] mb-5">Catálogo</p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-6">
              Servicios y precios
            </h1>
            <p className="text-[#7A8799] text-lg leading-relaxed">
              Precios transparentes para cada servicio. Sin letra pequeña, sin sorpresas.
            </p>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-[#0B0D0F]">
        <div className="container-wide">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#546072] text-lg">Próximamente</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const accent = CATEGORY_COLORS[service.category] ?? "#FF5A1F"
                const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category
                const price = formatPrice(service.id)

                return (
                  <article
                    key={service.id}
                    className="group relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 flex flex-col"
                  >
                    {/* Category badge */}
                    <span
                      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-4 self-start"
                      style={{ background: `${accent}15`, color: accent }}
                    >
                      {categoryLabel}
                    </span>

                    {/* Name */}
                    <h2 className="font-display text-lg font-bold text-white mb-2">
                      {service.nameEn}
                    </h2>

                    {/* Description */}
                    {service.descriptionEn && (
                      <p className="text-sm text-[#7A8799] leading-relaxed mb-4 line-clamp-3 flex-1">
                        {service.descriptionEn}
                      </p>
                    )}

                    {/* Price */}
                    <p
                      className="text-xl font-extrabold mb-5"
                      style={{ color: accent }}
                    >
                      {price}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <Link
                        href={`/checkout?serviceId=${service.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl text-[#0B0E14] transition-all duration-150"
                        style={{ background: accent }}
                      >
                        Get Started
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        href={`/catalog/${service.slug}`}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-white/10 text-[#A8B3C0] hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-150"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </MarketingLayout>
  )
}
