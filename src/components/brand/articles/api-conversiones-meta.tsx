import Link from "next/link"
import { waLink } from "@/lib/whatsapp"

export const TOC = [
  { id: "resumen", label: "En resumen" },
  { id: "que-es", label: "¿Qué es la API de conversiones?" },
  { id: "por-que", label: "¿Por qué el píxel ya no basta?" },
  { id: "diferencias", label: "Píxel vs. API: diferencias" },
  { id: "paso-a-paso", label: "Cómo configurarla paso a paso" },
  { id: "duplicados", label: "Cómo evitar eventos duplicados" },
  { id: "verificar", label: "Cómo verificar que funciona" },
  { id: "faq", label: "Preguntas frecuentes" },
]

export const FAQS = [
  { q: "¿La API de conversiones reemplaza al píxel?", a: "No. Lo recomendado es usar los dos juntos y deduplicar los eventos." },
  { q: "¿Necesito saber programar?", a: "No siempre. Si tu web está en una plataforma con integración oficial, se activa desde su panel. Para webs a medida o CRM sí hace falta una configuración técnica." },
  { q: "¿Puedo enviar ventas que se cierran por WhatsApp?", a: "Sí. Si registras esas ventas en un CRM, puedes enviarlas a Meta como eventos para que tus anuncios aprendan de ventas reales." },
  { q: "¿Es seguro enviar datos de mis clientes?", a: "Los datos personales se envían cifrados con SHA-256. Aun así, informa en tu política de privacidad qué datos compartes y respeta el consentimiento de tus usuarios." },
]

const STEPS = [
  ["Revisa tu píxel en el Administrador de eventos", "Entra a Meta Business Suite › Administrador de eventos y confirma que tu píxel (o conjunto de datos) existe y recibe eventos."],
  ["Elige cómo conectarla", "Si usas Shopify, WooCommerce u otra plataforma compatible, activa la integración del partner. Si no, usa la puerta de enlace de la API de conversiones o una integración propia desde tu servidor."],
  ["Genera el token de acceso", "En la configuración del píxel, en la sección de la API de conversiones, genera el token. Guárdalo en tu servidor, nunca en el código público de tu web."],
  ["Envía los eventos con datos del cliente", "Cada evento debe llevar información que ayude a Meta a reconocer a la persona: correo y teléfono cifrados con SHA-256, IP, navegador y los identificadores de clic de Meta cuando existan."],
  ["Configura la deduplicación", "Usa el mismo ID de evento en el píxel y en el servidor. Lo explicamos abajo."],
  ["Prueba antes de dar por terminado", "Usa la herramienta de prueba de eventos y revisa la calidad de coincidencia de eventos."],
]

const ROWS = [
  ["Dónde funciona", "En el navegador", "En tu servidor o CRM"],
  ["Bloqueadores", "Lo afectan", "No lo afectan"],
  ["Eventos fuera de la web", "No", "Sí: CRM, ventas cerradas, leads calificados"],
  ["Instalación", "Sencilla", "Requiere configuración técnica"],
]

export function ApiConversionesMeta() {
  return (
    <>
      <div id="resumen" style={{ background: "#D3F2E3", border: "1.5px solid #010E25", borderRadius: 26, padding: "26px 28px", scrollMarginTop: 110 }}>
        <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "#1F6B42" }}>EN RESUMEN</span>
        <ul className="ck-bul" style={{ marginTop: 12 }}>
          <li>La <strong>API de conversiones</strong> envía los eventos de tu negocio a Meta <strong>desde tu servidor</strong>, no desde el navegador.</li>
          <li>No reemplaza al píxel: Meta recomienda usar <strong>los dos juntos</strong> para perder menos datos.</li>
          <li>Para no contar dos veces la misma venta, ambos deben enviar el mismo <strong>nombre de evento y el mismo ID de evento</strong>.</li>
          <li>Se puede instalar con integraciones (Shopify, WooCommerce y otras), con la puerta de enlace de la API o con una integración propia.</li>
        </ul>
      </div>

      <h2 id="que-es">¿Qué es la API de conversiones de Meta?</h2>
      <p>La API de conversiones (en inglés, <em>Conversions API</em> o CAPI) es una conexión directa entre tu servidor, tu tienda o tu CRM y Meta. Cada vez que pasa algo importante en tu negocio, como una compra, un registro o un lead, tu sistema le avisa a Meta sin depender del navegador del cliente.</p>
      <p>Con esos datos, Meta puede atribuir mejor tus resultados a cada anuncio y optimizar las campañas para encontrar a más personas parecidas a las que sí compran.</p>

      <h2 id="por-que">¿Por qué el píxel ya no basta?</h2>
      <p>El píxel de Meta es un código que vive en el navegador. Eso lo hace fácil de instalar, pero también frágil. Hay eventos que nunca llegan por:</p>
      <ul className="ck-bul">
        <li>Bloqueadores de anuncios y extensiones de privacidad.</li>
        <li>Navegadores que limitan las cookies, como Safari.</li>
        <li>Los permisos de rastreo en iPhone desde iOS 14.5.</li>
        <li>Personas que cierran la página antes de que cargue el píxel.</li>
      </ul>
      <p>Cada evento perdido es una venta que tus anuncios no ven. Y si no la ven, no aprenden de ella.</p>

      <h2 id="diferencias">Píxel vs. API de conversiones: diferencias</h2>
      <div style={{ marginTop: 22, overflowX: "auto", border: "1.5px solid #010E25", borderRadius: 22, background: "#fff" }}>
        <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", fontSize: 16 }}>
          <thead><tr style={{ background: "#010E25", color: "#fff", textAlign: "left" }}><th scope="col" style={{ padding: "14px 18px" }} /><th scope="col" style={{ padding: "14px 18px", fontWeight: 600 }}>Píxel</th><th scope="col" style={{ padding: "14px 18px", fontWeight: 600 }}>API de conversiones</th></tr></thead>
          <tbody>
            {ROWS.map(([h, a, b]) => (
              <tr key={h}>
                <th scope="row" style={{ padding: "14px 18px", textAlign: "left", fontWeight: 600, borderTop: "1px solid rgba(1,14,37,.1)" }}>{h}</th>
                <td style={{ padding: "14px 18px", borderTop: "1px solid rgba(1,14,37,.1)" }}>{a}</td>
                <td style={{ padding: "14px 18px", borderTop: "1px solid rgba(1,14,37,.1)" }}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="paso-a-paso">Cómo configurar la API de conversiones paso a paso</h2>
      <ol style={{ listStyle: "none", margin: "22px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {STEPS.map(([t, d], i) => (
          <li key={t} className="ck-lift" style={{ display: "flex", gap: 18, background: "#fff", border: "1.5px solid rgba(1,14,37,.12)", borderRadius: 22, padding: "20px 22px" }}>
            <span style={{ flex: "none", width: 44, height: 44, borderRadius: "50%", background: "#010E25", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>{i + 1}</span>
            <div><h3 style={{ margin: 0, fontSize: 20 }}>{t}</h3><p style={{ marginTop: 6, fontSize: 16 }}>{d}</p></div>
          </li>
        ))}
      </ol>

      <h2 id="duplicados">Cómo evitar eventos duplicados</h2>
      <p>Si el píxel y el servidor envían la misma compra, Meta podría contarla dos veces. Para evitarlo, los dos deben enviar el <strong>mismo nombre de evento</strong> (por ejemplo, <code className="ck-mono" style={{ fontSize: 15 }}>Purchase</code>) y el <strong>mismo ID de evento</strong>. Meta los reconoce como uno solo.</p>
      <div style={{ marginTop: 22, background: "#010E25", color: "#fff", borderRadius: 22, padding: "22px 24px", overflowX: "auto" }}>
        <span className="ck-mono" style={{ display: "block", fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.6)", marginBottom: 12 }}>EJEMPLO · EVENTO DESDE EL SERVIDOR</span>
        <pre className="ck-mono" style={{ margin: 0, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre" }}>{`"event_name": "Purchase",
"event_id": "pedido-1234",
"event_time": 1793800000,
"action_source": "website",
"user_data": { em: [sha256(correo)], ph: [sha256(teléfono)] }`}</pre>
        <span className="ck-mono" style={{ display: "block", fontSize: 12, color: "#8BE3B4", marginTop: 12 }}>↳ el píxel envía el mismo Purchase con eventID: &quot;pedido-1234&quot;</span>
      </div>
      <div style={{ marginTop: 22, display: "flex", gap: 14, background: "#FFDCC7", borderRadius: 20, padding: "18px 20px" }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#FE5C02", border: "1.5px solid #010E25", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontWeight: 700 }}>!</span>
        <p style={{ margin: 0 }}><strong>Ojo:</strong> si los ID no coinciden, verás más conversiones de las reales y tus decisiones se basarán en números inflados.</p>
      </div>

      <h2 id="verificar">Cómo verificar que funciona</h2>
      <ul className="ck-bul">
        <li><strong>Prueba de eventos:</strong> en el Administrador de eventos, usa un código de prueba y comprueba que llegan los eventos del navegador y del servidor.</li>
        <li><strong>Deduplicación:</strong> en el detalle de cada evento, revisa que los eventos del navegador y del servidor se estén deduplicando.</li>
        <li><strong>Calidad de coincidencia:</strong> mientras más datos útiles del cliente envíes, mejor puntuación y mejor optimización.</li>
      </ul>

      <div style={{ marginTop: 48, background: "#010E25", color: "#fff", borderRadius: 30, padding: "clamp(24px, 4vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 440 }}>
          <span className="ck-hand" style={{ fontSize: 28, color: "#FFDCC7" }}>¿mucho paso técnico?</span>
          <h3 style={{ margin: 0, fontSize: 28, color: "#fff" }}>Lo configuramos por ti: píxel, API, deduplicación y prueba.</h3>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link className="ck-btn ck-btn-primary on-dark" href="/pricing">Ver precio ↗</Link>
          <a className="ck-btn ck-btn-wa" href={waLink("Hola, quiero configurar la API de conversiones")} target="_blank" rel="noopener noreferrer"><span className="ck-dot" />Preguntar</a>
        </div>
      </div>

      <h2 id="faq">Preguntas frecuentes</h2>
      <div style={{ marginTop: 12 }}>
        {FAQS.map((f, i) => (
          <details key={f.q} className="ck-faq" open={i === 0}>
            <summary>{f.q}<span className="ck-plus" aria-hidden="true"><svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></span></summary>
            <p style={{ margin: 0 }}>{f.a}</p>
          </details>
        ))}
      </div>
    </>
  )
}
