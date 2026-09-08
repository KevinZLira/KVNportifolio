import type { Plugin } from "../../data/plugins";
import "./HowItWorks.css";

export default function HowItWorks({ plugin }: { plugin: Plugin }) {
  return (
    <section className="how">
      <span className="how-label t-mono">// HOW IT WORKS</span>
      <div className="how-steps">
        {plugin.steps.map((step, i) => (
          <div key={step} className="how-step">
            <span className="how-step-index t-display">{String(i + 1).padStart(2, "0")}</span>
            <span className="how-step-label t-mono">{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
