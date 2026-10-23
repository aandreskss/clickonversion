-- Migration 015: RLS policies for all portal tables
-- Rollback: DROP POLICY ... (reverse of all policies below)

-- ── pf_platform_users ────────────────────────────────────────────────────────

ALTER TABLE pf_platform_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_users: self read"
  ON pf_platform_users FOR SELECT
  USING (id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "platform_users: self update"
  ON pf_platform_users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "platform_users: service_role all"
  ON pf_platform_users FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_client_orgs ───────────────────────────────────────────────────────────

ALTER TABLE pf_client_orgs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_orgs: member read"
  ON pf_client_orgs FOR SELECT
  USING (id IN (SELECT pf_user_org_ids()) OR auth.role() = 'service_role');

CREATE POLICY "client_orgs: admin update"
  ON pf_client_orgs FOR UPDATE
  USING (pf_is_org_admin(id) OR auth.role() = 'service_role');

CREATE POLICY "client_orgs: service_role insert"
  ON pf_client_orgs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ── pf_org_members ───────────────────────────────────────────────────────────

ALTER TABLE pf_org_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members: member read"
  ON pf_org_members FOR SELECT
  USING (org_id IN (SELECT pf_user_org_ids()) OR auth.role() = 'service_role');

CREATE POLICY "org_members: service_role write"
  ON pf_org_members FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_org_invitations ───────────────────────────────────────────────────────

ALTER TABLE pf_org_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_invitations: admin read"
  ON pf_org_invitations FOR SELECT
  USING (pf_is_org_admin(org_id) OR auth.role() = 'service_role');

CREATE POLICY "org_invitations: service_role write"
  ON pf_org_invitations FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_requests ──────────────────────────────────────────────────────────────

ALTER TABLE pf_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "requests: org member read"
  ON pf_requests FOR SELECT
  USING (org_id IN (SELECT pf_user_org_ids()) OR auth.role() = 'service_role');

CREATE POLICY "requests: service_role write"
  ON pf_requests FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_request_milestones ────────────────────────────────────────────────────

ALTER TABLE pf_request_milestones ENABLE ROW LEVEL SECURITY;

-- Clients only see visible milestones; staff sees all
CREATE POLICY "milestones: org member read"
  ON pf_request_milestones FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR (
      is_client_visible = TRUE
      AND request_id IN (
        SELECT id FROM pf_requests WHERE org_id IN (SELECT pf_user_org_ids())
      )
    )
  );

CREATE POLICY "milestones: service_role write"
  ON pf_request_milestones FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_comments ──────────────────────────────────────────────────────────────

ALTER TABLE pf_comments ENABLE ROW LEVEL SECURITY;

-- Clients see only non-internal comments on their org's requests
CREATE POLICY "comments: org member read"
  ON pf_comments FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR (
      is_internal = FALSE
      AND request_id IN (
        SELECT id FROM pf_requests WHERE org_id IN (SELECT pf_user_org_ids())
      )
    )
  );

-- Clients can post comments on their org's requests
CREATE POLICY "comments: org member insert"
  ON pf_comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND is_internal = FALSE
    AND request_id IN (
      SELECT id FROM pf_requests WHERE org_id IN (SELECT pf_user_org_ids())
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "comments: service_role all"
  ON pf_comments FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_documents ─────────────────────────────────────────────────────────────

ALTER TABLE pf_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents: org member read"
  ON pf_documents FOR SELECT
  USING (
    (is_client_visible = TRUE AND org_id IN (SELECT pf_user_org_ids()))
    OR auth.role() = 'service_role'
  );

CREATE POLICY "documents: org member insert"
  ON pf_documents FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND org_id IN (SELECT pf_user_org_ids())
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "documents: service_role all"
  ON pf_documents FOR ALL
  USING (auth.role() = 'service_role');

-- ── pf_notifications ─────────────────────────────────────────────────────────

ALTER TABLE pf_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: owner read"
  ON pf_notifications FOR SELECT
  USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "notifications: owner update"
  ON pf_notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "notifications: service_role insert"
  ON pf_notifications FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
