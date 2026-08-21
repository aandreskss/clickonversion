-- =============================================================================
-- ClicKonversion CRM — Migration 001: Initial Schema
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ===========================================================================
-- organizations
-- ===========================================================================
CREATE TABLE IF NOT EXISTS organizations (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  slug       text        NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ===========================================================================
-- organization_members
-- ===========================================================================
CREATE TABLE IF NOT EXISTS organization_members (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id)    ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('owner','admin','member')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

-- ===========================================================================
-- companies
-- ===========================================================================
CREATE TABLE IF NOT EXISTS companies (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name                 text        NOT NULL,
  normalized_name      text,
  website              text,
  normalized_domain    text,
  phone                text,
  industry             text,
  city                 text,
  state                text,
  country              text        NOT NULL DEFAULT 'US',
  source               text,
  lifecycle_status     text        NOT NULL DEFAULT 'prospect'
                         CHECK (lifecycle_status IN ('prospect','active_client','past_client','disqualified')),
  google_reviews_count int,
  notes_summary        text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ===========================================================================
-- contacts
-- ===========================================================================
CREATE TABLE IF NOT EXISTS contacts (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id       uuid        REFERENCES companies(id) ON DELETE SET NULL,
  first_name       text        NOT NULL,
  last_name        text,
  job_title        text,
  email            text,
  normalized_email text,
  phone            text,
  linkedin_url     text,
  instagram_url    text,
  is_primary       boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER set_contacts_updated_at
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ===========================================================================
-- opportunities
-- ===========================================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id          uuid        NOT NULL REFERENCES companies(id)     ON DELETE CASCADE,
  primary_contact_id  uuid        REFERENCES contacts(id)               ON DELETE SET NULL,
  name                text        NOT NULL,
  service             text,
  stage               text        NOT NULL DEFAULT 'NEW'
                        CHECK (stage IN ('NEW','QUALIFIED','CONTACTED','REPLIED','AUDIT_SENT','CALL_BOOKED','PROPOSAL','WON','LOST','NURTURE')),
  source              text,
  estimated_value     numeric(12,2),
  mrr_value           numeric(12,2),
  probability         int         CHECK (probability BETWEEN 0 AND 100),
  first_contacted_at  timestamptz,
  last_contacted_at   timestamptz,
  next_action         text,
  next_action_at      timestamptz,
  audit_url           text,
  loom_url            text,
  proposal_url        text,
  proposal_sent_at    timestamptz,
  expected_close_date date,
  won_at              timestamptz,
  lost_at             timestamptz,
  lost_reason         text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER set_opportunities_updated_at
  BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ===========================================================================
-- activities
-- ===========================================================================
CREATE TABLE IF NOT EXISTS activities (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id       uuid        REFERENCES companies(id)     ON DELETE SET NULL,
  contact_id       uuid        REFERENCES contacts(id)      ON DELETE SET NULL,
  opportunity_id   uuid        REFERENCES opportunities(id) ON DELETE SET NULL,
  activity_type    text        NOT NULL
                    CHECK (activity_type IN ('note','email','call','linkedin','instagram','loom','audit','meeting','proposal','system')),
  title            text        NOT NULL,
  body             text,
  occurred_at      timestamptz NOT NULL DEFAULT now(),
  created_by       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ===========================================================================
-- tasks
-- ===========================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id       uuid        REFERENCES companies(id)     ON DELETE SET NULL,
  opportunity_id   uuid        REFERENCES opportunities(id) ON DELETE SET NULL,
  title            text        NOT NULL,
  description      text,
  due_at           timestamptz,
  completed_at     timestamptz,
  priority         text        NOT NULL DEFAULT 'normal'
                    CHECK (priority IN ('low','normal','high')),
  assigned_to      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ===========================================================================
-- audit_requests  (public lead-capture)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS audit_requests (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid        REFERENCES organizations(id) ON DELETE SET NULL,
  first_name          text        NOT NULL,
  work_email          text        NOT NULL,
  company_name        text        NOT NULL,
  website_url         text        NOT NULL,
  main_service        text        NOT NULL,
  city                text        NOT NULL,
  primary_goal        text        NOT NULL,
  phone               text,
  budget_range        text,
  current_challenge   text,
  utm_source          text,
  utm_medium          text,
  utm_campaign        text,
  utm_content         text,
  utm_term            text,
  landing_page        text,
  referrer            text,
  honeypot_triggered  boolean     NOT NULL DEFAULT false,
  company_id          uuid        REFERENCES companies(id)     ON DELETE SET NULL,
  contact_id          uuid        REFERENCES contacts(id)      ON DELETE SET NULL,
  opportunity_id      uuid        REFERENCES opportunities(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ===========================================================================
-- prospect_research
-- ===========================================================================
CREATE TABLE IF NOT EXISTS prospect_research (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id        uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  company_id             uuid        NOT NULL UNIQUE REFERENCES companies(id) ON DELETE CASCADE,
  seo_issues             text,
  google_business_issues text,
  ads_issues             text,
  website_issues         text,
  conversion_issues      text,
  opportunity_summary    text,
  personalization_notes  text,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER set_prospect_research_updated_at
  BEFORE UPDATE ON prospect_research FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
