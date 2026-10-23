-- Migration 011: Client organizations, memberships & invitations
-- Rollback: DROP TABLE pf_org_invitations, pf_org_members, pf_client_orgs CASCADE;

CREATE TYPE org_member_role   AS ENUM ('owner', 'admin', 'member');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- ── Client organizations ─────────────────────────────────────────────────────

CREATE TABLE pf_client_orgs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  logo_url           TEXT,
  billing_email      TEXT,
  stripe_customer_id TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_pf_client_orgs_slug   ON pf_client_orgs(slug);
CREATE INDEX        idx_pf_client_orgs_billing ON pf_client_orgs(billing_email);

-- ── Memberships ──────────────────────────────────────────────────────────────

CREATE TABLE pf_org_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES pf_client_orgs(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES pf_platform_users(id) ON DELETE CASCADE,
  role        org_member_role NOT NULL DEFAULT 'member',
  invited_by  UUID REFERENCES pf_platform_users(id),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

CREATE INDEX idx_pf_org_members_org    ON pf_org_members(org_id);
CREATE INDEX idx_pf_org_members_user   ON pf_org_members(user_id);

-- ── Invitations ──────────────────────────────────────────────────────────────

CREATE TABLE pf_org_invitations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID NOT NULL REFERENCES pf_client_orgs(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  role         org_member_role NOT NULL DEFAULT 'member',
  token        TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  invited_by   UUID REFERENCES pf_platform_users(id),
  status       invitation_status NOT NULL DEFAULT 'pending',
  accepted_at  TIMESTAMPTZ,
  expires_at   TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_org_invitations_org   ON pf_org_invitations(org_id);
CREATE INDEX idx_pf_org_invitations_email ON pf_org_invitations(email);
CREATE INDEX idx_pf_org_invitations_token ON pf_org_invitations(token);

-- ── RLS helpers ──────────────────────────────────────────────────────────────
-- Used in RLS policies across multiple tables

CREATE OR REPLACE FUNCTION pf_user_org_ids()
RETURNS SETOF UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT org_id FROM pf_org_members WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION pf_is_org_member(p_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM pf_org_members WHERE org_id = p_org_id AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION pf_is_org_admin(p_org_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM pf_org_members
    WHERE org_id = p_org_id AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
$$;

-- ── Triggers ─────────────────────────────────────────────────────────────────

CREATE TRIGGER set_pf_client_orgs_updated_at
  BEFORE UPDATE ON pf_client_orgs
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
