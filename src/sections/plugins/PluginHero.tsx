import { getPurchaseHref, type Plugin } from "../../data/plugins";
import { useParallax } from "../../hooks/useParallax";
import { sfx } from "../../lib/sound";
import "./PluginHero.css";

export default function PluginHero({ plugin }: { plugin: Plugin }) {
  const gridRef = useParallax<HTMLDivElement>(0.06);

  return (
    <section className="plugin-hero">
      <div className="plugin-hero-grid" ref={gridRef} aria-hidden="true" />

      <div className="plugin-hero-content">
        <span className="plugin-hero-tag t-mono">KVN / PLUGINS</span>
        <h1 className="plugin-hero-title t-display">
          FERRAMENTAS PARA
          <br />
          QUEM CRIA.
        </h1>
        <p className="plugin-hero-sub t-mono">
          Utilitários profissionais feitos para remover fricção do seu fluxo criativo.
        </p>

        <div className="plugin-hero-actions">
          <a
            href="#spotlight"
            className="plugin-hero-available t-mono"
            onMouseEnter={() => sfx.hover()}
            onClick={() => sfx.click()}
          >
            <span className="plugin-hero-dot" aria-hidden="true" />
            DISPONÍVEL: {plugin.name}
            <span className="plugin-hero-arrow" aria-hidden="true">
              ↓
            </span>
          </a>

          <a
            href={getPurchaseHref(plugin)}
            className="plugin-hero-buy t-mono"
            onMouseEnter={() => sfx.hover()}
            onClick={() => sfx.confirm()}
          >
            COMPRAR AGORA
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
