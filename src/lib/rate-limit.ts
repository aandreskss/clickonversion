/**
 * In-memory rate limiter for API routes.
 * State resets per serverless invocation — adequate for Vercel's edge cases.
 * For persistent rate limiting across invocations, replace with Upstash Redis.
 */

interface RateLimitRecord {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitRecord>()

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

const DEFAULTS: RateLimitConfig = { limit: 60, windowMs: 60_000 }

/**
 * Returns true if the key has exceeded its rate limit.
 */
export function isRateLimited(key: string, config: RateLimitConfig = DEFAULTS): boolean {
  const now = Date.now()
  const rec = store.get(key)

  if (!rec || now - rec.windowStart > config.windowMs) {
    store.set(key, { count: 1, windowStart: now })
    return false
  }

  if (rec.count >= config.limit) return true
  rec.count++
  return false
}

/** Extract the real IP from Vercel / Cloudflare headers */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  )
}

/**
 * Convenience: build the rate limit key for portal routes.
 * Combines IP + userId so both vectors are covered.
 */
export function portalRateLimitKey(ip: string, userId: string, route: string): string {
  return `portal:${route}:${userId}:${ip}`
}

// Per-route configs for portal endpoints
export const PORTAL_LIMITS: Record<string, RateLimitConfig> = {
  requests:       { limit: 30,  windowMs: 60_000 },   // 30 req/min
  documents:      { limit: 20,  windowMs: 60_000 },   // 20 req/min (file ops)
  notifications:  { limit: 60,  windowMs: 60_000 },   // 60 req/min (polling)
  comments:       { limit: 20,  windowMs: 60_000 },   // 20 req/min
  org:            { limit: 20,  windowMs: 60_000 },   // 20 req/min
  invite:         { limit: 5,   windowMs: 3_600_000 }, // 5 invites/hour
  default:        { limit: 60,  windowMs: 60_000 },
}
