import Link from "next/link"
import { Clock, DollarSign, Lock, Users } from "lucide-react"
import type { MeetingTypeConfig } from "@/types/meetings"

interface MeetingTypeCardProps {
  meeting: MeetingTypeConfig
  lang?:   "en" | "es"
  token?:  string
}

export function MeetingTypeCard({ meeting, lang = "en", token }: MeetingTypeCardProps) {
  const name        = lang === "es" ? meeting.nameEs        : meeting.nameEn
  const description = lang === "es" ? meeting.descriptionEs : meeting.descriptionEn

  const isLocked = meeting.requiresBookingRight && !token
  const href     = isLocked
    ? undefined
    : `/book/${meeting.slug}${token ? `?token=${token}` : ""}`

  const priceLabel = meeting.isFree
    ? (lang === "es" ? "Gratis" : "Free")
    : meeting.priceUsd !== null
    ? `$${meeting.priceUsd}`
    : (lang === "es" ? "A consultar" : "Custom")

  return (
    <div
      className={[
        "relative rounded-2xl border p-6 flex flex-col gap-4 transition-all",
        isLocked
          ? "border-white/5 bg-white/2 opacity-60 cursor-not-allowed"
          : "border-white/10 bg-white/4 hover:border-[--color-brand]/40 hover:bg-white/6",
      ].join(" ")}
    >
      {/* Locked badge */}
      {isLocked && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs text-[--color-muted] bg-white/5 rounded-full px-3 py-1">
          <Lock size={11} />
          {lang === "es" ? "Requiere pago" : "Requires purchase"}
        </span>
      )}

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[--color-warm-white]">{name}</h3>
        <p className="text-sm text-[--color-muted] leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-[--color-muted]">
        <span className="flex items-center gap-1.5">
          <Clock size={14} />
          {meeting.durationMin} {lang === "es" ? "min" : "min"}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign size={14} />
          {priceLabel}
        </span>
        {meeting.includedWithService && (
          <span className="flex items-center gap-1.5 text-[--color-brand]">
            <Users size={14} />
            {lang === "es" ? "Incluido" : "Included"}
          </span>
        )}
      </div>

      {href ? (
        <Link
          href={href}
          className="mt-auto inline-block text-center py-2.5 px-5 bg-[--color-brand] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {lang === "es" ? "Reservar →" : "Book →"}
        </Link>
      ) : (
        <span className="mt-auto inline-block text-center py-2.5 px-5 bg-white/5 text-[--color-muted] text-sm font-semibold rounded-xl">
          {lang === "es" ? "No disponible" : "Unavailable"}
        </span>
      )}
    </div>
  )
}
