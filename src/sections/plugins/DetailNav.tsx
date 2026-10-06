import { useState } from "react";
import { Link } from "react-router-dom";
import { getPurchaseHref, type PluginItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./DetailNav.css";

const LINKS = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
];

export default function DetailNav({ item }: { item: PluginItem }) {
  const [open, setOpen] = useState(false);
  const purchaseHref = getPurchaseHref(item.name, item.purchaseUrl);

  function go(href: string) {
    sfx.click();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="dnav t-mono">
      <div className="dnav-row">
        <Link to="/plugins" className="dnav-brand" onClick={() => sfx.click()}>
          ← <span>PLUGINS</span>
        </Link>

        <div className="dnav-links">
          {LINKS.map((link) => (
            <button key={link.href} type="button" onClick={() => go(link.href)} onMouseEnter={() => sfx.hover()}>
              {link.label}
            </button>
          ))}
        </div>

        <a
          href={purchaseHref}
          className="dnav-cta"
          onMouseEnter={() => sfx.hover()}
          onClick={() => sfx.confirm()}
        >
          Comprar
        </a>

        <button type="button" className="dnav-toggle" aria-label="Abrir menu" onClick={() => setOpen((v) => !v)}>
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="dnav-mobile">
          {LINKS.map((link) => (
            <button key={link.href} type="button" onClick={() => go(link.href)}>
              {link.label}
            </button>
          ))}
          <a href={purchaseHref} className="dnav-mobile-cta" onClick={() => sfx.confirm()}>
            Comprar
          </a>
        </div>
      )}
    </nav>
  );
}
