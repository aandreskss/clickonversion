-- Migration 007: Initial service catalog + prices
-- Prices are configurable from the admin panel after seeding.
-- All prices in USD.

-- ── SEO Services ────────────────────────────────────────────────────────────

INSERT INTO pf_service_catalog (slug, category, name_en, name_es, is_published, sort_order)
VALUES
  ('seo-audit',      'seo', 'SEO Audit',          'Auditoría SEO',          true,  10),
  ('technical-seo',  'seo', 'Technical SEO',       'SEO Técnico',            true,  20),
  ('local-seo',      'seo', 'Local SEO',           'SEO Local',              true,  30),
  ('full-seo',       'seo', 'Full SEO',            'SEO Integral',           true,  40),
  ('ecommerce-seo',  'seo', 'Ecommerce SEO',       'SEO Ecommerce',          true,  50),
  ('seo-consulting', 'seo', 'SEO Consulting',      'Consultoría SEO',        true,  60);

-- SEO Audit (ONE_TIME)
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'seo-audit')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'SEO Audit', 'Auditoría SEO', 'ONE_TIME', 120.00, 'one_time', 1);

-- Technical SEO (STARTING_AT)
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'technical-seo')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Technical SEO', 'SEO Técnico', 'STARTING_AT', 250.00, 'one_time', 1);

-- Local SEO (RECURRING — two tiers)
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'local-seo')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES
  ((SELECT id FROM s), 'Starter', 'Starter', 'RECURRING', 180.00, 'monthly', 1),
  ((SELECT id FROM s), 'Growth',  'Growth',  'RECURRING', 350.00, 'monthly', 2);

-- Full SEO (STARTING_AT)
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'full-seo')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 500.00, 'monthly', 1);

-- Ecommerce SEO (STARTING_AT)
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'ecommerce-seo')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 600.00, 'monthly', 1);

-- SEO Consulting (ONE_TIME per session)
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'seo-consulting')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Per session', 'Por sesión', 'ONE_TIME', 70.00, 'one_time', 1);

-- ── Paid Media ───────────────────────────────────────────────────────────────

INSERT INTO pf_service_catalog (slug, category, name_en, name_es, is_published, sort_order)
VALUES
  ('meta-ads',    'paid-media', 'Meta Ads Management',   'Gestión Meta Ads',   true, 10),
  ('google-ads',  'paid-media', 'Google Ads Management', 'Gestión Google Ads', true, 20),
  ('tiktok-ads',  'paid-media', 'TikTok Ads Management', 'Gestión TikTok Ads', true, 30);

-- Meta Ads
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'meta-ads')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES
  ((SELECT id FROM s), 'Starter', 'Starter', 'RECURRING',   150.00, 'monthly', 1),
  ((SELECT id FROM s), 'Growth',  'Growth',  'RECURRING',   250.00, 'monthly', 2),
  ((SELECT id FROM s), 'Scale',   'Scale',   'STARTING_AT', 350.00, 'monthly', 3);

-- Google Ads
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'google-ads')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES
  ((SELECT id FROM s), 'Starter', 'Starter', 'RECURRING',   180.00, 'monthly', 1),
  ((SELECT id FROM s), 'Growth',  'Growth',  'RECURRING',   300.00, 'monthly', 2),
  ((SELECT id FROM s), 'Scale',   'Scale',   'STARTING_AT', 450.00, 'monthly', 3);

-- TikTok Ads
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'tiktok-ads')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES
  ((SELECT id FROM s), 'Starter', 'Starter', 'RECURRING', 180.00, 'monthly', 1),
  ((SELECT id FROM s), 'Growth',  'Growth',  'RECURRING', 300.00, 'monthly', 2);

-- ── Automation ───────────────────────────────────────────────────────────────

INSERT INTO pf_service_catalog (slug, category, name_en, name_es, is_published, sort_order)
VALUES
  ('callbell-setup',    'automation', 'Callbell Setup',       'Configuración Callbell', true, 10),
  ('kommo-setup',       'automation', 'Kommo CRM Setup',      'Configuración Kommo',    true, 20),
  ('wati-setup',        'automation', 'WATI Setup',           'Configuración WATI',     true, 30),
  ('b2chat-setup',      'automation', 'B2Chat Setup',         'Configuración B2Chat',   true, 40),
  ('chatbot-setup',     'automation', 'Custom Chatbot',       'Chatbot Personalizado',  true, 50),
  ('ai-agent',          'automation', 'AI Agent',             'Agente IA',              true, 60),
  ('automation-flows',  'automation', 'Automation Flows',     'Flujos de Automatización', true, 70);

-- Callbell
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'callbell-setup')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 120.00, 'one_time', 1);

-- Kommo
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'kommo-setup')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 180.00, 'one_time', 1);

-- WATI
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'wati-setup')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 150.00, 'one_time', 1);

-- B2Chat
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'b2chat-setup')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 150.00, 'one_time', 1);

-- Chatbot
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'chatbot-setup')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 150.00, 'one_time', 1);

-- AI Agent
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'ai-agent')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 350.00, 'one_time', 1);

-- Automation Flows
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'automation-flows')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 120.00, 'one_time', 1);

-- ── Support / Meta Business ──────────────────────────────────────────────────

INSERT INTO pf_service_catalog (slug, category, name_en, name_es, is_published, sort_order)
VALUES
  ('meta-business-basic',   'support', 'Meta Business Basic',        'Meta Business Básico',       true, 10),
  ('meta-business-adv',     'support', 'Meta Business Specialized',  'Meta Business Especializado', true, 20),
  ('meta-business-block',   'support', 'Account Recovery & WABA',    'Recuperación y WABA',        true, 30),
  ('meta-business-setup',   'support', 'Meta Business Full Setup',   'Configuración Meta Business', true, 40);

-- Basic
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'meta-business-basic')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Basic advisory', 'Asesoría básica', 'ONE_TIME', 60.00, 'one_time', 1);

-- Advanced
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'meta-business-adv')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Specialized advisory', 'Asesoría especializada', 'ONE_TIME', 70.00, 'one_time', 1);

-- Account recovery / WABA
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'meta-business-block')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 90.00, 'one_time', 1);

-- Full setup
WITH s AS (SELECT id FROM pf_service_catalog WHERE slug = 'meta-business-setup')
INSERT INTO pf_service_prices (service_id, name_en, name_es, price_type, base_price_usd, billing_period_val, sort_order)
VALUES ((SELECT id FROM s), 'Starting at', 'Desde', 'STARTING_AT', 100.00, 'one_time', 1);
