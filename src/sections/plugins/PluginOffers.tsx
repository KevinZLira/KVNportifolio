import { Link } from "react-router-dom";
import { formatPriceAmount, getPurchaseHref, pluginCombo, type PluginItem } from "../../data/plugins";
import "./PluginOffers.css";

const descriptions: Record<PluginItem["mockup"], { mark: string; title: string; description: string; features: string[] }> = {
  paste: { mark: "C+V", title: "Imagens, sem o caminho longo.", description: "Copie uma imagem e cole no Premiere, sem salvar e procurar o arquivo manualmente.", features: ["Copiar e colar imagens", "Referências, memes e screenshots"] },
  link: { mark: "URL", title: "Do link ao seu projeto.", description: "Importe vídeos e músicas de YouTube, TikTok e Instagram colando o link no plugin.", features: ["Importação através de link", "Vídeos e músicas no seu fluxo"] },
  console: { mark: "FX", title: "O efeito certo, mais perto.", description: "Encontre efeitos e transições com uma busca, favoritos, histórico e atalho configurável.", features: ["Busca de efeitos e transições", "Favoritos, histórico e atalhos"] },
};

const toCents = (amount: number) => Math.round(amount * 100);

export default function PluginOffers({ item }: { item: PluginItem }) {
  const others = pluginCombo.items.filter(plugin => plugin.slug !== item.slug);
  const individualHref = getPurchaseHref(item.name, item.purchaseUrl);
  const comboHref = getPurchaseHref(`${pluginCombo.name} — ${pluginCombo.items.map(plugin => plugin.name).join(" + ")} — ${pluginCombo.price.currency} ${formatPriceAmount(pluginCombo.price.amount)}`, pluginCombo.purchaseUrl);
  const separateTotal = pluginCombo.items.reduce((total, plugin) => total + toCents(plugin.price.amount), 0);
  const comboSaving = (separateTotal - toCents(pluginCombo.price.amount)) / 100;
  const upgradeAmount = (toCents(pluginCombo.price.amount) - toCents(item.price.amount)) / 100;
  const individualSaving = item.price.originalAmount === undefined ? 0 : (toCents(item.price.originalAmount) - toCents(item.price.amount)) / 100;
  const description = descriptions[item.mockup];

  return <>
    <section className="plugin-upsell lp-container" aria-labelledby="plugin-upsell-title">
      <div className="lp-section-label">COMPLETE SEU FLUXO</div>
      <div className="lp-section-heading"><h2 id="plugin-upsell-title">Mais dois atalhos.<br /><span>Para outras partes da edição.</span></h2><p>Você já conheceu o {item.name}.<br />Veja o que os outros plugins fazem.</p></div>
      <div className="plugin-upsell-grid">{others.map(plugin => {
        const content = descriptions[plugin.mockup];
        return <article className="plugin-upsell-card" key={plugin.slug}>
          <div className="plugin-upsell-top"><span className="plugin-upsell-mark" aria-hidden="true">{content.mark}</span><span className="plugin-upsell-price">AVULSO<strong>{plugin.price.currency} {formatPriceAmount(plugin.price.amount)}</strong></span></div>
          <span className="lp-small-label">{plugin.badge}</span><h3>{plugin.name}</h3><p className="plugin-upsell-title">{content.title}</p><p>{content.description}</p>
          <ul>{content.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
          <Link className="plugin-upsell-link" to={`/plugins/${plugin.slug}`} aria-label={`Conhecer ${plugin.name}`}>CONHECER O PLUGIN <span>↗</span></Link>
        </article>;
      })}</div>
      <div className="plugin-upsell-upgrade"><div><span className="lp-small-label">LEVE OS TRÊS NO COMBO</span><p>Por mais <strong>R$ {formatPriceAmount(upgradeAmount)}</strong> em relação ao {item.name}, leve também {others.map(plugin => plugin.name).join(" e ")}.</p></div><a href="#combo" className="lp-text-link">VER O COMBO COMPLETO ↓</a></div>
    </section>
    <section id="oferta" className="lp-offer"><div className="lp-container">
      <div className="lp-section-label">ESCOLHA SEU PRÓXIMO ATALHO</div>
      <div className="lp-offer-heading"><h2>Menos trabalho repetitivo.<br /><em>Um pagamento só.</em></h2><p>Escolha o {item.name} avulso<br />ou leve os três plugins no combo.</p></div>
      <div className="lp-offer-grid">
        <div className="lp-price-card lp-price-promo"><span className="lp-launch-badge">OFERTA DE LANÇAMENTO</span><span className="lp-small-label">SEU PRIMEIRO ATALHO</span><h3>{item.name}</h3><p>{description.title}</p>
          <div className="lp-price">{item.price.originalAmount !== undefined && <span className="lp-price-before">PREÇO NORMAL <s>{item.price.currency} {formatPriceAmount(item.price.originalAmount)}</s></span>}<span className="lp-price-condition">AGORA, NA OFERTA DE LANÇAMENTO</span><strong>{item.price.currency} {formatPriceAmount(item.price.amount)}</strong>{individualSaving > 0 && <span className="lp-price-saving">VOCÊ ECONOMIZA R$ {formatPriceAmount(individualSaving)}</span>}<small>Pagamento único • Acesso vitalício</small></div>
          <ul><li>Plugin {item.name}</li>{description.features.map(feature => <li key={feature}>{feature}</li>)}<li>Orientações de instalação para Windows e Mac</li><li>Entrega por WhatsApp e e-mail</li></ul>
          <a className="lp-button lp-button-outline" href={individualHref}>QUERO SÓ ESTE PLUGIN <span>↗</span></a>
        </div>
        <div id="combo" className="lp-price-card lp-price-combo"><div className="lp-combo-badge">TRÊS ATALHOS / UMA COMPRA</div><span className="lp-small-label">SEU FLUXO MAIS COMPLETO</span><h3>{pluginCombo.name}</h3><p>Imagens, vídeos, músicas, efeitos e transições.<br />Três plugins para encurtar o caminho.</p>
          <div className="lp-price"><span>OS TRÊS AVULSOS: <s>R$ {formatPriceAmount(separateTotal / 100)}</s></span><strong>{pluginCombo.price.currency} {formatPriceAmount(pluginCombo.price.amount)}</strong><small>Economize R$ {formatPriceAmount(comboSaving)} em relação à compra separada</small></div>
          <ul className="plugin-combo-items">{pluginCombo.items.map(plugin => <li key={plugin.slug}><span><strong>{plugin.name}</strong><small>{descriptions[plugin.mockup].title}</small></span><span>{plugin.price.currency} {formatPriceAmount(plugin.price.amount)}</span></li>)}</ul>
          <p className="plugin-combo-microcopy">Acesso vitalício aos três plugins.<br />Orientações de instalação para Windows e Mac.</p>
          <a className="lp-button" href={comboHref}>QUERO OS TRÊS PLUGINS <span>↗</span></a>
        </div>
      </div>
      <p className="lp-purchase-note">A compra começa por e-mail. Clique na sua opção para solicitar o plugin ou o combo.</p>
      <div className="lp-trust"><span>01 / SEM MENSALIDADE</span><span>02 / ACESSO VITALÍCIO</span><span>03 / WINDOWS E MAC</span></div>
    </div></section>
  </>;
}
