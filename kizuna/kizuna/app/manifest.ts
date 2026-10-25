import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KIZUNA",
    short_name: "KIZUNA",
    description: "Where Japanese culture meets Indian community.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ec",
    theme_color: "#8fcf9e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
