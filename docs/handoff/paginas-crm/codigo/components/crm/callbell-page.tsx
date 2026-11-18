// Página de implementación de Callbell. Ángulo: un solo WhatsApp atendido por todo el equipo.
// Visual propio: bandeja compartida. Color de servicio: menta (chat).
import Link from "next/link"
import Image from "next/image"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { getServiceBySlug } from "@/data/services"
import { waLink } from "@/lib/whatsapp"
import { CrmCrumbs, CrmJsonLd, CrmFaq, CrmPlans, CrmCrossLinks } from "./crm-shared"

export const CALLBELL_FAQ = [
  {
    q: "¿Callbell se conecta a la API oficial de WhatsApp?",
    a: "Sí. Callbell se conecta a la API oficial de WhatsApp Business de Meta (Cloud API). Por eso tu número queda verificado, puedes usar plantillas aprobadas y varias personas pueden atender al mismo tiempo sin riesgo de bloqueos por usar apps no oficiales.",
  },
  {
    q: "¿Puedo seguir usando la app de WhatsApp Business en el celular?",
    a: "Sí, con la coexistencia de Meta. El mismo número funciona en la app del celular y en Callbell a la vez: los mensajes aparecen en los dos lados y no pierdes el historial. Nosotros hacemos el alta y revisamos que el registro quede bien hecho, que es donde suele fallar.",
  },
  {
    q: "¿Cuánto tarda la implementación?",
    a: "Entre 5 y 10 días hábiles. Lo que más mueve el tiempo es Meta: la verificación del negocio y la aprobación del número y las plantillas. La configuración de Callbell en sí la dejamos lista en pocos días.",
  },
  {
    q: "¿Callbell reemplaza a un CRM de ventas?",
    a: "Callbell es una bandeja multiagente con embudos, etiquetas y bots, y para muchos negocios es todo lo que necesitan. Si tu equipo trabaja con un pipeline largo, con tareas y pronósticos, lo conectamos con HubSpot, Pipedrive u otro CRM, o te recomendamos Kommo.",
  },
  {
    q: "¿Qué canales puedo atender desde Callbell?",
    a: "WhatsApp, Instagram Direct, Facebook Messenger, Telegram, TikTok y el chat de tu web, todo en la misma bandeja. Conectamos los que uses hoy y dejamos el resto listo para cuando los necesites.",
  },
  {
    q: "¿La suscripción de Callbell está incluida en el precio?",
    a: "No. La suscripción la contratas directamente con Callbell y queda a tu nombre. Nosotros cobramos la implementación, la configuración y la capacitación, una sola vez.",
  },
]

const PAINS = [
  { t: "Un celular, cinco personas", d: "El WhatsApp del negocio vive en un teléfono y todos se lo pasan." },
  { t: "Chats que nadie respondió", d: "Cada uno pensó que el otro ya había contestado." },
  { t: "¿Quién le dijo qué?", d: "No hay notas ni historial por cliente, así que nadie sabe en qué quedó." },
  { t: "Leads que se enfrían", d: "Los mensajes de tus anuncios llegan mezclados con los de soporte." },
]

const MODULES = [
  { tag: "BANDEJA", t: "Equipos y bandejas", d: "Ventas, soporte y cobranza separados, cada uno con sus agentes y permisos.", bg: "#D3F2E3" },
  { tag: "REGLAS", t: "Asignación automática", d: "Cada chat nuevo llega a la persona correcta según el canal, la etiqueta o el horario.", bg: "#fff" },
  { tag: "ORDEN", t: "Etiquetas y embudos", d: "Sabes en qué etapa está cada conversación y filtras en segundos.", bg: "#fff" },
  { tag: "BOTS", t: "Bot y agente de IA", d: "Saluda, pregunta lo básico y pasa a un humano cuando hace falta.", bg: "#E4DEFF" },
  { tag: "DIFUSIÓN", t: "Campañas con plantillas", d: "Mensajes masivos con plantillas aprobadas por Meta, sin listas de difusión a mano.", bg: "#fff" },
  { tag: "CONEXIONES", t: "Integraciones y API", d: "Webhooks, API y Zapier para conectar tu CRM, tu tienda o tus hojas de cálculo.", bg: "#D6EBFF" },
]

const STEPS = [
  { d: "DÍA 1", t: "Diagnóstico", x: "Vemos cuántas personas atienden, por qué canales te escriben y cómo vendes hoy." },
  { d: "DÍAS 2–4", t: "Número y canales", x: "Conectamos la API oficial de WhatsApp (o la coexistencia) y el resto de canales." },
  { d: "DÍAS 4–6", t: "Reglas y bots", x: "Equipos, asignaciones, etiquetas, respuestas rápidas y el bot de bienvenida." },
  { d: "DÍAS 6–8", t: "Integraciones", x: "Conectamos tu CRM, tu tienda o tus formularios por API, webhooks o Zapier." },
  { d: "ENTREGA", t: "Capacitación", x: "Entrenamos al equipo con sus propios chats y te dejamos todo documentado." },
]

function InboxMock() {
  const chats = [
    { n: "María G.", m: "¿Tienen la talla 38?", tag: "Ventas", who: "YL", c: "#D3F2E3", on: true },
    { n: "Lead · anuncio", m: "Hola, vi su anuncio 👋", tag: "Bot", who: "IA", c: "#E4DEFF" },
    { n: "Pedro R.", m: "Mi pedido no ha llegado", tag: "Soporte", who: "AB", c: "#D6EBFF" },
    { n: "Carla M.", m: "Perfecto, ya transferí", tag: "Pagos", who: "AC", c: "#FFDCC7" },
  ]
  return (
    <div className="cb-inbox" role="img" aria-label="Ejemplo de bandeja compartida de Callbell con chats asignados a distintos agentes">
      <div className="cb-inbox-top">
        <span className="ck-mono">BANDEJA COMPARTIDA</span>
        <span className="cb-agents"><i>YL</i><i>AB</i><i>AC</i><b className="ck-mono">3 en línea</b></span>
      </div>
      <div className="cb-inbox-body">
        <ul className="cb-list">
          {chats.map((c) => (
            <li key={c.n} className={c.on ? "on" : ""}>
              <span className="cb-av" style={{ background: c.c }}>{c.n[0]}</span>
              <span className="cb-li-t"><b>{c.n}</b><span>{c.m}</span></span>
              <span className="cb-li-r"><em className="ck-mono">{c.tag}</em><i>{c.who}</i></span>
            </li>
          ))}
        </ul>
        <div className="cb-chat">
          <div className="cb-chat-h"><b>María G.</b><span className="ck-mono">asignada a Yoli · Ventas</span></div>
          <p className="cb-msg in">Hola! ¿Tienen la talla 38 en el modelo negro?</p>
          <p className="cb-msg out">¡Hola María! Sí, nos quedan 2 pares. ¿Te lo aparto?</p>
          <p className="cb-note"><span className="ck-mono">NOTA INTERNA</span> Clienta frecuente, ofrecer envío gratis.</p>
          <div className="cb-typing"><i /><i /><i /></div>
        </div>
      </div>
    </div>
  )
}

export function CallbellPage() {
  const service = getServiceBySlug("callbell")!
  return (
    <MarketingLayout
      active="crm-whatsapp"
      whatsapp={{ message: "¿Tu equipo atiende el WhatsApp desde un solo celular? Te cuento cómo lo ordenamos con Callbell.", replies: ["Quiero Callbell", "¿Funciona con mi número?", "Ver planes"] }}
    >
      <CrmJsonLd slug="callbell" name="Implementación de Callbell para WhatsApp" description="Implementación de Callbell: WhatsApp multiagente con API oficial, coexistencia, asignación automática, bots e integraciones para equipos de ventas y soporte." faq={CALLBELL_FAQ} />

      {/* ── Hero ── */}
      <section className="cb-hero">
        <div className="ck-wrap">
          <CrmCrumbs name="Callbell" />
          <div className="cb-hero-grid">
            <div className="cb-hero-txt">
              <span className="ck-tag">[CALLBELL] · WHATSAPP MULTIAGENTE</span>
              <h1>Todo tu equipo en <span className="crm-mark-mint">un solo WhatsApp</span>. Sin perder un chat.</h1>
              <p className="crm-lead">
                Implementamos Callbell para que ventas y soporte atiendan el mismo número desde una bandeja compartida, con la API oficial de WhatsApp, asignación automática, etiquetas y bots. ¿No quieres soltar la app del celular? Activamos la coexistencia.
              </p>
              <div className="crm-ctas">
                <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero implementar Callbell en mi negocio")} target="_blank" rel="noopener noreferrer">Quiero Callbell →</a>
                <a className="ck-btn ck-btn-line" href="#planes">Ver planes</a>
              </div>
              <p className="crm-fine ck-mono">Implementación en 5–10 días hábiles · la suscripción de Callbell va a tu nombre</p>
            </div>
            <div className="cb-hero-vis">
              <InboxMock />
              <span className="crm-sticker cb-st1 ck-hand">lo conocemos<br />por dentro ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Antes / después ── */}
      <section className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head">
            <span className="ck-eyebrow">El problema</span>
            <h2>¿Te suena alguna de estas?</h2>
          </div>
          <div className="cb-before">
            <div className="cb-pains">
              {PAINS.map((p, i) => (
                <div key={p.t} className="cb-pain">
                  <span className="ck-mono">0{i + 1}</span>
                  <strong>{p.t}</strong>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
            <div className="cb-after">
              <span className="ck-mono cb-after-tag">CON CALLBELL BIEN CONFIGURADO</span>
              <ul>
                <li><b>Un número, todo el equipo.</b> Cada persona entra desde su computadora o su celular.</li>
                <li><b>Ningún chat sin dueño.</b> Las reglas reparten las conversaciones y avisan si alguna espera.</li>
                <li><b>Historial y notas por cliente.</b> Cualquiera retoma la conversación donde quedó.</li>
                <li><b>Los leads aparte.</b> Los que vienen de anuncios llegan etiquetados a ventas.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Módulos ── */}
      <section className="ck-section cb-mods-sec">
        <div className="ck-wrap">
          <div className="crm-head crm-head-split">
            <div>
              <span className="ck-eyebrow">Lo que dejamos configurado</span>
              <h2>Seis piezas, una bandeja que se ordena sola.</h2>
            </div>
            <p>No entregamos una cuenta vacía. Dejamos Callbell armado con tus equipos, tus horarios, tus etiquetas y tus mensajes.</p>
          </div>
          <div className="cb-mods">
            {MODULES.map((m, i) => (
              <article key={m.t} className="cb-mod" style={{ background: m.bg }}>
                <span className="ck-mono cb-mod-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ck-tag">[{m.tag}]</span>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coexistencia ── */}
      <section className="cb-coex">
        <div className="ck-wrap cb-coex-grid">
          <div>
            <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}>Coexistencia de WhatsApp</span>
            <h2>La app en tu celular <span className="ck-hand cb-y">y</span> la API en Callbell. Mismo número.</h2>
            <p>
              Meta permite usar la app de WhatsApp Business y la API oficial al mismo tiempo. Tú sigues contestando desde el teléfono cuando quieras, y tu equipo atiende desde Callbell con reglas, bots y campañas. El historial no se pierde.
            </p>
            <p className="cb-coex-warn">
              <b>Dónde suele fallar:</b> el registro no se hace en modo coexistencia, el número tiene activo el etiquetado automático de eventos o falta el método de pago en la cuenta. Ya lo resolvimos en otros negocios; lo revisamos antes de conectar.
            </p>
          </div>
          <div className="cb-coex-vis" aria-hidden="true">
            <div className="cb-phone">
              <span className="ck-mono">APP · CELULAR</span>
              <p className="cb-msg in">¿Hacen envíos a Valencia?</p>
              <p className="cb-msg out">¡Sí! Llega en 48 h 🚚</p>
            </div>
            <div className="cb-sync"><span>⇄</span><b className="ck-mono">MISMO NÚMERO</b></div>
            <div className="cb-desk">
              <span className="ck-mono">CALLBELL · EQUIPO</span>
              <p className="cb-msg in">¿Hacen envíos a Valencia?</p>
              <p className="cb-msg out">¡Sí! Llega en 48 h 🚚</p>
              <p className="cb-note"><span className="ck-mono">ETIQUETA</span> Envíos · Carabobo</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Por qué nosotros ── */}
      <section className="ck-section">
        <div className="ck-wrap cb-why">
          <div className="cb-why-card">
            <Image src="/team/arnaldo/06-sonrisa-gris.webp" alt="Arnaldo Casadiego" width={880} height={1100} sizes="(max-width: 760px) 40vw, 220px" />
            <div>
              <span className="ck-eyebrow">Por qué con nosotros</span>
              <h2>Callbell lo conocemos por dentro.</h2>
              <p>
                Arnaldo forma parte del equipo de Growth &amp; Marketing de Callbell: escribe contenido y graba los video tutoriales de la plataforma. Esa misma experiencia es la que usamos para dejar tu cuenta bien configurada desde el primer día.
              </p>
              <Link href="/about/arnaldo" className="crm-link">Conoce a Arnaldo →</Link>
            </div>
          </div>
          <div className="cb-cases">
            <span className="ck-eyebrow">Problemas que ya resolvimos</span>
            {[
              ["[WABA]", "La cuenta de WhatsApp no aparecía al conectarla: el número estaba como app y no como API, y faltaba el método de pago."],
              ["[COEXISTENCIA]", "El alta fallaba porque el registro no enviaba el parámetro de coexistencia que exige Meta."],
              ["[PAGOS]", "Los mensajes dejaron de salir: el método de pago se había desconectado de la cuenta de WhatsApp."],
            ].map(([t, d]) => (
              <div key={t} className="cb-case"><span className="ck-mono">{t}</span><p>{d}</p></div>
            ))}
            <Link href="/projects#consultoria" className="crm-link">Ver más casos →</Link>
          </div>
        </div>
      </section>

      {/* ── Proceso ── */}
      <section className="ck-section cb-steps-sec">
        <div className="ck-wrap">
          <div className="crm-head">
            <span className="ck-eyebrow">Cómo lo hacemos</span>
            <h2>De un celular compartido a una bandeja ordenada, en dos semanas o menos.</h2>
          </div>
          <ol className="cb-steps">
            {STEPS.map((s) => (
              <li key={s.t}><span className="ck-mono">{s.d}</span><strong>{s.t}</strong><p>{s.x}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="planes" className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head crm-head-split">
            <div>
              <span className="ck-eyebrow">Inversión</span>
              <h2>Planes de implementación de Callbell</h2>
            </div>
            <p>Pagas la implementación una sola vez. Precios en USD; la suscripción de Callbell se contrata aparte, directo con ellos.</p>
          </div>
          <CrmPlans plans={service.es.plans} variant="tickets" accent="#D3F2E3" waLabel="Callbell" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ck-section crm-faq-sec">
        <div className="ck-wrap crm-faq-grid">
          <div className="crm-faq-side">
            <span className="ck-eyebrow">Preguntas frecuentes</span>
            <h2>Lo que nos preguntan antes de pasar a Callbell.</h2>
            <a className="ck-btn ck-btn-wa" href={waLink("Hola, tengo una pregunta sobre Callbell")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Pregúntanos</a>
          </div>
          <CrmFaq items={CALLBELL_FAQ} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="crm-cta crm-cta-mint">
        <div className="ck-wrap crm-cta-grid">
          <div>
            <h2>Deja de pasarte el celular.</h2>
            <p>Cuéntanos cuántas personas atienden y por qué canales te escriben. Te decimos cómo quedaría tu bandeja.</p>
          </div>
          <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero ordenar el WhatsApp de mi equipo con Callbell")} target="_blank" rel="noopener noreferrer">Hablemos por WhatsApp →</a>
        </div>
        <div className="ck-wrap"><CrmCrossLinks current="callbell" /></div>
      </section>
    </MarketingLayout>
  )
}
