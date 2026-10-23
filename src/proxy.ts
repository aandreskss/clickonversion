import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // ── Admin panel — /admin ──────────────────────────────────────────────────
  // Role check (admin/staff only) is done in the layout via getAdminSession()

  if (path.startsWith("/admin") && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", path)
    return NextResponse.redirect(loginUrl)
  }

  // ── Admin CRM — /app ─────────────────────────────────────────────────────

  if (path.startsWith("/app") && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", path)
    return NextResponse.redirect(loginUrl)
  }

  if (path === "/login" && user) {
    return NextResponse.redirect(new URL("/app", request.url))
  }

  // ── Client portal — /portal ──────────────────────────────────────────────

  // Auth pages that do NOT require a session
  const portalAuthPaths = [
    "/portal/login",
    "/portal/register",
    "/portal/forgot-password",
    "/portal/reset-password",
    "/portal/verify-email",
  ]
  const isPortalAuthPage   = portalAuthPaths.some((p) => path.startsWith(p))
  const isPortalAcceptPage = path.startsWith("/portal/accept-invite")

  // Protected portal routes
  if (
    path.startsWith("/portal") &&
    !isPortalAuthPage &&
    !isPortalAcceptPage &&
    !user
  ) {
    const loginUrl = new URL("/portal/login", request.url)
    loginUrl.searchParams.set("next", path)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from portal auth pages
  if (isPortalAuthPage && user) {
    const next = request.nextUrl.searchParams.get("next") ?? "/portal/dashboard"
    return NextResponse.redirect(new URL(next, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/app/:path*",
    "/portal/:path*",
    "/login",
    "/((?!_next/static|_next/image|favicon|api/audit|sitemap|robots).*)",
  ],
}
