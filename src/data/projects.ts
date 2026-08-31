export type ProjectCategory =
  | "DESIGN"
  | "VIDEO"
  | "MOTION"
  | "BRANDING"
  | "EXPERIMENTAL";

export interface Project {
  id: string; // "007"
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: number;
  tools: string[];
  description: string;
  accent: string;
}

// PLACEHOLDER DATASET — replace with real work later.
// Structure is what matters: add/remove entries here, nothing
// else in the app needs to change.
export const projects: Project[] = [
  {
    id: "001",
    slug: "mrblurryface",
    title: "MRBLURRYFACE",
    subtitle: "Sequência de abertura para canal de música eletrônica",
    category: "VIDEO",
    year: 2026,
    tools: ["AFTER EFFECTS", "PREMIERE PRO"],
    description:
      "Vinheta de abertura construída em camadas de ruído, distorção RGB e tipografia quebrada. O objetivo era simular a degradação de um sinal de vídeo analógico sendo recebido por um sistema desconhecido.",
    accent: "#6dffa8",
  },
  {
    id: "002",
    slug: "nullpoint",
    title: "NULLPOINT",
    subtitle: "Identidade visual para coletivo de arte generativa",
    category: "BRANDING",
    year: 2025,
    tools: ["ILLUSTRATOR", "FIGMA"],
    description:
      "Sistema de marca modular baseado em coordenadas e grids de precisão. Cada aplicação da marca é gerada a partir de um conjunto de regras, nunca fixa.",
    accent: "#ff2ec4",
  },
  {
    id: "003",
    slug: "signal-loss",
    title: "SIGNAL_LOSS",
    subtitle: "Curta-metragem experimental — motion + live action",
    category: "MOTION",
    year: 2025,
    tools: ["AFTER EFFECTS", "BLENDER"],
    description:
      "Peça experimental que mistura captação real com camadas 3D de baixa resolução, propositalmente quebradas, evocando memória de VHS.",
    accent: "#6dffa8",
  },
  {
    id: "004",
    slug: "ghostwire-poster",
    title: "GHOSTWIRE",
    subtitle: "Sistema de pôsteres para festival de cinema independente",
    category: "DESIGN",
    year: 2024,
    tools: ["PHOTOSHOP", "ILLUSTRATOR"],
    description:
      "Série de dez pôsteres explorando tipografia digital quebrada e composições assimétricas, um para cada dia de festival.",
    accent: "#ffd23f",
  },
  {
    id: "005",
    slug: "deep-idle",
    title: "DEEP_IDLE",
    subtitle: "Loop visual para instalação em galeria",
    category: "EXPERIMENTAL",
    year: 2024,
    tools: ["TOUCHDESIGNER", "AFTER EFFECTS"],
    description:
      "Instalação de vídeo em loop de 40 minutos, sem repetição perceptível, pensada para rodar continuamente em uma sala escura.",
    accent: "#6dffa8",
  },
  {
    id: "006",
    slug: "protocol-9",
    title: "PROTOCOL_9",
    subtitle: "Trailer motion design para lançamento de produto",
    category: "MOTION",
    year: 2024,
    tools: ["AFTER EFFECTS", "CINEMA 4D"],
    description:
      "Trailer de 45 segundos construído inteiramente com elementos de HUD e tipografia técnica, sem uso de imagem real do produto.",
    accent: "#ff2ec4",
  },
  {
    id: "007",
    slug: "cathode",
    title: "CATHODE",
    subtitle: "Vídeo musical — edição rítmica e color grading",
    category: "VIDEO",
    year: 2023,
    tools: ["PREMIERE PRO", "DAVINCI RESOLVE"],
    description:
      "Edição sincronizada quadro a quadro com a batida, usando cortes secos e glitches de compressão como elemento rítmico.",
    accent: "#6dffa8",
  },
  {
    id: "008",
    slug: "archive-01",
    title: "ARCHIVE_01",
    subtitle: "Identidade para arquivo digital de artistas visuais",
    category: "BRANDING",
    year: 2023,
    tools: ["FIGMA", "ILLUSTRATOR"],
    description:
      "Sistema de identidade pensado para funcionar primeiro como interface, depois como marca — nasceu de uma tabela de dados.",
    accent: "#ffd23f",
  },
  {
    id: "009",
    slug: "low-orbit",
    title: "LOW_ORBIT",
    subtitle: "Motion para abertura de podcast de tecnologia",
    category: "MOTION",
    year: 2023,
    tools: ["AFTER EFFECTS"],
    description:
      "Sequência de 12 segundos com tipografia cinética e transições baseadas em corrupção de dados simulada.",
    accent: "#6dffa8",
  },
  {
    id: "010",
    slug: "surface-tension",
    title: "SURFACE_TENSION",
    subtitle: "Peça experimental de tipografia cinética",
    category: "EXPERIMENTAL",
    year: 2022,
    tools: ["AFTER EFFECTS", "PROCESSING"],
    description:
      "Estudo de tipografia reagindo a um campo de forças simulado, renderizado quadro a quadro fora do tempo real.",
    accent: "#ff2ec4",
  },
];

export const categories: (ProjectCategory | "ALL")[] = [
  "ALL",
  "DESIGN",
  "VIDEO",
  "MOTION",
  "BRANDING",
  "EXPERIMENTAL",
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  return { prev, next };
}
