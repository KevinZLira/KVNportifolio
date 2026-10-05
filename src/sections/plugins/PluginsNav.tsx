import { useState } from "react";
import { getPurchaseHref } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PluginsNav.css";

const LINKS = [
  { label: "Plugins", href: "#plugins" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
];

export default function PluginsNav() {
  const [open, setOpen] = useState(false);

  function go(href: string) {
    sfx.click();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="plugins-nav t-mono">
      <div className="plugins-nav-row">
        <button type="button" className="plugins-nav-brand" onClick={() => go("#plugins-hero")}>
          KVN <span>PLUGINS</span>
        </button>

        <div className="plugins-nav-links">
          {LINKS.map((link) => (
            <button key={link.href} type="button" onClick={() => go(link.href)} onMouseEnter={() => sfx.hover()}>
              {link.label}
            </button>
          ))}
        </div>

        <a
          href={getPurchaseHref("Oferta KVN Plugins")}
          className="plugins-nav-cta"
          onMouseEnter={() => sfx.hover()}
          onClick={() => sfx.confirm()}
        >
          Comprar
        </a>

        <button
          type="button"
          className="plugins-nav-toggle"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="plugins-nav-mobile">
          {LINKS.map((link) => (
            <button key={link.href} type="button" onClick={() => go(link.href)}>
              {link.label}
            </button>
          ))}
          <a href={getPurchaseHref("Oferta KVN Plugins")} className="plugins-nav-mobile-cta" onClick={() => sfx.confirm()}>
            Comprar
          </a>
        </div>
      )}
    </nav>
  );
}
