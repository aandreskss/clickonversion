-- Migration 018: Payment reconciliation
-- Rollback: DROP TABLE pf_payment_reconciliation; DROP TYPE reconciliation_status;

CREATE TYPE reconciliation_status AS ENUM ('matched', 'discrepancy', 'manual_review', 'resolved');

CREATE TABLE pf_payment_reconciliation (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES pf_orders(id),
  payment_id       UUID REFERENCES pf_payments(id),
  provider         payment_provider NOT NULL,
  provider_amount  NUMERIC(10,2) NOT NULL,   -- amount reported by Stripe/PayPal
  internal_amount  NUMERIC(10,2) NOT NULL,   -- amount recorded in pf_payments
  currency         TEXT NOT NULL DEFAULT 'USD',
  discrepancy      NUMERIC(10,2) GENERATED ALWAYS AS (provider_amount - internal_amount) STORED,
  status           reconciliation_status NOT NULL DEFAULT 'matched',
  notes            TEXT,
  resolved_by      UUID REFERENCES pf_platform_users(id),
  resolved_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_reconciliation_order   ON pf_payment_reconciliation(order_id);
CREATE INDEX idx_pf_reconciliation_status  ON pf_payment_reconciliation(status);
CREATE INDEX idx_pf_reconciliation_created ON pf_payment_reconciliation(created_at DESC);

CREATE TRIGGER trg_pf_reconciliation_updated_at
  BEFORE UPDATE ON pf_payment_reconciliation
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
