export type PluginStatus = "IN_DEVELOPMENT" | "COMING_SOON";

export interface PluginItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: PluginStatus;
  accent: string;
}

// PLACEHOLDER DATASET — replace with real plugins as they ship.
// Structure is what matters: add/remove entries here, nothing
// else in the app needs to change.
export const plugins: PluginItem[] = [
  {
    id: "PLG_01",
    name: "AUTO_CUT",
    category: "EDITING AUTOMATION",
    description: "Corte automático de timeline por picos de áudio e silêncio.",
    status: "IN_DEVELOPMENT",
    accent: "#6dffa8",
  },
  {
    id: "PLG_02",
    name: "GRADE_KIT",
    category: "COLOR TOOLS",
    description: "Presets e utilitários de color grading para fluxo rápido.",
    status: "IN_DEVELOPMENT",
    accent: "#ff2ec4",
  },
  {
    id: "PLG_03",
    name: "GLITCH_PACK",
    category: "TRANSITIONS",
    description: "Pacote de transições e efeitos de glitch/VHS prontos para uso.",
    status: "COMING_SOON",
    accent: "#ffd23f",
  },
];
