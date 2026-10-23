import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((request) => {
  const { nextUrl, auth: session } = request
  const path = nextUrl.pathname

  // ── Admin panel — /admin ─────────────────────────────────────────────────
  if (path.startsWith("/admin") && !session) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("next", path)
    return NextResponse.redirect(loginUrl)
  }

  // ── CRM — /app ───────────────────────────────────────────────────────────
  if (path.startsWith("/app") && !session) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("next", path)
    return NextResponse.redirect(loginUrl)
  }

  if (path === "/login" && session) {
    return NextResponse.redirect(new URL("/app", nextUrl))
  }

  // ── Client portal — /portal ──────────────────────────────────────────────
  const portalAuthPaths = [
    "/portal/login",
    "/portal/register",
    "/portal/forgot-password",
    "/portal/reset-password",
    "/portal/verify-email",
  ]
  const isPortalAuthPage = portalAuthPaths.some((p) => path.startsWith(p))
  const isPortalAcceptPage = path.startsWith("/portal/accept-invite")

  if (path.startsWith("/portal") && !isPortalAuthPage && !isPortalAcceptPage && !session) {
    const loginUrl = new URL("/portal/login", nextUrl)
    loginUrl.searchParams.set("next", path)
    return NextResponse.redirect(loginUrl)
  }

  if (isPortalAuthPage && session) {
    const next = nextUrl.searchParams.get("next") ?? "/portal/dashboard"
    return NextResponse.redirect(new URL(next, nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/app/:path*",
    "/portal/:path*",
    "/login",
    "/((?!_next/static|_next/image|favicon|api/auth|api/audit|sitemap|robots).*)",
  ],
}
