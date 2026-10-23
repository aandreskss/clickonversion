# ClicKonversion — Modelo de Seguridad (Fase 1)

> Estado: Borrador para aprobación · Actualizado: 2026-10-21

---

## Capas de seguridad

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Red / Infraestructura   Cloudflare + Vercel Edge            │
├─────────────────────────────────────────────────────────────────┤
│  2. Transporte              HTTPS / HSTS (ya configurado)       │
├─────────────────────────────────────────────────────────────────┤
│  3. Auth de plataforma      Supabase Auth (JWT + cookies)       │
├─────────────────────────────────────────────────────────────────┤
│  4. Autorización de ruta    proxy.ts — middleware Next.js 16    │
├─────────────────────────────────────────────────────────────────┤
│  5. Autorización de datos   App-level checks + RLS (CRM)        │
├─────────────────────────────────────────────────────────────────┤
│  6. Validación de input     Zod en API routes + Server Actions  │
├─────────────────────────────────────────────────────────────────┤
│  7. Seguridad de pagos      Stripe/PayPal HMAC webhooks         │
├─────────────────────────────────────────────────────────────────┤
│  8. Auditoría               pf_audit_log para acciones críticas │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Autenticación

### Proveedor
**Supabase Auth** — JWT almacenado en cookies HttpOnly (gestionado por `@supabase/ssr`).

### Flujos de auth

| Flujo | Implementación | Estado |
|-------|---------------|--------|
| Login con email + password | Supabase Auth | ✅ Existente |
| OAuth (Google) | Supabase Auth | 🔲 Por añadir (opcional) |
| Magic link | Supabase Auth | 🔲 Por evaluar |
| Registro de clientes | Supabase Auth + Server Action | 🔲 Por construir |
| Verificación de email | Supabase Auth (built-in) | 🔲 Por activar |
| Reset de contraseña | Supabase Auth + email Resend | 🔲 Por construir |

### Distinción usuario interno vs. cliente

La diferencia NO está en Supabase Auth (todos los usuarios usan el mismo sistema). La distinción está en `pf_platform_users.platform_role`:

```typescript
type PlatformRole = 'admin' | 'staff' | 'client'
```

Reglas:
- Registro público (`/signup`) → crea usuario con `platform_role = 'client'`
- Usuarios `admin` / `staff` se crean manualmente (no hay registro público para roles internos)
- El middleware valida el rol antes de permitir acceso a `/admin/**`

---

## 2. Autorización de rutas (middleware)

El `proxy.ts` actual protege `/app/**`. Se debe ampliar para cubrir las nuevas rutas:

```typescript
// proxy.ts — lógica de autorización ampliada
const path = request.nextUrl.pathname

// Rutas CRM internas — solo admin/staff
if (path.startsWith('/app') && !user) {
  return redirect('/login')
}

// Portal de clientes — cualquier usuario autenticado
if (path.startsWith('/portal') && !user) {
  return redirect('/login?next=' + path)
}

// Panel admin — solo admin/staff
if (path.startsWith('/admin')) {
  if (!user) return redirect('/login')
  const role = await getPlatformRole(user.id)  // query a pf_platform_users
  if (role !== 'admin' && role !== 'staff') {
    return redirect('/portal')  // cliente que intenta acceder a admin → portal
  }
}
```

**Importante:** El check de `platform_role` en middleware requiere una query a Supabase en cada request protegido. Para evitar latencia, el rol se puede incluir en el JWT como claim personalizado (Supabase permite custom claims via database hooks).

---

## 3. Aislamiento de datos entre organizaciones clientes

### Principio
Un usuario pertenece a una organización. No puede ver ni modificar datos de otra organización.

### Implementación

```typescript
// src/lib/platform/auth.ts
export async function getClientContext(userId: string) {
  const member = await db.query.pf_client_org_members.findFirst({
    where: eq(pf_client_org_members.user_id, userId),
    with: { org: true }
  })
  if (!member) throw new UnauthorizedError('No org membership')
  return { orgId: member.org_id, role: member.role, org: member.org }
}

// Uso en Server Actions y API routes:
export async function getProjectAction(projectId: string) {
  const { orgId } = await getClientContext(getCurrentUserId())
  
  const project = await db.query.pf_projects.findFirst({
    where: and(
      eq(pf_projects.id, projectId),
      eq(pf_projects.client_org_id, orgId)  // ← siempre filtrar por orgId
    )
  })
  
  if (!project) throw new NotFoundError()
  return project
}
```

**Regla de oro**: Nunca confiar en `org_id` de query params. Siempre resolverlo desde la sesión del usuario.

---

## 4. Seguridad de pagos

### Stripe

```
Cliente → Stripe.js (client-side tokenization)
       → /api/checkout/stripe (server-side: crea PaymentIntent)
       → Stripe confirma pago
       → Stripe → /api/webhooks/stripe (HMAC signature verification)
       → Server actualiza estado del pedido
```

Reglas de implementación:
1. **Nunca** exponer `STRIPE_SECRET_KEY` al cliente
2. El webhook verifica la firma con `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`
3. Todos los eventos se registran en `pf_webhook_events` **antes** de procesarlos (idempotencia)
4. Si un `event_id` ya existe en `pf_webhook_events`, retornar 200 sin reprocesar
5. El `amount` siempre se recalcula server-side — nunca confiar en el precio enviado por el cliente

```typescript
// /api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }
  
  // Idempotencia
  const existing = await db.query.pf_webhook_events.findFirst({
    where: and(
      eq(pf_webhook_events.provider, 'stripe'),
      eq(pf_webhook_events.event_id, event.id)
    )
  })
  if (existing?.processed) return new Response('Already processed', { status: 200 })
  
  // Registrar evento
  await db.insert(pf_webhook_events).values({
    provider: 'stripe', event_id: event.id, event_type: event.type, payload: event
  })
  
  // Procesar...
}
```

### PayPal

```
Cliente → PayPal JS SDK (tokenization)
       → /api/checkout/paypal (server: crea order)
       → PayPal confirma
       → /api/checkout/paypal/capture (server: captura)
       → PayPal → /api/webhooks/paypal (verificación)
```

La captura siempre es server-side — nunca client-side.

---

## 5. Validación de inputs

### Reglas
- Toda mutación (Server Action o API route) valida con Zod antes de tocar la DB
- La validación client-side es solo UX (nunca seguridad)
- Los types de Drizzle no reemplazan la validación de Zod (el ORM puede recibir datos untrusted)

```typescript
// Ejemplo: schema para crear pedido
const createOrderSchema = z.object({
  serviceIds: z.array(z.uuid()).min(1).max(10),
  paymentMethod: z.enum(['stripe', 'paypal']),
  billingAddress: z.object({
    line1: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    country: z.string().length(2),
    postalCode: z.string().min(3).max(20),
  }),
})
```

---

## 6. Protección de formularios públicos

Heredado de Fase 0, se mantiene:

| Formulario | Protección |
|-----------|-----------|
| `/api/audit` | Turnstile CAPTCHA + Honeypot + Rate limiting (5 req/60s/IP) |
| `/signup` | Turnstile CAPTCHA + Rate limiting |
| `/forgot-password` | Rate limiting estricto (3 req/hora/IP) |
| `/contact` | Turnstile CAPTCHA + Honeypot |

---

## 7. Secrets y variables de entorno

### Reglas no negociables (heredadas de Fase 0)
- Variables `NEXT_PUBLIC_*` son visibles en el bundle del cliente. Nunca poner secrets aquí.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` → **server-only, nunca `NEXT_PUBLIC_`**
- El `.env.local` nunca se commitea. `.env.example` contiene solo keys sin valores.

### Acceso a variables por contexto

| Variable | Client | Server Component | API Route / Action |
|----------|--------|-----------------|-------------------|
| `NEXT_PUBLIC_*` | ✅ | ✅ | ✅ |
| `STRIPE_SECRET_KEY` | ❌ | ❌ | ✅ |
| `DATABASE_URL` | ❌ | ✅ (server-only) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ❌ | ✅ (API routes) |

---

## 8. Headers de seguridad HTTP

Ya configurados en `next.config.ts`:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Adicional recomendado para Fase 1:
```
Content-Security-Policy: (definir tras integrar Stripe y PayPal JS)
```

Stripe y PayPal requieren permisos explícitos de CSP para sus dominios — definir política tras pruebas.

---

## 9. Auditoría

Toda acción crítica se registra en `pf_audit_log`:

| Evento | Registrado |
|--------|-----------|
| Pedido creado | ✅ |
| Pedido cancelado | ✅ |
| Pedido reembolsado | ✅ |
| Suscripción creada/cancelada | ✅ |
| Proyecto creado/actualizado | ✅ |
| Usuario creado/suspendido | ✅ |
| Acceso admin a datos de cliente | ✅ |
| Descarga de archivo por cliente | ✅ |

---

## 10. GDPR / Privacidad de datos (mercado global)

Dado que la plataforma opera en mercado global (incluye España/LATAM):

- Política de privacidad actualizada para incluir datos de pago y procesadores (Stripe, PayPal)
- Los datos de tarjeta **nunca** pasan por los servidores de ClicKonversion (Stripe.js tokeniza en client-side)
- `billing_address` se almacena en Supabase (dato personal → sujeto a GDPR)
- Derecho de borrado: proceso manual inicial; automatizar en Fase 2
- Cookie banner: necesario para GA4 en visitas europeas (implementar con `next-intl` y consentimiento)

---

## Checklist de seguridad por feature

Antes de hacer deploy de cada feature nueva:

- [ ] ¿Todos los endpoints validan con Zod?
- [ ] ¿Las queries de Drizzle filtran siempre por `org_id` de la sesión?
- [ ] ¿Los webhooks verifican firma HMAC?
- [ ] ¿Los eventos de webhook son idempotentes (`pf_webhook_events`)?
- [ ] ¿Los errores que se devuelven al cliente no revelan detalles internos?
- [ ] ¿Las nuevas variables de entorno secret tienen `NEXT_PUBLIC_` deshabilitado?
- [ ] ¿El proxy.ts cubre las nuevas rutas protegidas?
- [ ] ¿Los uploads de archivos validan tipo MIME y tamaño server-side?
