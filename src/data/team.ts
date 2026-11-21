export interface TeamMember {
  name: string
  role: string
  bio: string
  years: string
  yearsArea: string
  tags: { label: string; bg: string }[]
  linkedin?: string
  /** Foto real (opcional). Sin foto se muestra el marcador rayado. */
  photo?: string
  /** Página de CV (opcional) */
  cv?: string
  stripes: [string, string]
  tilt: "" | "ck-p2" | "ck-p3"
  sticker: number
}

// Completa los datos de Abisai y Yoli (los campos entre [corchetes]).
export const TEAM: TeamMember[] = [
  {
    name: "Arnaldo Casadiego",
    role: "SEO & GROWTH · MARTECH · IA",
    bio: "Soy licenciado en Mercadeo y llevo más de 8 años en marketing digital. Vengo del soporte y las ventas B2B: sé lo que vale responder rápido y explicar claro.",
    years: "8",
    yearsArea: "MARKETING DIGITAL",
    tags: [
      { label: "[GOOGLE ADS]", bg: "#FFDCC7" },
      { label: "[SEO + AEO]", bg: "#D6EBFF" },
      { label: "[META ADS]", bg: "#E4DEFF" },
    ],
    linkedin: "https://www.linkedin.com/in/arnaldocasadiego/",
    photo: "/team/arnaldo/06-sonrisa-gris.webp",
    cv: "/about/arnaldo",
    stripes: ["#FFDCC7", "#FFE7D8"],
    tilt: "",
    sticker: 6,
  },
  {
    name: "Abisai Pérez",
    role: "META ADS · REDES · LANDING PAGES",
    bio: "Soy licenciado en Mercadeo y llevo 6 años con Savaya. Combino estrategia, diseño y datos para que los seguidores se conviertan en clientes.",
    years: "6",
    yearsArea: "AÑOS CON SAVAYA",
    tags: [
      { label: "[META ADS]", bg: "#FFDCC7" },
      { label: "[TIKTOK]", bg: "#D6EBFF" },
    ],
    photo: "/team/abisai/retrato.webp",
    cv: "/about/abisai",
    stripes: ["#D6EBFF", "#E6F2FF"],
    tilt: "ck-p2",
    sticker: -5,
  },
  {
    name: "Yolimar Padrón",
    role: "MERCADEO · CONTENIDO · RR. PP. · IA",
    bio: "Soy mercadóloga y docente universitaria desde 2007. Hago crecer comunidades en TikTok e Instagram, llevo la voz de las marcas a eventos y medios, y uso la IA para crear más y mejor.",
    years: "19",
    yearsArea: "AÑOS ENSEÑANDO MARKETING",
    tags: [
      { label: "[CONTENIDO]", bg: "#E4DEFF" },
      { label: "[RR. PP.]", bg: "#FFDCC7" },
    ],
    photo: "/team/yoli/pose-brazos-sonrisa.webp",
    cv: "/about/yoli",
    stripes: ["#E4DEFF", "#EEEAFF"],
    tilt: "ck-p3",
    sticker: 4,
  },
]
