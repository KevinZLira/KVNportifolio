import type { PluginItem } from "../../data/plugins";
import "./DemoSection.css";

export default function DemoSection({ item }: { item: PluginItem }) {
  return (
    <section className="demo2">
      <h2 className="demo2-title t-display">Veja funcionando.</h2>

      <div className="demo2-card">
        <div className="demo2-frame">
          {item.demoVideo ? (
            <video
              className="demo2-video"
              src={item.demoVideo}
              poster={item.demoPoster}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="demo2-placeholder t-mono">
              <span className="demo2-placeholder-corner demo2-placeholder-corner--tl" aria-hidden="true" />
              <span className="demo2-placeholder-corner demo2-placeholder-corner--br" aria-hidden="true" />
              <span>DEMO_FEED: OFFLINE</span>
              <span className="demo2-placeholder-sub">Vídeo chega aqui em breve</span>
            </div>
          )}
        </div>
        <span className="demo2-caption t-display">{item.demoCaption}</span>
      </div>
    </section>
  );
}
