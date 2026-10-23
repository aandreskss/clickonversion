-- Migration 009: RLS policies for meetings, booking rights, onboarding
-- Rollback: DROP POLICY ... (reverse of all policies below)

ALTER TABLE pf_booking_rights         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_meetings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE pf_onboarding_responses   ENABLE ROW LEVEL SECURITY;

-- ── Booking rights ──────────────────────────────────────────────────────────
-- Public: validate a token (read-only, filtered to relevant fields via API route)
-- We do NOT expose the full row publicly — the API route uses admin client and
-- returns only what's needed.

CREATE POLICY "booking_rights: service_role all"
  ON pf_booking_rights FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "booking_rights: owner read"
  ON pf_booking_rights FOR SELECT
  USING (
    client_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
    OR auth.role() = 'service_role'
  );

-- ── Meetings ─────────────────────────────────────────────────────────────────
-- Free call booking: public insert (API route validates limits before writing)
CREATE POLICY "meetings: public insert"
  ON pf_meetings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "meetings: owner read"
  ON pf_meetings FOR SELECT
  USING (
    client_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
    OR auth.role() = 'service_role'
  );

CREATE POLICY "meetings: service_role update"
  ON pf_meetings FOR UPDATE
  USING (auth.role() = 'service_role');

-- ── Onboarding responses ─────────────────────────────────────────────────────
CREATE POLICY "onboarding: public insert"
  ON pf_onboarding_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "onboarding: owner read"
  ON pf_onboarding_responses FOR SELECT
  USING (
    client_email = current_setting('request.jwt.claims', true)::jsonb->>'email'
    OR auth.role() = 'service_role'
  );

CREATE POLICY "onboarding: service_role update"
  ON pf_onboarding_responses FOR UPDATE
  USING (auth.role() = 'service_role');
