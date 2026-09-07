export type PluginStatus = "AVAILABLE" | "COMING_SOON" | "SOLD_OUT";

export interface Plugin {
  id: string; // "01"
  slug: string;
  name: string;
  tagline: string;
  price: string; // "$19" or "FREE"
  compatibility: string;
  status: PluginStatus;
  description: string;
  buyUrl?: string; // external checkout link, once it exists
}

// PLACEHOLDER DATASET — replace with real releases as they ship.
// Structure is what matters: add/remove entries here, nothing
// else in the app needs to change.
export const plugins: Plugin[] = [
  {
    id: "01",
    slug: "cathode-transitions",
    name: "CATHODE TRANSITIONS",
    tagline: "Pacote de transições com degradação de sinal analógico",
    price: "$19",
    compatibility: "Premiere Pro 2023+",
    status: "COMING_SOON",
    description:
      "12 transições procedurais simulando artefatos de VHS, ruído RGB e perda de sincronismo. Controles expostos direto no painel de efeitos, sem plugins de terceiros.",
  },
  {
    id: "02",
    slug: "hud-titler",
    name: "HUD TITLER",
    tagline: "Sistema de titulagem técnica para motion e trailers",
    price: "$24",
    compatibility: "Premiere Pro 2023+",
    status: "COMING_SOON",
    description:
      "Template modular de títulos com estética de HUD — contadores, marcações e tipografia técnica animada, todos editáveis via Essential Graphics.",
  },
  {
    id: "03",
    slug: "grain-kit",
    name: "GRAIN KIT",
    tagline: "Texturas de grão e ruído para color grading",
    price: "FREE",
    compatibility: "Premiere Pro 2022+",
    status: "COMING_SOON",
    description:
      "Conjunto inicial de texturas de grão 4K em loop, otimizadas para overlay em modo Screen/Overlay sem perda de performance.",
  },
];

export function getPluginBySlug(slug: string) {
  return plugins.find((p) => p.slug === slug);
}
