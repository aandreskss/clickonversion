@AGENTS.md

# ClicKonversion — Claude Code Instructions

## Mission
Build a growth operating system to help ClicKonversion acquire its first 3 clients and reach $2,000 MRR.

## Current Phase
**Phase 0 — Marketing site + CRM: complete. Now in active outreach.**

The marketing site is live and production-ready. The CRM is operational. Current priorities:
1. Support outbound sales to cleaning companies and other service verticals
2. Acquire first 1–3 paying clients
3. Maintain and refine the site based on what resonates during outreach

SEO content expansion (blog, city pages, industry clusters) starts **after the first paying client is acquired**.

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

### Database
- Schema changes via SQL migrations in `supabase/migrations/`
- Never use Supabase Dashboard for schema changes
- Every migration file includes rollback comment
- Every table has RLS enabled

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

## What NOT to Build in Phase 0

| Category | Examples |
|---|---|
| Billing / payments | Stripe, subscription management |
| AI features | GPT drafts, lead scoring, enrichment |
| Email automation | Sequences, drip campaigns |
| Social scheduler | Instagram, LinkedIn, GMB posting |
| Client portal | Client-facing dashboard, report sharing |
| Complex permissions | Multi-role RBAC, team management |
| Custom CMS | Blog editor, content management |
| Native mobile app | iOS/Android, Capacitor, React Native |
| SEO content expansion | Blog, city pages, programmatic SEO |

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
