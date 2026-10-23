-- Migration 004: Service catalog
-- Rollback: DROP TABLE pf_service_prices; DROP TABLE pf_service_catalog; DROP TYPE IF EXISTS billing_period; DROP TYPE IF EXISTS price_type; DROP TYPE IF EXISTS service_category;

CREATE TYPE price_type AS ENUM ('ONE_TIME', 'RECURRING', 'STARTING_AT', 'CUSTOM_QUOTE');
CREATE TYPE billing_period AS ENUM ('monthly', 'quarterly', 'annual', 'one_time');
CREATE TYPE service_category AS ENUM ('seo', 'paid-media', 'automation', 'support');

CREATE TABLE pf_service_catalog (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT UNIQUE NOT NULL,
  category          service_category NOT NULL,
  name_en           TEXT NOT NULL,
  name_es           TEXT NOT NULL,
  description_en    TEXT NOT NULL DEFAULT '',
  description_es    TEXT NOT NULL DEFAULT '',
  is_published      BOOLEAN NOT NULL DEFAULT false,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  deliverables      JSONB NOT NULL DEFAULT '[]',
  requirements      JSONB NOT NULL DEFAULT '[]',
  onboarding_fields JSONB NOT NULL DEFAULT '[]',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pf_service_prices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id       UUID NOT NULL REFERENCES pf_service_catalog(id) ON DELETE CASCADE,
  name_en          TEXT NOT NULL,
  name_es          TEXT NOT NULL,
  price_type       price_type NOT NULL,
  base_price_usd   NUMERIC(10,2),     -- NULL for CUSTOM_QUOTE
  billing_period_val billing_period,  -- NULL for CUSTOM_QUOTE
  stripe_price_id  TEXT,              -- set once Stripe Price is created
  paypal_plan_id   TEXT,              -- set once PayPal Plan is created
  is_active        BOOLEAN NOT NULL DEFAULT true,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_pf_service_catalog_updated_at
  BEFORE UPDATE ON pf_service_catalog
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_pf_service_prices_updated_at
  BEFORE UPDATE ON pf_service_prices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_pf_service_catalog_category  ON pf_service_catalog(category);
CREATE INDEX idx_pf_service_catalog_published ON pf_service_catalog(is_published);
CREATE INDEX idx_pf_service_prices_service    ON pf_service_prices(service_id);
CREATE INDEX idx_pf_service_prices_active     ON pf_service_prices(is_active);
