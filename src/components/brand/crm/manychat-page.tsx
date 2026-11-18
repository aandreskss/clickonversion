// Página de implementación de Manychat. Ángulo: convertir comentarios, historias y DMs en leads.
// Visual propio: publicación de Instagram + DM automático y un flujo por nodos. Colores: durazno + lavanda.
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { getServiceBySlug } from "@/data/services"
import { waLink } from "@/lib/whatsapp"
import { CrmCrumbs, CrmJsonLd, CrmFaq, CrmPlans, CrmCrossLinks } from "./crm-shared"

export const MANYCHAT_FAQ = [
  {
    q: "¿Cómo funciona la respuesta automática a comentarios?",
    a: "Eliges una palabra clave, por ejemplo «GUÍA». Cuando alguien la comenta en tu publicación o reel, Manychat le responde el comentario y le escribe por mensaje directo con lo que prometiste. Desde ahí sigue el flujo: preguntas, botones, captura de datos y la venta.",
  },
  {
    q: "¿Manychat es una herramienta oficial de Meta?",
    a: "Manychat es socio oficial de Meta y se conecta por las vías oficiales de Instagram, Messenger y la API de WhatsApp Business. Por eso respeta reglas como la ventana de 24 horas y las plantillas aprobadas, y nosotros diseñamos los flujos dentro de esas reglas.",
  },
  {
    q: "¿En qué canales funciona?",
    a: "Instagram, Facebook Messenger, WhatsApp, TikTok, Telegram, SMS y correo. Qué canales puedes usar depende de tu plan de Manychat y de tu país; te ayudamos a elegir el plan que cubre lo que necesitas sin pagar de más.",
  },
  {
    q: "¿El bot puede responder con inteligencia artificial?",
    a: "Sí. Manychat tiene pasos de IA que entienden lo que la persona quiere aunque no use la palabra exacta y responden con la información de tu negocio. Los usamos con límites claros y con paso a un humano cuando la conversación lo pide.",
  },
  {
    q: "¿Los contactos que capta el bot llegan a mi CRM?",
    a: "Sí. Los enviamos a Google Sheets, a tu CRM (HubSpot, Kommo, Pipedrive u otro) o a tu herramienta de correo con integraciones nativas, webhooks o la API, con etiquetas que dicen de qué publicación o campaña vino cada uno.",
  },
  {
    q: "¿La suscripción de Manychat está incluida?",
    a: "No. La suscripción la contratas directo con Manychat y queda a tu nombre. Nosotros cobramos el diseño, la construcción y la puesta en marcha de los flujos, una sola vez.",
  },
]

const TOOLS = [
  { k: "COMENTARIOS", t: "Palabra clave en comentarios", ex: "Comentan «GUÍA» en un reel → reciben la guía por DM.", bg: "#FFDCC7" },
  { k: "HISTORIAS", t: "Respuestas a historias", ex: "Responden tu historia con 🔥 → el bot les manda el link.", bg: "#E4DEFF" },
  { k: "DM", t: "Palabras clave por mensaje", ex: "Escriben «PRECIOS» → les llega la lista y una pregunta.", bg: "#fff" },
  { k: "LINKS Y QR", t: "Links y códigos QR", ex: "Escanean el QR del local → se abre el chat con una oferta.", bg: "#fff" },
  { k: "IA", t: "Paso de inteligencia artificial", ex: "Preguntan con sus palabras → la IA entiende y responde.", bg: "#D6EBFF" },
]

const RECIPES = [
  { t: "Cursos e infoproductos", d: "Clase gratis por comentario, secuencia de valor y link de pago a los más interesados.", k: "LEAD MAGNET" },
  { t: "Tiendas en línea", d: "Catálogo por DM, talla y color con botones, y el pedido pasa a WhatsApp.", k: "VENTA POR DM" },
  { t: "Servicios con agenda", d: "Preguntas de calificación y link para agendar solo a quien encaja.", k: "AGENDA" },
  { t: "Restaurantes y locales", d: "QR en la mesa, menú por chat, reservas y cupón para la próxima visita.", k: "QR + CUPÓN" },
]

const RULES = [
  { t: "La ventana de 24 horas", d: "En Instagram y Messenger el bot responde dentro de las 24 horas desde la última interacción. Diseñamos los flujos para que el valor llegue a tiempo." },
  { t: "Plantillas aprobadas en WhatsApp", d: "Fuera de la conversación activa, WhatsApp solo permite plantillas aprobadas por Meta. Las redactamos y las enviamos a aprobación." },
  { t: "Permiso antes de escribir", d: "Solo escribimos a quien pidió algo: comentó, respondió o hizo clic. Nada de mensajes masivos a quien no te conoce." },
  { t: "Siempre una salida a un humano", d: "Cada flujo tiene un botón o una palabra para hablar con una persona de tu equipo." },
]

function PostMock() {
  return (
    <div className="mc-stage" role="img" aria-label="Ejemplo: alguien comenta QUIERO en una publicación de Instagram y recibe un mensaje directo automático">
      <div className="mc-post">
        <div className="mc-post-h"><i /> <b>tumarca</b> <span className="ck-mono">· reel</span></div>
        <div className="mc-post-img"><span>Comenta<br /><b>QUIERO</b><br />y te envío<br />la guía</span></div>
        <ul className="mc-comments">
          <li><b>vale.ro</b> QUIERO 🙌 <em className="ck-mono">respondido ✓</em></li>
          <li><b>jose_mtz</b> quiero!! <em className="ck-mono">respondido ✓</em></li>
          <li className="mc-new"><b>laura.fit</b> QUIERO</li>
        </ul>
      </div>
      <div className="mc-dm">
        <div className="mc-dm-h"><b>tumarca</b><span className="ck-mono">mensaje directo</span></div>
        <p className="mc-b out">¡Hola Laura! Aquí tienes la guía 👇</p>
        <p className="mc-b out mc-file">📎 Guía-7-pasos.pdf</p>
        <p className="mc-b out">¿Quieres que te avise cuando abramos cupos?</p>
        <div className="mc-btns"><span>Sí, avísame</span><span>Solo la guía</span></div>
      </div>
    </div>
  )
}

function FlowMock() {
  return (
    <div className="mc-flow" role="img" aria-label="Ejemplo de flujo en Manychat: comentario, mensaje, pregunta, condición y dos caminos que terminan en el CRM">
      <div className="mc-node mc-trigger"><span className="ck-mono">DISPARADOR</span><b>Comentan «PRECIOS»</b></div>
      <div className="mc-wire" />
      <div className="mc-node"><span className="ck-mono">MENSAJE</span><b>Lista de precios + 2 botones</b></div>
      <div className="mc-wire" />
      <div className="mc-node"><span className="ck-mono">PREGUNTA</span><b>¿Cuál es tu WhatsApp?</b></div>
      <div className="mc-wire" />
      <div className="mc-node mc-cond"><span className="ck-mono">CONDICIÓN</span><b>¿Quiere comprar hoy?</b></div>
      <div className="mc-split">
        <div className="mc-branch">
          <span className="ck-mono mc-yes">SÍ</span>
          <div className="mc-node"><span className="ck-mono">ACCIÓN</span><b>Link de pago + aviso al vendedor</b></div>
        </div>
        <div className="mc-branch">
          <span className="ck-mono mc-no">AÚN NO</span>
          <div className="mc-node"><span className="ck-mono">SECUENCIA</span><b>Etiqueta «tibio» + recordatorio</b></div>
        </div>
      </div>
      <div className="mc-wire" />
      <div className="mc-node mc-end"><span className="ck-mono">DESTINO</span><b>CRM o Google Sheets con su origen</b></div>
    </div>
  )
}

export function ManychatPage() {
  const service = getServiceBySlug("manychat")!
  return (
    <MarketingLayout
      active="crm-whatsapp"
      whatsapp={{ message: "¿Te comentan mucho y vendes poco por DM? Te mostramos cómo lo automatizamos con Manychat.", replies: ["Quiero Manychat", "Vendo por Instagram", "Ver planes"] }}
    >
      <CrmJsonLd slug="manychat" name="Implementación de Manychat" description="Implementación de Manychat: respuestas automáticas a comentarios, historias y mensajes directos en Instagram, Messenger y WhatsApp, flujos de captación con IA e integración con tu CRM." faq={MANYCHAT_FAQ} />

      {/* ── Hero ── */}
      <section className="mc-hero">
        <div className="ck-wrap">
          <CrmCrumbs name="Manychat" />
          <div className="mc-hero-grid">
            <div className="mc-hero-vis">
              <PostMock />
              <span className="crm-sticker mc-st ck-hand">sin que nadie<br />toque el celular</span>
            </div>
            <div className="mc-hero-txt">
              <span className="ck-tag">[MANYCHAT] · INSTAGRAM · MESSENGER · WHATSAPP</span>
              <h1>Te comentan <span className="mc-nw"><span className="mc-bubble">«QUIERO»</span>.</span> Tu bot ya les está escribiendo.</h1>
              <p className="crm-lead">
                Implementamos Manychat para que cada comentario, respuesta a historia o mensaje directo se convierta en una conversación que capta datos, califica y lleva a la venta. Tú publicas; el flujo hace el resto.
              </p>
              <div className="crm-ctas">
                <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero automatizar mi Instagram con Manychat")} target="_blank" rel="noopener noreferrer">Automatiza mis DMs →</a>
                <a className="ck-btn ck-btn-line" href="#recetas">Ver ideas por negocio</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Growth tools ── */}
      <section className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head crm-head-split">
            <div>
              <span className="ck-eyebrow">Disparadores</span>
              <h2>Cinco formas de abrir una conversación sin escribir primero.</h2>
            </div>
            <p>Elegimos los disparadores según dónde ya te está hablando tu audiencia.</p>
          </div>
          <div className="mc-tools">
            {TOOLS.map((t) => (
              <article key={t.k} className="mc-tool" style={{ background: t.bg }}>
                <span className="ck-tag">[{t.k}]</span>
                <h3>{t.t}</h3>
                <p className="mc-ex"><span className="ck-mono">EJEMPLO</span>{t.ex}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flujo ── */}
      <section className="ck-section mc-flow-sec">
        <div className="ck-wrap mc-flow-grid">
          <div className="mc-flow-txt">
            <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}>Un flujo por dentro</span>
            <h2>No es un mensaje automático. Es un recorrido.</h2>
            <p>Cada flujo tiene un objetivo: captar un dato, calificar o vender. Lo diseñamos con preguntas, botones y condiciones, y cada contacto llega a tu CRM con la etiqueta de la publicación que lo trajo.</p>
            <ul className="mc-flow-list">
              <li>Escribimos los mensajes en tu tono, no en tono de robot.</li>
              <li>Probamos cada camino antes de publicar.</li>
              <li>Medimos qué publicaciones traen más contactos.</li>
            </ul>
          </div>
          <FlowMock />
        </div>
      </section>

      {/* ── Recetas ── */}
      <section id="recetas" className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head">
            <span className="ck-eyebrow">Recetas por tipo de negocio</span>
            <h2>¿Qué automatizaría en tu negocio?</h2>
          </div>
          <div className="mc-recipes">
            {RECIPES.map((r, i) => (
              <article key={r.t} className="mc-recipe">
                <span className="ck-mono mc-recipe-n">0{i + 1}</span>
                <span className="ck-mono mc-recipe-k">{r.k}</span>
                <h3>{r.t}</h3>
                <p>{r.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reglas ── */}
      <section className="ck-section mc-rules-sec">
        <div className="ck-wrap mc-rules-grid">
          <div>
            <span className="ck-eyebrow">Las reglas del juego</span>
            <h2>Automatizar sin que Meta te frene la cuenta.</h2>
            <p className="crm-sub">Instagram, Messenger y WhatsApp tienen reglas claras para los mensajes automáticos. Las respetamos desde el diseño del flujo.</p>
          </div>
          <div className="mc-rules">
            {RULES.map((r) => (
              <div key={r.t} className="mc-rule"><strong>{r.t}</strong><p>{r.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="planes" className="ck-section">
        <div className="ck-wrap">
          <div className="crm-head crm-head-split">
            <div>
              <span className="ck-eyebrow">Inversión</span>
              <h2>Planes de implementación de Manychat</h2>
            </div>
            <p>Pagas una vez por los flujos listos y funcionando. Precios en USD; la suscripción de Manychat va aparte y a tu nombre.</p>
          </div>
          <CrmPlans plans={service.es.plans} variant="stack" accent="#FFDCC7" waLabel="Manychat" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ck-section crm-faq-sec">
        <div className="ck-wrap crm-faq-grid">
          <div className="crm-faq-side">
            <span className="ck-eyebrow">Preguntas frecuentes</span>
            <h2>Antes de poner un bot en tus redes.</h2>
            <a className="ck-btn ck-btn-wa" href={waLink("Hola, tengo una pregunta sobre Manychat")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Pregúntanos</a>
          </div>
          <CrmFaq items={MANYCHAT_FAQ} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="crm-cta crm-cta-peach">
        <div className="ck-wrap crm-cta-grid">
          <div>
            <h2>Tu próximo reel puede traer leads solo.</h2>
            <p>Mándanos tu Instagram y te proponemos el primer flujo: palabra clave, mensajes y a dónde llega cada contacto.</p>
          </div>
          <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero que me propongan un flujo de Manychat para mi Instagram")} target="_blank" rel="noopener noreferrer">Quiero mi primer flujo →</a>
        </div>
        <div className="ck-wrap"><CrmCrossLinks current="manychat" /></div>
      </section>
    </MarketingLayout>
  )
}
