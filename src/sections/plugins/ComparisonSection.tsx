import { formatPriceAmount, getPurchaseHref, type PluginItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./ComparisonSection.css";

export default function ComparisonSection({ items }: { items: PluginItem[] }) {
  return (
    <section className="compare">
      <h2 className="compare-title t-display">Qual deles é para você?</h2>

      <div className="compare-grid">
        {items.map((item) => (
          <div key={item.id} className="compare-col">
            <span className="compare-col-name t-display">{item.name}</span>
            <span className="compare-col-label t-mono">Ideal para quem:</span>
            <ul className="compare-col-list t-mono">
              {item.idealFor.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <span className="compare-col-price t-mono">
              {item.price.currency} {formatPriceAmount(item.price.amount)}
            </span>
            <a
              href={getPurchaseHref(item.name, item.purchaseUrl)}
              className="compare-col-cta t-mono"
              onMouseEnter={() => sfx.hover()}
              onClick={() => sfx.confirm()}
            >
              COMPRAR {item.name.toUpperCase()}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
