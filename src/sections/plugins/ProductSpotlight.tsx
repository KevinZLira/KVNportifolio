import type { Plugin } from "../../data/plugins";
import "./ProductSpotlight.css";

export default function ProductSpotlight({ plugin }: { plugin: Plugin }) {
  return (
    <section id="spotlight" className="spotlight">
      <div className="spotlight-frame">
        <span className="spotlight-status t-mono">
          <span className="spotlight-status-dot" aria-hidden="true" />
          [ {plugin.status === "AVAILABLE" ? "AVAILABLE" : plugin.status.replace("_", " ")} ]
        </span>

        <h2 className="spotlight-name t-display">{plugin.name}</h2>
        <p className="spotlight-tagline t-mono">{plugin.tagline}</p>
        <p className="spotlight-pitch t-mono">{plugin.pitch}</p>

        <ul className="spotlight-highlights t-mono">
          {plugin.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
