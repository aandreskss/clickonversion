-- Migration 010: Platform users & roles
-- Rollback: DROP TRIGGER on_auth_user_created ON auth.users; DROP FUNCTION handle_new_user(); DROP TABLE pf_platform_users;

CREATE TYPE platform_role AS ENUM ('admin', 'staff', 'client');

CREATE TABLE pf_platform_users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  platform_role   platform_role NOT NULL DEFAULT 'client',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pf_platform_users_email ON pf_platform_users(email);
CREATE INDEX idx_pf_platform_users_role  ON pf_platform_users(platform_role);

-- Auto-populate on new Supabase auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO pf_platform_users (id, email, full_name, platform_role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE TRIGGER set_pf_platform_users_updated_at
  BEFORE UPDATE ON pf_platform_users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
