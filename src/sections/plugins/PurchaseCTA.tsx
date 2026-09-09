import { formatPriceAmount, getPurchaseHref, type Plugin } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PurchaseCTA.css";

export default function PurchaseCTA({ plugin }: { plugin: Plugin }) {
  const href = getPurchaseHref(plugin);

  return (
    <section className="purchase">
      <span className="purchase-eyebrow t-mono">NOVAS FERRAMENTAS ENTRAM NO SISTEMA CONSTANTEMENTE.</span>
      <h2 className="purchase-heading t-display">PRONTO PRA CORTAR AS ETAPAS EXTRAS?</h2>

      {plugin.price && (
        <div className="purchase-price t-mono">
          {plugin.price.originalAmount && (
            <span className="purchase-price-was">
              DE {plugin.price.currency} {formatPriceAmount(plugin.price.originalAmount)}
            </span>
          )}
          <span className="purchase-price-amount">
            {plugin.price.originalAmount ? "POR " : ""}
            {plugin.price.currency} {formatPriceAmount(plugin.price.amount)}
          </span>
          {plugin.price.interval && <span className="purchase-price-interval">{plugin.price.interval}</span>}
        </div>
      )}

      <a
        href={href}
        className="purchase-cta t-mono"
        target={plugin.purchaseUrl ? "_blank" : undefined}
        rel={plugin.purchaseUrl ? "noopener noreferrer" : undefined}
        onMouseEnter={() => sfx.hover()}
        onClick={() => sfx.confirm()}
      >
        COMPRAR {plugin.name}
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
