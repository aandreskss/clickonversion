import type { Metadata } from "next"
import { MEETING_TYPES } from "@/lib/meetings/config"
import { MeetingTypeCard } from "@/components/booking/meeting-type-card"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

export const metadata: Metadata = {
  title: "Book a Session — ClicKonversion",
  description: "Schedule a free growth audit, advisory session, or project check-in with the ClicKonversion team.",
}

export default function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; lang?: string }>
}) {
  // searchParams is async in Next.js 16 — but we can use it synchronously here
  // via static usage since this page uses it only for pass-through
  return (
    <MarketingLayout>
      <BookPageContent />
    </MarketingLayout>
  )
}

function BookPageContent() {
  const visibleTypes = Object.values(MEETING_TYPES).filter(
    (m) => !m.requiresActiveSubscription
  )

  return (
    <main className="min-h-screen bg-[--color-obsidian] pt-24 pb-20">
      <div className="container-tight mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand]">
            Book a Session
          </p>
          <h1 className="text-4xl font-bold text-[--color-warm-white]">
            Let&apos;s talk about your growth
          </h1>
          <p className="text-[--color-muted] max-w-lg mx-auto">
            Start with a free 15-minute audit call. Paid advisory sessions are available after checkout.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {visibleTypes.map((m) => (
            <MeetingTypeCard key={m.slug} meeting={m} lang="en" />
          ))}
        </div>

        {/* Active clients note */}
        <p className="mt-8 text-center text-xs text-[--color-muted]">
          Project follow-up calls are available to active clients via your dashboard.
        </p>
      </div>
    </main>
  )
}
