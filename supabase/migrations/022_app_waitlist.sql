-- 022_app_waitlist.sql
-- Stores email signups for the SyncLead (and future apps) waitlist
--
-- ROLLBACK:
--   DROP TABLE IF EXISTS pf_app_waitlist;

CREATE TABLE IF NOT EXISTS pf_app_waitlist (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL,
  app_slug   TEXT        NOT NULL DEFAULT 'synclead',
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT pf_app_waitlist_email_slug UNIQUE (email, app_slug)
);

ALTER TABLE pf_app_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No anon read" ON pf_app_waitlist
  FOR SELECT USING (false);

CREATE POLICY "Service role insert" ON pf_app_waitlist
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_pf_app_waitlist_email ON pf_app_waitlist (email);
CREATE INDEX idx_pf_app_waitlist_slug  ON pf_app_waitlist (app_slug);
