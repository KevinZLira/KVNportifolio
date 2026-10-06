import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { plugins } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import { sfx } from "../lib/sound";
import PluginsFooter from "../sections/plugins/PluginsFooter";
import "./Plugins.css";

// Showroom: a catalog, not a sales funnel. Each plugin gets its own
// dedicated page (/plugins/:slug) with its own price, purchase CTA and
// (eventually) its own checkout link — splitting them keeps Hotmart
// tracking per-product instead of mixed on one combined page. This page
// only has to get someone to click through.
export default function Plugins() {
  const navigate = useNavigate();
  const { setSectionLabel } = useSystem();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSectionLabel("KVN_PLUGINS");
  }, [setSectionLabel]);

  return (
    <article className="plugins-page">
      <div className="plugins-top t-mono">
        <span className="plugins-path">/SISTEMA/PLUGINS</span>
        <button
          type="button"
          className="plugins-back"
          onClick={() => {
            sfx.click();
            navigate("/");
          }}
          onMouseEnter={() => sfx.hover()}
        >
          ← VOLTAR AO SISTEMA
        </button>
      </div>

      <header className="showroom-head">
        <span className="showroom-eyebrow t-mono">PLUGINS PARA ADOBE PREMIERE PRO</span>
        <h1 className="showroom-title t-display">Ferramentas para quem vive no Premiere.</h1>
      </header>

      <div className="showroom-grid">
        {plugins.map((item) => (
          <Link
            key={item.id}
            to={`/plugins/${item.slug}`}
            className="showroom-card"
            onMouseEnter={() => sfx.hover()}
            onClick={() => sfx.click()}
          >
            <span className="showroom-card-badge t-mono">{item.badge}</span>
            <h2 className="showroom-card-name t-display">{item.name}</h2>
            <p className="showroom-card-desc t-mono">{item.pitch}</p>
            <span className="showroom-card-cta t-mono">
              VER PLUGIN
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>

      <PluginsFooter />
    </article>
  );
}
