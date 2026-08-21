@AGENTS.md

# ClicKonversion — Claude Code Instructions

## Mission
Build a growth operating system to help ClicKonversion acquire its first 3 clients and reach $2,000 MRR.

## Current Phase
Phase 0: Build the sales machine — marketing site + CRM. Full scope in `docs/PHASE-0.md`.

## Scope Rule
Do NOT add features unless they directly serve: **acquisition**, **sales management**, or **measurement**. If a feature doesn't map to one of those three functions, it is out of scope for Phase 0. When unsure, ask before building.

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
- Server Actions handle all form mutations — no separate API routes unless there is a clear reason
- Data fetching happens in Server Components, not inside `useEffect`

### File Structure
```
src/
  app/
    (marketing)/          # Public marketing pages group
      page.tsx            # Homepage /
      audit/page.tsx      # /audit
      thank-you/page.tsx  # /thank-you
      privacy/page.tsx    # /privacy
      terms/page.tsx      # /terms
    (app)/                # Protected CRM group
      login/page.tsx
      app/
        page.tsx          # /app dashboard
        pipeline/
        companies/
        contacts/
        opportunities/
        activities/
        tasks/
        audit-requests/
        research/
        settings/
    api/                  # API routes (use sparingly)
    layout.tsx
    globals.css
  components/
    ui/                   # Base UI components (Button, Input, Badge, etc.)
    crm/                  # CRM-specific components
    marketing/            # Marketing site components
  lib/
    supabase/
      client.ts           # Browser client
      server.ts           # Server client (cookies)
      middleware.ts        # Middleware client
    validations/          # Zod schemas
    utils.ts
  types/
    database.ts           # Generated Supabase types
    app.ts                # Application types
  middleware.ts           # Auth protection
```

---

## Security Rules

1. **RLS on every table** — no table is readable or writable without a policy. Never trust "it's behind auth" as a substitute for RLS.
2. **Never use `NEXT_PUBLIC_` prefix for secrets** — `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` must never be exposed to the client bundle.
3. **Always validate server-side** — Zod validation runs in Server Actions and API routes. Client-side validation is UX-only; it is never a security measure.
4. **Honeypot + Turnstile on all public forms** — the `/audit` form includes a hidden honeypot field and Cloudflare Turnstile token. Both are verified server-side before any data is written.
5. **Rate limiting on public Server Actions** — audit form submissions should be rate-limited by IP (using Vercel's `@vercel/kv` or a simple in-memory counter in dev).
6. **No PII in GA4 events** — `audit_form_submit` sends `industry` and `state` only. No names, emails, or company names in analytics events.

---

## Engineering Standards

### TypeScript
- `"strict": true` in `tsconfig.json` — already set, do not weaken
- No `any` type — use `unknown` when the type is genuinely unknown and narrow it
- Type assertions (`as SomeType`) require a comment explaining why it is safe
- Generate Supabase types with: `pnpm supabase gen types typescript --local > src/types/database.ts`

### Database
- All schema changes go through SQL migration files in `supabase/migrations/`
- Never make schema changes through the Supabase Dashboard — the dashboard is read-only for schema
- Every migration file starts with a rollback comment:
  ```sql
  -- Rollback: DROP TABLE IF EXISTS table_name;
  ```
- Every table has RLS enabled before it is used in production

### Components
- Semantic HTML — use `<button>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>` correctly
- ARIA labels on icon-only buttons
- Form inputs always have associated `<label>` elements
- Mobile-first responsive design — build for mobile, enhance for desktop

### Styling
- Tailwind 4 CSS-first: all tokens are defined in `src/app/globals.css` under `@theme`
- **Never hardcode hex colors in components** — always use design tokens: `bg-[var(--color-orange)]` or the Tailwind utility class after token definition
- Never mix multiple icon libraries on the same page — use one consistent set (Lucide React recommended)
- No inline `style` attributes for brand values

---

## Brand Quick Reference

| Token | Value | Usage |
|---|---|---|
| `--color-orange` | `#FF5A1F` | CTAs, highlights, active states |
| `--color-obsidian` | `#0B0D0F` | App shell, dark backgrounds |
| `--color-surface` | `#14171A` | Cards, sidebars, modals |
| `--color-warm-white` | `#F7F7F3` | Body text on dark, light page bg |
| `--color-border` | `#1F2428` | Subtle dividers on dark surfaces |
| `--color-success` | `#22C55E` | WON status, positive metrics |
| `--color-warning` | `#F59E0B` | NURTURE, approaching deadlines |
| `--color-danger` | `#EF4444` | LOST status, errors |

Typography: Inter (primary), system-mono (code/data). Max 2 font families.

Full brand system: `docs/BRAND.md`

---

## Product Philosophy

- **Simple > Clever** — if two approaches work, ship the simpler one
- **Reliable > Flashy** — a dashboard that always loads beats one with pretty animations that fail
- **Revenue utility > Feature count** — one feature that closes a deal beats five features that don't
- **No lead without a next move** — every open opportunity must have a task. The CRM enforces this visually.

---

## What NOT to Build in Phase 0

Attempting to build any of these in Phase 0 is scope creep. Push back if asked.

| Category | Examples |
|---|---|
| Billing / payments | Stripe integration, subscription management |
| AI features | GPT-powered drafts, lead scoring, enrichment |
| Email automation | Sequences, drip campaigns, auto-follow-up |
| Social scheduler | Instagram, LinkedIn, Google My Business posting |
| Client portal | Client-facing dashboard, report sharing |
| LMS / education | Playbooks, courses, video content delivery |
| Complex permissions | Multi-role RBAC, team management |
| Custom CMS | Blog editor, content management system |
| Native mobile app | iOS/Android builds, Capacitor, React Native |

---

## Key Docs

| Document | Contents |
|---|---|
| `docs/PHASE-0.md` | Full Phase 0 scope, stack, routes, DB schema, pipeline |
| `docs/CRM.md` | Pipeline stages, workflows, metrics, data relationships |
| `docs/BRAND.md` | Colors, typography, voice, copy examples, what NOT to do |
| `docs/DEPLOYMENT.md` | Supabase setup, env vars, Vercel, DNS, GA4, Turnstile |

---

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server at localhost:3000

# Database
pnpm supabase start         # Start local Supabase
pnpm supabase db push       # Apply migrations to local or linked project
pnpm supabase db diff       # Preview pending migration diffs
pnpm supabase gen types typescript --local > src/types/database.ts

# Build
pnpm build                  # Production build
pnpm lint                   # ESLint check

# Deploy
pnpm vercel --prod          # Deploy to production
```
