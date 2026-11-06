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
      { src: "/brand/favicon_192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/favicon_512.png", sizes: "512x512", type: "image/png" },
      { src: "/favicon.svg",           sizes: "any",     type: "image/svg+xml" },
    ],
  }
}
