-- =============================================================================
-- ClicKonversion CRM — Migration 003: Indexes, Functions & Seed
-- =============================================================================

-- indexes: companies
CREATE INDEX IF NOT EXISTS idx_companies_org_id        ON companies (organization_id);
CREATE INDEX IF NOT EXISTS idx_companies_domain        ON companies (normalized_domain) WHERE normalized_domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_status        ON companies (lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_companies_created_at    ON companies (created_at DESC);

-- indexes: contacts
CREATE INDEX IF NOT EXISTS idx_contacts_org_id         ON contacts (organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_id     ON contacts (company_id)       WHERE company_id       IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_email          ON contacts (normalized_email) WHERE normalized_email IS NOT NULL;

-- indexes: opportunities
CREATE INDEX IF NOT EXISTS idx_opps_org_id             ON opportunities (organization_id);
CREATE INDEX IF NOT EXISTS idx_opps_stage              ON opportunities (stage);
CREATE INDEX IF NOT EXISTS idx_opps_next_action_at     ON opportunities (next_action_at) WHERE next_action_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_opps_company_id         ON opportunities (company_id);
CREATE INDEX IF NOT EXISTS idx_opps_won_at             ON opportunities (won_at)         WHERE won_at IS NOT NULL;

-- indexes: activities
CREATE INDEX IF NOT EXISTS idx_activities_org_id       ON activities (organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_company_id   ON activities (company_id)      WHERE company_id      IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_activities_opp_id       ON activities (opportunity_id)  WHERE opportunity_id  IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_activities_occurred_at  ON activities (occurred_at DESC);

-- indexes: tasks
CREATE INDEX IF NOT EXISTS idx_tasks_org_id            ON tasks (organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company_id        ON tasks (company_id)       WHERE company_id       IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_due_at            ON tasks (due_at)           WHERE due_at           IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at      ON tasks (completed_at)     WHERE completed_at     IS NULL;

-- indexes: audit_requests
CREATE INDEX IF NOT EXISTS idx_audit_requests_created  ON audit_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_requests_org_id   ON audit_requests (organization_id) WHERE organization_id IS NOT NULL;

-- ===========================================================================
-- FUNCTION: normalize_domain
-- ===========================================================================
CREATE OR REPLACE FUNCTION normalize_domain(url text)
  RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE v_result text;
BEGIN
  v_result := lower(trim(url));
  v_result := regexp_replace(v_result, '^https?://', '');
  v_result := regexp_replace(v_result, '^www\.', '');
  v_result := regexp_replace(v_result, '[/?#].*$', '');
  v_result := trim(v_result);
  IF v_result = '' THEN RETURN NULL; END IF;
  RETURN v_result;
END;
$$;

-- ===========================================================================
-- FUNCTION: normalize_email
-- ===========================================================================
CREATE OR REPLACE FUNCTION normalize_email(email text)
  RETURNS text LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE v_result text;
BEGIN
  v_result := lower(trim(email));
  IF v_result = '' THEN RETURN NULL; END IF;
  RETURN v_result;
END;
$$;

-- ===========================================================================
-- SEED (run manually after first deploy)
-- Replace <YOUR_USER_UUID> with the Supabase auth user UUID of the owner.
-- ===========================================================================
-- DO $$
-- DECLARE
--   v_org_id  uuid := gen_random_uuid();
--   v_user_id uuid := '<YOUR_USER_UUID>';
-- BEGIN
--   INSERT INTO organizations (id, name, slug) VALUES (v_org_id, 'ClicKonversion', 'clickonversion');
--   INSERT INTO organization_members (organization_id, user_id, role) VALUES (v_org_id, v_user_id, 'owner');
--   RAISE NOTICE 'Organization created: % (%)', 'ClicKonversion', v_org_id;
-- END;
-- $$;
