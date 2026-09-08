import { useEffect, useRef, useState } from "react";
import type { Plugin } from "../../data/plugins";
import "./PluginDemo.css";

function ProductLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoaded(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="demo-loader t-mono">
      <div className="demo-loader-row">
        <span>{loaded ? "PRODUCT ONLINE" : "LOADING PRODUCT..."}</span>
        <span>{loaded ? "100%" : "0%"}</span>
      </div>
      <div className="demo-loader-track">
        <div className={`demo-loader-fill ${loaded ? "is-loaded" : ""}`} />
      </div>
    </div>
  );
}

export default function PluginDemo({ plugin }: { plugin: Plugin }) {
  const hasDemo = Boolean(plugin.demoVideo);

  return (
    <section className="demo">
      <div className="demo-briefing t-mono">
        <span>FIELD TEST // {plugin.id}</span>
        <span className="demo-briefing-name t-display">{plugin.name}</span>
        <span className="demo-briefing-status">
          {plugin.status === "AVAILABLE" ? "OPERATIONAL" : plugin.status.replace("_", " ")}
        </span>
      </div>

      <ProductLoader />

      <div className="demo-frame">
        {hasDemo ? (
          <video
            className="demo-video"
            src={plugin.demoVideo}
            poster={plugin.demoPoster}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="demo-placeholder t-mono">
            <span className="demo-placeholder-corner demo-placeholder-corner--tl" aria-hidden="true" />
            <span className="demo-placeholder-corner demo-placeholder-corner--br" aria-hidden="true" />
            <span className="demo-placeholder-line">DEMO_FEED: OFFLINE</span>
            <span className="demo-placeholder-sub">FOOTAGE PENDING UPLOAD</span>
          </div>
        )}
      </div>
    </section>
  );
}
