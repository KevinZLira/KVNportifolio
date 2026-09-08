import type { Plugin } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PluginBenefits.css";

export default function PluginBenefits({ plugin }: { plugin: Plugin }) {
  return (
    <section className="benefits">
      <div className="benefits-grid">
        {plugin.benefits.map((b) => (
          <div key={b.index} className="benefit" onMouseEnter={() => sfx.hover()}>
            <span className="benefit-index t-mono">{b.index} /</span>
            <span className="benefit-title t-display">{b.title}</span>
            <p className="benefit-desc t-mono">{b.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
