import { Link } from "react-router-dom";
import { formatPriceAmount, pluginBonus, pluginCombo, type FaqItem, type PluginItem } from "../data/plugins";
import PluginPromotion from "../sections/plugins/PluginPromotion";
import ConsolePreview from "../sections/plugins/ConsolePreview";
import PluginOffers from "../sections/plugins/PluginOffers";
import OfferCountdown from "../sections/plugins/OfferCountdown";
import SalesVideo from "../sections/plugins/SalesVideo";
import PremiereCompatibility from "../sections/plugins/PremiereCompatibility";
import SectionPurchaseLink from "../sections/plugins/SectionPurchaseLink";
import FAQSection from "../sections/plugins/FAQSection";
import PluginsFooter from "../sections/plugins/PluginsFooter";
import "./PluginDetail.css";
import "./ConsoleDetail.css";

const steps = [
  { title: "Selecione. Abra.", text: "Selecione o clipe na timeline e abra a busca pelo atalho que você configurou." },
  { title: "Digite. Encontre.", text: "Busque o efeito ou a transição pelo nome. Reencontre seus recursos também nos favoritos e no histórico." },
  { title: "Aplique. Continue.", text: "Escolha o recurso e siga editando. Menos caminho pelos painéis, mais atenção no seu corte." },
];

const faq: FaqItem[] = [
  { question: "O que o KVN Console faz?", answer: "Ele reúne a busca de efeitos e transições do Premiere, favoritos, histórico e configuração de atalhos para facilitar o acesso durante a edição." },
  { question: "Ele vem com um pacote de efeitos novos?", answer: "A função do Console é facilitar encontrar e aplicar efeitos e transições disponíveis no Premiere. Além do plugin, sua compra inclui grátis um pack com mais de 10 predefinições de animações e efeitos." },
  { question: "Posso escolher o atalho que abre a busca?", answer: "Sim. No Windows, você configura uma tecla ou combinação no hub de atalhos do KVN Console. No Mac, o atalho para abrir o Console é configurado nos Atalhos de Apps do sistema." },
  { question: "Funciona no Windows e no Mac?", answer: "Há instalação para Windows e macOS. No Windows, a extensão e o auxiliar de atalhos vêm no mesmo instalador. No Mac, a extensão é instalada manualmente, e o atalho é configurado no sistema. Se quiser confirmar a compatibilidade com a sua versão do Premiere, fale com o suporte antes da compra." },
  { question: "Como instalo no Windows?", answer: "Feche o Premiere e execute o instalador. Depois, abra Janela > Extensões > KVN Console - Atalhos, escolha a tecla para abrir o Console e conclua a configuração." },
  { question: "Preciso pagar mensalidade?", answer: "Não. O pagamento é único, com acesso vitalício e sem mensalidade." },
  { question: "Como recebo o plugin depois da compra?", answer: "A entrega é feita por WhatsApp e e-mail, com as orientações de instalação." },
  { question: "O Console faz parte do combo?", answer: `Sim! O ${pluginCombo.name} inclui Copy & Pasta, KVN Importer e KVN Console por ${pluginCombo.price.currency} ${formatPriceAmount(pluginCombo.price.amount)}, em pagamento único.` },
  { question: "O que recebo de bônus?", answer: `Na compra do KVN Console ou do combo, você recebe também um ${pluginBonus.name.toLowerCase()}, sem custo adicional.` },
];

export default function ConsoleDetail({ item }: { item: PluginItem }) {

  return <article className="plugin-detail lp console-detail">
    <nav className="lp-nav" aria-label="Navegação do plugin"><Link to="/plugins" className="lp-brand">KVN<span> / PLUGINS</span></Link><div><a href="#como-funciona">O fluxo</a><a href="#faq">Dúvidas</a><a className="lp-nav-cta" href="#oferta">QUERO O MEU ↗</a></div></nav>
    <OfferCountdown />
    <header className="lp-hero lp-container">
      <div className="lp-hero-copy"><div className="lp-eyebrow">{item.badge}<span>/ ADOBE PREMIERE PRO</span></div><p className="lp-product-name">{item.name}</p><h1>O efeito certo.<br /><em>Sem se perder nos painéis.</em></h1><p className="lp-lead">Imagina não precisar ir para a aba Efeitos toda vez que quiser aplicar algo simples? Em vez disso, basta apertar <strong>UM botão</strong>. Eu sei, parece um sonho, mas com o KVN Console isso vira realidade. Ao apertar o botão que você escolhe, uma janela de busca abre: você digita o efeito, aplica e ela se fecha. Sem deixar mais uma janela atrapalhando sua edição!</p><PluginPromotion item={item} /><div className="lp-hero-actions"><a className="lp-button" href="#oferta">QUERO MEUS EFEITOS POR PERTO <span>↗</span></a><a className="lp-text-link" href="#previa">Experimente a busca ↓</a></div><div className="lp-hero-facts"><span>✓ Windows e Mac</span><span>✓ Acesso vitalício</span><span>✓ Atalho configurável</span></div></div>
      <ConsolePreview />
      <div className="lp-hero-bottom"><span>MENOS TEMPO NOS PAINÉIS. MAIS ATENÇÃO NA TIMELINE.</span><span>DESENVOLVIDO POR KEVIN LIRA / KVN_SYSTEMS</span></div>
    </header>
    <SalesVideo item={item} />
    <PremiereCompatibility note="Instalador único no Windows. Extensão e atalho configurados manualmente no Mac." />
    <section className="benefit-strip"><div className="lp-marquee" aria-label="Benefícios do KVN Console"><div>{[0, 1].map(copy => <div className="lp-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{["BUSCA DE EFEITOS", "TRANSIÇÕES POR PERTO", "SEUS FAVORITOS", "HISTÓRICO", "ATALHO CONFIGURÁVEL"].map(message => <span key={message}>{message}<b aria-hidden="true">✳</b></span>)}</div>)}</div></div><div className="lp-container"><SectionPurchaseLink /></div></section>
    <section className="lp-container lp-problem"><div className="lp-section-label">01 / SUA IDEIA NÃO PRECISA ESPERAR</div><div className="lp-split"><h2>Você sabe o que quer.<br /><span>Só falta encontrar.</span></h2><div><p>O corte pede um efeito. Você abre um painel, entra em uma pasta, procura o nome e volta para a timeline. Na próxima vez, repete o caminho.</p><p>O KVN Console aproxima os recursos da sua edição. Busque pelo nome, salve o que usa nos favoritos e reencontre o que acabou de usar no histórico.</p></div></div><div className="lp-comparison"><div><span className="lp-small-label">O CAMINHO MANUAL</span><div className="lp-chain">{item.oldWay.map((step, index) => <span key={step}>{index > 0 && <b>→</b>}{step}</span>)}</div></div><div className="lp-after"><span className="lp-small-label">COM KVN CONSOLE</span><div className="lp-chain">{item.newWay.map((step, index) => <span key={step}>{index > 0 && <b>→</b>}{step}</span>)}</div></div></div><SectionPurchaseLink /></section>
    <section id="como-funciona" className="lp-how"><div className="lp-container"><div className="lp-section-label">02 / DO ATALHO AO PRÓXIMO CORTE</div><div className="lp-section-heading"><h2>Busque. Aplique. Continue.</h2><p>Uma busca para os recursos que você usa.<br />Um atalho para chegar até eles.</p></div><div className="lp-steps">{steps.map((step, index) => <div key={step.title}><span className="lp-step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><SectionPurchaseLink /></div></section>

    <section className="lp-container lp-fit"><div className="lp-section-label">03 / SE RECONHECE?</div><div className="lp-split"><h2>Pra você que quer editar<br /><span>cada vez mais rápido!</span></h2><div className="lp-fit-list">{["Você usa os mesmos efeitos e transições em vários projetos.", "Você quer trabalhar com atalhos e depender menos dos menus.", "Você está montando seu fluxo de edição e quer manter os recursos organizados."].map((line, index) => <p key={line}><span>0{index + 1}</span>{line}</p>)}</div></div><div className="lp-note"><span>CRIATIVIDADE CONTINUA SENDO SUA.</span><p>O Console encurta o acesso às ferramentas para você se concentrar no ritmo, no acabamento e na ideia.</p></div><SectionPurchaseLink /></section>
    <PluginOffers item={item} />
    <FAQSection items={faq} />
    <section className="lp-container lp-final"><span className="lp-section-label">SEU PRÓXIMO EFEITO ESTÁ MAIS PERTO.</span><h2>Menos menus.<br /><span>Mais edição.</span></h2><a className="lp-button" href="#oferta">QUERO O KVN CONSOLE <span>↗</span></a><Link to="/plugins" className="lp-text-link">Conheça todos os plugins KVN ↗</Link></section>
    <PluginsFooter purchaseHref="#oferta" showFaqAnchor />
    <div className="lp-bottom-bar"><span>KVN Console<small>Encontre o efeito. Continue no corte.</small></span><a href="#oferta">VER OFERTA ↗</a></div>
  </article>;
}
