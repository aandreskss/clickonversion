-- Migration 016: Admin roles & specialist profiles
-- Rollback: ALTER TABLE pf_platform_users DROP COLUMN admin_role; DROP TABLE pf_specialist_services, pf_specialist_profiles; ALTER TABLE pf_requests DROP COLUMN assigned_specialist_id; DROP TYPE admin_role;

-- ── Admin role enum ───────────────────────────────────────────────────────────

CREATE TYPE admin_role AS ENUM ('owner', 'admin', 'manager', 'specialist');

-- Add to platform users — NULL for regular clients, set for internal team
ALTER TABLE pf_platform_users
  ADD COLUMN admin_role admin_role;

CREATE INDEX idx_pf_platform_users_admin_role ON pf_platform_users(admin_role)
  WHERE admin_role IS NOT NULL;

-- ── Specialist profiles ───────────────────────────────────────────────────────

CREATE TABLE pf_specialist_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL UNIQUE REFERENCES pf_platform_users(id) ON DELETE CASCADE,
  display_name   TEXT NOT NULL,
  bio            TEXT,
  timezone       TEXT NOT NULL DEFAULT 'America/New_York',
  max_concurrent INTEGER NOT NULL DEFAULT 3 CHECK (max_concurrent > 0),
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_specialist_profiles_user   ON pf_specialist_profiles(user_id);
CREATE INDEX idx_pf_specialist_profiles_active ON pf_specialist_profiles(is_active);

CREATE TRIGGER set_pf_specialist_profiles_updated_at
  BEFORE UPDATE ON pf_specialist_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── Specialist ↔ Service mapping ──────────────────────────────────────────────

CREATE TABLE pf_specialist_services (
  specialist_id UUID NOT NULL REFERENCES pf_specialist_profiles(id) ON DELETE CASCADE,
  service_id    UUID NOT NULL REFERENCES pf_service_catalog(id) ON DELETE CASCADE,
  enabled       BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (specialist_id, service_id)
);

CREATE INDEX idx_pf_specialist_services_service ON pf_specialist_services(service_id);

-- ── Add specialist assignment to requests ──────────────────────────────────────

ALTER TABLE pf_requests
  ADD COLUMN assigned_specialist_id UUID REFERENCES pf_specialist_profiles(id) ON DELETE SET NULL;

CREATE INDEX idx_pf_requests_specialist ON pf_requests(assigned_specialist_id);
