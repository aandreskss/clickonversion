-- Migration 014: In-app notifications
-- Rollback: DROP TABLE pf_notifications CASCADE;

CREATE TABLE pf_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES pf_platform_users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,                 -- e.g. 'new_comment', 'milestone_completed', 'document_uploaded'
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  link        TEXT,                          -- e.g. /portal/requests/[id]
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  entity_type TEXT,                          -- 'request' | 'document' | 'milestone'
  entity_id   UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_notifications_user     ON pf_notifications(user_id);
CREATE INDEX idx_pf_notifications_unread   ON pf_notifications(user_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_pf_notifications_created  ON pf_notifications(created_at DESC);
