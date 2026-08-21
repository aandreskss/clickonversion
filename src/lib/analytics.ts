"use client"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

type GtagEvent = {
  event_category?: string
  event_label?: string
  page?: string
  cta_location?: string
  source?: string
  campaign?: string
  [key: string]: string | number | boolean | undefined
}

function track(eventName: string, params?: GtagEvent) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", eventName, params)
}

// ── Marketing Events ─────────────────────────────────────────────────────────

export const analytics = {
  primaryCtaClick(location: string) {
    track("primary_cta_click", { cta_location: location })
  },

  auditStarted() {
    track("audit_started")
  },

  auditSubmitted() {
    track("audit_submitted")
  },

  bookingClick(source: string) {
    track("booking_click", { source })
  },

  serviceCtaClick(service: string, location: string) {
    track("service_cta_click", { event_label: service, cta_location: location })
  },

  founderLinkedInClick() {
    track("founder_linkedin_click")
  },

  pageView(path: string) {
    track("page_view", { page: path })
  },
} as const
