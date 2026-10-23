# Operations Guide — ClicKonversion

Last updated: 2026-10-23

---

## 1. Installation

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 22+ | LTS recommended |
| pnpm | 9.x | `npm i -g pnpm@9` |
| Supabase CLI | latest | `npm i -g supabase` |
| Vercel CLI | latest | `npm i -g vercel` |

### Local setup

```bash
git clone <repo-url> clickonversion
cd clickonversion
pnpm install
cp .env.example .env.local      # Fill in your values (see §3 Variables)
pnpm supabase start             # Starts local Supabase (Docker required)
pnpm supabase db push           # Apply all migrations
pnpm dev                        # http://localhost:3000
```

### First-time database seed

After `pnpm supabase db push`:

```sql
-- 1. Seed the organization (single-tenant CRM)
INSERT INTO organizations (name, slug) VALUES ('ClicKonversion', 'clickonversion');
-- 2. Copy the resulting UUID → SUPABASE_ORG_ID in .env.local

-- 3. Run catalog seed (services + prices)
-- migrations/007_catalog_seed.sql is applied automatically via db push
```

---

## 2. Environments

| Environment | URL | Supabase project | Stripe mode | PayPal mode |
|-------------|-----|-----------------|-------------|-------------|
| Local | http://localhost:3000 | Local (Docker) | Test | Sandbox |
| Preview (Vercel) | auto-generated | Staging project | Test | Sandbox |
| Production | https://www.clickonversion.com | Prod project | Live | Live |

**Rule:** Never use Live Stripe/PayPal keys outside of the production environment.

---

## 3. Environment Variables

### Required — all environments

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server-only, never NEXT_PUBLIC_** | `eyJ...` |
| `SUPABASE_ORG_ID` | CRM organization UUID — **server-only** | `db07...` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `https://www.clickonversion.com` |

### Payments

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (test) or `sk_live_...` (prod) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from Stripe dashboard |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` |
| `PAYPAL_CLIENT_ID` | PayPal app client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal app secret |
| `PAYPAL_WEBHOOK_ID` | PayPal webhook ID from dashboard |
| `PAYPAL_MODE` | `sandbox` or `live` |

### Email

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key — **server-only** |
| `EMAIL_FROM` | `ClicKonversion <notifications@clickonversion.com>` |
| `NOTIFICATION_EMAIL` | `arnaldo@clickonversion.com` |

### Bookings (Cal.com)

| Variable | Description |
|----------|-------------|
| `CAL_API_KEY` | Cal.com API key |
| `CALCOM_WEBHOOK_SECRET` | HMAC secret from Cal.com webhook settings |
| `NEXT_PUBLIC_CAL_USERNAME` | Cal.com username |

### Bot protection

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Turnstile secret — **server-only** |

### Analytics

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 Measurement ID (optional — no scripts if unset) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token |

---

## 4. Migrations

Migrations live in `supabase/migrations/`. They are run in order — never rename or reorder existing files.

### Apply to local

```bash
pnpm supabase db push
```

### Apply to production (Supabase Cloud)

```bash
pnpm supabase db push --linked
# or via Supabase dashboard → SQL Editor for individual migrations
```

### Create a new migration

```bash
pnpm supabase migration new <descriptive-name>
# Edit the generated file in supabase/migrations/
```

### Migration index

| File | Purpose |
|------|---------|
| `001_init_schema.sql` | CRM base tables (organizations, companies, contacts, etc.) |
| `002_rls_policies.sql` | CRM RLS |
| `003_indexes_and_functions.sql` | Indexes, updated_at triggers |
| `004_service_catalog.sql` | pf_service_catalog, pf_service_prices |
| `005_orders_payments.sql` | pf_orders, pf_order_items, pf_payments |
| `006_rls_payment_tables.sql` | RLS for payment tables |
| `007_catalog_seed.sql` | Initial services seed |
| `008_meetings.sql` | pf_meetings, pf_booking_rights |
| `009_rls_meetings.sql` | RLS for meetings |
| `010_platform_users.sql` | pf_platform_users (staff) |
| `011_client_orgs.sql` | pf_client_orgs, pf_org_members |
| `012_requests.sql` | pf_requests, pf_request_milestones |
| `013_documents.sql` | pf_documents |
| `014_notifications.sql` | pf_notifications |
| `015_rls_portal.sql` | Multi-tenant RLS (portal) |
| `016_admin_roles.sql` | admin_role enum, pf_specialist_profiles |
| `017_requests_enhancements.sql` | Request state machine enhancements |
| `018_payment_reconciliation.sql` | pf_payment_reconciliation |
| `019_analytics_internal.sql` | pf_analytics_events |
| `020_catalog_price_history.sql` | pf_catalog_price_history (immutable) |
| `021_rls_admin.sql` | RLS for admin tables |

**Pending migration** (apply before enabling waitlist):
```sql
-- 022_app_waitlist.sql
CREATE TABLE IF NOT EXISTS pf_app_waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  app_slug    TEXT NOT NULL DEFAULT 'synclead',
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email, app_slug)
);
ALTER TABLE pf_app_waitlist ENABLE ROW LEVEL SECURITY;
-- No read access for anonymous users
CREATE POLICY "No anon read" ON pf_app_waitlist FOR SELECT USING (false);
-- Only service role can insert
CREATE POLICY "Service role insert" ON pf_app_waitlist FOR INSERT WITH CHECK (true);
```

---

## 5. External Providers

### Stripe

- Dashboard: https://dashboard.stripe.com
- Webhook endpoint: `https://www.clickonversion.com/api/webhooks/stripe`
- Events to enable: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`, `charge.refunded`
- Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)

### PayPal

- Dashboard: https://developer.paypal.com
- Webhook endpoint: `https://www.clickonversion.com/api/webhooks/paypal`
- Events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `BILLING.SUBSCRIPTION.CREATED`, `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`

### Cal.com

- Dashboard: https://app.cal.com
- Webhook endpoint: `https://www.clickonversion.com/api/webhooks/calcom`
- Signature: HMAC-SHA256 via `X-Cal-Signature-256` header

### Resend

- Dashboard: https://resend.com/dashboard
- Sending domain: `notifications@clickonversion.com`
- Verify DNS: SPF, DKIM on `send.clickonversion.com`

### Cloudflare (DNS + Turnstile)

- DNS proxy for `clickonversion.com` and `www.clickonversion.com` → Vercel
- Turnstile widget on audit form — verify site key and secret are in sync
- SSL: Universal (Google Trust Services) — auto-renews every 3 months

### Supabase Storage

- Bucket name: `portal-docs`
- Visibility: **private**
- Path structure: `{orgId}/{uuid}/{filename}`
- Max file size: 50 MB
- Signed URL TTL: 1 hour (server-side only — never expose signed URLs to client before auth check)

---

## 6. Managing Prices

### How prices work

- Prices are stored in `pf_service_prices` with `effective_from` and `effective_to` dates.
- When you change a price, **do not update the existing row** — insert a new row and set `effective_to` on the old one.
- `pf_catalog_price_history` records every price change automatically (append-only trigger).
- `pf_order_items` store snapshot prices — historical orders are never affected by price changes.

### Adding a new service

```sql
-- 1. Insert the service
INSERT INTO pf_service_catalog (slug, name, category, description, is_published)
VALUES ('my-new-service', 'My New Service', 'seo', 'Description', false);

-- 2. Add the price
INSERT INTO pf_service_prices (service_id, amount_cents, currency, billing_type, effective_from)
VALUES ('<service-uuid>', 49900, 'USD', 'one_time', now());

-- 3. Publish via admin panel or:
UPDATE pf_service_catalog SET is_published = true WHERE slug = 'my-new-service';
```

### Changing a price

```sql
-- 1. Close the current price
UPDATE pf_service_prices
SET effective_to = now()
WHERE service_id = '<uuid>' AND effective_to IS NULL;

-- 2. Insert the new price
INSERT INTO pf_service_prices (service_id, amount_cents, currency, billing_type, effective_from)
VALUES ('<uuid>', 59900, 'USD', 'one_time', now());
```

---

## 7. Managing Requests (Client Work)

### Request lifecycle

```
pending_payment → queued → in_progress → review → completed
                        ↘ waiting_client
                        ↘ waiting_third_party
                        ↘ cancelled → refunded
```

### Transitioning a request status

Via admin panel: `/admin/queue/[id]` → "Change Status" button.

Via SQL (emergency only — bypasses audit log):
```sql
-- Never do this in production — use the admin panel
-- Status log is append-only (trigger prevents UPDATE/DELETE)
```

### Assigning a specialist

Via admin panel: `/admin/queue/[id]` → "Assign" button.
Capacity check runs automatically — if the specialist is at `max_concurrent`, assignment is blocked.

### Adding a milestone

Via admin panel: `/admin/queue/[id]` → "Milestones" tab → "Add milestone".
Set `visible_to_client = true` to show it in the portal.

---

## 8. Refund Procedure

1. **Identify the payment** in `/admin/payments` — note `pf_payment_id` and `pf_order_id`.
2. **Issue refund in the payment provider:**
   - Stripe: Dashboard → Payments → find the PaymentIntent → "Refund"
   - PayPal: Dashboard → Activity → find the capture → "Refund"
3. **The webhook fires** — `charge.refunded` (Stripe) or `PAYMENT.CAPTURE.REFUNDED` (PayPal).
4. **The system updates** `pf_payments.status = 'refunded'` and `pf_orders.status = 'refunded'` automatically via webhook handlers.
5. **Transition the request** to `refunded` status in `/admin/queue/[id]`.
6. **Check reconciliation** in `/admin/payments` → Discrepancies tab — ensure no open discrepancy remains.
7. **Notify the client** manually or via the request comment (public message).

**If the webhook didn't fire:** manually update via:
```sql
UPDATE pf_payments SET status = 'refunded', refunded_at = now() WHERE id = '<pf_payment_id>';
UPDATE pf_orders   SET status = 'refunded'                       WHERE id = '<pf_order_id>';
```

---

## 9. Incident Response

### Payment discrepancy

1. Check `/admin/payments` → Discrepancies tab.
2. Cross-reference with Stripe Dashboard or PayPal Dashboard.
3. If the webhook was missed: replay it from the provider's dashboard.
4. If the amount is wrong: open a support ticket with the provider.
5. Mark resolved in `/admin/payments/discrepancies/[id]` once confirmed.

### Portal user can't log in

1. Check Supabase Auth dashboard → Users → verify email is confirmed.
2. If unconfirmed: resend confirmation email from Supabase Auth dashboard.
3. If confirmed but blocked: check `pf_platform_users` for `is_active = false`.
4. Reset password from: `/portal/forgot-password`.

### Webhook delivery failure

1. Check provider webhook logs (Stripe: Dashboard → Webhooks → Delivery; PayPal: Dashboard → Webhooks → Deliveries).
2. Retry delivery from the provider dashboard.
3. Check `pf_webhook_events` for the `event_id` — if present, it was already processed (idempotent).
4. Check Vercel function logs for errors.

### High error rate alert

1. Check Vercel deployment logs.
2. Check Supabase logs for slow queries or RLS policy errors.
3. If database-related: check connection pool usage in Supabase dashboard.
4. Rollback procedure: see §12.

---

## 10. Deployment

### Standard deploy (Vercel)

```bash
git push origin main    # Triggers Vercel production deploy automatically
# or
pnpm vercel --prod      # Manual deploy
```

### Preview deploy

Any branch pushed to GitHub gets an automatic Vercel preview URL.

### Deploy checklist (before each production deploy)

- [ ] `pnpm build` passes locally with 0 errors
- [ ] `pnpm test` passes (179/179 tests)
- [ ] All new migrations have been applied to the production Supabase project
- [ ] New environment variables have been added to Vercel project settings
- [ ] Webhook endpoints updated in Stripe/PayPal dashboards if routes changed
- [ ] Storage bucket permissions verified if new upload routes were added
- [ ] No `console.log` with sensitive data in any new code
- [ ] No `NEXT_PUBLIC_` prefix on any secret (service role key, webhook secrets, etc.)

---

## 11. Monitoring

### Current monitoring setup

| Layer | Tool | What to watch |
|-------|------|---------------|
| Frontend errors | Browser console / Vercel logs | Client-side crashes |
| API errors | Vercel function logs | 5xx errors |
| Database | Supabase dashboard | Slow queries, connection pool |
| Payments | Stripe / PayPal dashboards | Failed payments, undelivered webhooks |
| Uptime | Manual / TBD | Site availability |

### Recommended additions (not yet configured)

- Sentry for structured error capture in API routes
- UptimeRobot or Better Uptime for uptime monitoring + Slack/email alerts
- Stripe webhook failure alerts (available in Stripe Dashboard → Webhooks → Notifications)

---

## 12. Rollback

### Vercel rollback (code only)

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel promote <deployment-url>
```

Or via Vercel dashboard → Project → Deployments → "..." → "Promote to Production".

### Database rollback

**Schema changes are not automatically reversible.** Each migration includes a rollback comment at the top. To rollback:

1. Open the migration file.
2. Run the SQL from the `-- ROLLBACK:` comment section.
3. Test locally before applying to production.

**Warning:** Rollback is only safe if no data has been written to the new/changed tables. If rows exist, dropping tables will cause data loss — coordinate with the team before proceeding.

### Partial rollback (emergency)

If a deployment introduces a critical bug but a full code rollback isn't desirable:

1. Deploy a hotfix branch as a Vercel preview.
2. Test the hotfix.
3. Push to main and let Vercel redeploy.

---

## 13. Backup and Recovery

### Supabase (managed)

- Point-in-time recovery: available on Pro plan (hourly snapshots, 7-day retention)
- Manual backup: `pg_dump` via Supabase connection string
- Storage: Supabase backup policy covers database — storage (portal-docs bucket) is NOT included in PITR

### Critical data notes

- `pf_request_status_log` is append-only — trigger prevents UPDATE/DELETE
- `pf_payment_audit` is immutable — trigger prevents UPDATE/DELETE
- `pf_catalog_price_history` is immutable — trigger prevents UPDATE/DELETE
- These tables should NEVER be manually modified — they are the audit trail

### Storage recovery

- Portal documents are stored in the `portal-docs` bucket (private)
- Supabase Storage does not have built-in PITR — implement periodic export if required
- Each document entry in `pf_documents` stores `storage_path`, `file_size`, `mime_type`
