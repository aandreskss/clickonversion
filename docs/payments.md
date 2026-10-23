# Phase 3 — Payments Implementation Guide

## Architecture Overview

```
Client (localStorage cart)
    ↓ POST /api/payments/checkout
Server validates prices from DB (never trusts client prices)
    ↓ creates pf_order + pf_order_items
    ↓ splits cart: oneTime | recurring | quotes
    ↓ quote items → pf_quotes (no charge)
    ↓ payable items → provider checkout session
Client redirects to Stripe/PayPal hosted page
    ↓ user pays
Provider webhook → /api/webhooks/stripe or /api/webhooks/paypal
    ↓ idempotency check (pf_webhook_events)
    ↓ update pf_payments + pf_orders + pf_subscriptions
    ↓ pf_payment_audit log
```

## Provider Compatibility Matrix

| Feature                     | Stripe | PayPal |
|-----------------------------|--------|--------|
| One-time payment            | ✅     | ✅     |
| Monthly subscription        | ✅     | ✅ (one per checkout) |
| Mixed one-time + recurring  | ✅ (customer + invoice items + subscription) | ❌ (two separate flows required) |
| Multiple subscriptions      | ✅     | ❌ (one per approval) |
| Refunds                     | ✅     | ✅     |
| Webhook HMAC verification   | ✅     | ❌ (PayPal verification API roundtrip) |
| Idempotency keys            | ✅     | ✅ (PayPal-Request-Id header) |

**Recommendation:** Use Stripe for mixed carts and carts with multiple recurring services.
PayPal is ideal for simple one-time payments or a single monthly subscription.

## Environment Variables

### Sandbox (development)

Add to `.env.local`:

```bash
# Stripe (test keys — from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe

# PayPal (sandbox — from https://developer.paypal.com/dashboard/applications/sandbox)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...
PAYPAL_MODE=sandbox
```

### Production

```bash
# Stripe (live keys)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from Stripe dashboard webhook endpoint

# PayPal (live)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...
PAYPAL_MODE=live
```

## Local Development with Webhooks

### Stripe
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward events to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret shown in the CLI output to `STRIPE_WEBHOOK_SECRET`
5. Trigger test events:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.deleted
   stripe trigger charge.refunded
   ```

### PayPal
1. Create a sandbox account at https://developer.paypal.com
2. Set `PAYPAL_MODE=sandbox`
3. For webhooks in local development, use ngrok:
   ```bash
   ngrok http 3000
   # Then register https://<ngrok-url>/api/webhooks/paypal in PayPal Developer Dashboard
   ```
4. Copy the Webhook ID from PayPal Dashboard to `PAYPAL_WEBHOOK_ID`

## Database Migrations

Apply migrations in order:
```sql
-- 1. Service catalog
supabase/migrations/004_service_catalog.sql

-- 2. Orders and payments
supabase/migrations/005_orders_payments.sql

-- 3. RLS policies
supabase/migrations/006_rls_payment_tables.sql

-- 4. Seed initial prices (update prices from admin panel after)
supabase/migrations/007_catalog_seed.sql
```

## Testing Scenarios

### Stripe Test Cards
| Scenario              | Card number         |
|-----------------------|---------------------|
| Success               | 4242 4242 4242 4242 |
| Insufficient funds    | 4000 0000 0000 9995 |
| Card declined         | 4000 0000 0000 0002 |
| Requires auth (3DS)   | 4000 0025 0000 3155 |
| Dispute (fraudulent)  | 4000 0000 0000 0259 |

Use any future expiry date, any CVC, any ZIP.

### PayPal Sandbox Test Accounts
- Create buyer/seller sandbox accounts in the PayPal Developer Dashboard
- Use sandbox buyer credentials to approve test payments

### Test Scenarios Checklist
- [ ] Successful one-time purchase (Stripe)
- [ ] Successful subscription (Stripe)
- [ ] Mixed cart (Stripe — invoice items + subscription in one invoice)
- [ ] Successful one-time purchase (PayPal)
- [ ] Successful subscription (PayPal)
- [ ] Mixed cart with PayPal → expect 422 error, message shown to user
- [ ] Failed payment (Stripe declined card)
- [ ] Pending payment (Stripe requires 3DS)
- [ ] Duplicate webhook → second call returns `{ skipped: true }`
- [ ] Delayed webhook (events arriving out of order)
- [ ] Subscription cancellation (via Stripe webhook)
- [ ] Refund issued (Stripe → order status updated to refunded)
- [ ] Quote-only cart → no payment, quote record created, admin notified
- [ ] Quote updated by admin (PATCH /api/admin/quotes/:id)

## Activating Real Payments (Production Checklist)

1. **Stripe**
   - [ ] Complete Stripe identity verification
   - [ ] Set live Stripe keys in Vercel env vars
   - [ ] Register production webhook endpoint in Stripe Dashboard: `https://www.clickonversion.com/api/webhooks/stripe`
   - [ ] Select events: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`
   - [ ] Set `STRIPE_WEBHOOK_SECRET` in Vercel from the live webhook signing secret

2. **PayPal**
   - [ ] Switch PayPal app to Live mode in Developer Dashboard
   - [ ] Update `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE=live`
   - [ ] Register production webhook: `https://www.clickonversion.com/api/webhooks/paypal`
   - [ ] Subscribe to events: `CHECKOUT.ORDER.COMPLETED`, `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.PAYMENT.FAILED`, `PAYMENT.SALE.REFUNDED`
   - [ ] Update `PAYPAL_WEBHOOK_ID` in Vercel

3. **Database**
   - [ ] Apply all 4 migration files to production Supabase
   - [ ] Verify RLS policies are active on all `pf_*` tables
   - [ ] Update `pf_service_prices.stripe_price_id` and `paypal_plan_id` for pre-created recurring plans

4. **Admin catalog management**
   - [ ] Verify prices via Supabase dashboard or admin route
   - [ ] Set `is_published = true` for each service you want visible in the catalog

## Security Notes

- Server always re-fetches prices from DB at checkout — client prices are display-only
- Webhook signature verification is mandatory and happens before any DB write
- All payment state transitions are logged in `pf_payment_audit` (immutable)
- `pf_webhook_events` table enforces `UNIQUE(provider, event_id)` for idempotency
- Frontend never determines if a purchase is paid — only webhook confirmation activates service
- Stripe keys with `sk_live_` prefix MUST NOT be committed to source control
- PayPal credentials MUST be in server-only env vars (no `NEXT_PUBLIC_` prefix)

## Admin Quote Workflow

1. Client submits cart with STARTING_AT/CUSTOM_QUOTE items
2. System creates `pf_quotes` record (status: `pending`)
3. Admin reviews: `GET /api/admin/quotes/:id` (requires auth)
4. Admin creates proposal:
   ```json
   PATCH /api/admin/quotes/:id
   { "status": "in_review", "scope": "...", "proposedPriceUsd": 350, "proposalNotes": "..." }
   ```
5. Admin sends payment link:
   ```json
   PATCH /api/admin/quotes/:id
   { "status": "proposal_sent", "paymentLink": "https://buy.stripe.com/..." }
   ```
6. Client accepts → admin updates:
   ```json
   PATCH /api/admin/quotes/:id
   { "status": "accepted" }
   ```
7. Every state change is logged in `pf_payment_audit`
