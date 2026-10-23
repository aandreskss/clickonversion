# ClicKonversion — Esquema de Base de Datos (Fase 1)

> Estado: Borrador para aprobación · Actualizado: 2026-10-21

---

## Estrategia

El proyecto usa **dos capas de acceso a datos** sobre el mismo Postgres de Supabase:

| Capa | Tablas | Herramienta | Migración |
|------|--------|------------|-----------|
| CRM interno (existente) | 9 tablas del pipeline de ventas | `@supabase/supabase-js` + RLS | `supabase/migrations/` |
| Plataforma (nuevo) | 18 tablas del producto comercial | Drizzle ORM | `drizzle/migrations/` |

Las tablas de plataforma viven en el mismo schema `public` pero con el prefijo `pf_` para evitar conflictos y facilitar distinción.

---

## Tablas existentes (CRM — no modificar)

```
organizations              organization_members
companies                  contacts
opportunities              activities
tasks                      audit_requests
prospect_research
```

Ver migraciones en `supabase/migrations/001_init_schema.sql` y siguientes.

---

## Tablas de plataforma (nuevas — Drizzle)

### Diagrama de relaciones

```
auth.users (Supabase)
    │
    ├─── pf_platform_users (1:1) — rol de plataforma
    │
    └─── pf_client_org_members (n) ──── pf_client_orgs (1)
                                             │
                    ┌────────────────────────┼─────────────────────────┐
                    │                        │                         │
             pf_orders (n)          pf_projects (n)         pf_meetings (n)
                    │
         pf_order_items (n) ──── pf_services (1)
                    │
         pf_subscriptions ──── pf_services (1)
                    │
         pf_stripe_customers ──── auth.users (1)
                    │
         pf_webhook_events (log)
```

---

### `pf_platform_users`
Extiende `auth.users` con el rol de plataforma.

```sql
CREATE TABLE pf_platform_users (
  user_id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_role  text NOT NULL DEFAULT 'client'
                 CHECK (platform_role IN ('admin', 'staff', 'client')),
  full_name      text,
  avatar_url     text,
  locale         text NOT NULL DEFAULT 'en'
                 CHECK (locale IN ('en', 'es')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

---

### `pf_client_orgs`
Organizaciones de clientes (compradoras de servicios).

```sql
CREATE TABLE pf_client_orgs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name             text NOT NULL,
  industry         text,
  country          text NOT NULL DEFAULT 'US',
  timezone         text NOT NULL DEFAULT 'America/New_York',
  logo_url         text,
  billing_email    text NOT NULL,
  billing_address  jsonb,      -- {line1, line2, city, state, postal_code, country}
  tax_id           text,
  stripe_customer_id text UNIQUE,
  paypal_payer_id  text,
  status           text NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

---

### `pf_client_org_members`
Membresías usuario ↔ organización cliente.

```sql
CREATE TABLE pf_client_org_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES pf_client_orgs(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            text NOT NULL DEFAULT 'member'
                  CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by      uuid REFERENCES auth.users(id),
  joined_at       timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);
```

---

### `pf_services`
Catálogo de servicios ofrecidos por ClicKonversion.

```sql
CREATE TABLE pf_services (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text UNIQUE NOT NULL,
  type                  text NOT NULL
                        CHECK (type IN ('one_time', 'recurring', 'quote')),
  status                text NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('active', 'draft', 'archived')),
  category              text,           -- 'seo', 'ads', 'cro', 'crm', 'analytics', 'bundle'
  name_en               text NOT NULL,
  name_es               text NOT NULL,
  short_description_en  text,
  short_description_es  text,
  features_en           jsonb,          -- ["Feature 1", "Feature 2"]
  features_es           jsonb,
  deliverables_en       jsonb,
  deliverables_es       jsonb,
  base_price_usd        numeric(10,2),  -- NULL para type='quote'
  billing_interval      text
                        CHECK (billing_interval IN ('monthly', 'quarterly', 'annual')),
  stripe_product_id     text,
  stripe_price_id       text,           -- para recurring
  sort_order            integer NOT NULL DEFAULT 0,
  is_featured           boolean NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
```

---

### `pf_saas_products`
Catálogo de aplicaciones SaaS (SyncLead, futuras).

```sql
CREATE TABLE pf_saas_products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  name             text NOT NULL,
  tagline_en       text,
  tagline_es       text,
  description_en   text,
  description_es   text,
  logo_url         text,
  status           text NOT NULL DEFAULT 'coming_soon'
                   CHECK (status IN ('active', 'coming_soon', 'archived')),
  external_url     text,          -- URL de la app (ej: synclead.app)
  plans            jsonb,         -- [{name, price_usd, features, stripe_price_id}]
  category         text,
  sort_order       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

---

### `pf_carts`
Carritos de compra (persistidos, para abandono de carrito).

```sql
CREATE TABLE pf_carts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id  text,           -- para usuarios no autenticados
  items       jsonb NOT NULL DEFAULT '[]',
              -- [{service_id, name_snapshot, price_usd_snapshot, quantity, type}]
  currency    text NOT NULL DEFAULT 'USD',
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX ON pf_carts(session_id) WHERE session_id IS NOT NULL;
```

---

### `pf_orders`
Pedidos confirmados.

```sql
CREATE TABLE pf_orders (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number            text UNIQUE NOT NULL,  -- CKV-2026-0001
  client_org_id           uuid REFERENCES pf_client_orgs(id),
  user_id                 uuid NOT NULL REFERENCES auth.users(id),
  status                  text NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','processing','completed','cancelled','refunded')),
  payment_method          text NOT NULL
                          CHECK (payment_method IN ('stripe','paypal','bank_transfer','quote')),
  payment_status          text NOT NULL DEFAULT 'pending'
                          CHECK (payment_status IN ('pending','paid','failed','refunded','partial_refund')),
  currency                text NOT NULL DEFAULT 'USD',
  subtotal_usd            numeric(10,2) NOT NULL,
  discount_usd            numeric(10,2) NOT NULL DEFAULT 0,
  tax_usd                 numeric(10,2) NOT NULL DEFAULT 0,
  total_usd               numeric(10,2) NOT NULL,
  stripe_payment_intent_id text UNIQUE,
  stripe_invoice_id        text,
  paypal_order_id          text UNIQUE,
  billing_address          jsonb,
  notes                    text,
  paid_at                  timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_orders(client_org_id);
CREATE INDEX ON pf_orders(user_id);
CREATE INDEX ON pf_orders(status);
CREATE INDEX ON pf_orders(created_at DESC);
```

---

### `pf_order_items`
Líneas de un pedido.

```sql
CREATE TABLE pf_order_items (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             uuid NOT NULL REFERENCES pf_orders(id) ON DELETE CASCADE,
  service_id           uuid REFERENCES pf_services(id) ON DELETE SET NULL,
  name_snapshot        text NOT NULL,
  description_snapshot text,
  price_usd_snapshot   numeric(10,2) NOT NULL,
  quantity             integer NOT NULL DEFAULT 1,
  total_usd            numeric(10,2) NOT NULL,
  metadata             jsonb,
  created_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_order_items(order_id);
```

---

### `pf_subscriptions`
Suscripciones activas (gestionadas por Stripe).

```sql
CREATE TABLE pf_subscriptions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id          uuid REFERENCES pf_client_orgs(id),
  user_id                uuid NOT NULL REFERENCES auth.users(id),
  service_id             uuid REFERENCES pf_services(id),
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id     text NOT NULL,
  status                 text NOT NULL
                         CHECK (status IN ('trialing','active','past_due','cancelled','unpaid','incomplete')),
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean NOT NULL DEFAULT false,
  cancelled_at           timestamptz,
  trial_end              timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_subscriptions(client_org_id);
CREATE INDEX ON pf_subscriptions(stripe_subscription_id);
```

---

### `pf_quote_requests`
Solicitudes de cotización para servicios `type='quote'`.

```sql
CREATE TABLE pf_quote_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id    uuid REFERENCES pf_client_orgs(id),
  user_id          uuid REFERENCES auth.users(id),
  service_id       uuid REFERENCES pf_services(id),
  details          jsonb NOT NULL DEFAULT '{}',  -- respuestas al formulario
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','reviewed','quoted','accepted','declined','expired')),
  quoted_price_usd numeric(10,2),
  quote_notes      text,
  valid_until      timestamptz,
  responded_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

---

### `pf_projects`
Proyectos de trabajo en entrega.

```sql
CREATE TABLE pf_projects (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id    uuid NOT NULL REFERENCES pf_client_orgs(id),
  order_id         uuid REFERENCES pf_orders(id),
  service_id       uuid REFERENCES pf_services(id),
  name             text NOT NULL,
  description      text,
  status           text NOT NULL DEFAULT 'planning'
                   CHECK (status IN ('planning','active','on_hold','completed','cancelled')),
  start_date       date,
  end_date         date,
  progress_percent integer NOT NULL DEFAULT 0
                   CHECK (progress_percent BETWEEN 0 AND 100),
  internal_notes   text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_projects(client_org_id);
CREATE INDEX ON pf_projects(status);
```

---

### `pf_project_milestones`
Hitos de cada proyecto.

```sql
CREATE TABLE pf_project_milestones (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES pf_projects(id) ON DELETE CASCADE,
  name         text NOT NULL,
  description  text,
  status       text NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending','in_progress','completed')),
  due_date     date,
  completed_at timestamptz,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_project_milestones(project_id);
```

---

### `pf_meetings`
Reuniones y asesorías agendadas.

```sql
CREATE TABLE pf_meetings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id   uuid REFERENCES pf_client_orgs(id),
  user_id         uuid REFERENCES auth.users(id),
  type            text NOT NULL DEFAULT 'discovery'
                  CHECK (type IN ('discovery','strategy','review','support','onboarding','custom')),
  status          text NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('scheduled','completed','cancelled','no_show','rescheduled')),
  title           text NOT NULL,
  cal_booking_uid text UNIQUE,  -- ID de Cal.com para sincronización
  scheduled_at    timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 45,
  meeting_url     text,
  notes           text,         -- notas internas post-reunión
  recording_url   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_meetings(client_org_id);
CREATE INDEX ON pf_meetings(scheduled_at);
```

---

### `pf_files`
Archivos compartidos entre el equipo y clientes.

```sql
CREATE TABLE pf_files (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_org_id   uuid NOT NULL REFERENCES pf_client_orgs(id),
  project_id      uuid REFERENCES pf_projects(id) ON DELETE SET NULL,
  uploaded_by     uuid NOT NULL REFERENCES auth.users(id),
  name            text NOT NULL,
  original_name   text NOT NULL,
  mime_type       text NOT NULL,
  size_bytes      bigint NOT NULL,
  storage_path    text NOT NULL,  -- path en Supabase Storage
  visibility      text NOT NULL DEFAULT 'client'
                  CHECK (visibility IN ('internal', 'client')),
  category        text,           -- 'report', 'asset', 'contract', 'other'
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_files(client_org_id);
CREATE INDEX ON pf_files(project_id) WHERE project_id IS NOT NULL;
```

---

### `pf_notifications`
Notificaciones en-app para usuarios.

```sql
CREATE TABLE pf_notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         text NOT NULL,      -- 'order_confirmed', 'project_updated', 'meeting_reminder'
  title        text NOT NULL,
  body         text,
  action_url   text,
  is_read      boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_notifications(user_id, is_read, created_at DESC);
```

---

### `pf_audit_log`
Historial de auditoría para acciones críticas.

```sql
CREATE TABLE pf_audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role      text,
  resource_type   text NOT NULL,   -- 'order', 'subscription', 'project', 'user'
  resource_id     uuid,
  action          text NOT NULL,   -- 'created', 'updated', 'deleted', 'cancelled', 'refunded'
  before_state    jsonb,
  after_state     jsonb,
  ip_address      inet,
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON pf_audit_log(actor_id);
CREATE INDEX ON pf_audit_log(resource_type, resource_id);
CREATE INDEX ON pf_audit_log(created_at DESC);
```

---

### `pf_stripe_customers`
Mapeo usuario ↔ customer de Stripe.

```sql
CREATE TABLE pf_stripe_customers (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_org_id      uuid REFERENCES pf_client_orgs(id),
  stripe_customer_id text UNIQUE NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);
```

---

### `pf_webhook_events`
Log de eventos de webhooks para idempotencia.

```sql
CREATE TABLE pf_webhook_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider     text NOT NULL CHECK (provider IN ('stripe', 'paypal', 'cal')),
  event_id     text NOT NULL,
  event_type   text NOT NULL,
  payload      jsonb,
  processed    boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  error        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);
CREATE INDEX ON pf_webhook_events(provider, processed, created_at);
```

---

## Resumen: conteo de tablas

| Categoría | Cantidad | Prefijo |
|-----------|----------|---------|
| CRM interno (existentes) | 9 | — |
| Plataforma (nuevas) | 18 | `pf_` |
| **Total** | **27** | — |

---

## Reglas de aislamiento por organización

Las tablas de plataforma **no** usan RLS de Supabase (Drizzle conecta con service role). El aislamiento es **a nivel de aplicación**:

1. Al autenticar, se resuelve `client_org_id` del usuario desde `pf_client_org_members`
2. Cada query de Drizzle incluye `WHERE org_id = :userOrgId`
3. Los server actions verifican `assertOrgAccess(user, orgId)` antes de cualquier mutación
4. Las rutas `/portal/**` leen `orgId` desde la sesión del middleware, nunca de parámetros GET
5. Los endpoints de admin verifican `platform_role = 'admin' | 'staff'`

---

## Generación de número de pedido

```typescript
// Formato: CKV-YYYY-NNNN
// Ejemplo: CKV-2026-0001
function generateOrderNumber(year: number, seq: number): string {
  return `CKV-${year}-${String(seq).padStart(4, '0')}`
}
```

Secuencia manejada con `nextval()` de una sequence Postgres para evitar colisiones.

---

## Archivo de schema Drizzle (ubicación)

```
drizzle/
  schema/
    platform-users.ts
    client-orgs.ts
    client-org-members.ts
    services.ts
    saas-products.ts
    carts.ts
    orders.ts
    order-items.ts
    subscriptions.ts
    quote-requests.ts
    projects.ts
    project-milestones.ts
    meetings.ts
    files.ts
    notifications.ts
    audit-log.ts
    stripe-customers.ts
    webhook-events.ts
  migrations/
    0001_platform_init.sql
    ...
  drizzle.config.ts
```
