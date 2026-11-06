import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClicKonversion",
    short_name: "CK",
    description: "More Visibility. Better Leads. Smarter Growth.",
    start_url: "/",
    display: "standalone",
    background_color: "#010E25",
    theme_color: "#FE5C02",
    icons: [
      { src: "/brand/clickonversion-isotipo-naranja.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }
}
