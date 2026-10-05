import { getPurchaseHref } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PluginsFooter.css";

function go(href: string) {
  sfx.click();
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export default function PluginsFooter() {
  return (
    <footer className="pfooter t-mono">
      <div className="pfooter-top">
        <div className="pfooter-brand">
          <span className="pfooter-brand-name t-display">KVN PLUGINS</span>
          <p className="pfooter-tagline">Ferramentas criadas para deixar seu workflow no Premiere mais rápido.</p>
        </div>

        <nav className="pfooter-links">
          <button type="button" onClick={() => go("#plugins")}>
            Plugins
          </button>
          <a href={getPurchaseHref("Oferta KVN Plugins")} onClick={() => sfx.click()}>
            Comprar
          </a>
          <button type="button" onClick={() => go("#faq")}>
            FAQ
          </button>
          <a href="mailto:contact@kvnlira.com" onClick={() => sfx.click()}>
            Suporte
          </a>
          <span className="pfooter-link-placeholder" title="Em preparação">
            Termos
          </span>
          <span className="pfooter-link-placeholder" title="Em preparação">
            Privacidade
          </span>
        </nav>
      </div>

      <div className="pfooter-bottom">
        <span>KVN_SYSTEMS © 2026</span>
      </div>
    </footer>
  );
}
