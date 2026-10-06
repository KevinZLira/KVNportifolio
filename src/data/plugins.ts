// Catalog data for the KVN plugins showroom + per-plugin detail pages.
// Each plugin has its own dedicated page (/plugins/:slug) so its own
// checkout link gets its own Hotmart tracking, independent of the other
// product. The showroom (/plugins) itself only shows name + description —
// price and the buy flow live entirely on the detail page.
//
// Prices below are fixed by the product owner and must never be
// derived/rounded differently — they are literal values, not computed
// from anything else.
//
// No testimonials, review counts, user counts, refund policy, Premiere
// version compatibility, or install difficulty are invented here.
// Anywhere one of those would normally go, the copy either omits the
// claim entirely or carries an explicit "A DEFINIR" placeholder for
// Kevin to fill in later.

export interface PluginPrice {
  amount: number;
  currency: string; // "R$"
}

export interface PluginItem {
  id: string; // "01"
  slug: string; // "copy-pasta"
  badge: string; // "PLUGIN #01"
  name: string; // "Copy & Pasta"
  headline: string;
  pitch: string;
  platforms?: string[]; // only the YouTube Importer has these
  pains: string[]; // the specific friction this plugin removes
  explainerSteps: string[];
  benefits: string[];
  oldWay: string[];
  newWay: string[];
  demoCaption: string;
  demoVideo?: string;
  demoPoster?: string;
  idealFor: string[];
  price: PluginPrice;
  purchaseUrl?: string; // no checkout link exists yet — every CTA falls back to mailto
  accent: string;
  mockup: "paste" | "link";
}

export const copyPasta: PluginItem = {
  id: "01",
  slug: "copy-pasta",
  badge: "PLUGIN #01",
  name: "Copy & Pasta",
  headline: "Copie uma imagem. Cole no Premiere.",
  pitch:
    "O Copy & Pasta permite copiar imagens diretamente para o Premiere Pro sem precisar salvar o arquivo no computador antes.",
  pains: [
    "Precisar salvar uma imagem no computador só para conseguir colocá-la no Premiere.",
    "Interromper o fluxo criativo por causa de tarefas pequenas e repetitivas.",
  ],
  explainerSteps: ["Encontrou uma referência no navegador?", "Copie.", "Volte para o Premiere.", "Cole.", "Pronto."],
  benefits: [
    "Cole imagens diretamente no Premiere",
    "Não precisa salvar arquivos manualmente",
    "Menos arquivos temporários no computador",
    "Workflow muito mais rápido",
    "Ideal para referências, thumbnails, memes, screenshots e assets rápidos",
  ],
  oldWay: ["BROWSER", "DOWNLOAD", "PASTA", "LOCALIZAR ARQUIVO", "PREMIERE", "IMPORTAR"],
  newWay: ["COPY", "PREMIERE"],
  demoCaption: "Copiar → Colar → Pronto.",
  idealFor: [
    "Trabalha com referências visuais",
    "Usa screenshots e imagens durante a edição",
    "Precisa colocar imagens rapidamente no Premiere",
    "Quer eliminar downloads desnecessários",
  ],
  price: { amount: 27.9, currency: "R$" },
  accent: "#80f425",
  mockup: "paste",
};

export const youtubeImporter: PluginItem = {
  id: "02",
  slug: "youtube-importer",
  badge: "PLUGIN #02",
  name: "YouTube Importer",
  headline: "Um link. O arquivo está no seu Premiere.",
  pitch: "O YouTube Importer permite importar conteúdos diretamente para o Premiere Pro simplesmente colando o link.",
  platforms: ["YouTube", "TikTok", "Instagram"],
  pains: [
    "Abrir navegador, baixar arquivo, localizar pasta e importar manualmente.",
    "Ficar alternando entre Premiere e navegador para pegar vídeos ou músicas.",
  ],
  explainerSteps: [
    "Encontrou um vídeo ou uma música que precisa usar na edição?",
    "Copie o link.",
    "Cole no plugin.",
    "Importe.",
  ],
  benefits: [
    "Importação através de link",
    "YouTube",
    "TikTok",
    "Instagram",
    "Menos downloads manuais",
    "Menos troca de janela",
    "Workflow mais rápido",
    "Feito para quem vive dentro do Premiere",
  ],
  oldWay: ["YOUTUBE / TIKTOK / INSTAGRAM", "DOWNLOAD", "PASTA", "PREMIERE", "IMPORTAR"],
  newWay: ["LINK", "PLUGIN", "PREMIERE"],
  demoCaption: "Copiar link → Colar → Importar.",
  idealFor: [
    "Trabalha constantemente com vídeos online",
    "Usa YouTube, TikTok ou Instagram como fonte",
    "Precisa importar músicas e vídeos",
    "Quer reduzir etapas no workflow",
  ],
  price: { amount: 27.9, currency: "R$" },
  accent: "#80f425",
  mockup: "link",
};

// Only two products today — the array is the extension point: a third
// plugin is a data entry here plus one PluginSection usage, nothing else.
export const plugins: PluginItem[] = [copyPasta, youtubeImporter];

export function getPluginBySlug(slug: string | undefined) {
  return plugins.find((p) => p.slug === slug);
}

export function getOtherPlugin(slug: string) {
  return plugins.find((p) => p.slug !== slug);
}

export function formatPriceAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

// No purchaseUrl is configured yet for either product — every CTA falls
// back to a mailto so the button is never a dead click. Swap this for the
// real per-plugin checkout link the moment it exists; nothing else needs
// to change.
export function getPurchaseHref(name: string, purchaseUrl?: string): string {
  return purchaseUrl ?? `mailto:contact@kvnlira.com?subject=${encodeURIComponent(`${name} — COMPRA`)}`;
}

export interface FaqItem {
  question: string;
  answer: string;
  placeholder?: boolean; // true when the answer depends on info not provided yet
  onlyFor?: string; // restrict this question to one plugin's slug — omit to show on every plugin page
}

export const pluginsFaq: FaqItem[] = [
  {
    question: "O plugin funciona no Adobe Premiere Pro?",
    answer:
      "Sim, é feito especificamente para funcionar dentro do Adobe Premiere Pro. Compatibilidade com versões específicas ainda será confirmada aqui.",
    placeholder: true,
  },
  {
    question: "Preciso pagar mensalidade?",
    answer: "Não. O pagamento é único e o acesso é vitalício — sem assinatura e sem mensalidade.",
  },
  {
    question: "Como recebo o plugin depois da compra?",
    answer: "A entrega é feita por WhatsApp e e-mail.",
  },
  {
    question: "Preciso ter conhecimento técnico para usar?",
    answer: "Não. Foi feito para ser simples: copiar e colar, sem configuração complicada.",
  },
  {
    question: "O plugin é difícil de instalar?",
    answer: "A DEFINIR — o passo a passo de instalação será detalhado aqui.",
    placeholder: true,
  },
  {
    question: "O YouTube Importer funciona com quais plataformas?",
    answer: "YouTube, TikTok e Instagram.",
    onlyFor: "youtube-importer",
  },
  {
    question: "Posso usar o plugin em mais de um computador?",
    answer: "A DEFINIR — a política de uso em múltiplos computadores será detalhada aqui.",
    placeholder: true,
  },
];

export function getFaqForPlugin(slug: string): FaqItem[] {
  return pluginsFaq.filter((item) => !item.onlyFor || item.onlyFor === slug);
}
