import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getMeetingType, getPreBriefForm } from "@/lib/meetings/config"
import { PreBookingForm } from "@/components/booking/pre-booking-form"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

interface Props {
  params:       Promise<{ slug: string }>
  searchParams: Promise<{ token?: string; lang?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meeting = getMeetingType(slug)
  if (!meeting) return { title: "Not Found" }
  return {
    title:       `${meeting.nameEn} — ClicKonversion`,
    description: meeting.descriptionEn,
    robots:      { index: false },
  }
}

export default async function BookSlugPage({ params, searchParams }: Props) {
  const { slug }  = await params
  const { token, lang: rawLang } = await searchParams
  const lang = rawLang === "es" ? "es" : "en"

  const meeting = getMeetingType(slug)
  if (!meeting) notFound()

  // If meeting requires a booking right, we need a token
  // We don't validate server-side here — the pre-form API does the authoritative check.
  // This prevents server-side DB calls on every page load while keeping security in the API layer.
  const isLocked = meeting.requiresBookingRight && !token

  const fields = getPreBriefForm(meeting.preBriefCategory)

  return (
    <MarketingLayout>
      <main className="min-h-screen bg-[--color-obsidian] pt-24 pb-20">
        <div className="max-w-xl mx-auto px-4">

          {/* Back link */}
          <a
            href="/book"
            className="inline-flex items-center gap-1.5 text-sm text-[--color-muted] hover:text-[--color-warm-white] mb-8 transition-colors"
          >
            ← {lang === "es" ? "Todas las sesiones" : "All sessions"}
          </a>

          {/* Session info */}
          <div className="mb-8 space-y-2">
            <p className="text-sm font-semibold text-[--color-brand] uppercase tracking-widest">
              {meeting.durationMin} min
              {meeting.priceUsd !== null && meeting.priceUsd > 0 ? ` · $${meeting.priceUsd}` : meeting.isFree ? " · Free" : ""}
            </p>
            <h1 className="text-3xl font-bold text-[--color-warm-white]">
              {lang === "es" ? meeting.nameEs : meeting.nameEn}
            </h1>
            <p className="text-[--color-muted]">
              {lang === "es" ? meeting.descriptionEs : meeting.descriptionEn}
            </p>
          </div>

          {/* Locked gate */}
          {isLocked ? (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-8 text-center space-y-4">
              <p className="text-[--color-warm-white] font-medium">
                {lang === "es"
                  ? "Esta sesión requiere un pago previo."
                  : "This session requires a prior purchase."}
              </p>
              <p className="text-sm text-[--color-muted]">
                {lang === "es"
                  ? "Adquiere la sesión en nuestra tienda y recibirás un enlace de reserva exclusivo."
                  : "Purchase the session from our shop and you'll receive an exclusive booking link."}
              </p>
              <a
                href="/services"
                className="inline-block mt-2 py-2.5 px-6 bg-[--color-brand] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                {lang === "es" ? "Ver servicios →" : "Browse services →"}
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/4 p-6">
              <PreBookingForm
                fields={fields}
                meetingTypeSlug={slug}
                bookingToken={token}
                lang={lang}
                meetingNameEn={meeting.nameEn}
                meetingNameEs={meeting.nameEs}
              />
            </div>
          )}
        </div>
      </main>
    </MarketingLayout>
  )
}
