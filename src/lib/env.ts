/**
 * Environment variable validation.
 * Crashes on startup if required server-side vars are missing.
 * Logs friendly warnings for optional integrations.
 */

function optionalEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] ?? fallback
}

// ── Public (safe to expose to browser) ─────────────────────────────────────

export const SITE_URL        = optionalEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000")!
export const APP_URL         = optionalEnv("NEXT_PUBLIC_APP_URL",  "http://localhost:3000/app")!
export const BOOKING_URL     = optionalEnv("NEXT_PUBLIC_BOOKING_URL")
export const SUPABASE_URL    = optionalEnv("NEXT_PUBLIC_SUPABASE_URL", "")!
export const SUPABASE_KEY    = optionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "")!
export const GA_ID           = optionalEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID")
export const GSC_VERIFY      = optionalEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION")
export const TURNSTILE_SITE  = optionalEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY")

// ── Server-only ─────────────────────────────────────────────────────────────
// These are only accessed in server components / route handlers.
// Never prefix with NEXT_PUBLIC_.

export function getServerEnv() {
  return {
    turnstileSecret:   optionalEnv("TURNSTILE_SECRET_KEY"),
    resendApiKey:      optionalEnv("RESEND_API_KEY"),
    emailFrom:         optionalEnv("EMAIL_FROM", "ClicKonversion <notifications@clickonversion.com>"),
    notificationEmail: optionalEnv("NOTIFICATION_EMAIL", "arnaldo@clickonversion.com"),
    orgId:             optionalEnv("SUPABASE_ORG_ID"),
  }
}

export function warnMissingIntegrations() {
  const warnings: string[] = []
  if (!GA_ID)          warnings.push("GA4 not configured (NEXT_PUBLIC_GA_MEASUREMENT_ID)")
  if (!BOOKING_URL)    warnings.push("Booking URL not configured (NEXT_PUBLIC_BOOKING_URL)")
  if (!TURNSTILE_SITE) warnings.push("Turnstile not configured — audit form uses honeypot only")
  if (!SUPABASE_URL)   warnings.push("Supabase not configured — CRM will not function")

  if (warnings.length && process.env.NODE_ENV === "development") {
    console.warn("[ClicKonversion] Missing optional integrations:")
    warnings.forEach((w) => console.warn(" ·", w))
  }
}
