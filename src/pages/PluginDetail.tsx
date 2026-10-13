import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPriceAmount, getFaqForPlugin, getOtherPlugin, getPluginBySlug, getPurchaseHref, type PluginItem } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import FAQSection from "../sections/plugins/FAQSection";
import PluginsFooter from "../sections/plugins/PluginsFooter";
import "./PluginDetail.css";

const messages = ["MENOS ETAPAS. MAIS EDIÇÃO.", "MAC + WINDOWS", "PAGAMENTO ÚNICO", "SEM CHAVES DE ACESSO", "FEITO PARA PREMIERE PRO"];

function WorkflowPreview({ item }: { item: PluginItem }) {
  const [imported, setImported] = useState(false);
  const paste = item.mockup === "paste";
  useEffect(() => setImported(false), [item.slug]);
  return <div className="lp-preview">
    <div className="lp-windowbar"><span><i /> KVN_WORKSPACE</span><span>Pr / 01</span></div>
    <div className="lp-preview-stage"><div className="lp-preview-grid" aria-hidden="true" />
      <div className="lp-art"><span className="lp-art-number">{paste ? "C+V" : "URL"}</span><span className="lp-art-label">{paste ? "SUA PRÓXIMA REFERÊNCIA" : "SEU PRÓXIMO CORTE"}</span></div>
      <div className="lp-command"><span className="lp-command-label">{item.name}</span><div className="lp-input">{paste ? "Imagem na área de transferência" : "youtube.com/watch?v=seu-video"}</div><button type="button" onClick={() => setImported(!imported)}>{imported ? "REPETIR PRÉVIA ↻" : paste ? "COLAR IMAGEM →" : "IMPORTAR LINK →"}</button></div>
    </div>
    <div className="lp-timeline"><div className="lp-track-label"><span>SEQUÊNCIA 01</span><span aria-live="polite">{imported ? "ASSET NA EDIÇÃO ✓" : "PRONTO PARA RECEBER"}</span></div><div className="lp-track"><span>V1</span><i /><i /><i className={imported ? "lp-clip is-imported" : "lp-clip"}>{imported ? paste ? "IMAGEM" : "VÍDEO" : "+"}</i></div><div className="lp-track lp-track-audio"><span>A1</span><i /><i /></div></div>
    <div className="lp-preview-caption"><span>PRÉVIA ILUSTRATIVA DO FLUXO</span><span>CLIQUE PARA EXPLORAR ↗</span></div>
  </div>;
}

export default function PluginDetail() {
  const { slug } = useParams();
  const item = getPluginBySlug(slug);
  const { setSectionLabel } = useSystem();
  useEffect(() => {
    window.scrollTo(0, 0);
    setSectionLabel(item ? item.name.toUpperCase() : "PLUGIN_NOT_FOUND");
    const previous = document.title;
    document.title = item ? `${item.name} — Menos etapas. Mais edição. | KVN` : "Plugin não encontrado | KVN";
    return () => { document.title = previous; };
  }, [item, setSectionLabel]);
  if (!item) return <div className="plugin-detail-missing"><p>PLUGIN NÃO ENCONTRADO</p><Link to="/plugins">← VOLTAR AOS PLUGINS</Link></div>;
  const paste = item.mockup === "paste";
  const other = getOtherPlugin(item.slug);
  const individualHref = getPurchaseHref(item.name, item.purchaseUrl);
  const comboHref = getPurchaseHref("Combo Copy & Pasta + KVN Importer — R$ 45,90");
  const steps = paste ? [
    { title: "Encontrou. Copiou.", text: "Copie a imagem que você quer usar na edição." },
    { title: "Voltou. Colou.", text: "Abra o Copy & Pasta dentro do Premiere e cole a imagem." },
    { title: "Seguiu editando.", text: "Sua referência entra no projeto. Sem salvar e procurar o arquivo manualmente." },
  ] : [
    { title: "Encontrou. Copiou.", text: "Copie o link do vídeo ou da música que você precisa." },
    { title: "Colou. Importou.", text: "Cole o link no KVN Importer, dentro do Premiere." },
    { title: "Seguiu editando.", text: "Traga o conteúdo para o projeto sem fazer o caminho manual de download e importação." },
  ];
  const audiences = paste ? ["Você monta vídeos com memes, screenshots e referências visuais.", "Você está começando e quer um fluxo mais simples desde o primeiro projeto.", "Você edita todo dia e quer cortar as tarefas repetitivas do caminho."] : ["Você trabalha com conteúdos do YouTube, TikTok e Instagram.", "Você está começando e quer importar vídeos e músicas com menos etapas.", "Você vive no Premiere e quer passar menos tempo alternando janelas."];
  return <article className="plugin-detail lp">
    <nav className="lp-nav" aria-label="Navegação do plugin"><Link to="/plugins" className="lp-brand">KVN<span> / PLUGINS</span></Link><div><a href="#como-funciona">O fluxo</a><a href="#faq">Dúvidas</a><a className="lp-nav-cta" href="#oferta">QUERO O MEU ↗</a></div></nav>
    <div className="lp-announcement"><span className="lp-status-dot" />SEU TEMPO É PARA EDITAR. NÃO PARA REPETIR TAREFAS.</div>
    <header className="lp-hero lp-container">
      <div className="lp-hero-copy"><div className="lp-eyebrow">{item.badge} <span>/ ADOBE PREMIERE PRO</span></div><p className="lp-product-name">{item.name}</p><h1>{paste ? <>A imagem que você quer.<br /><em>Sem o caminho longo.</em></> : <>Do link à edição.<br /><em>Sem o caminho longo.</em></>}</h1><p className="lp-lead">{paste ? "Copie uma imagem e cole no Premiere. Elimine o ritual de salvar, procurar a pasta e importar — e continue de onde a sua ideia parou." : "YouTube, TikTok e Instagram direto no seu fluxo. Cole o link no plugin e importe para o Premiere, sem atravessar um monte de abas e pastas."}</p><div className="lp-hero-actions"><a className="lp-button" href="#oferta">QUERO SIMPLIFICAR MINHA EDIÇÃO <span>↗</span></a><a className="lp-text-link" href="#como-funciona">Explore o fluxo ↓</a></div><div className="lp-hero-facts"><span>✓ Mac e Windows</span><span>✓ Acesso vitalício</span><span>✓ Sem mensalidade</span></div></div>
      <WorkflowPreview item={item} />
      <div className="lp-hero-bottom"><span>FERRAMENTAS PEQUENAS. UM FLUXO MAIS LEVE.</span><span>DESENVOLVIDO POR KEVIN LIRA / KVN_SYSTEMS</span></div>
    </header>
    <div className="lp-marquee" aria-label="Benefícios dos plugins"><div>{[0, 1].map(copy => <div className="lp-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{messages.map(message => <span key={message}>{message}<b aria-hidden="true">✳</b></span>)}</div>)}</div></div>
    <section className="lp-container lp-problem"><div className="lp-section-label">01 / O PROBLEMA NÃO É VOCÊ</div><div className="lp-split"><h2>Uma tarefa pequena.<br /><span>Um desvio enorme.</span></h2><div><p>{paste ? "Você só queria colocar uma imagem no vídeo. Mas precisou baixar, escolher onde salvar, procurar o arquivo e importar. Tudo isso para voltar ao que realmente importa." : "Você achou o conteúdo certo. Agora precisa sair do Premiere, abrir um site, baixar, encontrar a pasta e importar. A ideia era editar. Não administrar downloads."}</p><p>Uma vez parece pouco. Repetido durante o projeto, vira uma sequência de interrupções. O plugin encurta esse caminho.</p></div></div><div className="lp-comparison"><div><span className="lp-small-label">O CAMINHO MANUAL</span><div className="lp-chain">{item.oldWay.map((step, i) => <span key={step}>{i > 0 && <b>→</b>}{step}</span>)}</div></div><div className="lp-after"><span className="lp-small-label">COM {item.name.toUpperCase()}</span><div className="lp-chain">{(paste ? ["COPIAR", "COLAR NO PREMIERE"] : ["COPIAR LINK", "IMPORTAR NO PREMIERE"]).map((step, i) => <span key={step}>{i > 0 && <b>→</b>}{step}</span>)}</div></div></div></section>
    <section id="como-funciona" className="lp-how"><div className="lp-container"><div className="lp-section-label">02 / MENOS ETAPAS NA PRÁTICA</div><div className="lp-section-heading"><h2>{paste ? "Copiar. Colar. Criar." : "Um link. Seu próximo corte."}</h2><p>Um atalho para a sua rotina.<br />Dentro do editor que você já usa.</p></div><div className="lp-steps">{steps.map((step, i) => <div key={step.title}><span className="lp-step-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><div className="lp-compat"><span>Pr</span><p>FEITO PARA ADOBE PREMIERE PRO<small>Compatível com as últimas versões. Guia de instalação para Mac e Windows incluído.</small></p></div></div></section>
    <section className="lp-container lp-fit"><div className="lp-section-label">03 / SE RECONHECE?</div><div className="lp-split"><h2>Para quem está<br /><span>no ritmo da edição.</span></h2><div className="lp-fit-list">{audiences.map((line, i) => <p key={line}><span>0{i + 1}</span>{line}</p>)}</div></div><div className="lp-note"><span>CRIATIVIDADE CONTINUA SENDO SUA.</span><p>O plugin remove etapas para você dedicar mais atenção ao corte, ao ritmo e à ideia.</p></div></section>
    <section id="oferta" className="lp-offer"><div className="lp-container"><div className="lp-section-label">04 / ESCOLHA SEU ATALHO</div><div className="lp-offer-heading"><h2>Menos trabalho repetitivo.<br /><em>Um pagamento só.</em></h2><p>Oferta de lançamento. Acesso vitalício.<br />Escolha um plugin ou leve os dois.</p></div><div className="lp-offer-grid">
      <div className="lp-price-card"><span className="lp-small-label">SEU PRIMEIRO ATALHO</span><h3>{item.name}</h3><p>{paste ? "Imagens no Premiere com copiar e colar." : "Vídeos e músicas no Premiere através de links."}</p><div className="lp-price"><span>DE <s>R$ 49,90</s> POR</span><strong>R$ {formatPriceAmount(item.price.amount)}</strong><small>Pagamento único • Sem assinatura</small></div><ul><li>Plugin {item.name}</li><li>Guia de instalação para Mac e Windows</li><li>Acesso vitalício nos seus computadores</li><li>Entrega por WhatsApp e e-mail</li></ul><a className="lp-button lp-button-outline" href={individualHref}>QUERO O {item.name.toUpperCase()} <span>↗</span></a></div>
      <div className="lp-price-card lp-price-combo"><div className="lp-combo-badge">DOIS ATALHOS / UMA COMPRA</div><span className="lp-small-label">SEU FLUXO MAIS COMPLETO</span><h3>Combo KVN</h3><p>Copy & Pasta + KVN Importer.<br />Imagens, vídeos e músicas. Menos etapas.</p><div className="lp-price"><span>OS DOIS PLUGINS POR</span><strong>R$ 45,90</strong><small>Economize R$ 9,90 em relação à compra separada</small></div><ul><li>Copy & Pasta + KVN Importer</li><li>Guias de instalação para Mac e Windows</li><li>Acesso vitalício nos seus computadores</li><li>Entrega por WhatsApp e e-mail</li></ul><a className="lp-button" href={comboHref}>QUERO OS DOIS PLUGINS <span>↗</span></a></div>
    </div><p className="lp-purchase-note">A compra começa por e-mail. Clique na sua opção para solicitar o plugin ou o combo.</p><div className="lp-trust"><span>01 / SEM MENSALIDADE</span><span>02 / SEM CHAVES DE ACESSO</span><span>03 / GUIA DE INSTALAÇÃO INCLUÍDO</span></div></div></section>
    <FAQSection items={getFaqForPlugin(item.slug)} />
    <section className="lp-container lp-final"><span className="lp-section-label">SUA PRÓXIMA EDIÇÃO PODE TER MENOS ETAPAS.</span><h2>Volte para a ideia.<br /><span>Encurte o caminho.</span></h2><a className="lp-button" href="#oferta">ESCOLHER MEU PLUGIN <span>↗</span></a>{other && <Link className="lp-text-link" to={`/plugins/${other.slug}`}>Conheça também o {other.name} ↗</Link>}</section>
    <PluginsFooter purchaseHref={individualHref} showFaqAnchor />
    <div className="lp-bottom-bar"><span>{item.name}<small>Menos etapas. Mais edição.</small></span><a href="#oferta">VER OFERTAS ↗</a></div>
  </article>;
}
