-- Migration 019: Internal analytics events
-- Rollback: DROP TABLE pf_analytics_events;

CREATE TABLE pf_analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name  TEXT NOT NULL,
  user_id     UUID REFERENCES pf_platform_users(id) ON DELETE SET NULL,
  org_id      UUID REFERENCES pf_client_orgs(id) ON DELETE SET NULL,
  order_id    UUID REFERENCES pf_orders(id) ON DELETE SET NULL,
  service_id  UUID REFERENCES pf_service_catalog(id) ON DELETE SET NULL,
  session_id  TEXT,               -- anonymous visitor session (no PII)
  properties  JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_analytics_event_name ON pf_analytics_events(event_name);
CREATE INDEX idx_pf_analytics_created    ON pf_analytics_events(created_at DESC);
CREATE INDEX idx_pf_analytics_org        ON pf_analytics_events(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX idx_pf_analytics_service    ON pf_analytics_events(service_id) WHERE service_id IS NOT NULL;
