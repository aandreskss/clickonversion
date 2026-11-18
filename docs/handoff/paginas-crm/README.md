# Páginas CRM — Callbell, Kommo y Manychat

Entrega de diseño y código de las 3 páginas de plataformas CRM, con versión de escritorio y versión móvil optimizada.

| Ruta | Ángulo de la página | Color | Visual principal |
|------|---------------------|-------|------------------|
| `/services/callbell` | Todo el equipo atendiendo un solo WhatsApp | Menta `#D3F2E3` | Bandeja compartida con chats asignados |
| `/services/kommo` | Pipeline de ventas: del anuncio al cierre | Marino `#010E25` + celeste `#D6EBFF` | Tablero kanban con una tarjeta que avanza sola |
| `/services/manychat` | Comentario «QUIERO» → mensaje directo automático | Durazno `#FFDCC7` + lavanda `#E4DEFF` | Reel de Instagram + DM automático y flujo por nodos |

## Qué hay en esta carpeta

```
docs/handoff/paginas-crm/
├── README.md                ← este archivo (especificación)
├── PROMPT-CLAUDE-CODE.md    ← prompt para que Claude Code lo implemente y verifique
├── capturas/                ← referencia visual (escritorio 1440 px y móvil 390 px)
└── codigo/                  ← copia de referencia del código final
    ├── components/crm/      → va en src/components/brand/crm/
    └── app/<slug>/page.tsx  → va en src/app/(marketing)/services/<slug>/page.tsx
```

El código ya está aplicado en `src/`. La carpeta `codigo/` es la copia de referencia por si alguna sesión lo sobrescribe.

## Archivos del proyecto

| Archivo | Qué hace |
|---------|----------|
| `src/components/brand/crm/crm.css` | Estilos de las 3 páginas (prefijos `crm-`, `cb-`, `km-`, `mc-`). Se importa desde `crm-shared.tsx`. No toca `brand.css`. |
| `src/components/brand/crm/crm-shared.tsx` | Piezas compartidas: migas de pan, JSON-LD, FAQ en acordeón, planes (3 variantes) y enlaces cruzados. |
| `src/components/brand/crm/callbell-page.tsx` | Página de Callbell. |
| `src/components/brand/crm/kommo-page.tsx` | Página de Kommo. |
| `src/components/brand/crm/manychat-page.tsx` | Página de Manychat. |
| `src/app/(marketing)/services/{callbell,kommo,manychat}/page.tsx` | Metadata (title, description, canonical, Open Graph) y render del componente. |
| `src/data/services.ts` | Fuente única de los precios de los planes (`es.plans` / `en.plans`). |

`src/components/brand/service-detail-layout.tsx` ya no lo usan estas páginas.

## SEO: cada página es única

Para que Google no las trate como contenido duplicado, ninguna comparte:

- `title`, `description` ni H1.
- Orden ni tipo de secciones (ver tabla abajo).
- Preguntas frecuentes: 6 propias por página, en `CALLBELL_FAQ`, `KOMMO_FAQ` y `MANYCHAT_FAQ`.
- Visuales, colores ni variante de planes (`tickets`, `columns` o `stack`).
- Mensaje del widget de WhatsApp (prop `whatsapp` de `MarketingLayout`).

Cada página emite JSON-LD con `Service`, `FAQPage` y `BreadcrumbList`, y tiene su `canonical`.

| Callbell | Kommo | Manychat |
|----------|-------|----------|
| Hero con bandeja compartida | Hero marino con kanban | Hero con reel + DM (visual a la izquierda) |
| «¿Te suena?» antes / después | Del anuncio al cierre (6 pasos) | 5 disparadores (comentarios, historias, DM, QR, IA) |
| 6 piezas que dejamos configuradas | Pipelines por industria | Un flujo por dentro (nodos) |
| Coexistencia app + API | Reglas SI → ENTONCES | Recetas por tipo de negocio |
| «Lo conocemos por dentro» + casos | Capacitación por rol | Las reglas de Meta que respetamos |
| Proceso en días | Planes en columnas | Planes como fichas |
| Planes tipo ticket | FAQ en marino | FAQ |
| FAQ + CTA menta | CTA celeste | CTA durazno |

## Precios (aprobados)

En todos los planes la herramienta se paga aparte. La suscripción de Callbell, Kommo o Manychat va a nombre del cliente.

| Página | Plan 1 | Plan 2 | Plan 3 |
|--------|--------|--------|--------|
| Callbell | Setup Básico **$199** | Setup Profesional **$399** | Enterprise · Personalizado |
| Kommo | Starter **$249** | Growth **desde $500** | Enterprise · Personalizado |
| Manychat | Starter **$199** | Growth **desde $499** | — |

## Versión móvil (≤ 640 px)

Está todo en el bloque «Versión móvil optimizada» al final de `crm.css`. Hay un ajuste extra a 380 px para teléfonos chicos.

- Botones del hero y de los planes a todo el ancho, uno debajo del otro.
- Menos espacio entre secciones (56 px) y títulos a 30 px.
- Carruseles deslizables con `scroll-snap` y la siguiente tarjeta asomando:
  - Callbell: las 6 piezas.
  - Kommo: los pipelines por industria.
  - Manychat: los disparadores, las recetas y las reglas.
- Callbell:
  - Los 4 problemas en una grilla 2×2.
  - El proceso como línea de tiempo vertical compacta.
  - La coexistencia muestra celular y Callbell lado a lado, con el ícono ⇄ al centro.
  - La tarjeta de Arnaldo con la foto pequeña junto al título.
- Kommo:
  - Kanban 2×2 sin la tarjeta animada.
  - Las reglas SI → ENTONCES como tarjetas apiladas.
- Manychat: el mock del reel es más bajo para que el DM no tape el texto.
- Respeta `prefers-reduced-motion`: sin animaciones del kanban ni de los «escribiendo…».

Resultado: el scroll en móvil bajó cerca de un 27 % frente a la primera versión.

## Reglas de marca que se respetan

- El naranja `#FE5C02` nunca es fondo de sección; solo va en botones, stickers, burbujas e isotipo.
- Tipografías: Outfit (voz), Caveat (notas a mano) y JetBrains Mono (etiquetas).
- No hay métricas ni reseñas inventadas. Los mocks son ilustraciones de interfaz.
- Los logos de Callbell, Kommo y Manychat no se usan; solo el nombre en texto.

## Checklist de QA

- [ ] `tsc --noEmit` y `eslint` sin errores en los archivos de arriba.
- [ ] `next build` genera `/services/callbell`, `/services/kommo` y `/services/manychat` como estáticas.
- [ ] Sin scroll horizontal a 360, 390, 768, 1024 y 1440 px.
- [ ] Los carruseles deslizan con el dedo y la siguiente tarjeta asoma.
- [ ] El acordeón de FAQ abre y cierra sin JavaScript.
- [ ] Los botones de WhatsApp llevan el texto correcto en `?text=`.
- [ ] Los precios coinciden con la tabla de arriba.
- [ ] En el código fuente de cada página, title, description y JSON-LD son distintos.
- [ ] El menú «CRM WhatsApp» del navbar sigue llevando a las 3 rutas.
