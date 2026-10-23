-- Migration 020: Service catalog price change history
-- Rollback: DROP TABLE pf_catalog_price_history;

CREATE TABLE pf_catalog_price_history (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id       UUID NOT NULL REFERENCES pf_service_catalog(id) ON DELETE CASCADE,
  price_id         UUID REFERENCES pf_service_prices(id) ON DELETE SET NULL,
  old_price_usd    NUMERIC(10,2),
  new_price_usd    NUMERIC(10,2),
  changed_by       UUID REFERENCES pf_platform_users(id) ON DELETE SET NULL,
  changed_by_email TEXT,   -- snapshot
  effective_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_price_history_service ON pf_catalog_price_history(service_id);
CREATE INDEX idx_pf_price_history_created ON pf_catalog_price_history(created_at DESC);

-- Prevent price changes from silently altering audit log
CREATE OR REPLACE FUNCTION deny_price_history_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'pf_catalog_price_history is immutable';
END;
$$;

CREATE TRIGGER trg_deny_price_history_update
  BEFORE UPDATE OR DELETE ON pf_catalog_price_history
  FOR EACH ROW EXECUTE FUNCTION deny_price_history_update();
