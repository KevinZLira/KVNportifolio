import { formatPriceAmount, getPurchaseHref, type PluginItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PluginSection.css";

function PasteMockup() {
  return (
    <div className="pmock pmock--paste" aria-hidden="true">
      <div className="pmock-browser">
        <span className="pmock-browser-bar">navegador</span>
        <div className="pmock-browser-img" />
      </div>
      <div className="pmock-key">
        <kbd>CTRL</kbd>
        <span>+</span>
        <kbd>C</kbd>
      </div>
      <div className="pmock-arrow">→</div>
      <div className="pmock-premiere">
        <span className="pmock-premiere-bar">Premiere Pro</span>
        <div className="pmock-premiere-slot">
          <div className="pmock-premiere-img" />
        </div>
      </div>
      <div className="pmock-key pmock-key--paste">
        <kbd>CTRL</kbd>
        <span>+</span>
        <kbd>V</kbd>
      </div>
    </div>
  );
}

function LinkMockup({ platforms }: { platforms: string[] }) {
  return (
    <div className="pmock pmock--link" aria-hidden="true">
      <div className="pmock-platforms">
        {platforms.map((p) => (
          <span key={p} className="pmock-platform">
            {p}
          </span>
        ))}
      </div>
      <div className="pmock-arrow">↓</div>
      <div className="pmock-url">youtube.com/watch?v=...</div>
      <div className="pmock-arrow">↓</div>
      <div className="pmock-plugin-box">YouTube Importer</div>
      <div className="pmock-arrow">↓</div>
      <div className="pmock-premiere pmock-premiere--timeline">
        <span className="pmock-premiere-bar">Premiere Pro — Timeline</span>
        <div className="pmock-timeline-track">
          <span className="is-new" />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default function PluginSection({ item, reverse = false }: { item: PluginItem; reverse?: boolean }) {
  return (
    <section id={`plugin-${item.slug}`} className={`pfeature ${reverse ? "pfeature--reverse" : ""}`}>
      <div className="pfeature-copy">
        <span className="pfeature-badge t-mono">{item.badge}</span>
        <h3 className="pfeature-name t-display">{item.name}</h3>
        <p className="pfeature-headline t-display">{item.headline}</p>
        <p className="pfeature-pitch t-mono">{item.pitch}</p>

        {item.platforms && (
          <div className="pfeature-platforms t-mono">
            {item.platforms.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        )}

        <ol className="pfeature-steps t-mono">
          {item.explainerSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <ul className="pfeature-benefits t-mono">
          {item.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="pfeature-buy">
          <a
            href={getPurchaseHref(item.name, item.purchaseUrl)}
            className="pfeature-cta t-mono"
            onMouseEnter={() => sfx.hover()}
            onClick={() => sfx.confirm()}
          >
            QUERO {item.name.toUpperCase()} — {item.price.currency} {formatPriceAmount(item.price.amount)}
          </a>
          <span className="pfeature-microcopy t-mono">Pagamento único</span>
        </div>
      </div>

      <div className="pfeature-visual">{item.mockup === "paste" ? <PasteMockup /> : <LinkMockup platforms={item.platforms ?? []} />}</div>
    </section>
  );
}
