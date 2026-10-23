# Launch Checklist — ClicKonversion

Last updated: 2026-10-23

**Do not deploy to production without completing this checklist.**

---

## Stage 1 — Pre-launch: Code & Build

- [ ] `pnpm build` passes with 0 errors and 0 TypeScript warnings
- [ ] `pnpm test` passes: 179/179 tests ✓
- [ ] `pnpm lint` passes with 0 errors
- [ ] No `console.log`, `console.warn`, `TODO`, or `FIXME` in production code paths
- [ ] All `any` TypeScript types removed or documented with justification
- [ ] No hardcoded secrets or API keys in source code
- [ ] No `NEXT_PUBLIC_` prefix on: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CALCOM_WEBHOOK_SECRET`

---

## Stage 2 — Database

- [ ] All 21 migrations applied to **production** Supabase project
- [ ] `pf_app_waitlist` migration (022) applied (needed for SyncLead waitlist)
- [ ] RLS enabled on ALL tables — verify with:
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables
  WHERE schemaname = 'public' AND rowsecurity = false;
  -- Should return 0 rows
  ```
- [ ] Organizations table has one row with correct `id` matching `SUPABASE_ORG_ID`
- [ ] Catalog seed applied — at least one published service in `pf_service_catalog`
- [ ] `portal-docs` storage bucket is **private** (not public)
- [ ] Storage bucket CORS configured for `https://www.clickonversion.com` only
- [ ] Database connection pooling mode set to `transaction` (for serverless)

---

## Stage 3 — Environment Variables (Vercel)

Production environment — verify all are set:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_ORG_ID`
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://www.clickonversion.com`
- [ ] `STRIPE_SECRET_KEY` (live key: `sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key: `pk_live_...`)
- [ ] `PAYPAL_CLIENT_ID`
- [ ] `PAYPAL_CLIENT_SECRET`
- [ ] `PAYPAL_WEBHOOK_ID`
- [ ] `PAYPAL_MODE` = `live`
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `NOTIFICATION_EMAIL`
- [ ] `CAL_API_KEY`
- [ ] `CALCOM_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_CAL_USERNAME`
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- [ ] `TURNSTILE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`

**Confirm no test keys in production:**
- [ ] `STRIPE_SECRET_KEY` does NOT start with `sk_test_`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` does NOT start with `pk_test_`
- [ ] `PAYPAL_MODE` is `live`, not `sandbox`

---

## Stage 4 — Payments (Sandbox Validation)

Complete these tests in the Vercel preview environment with test/sandbox credentials:

- [ ] Single service purchase — Stripe test card `4242 4242 4242 4242`
- [ ] Subscription purchase — Stripe test card
- [ ] Mixed cart (one-time + subscription) — Stripe
- [ ] PayPal single purchase — sandbox account
- [ ] Declined card — Stripe test card `4000 0000 0000 0002` → expect error state, not 500
- [ ] Duplicate payment attempt — same `orderId` used twice → expect idempotent response
- [ ] Webhook delivery verified for both Stripe and PayPal (check `pf_webhook_events` table)
- [ ] Post-payment: booking token created in `pf_booking_rights`
- [ ] Post-payment: onboarding email sent via Resend

---

## Stage 5 — Payment Provider Setup (Production)

### Stripe

- [ ] Live webhook created: `https://www.clickonversion.com/api/webhooks/stripe`
- [ ] Required events enabled: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`
- [ ] `STRIPE_WEBHOOK_SECRET` updated to production webhook signing secret
- [ ] Stripe account in live mode (not test mode)

### PayPal

- [ ] Live webhook created: `https://www.clickonversion.com/api/webhooks/paypal`
- [ ] Required events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `BILLING.SUBSCRIPTION.CREATED`, `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`
- [ ] `PAYPAL_WEBHOOK_ID` updated to production webhook ID
- [ ] PayPal app in live mode

---

## Stage 6 — External Integrations

### Cal.com

- [ ] Live event types configured
- [ ] Webhook created: `https://www.clickonversion.com/api/webhooks/calcom`
- [ ] HMAC secret set in Cal.com and matching `CALCOM_WEBHOOK_SECRET`
- [ ] Cal.com embed tested on `/book`

### Resend

- [ ] DNS verified: SPF + DKIM for `send.clickonversion.com`
- [ ] Domain verified in Resend dashboard
- [ ] Test email sent from `notifications@clickonversion.com` → delivered to inbox (not spam)

### Cloudflare Turnstile

- [ ] Production site key (not test key) in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- [ ] Domain `clickonversion.com` added to Turnstile widget allowed origins
- [ ] Audit form tested with real Turnstile challenge

---

## Stage 7 — SEO

- [ ] `/sitemap.xml` accessible and includes: `/`, `/audit`, `/apps`, `/apps/synclead`, `/privacy`, `/terms`
- [ ] `/sitemap.xml` does NOT include: `/portal`, `/admin`, `/app/`, `/api/`, `/checkout`, `/cleaning`
- [ ] `/robots.txt` disallows: `/portal/`, `/admin/`, `/app/`, `/api/`, `/login`, `/checkout/`, `/cleaning`
- [ ] Homepage canonical: `https://www.clickonversion.com`
- [ ] Each public page has: `<title>`, `<meta description>`, `<link rel="canonical">`
- [ ] OpenGraph tags present on homepage, audit page, /apps, /apps/synclead
- [ ] JSON-LD Organization + WebSite in root layout
- [ ] JSON-LD SoftwareApplication in /apps/synclead
- [ ] Google Search Console: site verified and sitemap submitted
- [ ] GA4: Measurement ID active, `audit_submitted` event firing

---

## Stage 8 — Security

- [ ] All portal API routes return 401 without valid session (run E2E test suite: `pnpm test:e2e --project=chromium src/e2e/04-security.spec.ts`)
- [ ] Admin routes return 401 without valid admin session
- [ ] No `internal_notes` or `is_internal` data exposed in portal API responses
- [ ] Signed URLs are generated server-side only (never exposed via `/api/portal/documents/[id]` without auth check)
- [ ] `pf_request_status_log` trigger active — verify:
  ```sql
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'pf_request_status_log'::regclass;
  ```
- [ ] Stripe webhook signature verified in handler (not bypassed)
- [ ] PayPal webhook signature verified in handler
- [ ] Cal.com webhook HMAC verified in handler
- [ ] Rate limiting active on `/api/audit` (5 req/min per IP)
- [ ] Rate limiting active on `/api/apps/synclead/waitlist` (3 req/hour per IP)
- [ ] No secrets exposed in Vercel build logs (check "Environment Variables" in Vercel settings — no server-only keys marked as visible to preview/development if not needed)

---

## Stage 9 — Performance

- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms (test with PageSpeed Insights)
- [ ] `pnpm build` output shows no page > 500kB (first load JS)
- [ ] Images in `/public` are optimized (WebP/AVIF preferred)
- [ ] GA4 loads with `strategy="afterInteractive"` (non-blocking)
- [ ] No render-blocking resources in `<head>`

---

## Stage 10 — E2E Validation

Run full E2E suite before go-live:

```bash
# Public marketing + security tests (no credentials needed)
pnpm test:e2e src/e2e/01-marketing.spec.ts
pnpm test:e2e src/e2e/04-security.spec.ts

# Portal auth tests (no credentials needed for unauthenticated paths)
pnpm test:e2e src/e2e/03-portal-auth.spec.ts

# Payment + full flow (requires sandbox env)
E2E_PAYMENTS_ENABLED=1 pnpm test:e2e src/e2e/02-checkout.spec.ts
E2E_FULL_FLOW=1 pnpm test:e2e src/e2e/05-full-flow.spec.ts
```

- [ ] 01-marketing: all tests pass
- [ ] 02-checkout: sandbox payment tests pass
- [ ] 03-portal-auth: unauthenticated redirect tests pass
- [ ] 04-security: all security tests pass
- [ ] 05-full-flow: full journey passes in sandbox

---

## Stage 11 — First Client Activation (Manual)

For the first paying client:

- [ ] Client registered via `/portal/register` or manually created in Supabase Auth
- [ ] `pf_client_orgs` row exists for their organization
- [ ] `pf_org_members` row links the user to their org with `role = 'admin'`
- [ ] At least one `pf_request` linked to a confirmed `pf_order`
- [ ] Request assigned to a specialist in `/admin/queue`
- [ ] Client received welcome email (check Resend logs)
- [ ] Client can log into `/portal/dashboard` and see their request

---

## Stage 12 — Go / No-Go Decision

All stages above complete → **GO**

Any of the following → **NO-GO**:

- Any test credentials (Stripe test, PayPal sandbox) in production env vars
- Stripe/PayPal webhooks not delivering in production
- `pnpm build` failing
- Any RLS policy missing (tables accessible without auth)
- Portal `internal_notes` visible in API response
- Signed URLs accessible without valid session

---

## Rollback Plan

If a critical issue is found after production deployment:

1. **Vercel rollback** (< 5 min):
   ```bash
   vercel ls                          # Find previous deployment URL
   vercel promote <deployment-url>    # Promote to production
   ```
   Or: Vercel Dashboard → Deployments → Previous deploy → "..." → "Promote to Production"

2. **Database rollback** (if schema change caused the issue):
   - Open the migration file — each includes a `-- ROLLBACK:` section
   - Run the rollback SQL in Supabase SQL Editor
   - ⚠️ Only safe if no production data was written to the new tables

3. **Webhook rollback** (if webhook endpoint changed):
   - Update the endpoint URL in Stripe/PayPal dashboard to the previous URL

4. **Notify**: Post in internal channel with impact, affected routes, and ETA for fix.
