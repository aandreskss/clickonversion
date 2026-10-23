# ClicKonversion — Plan de Implementación (Fase 1)

> Estado: Borrador para aprobación · Actualizado: 2026-10-21

---

## Principios de ejecución

1. **No destruir lo que funciona** — El CRM interno, el form de auditoría y el sitio live siguen operativos durante toda la fase.
2. **Incrementalmente verificable** — Cada fase termina con un build limpio y funcionalidad testeable.
3. **SEO preservado** — Ninguna ruta indexada se toca hasta que su reemplazo esté live.
4. **Sin migraciones destructivas** — Las tablas CRM existentes no se tocan. Solo se añaden tablas nuevas.

---

## Vista general de fases

```
F1A  Cimientos          ── Drizzle ORM + next-intl + Sanity (setup) + packages
F1B  Catálogo público   ── Services, SaaS, Pricing, About, Contact + i18n marketing
F1C  Auth de clientes   ── Signup, verificación, org creation, portal shell
F1D  Checkout           ── Carrito, Stripe, PayPal, órdenes
F1E  Portal completo    ── Projects, Orders, Meetings, Files, Notifications
F1F  Admin panel        ── Operations queue, Client mgmt, Service mgmt
F1G  Contenido Sanity   ── Blog, Case studies, service copy via CMS
F1H  Launch prep        ── SEO final, performance, seguridad, monitoreo
```

---

## Fase 1A — Cimientos técnicos

**Objetivo:** Instalar y configurar las nuevas dependencias sin ningún cambio visible al usuario.

### 1A.1 Drizzle ORM

```bash
pnpm add drizzle-orm postgres
pnpm add -D drizzle-kit
```

Archivos a crear:
- `drizzle.config.ts` — configuración del kit
- `drizzle/schema/index.ts` — barrel de exports
- `drizzle/schema/*.ts` — un archivo por tabla (18 tablas)
- `src/lib/db.ts` — singleton del cliente Drizzle

Variables de entorno nuevas:
- `DATABASE_URL` — conexión directa Supabase Postgres (port 5432)
- `DATABASE_URL_POOLED` — conexión pooled (port 6543) para Vercel

Verificación: `pnpm drizzle-kit generate` produce SQL sin errores.

### 1A.2 next-intl

```bash
pnpm add next-intl
```

Archivos a crear:
- `src/i18n/routing.ts` — definición de locales (`['en', 'es']`, default `'en'`)
- `src/i18n/request.ts` — función para cargar mensajes por locale
- `src/i18n/messages/en.json` — strings inglés (extraer desde componentes existentes)
- `src/i18n/messages/es.json` — strings español (traducir)
- `src/app/[locale]/layout.tsx` — layout raíz con NextIntlClientProvider

Migración de rutas existentes:
- Mover `src/app/(marketing)/` → `src/app/[locale]/(marketing)/`
- Actualizar todos los `Link` y `redirect()` para incluir locale
- Actualizar `proxy.ts` para skip de locale prefix en middleware
- El CRM `/app/**` queda fuera del locale wrapper (sin cambios)

Verificación: Homepage carga en `/` (inglés) y `/es/` (español) con strings diferentes.

### 1A.3 Sanity

```bash
pnpm create sanity@latest  # inicializa proyecto en sanity.io
pnpm add next-sanity @sanity/image-url
```

Archivos a crear:
- `sanity/sanity.config.ts` — configuración del studio
- `sanity/schemas/index.ts` — barrel
- `sanity/schemas/blog-post.ts`
- `sanity/schemas/case-study.ts`
- `sanity/schemas/service-content.ts` — copy editorial de servicios
- `sanity/lib/client.ts` — cliente Sanity para el frontend
- `sanity/lib/queries.ts` — queries GROQ reutilizables

Variables de entorno nuevas:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `SANITY_API_READ_TOKEN`

El studio se configura para deploy en `clickonversion.sanity.studio`.

Verificación: `sanity dev` abre el studio localmente sin errores.

### 1A.4 Stripe

```bash
pnpm add stripe @stripe/stripe-js
```

Archivos a crear:
- `src/lib/stripe/client.ts` — Stripe browser SDK (lazy load)
- `src/lib/stripe/server.ts` — Stripe Node.js client (server-only)
- `src/lib/stripe/types.ts` — tipos de eventos de webhook

Variables de entorno nuevas:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Verificación: Test con Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)

### 1A.5 PayPal

```bash
pnpm add @paypal/paypal-js
```

Archivos a crear:
- `src/lib/paypal/client.ts` — PayPal JS SDK loader
- `src/lib/paypal/server.ts` — PayPal REST API (access token, create/capture order)

Variables de entorno nuevas:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

### 1A.6 React Email (para plantillas Resend)

```bash
pnpm add react-email @react-email/components
```

Verificación: `pnpm build` pasa con 0 errores TS.

---

## Fase 1B — Catálogo público + i18n marketing

**Objetivo:** Nuevas páginas públicas indexables con soporte inglés/español.

### Rutas a crear

| Ruta | Componentes clave |
|------|------------------|
| `/services` | Catálogo de servicios (data desde Supabase o hardcoded inicialmente) |
| `/services/[slug]` | Detalle de servicio con CTA de compra / cotización |
| `/saas` | Catálogo de productos SaaS |
| `/saas/[slug]` | Página de SyncLead (y futuros) |
| `/pricing` | Tabla de precios comparativa |
| `/about` | Historia, equipo, misión |
| `/contact` | Formulario de contacto genérico |

### Componentes UI nuevos necesarios

- `src/components/ui/card.tsx` — card genérica
- `src/components/ui/table.tsx` — tabla básica
- `src/components/ui/tabs.tsx` — sistema de tabs
- `src/components/ui/modal.tsx` — modal/dialog
- `src/components/ui/select.tsx` — select nativo estilizado
- `src/components/ui/avatar.tsx` — avatar usuario

### i18n de componentes existentes

Todos los componentes de marketing reciben sus strings desde `useTranslations()` en lugar de texto hardcodeado. Los componentes existentes se migran incrementalmente — uno por sesión.

Verificación: Google Search Console no reporta errores de cobertura en rutas existentes. Build 0 errores.

---

## Fase 1C — Auth de clientes + portal shell

**Objetivo:** Los clientes pueden registrarse, verificar email y acceder al portal vacío.

### Rutas nuevas

```
/signup
/forgot-password
/reset-password
/verify-email
/portal  (shell con sidebar, sin datos aún)
```

### Server Actions a crear

```typescript
// src/app/(auth)/signup/actions.ts
signupAction(data: SignupFormData)
  → crea auth.users via Supabase
  → inserta pf_platform_users {platform_role: 'client'}
  → crea pf_client_orgs (nombre de la empresa del usuario)
  → inserta pf_client_org_members {role: 'owner'}
  → envía email de verificación (Resend)
  → redirect('/verify-email')
```

### Componentes de layout del portal

- `src/components/portal/portal-sidebar.tsx` — navegación lateral
- `src/components/portal/portal-header.tsx` — header con nombre de org y avatar
- `src/app/[locale]/(portal)/layout.tsx` — layout con auth guard

### Proxy.ts: ampliar rutas protegidas

Añadir `/portal/**` al matcher y lógica de auth.

Verificación:
- Un usuario nuevo puede completar el flujo signup → verify → portal
- Un usuario no autenticado que visita `/portal` es redirigido a `/login`
- Un usuario autenticado como `admin` puede acceder tanto a `/portal` como a `/admin`

---

## Fase 1D — Checkout y pagos

**Objetivo:** Un cliente puede poner servicios en el carrito, pagar con Stripe o PayPal y recibir confirmación.

### Flujo completo

```
/services/[slug]          → CTA: "Contratar" / "Solicitar cotización"
  ↓
Carrito (state en cookie o pf_carts para users auth)
  ↓
/checkout                 → resumen del pedido, selección de método de pago
  ↓
/api/checkout/stripe      → crea PaymentIntent o CheckoutSession
  ↓
Stripe Elements (client)  → usuario ingresa tarjeta
  ↓
Stripe confirma           → redirect a /checkout/success?order_id=...
  ↓
/api/webhooks/stripe      → payment_intent.succeeded → actualiza pf_orders
  ↓
Email de confirmación (Resend)
```

### Rutas nuevas

```
/checkout                 → página de checkout
/checkout/success         → confirmación post-pago
/checkout/cancel          → cancelación
```

### API routes nuevas

```
/api/checkout/stripe      POST — crea sesión de pago
/api/checkout/paypal      POST — crea order PayPal
/api/checkout/paypal/capture POST — captura orden PayPal
/api/webhooks/stripe      POST — eventos Stripe (con verificación HMAC)
/api/webhooks/paypal      POST — eventos PayPal
```

### Tablas que se activan

- `pf_carts` — persistencia del carrito
- `pf_orders` — pedidos confirmados
- `pf_order_items` — líneas de pedido
- `pf_stripe_customers` — mapeo usuario ↔ Stripe
- `pf_webhook_events` — deduplicación de webhooks

Verificación:
- Flujo completo en modo test de Stripe con tarjeta `4242 4242 4242 4242`
- El pedido aparece en `pf_orders` con `payment_status = 'paid'`
- El usuario recibe email de confirmación
- Un segundo webhook del mismo evento no crea un pedido duplicado

---

## Fase 1E — Portal completo

**Objetivo:** El portal muestra datos reales — proyectos, pedidos, reuniones, archivos.

### Páginas y sus data sources

| Página | Query principal |
|--------|----------------|
| `/portal` | Resumen: último pedido, proyecto activo, próxima reunión |
| `/portal/orders` | `pf_orders WHERE client_org_id = :orgId ORDER BY created_at DESC` |
| `/portal/orders/[id]` | `pf_orders JOIN pf_order_items` |
| `/portal/projects` | `pf_projects WHERE client_org_id = :orgId` |
| `/portal/projects/[id]` | `pf_projects + pf_project_milestones + pf_files` |
| `/portal/meetings` | `pf_meetings WHERE client_org_id = :orgId ORDER BY scheduled_at` |
| `/portal/files` | `pf_files WHERE client_org_id = :orgId AND visibility = 'client'` |
| `/portal/settings` | `pf_client_orgs + pf_client_org_members` |

### Integración Cal.com (webhook)

```
Cal.com → /api/webhooks/cal → inserta/actualiza pf_meetings
```

Variables de entorno:
- `CAL_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BOOKING_URL`

### Notificaciones

`pf_notifications` se consulta en cada carga del portal (Server Component). Para tiempo real futuro: Supabase Realtime (no en Fase 1).

---

## Fase 1F — Panel administrativo

**Objetivo:** El equipo de ClicKonversion puede gestionar clientes, pedidos y proyectos desde `/admin`.

### Páginas

| Página | Funcionalidad |
|--------|--------------|
| `/admin` | KPIs: MRR, pedidos activos, proyectos pendientes, reuniones hoy |
| `/admin/clients` | Lista de orgs clientes con filtros |
| `/admin/clients/[id]` | Detalle: órdenes, proyectos, reuniones, archivos del cliente |
| `/admin/orders` | Todos los pedidos con status y monto |
| `/admin/projects` | Cola operativa — proyectos activos ordenados por deadline |
| `/admin/projects/[id]` | Gestión de proyecto: milestones, notas internas, archivos |
| `/admin/meetings` | Calendario de todas las reuniones |
| `/admin/services` | CRUD del catálogo de servicios |
| `/admin/analytics` | Revenue, conversión, churn |
| `/admin/settings` | Configuración general de plataforma |

### Decisión pendiente

¿Migrar `/app/**` (CRM) a `/admin/**` o mantenerlos paralelos? Ver `docs/decisions.md` — Decisión #6.

---

## Fase 1G — Contenido via Sanity

**Objetivo:** Blog y casos de estudio publicables desde Sanity Studio sin tocar código.

### Schema de Sanity

```typescript
// Blog Post
{
  title: { en: string, es: string }
  slug: { en: string, es: string }
  excerpt: { en: string, es: string }
  body: { en: PortableText, es: PortableText }
  coverImage: SanityImageAsset
  publishedAt: datetime
  author: Reference<Author>
  categories: Reference<Category>[]
  seoTitle: { en: string, es: string }
  seoDescription: { en: string, es: string }
}

// Case Study
{
  clientName: string
  industry: string
  challenge: { en: PortableText, es: PortableText }
  solution: { en: PortableText, es: PortableText }
  results: { metric: string, value: string, description: string }[]
  testimonial: { quote: string, author: string, role: string }
  services: string[]
  publishedAt: datetime
}
```

### ISR (Incremental Static Regeneration)

- Páginas de blog y casos de éxito se generan estáticamente
- Sanity webhook → `next revalidate` en `/api/sanity/revalidate`
- `revalidateTag('blog')` o `revalidatePath()` tras cada publicación

---

## Fase 1H — Preparación de lanzamiento

**Objetivo:** El producto está listo para usuarios reales.

### Checklist técnico

- [ ] `pnpm build` pasa con 0 errores TS, 0 warnings de lint
- [ ] Lighthouse score: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Sitemap actualizado con todas las rutas públicas de Fase 1
- [ ] Hreflang correcto en todas las páginas indexables (en ↔ es)
- [ ] robots.txt actualizado
- [ ] Metadata y OG tags en todas las páginas nuevas
- [ ] JSON-LD: Organization, WebSite, BreadcrumbList, Product en páginas de servicio
- [ ] Stripe en modo live (keys de producción)
- [ ] PayPal en modo live
- [ ] Cal.com webhook configurado con URL de producción
- [ ] Todas las variables de entorno en Vercel configuradas
- [ ] Supabase email templates personalizados (verificación, reset)
- [ ] Email templates de Resend testeados en diferentes clientes de correo
- [ ] Cloudflare WAF rules revisadas para nuevas rutas
- [ ] Error monitoring (Sentry o Vercel Monitoring)

---

## Dependencias críticas entre fases

```
1A (Cimientos)
  ├→ 1B (Marketing público)  ← requiere next-intl y Sanity setup
  ├→ 1C (Auth clientes)      ← requiere Drizzle con pf_* tables
  │     └→ 1D (Checkout)     ← requiere auth clientes + Stripe/PayPal
  │           └→ 1E (Portal) ← requiere órdenes de checkout
  │                 └→ 1F (Admin) ← requiere datos de portal
  └→ 1G (Sanity content)    ← puede iniciar en paralelo con 1B+
         └→ 1H (Launch)     ← requiere todo lo anterior
```

---

## Estimado de trabajo por fase

| Fase | Complejidad | Estimado |
|------|-------------|----------|
| 1A — Cimientos | Media | 2-3 sesiones |
| 1B — Marketing + i18n | Alta | 4-5 sesiones |
| 1C — Auth clientes | Media | 2-3 sesiones |
| 1D — Checkout | Alta | 4-5 sesiones |
| 1E — Portal | Alta | 4-5 sesiones |
| 1F — Admin | Media | 3-4 sesiones |
| 1G — Sanity content | Baja | 1-2 sesiones |
| 1H — Launch prep | Media | 2-3 sesiones |
| **Total** | | **~22-30 sesiones** |

---

## Primer sprint recomendado

Empezar con **1A completo** en la próxima sesión:
1. Instalar Drizzle ORM y crear los 18 schemas de plataforma
2. Ejecutar primera migración en Supabase local: `pnpm drizzle-kit migrate`
3. Verificar build limpio
4. Instalar next-intl y crear la estructura de locales
5. Migrar la ruta `/` al wrapper `[locale]`

Esto no cambia nada visible pero habilita todo lo demás.
