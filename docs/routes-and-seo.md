# ClicKonversion — Rutas y SEO (Fase 1)

> Estado: Borrador para aprobación · Actualizado: 2026-10-21

---

## Inventario de rutas actuales

### Rutas públicas indexadas

| URL | Indexada | Descripción | Impacto SEO actual |
|-----|----------|-------------|-------------------|
| `/` | ✅ | Homepage — agencia de marketing para negocios locales | Principal |
| `/audit` | ✅ | Formulario de auditoría gratuita (lead capture) | Secundaria |
| `/privacy` | ✅ | Política de privacidad | Mínimo |
| `/terms` | ✅ | Términos de servicio | Mínimo |

### Rutas públicas no indexadas (noindex)

| URL | Noindex | Razón |
|-----|---------|-------|
| `/cleaning` | ✅ | Landing de outbound — no para indexación |
| `/thank-you` | ✅ | Página de confirmación post-envío |
| `/login` | ✅ | Página de acceso |

### Rutas protegidas (disallow en robots.txt)

| URL | Protección |
|-----|-----------|
| `/app/**` | Auth guard — CRM interno |
| `/api/**` | API routes |

---

## Análisis: impacto de cambios en rutas existentes

### Regla fundamental
**No se elimina ni redirige ninguna URL indexada sin definir el plan completo.**

| URL | Cambio propuesto | Redirección 301 | Canonical | Impacto SEO | Acción |
|-----|-----------------|-----------------|-----------|-------------|--------|
| `/` | Rediseño de contenido (scope global, no solo USA) | No aplica — misma URL | `/` | Medio — cambio de intención de búsqueda | ⚠️ Decidir: ¿redirigir a `/en/` o mantener en `/`? |
| `/audit` | Mantener como lead capture genérico | No aplica | `/audit` | Bajo — si contenido mejorado | ✅ Mantener sin cambios |
| `/privacy` | Actualizar para incluir datos de pago y clientes | No aplica | `/privacy` | Nulo | ✅ Actualizar contenido |
| `/terms` | Actualizar para incluir servicios digitales y suscripciones | No aplica | `/terms` | Nulo | ✅ Actualizar contenido |
| `/cleaning` | Conservar como noindex | No aplica | — | Nulo | ✅ Sin cambios |

**Decisión crítica pendiente sobre `/`:**
- **Opción A**: Mantener `/` en inglés, añadir `/es/` en español → hreflang correcto, sin 301
- **Opción B**: Redirigir `/` → `/en/` (rompe cualquier backlink directo al homepage)
- **Recomendación**: Opción A — mantener `/` como versión inglés y añadir `/es/` como variante

---

## Arquitectura de rutas propuesta (Fase 1)

### Convención de nombres
- Rutas en inglés por defecto (URL canónica)
- `/es/[ruta]` para versión española
- Slugs: kebab-case, sin caracteres especiales
- Profundidad máxima: 3 niveles (`/blog/category/slug`)

### Marketing público (nuevas rutas)

```
/                          → Homepage (inglés) — EXISTENTE, rediseñar
/es/                       → Homepage (español) — NUEVA

/services                  → Catálogo de servicios — NUEVA
/es/services               → Catálogo de servicios (ES) — NUEVA
/services/[slug]           → Servicio individual — NUEVA
/es/services/[slug]        → Servicio individual (ES) — NUEVA

/saas                      → Catálogo de SaaS — NUEVA
/es/saas                   → Catálogo de SaaS (ES) — NUEVA
/saas/[slug]               → Producto SaaS individual — NUEVA
/es/saas/[slug]            → Producto SaaS individual (ES) — NUEVA

/pricing                   → Precios — NUEVA
/es/pricing                → Precios (ES) — NUEVA

/blog                      → Blog (Sanity) — NUEVA
/es/blog                   → Blog (ES) — NUEVA
/blog/[slug]               → Artículo individual — NUEVA
/es/blog/[slug]            → Artículo individual (ES) — NUEVA

/case-studies              → Casos de éxito — NUEVA
/es/case-studies           → Casos de éxito (ES) — NUEVA  
/case-studies/[slug]       → Caso individual — NUEVA
/es/case-studies/[slug]    → Caso individual (ES) — NUEVA

/about                     → Sobre ClicKonversion — NUEVA
/es/about                  → Sobre ClicKonversion (ES) — NUEVA

/contact                   → Contacto — NUEVA
/es/contact                → Contacto (ES) — NUEVA

/audit                     → Auditoría gratuita — EXISTENTE
/es/audit                  → Auditoría gratuita (ES) — NUEVA

/privacy                   → Política privacidad — EXISTENTE
/terms                     → Términos de servicio — EXISTENTE

/cleaning                  → Landing outbound (noindex) — EXISTENTE
```

### Auth (existentes + nuevas)

```
/login                     → Acceso — EXISTENTE
/signup                    → Registro de clientes — NUEVA (noindex)
/forgot-password           → Recuperar contraseña — NUEVA (noindex)
/reset-password            → Restablecer contraseña — NUEVA (noindex)
/verify-email              → Verificación de email — NUEVA (noindex)
```

### Portal de clientes (todas noindex)

```
/portal                    → Dashboard del cliente
/portal/projects           → Lista de proyectos
/portal/projects/[id]      → Detalle de proyecto + milestones
/portal/orders             → Historial de pedidos
/portal/orders/[id]        → Detalle de pedido
/portal/invoices           → Facturas
/portal/invoices/[id]      → Detalle de factura
/portal/subscriptions      → Suscripciones activas
/portal/meetings           → Reuniones agendadas
/portal/files              → Archivos compartidos
/portal/settings           → Configuración de cuenta y organización
```

### Panel admin (todas noindex)

```
/admin                     → Dashboard administrativo
/admin/clients             → Clientes (organizaciones)
/admin/clients/[id]        → Detalle de cliente
/admin/orders              → Todos los pedidos
/admin/orders/[id]         → Detalle de pedido
/admin/projects            → Cola operativa de proyectos
/admin/projects/[id]       → Detalle de proyecto (admin)
/admin/meetings            → Todas las reuniones
/admin/services            → Gestión del catálogo de servicios
/admin/saas                → Gestión de productos SaaS
/admin/analytics           → Analítica de plataforma
/admin/settings            → Configuración de plataforma
/admin/users               → Gestión de usuarios
```

### CRM interno (existente, bajo `/app`)

```
/app                       → Dashboard CRM — EXISTENTE
/app/pipeline              → Pipeline de ventas — EXISTENTE
/app/companies             → Empresas — EXISTENTE
/app/companies/new         → Nueva empresa — EXISTENTE
/app/companies/[id]        → Detalle empresa — EXISTENTE
/app/tasks                 → Tareas — EXISTENTE
/app/import                → Importar CSV — EXISTENTE
/app/settings              → Configuración CRM — EXISTENTE
```

### API routes

```
/api/audit                 → POST — lead capture — EXISTENTE
/api/auth/callback         → GET — Supabase OAuth — EXISTENTE
/api/export/companies      → GET — CSV export — EXISTENTE
/api/checkout/stripe       → POST — crear sesión de pago Stripe — NUEVA
/api/checkout/paypal       → POST — crear order PayPal — NUEVA
/api/webhooks/stripe       → POST — eventos Stripe — NUEVA
/api/webhooks/paypal       → POST — eventos PayPal — NUEVA
/api/webhooks/cal          → POST — eventos Cal.com — NUEVA
/api/portal/notifications  → GET — notificaciones del usuario — NUEVA
/api/admin/[...path]       → Admin API endpoints — NUEVA
```

---

## Estructura App Router para i18n (next-intl)

```
src/app/
  [locale]/                     ← next-intl locale wrapper
    (marketing)/
      page.tsx                  → /  y  /es/
      services/
        page.tsx                → /services  y  /es/services
        [slug]/
          page.tsx              → /services/[slug]
      saas/
        page.tsx
        [slug]/page.tsx
      pricing/page.tsx
      blog/
        page.tsx
        [slug]/page.tsx
      case-studies/
        page.tsx
        [slug]/page.tsx
      about/page.tsx
      contact/page.tsx
      audit/page.tsx            ← mover de (marketing)/audit
      cleaning/page.tsx
      thank-you/page.tsx
      privacy/page.tsx
      terms/page.tsx
    (auth)/
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx
    (portal)/
      portal/
        page.tsx
        projects/[...]
        orders/[...]
        ...
    (admin)/
      admin/[...]
    (crm)/
      app/[...]                 ← sin locale (solo equipo interno)
```

**Nota sobre `/app/**` y locale**: Las rutas CRM internas (`/app/**`) están fuera del locale wrapper — son solo para el equipo y no necesitan i18n.

---

## SEO: metadata por tipo de página

### Páginas de marketing (Server Components)

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${page.title} | ClicKonversion`,
    description: page.description,
    alternates: {
      canonical: `https://www.clickonversion.com/${params.locale !== 'en' ? params.locale + '/' : ''}${slug}`,
      languages: {
        'en': `https://www.clickonversion.com/${slug}`,
        'es': `https://www.clickonversion.com/es/${slug}`,
        'x-default': `https://www.clickonversion.com/${slug}`,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: 'ClicKonversion',
      locale: params.locale === 'es' ? 'es_US' : 'en_US',
      alternateLocale: params.locale === 'es' ? ['en_US'] : ['es_US'],
      type: 'website',
    },
  }
}
```

### Páginas noindex (portal, admin, auth)

```typescript
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}
```

---

## Sitemap actualizado

El archivo `src/app/sitemap.ts` debe incluir:

```typescript
// Prioridades
// 1.0 — Homepage (en + es)
// 0.9 — /services, /pricing
// 0.8 — /services/[slug], /saas/[slug]
// 0.7 — /blog, /case-studies
// 0.6 — /blog/[slug], /case-studies/[slug]
// 0.5 — /about, /contact, /audit
// 0.3 — /privacy, /terms
```

Excluidos: `/portal/**`, `/admin/**`, `/app/**`, `/api/**`, `/login`, `/signup`, `/cleaning`, `/thank-you`

---

## robots.txt actualizado

```
User-agent: *
Allow: /
Disallow: /portal/
Disallow: /admin/
Disallow: /app/
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /verify-email
Disallow: /thank-you
Disallow: /cleaning

Sitemap: https://www.clickonversion.com/sitemap.xml
```

---

## Contenido SEO de alto valor (a producir via Sanity)

En orden de prioridad por intención comercial:

### Servicios individuales (alta intención)
- SEO para negocios de limpieza
- Google Ads para HVAC
- CRM para plomeros
- Diseño web para contratistas
- Analytics para restaurantes

### Blog (intención informacional → captura)
- "Cuánto cuesta el SEO para una empresa de limpieza"
- "Cómo conseguir más clientes con Google Ads"
- "Por qué tu sitio web no genera llamadas"

### Casos de éxito (prueba social)
- Formato: "Cómo [cliente] aumentó sus leads un X% en Y meses"

### Ciudad + vertical (long tail)
- `/services/seo-for-cleaning-companies-miami`
- `/services/google-ads-for-hvac-chicago`

**Nota:** Estas páginas de ciudad/vertical se producen **después** del primer cliente pagador, como establece el CLAUDE.md.
