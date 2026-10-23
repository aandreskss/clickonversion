-- Migration 008: Meetings, booking rights, onboarding responses
-- Rollback: DROP TABLE pf_onboarding_responses, pf_meetings, pf_booking_rights;
--           DROP TYPE meeting_status, booking_right_status;
--           ALTER TABLE pf_service_prices DROP COLUMN creates_booking_right, DROP COLUMN booking_meeting_type_slug;

-- ── Extend service prices to flag advisory sessions ──────────────────────────
ALTER TABLE pf_service_prices
  ADD COLUMN creates_booking_right    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN booking_meeting_type_slug TEXT;

-- Mark the advisory/consulting prices that create booking rights
-- (slugs match config.ts MEETING_TYPES keys)
UPDATE pf_service_prices p
SET creates_booking_right = true,
    booking_meeting_type_slug = CASE
      WHEN sc.slug = 'meta-business-basic' THEN 'meta-advisory-basic'
      WHEN sc.slug = 'meta-business-adv'   THEN 'meta-advisory-specialized'
      WHEN sc.slug = 'seo-consulting'      THEN 'discovery'
      ELSE NULL
    END
FROM pf_service_catalog sc
WHERE p.service_id = sc.id
  AND sc.slug IN ('meta-business-basic', 'meta-business-adv', 'seo-consulting');

-- ── Booking rights (one per advisory purchase) ───────────────────────────────
CREATE TYPE booking_right_status AS ENUM ('unused', 'reserved', 'used', 'expired', 'cancelled');

CREATE TABLE pf_booking_rights (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES pf_orders(id),
  order_item_id         UUID NOT NULL REFERENCES pf_order_items(id),
  service_id            UUID NOT NULL REFERENCES pf_service_catalog(id),
  meeting_type_slug     TEXT NOT NULL,
  client_email          TEXT NOT NULL,
  client_name           TEXT NOT NULL,
  token                 TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  status                booking_right_status NOT NULL DEFAULT 'unused',
  max_uses              INTEGER NOT NULL DEFAULT 1,
  uses_count            INTEGER NOT NULL DEFAULT 0,
  meeting_id            UUID,   -- filled when booking is confirmed
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '90 days'),
  used_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uses_within_max CHECK (uses_count <= max_uses)
);

CREATE TRIGGER trg_pf_booking_rights_updated_at
  BEFORE UPDATE ON pf_booking_rights
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Meetings ─────────────────────────────────────────────────────────────────
CREATE TYPE meeting_status AS ENUM (
  'pending',     -- pre-form submitted, Cal.com embed shown, booking not yet confirmed
  'scheduled',   -- confirmed in Cal.com
  'rescheduled', -- moved to a different time
  'cancelled',   -- client or specialist cancelled
  'completed',   -- call took place
  'no_show'      -- client did not attend
);

CREATE TABLE pf_meetings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_right_id      UUID REFERENCES pf_booking_rights(id),   -- NULL = free/included call
  order_id              UUID REFERENCES pf_orders(id),
  meeting_type_slug     TEXT NOT NULL,
  calcom_booking_uid    TEXT UNIQUE,                              -- Cal.com booking UID
  calcom_event_type_id  INTEGER,
  client_email          TEXT NOT NULL,
  client_name           TEXT NOT NULL,
  client_timezone       TEXT,                                     -- IANA tz from Cal.com
  specialist_email      TEXT,
  start_time            TIMESTAMPTZ,
  end_time              TIMESTAMPTZ,
  video_call_url        TEXT,
  status                meeting_status NOT NULL DEFAULT 'pending',
  pre_brief_data        JSONB NOT NULL DEFAULT '{}',              -- pre-booking form answers
  cancellation_reason   TEXT,
  rescheduled_from_id   UUID REFERENCES pf_meetings(id),
  calcom_payload        JSONB,                                    -- raw webhook payload
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_pf_meetings_updated_at
  BEFORE UPDATE ON pf_meetings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- FK from booking rights back to meetings
ALTER TABLE pf_booking_rights
  ADD CONSTRAINT fk_booking_rights_meeting
  FOREIGN KEY (meeting_id) REFERENCES pf_meetings(id);

-- ── Onboarding responses (post-purchase service intake) ──────────────────────
CREATE TYPE onboarding_status AS ENUM ('pending', 'submitted', 'reviewed', 'complete');

CREATE TABLE pf_onboarding_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES pf_orders(id),
  order_item_id UUID REFERENCES pf_order_items(id),
  service_id    UUID NOT NULL REFERENCES pf_service_catalog(id),
  client_email  TEXT NOT NULL,
  responses     JSONB NOT NULL DEFAULT '{}',
  status        onboarding_status NOT NULL DEFAULT 'pending',
  submitted_at  TIMESTAMPTZ,
  reviewed_at   TIMESTAMPTZ,
  reviewed_by   TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_pf_onboarding_responses_updated_at
  BEFORE UPDATE ON pf_onboarding_responses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_pf_booking_rights_token       ON pf_booking_rights(token);
CREATE INDEX idx_pf_booking_rights_order       ON pf_booking_rights(order_id);
CREATE INDEX idx_pf_booking_rights_email       ON pf_booking_rights(client_email);
CREATE INDEX idx_pf_booking_rights_status      ON pf_booking_rights(status);
CREATE INDEX idx_pf_meetings_calcom_uid        ON pf_meetings(calcom_booking_uid);
CREATE INDEX idx_pf_meetings_client_email      ON pf_meetings(client_email);
CREATE INDEX idx_pf_meetings_type_status       ON pf_meetings(meeting_type_slug, status);
CREATE INDEX idx_pf_meetings_start_time        ON pf_meetings(start_time);
CREATE INDEX idx_pf_onboarding_order           ON pf_onboarding_responses(order_id);
CREATE INDEX idx_pf_onboarding_status          ON pf_onboarding_responses(status);
