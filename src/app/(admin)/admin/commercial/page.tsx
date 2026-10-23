import Link from "next/link"
import { ShoppingBag, MessageSquare, Users } from "lucide-react"

const cards = [
  {
    title: "Catálogo de servicios",
    desc: "Gestiona servicios, precios y visibilidad en el sitio",
    href: "/admin/commercial/catalog",
    icon: ShoppingBag,
  },
  {
    title: "Cotizaciones",
    desc: "Revisa y responde solicitudes de cotización personalizada",
    href: "/admin/commercial/quotes",
    icon: MessageSquare,
  },
  {
    title: "Clientes",
    desc: "Organizaciones clientes, miembros y sus solicitudes activas",
    href: "/admin/commercial/clients",
    icon: Users,
  },
]

export default function CommercialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F7F7F3]">Gestión Comercial</h1>
        <p className="text-[#8A9099] text-sm mt-1">
          Catálogo, cotizaciones y base de clientes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            href={card.href}
            key={card.href}
            className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6 hover:border-[#FF5A1F] transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#FF5A1F]/10 flex items-center justify-center mb-4">
              <card.icon className="w-6 h-6 text-[#FF5A1F]" />
            </div>
            <h3 className="font-semibold text-[#F7F7F3] group-hover:text-[#FF5A1F] transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-[#8A9099] mt-1.5 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
