# ClicKonversion — Decisiones de Arquitectura

> Estado: Pendientes de aprobación · Actualizado: 2026-10-21

Cada decisión está marcada con su nivel de impacto y reversibilidad. Las decisiones de nivel **Alto** requieren aprobación explícita antes de comenzar implementación.

---

## DECISIÓN 1 — ORM: Drizzle vs. Supabase client puro

**Impacto:** Alto · **Reversibilidad:** Baja (cambiar después implica reescribir toda la capa de datos)

### Opciones

| Opción | Pro | Contra |
|--------|-----|--------|
| **A: Drizzle ORM** (recomendada) | Type-safe, migraciones en código, queries complejas elegantes, mejor DX | Nueva dependencia, dos patrones en el mismo proyecto |
| B: Solo Supabase client | Ya instalado, RLS built-in, cero setup | Queries manuales con `string` fragmentados, sin type safety nativa en joins complejos |
| C: Drizzle + Supabase client con boundary claro | Drizzle para platform tables, Supabase para CRM + Auth | Lo mejor de ambos mundos; boundary explícito ya documentado |

**Recomendación: Opción C**

Boundary:
- **Supabase client** → Auth, tablas CRM existentes (`companies`, `contacts`, etc.), Storage
- **Drizzle ORM** → Todas las tablas de plataforma nuevas (`pf_*`)
- Ambas capas conectan al mismo Postgres de Supabase

**Decisión requerida:** ¿Apruebas usar Drizzle ORM para las tablas nuevas de plataforma?

---

## DECISIÓN 2 — CMS: Sanity vs. MDX vs. Contentlayer

**Impacto:** Alto · **Reversibilidad:** Media

### Opciones

| Opción | Pro | Contra |
|--------|-----|--------|
| **Sanity** (recomendada) | UI de edición excelente, soporte multi-idioma nativo, webhooks para ISR, imágenes optimizadas | Costo ($0 en free tier para proyectos pequeños), dependencia externa, setup inicial |
| MDX files en Git | Cero costo, todo en el repo | Requiere PR para publicar, no hay editor visual, difícil para no-técnicos |
| Contentlayer | Type-safe, integración Next.js | Solo lee archivos locales (no tiene editor), deprecado parcialmente |

**Recomendación: Sanity**

El plan gratuito de Sanity incluye 3 usuarios, 10K documentos y 500K peticiones/mes — suficiente para lanzar. La UI de editor permite publicar blog posts y casos de éxito sin tocar código.

**Decisión requerida:** ¿Apruebas Sanity como CMS? ¿O prefieres MDX en Git por control total?

---

## DECISIÓN 3 — i18n: Subdirectorio vs. Subdominio

**Impacto:** Alto · **Reversibilidad:** Muy baja (cambiar después requiere redirigir miles de URLs)

### Opciones

| Opción | Estructura | Pro | Contra |
|--------|-----------|-----|--------|
| **Subdirectorio** (recomendado) | `/` + `/es/` | Consolida autoridad de dominio en `clickonversion.com`, más fácil de implementar con next-intl, GSC lo gestiona bajo un solo dominio | Comparte crawl budget |
| Subdominio | `clickonversion.com` + `es.clickonversion.com` | Separación completa de métricas | Divide autoridad de dominio, requiere configurar 2 propiedades en GSC |

**Recomendación: Subdirectorio** — misma decisión que tomó HubSpot, Shopify, y la mayoría de SaaS internacionales.

**Decisión requerida:** ¿Subdirectorio `/es/` o subdominio `es.clickonversion.com`?

---

## DECISIÓN 4 — Sistema de reservas: Cal.com vs. Calendly vs. custom

**Impacto:** Medio · **Reversibilidad:** Media

| Opción | Costo | API | Webhook | Pro |
|--------|-------|-----|---------|-----|
| **Cal.com** (recomendado) | $0 (open source / hosted) | ✅ | ✅ | Ya referenciado en .env.example; open-source; API robusta |
| Calendly | $10/mo | ✅ (plan Pro) | ✅ | Más conocido, UI más pulida |
| Custom (Google Calendar API) | $0 | ✅ | Complejo | Control total, pero mucho trabajo |

**Recomendación: Cal.com** — ya estaba en el plan original, el webhook es estable y permite mapear reuniones a `pf_meetings`.

**Decisión requerida:** ¿Confirmamos Cal.com como proveedor de reservas?

---

## DECISIÓN 5 — Pagos: Stripe solo vs. Stripe + PayPal desde día 1

**Impacto:** Medio · **Reversibilidad:** Alta (PayPal se puede añadir después)

### Opciones

| Opción | Esfuerzo | Conversión | Recomendación |
|--------|---------|------------|--------------|
| Solo Stripe (lanzamiento) | Bajo | Buena (tarjetas) | Lanzar antes |
| Stripe + PayPal desde día 1 | Alto | Mejor (LATAM prefiere PayPal) | Máxima conversión |

**Recomendación:** Implementar Stripe primero, PayPal en sprint 2 de Fase 1D.

El mercado objetivo incluye Venezuela y LATAM donde PayPal tiene alta penetración — pero no debe retrasar el lanzamiento. Se puede añadir en 1-2 sesiones después de que Stripe esté funcionando.

**Decisión requerida:** ¿Stripe solo para lanzar o Stripe + PayPal juntos?

---

## DECISIÓN 6 — CRM interno: mantener `/app/**` vs. migrar a `/admin/**`

**Impacto:** Bajo · **Reversibilidad:** Alta

### Opciones

| Opción | Pro | Contra |
|--------|-----|--------|
| **Mantener `/app/**` separado** (recomendado) | Cero riesgo de romper lo que funciona, trabajo inmediato en el nuevo admin | Dos paneles paralelos temporalmente |
| Migrar CRM a `/admin/**` | Un solo panel de admin para todo | Trabajo extra que no aporta valor al cliente, riesgo de regresiones |
| Migrar CRM a `/admin/crm/**` | Organización más clara | Mismo riesgo que opción anterior |

**Recomendación:** Mantener `/app/**` intacto durante Fase 1. La migración, si se desea, es Fase 2.

**Decisión requerida:** ¿Migramos el CRM a `/admin` ahora o lo dejamos en `/app` por ahora?

---

## DECISIÓN 7 — Storage de archivos: Supabase Storage vs. S3

**Impacto:** Medio · **Reversibilidad:** Baja (migrar archivos entre proveedores es costoso)

| Opción | Costo | Setup | Pro |
|--------|-------|-------|-----|
| **Supabase Storage** (recomendado) | Incluido en plan | Minimal | Ya estamos en Supabase, RLS aplicable, SDK conocido |
| AWS S3 | $0.023/GB + transfers | AWS IAM | Más control, más barato a escala masiva |
| Cloudflare R2 | $0.015/GB, sin egress | CF setup | Precio agresivo, pero setup adicional |

**Recomendación: Supabase Storage** — consolida la stack, permite aplicar RLS a nivel de bucket, y el costo es despreciable para el volumen inicial.

**Decisión requerida:** ¿Supabase Storage o prefieres S3/R2?

---

## DECISIÓN 8 — Email de clientes: Resend solo vs. agregar proveedor de marketing

**Impacto:** Bajo · **Reversibilidad:** Alta

| Tipo de email | Resend | MailerLite / Brevo |
|---------------|--------|-------------------|
| Transaccional (confirmación de orden, reset) | ✅ Resend | — |
| Newsletter / secuencias de onboarding | ❌ No es su caso de uso | ✅ |

**Recomendación:** Resend para todo lo transaccional en Fase 1. Si se necesita email marketing (newsletters, secuencias), agregar MailerLite en Fase 2. No bloquea el lanzamiento.

**Decisión requerida:** ¿Necesitas email marketing en Fase 1 o es suficiente con transaccional?

---

## Resumen de decisiones

| # | Decisión | Recomendación | Urgencia |
|---|----------|--------------|---------|
| 1 | ORM | Drizzle (opción C) | 🔴 Antes de empezar 1A |
| 2 | CMS | Sanity | 🔴 Antes de empezar 1A |
| 3 | i18n estructura | Subdirectorio `/es/` | 🔴 Antes de empezar 1A |
| 4 | Reservas | Cal.com | 🟡 Antes de 1E |
| 5 | Pagos | Stripe primero, PayPal después | 🟡 Antes de 1D |
| 6 | CRM migration | Mantener `/app` por ahora | 🟢 Flexible |
| 7 | Storage | Supabase Storage | 🟡 Antes de 1E |
| 8 | Email marketing | Solo transaccional en Fase 1 | 🟢 Flexible |

**Mínimo para empezar:** Decisiones 1, 2 y 3 confirmadas.
