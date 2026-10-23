# ClicKonversion — Arquitectura de Plataforma (Fase 1)

> Estado: Borrador para aprobación · Actualizado: 2026-10-21

---

## Visión general

ClicKonversion evoluciona de una herramienta CRM interna para una sola agencia a una **plataforma internacional de servicios digitales** que permite a organizaciones clientes comprar servicios, hacer seguimiento de proyectos y acceder a herramientas SaaS.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CLICKONVERSION PLATFORM                        │
├──────────────────────────┬──────────────────────────────────────────┤
│   PÚBLICO (Marketing)    │   AUTENTICADO (Portal + Admin)           │
│                          │                                          │
│   /                      │   /portal/**  (clientes externos)        │
│   /es/                   │   /admin/**   (equipo interno)           │
│   /services/**           │   /app/**     (CRM ventas — existente)   │
│   /saas/**               │                                          │
│   /pricing               │                                          │
│   /blog/**               │                                          │
│   /case-studies/**       │                                          │
│   /audit                 │                                          │
│   /about · /contact      │                                          │
│   /privacy · /terms      │                                          │
└──────────────────────────┴──────────────────────────────────────────┘
```

---

## Stack tecnológico

| Capa | Tecnología | Versión | Estado |
|------|-----------|---------|--------|
| Framework | Next.js App Router | 16.3.1 | ✅ Instalado |
| Lenguaje | TypeScript strict | 5.x | ✅ Instalado |
| Estilos | Tailwind CSS 4 (CSS-first) | 4.x | ✅ Instalado |
| Base de datos | Supabase PostgreSQL | 2.x | ✅ Instalado |
| Auth | Supabase Auth + @supabase/ssr | 0.12 | ✅ Instalado |
| Validación | Zod | 4.4 | ✅ Instalado |
| Formularios | React Hook Form | 7.85 | ✅ Instalado |
| Iconos | Lucide React | 1.33 | ✅ Instalado |
| Package manager | pnpm | 11.22 | ✅ Instalado |
| **ORM** | **Drizzle ORM** | **0.44+** | 🔲 Por instalar |
| **i18n** | **next-intl** | **4.x** | 🔲 Por instalar |
| **CMS** | **Sanity** | **3.x** | 🔲 Por instalar |
| **Pagos** | **Stripe** | **17.x** | 🔲 Por instalar |
| **Pagos alt.** | **PayPal JS SDK** | **2.x** | 🔲 Por instalar |
| **Reservas** | **Cal.com API** | hosted | 🔲 Por integrar |
| **Email tx.** | **Resend** (expandir) | 4.x | ✅ Instalado (básico) |
| **Almacenamiento** | **Supabase Storage** | — | 🔲 Por configurar |
| Hosting | Vercel | — | ✅ Configurado |
| Analítica | GA4 + Search Console | — | ✅ Instalado |

---

## Capas de la arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                   CLIENTE (Browser)                          │
│   React Client Components · GA4 · Stripe.js · PayPal JS     │
└────────────────────────────┬─────────────────────────────────┘
                             │ HTTP / RSC
┌────────────────────────────▼─────────────────────────────────┐
│              NEXT.JS APP (Vercel Edge + Serverless)          │
│                                                              │
│  Proxy (proxy.ts) ─── Auth guard ─── i18n routing           │
│                                                              │
│  Server Components ──────────────── Server Actions           │
│  (fetch + render)                   (mutations)              │
│                                                              │
│  API Routes:                                                 │
│    /api/audit           (lead capture — existente)           │
│    /api/auth/callback   (Supabase OAuth — existente)         │
│    /api/webhooks/stripe (Stripe events)                      │
│    /api/webhooks/paypal (PayPal events)                      │
│    /api/checkout        (session creation)                   │
│    /api/export/**       (CSV export — existente)             │
└───┬──────────────┬──────────────┬──────────────┬────────────┘
    │              │              │              │
    ▼              ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐
│ Sanity │  │  Drizzle │  │ Supabase │  │   Servicios  │
│  CMS   │  │   ORM    │  │  Auth +  │  │   externos   │
│        │  │(Postgres)│  │  CRM DB  │  │              │
│ Blog   │  │          │  │          │  │ Stripe API   │
│ Case   │  │ Platform │  │ CRM      │  │ PayPal API   │
│ studies│  │ tables   │  │ tables   │  │ Cal.com API  │
│ Services│ │          │  │ (RLS)    │  │ Resend API   │
└────────┘  └──────────┘  └──────────┘  └──────────────┘
```

---

## Límites de responsabilidad por sistema

### Supabase (existente)
- **Auth**: Login, sesiones, tokens, OAuth, magic links
- **CRM tables**: `companies`, `contacts`, `opportunities`, `activities`, `tasks`, `audit_requests`, `prospect_research`, `organizations`, `organization_members`
- **RLS**: Políticas de aislamiento para las tablas CRM
- **Storage**: Archivos de proyectos subidos por clientes

### Drizzle ORM (nuevo)
- **Platform tables**: Todas las tablas de la nueva plataforma (ver `docs/database-schema.md`)
- Conecta directamente al mismo Postgres de Supabase via `DATABASE_URL`
- La autorización es a nivel de aplicación (no RLS) para estas tablas
- Las migraciones viven en `drizzle/migrations/`

### Sanity (nuevo)
- **Contenido editorial**: Blog, casos de estudio, descripciones de servicios, FAQs
- El estudio se despliega en `clickonversion.sanity.studio`
- El frontend consume via `next-sanity` con ISR (revalidación en webhook)
- Soporte nativo para contenido en inglés y español por campo

### Stripe (nuevo)
- Pagos con tarjeta, pagos únicos, suscripciones recurrentes
- Customer Portal para que clientes gestionen sus suscripciones
- Webhooks en `/api/webhooks/stripe` con verificación de firma
- `stripe_customers` mapea `user_id` → `stripe_customer_id`

### PayPal (nuevo)
- Alternativa de pago para pagos únicos (no suscripciones)
- JavaScript SDK en frontend, verificación server-side
- Webhooks en `/api/webhooks/paypal`

---

## Modelo de roles y acceso

```
auth.users (Supabase)
    │
    ├── platform_role: 'admin' | 'staff' | 'client'
    │
    ├── [admin/staff] → /admin/**  (panel operativo)
    │                  /app/**    (CRM ventas)
    │
    └── [client] → /portal/**
                   └── client_org_members → client_organizations
                                            (aislamiento por org)
```

| Rol | Acceso | Descripción |
|-----|--------|-------------|
| `admin` | `/admin/**` + `/app/**` + `/portal/**` | Arnaldo y equipo interno |
| `staff` | `/admin/**` + `/portal/**` | Miembros de equipo operativo |
| `client_owner` | `/portal/**` (su org) | Dueño de organización cliente |
| `client_admin` | `/portal/**` (su org) | Admin de organización cliente |
| `client_member` | `/portal/**` (su org, lectura) | Usuario adicional de la org |

El rol de plataforma se almacena en `platform_users.platform_role`. El rol dentro de una org cliente se almacena en `client_org_members.role`.

---

## i18n: estrategia de idiomas

**Enfoque: subdirectorio con next-intl**

```
/            → inglés (por defecto)
/es/         → español
/es/services → versión española de /services
```

- `src/i18n/messages/en.json` — strings inglés
- `src/i18n/messages/es.json` — strings español
- El middleware de next-intl detecta idioma por cookie/header y redirige
- Hreflang en todas las páginas indexables
- Contenido editorial (blog, servicios) multiidioma en Sanity por campo

**No** se usarán subdominios (`es.clickonversion.com`) — subdirectorio es mejor para consolidar autoridad de dominio.

---

## Sistema de pagos: arquitectura

```
Cliente → Carrito → /checkout
                       │
           ┌───────────┼───────────┐
           ▼           ▼           ▼
      [Tarjeta]  [PayPal]    [Cotización]
           │           │           │
    Stripe SDK   PayPal JS    Quote form
           │           │           │
    /api/checkout/stripe  /api/checkout/paypal  /api/quotes
           │           │
    Stripe Webhook  PayPal Webhook
    /api/webhooks/  /api/webhooks/
         stripe         paypal
           │           │
           └─────┬─────┘
                 ▼
         orders + order_items
         subscriptions (Stripe)
         notifications → Resend email
```

---

## Sistema de reservas

Cal.com es el proveedor actual referenciado en `.env.example`. Integración:

1. Botón "Agendar reunión" → embed de Cal.com o redirección a `cal.com/clickonversion`
2. Cal.com webhook → `/api/webhooks/cal` → inserta en `meetings`
3. El portal cliente muestra próximas reuniones desde la tabla `meetings`
4. El admin ve todas las reuniones en `/admin/meetings`

---

## Email transaccional (Resend)

Resend ya está instalado. Se expande para cubrir:

| Evento | Plantilla |
|--------|-----------|
| Registro de cliente | `welcome` |
| Verificación de email | `verify-email` |
| Restablecimiento de contraseña | `reset-password` |
| Pedido confirmado | `order-confirmation` |
| Factura disponible | `invoice-ready` |
| Proyecto actualizado | `project-update` |
| Reunión agendada | `meeting-confirmed` |
| Notificación interna (audit) | `audit-request` (ya existe) |

Plantillas en `src/emails/` usando React Email (compatible con Resend).

---

## Variables de entorno requeridas (nuevas)

```bash
# Base de datos (Drizzle — conexión directa a Supabase Postgres)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-[region].pooler.supabase.com:5432/postgres
DATABASE_URL_POOLED=postgresql://postgres.[ref]:[password]@aws-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=  # solo server-side, para draft preview

# Stripe
STRIPE_SECRET_KEY=sk_live_...          # server-only
STRIPE_WEBHOOK_SECRET=whsec_...       # server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# PayPal
PAYPAL_CLIENT_ID=                      # server-only
PAYPAL_CLIENT_SECRET=                  # server-only
NEXT_PUBLIC_PAYPAL_CLIENT_ID=          # para el SDK frontend

# Cal.com (reservas)
CAL_API_KEY=                           # server-only
CAL_WEBHOOK_SECRET=                    # server-only
NEXT_PUBLIC_BOOKING_URL=https://cal.com/clickonversion/strategy-call

# i18n / locale
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

**Existentes que se conservan sin cambios:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ORG_ID`
- `RESEND_API_KEY` · `EMAIL_FROM` · `NOTIFICATION_EMAIL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` · `TURNSTILE_SECRET_KEY`

---

## Qué se reutiliza del código actual

| Componente | Estado | Acción |
|-----------|--------|--------|
| `src/lib/supabase/client.ts` | ✅ Reutilizar | Sin cambios |
| `src/lib/supabase/server.ts` | ✅ Reutilizar | Sin cambios |
| `src/lib/supabase/middleware.ts` | ✅ Reutilizar | Sin cambios |
| `src/proxy.ts` | ✅ Ampliar | Añadir rutas `/portal/**` y `/admin/**` |
| `src/app/globals.css` | ✅ Reutilizar | Añadir tokens de color para modo claro del portal |
| `src/components/ui/` | ✅ Reutilizar | Ampliar: modal, select, table, card, tabs |
| `src/components/marketing/` | ✅ Reutilizar | Refactorizar para i18n |
| `src/components/crm/` | ✅ Reutilizar | Mover a `/admin` eventualmente |
| `src/lib/validations.ts` | ✅ Ampliar | Añadir schemas de platform |
| `src/lib/analytics.ts` | ✅ Ampliar | Añadir eventos de ecommerce (purchase, checkout) |
| `src/app/(app)/**` | ✅ Conservar | CRM interno, migrar a `/admin` en Fase 3 |
| `supabase/migrations/` | ✅ Conservar | No modificar tablas existentes |

---

## Lo que NO existe y hay que construir desde cero

- Drizzle schema + migraciones (`drizzle/`)
- Sanity studio + schemas (`sanity/`)
- Sistema de i18n (`src/i18n/`)
- Checkout flow (`src/app/(marketing)/checkout/`)
- Portal de clientes (`src/app/(portal)/`)
- Panel admin de plataforma (`src/app/(admin)/`)
- API routes de pagos y webhooks
- Email templates (`src/emails/`)
- Componentes UI para portal (tablas, tabs, estados vacíos)

---

## Riesgos identificados

| Riesgo | Nivel | Mitigación |
|--------|-------|-----------|
| Drizzle + Supabase client en paralelo | Medio | Límite claro: Drizzle para platform tables, Supabase client para CRM + Auth |
| i18n afecta todas las páginas existentes | Medio | Migrar marketing components a next-intl de forma incremental |
| Stripe webhook idempotencia | Alto | Tabla `webhook_events` para deduplicación por `event_id` |
| Migración de `/app` → `/admin` sin romper SEO | Bajo | `/app/**` es noindex; no hay impacto SEO |
| Sanity sin CMS actual = 100% nuevo | Bajo | No hay datos que migrar, empezar vacío |
| Cal.com webhook no fiable | Medio | Fallback manual en admin para registrar reuniones |
| Auth de clientes vs. auth interna (mismo Supabase) | Medio | Tabla `platform_users` con `platform_role` distingue ambos |
