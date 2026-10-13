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
  originalAmount?: number; // set this to show a "DE X POR Y" discount — never invent a value here
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
  youtubeVideoId?: string;
  demoPoster?: string;
  idealFor: string[];
  signals: string[]; // short build-log lines for the ticker — creator's voice, not customer quotes
  price: PluginPrice;
  purchaseUrl?: string; // no checkout link exists yet — every CTA falls back to mailto
  accent: string;
  mockup: "paste" | "link" | "console";
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
  youtubeVideoId: "Z5c3KnCIRT4",
  idealFor: [
    "Trabalha com referências visuais",
    "Usa screenshots e imagens durante a edição",
    "Precisa colocar imagens rapidamente no Premiere",
    "Quer eliminar downloads desnecessários",
  ],
  signals: [
    "CRIADO PORQUE SALVAR UMA IMAGEM SÓ PRA IMPORTAR NÃO FAZIA SENTIDO.",
    "COPIAR E COLAR DEVERIA SER ASSIM TÃO SIMPLES.",
    "MENOS ARQUIVO SOLTO NO COMPUTADOR.",
    "FEITO PRA QUEM EDITA TODO DIA.",
  ],
  price: { amount: 22.9, currency: "R$", originalAmount: 42.9 },
  accent: "#80f425",
  mockup: "paste",
};

export const youtubeImporter: PluginItem = {
  id: "02",
  slug: "youtube-importer",
  badge: "PLUGIN #02",
  name: "KVN Importer",
  headline: "Um link. O arquivo está no seu Premiere.",
  pitch: "O KVN Importer permite importar conteúdos diretamente para o Premiere Pro simplesmente colando o link.",
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
  youtubeVideoId: "iwdgJjpi3N0",
  idealFor: [
    "Trabalha constantemente com vídeos online",
    "Usa YouTube, TikTok ou Instagram como fonte",
    "Precisa importar músicas e vídeos",
    "Quer reduzir etapas no workflow",
  ],
  signals: [
    "CRIADO PORQUE BAIXAR VÍDEO SÓ PRA IMPORTAR TOMA TEMPO DEMAIS.",
    "COLOU O LINK. IMPORTOU. SEGUIU EDITANDO.",
    "MENOS ABA, MENOS DOWNLOAD, MENOS FRICÇÃO.",
    "FEITO PRA QUEM VIVE DENTRO DO PREMIERE.",
  ],
  price: { amount: 34.9, currency: "R$", originalAmount: 54.9 },
  accent: "#80f425",
  mockup: "link",
};

export const kvnConsole: PluginItem = {
  id: "03",
  slug: "kvn-console",
  badge: "PLUGIN #03",
  name: "KVN Console",
  headline: "Encontre o efeito. Continue no corte.",
  pitch: "Busque efeitos e transições no Premiere Pro, mantenha seus favoritos por perto e abra a busca com um atalho configurável.",
  pains: ["Procurar o mesmo efeito em painéis e pastas toda vez que precisa dele.", "Interromper a edição para navegar por menus e lembrar onde está cada recurso."],
  explainerSteps: ["Selecione o clipe na timeline.", "Abra o Console pelo seu atalho.", "Busque o efeito ou a transição.", "Aplique e continue editando."],
  benefits: ["Busca de efeitos e transições", "Favoritos para os recursos que você mais usa", "Histórico para reencontrar os últimos recursos", "Atalho configurável para abrir a busca", "Hub de atalhos no Windows", "Feito para usar dentro do Premiere Pro"],
  oldWay: ["ABRIR PAINEL", "NAVEGAR PASTAS", "LOCALIZAR EFEITO", "APLICAR", "VOLTAR AO CORTE"],
  newWay: ["ATALHO", "BUSCAR", "APLICAR"],
  demoCaption: "Um atalho. Uma busca. De volta à edição.",
  youtubeVideoId: "k9DzHMLTNkM",
  idealFor: ["Usa os mesmos efeitos em vários projetos", "Quer acessar transições com menos etapas", "Prefere trabalhar com atalhos", "Está montando um fluxo mais organizado no Premiere"],
  signals: ["SEU PRÓXIMO EFEITO, A UMA BUSCA DE DISTÂNCIA.", "FAVORITOS POR PERTO. MENOS TEMPO NOS MENUS.", "FEITO PARA QUEM VIVE DENTRO DO PREMIERE."],
  price: { amount: 27.9, currency: "R$", originalAmount: 47.9 },
  accent: "#80f425",
  mockup: "console",
};

export const plugins: PluginItem[] = [copyPasta, youtubeImporter, kvnConsole];

export const pluginBonus = {
  name: "Pacote com 10 predefinições de animações e efeitos",
  shortLabel: "Bônus: 10 predefinições de animações e efeitos",
};

export const pluginCombo: {
  name: string;
  price: PluginPrice;
  items: PluginItem[];
  purchaseUrl?: string;
} = {
  name: "Combo KVN",
  price: { amount: 57.9, currency: "R$" },
  items: [copyPasta, youtubeImporter, kvnConsole],
};

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
      "Sim! O plugin funciona nas últimas versões do Adobe Premiere Pro.",
  },
  {
    question: "Preciso pagar mensalidade?",
    answer: "Não. O pagamento é único e o acesso é vitalício — sem assinatura e sem mensalidade.",
  },
  {
    question: "Quais plugins estão incluídos no combo?",
    answer: `O ${pluginCombo.name} inclui Copy & Pasta, KVN Importer e KVN Console por ${pluginCombo.price.currency} ${formatPriceAmount(pluginCombo.price.amount)}, em pagamento único.`,
  },
  {
    question: "O que recebo de bônus?",
    answer: `Na compra de qualquer plugin avulso ou do combo, você recebe também um ${pluginBonus.name.toLowerCase()}, sem custo adicional.`,
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
    answer: "Não! A instalação é muito fácil. Após a compra, você receberá um guia de instalação para Mac e Windows.",
  },
  {
    question: "O KVN Importer funciona com quais plataformas?",
    answer: "YouTube, TikTok e Instagram.",
    onlyFor: "youtube-importer",
  },
  {
    question: "Posso usar o plugin em mais de um computador?",
    answer: "Sim! O acesso é vitalício, e você pode usar o plugin em quantos computadores quiser. Para facilitar a instalação, ele não exige chaves de acesso. Só peço que não compartilhe o plugin com outras pessoas: confio na sua honestidade!",
  },
];

export function getFaqForPlugin(slug: string): FaqItem[] {
  return pluginsFaq.filter((item) => !item.onlyFor || item.onlyFor === slug);
}
