// Catalog data for the Plugins sales page. Prices below are fixed by the
// product owner and must never be derived/rounded differently — they are
// literal values, not computed from anything else.
//
// No testimonials, review counts, user counts, refund policy, Premiere
// version compatibility, install difficulty, delivery process or
// multi-device policy are invented here. Anywhere one of those would
// normally go, the copy either omits the claim entirely or carries an
// explicit "A DEFINIR" placeholder for Kevin to fill in later.

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

export const plugins: PluginItem[] = [copyPasta, youtubeImporter];

export function getPluginBySlug(slug: string) {
  return plugins.find((p) => p.slug === slug);
}

export interface ComboOffer {
  name: string;
  price: number;
  items: PluginItem[];
  purchaseUrl?: string;
}

export const combo: ComboOffer = {
  name: "Copy & Pasta + YouTube Importer",
  price: 47.9,
  items: [copyPasta, youtubeImporter],
};

export function getComboTotal(): number {
  return combo.items.reduce((sum, p) => sum + p.price.amount, 0);
}

export function getComboSavings(): number {
  return getComboTotal() - combo.price;
}

export function formatPriceAmount(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

// No purchaseUrl is configured yet for any product — every CTA falls back
// to a mailto so the button is never a dead click. Swap this for the real
// checkout link(s) the moment they exist; nothing else needs to change.
export function getPurchaseHref(name: string, purchaseUrl?: string): string {
  return purchaseUrl ?? `mailto:contact@kvnlira.com?subject=${encodeURIComponent(`${name} — COMPRA`)}`;
}

export interface FaqItem {
  question: string;
  answer: string;
  placeholder?: boolean; // true when the answer depends on info not provided yet
}

export const pluginsFaq: FaqItem[] = [
  {
    question: "Os plugins funcionam no Adobe Premiere Pro?",
    answer:
      "Sim, os dois são feitos especificamente para funcionar dentro do Adobe Premiere Pro. Compatibilidade com versões específicas ainda será confirmada aqui.",
    placeholder: true,
  },
  {
    question: "Preciso pagar mensalidade?",
    answer: "Não. O pagamento é único, sem assinatura e sem mensalidade.",
  },
  {
    question: "Posso comprar apenas um plugin?",
    answer:
      "Sim. Você pode comprar o Copy & Pasta ou o YouTube Importer separadamente, ou levar os dois no combo com desconto.",
  },
  {
    question: "O combo inclui os dois plugins?",
    answer: "Sim. O combo inclui o Copy & Pasta e o YouTube Importer por R$ 47,90.",
  },
  {
    question: "Como recebo os plugins depois da compra?",
    answer: "A DEFINIR — o processo de entrega após a compra será detalhado aqui.",
    placeholder: true,
  },
  {
    question: "Preciso ter conhecimento técnico para usar?",
    answer: "Não. Os dois foram feitos para serem simples: copiar e colar, sem configuração complicada.",
  },
  {
    question: "Os plugins são difíceis de instalar?",
    answer: "A DEFINIR — o passo a passo de instalação será detalhado aqui.",
    placeholder: true,
  },
  {
    question: "O YouTube Importer funciona com quais plataformas?",
    answer: "YouTube, TikTok e Instagram.",
  },
  {
    question: "Posso usar os plugins em mais de um computador?",
    answer: "A DEFINIR — a política de uso em múltiplos computadores será detalhada aqui.",
    placeholder: true,
  },
];
