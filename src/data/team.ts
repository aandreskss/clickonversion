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
    name: "Abisai [Apellido]",
    role: "[ROL DE ABISAI]",
    bio: "[Dos líneas en primera persona: qué hace Abisai en el equipo y su experiencia.]",
    years: "[X]",
    yearsArea: "[ÁREA]",
    tags: [
      { label: "[ESPECIALIDAD]", bg: "#D6EBFF" },
      { label: "[ESPECIALIDAD]", bg: "#D3F2E3" },
    ],
    stripes: ["#D6EBFF", "#E6F2FF"],
    tilt: "ck-p2",
    sticker: -5,
  },
  {
    name: "Yoli [Apellido]",
    role: "[ROL DE YOLI]",
    bio: "[Dos líneas en primera persona: qué hace Yoli en el equipo y su experiencia.]",
    years: "[X]",
    yearsArea: "[ÁREA]",
    tags: [
      { label: "[ESPECIALIDAD]", bg: "#E4DEFF" },
      { label: "[ESPECIALIDAD]", bg: "#FFDCC7" },
    ],
    stripes: ["#E4DEFF", "#EEEAFF"],
    tilt: "ck-p3",
    sticker: 4,
  },
]
