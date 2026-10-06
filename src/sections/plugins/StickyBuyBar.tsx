import { useEffect, useState } from "react";
import { formatPriceAmount, getPurchaseHref, type PluginItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./StickyBuyBar.css";

// Appears once the visitor has scrolled past the main pitch (.pfeature) —
// not from the first scroll, so it reads as "you're interested, here's the
// shortcut" rather than blocking the page immediately.
export default function StickyBuyBar({ item }: { item: PluginItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trigger = document.querySelector(".pfeature");
    if (!trigger) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`buybar t-mono ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <span className="buybar-name">{item.name}</span>
      <span className="buybar-price t-display">
        {item.price.originalAmount && (
          <span className="buybar-price-was">{formatPriceAmount(item.price.originalAmount)}</span>
        )}
        {item.price.currency} {formatPriceAmount(item.price.amount)}
      </span>
      <a
        href={getPurchaseHref(item.name, item.purchaseUrl)}
        className="buybar-cta"
        tabIndex={visible ? 0 : -1}
        onMouseEnter={() => sfx.hover()}
        onClick={() => sfx.confirm()}
      >
        COMPRAR →
      </a>
    </div>
  );
}
