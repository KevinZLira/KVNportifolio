import { formatPriceAmount, getPurchaseHref, STATUS_LABEL_PT, type Plugin } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./ProductSpotlight.css";

export default function ProductSpotlight({ plugin }: { plugin: Plugin }) {
  return (
    <section id="spotlight" className="spotlight">
      <div className="spotlight-frame">
        <span className="spotlight-status t-mono">
          <span className="spotlight-status-dot" aria-hidden="true" />[ {STATUS_LABEL_PT[plugin.status]} ]
        </span>

        <h2 className="spotlight-name t-display">{plugin.name}</h2>
        <p className="spotlight-tagline t-mono">{plugin.tagline}</p>
        <p className="spotlight-pitch t-mono">{plugin.pitch}</p>

        <ul className="spotlight-highlights t-mono">
          {plugin.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        {plugin.price && (
          <div className="spotlight-buy">
            <div className="spotlight-price t-mono">
              {plugin.price.originalAmount && (
                <span className="spotlight-price-was">
                  DE {plugin.price.currency} {formatPriceAmount(plugin.price.originalAmount)}
                </span>
              )}
              <span className="spotlight-price-now">
                {plugin.price.originalAmount ? "POR " : ""}
                {plugin.price.currency} {formatPriceAmount(plugin.price.amount)}
                {plugin.price.interval && <span className="spotlight-price-interval">{plugin.price.interval}</span>}
              </span>
            </div>
            <a
              href={getPurchaseHref(plugin)}
              className="spotlight-cta t-mono"
              onMouseEnter={() => sfx.hover()}
              onClick={() => sfx.confirm()}
            >
              COMPRAR AGORA
              <span aria-hidden="true">→</span>
            </a>
          </div>
        )}

        <div className="spotlight-spec t-mono">
          <span>
            FILE_<b>{plugin.id}</b>
          </span>
          <span>
            CATEGORIA: <b>{plugin.category}</b>
          </span>
          <span>
            STATUS: <b>{STATUS_LABEL_PT[plugin.status]}</b>
          </span>
        </div>
      </div>
    </section>
  );
}
