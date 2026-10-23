-- Migration 013: Document storage metadata
-- Rollback: DROP TABLE pf_documents CASCADE; DELETE FROM storage.buckets WHERE id = 'portal-docs';

CREATE TYPE document_category AS ENUM ('deliverable', 'attachment', 'contract', 'report', 'other');

-- ── Storage bucket ────────────────────────────────────────────────────────────
-- Private bucket — all access via signed URLs generated server-side

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portal-docs',
  'portal-docs',
  FALSE,
  52428800,  -- 50 MB
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/zip'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ── Document metadata ─────────────────────────────────────────────────────────

CREATE TABLE pf_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            UUID NOT NULL REFERENCES pf_client_orgs(id) ON DELETE CASCADE,
  request_id        UUID REFERENCES pf_requests(id) ON DELETE SET NULL,
  storage_path      TEXT NOT NULL,           -- path in portal-docs bucket: {org_id}/{doc_id}/{filename}
  file_name         TEXT NOT NULL,
  file_size_bytes   BIGINT NOT NULL,
  mime_type         TEXT NOT NULL,
  uploaded_by       UUID NOT NULL REFERENCES pf_platform_users(id),
  is_client_visible BOOLEAN NOT NULL DEFAULT TRUE,
  category          document_category NOT NULL DEFAULT 'other',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_documents_org     ON pf_documents(org_id);
CREATE INDEX idx_pf_documents_request ON pf_documents(request_id);

-- ── Storage RLS ───────────────────────────────────────────────────────────────
-- Objects in portal-docs bucket are only accessible to org members

CREATE POLICY "portal_docs_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'portal-docs'
    AND pf_is_org_member(
      (SELECT org_id FROM pf_documents WHERE storage_path = name LIMIT 1)
    )
  );

CREATE POLICY "portal_docs_service_role"
  ON storage.objects FOR ALL
  USING (bucket_id = 'portal-docs' AND auth.role() = 'service_role');
