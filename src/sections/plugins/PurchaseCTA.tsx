import type { Plugin } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PurchaseCTA.css";

export default function PurchaseCTA({ plugin }: { plugin: Plugin }) {
  const href =
    plugin.purchaseUrl ??
    `mailto:contact@kvnlira.com?subject=${encodeURIComponent(`${plugin.name} — PURCHASE`)}`;

  return (
    <section className="purchase">
      <span className="purchase-eyebrow t-mono">NEW TOOLS ENTER THE SYSTEM CONTINUOUSLY.</span>
      <h2 className="purchase-heading t-display">READY TO CUT THE EXTRA STEPS?</h2>

      {plugin.price && (
        <div className="purchase-price t-mono">
          <span className="purchase-price-amount">
            {plugin.price.currency} {plugin.price.amount.toFixed(2)}
          </span>
          {plugin.price.interval && (
            <span className="purchase-price-interval">{plugin.price.interval}</span>
          )}
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
        GET {plugin.name}
        <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
