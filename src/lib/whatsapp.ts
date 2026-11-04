/** Enlaces a WhatsApp. Configura NEXT_PUBLIC_WHATSAPP_NUMBER (solo dígitos, con código de país). */
const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "")

export function waLink(text?: string): string {
  const base = `https://wa.me/${WA_NUMBER}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
