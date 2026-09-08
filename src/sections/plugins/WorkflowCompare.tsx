import type { Plugin } from "../../data/plugins";
import { useParallax } from "../../hooks/useParallax";
import "./WorkflowCompare.css";

export default function WorkflowCompare({ plugin }: { plugin: Plugin }) {
  const bgRef = useParallax<HTMLDivElement>(0.05);

  return (
    <section className="workflow">
      <div className="workflow-bg" ref={bgRef} aria-hidden="true" />

      <div className="workflow-inner">
        <div className="workflow-col workflow-col--old">
          <span className="workflow-label t-mono">THE OLD WAY</span>
          <ol className="workflow-chain">
            {plugin.oldWay.map((step, i) => (
              <li key={step} className="workflow-step workflow-step--old">
                <span className="workflow-step-text t-mono">{step}</span>
                {i < plugin.oldWay.length - 1 && (
                  <span className="workflow-arrow" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="workflow-col workflow-col--new">
          <span className="workflow-label workflow-label--accent t-mono">THE KVN WAY</span>
          <ol className="workflow-chain">
            {plugin.newWay.map((step, i) => (
              <li key={step} className="workflow-step workflow-step--new">
                <span className="workflow-step-text t-display">{step}</span>
                {i < plugin.newWay.length - 1 && (
                  <span className="workflow-arrow workflow-arrow--accent" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="workflow-tagline t-display">LESS FRICTION. MORE EDITING.</p>
    </section>
  );
}
