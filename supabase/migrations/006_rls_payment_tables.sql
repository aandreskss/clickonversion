-- Migration 006: RLS policies for payment tables
-- All tables have RLS enabled. Public tables (quotes, orders) allow guest insert
-- but restrict reads to the owning email + admin (service role).

ALTER TABLE pf_service_catalog  ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_service_prices   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_order_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_quotes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_webhook_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_payment_audit    ENABLE ROW LEVEL SECURITY;

-- ── Service catalog (public read for published, admin write) ─────────────────

CREATE POLICY "catalog: public read published"
  ON pf_service_catalog FOR SELECT
  USING (is_published = true);

CREATE POLICY "catalog: admin all"
  ON pf_service_catalog FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "prices: public read active"
  ON pf_service_prices FOR SELECT
  USING (is_active = true);

CREATE POLICY "prices: admin all"
  ON pf_service_prices FOR ALL
  USING (auth.role() = 'service_role');

-- ── Orders (guest checkout: insert allowed, read own by email or auth user) ──

CREATE POLICY "orders: guest insert"
  ON pf_orders FOR INSERT
  WITH CHECK (true);  -- validated in API route; no anonymous user context needed

CREATE POLICY "orders: read own by email"
  ON pf_orders FOR SELECT
  USING (
    client_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
    OR user_id = auth.uid()
    OR auth.role() = 'service_role'
  );

CREATE POLICY "orders: admin update"
  ON pf_orders FOR UPDATE
  USING (auth.role() = 'service_role');

-- ── Order items (follow parent order) ──────────────────────────────────────

CREATE POLICY "order_items: insert system"
  ON pf_order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "order_items: read via order"
  ON pf_order_items FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM pf_orders o
      WHERE o.id = order_id
        AND (
          o.client_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
          OR o.user_id = auth.uid()
        )
    )
  );

-- ── Payments (admin only, webhooks use service_role) ────────────────────────

CREATE POLICY "payments: admin all"
  ON pf_payments FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "payments: owner read"
  ON pf_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pf_orders o
      WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

-- ── Subscriptions ────────────────────────────────────────────────────────────

CREATE POLICY "subscriptions: admin all"
  ON pf_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "subscriptions: owner read"
  ON pf_subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pf_orders o
      WHERE o.id = order_id
        AND (o.user_id = auth.uid() OR auth.role() = 'service_role')
    )
  );

-- ── Quotes ───────────────────────────────────────────────────────────────────

CREATE POLICY "quotes: public insert"
  ON pf_quotes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "quotes: read own"
  ON pf_quotes FOR SELECT
  USING (
    client_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
    OR auth.role() = 'service_role'
  );

CREATE POLICY "quotes: admin update"
  ON pf_quotes FOR UPDATE
  USING (auth.role() = 'service_role');

-- ── Webhook events and audit (service_role only) ─────────────────────────────

CREATE POLICY "webhook_events: service_role only"
  ON pf_webhook_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "payment_audit: service_role only"
  ON pf_payment_audit FOR ALL
  USING (auth.role() = 'service_role');
