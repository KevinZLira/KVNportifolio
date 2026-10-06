import { Link } from "react-router-dom";
import { sfx } from "../../lib/sound";
import "./PluginsFooter.css";

function goToFaq() {
  sfx.click();
  document.querySelector("#faq")?.scrollIntoView({ behavior: "smooth" });
}

export default function PluginsFooter({
  purchaseHref,
  showFaqAnchor = false,
}: {
  purchaseHref?: string;
  showFaqAnchor?: boolean;
}) {
  return (
    <footer className="pfooter t-mono">
      <div className="pfooter-top">
        <div className="pfooter-brand">
          <span className="pfooter-brand-name t-display">KVN PLUGINS</span>
          <p className="pfooter-tagline">Ferramentas criadas para deixar seu workflow no Premiere mais rápido.</p>
        </div>

        <nav className="pfooter-links">
          <Link to="/plugins" onClick={() => sfx.click()}>
            Plugins
          </Link>
          {purchaseHref && (
            <a href={purchaseHref} onClick={() => sfx.click()}>
              Comprar
            </a>
          )}
          {showFaqAnchor && (
            <button type="button" onClick={goToFaq}>
              FAQ
            </button>
          )}
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
