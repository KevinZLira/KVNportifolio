export type PluginStatus = "AVAILABLE" | "IN_DEVELOPMENT" | "CLASSIFIED";

export const STATUS_LABEL_PT: Record<PluginStatus, string> = {
  AVAILABLE: "DISPONÍVEL",
  IN_DEVELOPMENT: "EM DESENVOLVIMENTO",
  CLASSIFIED: "CLASSIFICADO",
};

export interface PluginBenefit {
  index: string;
  title: string;
  description: string;
}

export interface PluginPrice {
  amount: number;
  currency: string;
  originalAmount?: number; // set for a "DE X POR Y" promo — omit for a flat price
  interval?: string; // e.g. "/MÊS" — omit for a one-time price
}

export interface Plugin {
  id: string; // "001"
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: PluginStatus;
  pitch: string;
  highlights: string[]; // short "sem X. sem Y." friction-removal lines
  oldWay: string[];
  newWay: string[];
  benefits: PluginBenefit[];
  steps: string[];
  signals: string[]; // short build-log lines for the horizontal ticker — creator's voice, not customer quotes
  demoVideo?: string;
  demoPoster?: string;
  price?: PluginPrice; // omit entirely until a real price is set — never invent one
  purchaseUrl?: string; // omit until a real checkout/store link exists
  accent: string;
}

export const featuredPlugin: Plugin = {
  id: "001",
  slug: "video-importer",
  name: "KVN VIDEO IMPORTER",
  tagline: "YOUTUBE → PREMIERE PRO",
  category: "UTILITÁRIO DE IMPORTAÇÃO",
  status: "AVAILABLE",
  pitch: "Importe vídeos direto para a timeline do Premiere.",
  highlights: ["SEM DOWNLOAD.", "SEM MANUSEIO MANUAL DE ARQUIVOS.", "SEM QUEBRAR O FLUXO DE TRABALHO."],
  oldWay: [
    "COPIAR LINK",
    "ABRIR DOWNLOADER",
    "BAIXAR ARQUIVO",
    "ESPERAR",
    "ENCONTRAR ARQUIVO",
    "IMPORTAR PRO PREMIERE",
    "ARRASTAR PRA TIMELINE",
  ],
  newWay: ["YOUTUBE", "KVN VIDEO IMPORTER", "TIMELINE"],
  benefits: [
    { index: "01", title: "DIRETO", description: "Do YouTube pro Premiere sem sair do seu fluxo de trabalho." },
    { index: "02", title: "RÁPIDO", description: "Pule downloads, abas e gerenciamento de arquivos desnecessários." },
    { index: "03", title: "NATIVO", description: "Construído especificamente para o seu fluxo no Premiere." },
    { index: "04", title: "SIMPLES", description: "Cole. Importe. Edite." },
  ],
  steps: ["COPIAR URL", "COLAR", "IMPORTAR", "EDITAR"],
  signals: [
    "CRIADO PORQUE TROCAR DE ABA NO MEIO DA EDIÇÃO NÃO DEVERIA SER UMA ETAPA.",
    "UM COLAR. UM IMPORT. DE VOLTA PRA TIMELINE.",
    "SEM PASTA DE DOWNLOADS. SEM ARQUIVO ÓRFÃO.",
    "FEITO PARA O FLUXO DE TRABALHO, NÃO AO REDOR DELE.",
    "MENOS FRICÇÃO ENTRE O MATERIAL E A EDIÇÃO.",
    "FEITO POR QUEM VIVE DE EDITAR VÍDEO.",
  ],
  price: { amount: 27.9, currency: "R$", originalAmount: 59.9 },
  accent: "#80f425",
};

// Only shipped product today — the list is the extension point for every
// plugin that ships after this one; nothing above this file needs to change.
export const plugins: Plugin[] = [featuredPlugin];

export function getPluginBySlug(slug: string) {
  return plugins.find((p) => p.slug === slug);
}

export function formatPriceAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

// No purchaseUrl is configured yet (no checkout link exists) — every CTA
// falls back to a mailto so the button is never a dead click. Swap this for
// the real checkout link the moment one exists; nothing else needs to change.
export function getPurchaseHref(plugin: Plugin): string {
  return (
    plugin.purchaseUrl ?? `mailto:contact@kvnlira.com?subject=${encodeURIComponent(`${plugin.name} — COMPRA`)}`
  );
}

export interface UpcomingPlugin {
  id: string; // "002"
  codename: string;
  status: "IN_DEVELOPMENT" | "CLASSIFIED";
  progress?: number; // 0..1 — only rendered for IN_DEVELOPMENT
}

// PLACEHOLDER DATASET — swap for real roadmap entries as they firm up.
export const upcomingPlugins: UpcomingPlugin[] = [
  { id: "002", codename: "SYSTEM_002", status: "IN_DEVELOPMENT", progress: 0.35 },
  { id: "003", codename: "SYSTEM_003", status: "CLASSIFIED" },
];
