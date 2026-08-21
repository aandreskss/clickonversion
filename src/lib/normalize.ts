/**
 * Client-side normalization utilities.
 * The database also has PostgreSQL equivalents (normalize_domain, normalize_email).
 * These run on the server-side before insert to prevent duplicates.
 */

export function normalizeDomain(url: string | null | undefined): string | null {
  if (!url?.trim()) return null
  try {
    let raw = url.trim().toLowerCase()
    if (!raw.startsWith("http")) raw = `https://${raw}`
    const u = new URL(raw)
    return u.hostname.replace(/^www\./, "")
  } catch {
    // Fallback: strip protocol + www manually
    return url
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")
      .trim() || null
  }
}

export function normalizeEmail(email: string | null | undefined): string | null {
  const v = email?.trim().toLowerCase()
  return v || null
}

export function normalizeName(name: string | null | undefined): string | null {
  if (!name?.trim()) return null
  return name.trim().toLowerCase().replace(/\s+/g, " ")
}

export function isDuplicateDomain(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const da = normalizeDomain(a)
  const db = normalizeDomain(b)
  return !!da && !!db && da === db
}

export function isDuplicateEmail(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const ea = normalizeEmail(a)
  const eb = normalizeEmail(b)
  return !!ea && !!eb && ea === eb
}
