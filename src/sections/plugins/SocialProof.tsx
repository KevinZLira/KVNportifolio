import type { Plugin } from "../../data/plugins";
import "./SocialProof.css";

// A scrolling ticker, not a wall of customer testimonials — there are no
// purchases yet (no price/purchaseUrl configured), so there are no real
// customers to quote. These lines are the creator's own build-log voice,
// not fabricated reviews. Swap in real user quotes here once they exist.
export default function SocialProof({ plugin }: { plugin: Plugin }) {
  const loop = [...plugin.signals, ...plugin.signals];

  return (
    <section className="signals">
      <span className="signals-label t-mono">// DIÁRIO DE BORDO</span>
      <div className="signals-track-wrap">
        <div className="signals-track">
          {loop.map((line, i) => (
            <span key={i} className="signals-item t-mono">
              {line}
              <span className="signals-sep" aria-hidden="true">
                //
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
