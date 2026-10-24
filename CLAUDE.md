@AGENTS.md

# ClicKonversion — Claude Code Instructions

## Mission
Build a growth operating system to help ClicKonversion acquire its first 3 clients and reach $2,000 MRR.

## Current Phase
**Phase 8 — Rediseño Marketing v3 + Checkout + Mejoras Admin** ✅ Completada

Design system v3 aplicado a todas las páginas de marketing. Checkout con PayPal Orders, transferencia y USDT. Admin: lista de facturas, fix perfil empresa en invoices PayPal. Build limpio, 101 páginas estáticas.

---

## Build Roadmap

| Fase | Nombre | Estado | Descripción |
|------|--------|--------|-------------|
| 0 | Marketing + CRM | ✅ Completa | Site live, CRM lead capture, audit form, pipeline |
| 2 | Homepage | ✅ Completa | 10 secciones, design system, logos, servicios |
| 3 | Catálogo + Pagos | ✅ Completa | Stripe + PayPal, carrito, checkout, webhooks idempotentes |
| 4 | Reservas y Onboarding | ✅ Completa | Cal.com, booking rights, formularios pre-brief, email bilingüe |
| 5 | Portal de Clientes | ✅ Completa | Auth, dashboard, requests, documentos, billing, settings, RLS |
| 6 | Panel Administrativo | ✅ Completa | Dashboard métricas, cola de trabajo, especialistas, comercial, pagos, analítica |
| 7 | Apps, QA y Lanzamiento | ✅ Completa | /apps catálogo, SyncLead landing+waitlist, Playwright E2E, SEO, docs ops |
| 8 | Rediseño Marketing v3 + Checkout + Admin | ✅ Completa | Design system v3, 6 páginas rediseñadas, checkout PayPal Orders, lista facturas admin |

---

## Fase 8 — Rediseño Marketing v3 + Checkout + Mejoras Admin ✅

### Design System v3 (Marketing)

**Paleta marketing (tokens en `@theme` de `globals.css`):**
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-cream` | `#F7F5EF` | Background marketing |
| `--color-ink` | `#202124` | Texto principal |
| `--color-muted-ink` | `#5F6368` | Texto secundario |
| `--color-cobalt` | `#345CFF` | Acento primario, hovers, footer bg |
| `--color-lime` | `#D9FA62` | Accent de alto contraste, pill ON, carrito |
| `--color-lavender` | `#E9E4FF` | Hover nav, pills activos |
| `--color-spark` | `#FF6B2C` | Chispas del logo, highlights cálidos |
| `--color-line` | `#E2DED3` | Bordes suaves en fondo cream |

**Tipografía marketing:**
- General Sans — via `@import url("https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap")` en `globals.css` ANTES de `@import "tailwindcss"`. Var: `--font-mk-sans`
- Instrument Serif — via `next/font/google` en `layout.tsx`. Var: `--font-mk-serif` (alias `--font-instrument-serif`)
- JetBrains Mono — via `next/font/google` en `layout.tsx`. Var: `--font-mk-mono` (alias `--font-jetbrains-mono`)

**IMPORTANTE:** Fontshare no es compatible con `next/font`. Se carga siempre vía CSS `@import` en `globals.css`.

### Logos

**`src/components/ui/logo-wordmark.tsx`** — Wordmark CSS puro "clickONversion":
- Píldora lime `#D9FA62` con texto "ON" + 3 barras spark `#FF6B2C` rotadas -35°/0°/35° encima
- Prop `size`: `sm`(22px) | `md`(28px) | `lg`(36px) | `xl`(48px)
- NO usa imagen — solo JSX + inline styles

**`src/components/ui/logo-key.tsx`** — Isotipo interactivo "c!" (tecla):
- Estado rest: fondo blanco, sombra `0 14px 0 #202124`
- Estado pressed: fondo lime, sombra `0 3px 0`, translateY 11px
- Chispas aparecen al presionar (opacity fade-in)

### Componentes marketing nuevos/actualizados

**`src/components/marketing/navbar.tsx`** — Reescrito:
- Sticky, cream bg, border-bottom `#E2DED3`
- LogoWordmark + desktop nav (lavender hover pill) + cart pill (lime, JetBrains Mono)
- Cart pill solo visible cuando `useCart().count > 0`
- CTA "Hablemos →" (ink bg → cobalt hover)
- Hamburger mobile con animación max-height

**`src/components/marketing/footer.tsx`** — Reescrito:
- Cobalt bg (#345CFF), margin 16px, border-radius 40px (floating footer)
- Giant Instrument Serif italic "clic." en lime
- 4 columnas: NAVEGA / SERVICIOS / APPS Y CUENTA / SALUDA
- Wordmark grande al fondo, legal en JetBrains Mono

**`src/components/marketing/cart-bar.tsx`** — Barra sticky inferior:
- `position: fixed` bottom, ink bg
- Muestra cantidad y total del carrito
- Botón "Ir al pago →" en lime → `/checkout`

**`src/components/marketing/services-tabs.tsx`** — 4 tabs de área:
- SEO / Ads / CRO & Web / Data & Analítica
- Panel de color por área, cards de servicio con botón Agregar al carrito
- Integra `useCart()`, hash nav (#seo, #ads, etc.)

**`src/components/marketing/pricing-grid.tsx`** — Grid de precios filtrable:
- 5 pills de categoría + segmentado tipo (Proyecto/Mensual)
- 13+ servicios con precio, descripción, botón agregar
- Integra `useCart()`

**`src/components/marketing/contact-form.tsx`** — Formulario de contacto:
- Multi-select chips de interés
- Llama `sendContactAction` Server Action → Resend

**`src/components/marketing/contact-actions.ts`** — `"use server"`:
- `sendContactAction` — envía email vía Resend a `arnaldo@clickonversion.com`

**`src/components/marketing/apps-waitlist-form.tsx`** — Waitlist apps:
- POST a `/api/apps/synclead/waitlist`

**`src/components/marketing/resources-newsletter-form.tsx`** — Newsletter recursos

### Páginas marketing rediseñadas

| Ruta | Estado |
|------|--------|
| `/services` | ✅ Rediseñada con ServicesTabs + CartBar |
| `/pricing` | ✅ Rediseñada con PricingGrid filtrable + CartBar |
| `/projects` | ✅ Nueva (antes no existía) |
| `/apps` | ✅ Rediseñada con catálogo apps + WaitlistForm |
| `/about` | ✅ Rediseñada con historia, equipo, ContactForm |
| `/resources` | ✅ Nueva con newsletter + recursos descargables |

### Checkout con PayPal Orders

**`src/app/(marketing)/checkout/page.tsx`** — `"use client"`:
- 3 métodos de pago: PayPal Orders, Transferencia bancaria, USDT
- Estado: idle → pending → success/error
- Resumen de carrito con items, subtotal, total

**`src/app/(marketing)/checkout/actions.ts`** — `"use server"`:
- `createPayPalOrderAction(items)` — POST /v2/checkout/orders → retorna `approveUrl` para redirect
- `capturePayPalOrderAction(orderId)` — POST /v2/checkout/orders/{id}/capture
- `sendTransferConfirmationAction(data)` — Resend email para confirmación de transferencia

**`src/app/(marketing)/checkout/success/page.tsx`** — Server Component:
- Captura automáticamente el pago de PayPal (token del querystring)
- Muestra confirmación con detalles del pago

**`src/app/(marketing)/checkout/success/cart-cleaner.tsx`** — `"use client"`:
- Limpia el carrito en localStorage vía `useEffect` al llegar a la página de éxito

**`src/app/(marketing)/checkout/cancel/page.tsx`** — Página de cancelación PayPal

### Admin: Mejoras facturas PayPal

**`src/app/(admin)/admin/commercial/invoices/actions.ts`** — Fixes críticos:
- `invoicer.business_name` (antes usaba `name.full_name` que es para cuentas personales — no mostraba perfil empresa)
- `send_to_invoicer: true` añadido — admin también recibe copia por email
- Nueva env var: `PAYPAL_BUSINESS_NAME` (fallback `"ClicKonversion"`)
- Nueva acción: `listPayPalInvoicesAction(page, pageSize)` → GET /v2/invoicing/invoices

**`src/app/(admin)/admin/commercial/invoices/invoices-list.tsx`** — Server Component:
- Tabla de todas las facturas creadas: N°, Cliente, Fecha, Vence, Monto, Estado
- Status pills con colores: SENT (azul), PAID (verde), CANCELLED (gris), etc.
- Link a PayPal dashboard por factura
- Se muestra arriba del formulario de creación vía `<Suspense>`

**`src/app/(admin)/admin/commercial/invoices/page.tsx`** — Actualizado:
- Layout: lista de facturas (con Suspense) + formulario nueva factura

### Variables de entorno PayPal

| Variable | Propósito |
|----------|-----------|
| `PAYPAL_CLIENT_ID` | Client ID de la app PayPal |
| `PAYPAL_CLIENT_SECRET` | Secret de la app PayPal |
| `PAYPAL_INVOICER_EMAIL` | Email del invoicer (default: `arnaldo@clickonversion.com`) |
| `PAYPAL_BUSINESS_NAME` | Nombre empresa en facturas (default: `ClicKonversion`) |

**NOTA SANDBOX:** En modo desarrollo (`NODE_ENV !== "production"`), PayPal usa `api-m.sandbox.paypal.com`. Los emails de sandbox NO se entregan en buzones reales — esto es comportamiento esperado. En producción el envío al cliente funciona correctamente.

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
- `/admin/commercial/invoices` — Lista facturas PayPal + crear nueva factura
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

## Fase 7 — Apps, QA Integral y Lanzamiento ✅

Build limpio. 179 tests unitarios pasan. Playwright instalado, 5 suites E2E. Docs completos.

**Archivos clave Fase 7:**
- `src/data/apps.ts` — catálogo extensible de apps (App interface + APPS array)
- `src/app/(marketing)/apps/page.tsx` — /apps catálogo (rediseñado en Fase 8)
- `src/app/(marketing)/apps/[slug]/page.tsx` — router dinámico por app
- `src/components/apps/synclead-page.tsx` — landing SyncLead completa
- `src/app/api/apps/synclead/waitlist/route.ts` — API waitlist (POST, rate-limited)
- `src/lib/rate-limit.ts` — utilitario rate limiting para portal routes
- `supabase/migrations/022_app_waitlist.sql` — tabla pf_app_waitlist
- `playwright.config.ts` — configuración E2E
- `src/e2e/` — 5 suites: marketing, checkout, portal-auth, security, full-flow
- `docs/OPERATIONS.md` — guía operativa completa (13 secciones)
- `docs/LAUNCH-CHECKLIST.md` — checklist de lanzamiento (12 stages)

**SyncLead features afirmadas:**
- Real-time lead sync from Meta Ads ✅
- Visual pipeline (kanban) ✅
- WhatsApp Business integrated ✅
- AI agents (multi-LLM: Claude/GPT/Gemini/DeepSeek/Groq) ✅
- Automatic lead qualification ✅
- Meta CAPI (Purchase events) ✅
- Team collaboration with roles ✅
- CSV import with deduplication ✅
- NO Stripe/pagos (no mencionar) ❌

**SyncLead CTA:** Waitlist (no pagos listos). Incluido gratis con servicios de Meta Ads.

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
      services/page.tsx       # /services — ServicesTabs + CartBar
      pricing/page.tsx        # /pricing — PricingGrid filtrable + CartBar
      projects/page.tsx       # /projects — portfolio de proyectos
      apps/page.tsx           # /apps — catálogo de apps
      apps/[slug]/page.tsx    # /apps/[slug] — landing individual
      about/page.tsx          # /about — historia, equipo, ContactForm
      resources/page.tsx      # /resources — recursos + newsletter
      checkout/page.tsx       # /checkout — carrito + 3 métodos pago
      checkout/success/       # /checkout/success — confirmación PayPal
      checkout/cancel/        # /checkout/cancel
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
        ...
    api/
      audit/route.ts
      apps/synclead/waitlist/route.ts
      auth/callback/
    layout.tsx                # Root layout — GA4, fonts, JSON-LD
    globals.css               # Tailwind @theme tokens (marketing + admin) + Fontshare @import
    robots.ts
    sitemap.ts
  components/
    ui/
      logo-wordmark.tsx       # CSS wordmark "clickONversion" con pill lime y chispas
      logo-key.tsx            # Isotipo interactivo "c!" con press animation
      logo.tsx                # Logo legacy (admin/portal)
    crm/                      # app-sidebar, activity-timeline, etc.
    marketing/
      navbar.tsx              # Sticky, cream bg, cart pill, mobile hamburger
      footer.tsx              # Cobalt floating footer con wordmark
      marketing-layout.tsx
      cart-bar.tsx            # Sticky bottom bar → /checkout
      services-tabs.tsx       # 4 tabs por área, cards con useCart
      pricing-grid.tsx        # Grid filtrable por categoría y tipo
      contact-form.tsx        # Multi-select chips + Server Action
      contact-actions.ts      # sendContactAction (Resend)
      apps-waitlist-form.tsx  # POST /api/apps/synclead/waitlist
      resources-newsletter-form.tsx
    admin/                    # StatusBadge, MetricCard, QueueTable, etc.
    forms/
      audit-form.tsx
  lib/
    analytics.ts
    validations.ts
    supabase/
      client.ts
      server.ts
      middleware.ts
  types/
    database.ts
    catalog.ts                # CartItem interface, tipos catálogo
```

---

## Brand — Marketing Design System v3

### Tokens marketing (`globals.css` `@theme`)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-cream` | `#F7F5EF` | Background marketing |
| `--color-ink` | `#202124` | Texto principal |
| `--color-muted-ink` | `#5F6368` | Texto secundario |
| `--color-body-2` | `#8C8C8C` | Cuerpo terciario |
| `--color-cobalt` | `#345CFF` | Acento primario, footer |
| `--color-lime` | `#D9FA62` | Pill ON, cart, CTAs |
| `--color-lavender` | `#E9E4FF` | Hover nav, pills |
| `--color-spark` | `#FF6B2C` | Chispas logo, warm highlights |
| `--color-line` | `#E2DED3` | Bordes sobre cream |
| `--font-mk-sans` | General Sans | Cuerpo marketing |
| `--font-mk-mono` | JetBrains Mono | Datos, precios, carrito |
| `--font-mk-serif` | Instrument Serif | Títulos editoriales |

### Tokens admin/portal (legacy, preservados)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-brand` | `#FF5A1F` | CTAs admin, highlights |
| `--color-obsidian` | `#0B0D0F` | App shell, dark backgrounds |
| `--color-surface-dark` | `#14171A` | Cards, sidebars, modals |
| `--color-warm-white` | `#F7F7F3` | Body text on dark |
| `--color-muted` | `#8A9099` | Secondary text |
| `--color-success` | `#22C55E` | WON, positive states |
| `--color-warning` | `#F59E0B` | NURTURE, deadlines |
| `--color-danger` | `#EF4444` | LOST, errors |

---

## Homepage Section Order

```
Hero → MarqueeStrip → Cards (3 colores) → ExpertiseList →
HowWeWork → FeaturedServices → Projects → AiFlow →
SyncLeadPreview → CTA Lime
```

---

## Pages & Indexing

| Route | Indexed | Notes |
|---|---|---|
| `/` | ✅ | Homepage |
| `/services` | ✅ | Catálogo de servicios con carrito |
| `/pricing` | ✅ | Grid de precios filtrable |
| `/projects` | ✅ | Portfolio |
| `/apps` | ✅ | Catálogo apps |
| `/apps/synclead` | ✅ | Landing SyncLead |
| `/about` | ✅ | Historia y contacto |
| `/resources` | ✅ | Recursos descargables |
| `/checkout` | ❌ noindex | Checkout |
| `/audit` | ✅ | 2-column layout with value props |
| `/privacy` | ✅ | |
| `/terms` | ✅ | |
| `/cleaning` | ❌ noindex | Outbound landing |
| `/thank-you` | ❌ noindex | Conversion confirmation |
| `/login` | ❌ noindex | Auth page |
| `/app/**` | ❌ disallow | Protected CRM |
| `/portal/**` | ❌ disallow | Portal clientes |
| `/admin/**` | ❌ disallow | Panel admin |
| `/api/**` | ❌ disallow | API routes |

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

## Security Rules

1. **RLS on every table** — no table is readable or writable without a policy.
2. **Never use `NEXT_PUBLIC_` prefix for secrets** — `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY` son server-only.
3. **Always validate server-side** — Zod validation in API routes. Client validation is UX only.
4. **Honeypot + Turnstile on audit form** — both verified server-side before any DB write.
5. **Rate limiting on public routes** — audit form y waitlist API rate-limited por IP.
6. **No PII in GA4** — events contain only non-sensitive marketing context.
7. **Public API routes must use `createAdminClient()`** — service role para writes de confianza.
8. **`internal_notes` e `is_internal` NUNCA se exponen al portal cliente** — filtrar a nivel de query.
9. **Org isolation** — toda query a tablas `pf_*` debe incluir filtro explícito `orgId` (no RLS).
10. **Signed URLs server-side** — nunca exponer raw blob URLs a clientes sin auth check.

---

## Engineering Standards

### TypeScript
- `"strict": true` — do not weaken
- No `any` — use `unknown` and narrow

### Supabase Clients
- `createClient()` — session-aware, uses anon key, subject to RLS.
- `createAdminClient()` — service role, bypasses RLS. For trusted server-side API routes.

### organizations table — must have exactly one row
Org ID: `db071585-6652-4d2a-87fd-ec4670c44c93` → env var `SUPABASE_ORG_ID`

### Database
- Schema changes via SQL migrations in `supabase/migrations/`
- Never use Supabase Dashboard for schema changes

### Favicon
- `src/app/icon.tsx` — 32×32 PNG via `ImageResponse`. Next.js auto-inyecta el `<link>`.

### Icons
- Use `lucide-react` for icons
- **lucide-react NO tiene icono `Linkedin`** — usar inline SVG

### Cart
- Provider: `useCart()` de `src/components/shop/cart-provider`
- Key localStorage: `ck_cart_v1`
- Tipo `CartItem` en `src/types/catalog.ts`
- `count` y `items` disponibles en cualquier Client Component que importe `useCart()`

### Styling
- Tailwind 4 CSS-first: tokens en `globals.css` bajo `@theme`
- Marketing usa tokens `--color-*` / `--font-mk-*`
- Admin usa tokens legacy `--color-brand`, `--color-obsidian`, etc.
- Clases helper: `.section-dark`, `.section-surface`, `.container-wide`, `.container-tight`, `.no-scrollbar`
- CSS `.mk-container` — contenedor marketing con max-width y padding responsive

---

## Outbound Landing Pages

- URL: `/[vertical]` (e.g., `/cleaning`)
- **noindex** via `layout.tsx` en la misma ruta
- **NOT added to sitemap** while noindex
- All CTAs lead to `/audit`

---

## Email Infrastructure

| Address | Purpose | Provider |
|---------|---------|----------|
| `arnaldo@clickonversion.com` | Main inbox | Zoho Mail Free |
| `hello@clickonversion.com` | Public contact | Zoho Mail Free |
| `notifications@clickonversion.com` | Automated sends | Resend (send only) |

**Env vars email:**
- `EMAIL_FROM` — `ClicKonversion <notifications@clickonversion.com>`
- `NOTIFICATION_EMAIL` — `arnaldo@clickonversion.com`
- `RESEND_API_KEY` — server-only

---

## Env Vars de referencia

| Variable | Propósito | Público |
|----------|-----------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin | ❌ |
| `SUPABASE_ORG_ID` | UUID org interna | ❌ |
| `RESEND_API_KEY` | Email transaccional | ❌ |
| `EMAIL_FROM` | From header emails | ❌ |
| `NOTIFICATION_EMAIL` | Destino notificaciones | ❌ |
| `PAYPAL_CLIENT_ID` | App PayPal | ❌ |
| `PAYPAL_CLIENT_SECRET` | App PayPal | ❌ |
| `PAYPAL_INVOICER_EMAIL` | Email invoicer facturas | ❌ |
| `PAYPAL_BUSINESS_NAME` | Nombre empresa en facturas | ❌ |
| `STRIPE_SECRET_KEY` | Stripe pagos | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook | ❌ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe frontend | ✅ |
| `TURNSTILE_SECRET_KEY` | Cloudflare captcha | ❌ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare captcha | ✅ |
| `CAL_API_KEY` | Cal.com bookings | ❌ |

---

## Key Docs

| Document | Contents |
|---|---|
| `docs/PHASE-0.md` | Full Phase 0 scope, stack, routes, DB schema, pipeline |
| `docs/CRM.md` | Pipeline stages, workflows, metrics, data relationships |
| `docs/BRAND.md` | Colors, typography, voice, copy examples |
| `docs/DEPLOYMENT.md` | Supabase setup, env vars, Vercel, DNS, GA4, Turnstile |
| `docs/OPERATIONS.md` | Guía operativa completa (13 secciones) |
| `docs/LAUNCH-CHECKLIST.md` | Checklist de lanzamiento (12 stages) |

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
