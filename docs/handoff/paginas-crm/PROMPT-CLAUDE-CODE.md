# Prompt para Claude Code

Copia todo lo que está dentro del bloque y pégalo en Claude Code, abierto en la carpeta del proyecto `clickonversion`.

```text
Vamos a dejar listas en producción las 3 páginas nuevas de plataformas CRM: /services/callbell, /services/kommo y /services/manychat. Trabaja SOLO en estas 3 páginas. No toques otras páginas, ni brand.css, ni el navbar, ni el resto de services.ts.

CONTEXTO
- Lee primero docs/handoff/paginas-crm/README.md. Es la especificación completa: ángulo de cada página, secciones, precios, reglas de SEO y comportamiento móvil.
- Las capturas de referencia están en docs/handoff/paginas-crm/capturas/ (escritorio 1440 px y móvil 390 px). La página terminada tiene que verse así.
- El código final ya debería estar en:
  - src/components/brand/crm/ (crm.css, crm-shared.tsx, callbell-page.tsx, kommo-page.tsx, manychat-page.tsx)
  - src/app/(marketing)/services/{callbell,kommo,manychat}/page.tsx
  Hay una copia exacta de referencia en docs/handoff/paginas-crm/codigo/.

PASOS
1. Compara cada archivo de src/ con su copia en docs/handoff/paginas-crm/codigo/. Si falta alguno o es distinto (por ejemplo, porque otra sesión lo sobrescribió con ServiceDetailLayout), restaura la versión de codigo/. Antes de sobrescribir, avísame qué cambió.
2. Revisa en src/data/services.ts que los planes de estas 3 plataformas tengan exactamente estos precios, en español y en inglés, y que el `note` diga que la herramienta se paga aparte:
   - callbell: Setup Básico "$199 (pago único)", Setup Profesional "$399 (pago único)", Enterprise "Personalizado"
   - kommo: Starter "$249 (pago único)", Growth "Desde $500 (pago único)", Enterprise "Personalizado"
   - manychat: Starter "$199 (pago único)", Growth "Desde $499 (pago único)"
   Solo corrige esos campos si no coinciden.
3. Corre `npx tsc --noEmit` y `npx eslint src/components/brand/crm "src/app/(marketing)/services/callbell" "src/app/(marketing)/services/kommo" "src/app/(marketing)/services/manychat"`. Arregla cualquier error sin cambiar el diseño.
4. Corre `npm run build` y confirma que las 3 rutas salen como estáticas (○).
5. Levanta el servidor y revisa las 3 páginas con Playwright a 360, 390, 768, 1024 y 1440 px:
   - Nada provoca scroll horizontal. Compara document.documentElement.scrollWidth con window.innerWidth; ignora los carruseles, que deslizan a propósito.
   - En ≤ 640 px los carruseles deslizan y la siguiente tarjeta asoma:
     - Callbell: las 6 piezas.
     - Kommo: los pipelines.
     - Manychat: disparadores, recetas y reglas.
   - En ≤ 640 px los botones del hero y de los planes ocupan todo el ancho.
   - El acordeón de preguntas frecuentes abre y cierra.
   - Los precios coinciden con el paso 2.
   Compara con las capturas de docs/handoff/paginas-crm/capturas/ y corrige cualquier diferencia visible.
6. SEO: revisa en el HTML generado de cada página que title, meta description, canonical, H1 y JSON-LD (Service + FAQPage + BreadcrumbList) existan y sean distintos entre las 3. No deben repetir textos entre sí.
7. Si service-detail-layout.tsx ya no lo importa ningún archivo, dímelo, pero NO lo borres.
8. Muéstrame un resumen de lo que verificaste o corregiste. Después haz UN commit solo con estos archivos:
   - src/components/brand/crm/
   - src/app/(marketing)/services/callbell/page.tsx
   - src/app/(marketing)/services/kommo/page.tsx
   - src/app/(marketing)/services/manychat/page.tsx
   - src/data/services.ts (solo si lo cambiaste en el paso 2 o ya tenía los precios nuevos sin commitear)
   - docs/handoff/paginas-crm/
   Mensaje: "feat(services): páginas únicas de Callbell, Kommo y Manychat con versión móvil optimizada"
   No incluyas .gitignore, CLAUDE.md, la carpeta o el zip "Tres decisiones creativas Click!" ni ningún otro archivo. No hagas push: yo lo hago.

REGLAS DE MARCA (no las rompas)
- El naranja #FE5C02 nunca es fondo de sección; solo va en botones, stickers, burbujas e isotipo.
- Tipografías: Outfit, Caveat y JetBrains Mono, ya cargadas en el layout.
- No inventes métricas, reseñas ni resultados.
- No uses los logos de Callbell, Kommo ni Manychat; solo sus nombres.
```
