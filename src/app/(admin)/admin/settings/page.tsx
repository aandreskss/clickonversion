import { CheckCircle2, XCircle, Info } from "lucide-react"

interface EnvCheck {
  key: string
  label: string
  set: boolean
  required?: boolean
}

const ENV_CHECKS: EnvCheck[] = [
  {
    key: "STRIPE_SECRET_KEY",
    label: "Stripe Secret Key",
    set: !!process.env.STRIPE_SECRET_KEY,
    required: true,
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    label: "Stripe Webhook Secret",
    set: !!process.env.STRIPE_WEBHOOK_SECRET,
    required: true,
  },
  {
    key: "PAYPAL_CLIENT_ID",
    label: "PayPal Client ID",
    set: !!process.env.PAYPAL_CLIENT_ID,
    required: true,
  },
  {
    key: "PAYPAL_CLIENT_SECRET",
    label: "PayPal Client Secret",
    set: !!process.env.PAYPAL_CLIENT_SECRET,
    required: true,
  },
  {
    key: "RESEND_API_KEY",
    label: "Resend API Key",
    set: !!process.env.RESEND_API_KEY,
    required: true,
  },
  {
    key: "CAL_API_KEY",
    label: "Cal.com API Key",
    set: !!process.env.CAL_API_KEY,
    required: true,
  },
  {
    key: "CALCOM_WEBHOOK_SECRET",
    label: "Cal.com Webhook Secret",
    set: !!process.env.CALCOM_WEBHOOK_SECRET,
    required: false,
  },
  {
    key: "DATABASE_URL",
    label: "Neon Database URL",
    set: !!process.env.DATABASE_URL,
    required: true,
  },
  {
    key: "AUTH_SECRET",
    label: "Auth.js Secret",
    set: !!process.env.AUTH_SECRET,
    required: true,
  },
]

const STACK_INFO = [
  { label: "Framework", value: "Next.js 16 (App Router)" },
  { label: "Base de datos", value: "Neon (PostgreSQL) + Drizzle ORM" },
  { label: "Auth", value: "Auth.js v5 (next-auth@beta)" },
  { label: "Pagos", value: "Stripe + PayPal" },
  { label: "Email", value: "Resend" },
  { label: "Reservas", value: "Cal.com" },
  { label: "Hosting", value: "Vercel" },
  { label: "Lenguaje", value: "TypeScript strict" },
  { label: "Estilos", value: "Tailwind CSS 4" },
]

export default function SettingsPage() {
  const configured = ENV_CHECKS.filter((e) => e.set).length
  const total = ENV_CHECKS.length
  const allGood = configured === total

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F7F7F3]">Configuración del Sistema</h1>
        <p className="text-[#8A9099] text-sm mt-1">
          Verificación de variables de entorno y estado del stack
        </p>
      </div>

      {/* Summary badge */}
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border ${
          allGood
            ? "bg-[#22C55E]/10 border-[#22C55E]/30"
            : "bg-[#F59E0B]/10 border-[#F59E0B]/30"
        }`}
      >
        {allGood ? (
          <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
        )}
        <p className={`text-sm font-medium ${allGood ? "text-[#22C55E]" : "text-[#F59E0B]"}`}>
          {configured}/{total} variables de entorno configuradas
          {!allGood && " — revisa las variables faltantes"}
        </p>
      </div>

      {/* Env vars grid */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#8A9099] uppercase tracking-wider">
          Variables de entorno
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ENV_CHECKS.map((check) => (
            <div
              key={check.key}
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                check.set
                  ? "bg-[#14171A] border-[#3D4A5C]"
                  : check.required
                    ? "bg-[#EF4444]/5 border-[#EF4444]/30"
                    : "bg-[#14171A] border-[#3D4A5C]"
              }`}
            >
              {check.set ? (
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
              ) : (
                <XCircle
                  className={`w-5 h-5 flex-shrink-0 ${
                    check.required ? "text-[#EF4444]" : "text-[#546072]"
                  }`}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F7F7F3]">{check.label}</p>
                <p className="text-xs text-[#546072] font-mono mt-0.5">{check.key}</p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                  check.set
                    ? "bg-[#22C55E]/10 text-[#22C55E]"
                    : check.required
                      ? "bg-[#EF4444]/10 text-[#EF4444]"
                      : "bg-[#3D4A5C] text-[#8A9099]"
                }`}
              >
                {check.set ? "Configurado" : check.required ? "Requerido" : "Opcional"}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 bg-[#14171A] border border-[#3D4A5C] rounded-lg">
          <Info className="w-4 h-4 text-[#546072] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#546072]">
            Los valores de las variables no se muestran por seguridad. Solo se verifica si están
            definidas. Para modificarlas, actualiza el archivo <code className="text-[#8A9099]">.env.local</code> o
            las variables de entorno en Vercel.
          </p>
        </div>
      </section>

      {/* Stack info */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#8A9099] uppercase tracking-wider">
          Stack tecnológico
        </h2>
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl overflow-hidden">
          <table className="w-full">
            <tbody>
              {STACK_INFO.map((item, i) => (
                <tr
                  key={item.label}
                  className={`${i < STACK_INFO.length - 1 ? "border-b border-[#3D4A5C]" : ""}`}
                >
                  <td className="px-5 py-3.5 text-sm text-[#8A9099] w-1/3">{item.label}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-[#F7F7F3]">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Email config */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#8A9099] uppercase tracking-wider">
          Configuración de email
        </h2>
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-[#3D4A5C]">
                <td className="px-5 py-3.5 text-sm text-[#8A9099] w-1/3">
                  Email de notificaciones
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-[#F7F7F3] font-mono">
                  {process.env.NOTIFICATION_EMAIL ?? (
                    <span className="text-[#F59E0B]">no configurado</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-[#3D4A5C]">
                <td className="px-5 py-3.5 text-sm text-[#8A9099]">From address</td>
                <td className="px-5 py-3.5 text-sm font-medium text-[#F7F7F3] font-mono">
                  {process.env.EMAIL_FROM ?? (
                    <span className="text-[#F59E0B]">no configurado</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3.5 text-sm text-[#8A9099]">Proveedor</td>
                <td className="px-5 py-3.5 text-sm font-medium text-[#F7F7F3]">
                  Resend (sends only)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
