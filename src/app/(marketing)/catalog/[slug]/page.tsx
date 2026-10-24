import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { db } from "@/lib/db"
import { pfServiceCatalog, pfServicePrices } from "@/lib/db/schema"
import { eq, and, asc } from "drizzle-orm"

export const revalidate = 3600

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

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const services = await db
    .select({ slug: pfServiceCatalog.slug })
    .from(pfServiceCatalog)
    .where(eq(pfServiceCatalog.isPublished, true))

  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const rows = await db
    .select()
    .from(pfServiceCatalog)
    .where(and(eq(pfServiceCatalog.slug, slug), eq(pfServiceCatalog.isPublished, true)))
    .limit(1)

  const service = rows[0]
  if (!service) return {}

  return {
    title: `${service.nameEn} | ClicKonversion`,
    description: service.descriptionEn || `Learn about ${service.nameEn} at ClicKonversion.`,
    alternates: {
      canonical: `https://www.clickonversion.com/catalog/${slug}`,
    },
    openGraph: {
      title: `${service.nameEn} | ClicKonversion`,
      description: service.descriptionEn || "",
      url: `https://www.clickonversion.com/catalog/${slug}`,
      siteName: "ClicKonversion",
      locale: "en_US",
      type: "website",
    },
  }
}

export default async function CatalogServicePage({ params }: Props) {
  const { slug } = await params

  const rows = await db
    .select()
    .from(pfServiceCatalog)
    .where(and(eq(pfServiceCatalog.slug, slug), eq(pfServiceCatalog.isPublished, true)))
    .limit(1)

  const service = rows[0]
  if (!service) notFound()

  const prices = await db
    .select()
    .from(pfServicePrices)
    .where(and(eq(pfServicePrices.serviceId, service.id), eq(pfServicePrices.isActive, true)))
    .orderBy(asc(pfServicePrices.sortOrder))

  const accent = CATEGORY_COLORS[service.category] ?? "#FF5A1F"
  const categoryLabel = CATEGORY_LABELS[service.category] ?? service.category

  function formatPrice(basePriceUsd: string | null, billingPeriodVal: string | null): string {
    if (basePriceUsd == null) return "Custom quote"
    const amount = `$${parseFloat(basePriceUsd).toLocaleString("en-US")}`
    const period =
      billingPeriodVal === "one_time" ? " one-time" :
      billingPeriodVal === "monthly" ? "/mo" :
      billingPeriodVal === "quarterly" ? "/quarter" :
      billingPeriodVal === "annual" ? "/yr" : ""
    return `${amount}${period}`
  }

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#101827]">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#4E5D6E] mb-8">
            <Link href="/catalog" className="flex items-center gap-1 hover:text-[#A8B3C0] transition-colors">
              <ArrowLeft size={12} />
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-[#A8B3C0]">{service.nameEn}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Category badge */}
            <span
              className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full mb-6"
              style={{ background: `${accent}15`, color: accent }}
            >
              {categoryLabel}
            </span>

            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-6">
              {service.nameEn}
            </h1>

            {service.descriptionEn && (
              <p className="text-[#A8B3C0] text-lg leading-relaxed mb-10 max-w-2xl">
                {service.descriptionEn}
              </p>
            )}

            {/* CTAs */}
            {prices[0] && (
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/checkout?serviceId=${service.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl hover:opacity-90 transition-all duration-150 active:scale-[0.98] shadow-lg"
                  style={{ background: accent, color: "#0B0E14", boxShadow: `0 8px 24px ${accent}40` }}
                >
                  Buy Now
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-2 px-8 py-4 text-[#A8B3C0] font-semibold rounded-xl border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-150"
                >
                  Get a free audit first
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing section */}
      {prices.length > 0 && (
        <section className="py-16 bg-[#0B0D0F]">
          <div className="container-wide">
            <p className="eyebrow mb-3" style={{ color: accent }}>
              Pricing
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-12 max-w-lg">
              Transparent pricing. No surprises.
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
              {prices.map((price, idx) => {
                const isFirst = idx === 0
                return (
                  <div
                    key={price.id}
                    className="relative rounded-2xl p-8 border transition-all duration-200"
                    style={{
                      borderColor: isFirst ? `${accent}40` : "rgba(255,255,255,0.07)",
                      background: isFirst ? `${accent}08` : "rgba(255,255,255,0.02)",
                    }}
                  >
                    {isFirst && (
                      <div
                        className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${accent}20`, color: accent }}
                      >
                        Most popular
                      </div>
                    )}

                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {price.nameEn}
                    </h3>

                    <p
                      className="text-2xl font-extrabold mb-6"
                      style={{ color: accent }}
                    >
                      {formatPrice(price.basePriceUsd, price.billingPeriodVal)}
                    </p>

                    <Link
                      href={`/checkout?serviceId=${service.id}&priceId=${price.id}`}
                      className="block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-150 border"
                      style={{
                        borderColor: isFirst ? accent : "rgba(255,255,255,0.1)",
                        color: isFirst ? "#0B0E14" : "#A8B3C0",
                        background: isFirst ? accent : "transparent",
                      }}
                    >
                      Get started
                    </Link>
                  </div>
                )
              })}
            </div>

            <p className="mt-8 text-xs text-[#4E5D6E]">
              All prices in USD. Custom scopes available — <Link href="/audit" className="underline hover:text-[#A8B3C0] transition-colors">contact us for a tailored quote</Link>.
            </p>
          </div>
        </section>
      )}

      {/* No prices — CTA to audit */}
      {prices.length === 0 && (
        <section className="py-16 bg-[#0B0D0F]">
          <div className="container-wide text-center">
            <p className="text-[#7A8799] mb-6">Este servicio tiene precio personalizado según el proyecto.</p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-colors"
            >
              Get a Free Growth Audit
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </MarketingLayout>
  )
}
