@AGENTS.md

# ClicKonversion — Claude Code Instructions

## Mission
Build a growth operating system to help ClicKonversion acquire its first 3 clients and reach $2,000 MRR.

## Current Phase
**Phase 7 — Apps, QA Integral y Lanzamiento**

Fase 6 (Panel Administrativo) completada. Build limpio. 179 tests pasan. El panel admin está funcional con dashboard de métricas, cola de trabajo, gestión de especialistas, comercial, pagos unificados y analítica interna.

---

## Build Roadmap

| Fase | Nombre | Estado | Descripción |
|------|--------|--------|-------------|
| 0 | Marketing + CRM | ✅ Completa | Site live, CRM lead capture, audit form, pipeline |
| 2 | Homepage | ✅ Completa | 10 secciones, design system, logos, servicios EN+ES |
| 3 | Catálogo + Pagos | ✅ Completa | Stripe + PayPal, carrito, checkout, webhooks idempotentes |
| 4 | Reservas y Onboarding | ✅ Completa | Cal.com, booking rights, formularios pre-brief, email bilingüe |
| 5 | Portal de Clientes | ✅ Completa | Auth, dashboard, requests, documentos, billing, settings, RLS |
| 6 | Panel Administrativo | ✅ Completa | Dashboard métricas, cola de trabajo, especialistas, comercial, pagos, analítica |
| 7 | Apps, QA y Lanzamiento | ⏳ Pendiente | QA integral, apps móviles/PWA, hardening, launch checklist |

---

## Fase 5 — Portal de Clientes ✅

Completada. Build limpio. 81/81 tests.

**Migraciones:** `010_platform_users.sql`, `011_client_orgs.sql`, `012_requests.sql`, `013_documents.sql`, `014_notifications.sql`, `015_rls_portal.sql`

**Rutas portal:** `/portal/login`, `/portal/register`, `/portal/forgot-password`, `/portal/reset-password`, `/portal/accept-invite/[token]`, `/portal/dashboard`, `/portal/requests`, `/portal/requests/[id]`, `/portal/documents`, `/portal/billing`, `/portal/settings`

**API portal:** `/api/portal/notifications`, `/api/portal/requests`, `/api/portal/requests/[id]`, `/api/portal/requests/[id]/comments`, `/api/portal/documents`, `/api/portal/documents/[id]`, `/api/portal/org`, `/api/portal/org/members`, `/api/portal/org/invite`, `/api/portal/org/accept-invite`

**Seguridad:** RLS en 7 tablas `pf_*`. Org isolation doble capa (app + DB). `internal_notes` e `is_internal` nunca expuestos al cliente. Signed URLs server-side (1hr TTL). 404 indistinguible para not-found vs wrong-org. Storage path opaco: `{orgId}/{uuid}/{filename}`.

**Lib:** `src/lib/portal/auth.ts`, `requests.ts`, `documents.ts`, `notifications.ts`

---

## Fase 6 — Panel Administrativo y Operaciones ✅

Completada. Build limpio. 179/179 tests (81 prev + 98 nuevos).

**Migraciones:** `016_admin_roles.sql`, `017_requests_enhancements.sql`, `018_payment_reconciliation.sql`, `019_analytics_internal.sql`, `020_catalog_price_history.sql`, `021_rls_admin.sql`

**Roles internos (`admin_role` enum en `pf_platform_users`):** `owner | admin | manager | specialist`
- Owner y Admin: acceso total
- Manager: dashboard, cola, view comercial, analytics (sin write)
- Specialist: solo sus solicitudes asignadas

**Permisos:** Sistema de permissions granular en `src/lib/admin/permissions.ts`. Verificación en cada API route con `requirePermission(session, permission)`.

**Rutas admin (`/admin/**`, protegidas por proxy.ts + layout):**
- `/admin` — Dashboard con métricas (ingresos cobrados, recurrentes, pedidos, solicitudes, asesorías)
- `/admin/queue` — Cola de trabajo con filtros, pills de estado, paginación
- `/admin/queue/[id]` — Detalle: tabs Actividad/Hitos/Historial, panel de detalles, cambio de estado
- `/admin/team` — Equipo interno con carga de especialistas
- `/admin/team/[id]` — Perfil especialista: capacidad, servicios, requests asignadas
- `/admin/commercial` — Hub: catálogo, cotizaciones, clientes
- `/admin/commercial/catalog` — CRUD servicios con toggle publicación
- `/admin/commercial/quotes` — Cotizaciones con drawer de propuesta y link Stripe
- `/admin/commercial/clients` — Organizaciones clientes con búsqueda
- `/admin/commercial/clients/[id]` — Detalle cliente: miembros y solicitudes
- `/admin/payments` — Vista unificada Stripe+PayPal con discrepancias
- `/admin/analytics` — Funnel interno + tabla eventos (GA4 para frontend)
- `/admin/settings` — Verificación env vars + info stack

**API routes (`/api/admin/**`):**
- `GET /api/admin/queue` — cola con filtros (status, priority, search, page)
- `GET|PATCH /api/admin/queue/[id]` — detalle y actualización de request
- `POST /api/admin/queue/[id]/status` — transición de estado con log inmutable
- `POST /api/admin/queue/[id]/assign` — asignar especialista (valida capacidad)
- `POST /api/admin/queue/[id]/comments` — comentario público o interno
- `POST /api/admin/queue/[id]/milestones` — crear hito
- `PATCH /api/admin/milestones/[id]` — actualizar hito (estado, visibilidad)
- `GET|POST /api/admin/specialists` — lista y creación
- `GET|PATCH /api/admin/specialists/[id]` — detalle y edición
- `PATCH /api/admin/commercial/catalog/[id]` — editar servicio
- `GET|POST /api/admin/commercial/quotes` — lista y creación
- `GET|PATCH /api/admin/commercial/quotes/[id]` — detalle y propuesta
- `POST /api/admin/commercial/quotes/[id]/payment-link` — link Stripe
- `GET /api/admin/payments` — pagos unificados
- `GET /api/admin/payments/discrepancies` — discrepancias pendientes
- `POST /api/admin/payments/discrepancies/[id]/resolve` — marcar resuelto

**Lib (`src/lib/admin/`):**
- `permissions.ts` — Matriz de permisos por rol
- `auth.ts` — `getAdminSession()`, `requireAdminSession()`, `requirePermission()`
- `queue.ts` — Cola, transiciones de estado, asignaciones, milestones, comentarios, notificaciones
- `dashboard.ts` — Métricas con Promise.allSettled (fallback 0 si falla alguna query)
- `specialists.ts` — Perfiles, capacidad, servicios habilitados
- `commercial.ts` — Catálogo, precios con historial, cotizaciones, clientes, suscripciones
- `payments.ts` — Vista unificada, conciliación, discrepancias
- `analytics-admin.ts` — Eventos internos, funnel, time series

**Componentes (`src/components/admin/`):**
`StatusBadge`, `PriorityBadge`, `MetricCard`, `SpecialistLoadBar`, `QueueTable`, `PaymentTable`, `StatusTransitionDialog`, `AdminSidebar`, `AdminHeader`

**Tablas nuevas:**
- `pf_specialist_profiles` — perfil, bio, timezone, max_concurrent
- `pf_specialist_services` — servicios habilitados por especialista
- `pf_request_status_log` — log inmutable de transiciones (trigger deniega UPDATE/DELETE)
- `pf_payment_reconciliation` — conciliación Stripe+PayPal con discrepancy generado
- `pf_analytics_events` — eventos internos del servidor
- `pf_catalog_price_history` — historial de cambios de precio (inmutable)

**Estado de solicitudes (10 estados + 3 legacy):**
`pending_payment → queued → in_progress → review → completed → refunded`
`in_progress → waiting_client | waiting_third_party | cancelled`
`consultation_scheduled` entre queued e in_progress

**Decisiones críticas:**
- Cambiar precio en `pf_service_prices` NUNCA modifica `pf_order_items` (snapshots inmutables)
- `pf_request_status_log` es append-only — trigger previene UPDATE/DELETE en DB
- Specialists ven solo sus requests asignadas (filtro a nivel de API, no solo RLS)
- Notificaciones automáticas al cliente en: `waiting_client`, `completed`, `review`, nuevo comentario público

**Tests:** `admin-roles`, `admin-queue`, `admin-status-transitions`, `admin-quotes`, `admin-price-changes`, `admin-payments`, `admin-notifications`, `admin-audit`

---

## Fase 7 — Apps, QA Integral y Lanzamiento

**Objetivo:** Hardening completo de la plataforma, cobertura de pruebas E2E, apps móviles (o PWA), y checklist de lanzamiento a producción para el primer cliente pagador.

**Scope:**

### QA Integral
- Pruebas E2E con Playwright: flujos críticos (registro → portal → request → comentario → descarga)
- Pruebas de aislamiento multi-tenant: verificar que org A no puede leer datos de org B manipulando URLs o requests HTTP
- Pruebas de pagos: Stripe + PayPal en modo sandbox, webhooks con ngrok
- Pruebas de seguridad: fuzzing de IDs, manipulación de orgId en payloads, tokens expirados
- Auditoría de performance: Core Web Vitals, bundle size, TTFB en rutas críticas

### Apps / PWA
- Progressive Web App: manifest, service worker, instalable en iOS y Android
- O Capacitor wrapper si se requiere distribución nativa (App Store / Play Store)
- Push notifications para eventos del portal (nuevo comentario, hito completado, entregable subido)

### Hardening y Observabilidad
- Rate limiting en todas las rutas `/api/portal/**` (no solo audit form)
- Logging estructurado de errores en API routes (Sentry o similar)
- Monitoreo de uptime y alertas
- Revisión final de políticas RLS — confirmar que ninguna tabla `pf_*` es accesible sin auth
- Variables de entorno auditadas: ningún secreto expuesto en `NEXT_PUBLIC_`

### Lanzamiento
- Checklist de deploy: migraciones aplicadas, bucket privado verificado, webhooks en producción
- Seed de datos de prueba para demos a clientes potenciales
- Documentación de onboarding para primer cliente: cómo registrarse, cómo acceder al portal, cómo interpretar el dashboard
- Primer cliente activado manualmente: org creada, request vinculado a orden pagada, especialista asignado

---

## Positioning Hierarchy

Always communicate in this order. Do not lead with Level 4.

| Level | What | Example |
|---|---|---|
| 1 | Outcome | More qualified opportunities |
| 2 | Product | Local Revenue Engine |
| 3 | System | Search → Visit → Lead → Follow-up → Customer |
| 4 | Capabilities | SEO, Google Ads, CRO, CRM, Analytics |

**Core commercial message:** "Turn Google into a consistent source of qualified leads."

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16 (App Router) |
| Language | TypeScript | Strict — no `any` |
| Styling | Tailwind CSS | 4 (CSS-first `@theme`) |
| Database | Supabase | PostgreSQL + Auth |
| Auth adapter | `@supabase/ssr` | NOT `auth-helpers-nextjs` |
| Validation | Zod | 3.x — all forms + API payloads |
| Package manager | pnpm | 9.x |
| Hosting | Vercel | — |

---

## Architecture Rules

### Server vs. Client Components
- **Default to Server Components** — only add `"use client"` when you need interactivity (event handlers, useState, useEffect, browser APIs)
- API routes handle public form submissions (audit form) — server actions for CRM mutations
- Data fetching happens in Server Components, not inside `useEffect`

### Next.js 16 Specifics
- The auth middleware file is `proxy.ts` (not `middleware.ts`) and exports `proxy` not `middleware`
- `"use client"` pages cannot export `metadata` — create a `layout.tsx` in the same route for noindex/metadata
- Supabase FK joins return arrays — always normalize: `Array.isArray(x) ? x[0] : x`

### File Structure
```
src/
  app/
    (marketing)/              # Public marketing pages group
      page.tsx                # Homepage /
      audit/page.tsx          # /audit — 2-column layout with value props
      cleaning/page.tsx       # /cleaning — outbound landing (noindex)
      thank-you/page.tsx      # /thank-you (noindex)
      privacy/page.tsx
      terms/page.tsx
    login/page.tsx            # /login (noindex)
    (app)/                    # Protected CRM group
      app/
        page.tsx              # /app dashboard
        pipeline/
        companies/
        contacts/
        opportunities/
        activities/
        tasks/
        audit-requests/
        import/
        settings/
    api/
      audit/route.ts          # Public audit form submission
      export/companies/       # CSV export (auth-protected)
      auth/callback/          # Supabase auth callback
    layout.tsx                # Root layout — GA4 via next/script, JSON-LD
    globals.css               # Tailwind @theme tokens + global helpers
    robots.ts
    sitemap.ts
  components/
    ui/                       # button, input, badge, logo
    crm/                      # app-sidebar, activity-timeline, company-actions, etc.
    marketing/
      navbar.tsx
      footer.tsx
      marketing-layout.tsx
      hero.tsx
      problem-section.tsx
      system-section.tsx
      service-section.tsx     # Local Revenue Engine — 5 pillars
      differentiators.tsx     # Stop paying for disconnected marketing
      services-slider.tsx     # CSS scroll-snap slider — 7 service cards
      industries-section.tsx  # Service business verticals
      process-section.tsx     # 4-step process
      audit-example-section.tsx # Fictional Sunrise Cleaning demo
      founder-section.tsx     # Arnaldo — photo or AC monogram fallback
      audit-cta.tsx
    forms/
      audit-form.tsx
  lib/
    analytics.ts              # All GA4 events
    validations.ts            # Zod schemas (auditFormSchema uses `email` not `work_email`)
    normalize.ts
    env.ts
    utils.ts
    supabase/
      client.ts
      server.ts
      middleware.ts
  types/
    database.ts
    app.ts
```

---

## Homepage Section Order

```
Hero → ProblemSection → SystemSection → ServiceSection →
Differentiators → ServicesSlider → IndustriesSection →
ProcessSection → AuditExampleSection → FounderSection → AuditCTA
```

---

## CTA Copy Rules — Non-Negotiable

| Location | Text |
|---|---|
| All marketing CTAs | **Get a Free Growth Audit** |
| Audit form submit button | **Get My Free Growth Audit** |
| Secondary hero CTA | **See the System** |

Never introduce new conversion paths. All CTAs go to `/audit`.

---

## Analytics Events (`src/lib/analytics.ts`)

All events fire via `window.gtag`. No PII ever.

| Event | When | Parameters |
|---|---|---|
| `primary_cta_click` | Any primary CTA clicked | `cta_location` |
| `audit_started` | Audit form interaction begins | — |
| `audit_submitted` | Successful audit form submission | — |
| `booking_click` | User proceeds toward booking | `source` |
| `service_cta_click` | Service-level CTA | `event_label`, `cta_location` |
| `founder_linkedin_click` | LinkedIn link in founder section | — |
| `cleaning_landing_cta` | CTA on /cleaning page | `cta_location`, `landing` |

**Key events to mark in GA4 UI:** `audit_submitted` (primary), `booking_click` (secondary).

**No PII rule:** never send name, email, phone, company name or form text to GA4.

---

## GA4 Implementation

GA4 is loaded via `next/script` with `strategy="afterInteractive"` (non-blocking).
Measurement ID is read from `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
If the env var is not set, no GA4 scripts load — no errors.

Do NOT add a second gtag snippet. Check `src/app/layout.tsx` before touching GA4.

---

## Outbound Landing Pages

Convention for vertical-specific landing pages:

- URL: `/[vertical]` (e.g., `/cleaning`)
- **noindex** during outbound phase via `layout.tsx` in the same route
- **NOT added to sitemap** while noindex
- Use `analytics.[vertical]CtaClick(location)` for attribution
- All CTAs lead to `/audit` — no new funnels
- UTM structure: `?utm_source=loom&utm_medium=outbound&utm_campaign=cleaning_florida_2026`

To create a new vertical page, follow `src/app/(marketing)/cleaning/` as the template.

---

## UTM Convention

| Channel | `utm_source` | `utm_medium` |
|---|---|---|
| Cold email | `cold_email` | `outbound` |
| Loom | `loom` | `outbound` |
| LinkedIn | `linkedin` | `outbound` |
| Referral | `referral` | `partner` |

Campaign format: `[vertical]_[market]_[year]` — e.g., `cleaning_florida_2026`.
Never put recipient names or emails inside UTM parameters.

---

## Security Rules

1. **RLS on every table** — no table is readable or writable without a policy.
2. **Never use `NEXT_PUBLIC_` prefix for secrets** — `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` are server-only.
3. **Always validate server-side** — Zod validation in API routes. Client validation is UX only.
4. **Honeypot + Turnstile on audit form** — both verified server-side before any DB write.
5. **Rate limiting on public routes** — audit form is rate-limited by IP (in-memory, per invocation).
6. **No PII in GA4** — events contain only non-sensitive marketing context.
7. **Public API routes must use `createAdminClient()`** — the regular `createClient()` uses the anon key and is blocked by RLS without a user session. Use `createAdminClient()` (service role) for trusted server-side writes like the audit form.

---

## Engineering Standards

### TypeScript
- `"strict": true` — do not weaken
- No `any` — use `unknown` and narrow
- Generate Supabase types: `pnpm supabase gen types typescript --local > src/types/database.ts`

### Supabase Clients
- `createClient()` — session-aware, uses anon key, subject to RLS. For Server Components and authenticated routes.
- `createAdminClient()` — service role, bypasses RLS. For trusted server-side API routes (e.g. `/api/audit`). Never use in client components or expose to the browser.

### organizations table — must have exactly one row
This is a single-tenant CRM. The `organizations` table must have a seeded row or all CRM inserts will fail silently — `companies`, `contacts`, `opportunities`, and `activities` all have `organization_id NOT NULL`.

The org ID is stored as `SUPABASE_ORG_ID` (server-only env var) and read via `getServerEnv().orgId`. **Never query the organizations table from a public API route** — RLS filters out rows when there is no `auth.uid()`, even with the service role client, because the `is_org_member()` function uses `SECURITY DEFINER` and checks `auth.uid()`.

Current org ID: `db071585-6652-4d2a-87fd-ec4670c44c93`

If starting fresh, seed with:
```sql
INSERT INTO organizations (name, slug) VALUES ('ClicKonversion', 'clickonversion');
```
Then add the resulting UUID as `SUPABASE_ORG_ID` in Vercel env vars.

### Database
- Schema changes via SQL migrations in `supabase/migrations/`
- Never use Supabase Dashboard for schema changes
- Every migration file includes rollback comment
- Every table has RLS enabled

### Favicon
- `src/app/icon.tsx` — generates a 32×32 PNG via `ImageResponse` (CK mark, obsidian bg + orange K). Next.js serves it at `/icon` and auto-injects the `<link rel="icon">` tag.
- Do NOT add a manual `<link rel="icon">` in `layout.tsx` — Next.js handles it via the file convention.
- Verify at `https://www.clickonversion.com/icon` after deploy.

### Icons
- Use `lucide-react` for icons throughout the app
- **lucide-react v1.33.0 does NOT have a `Linkedin` icon** — use inline SVG (see `footer.tsx` and `founder-section.tsx` for the correct SVG paths)
- Do not mix icon libraries on the same page

### Components
- Semantic HTML: `<button>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- ARIA labels on icon-only buttons
- Form inputs always have associated `<label>` elements
- Mobile-first responsive design

### Styling
- Tailwind 4 CSS-first: tokens defined in `src/app/globals.css` under `@theme`
- Prefer token references over hardcoded hex in Tailwind classes
- Use `style={{}}` only for dynamic values (colors from data arrays, gradients)
- Section classes: `.section-dark` (#0B0D0F), `.section-surface` (#14171A)
- Container classes: `.container-wide` (88rem), `.container-tight` (64rem)
- `.no-scrollbar` — hides scrollbar for slider containers

### Sliders / Carousels
- Use native CSS `scroll-snap-type: x mandatory` — no library dependencies
- Cards: `snap-start flex-shrink-0` with fixed width
- Navigation: `scrollBy()` on a `useRef` container
- Hide scrollbar with `.no-scrollbar` class (defined in `globals.css`)

---

## Brand Quick Reference

| Token | Value | Usage |
|---|---|---|
| `--color-brand` | `#FF5A1F` | CTAs, highlights, active states |
| `--color-obsidian` | `#0B0D0F` | App shell, dark backgrounds |
| `--color-surface-dark` | `#14171A` | Cards, sidebars, modals |
| `--color-warm-white` | `#F7F7F3` | Body text on dark |
| `--color-muted` | `#8A9099` | Secondary text |
| `--color-gray-500` | `#546072` | Tertiary text |
| `--color-gray-600` | `#3D4A5C` | Very muted text, captions |
| `--color-success` | `#22C55E` | WON, positive states |
| `--color-warning` | `#F59E0B` | NURTURE, deadlines |
| `--color-danger` | `#EF4444` | LOST, errors |

Typography: Inter (primary), system-mono (code/data). Max 2 font families.

Logo: `src/components/ui/logo.tsx` — variants `light` (dark bg) / `dark` (light bg). Sizes: sm/md/lg. Wordmark: "Clic**Konversion**" (full "Konversion" in orange).

Founder photo: `public/founder.jpg` — if missing, component falls back to "AC" monogram automatically.

---

## Copy Rules

- **Outcome → explanation → mechanism** (never mechanism first)
- Avoid: leverage, innovative, comprehensive, cutting-edge, transformative, supercharge, unlock, seamless
- Every description must answer: "What does this help me accomplish?"
- Language test: would a cleaning company owner immediately understand why this matters?

---

## Pages & Indexing

| Route | Indexed | Notes |
|---|---|---|
| `/` | ✅ | Homepage |
| `/audit` | ✅ | 2-column layout with value props |
| `/privacy` | ✅ | |
| `/terms` | ✅ | |
| `/cleaning` | ❌ noindex | Outbound landing — revisit after validation |
| `/thank-you` | ❌ noindex | Conversion confirmation |
| `/login` | ❌ noindex | Auth page |
| `/app/**` | ❌ disallow | Protected CRM |
| `/api/**` | ❌ disallow | API routes |

---

## SEO Baseline — Measurement First

Search Console and GA4 are installed. Data accumulates from day one.

**SEO Phase 1 starts after the first paying client is acquired.** Until then:
- No blog posts
- No city pages
- No programmatic content
- No industry page expansion beyond `/cleaning` (outbound use only)

Future content will be close to money: high-intent queries from service business owners (not "what is SEO?").

---

## What NOT to Build (yet)

Items marcados ✅ ya están construidos. Los demás siguen fuera de scope hasta la fase indicada.

| Category | Status | Fase |
|---|---|---|
| Billing / payments (Stripe + PayPal) | ✅ Fase 3 | — |
| Client portal (auth, requests, docs, billing) | ✅ Fase 5 | — |
| Booking rights + Cal.com | ✅ Fase 4 | — |
| AI features (lead scoring, drafts, enrichment) | ❌ fuera de scope | — |
| Email automation (sequences, drip) | ❌ fuera de scope | — |
| Social scheduler (Instagram, LinkedIn, GMB) | ❌ fuera de scope | — |
| Custom CMS (Sanity blog, content editor) | ❌ pendiente | post-Fase 7 |
| SEO content expansion (blog, city pages) | ❌ pendiente | post-Fase 7 |
| Native mobile app (App Store / Play Store) | ❌ pendiente | Fase 7 (Capacitor / PWA) |

---

## Email Infrastructure

| Address | Purpose | Provider |
|---------|---------|----------|
| `arnaldo@clickonversion.com` | Main inbox — sales, clients, conversations | Zoho Mail Free |
| `hello@clickonversion.com` | Public contact — alias redirects to arnaldo | Zoho Mail Free |
| `notifications@clickonversion.com` | Automated sends only — audit form notifications | Resend (sends only, no inbox) |

**Flow:** audit form submit → Supabase → Resend sends from `notifications@` → delivered to `arnaldo@`

**Env vars:**
- `EMAIL_FROM` — `ClicKonversion <notifications@clickonversion.com>`
- `NOTIFICATION_EMAIL` — `arnaldo@clickonversion.com`
- `RESEND_API_KEY` — server-only, never `NEXT_PUBLIC_`

**DNS (Cloudflare):** MX → Zoho, SPF split by subdomain (@ for Zoho, send. for Resend/SES — do not combine). DKIM selector: `zoho._domainkey`. SSL: Universal via Google Trust Services, auto-renews every 3 months — no action needed.

---

## Key Docs

| Document | Contents |
|---|---|
| `docs/PHASE-0.md` | Full Phase 0 scope, stack, routes, DB schema, pipeline |
| `docs/CRM.md` | Pipeline stages, workflows, metrics, data relationships |
| `docs/BRAND.md` | Colors, typography, voice, copy examples |
| `docs/DEPLOYMENT.md` | Supabase setup, env vars, Vercel, DNS, GA4, Turnstile |

---

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server at localhost:3000

# Database
pnpm supabase start         # Start local Supabase
pnpm supabase db push       # Apply migrations
pnpm supabase db diff       # Preview pending diffs
pnpm supabase gen types typescript --local > src/types/database.ts

# Build & Lint
pnpm build                  # Production build — must pass with 0 errors
pnpm lint                   # ESLint check

# Deploy
pnpm vercel --prod          # Deploy to production
```
