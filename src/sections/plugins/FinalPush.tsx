import { formatPriceAmount, getPurchaseHref, type PluginItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./FinalPush.css";

export default function FinalPush({ item }: { item: PluginItem }) {
  return (
    <section className="final-push">
      <span className="final-push-eyebrow t-mono">PRONTO PRA SIMPLIFICAR SEU WORKFLOW?</span>
      <h2 className="final-push-heading t-display">{item.headline}</h2>

      <div className="final-push-price">
        {item.price.originalAmount && (
          <span className="final-push-price-was t-mono">
            DE {item.price.currency} {formatPriceAmount(item.price.originalAmount)}
          </span>
        )}
        <span className="final-push-price-now t-display">
          {item.price.originalAmount ? "POR " : ""}
          {item.price.currency} {formatPriceAmount(item.price.amount)}
        </span>
      </div>

      <a
        href={getPurchaseHref(item.name, item.purchaseUrl)}
        className="final-push-cta t-mono"
        onMouseEnter={() => sfx.hover()}
        onClick={() => sfx.confirm()}
      >
        QUERO {item.name.toUpperCase()}
        <span aria-hidden="true">→</span>
      </a>
      <span className="final-push-microcopy t-mono">Pagamento único • Acesso vitalício • Sem mensalidade</span>
    </section>
  );
}
