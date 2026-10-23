-- Migration 012: Client requests, milestones & comments
-- Rollback: DROP TABLE pf_comments, pf_request_milestones, pf_requests CASCADE;

CREATE TYPE request_status    AS ENUM ('pending_onboarding', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE milestone_status  AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- ── Requests ─────────────────────────────────────────────────────────────────
-- One per purchased service (order item). Created when client links their org.

CREATE TABLE pf_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            UUID NOT NULL REFERENCES pf_client_orgs(id) ON DELETE CASCADE,
  order_id          UUID REFERENCES pf_orders(id),
  order_item_id     UUID REFERENCES pf_order_items(id),
  service_id        UUID REFERENCES pf_service_catalog(id),
  service_name      TEXT NOT NULL,                     -- snapshot from order
  scope             TEXT,                              -- contracted scope description
  status            request_status NOT NULL DEFAULT 'pending_onboarding',
  specialist_email  TEXT,
  estimated_start   DATE,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  internal_notes    TEXT,                              -- NEVER exposed to client
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_requests_org    ON pf_requests(org_id);
CREATE INDEX idx_pf_requests_order  ON pf_requests(order_id);
CREATE INDEX idx_pf_requests_status ON pf_requests(status);

-- ── Milestones ────────────────────────────────────────────────────────────────

CREATE TABLE pf_request_milestones (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id       UUID NOT NULL REFERENCES pf_requests(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  is_client_visible BOOLEAN NOT NULL DEFAULT TRUE,
  status           milestone_status NOT NULL DEFAULT 'pending',
  due_date         DATE,
  completed_at     TIMESTAMPTZ,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_milestones_request ON pf_request_milestones(request_id);

-- ── Comments ──────────────────────────────────────────────────────────────────

CREATE TABLE pf_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id  UUID NOT NULL REFERENCES pf_requests(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES pf_platform_users(id),
  author_role TEXT NOT NULL CHECK (author_role IN ('client', 'staff', 'admin')),
  body        TEXT NOT NULL CHECK (length(trim(body)) > 0),
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,   -- internal: staff only, never shown to client
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_comments_request ON pf_comments(request_id);
CREATE INDEX idx_pf_comments_author  ON pf_comments(author_id);

-- ── Triggers ─────────────────────────────────────────────────────────────────

CREATE TRIGGER set_pf_requests_updated_at
  BEFORE UPDATE ON pf_requests
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_pf_milestones_updated_at
  BEFORE UPDATE ON pf_request_milestones
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_pf_comments_updated_at
  BEFORE UPDATE ON pf_comments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
