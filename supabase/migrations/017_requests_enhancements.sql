-- Migration 017: Extended request statuses, priority & audit log
-- Rollback: DROP TABLE pf_request_status_log; ALTER TABLE pf_requests DROP COLUMN priority, blocked_reason, waiting_info_message, cancelled_at, refunded_at; DROP TYPE request_priority;
--           (Cannot remove enum values from request_status in Postgres — they become inert)

-- ── Extend request_status enum ────────────────────────────────────────────────
-- Existing: pending_onboarding | active | paused | completed | cancelled
-- Adding granular operational statuses

ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'pending_payment';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'queued';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'waiting_client';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'consultation_scheduled';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'waiting_third_party';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'review';
ALTER TYPE request_status ADD VALUE IF NOT EXISTS 'refunded';

-- ── Priority ──────────────────────────────────────────────────────────────────

CREATE TYPE request_priority AS ENUM ('low', 'normal', 'high', 'urgent');

ALTER TABLE pf_requests
  ADD COLUMN priority             request_priority NOT NULL DEFAULT 'normal',
  ADD COLUMN blocked_reason       TEXT,
  ADD COLUMN waiting_info_message TEXT,   -- shown to client when status = waiting_client
  ADD COLUMN cancelled_at         TIMESTAMPTZ,
  ADD COLUMN refunded_at          TIMESTAMPTZ;

CREATE INDEX idx_pf_requests_priority ON pf_requests(priority);

-- ── Status audit log — immutable append-only ──────────────────────────────────

CREATE TABLE pf_request_status_log (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id       UUID NOT NULL REFERENCES pf_requests(id) ON DELETE CASCADE,
  from_status      request_status,                         -- NULL on creation
  to_status        request_status NOT NULL,
  changed_by       UUID REFERENCES pf_platform_users(id),
  changed_by_email TEXT,                                   -- snapshot in case user is deleted
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_status_log_request ON pf_request_status_log(request_id);
CREATE INDEX idx_pf_status_log_created ON pf_request_status_log(created_at DESC);

-- ── Prevent mutation of audit log ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION deny_status_log_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'pf_request_status_log is immutable';
END;
$$;

CREATE TRIGGER trg_deny_status_log_update
  BEFORE UPDATE OR DELETE ON pf_request_status_log
  FOR EACH ROW EXECUTE FUNCTION deny_status_log_update();
