import type { Plugin } from "../../data/plugins";
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
          TOOLS FOR PEOPLE
          <br />
          WHO MAKE THINGS.
        </h1>
        <p className="plugin-hero-sub t-mono">
          Professional utilities built to remove friction from creative workflows.
        </p>

        <a
          href="#spotlight"
          className="plugin-hero-available t-mono"
          onMouseEnter={() => sfx.hover()}
          onClick={() => sfx.click()}
        >
          <span className="plugin-hero-dot" aria-hidden="true" />
          AVAILABLE: {plugin.name}
          <span className="plugin-hero-arrow" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}
