// Página de implementación de Kommo. Ángulo: pipeline de ventas, del anuncio al cierre.
// Visual propio: tablero kanban. Colores: marino + celeste + índigo.
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { getServiceBySlug } from "@/data/services"
import { waLink } from "@/lib/whatsapp"
import { CrmCrumbs, CrmJsonLd, CrmFaq, CrmPlans, CrmCrossLinks } from "./crm-shared"

export const KOMMO_FAQ = [
  {
    q: "¿En qué se diferencia Kommo de HubSpot o Salesforce?",
    a: "Kommo nació como CRM conversacional: WhatsApp, Instagram, Messenger y TikTok son el centro, no un complemento. Cada chat vive dentro de la ficha del lead y de su etapa en el pipeline. Es ideal si tu equipo vende conversando.",
  },
  {
    q: "¿Los leads de mis anuncios de Meta pueden llegar solos a Kommo?",
    a: "Sí. Conectamos tus formularios instantáneos de Facebook e Instagram para que cada lead entre al pipeline con sus datos, se asigne a un vendedor y reciba el primer mensaje por WhatsApp sin que nadie lo copie a mano.",
  },
  {
    q: "¿Qué es el Salesbot de Kommo?",
    a: "Es el bot sin código de Kommo. Saluda, hace preguntas, guarda las respuestas en la ficha del lead, lo mueve de etapa y envía seguimientos. Lo diseñamos con tus mensajes y lo combinamos con el agente de IA de Kommo cuando tiene sentido.",
  },
  {
    q: "¿Pueden pasar mis contactos desde otro CRM o desde Excel?",
    a: "Sí. Migramos contactos, leads y etapas desde hojas de cálculo, HubSpot, Pipedrive y otros CRM. El volumen y lo ordenados que estén los datos definen el tiempo y si hay un costo extra.",
  },
  {
    q: "¿Mis vendedores pueden usar Kommo desde el celular?",
    a: "Sí. Kommo tiene app para Android y iPhone. Los vendedores responden chats, mueven leads y ven sus tareas desde el teléfono, y el gerente ve el tablero completo.",
  },
  {
    q: "¿La licencia de Kommo está incluida?",
    a: "No. La suscripción de Kommo se contrata directamente con ellos y queda a tu nombre. Nosotros cobramos la implementación, una sola vez.",
  },
]

type BoardCard = { n: string; s: string; v: string; bot?: boolean; won?: boolean }

const BOARD: { t: string; n: number; cards: BoardCard[] }[] = [
  { t: "Nuevo lead", n: 3, cards: [{ n: "Ana P.", s: "Meta Lead Ads", v: "Plan anual" }, { n: "Luis R.", s: "WhatsApp", v: "Consulta" }] },
  { t: "Contactado", n: 2, cards: [{ n: "Sofía T.", s: "Instagram", v: "Demo agendada", bot: true }] },
  { t: "Propuesta", n: 2, cards: [{ n: "Grupo Andes", s: "Web", v: "Propuesta enviada" }] },
  { t: "Ganado", n: 1, cards: [{ n: "Clínica Sur", s: "Referido", v: "¡Cerrado!", won: true }] },
]

const FLOW = [
  { k: "ANUNCIO", t: "Meta Ads", d: "Formulario instantáneo en Facebook o Instagram." },
  { k: "ENTRA", t: "Kommo crea el lead", d: "Con nombre, teléfono y respuestas del formulario." },
  { k: "SALUDA", t: "Salesbot por WhatsApp", d: "Primer mensaje automático y preguntas clave." },
  { k: "ASIGNA", t: "Vendedor", d: "Por turnos, por zona o por producto." },
  { k: "CIERRA", t: "Ganado", d: "La venta queda registrada con su valor." },
  { k: "APRENDE", t: "Vuelve a Meta", d: "Opcional: la venta se envía por Conversions API." },
]

const PIPELINES = [
  { name: "Inmobiliaria", bg: "#D6EBFF", stages: ["Nuevo", "Calificado", "Visita agendada", "Oferta", "Reserva", "Vendido"] },
  { name: "Clínica o consultorio", bg: "#E4DEFF", stages: ["Consulta", "Valoración agendada", "Asistió", "Presupuesto", "Tratamiento", "Control"] },
  { name: "Academia o cursos", bg: "#D3F2E3", stages: ["Interesado", "Clase muestra", "Inscripción", "Pago", "Alumno activo", "Renovación"] },
]

const RULES = [
  { if: "entra un lead de Meta Lead Ads", then: "se crea en «Nuevo», se asigna por turnos y el Salesbot le escribe por WhatsApp." },
  { if: "un lead pasa un día sin respuesta en «Contactado»", then: "se crea una tarea para el vendedor y se avisa al gerente." },
  { if: "el cliente escribe «precio»", then: "el Salesbot envía la lista y pregunta qué producto le interesa." },
  { if: "el lead pasa a «Propuesta»", then: "se programa un seguimiento automático a los dos días." },
  { if: "se marca «Ganado»", then: "sale el mensaje de agradecimiento y, si quieres, la venta vuelve a Meta." },
  { if: "se marca «Perdido»", then: "se pide el motivo y el lead entra a una lista de reactivación." },
]

function KanbanMock() {
  return (
    <div className="km-board" role="img" aria-label="Ejemplo de pipeline de ventas en Kommo con leads en las etapas Nuevo, Contactado, Propuesta y Ganado">
      {BOARD.map((col, i) => (
        <div key={col.t} className={`km-col${i === 3 ? " won" : ""}`}>
          <div className="km-col-h"><b>{col.t}</b><span className="ck-mono">{col.n}</span></div>
          {col.cards.map((c) => (
            <div key={c.n} className={`km-card${c.won ? " is-won" : ""}`}>
              <b>{c.n}</b>
              <span className="ck-mono km-src">{c.s}</span>
              <span className="km-v">{c.v}</span>
              {c.bot && <span className="km-bot ck-mono">SALESBOT ✓</span>}
            </div>
          ))}
          {i === 0 && <div className="km-card km-moving" aria-hidden="true"><b>Nuevo lead</b><span className="ck-mono km-src">Meta Lead Ads</span></div>}
        </div>
      ))}
    </div>
  )
}

export function KommoPage() {
  const service = getServiceBySlug("kommo")!
  return (
    <MarketingLayout
      active="crm-whatsapp"
      whatsapp={{ message: "¿Tus leads se pierden entre chats y hojas de cálculo? Te mostramos cómo quedaría tu pipeline en Kommo.", replies: ["Quiero Kommo", "Vengo de otro CRM", "Ver planes"] }}
    >
      <CrmJsonLd slug="kommo" name="Implementación de Kommo CRM" description="Implementación de Kommo CRM: pipelines a medida, WhatsApp, Meta Lead Ads, Salesbot, automatizaciones de seguimiento y capacitación por rol para equipos de ventas." faq={KOMMO_FAQ} />

      {/* ── Hero ── */}
      <section className="km-hero">
        <div className="km-hero-dots" aria-hidden="true" />
        <div className="ck-wrap">
          <div className="km-crumbs"><CrmCrumbs name="Kommo CRM" /></div>
          <div className="km-hero-grid">
            <div>
              <span className="ck-tag km-tag">[KOMMO] · CRM DE VENTAS</span>
              <h1>Cada lead en su etapa. Cada vendedor sabe <span className="km-hl">qué sigue</span>.</h1>
              <p className="km-lead">
                Implementamos Kommo con un pipeline hecho a la medida de cómo vendes, tus chats de WhatsApp dentro de cada ficha, los leads de Meta entrando solos y un Salesbot que hace el primer contacto y los seguimientos.
              </p>
              <div className="crm-ctas">
                <a className="ck-btn ck-btn-primary on-dark" href={waLink("Hola, quiero implementar Kommo CRM")} target="_blank" rel="noopener noreferrer">Arma mi pipeline →</a>
                <a className="ck-btn km-btn-ghost" href="#del-anuncio-al-cierre">Ver cómo funciona</a>
              </div>
            </div>
            <div className="km-hero-vis">
              <KanbanMock />
              <span className="crm-sticker km-st ck-hand">este lead llegó<br />solo del anuncio ↑</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Del anuncio al cierre ── */}
      <section id="del-anuncio-al-cierre" className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head crm-head-split">
            <div>
              <span className="ck-eyebrow">Del anuncio al cierre</span>
              <h2>Nadie copia leads a mano. Nadie olvida un seguimiento.</h2>
            </div>
            <p>Así fluye un lead cuando Kommo está bien conectado con tus anuncios y tu WhatsApp.</p>
          </div>
          <ol className="km-flow">
            {FLOW.map((f, i) => (
              <li key={f.k} className={i === FLOW.length - 1 ? "is-loop" : ""}>
                <span className="ck-mono km-flow-k">{String(i + 1).padStart(2, "0")} · {f.k}</span>
                <strong>{f.t}</strong>
                <p>{f.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Pipelines por industria ── */}
      <section className="ck-section km-pipes-sec">
        <div className="ck-wrap">
          <div className="crm-head">
            <span className="ck-eyebrow">Tu pipeline, no uno genérico</span>
            <h2>Las etapas salen de cómo vendes tú.</h2>
            <p className="crm-sub">Antes de tocar Kommo, mapeamos tu proceso comercial. Estos son ejemplos de lo que sale de esa sesión:</p>
          </div>
          <div className="km-pipes">
            {PIPELINES.map((p) => (
              <article key={p.name} className="km-pipe" style={{ background: p.bg }}>
                <h3>{p.name}</h3>
                <ol>
                  {p.stages.map((s, i) => <li key={s}><span className="ck-mono">{i + 1}</span>{s}</li>)}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Automatizaciones ── */}
      <section className="ck-section">
        <div className="ck-wrap km-rules-wrap">
          <div className="crm-head">
            <span className="ck-eyebrow">Automatizaciones</span>
            <h2>Reglas que dejamos corriendo desde el primer día.</h2>
            <p className="crm-sub">Las ajustamos a tu proceso. Estas son las que casi todos los equipos terminan usando.</p>
          </div>
          <div className="km-rules" role="table" aria-label="Ejemplos de automatizaciones en Kommo">
            {RULES.map((r) => (
              <div key={r.if} className="km-rule" role="row">
                <span role="cell" className="km-if"><b className="ck-mono">SI</b>{r.if}</span>
                <span role="cell" className="km-arrow" aria-hidden="true">→</span>
                <span role="cell" className="km-then"><b className="ck-mono">ENTONCES</b>{r.then}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capacitación por rol ── */}
      <section className="ck-section km-roles-sec">
        <div className="ck-wrap">
          <div className="crm-head">
            <span className="ck-eyebrow">Capacitación</span>
            <h2>Cada quien aprende lo suyo.</h2>
          </div>
          <div className="km-roles">
            <article className="km-role">
              <span className="ck-tag">[VENDEDOR]</span>
              <h3>Su día a día en Kommo</h3>
              <ul>
                <li>Responder chats desde la ficha del lead.</li>
                <li>Mover leads de etapa y completar los campos clave.</li>
                <li>Usar plantillas, respuestas rápidas y la app móvil.</li>
                <li>Trabajar con tareas para no olvidar ningún seguimiento.</li>
              </ul>
            </article>
            <article className="km-role km-role-dark">
              <span className="ck-tag">[GERENTE]</span>
              <h3>Control del equipo y del embudo</h3>
              <ul>
                <li>Leer el pipeline y detectar dónde se frenan las ventas.</li>
                <li>Revisar la actividad y los tiempos de respuesta de cada vendedor.</li>
                <li>Ajustar reglas de asignación y el Salesbot.</li>
                <li>Armar reportes por fuente, etapa y vendedor.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="planes" className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head crm-head-split">
            <div>
              <span className="ck-eyebrow">Inversión</span>
              <h2>Planes de implementación de Kommo</h2>
            </div>
            <p>Un solo pago por dejar Kommo funcionando. Precios en USD; la licencia de Kommo va aparte y a tu nombre.</p>
          </div>
          <CrmPlans plans={service.es.plans} variant="columns" accent="#D6EBFF" waLabel="Kommo" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ck-section km-faq-sec">
        <div className="ck-wrap crm-faq-grid">
          <div className="crm-faq-side">
            <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}>Preguntas frecuentes</span>
            <h2>Antes de mudar tus ventas a Kommo.</h2>
            <a className="ck-btn ck-btn-wa" href={waLink("Hola, tengo una pregunta sobre Kommo")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Pregúntanos</a>
          </div>
          <CrmFaq items={KOMMO_FAQ} tone="dark" />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="crm-cta crm-cta-sky">
        <div className="ck-wrap crm-cta-grid">
          <div>
            <h2>Tu pipeline, dibujado en 15 minutos.</h2>
            <p>Cuéntanos cómo vendes hoy y te devolvemos las etapas y automatizaciones que pondríamos en tu Kommo.</p>
          </div>
          <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero que me ayuden a diseñar mi pipeline en Kommo")} target="_blank" rel="noopener noreferrer">Diseñemos mi pipeline →</a>
        </div>
        <div className="ck-wrap"><CrmCrossLinks current="kommo" /></div>
      </section>
    </MarketingLayout>
  )
}
