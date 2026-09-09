import { STATUS_LABEL_PT, type UpcomingPlugin } from "../../data/plugins";
import { useParallax } from "../../hooks/useParallax";
import "./UpcomingSystems.css";

function ProgressBar({ progress }: { progress: number }) {
  const segments = 10;
  const filled = Math.round(progress * segments);
  return (
    <div className="upcoming-bar" aria-hidden="true">
      {Array.from({ length: segments }).map((_, i) => (
        <span key={i} className={i < filled ? "is-filled" : ""} />
      ))}
    </div>
  );
}

export default function UpcomingSystems({ items }: { items: UpcomingPlugin[] }) {
  const bgRef = useParallax<HTMLDivElement>(0.04);

  return (
    <section className="upcoming">
      <div className="upcoming-bg" ref={bgRef} aria-hidden="true" />

      <div className="upcoming-inner">
        <span className="upcoming-label t-mono">SISTEMAS EM DESENVOLVIMENTO</span>
        <h2 className="upcoming-heading t-display">MAIS FERRAMENTAS CHEGANDO</h2>
        <p className="upcoming-sub t-mono">O conjunto de ferramentas KVN está crescendo.</p>

        <div className="upcoming-list">
          {items.map((item) => (
            <div key={item.id} className="upcoming-card">
              <span className="upcoming-card-id t-mono">SYSTEM_{item.id}</span>
              <span className="upcoming-card-name t-display">
                {item.status === "CLASSIFIED" ? "[ ??? ]" : item.codename}
              </span>
              {item.status === "IN_DEVELOPMENT" && item.progress !== undefined && (
                <ProgressBar progress={item.progress} />
              )}
              <span className="upcoming-card-status t-mono">STATUS: {STATUS_LABEL_PT[item.status]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
