import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFaqForPlugin, getPluginBySlug, type PluginItem } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import FAQSection from "../sections/plugins/FAQSection";
import PluginsFooter from "../sections/plugins/PluginsFooter";
import Testimonials from "../sections/plugins/Testimonials";
import SalesVideo from "../sections/plugins/SalesVideo";
import PremiereCompatibility from "../sections/plugins/PremiereCompatibility";
import SectionPurchaseLink from "../sections/plugins/SectionPurchaseLink";
import OfferCountdown from "../sections/plugins/OfferCountdown";
import ConsoleDetail from "./ConsoleDetail";
import PluginOffers from "../sections/plugins/PluginOffers";
import PluginPromotion from "../sections/plugins/PluginPromotion";
import { getTestimonialsForPlugin } from "../data/testimonials";
import "./PluginDetail.css";

const messages = ["MENOS ETAPAS. MAIS EDIÇÃO.", "MAC + WINDOWS", "PAGAMENTO ÚNICO", "SEM CHAVES DE ACESSO", "FEITO PARA PREMIERE PRO"];

function WorkflowPreview({ item }: { item: PluginItem }) {
  const [imported, setImported] = useState(false);
  const paste = item.mockup === "paste";
  useEffect(() => setImported(false), [item.slug]);
  return <div id="previa" className="lp-preview">
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
  if (item.mockup === "console") return <ConsoleDetail item={item} />;
  const paste = item.mockup === "paste";
  const flowHref = "#video";
  const audiences = paste ? ["Você monta vídeos com memes, screenshots e referências visuais.", "Você está começando e quer um fluxo mais simples desde o primeiro projeto.", "Você edita todo dia e quer cortar as tarefas repetitivas do caminho."] : ["Você trabalha com conteúdos do YouTube, TikTok e Instagram.", "Você está começando e quer importar vídeos e músicas com menos etapas.", "Você vive no Premiere e quer passar menos tempo alternando janelas."];
  return <article className={`plugin-detail lp ${paste ? "lp-paste" : "lp-importer"}`}>
    <nav className="lp-nav" aria-label="Navegação do plugin"><Link to="/plugins" className="lp-brand">KVN<span> / PLUGINS</span></Link><div><a href={flowHref}>Demonstração</a><a href="#faq">Dúvidas</a><a className="lp-nav-cta" href="#oferta">QUERO O MEU ↗</a></div></nav>
    <OfferCountdown />
    <header className="lp-hero lp-container">
      <div className="lp-hero-copy"><div className="lp-eyebrow">{item.badge} <span>/ ADOBE PREMIERE PRO</span></div><p className="lp-product-name">{item.name}</p><h1>{paste ? <>É pegar uma imagem <em>e colar na sua timeline.</em></> : <>Imagina baixar qualquer vídeo da internet <em>com só um clique?</em></>}</h1><p className="lp-lead">{paste ? "O Premiere não permite copiar e colar imagens que ainda não estão no seu projeto. Isso acaba enchendo seu computador de arquivos — mas deixa de ser um problema com o Copy & Pasta. Ele permite colar qualquer imagem, de qualquer lugar, direto na sua timeline!" : "Já imaginou um plugin que permite baixar qualquer vídeo da internet e colocar direto na timeline do Premiere? É exatamente isso que o KVN Importer faz: pegue um link do Instagram, TikTok ou YouTube e importe direto para o seu projeto. Sem entrar em sites suspeitos e sem precisar baixar duas horas de vídeo desnecessárias no seu PC. Confira o vídeo de demonstração abaixo!"}</p><PluginPromotion item={item} /><div className="lp-hero-actions"><a className="lp-button" href="#oferta">QUERO FACILITAR MINHA EDIÇÃO <span>↗</span></a><a className="lp-text-link" href={flowHref}>Assista à demonstração ↓</a></div><div className="lp-hero-facts"><span>✓ Mac e Windows</span><span>✓ Acesso vitalício</span><span>✓ Sem mensalidade</span></div></div>
      <WorkflowPreview item={item} />
      <div className="lp-hero-bottom"><span>FERRAMENTAS PEQUENAS. UM FLUXO MAIS LEVE.</span><span>DESENVOLVIDO POR KEVIN LIRA / KVN_SYSTEMS</span></div>
    </header>
    <SalesVideo key={item.slug} item={item} />
    <PremiereCompatibility />
    <section className="benefit-strip"><div className="lp-marquee" aria-label="Benefícios dos plugins"><div>{[0, 1].map(copy => <div className="lp-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{messages.map(message => <span key={message}>{message}<b aria-hidden="true">✳</b></span>)}</div>)}</div></div></section>
    <section className="lp-container lp-problem"><div className="lp-section-label">01 / O PROBLEMA NÃO É VOCÊ</div><div className="lp-split"><h2>Uma tarefa pequena.<br /><span>Um desvio enorme.</span></h2><div><p>{paste ? "Você só queria colocar uma imagem no vídeo. Mas precisou baixar, escolher onde salvar, procurar o arquivo e importar. Tudo isso para voltar ao que realmente importa." : "Você achou o conteúdo certo. Agora precisa sair do Premiere, abrir um site, baixar, encontrar a pasta e importar. A ideia era editar. Não administrar downloads."}</p><p>Uma vez parece pouco. Repetido durante o projeto, vira uma sequência de interrupções. O plugin encurta esse caminho.</p></div></div><div className="lp-comparison"><div><span className="lp-small-label">O CAMINHO MANUAL</span><div className="lp-chain">{item.oldWay.map((step, i) => <span key={step}>{i > 0 && <b>→</b>}{step}</span>)}</div></div><div className="lp-after"><span className="lp-small-label">COM {item.name.toUpperCase()}</span><div className="lp-chain">{(paste ? ["COPIAR", "COLAR NO PREMIERE"] : ["COPIAR LINK", "IMPORTAR NO PREMIERE"]).map((step, i) => <span key={step}>{i > 0 && <b>→</b>}{step}</span>)}</div></div></div><SectionPurchaseLink /></section>

    <section className="lp-container lp-fit"><div className="lp-section-label">02 / SE RECONHECE?</div><div className="lp-split"><h2>Pra você que quer editar<br /><span>cada vez mais rápido!</span></h2><div className="lp-fit-list">{audiences.map((line, i) => <p key={line}><span>0{i + 1}</span>{line}</p>)}</div></div><div className="lp-note"><span>CRIATIVIDADE CONTINUA SENDO SUA.</span><p>O plugin remove etapas para você dedicar mais atenção ao corte, ao ritmo e à ideia.</p></div></section>
    <Testimonials items={getTestimonialsForPlugin(item.slug)} productName={item.name} />
    <PluginOffers item={item} />
    <FAQSection items={getFaqForPlugin(item.slug)} />
    <section className="lp-container lp-final"><span className="lp-section-label">SUA PRÓXIMA EDIÇÃO PODE TER MENOS ETAPAS.</span><h2>Volte para a ideia.<br /><span>Encurte o caminho.</span></h2><Link className="lp-text-link" to="/plugins">Conheça todos os plugins KVN ↗</Link></section>
    <PluginsFooter purchaseHref="#oferta" showFaqAnchor />
    <div className="lp-bottom-bar"><span>{item.name}<small>Menos etapas. Mais edição.</small></span><a href="#oferta">VER OFERTAS ↗</a></div>
  </article>;
}
