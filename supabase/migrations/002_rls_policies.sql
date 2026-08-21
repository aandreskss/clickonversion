-- =============================================================================
-- ClicKonversion CRM — Migration 002: Row Level Security
-- =============================================================================

CREATE OR REPLACE FUNCTION is_org_member(org_id uuid)
  RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = org_id AND om.user_id = auth.uid()
  );
$$;

ALTER TABLE organizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_research    ENABLE ROW LEVEL SECURITY;

-- organizations
CREATE POLICY "organizations: members can select" ON organizations FOR SELECT TO authenticated USING (is_org_member(id));
CREATE POLICY "organizations: members can update" ON organizations FOR UPDATE TO authenticated USING (is_org_member(id));

-- organization_members
CREATE POLICY "org_members: select" ON organization_members FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_org_member(organization_id));
CREATE POLICY "org_members: insert" ON organization_members FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "org_members: delete" ON organization_members FOR DELETE TO authenticated USING (is_org_member(organization_id));

-- companies
CREATE POLICY "companies: select" ON companies FOR SELECT TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "companies: insert" ON companies FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "companies: update" ON companies FOR UPDATE TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "companies: delete" ON companies FOR DELETE TO authenticated USING (is_org_member(organization_id));

-- contacts
CREATE POLICY "contacts: select" ON contacts FOR SELECT TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "contacts: insert" ON contacts FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "contacts: update" ON contacts FOR UPDATE TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "contacts: delete" ON contacts FOR DELETE TO authenticated USING (is_org_member(organization_id));

-- opportunities
CREATE POLICY "opportunities: select" ON opportunities FOR SELECT TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "opportunities: insert" ON opportunities FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "opportunities: update" ON opportunities FOR UPDATE TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "opportunities: delete" ON opportunities FOR DELETE TO authenticated USING (is_org_member(organization_id));

-- activities
CREATE POLICY "activities: select" ON activities FOR SELECT TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "activities: insert" ON activities FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "activities: update" ON activities FOR UPDATE TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "activities: delete" ON activities FOR DELETE TO authenticated USING (is_org_member(organization_id));

-- tasks
CREATE POLICY "tasks: select" ON tasks FOR SELECT TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "tasks: insert" ON tasks FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "tasks: update" ON tasks FOR UPDATE TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "tasks: delete" ON tasks FOR DELETE TO authenticated USING (is_org_member(organization_id));

-- audit_requests: public INSERT (lead form), restricted read
CREATE POLICY "audit_requests: public insert" ON audit_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "audit_requests: org members select" ON audit_requests FOR SELECT TO authenticated USING (organization_id IS NULL OR is_org_member(organization_id));
CREATE POLICY "audit_requests: org members update" ON audit_requests FOR UPDATE TO authenticated USING (organization_id IS NULL OR is_org_member(organization_id));

-- prospect_research
CREATE POLICY "prospect_research: select" ON prospect_research FOR SELECT TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "prospect_research: insert" ON prospect_research FOR INSERT TO authenticated WITH CHECK (is_org_member(organization_id));
CREATE POLICY "prospect_research: update" ON prospect_research FOR UPDATE TO authenticated USING (is_org_member(organization_id));
CREATE POLICY "prospect_research: delete" ON prospect_research FOR DELETE TO authenticated USING (is_org_member(organization_id));
