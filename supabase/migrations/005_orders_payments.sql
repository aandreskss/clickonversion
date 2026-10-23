-- Migration 005: Orders, payments, subscriptions, quotes, webhooks
-- Rollback: DROP TABLE pf_payment_audit, pf_webhook_events, pf_quotes, pf_subscriptions, pf_payments, pf_order_items, pf_orders;
--           DROP TYPE IF EXISTS order_status, payment_status, payment_type, subscription_status, quote_status, payment_provider;

CREATE TYPE payment_provider    AS ENUM ('stripe', 'paypal');
CREATE TYPE order_status        AS ENUM ('draft', 'pending_payment', 'partially_paid', 'paid', 'quote_pending', 'cancelled', 'refunded');
CREATE TYPE payment_status      AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded');
CREATE TYPE payment_type_enum   AS ENUM ('one_time', 'subscription_initial', 'subscription_renewal');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'cancelled', 'unpaid', 'paused');
CREATE TYPE quote_status        AS ENUM ('pending', 'in_review', 'proposal_sent', 'accepted', 'declined', 'expired');

-- Orders (one per checkout session)
CREATE TABLE pf_orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         TEXT UNIQUE NOT NULL,                   -- human-readable CK-YYYYMMDD-XXXX
  client_email         TEXT NOT NULL,
  client_name          TEXT NOT NULL,
  client_company       TEXT,
  user_id              UUID REFERENCES auth.users(id),         -- NULL = guest checkout
  status               order_status NOT NULL DEFAULT 'draft',
  currency             TEXT NOT NULL DEFAULT 'USD',
  subtotal_usd         NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_usd              NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_usd            NUMERIC(10,2) NOT NULL DEFAULT 0,       -- subtotal + tax (one-time now)
  recurring_total_usd  NUMERIC(10,2) NOT NULL DEFAULT 0,       -- monthly charge after first invoice
  items_snapshot       JSONB NOT NULL DEFAULT '[]',            -- immutable copy at time of order
  metadata             JSONB NOT NULL DEFAULT '{}',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Line items (price snapshot — never mutated after creation)
CREATE TABLE pf_order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES pf_orders(id) ON DELETE CASCADE,
  service_id      UUID NOT NULL REFERENCES pf_service_catalog(id),
  price_id        UUID REFERENCES pf_service_prices(id),
  quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_usd  NUMERIC(10,2) NOT NULL,                      -- snapshot
  line_total_usd  NUMERIC(10,2) NOT NULL,
  price_type      price_type NOT NULL,
  billing_period_val billing_period,
  service_name    TEXT NOT NULL,                               -- snapshot
  price_tier_name TEXT NOT NULL,                               -- snapshot (e.g. "Starter", "Growth")
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payment transactions (one per provider charge attempt)
CREATE TABLE pf_payments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES pf_orders(id),
  provider            payment_provider NOT NULL,
  provider_payment_id TEXT,           -- Stripe PaymentIntent ID or PayPal capture ID
  provider_checkout_id TEXT,          -- Stripe Session ID or PayPal Order ID
  amount_usd          NUMERIC(10,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'USD',
  status              payment_status NOT NULL DEFAULT 'pending',
  payment_type        payment_type_enum NOT NULL,
  failure_code        TEXT,
  failure_message     TEXT,
  metadata            JSONB NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Active subscriptions
CREATE TABLE pf_subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                 UUID NOT NULL REFERENCES pf_orders(id),
  order_item_id            UUID NOT NULL REFERENCES pf_order_items(id),
  provider                 payment_provider NOT NULL,
  provider_subscription_id TEXT NOT NULL,
  status                   subscription_status NOT NULL DEFAULT 'active',
  current_period_start     TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  cancelled_at             TIMESTAMPTZ,
  metadata                 JSONB NOT NULL DEFAULT '{}',
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subscription_id)
);

-- Quotes (STARTING_AT and CUSTOM_QUOTE services — no automatic charge)
CREATE TABLE pf_quotes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID REFERENCES pf_orders(id),          -- linked after quote is accepted
  client_email        TEXT NOT NULL,
  client_name         TEXT NOT NULL,
  client_company      TEXT,
  services_requested  JSONB NOT NULL DEFAULT '[]',             -- [{service_id, price_id, notes}]
  status              quote_status NOT NULL DEFAULT 'pending',
  client_notes        TEXT,
  -- Admin fills these after review
  scope               TEXT,
  proposed_price_usd  NUMERIC(10,2),
  proposal_notes      TEXT,
  payment_link        TEXT,
  proposal_sent_at    TIMESTAMPTZ,
  accepted_at         TIMESTAMPTZ,
  expires_at          TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days'),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Webhook event log — idempotency store
CREATE TABLE pf_webhook_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider      payment_provider NOT NULL,
  event_id      TEXT NOT NULL,       -- provider's event ID
  event_type    TEXT NOT NULL,
  payload       JSONB NOT NULL,
  processed     BOOLEAN NOT NULL DEFAULT false,
  processed_at  TIMESTAMPTZ,
  error         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)        -- prevents double-processing
);

-- Immutable payment audit trail
CREATE TABLE pf_payment_audit (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type    TEXT NOT NULL CHECK (entity_type IN ('order', 'payment', 'subscription', 'quote')),
  entity_id      UUID NOT NULL,
  action         TEXT NOT NULL,
  actor          TEXT,               -- 'system', 'stripe', 'paypal', or admin email
  previous_state JSONB,
  new_state      JSONB,
  metadata       JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers for updated_at
CREATE TRIGGER trg_pf_orders_updated_at        BEFORE UPDATE ON pf_orders        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pf_payments_updated_at      BEFORE UPDATE ON pf_payments      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pf_subscriptions_updated_at BEFORE UPDATE ON pf_subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pf_quotes_updated_at        BEFORE UPDATE ON pf_quotes        FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX idx_pf_orders_email       ON pf_orders(client_email);
CREATE INDEX idx_pf_orders_status      ON pf_orders(status);
CREATE INDEX idx_pf_orders_user        ON pf_orders(user_id);
CREATE INDEX idx_pf_order_items_order  ON pf_order_items(order_id);
CREATE INDEX idx_pf_payments_order     ON pf_payments(order_id);
CREATE INDEX idx_pf_payments_provider  ON pf_payments(provider, provider_payment_id);
CREATE INDEX idx_pf_subscriptions_sub  ON pf_subscriptions(provider, provider_subscription_id);
CREATE INDEX idx_pf_quotes_email       ON pf_quotes(client_email);
CREATE INDEX idx_pf_quotes_status      ON pf_quotes(status);
CREATE INDEX idx_pf_webhook_events_id  ON pf_webhook_events(provider, event_id);
CREATE INDEX idx_pf_payment_audit_entity ON pf_payment_audit(entity_type, entity_id);

-- Order number generator
CREATE SEQUENCE pf_order_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  RETURN 'CK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('pf_order_seq')::TEXT, 4, '0');
END;
$$;
