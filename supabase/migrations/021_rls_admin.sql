-- Migration 021: RLS policies for admin tables
-- Rollback: DROP POLICY ... on each table; DROP FUNCTION pf_is_internal_user(); ALTER TABLE ... DISABLE ROW LEVEL SECURITY;

-- ── Helper function ───────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION pf_is_internal_user()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM pf_platform_users
    WHERE id = auth.uid()
      AND platform_role IN ('admin', 'staff')
  )
$$;

-- ── pf_specialist_profiles ───────────────────────────────────────────────────

ALTER TABLE pf_specialist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "specialist_profiles_read_internal"
  ON pf_specialist_profiles FOR SELECT
  USING (pf_is_internal_user());

-- Mutations only via service role (admin client)
CREATE POLICY "specialist_profiles_insert_deny"
  ON pf_specialist_profiles FOR INSERT
  WITH CHECK (false);

CREATE POLICY "specialist_profiles_update_deny"
  ON pf_specialist_profiles FOR UPDATE
  USING (false);

CREATE POLICY "specialist_profiles_delete_deny"
  ON pf_specialist_profiles FOR DELETE
  USING (false);

-- ── pf_specialist_services ───────────────────────────────────────────────────

ALTER TABLE pf_specialist_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "specialist_services_read_internal"
  ON pf_specialist_services FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "specialist_services_write_deny"
  ON pf_specialist_services FOR ALL
  USING (false);

-- ── pf_request_status_log ────────────────────────────────────────────────────

ALTER TABLE pf_request_status_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "status_log_read_internal"
  ON pf_request_status_log FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "status_log_write_deny"
  ON pf_request_status_log FOR ALL
  USING (false);

-- ── pf_payment_reconciliation ────────────────────────────────────────────────

ALTER TABLE pf_payment_reconciliation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reconciliation_read_internal"
  ON pf_payment_reconciliation FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "reconciliation_write_deny"
  ON pf_payment_reconciliation FOR ALL
  USING (false);

-- ── pf_analytics_events ──────────────────────────────────────────────────────

ALTER TABLE pf_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_read_internal"
  ON pf_analytics_events FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "analytics_write_deny"
  ON pf_analytics_events FOR ALL
  USING (false);

-- ── pf_catalog_price_history ─────────────────────────────────────────────────

ALTER TABLE pf_catalog_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "price_history_read_internal"
  ON pf_catalog_price_history FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "price_history_write_deny"
  ON pf_catalog_price_history FOR ALL
  USING (false);

-- ── Existing pf_requests — admin can read all ─────────────────────────────────
-- The existing RLS on pf_requests restricts clients to their org.
-- Add a permissive policy for internal users to see all requests.

CREATE POLICY "requests_read_internal"
  ON pf_requests FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "requests_update_internal"
  ON pf_requests FOR UPDATE
  USING (pf_is_internal_user());

CREATE POLICY "requests_insert_internal"
  ON pf_requests FOR INSERT
  WITH CHECK (pf_is_internal_user());

-- ── pf_request_milestones — admin can manage all ──────────────────────────────

CREATE POLICY "milestones_all_internal"
  ON pf_request_milestones FOR ALL
  USING (pf_is_internal_user());

-- ── pf_comments — admin can manage all ───────────────────────────────────────

CREATE POLICY "comments_all_internal"
  ON pf_comments FOR ALL
  USING (pf_is_internal_user());

-- ── pf_documents — admin can manage all ──────────────────────────────────────

CREATE POLICY "documents_all_internal"
  ON pf_documents FOR ALL
  USING (pf_is_internal_user());

-- ── pf_notifications — admin can read all ────────────────────────────────────

CREATE POLICY "notifications_read_internal"
  ON pf_notifications FOR SELECT
  USING (pf_is_internal_user());

CREATE POLICY "notifications_insert_internal"
  ON pf_notifications FOR INSERT
  WITH CHECK (pf_is_internal_user());
