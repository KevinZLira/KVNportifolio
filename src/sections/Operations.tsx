import { useSectionLabel } from "../hooks/useSectionLabel";
import { AsciiArt, OPERATIONS_SYMBOLS } from "../lib/ascii";
import "./Operations.css";

interface OperationItem {
  index: string;
  name: string;
  symbol: keyof typeof OPERATIONS_SYMBOLS;
}

// Typographic list, not cards — per the market-redesign brief: "não
// transformar cada serviço em um grande desenho." Each row gets exactly
// one hover mechanism (a typographic shift, driven purely by CSS) rather
// than stacking a typographic change AND an ascii activation on the same
// row.
const OPERATIONS: OperationItem[] = [
  { index: "01", name: "VISUAL IDENTITY", symbol: "DESIGN" },
  { index: "02", name: "MOTION DESIGN", symbol: "MOTION" },
  { index: "03", name: "VIDEO", symbol: "VIDEO" },
];

export default function Operations() {
  const sectionRef = useSectionLabel<HTMLElement>("OPERATIONS");

  return (
    <section ref={sectionRef} id="operations" className="operations">
      <span className="hud-corner hud-corner--tl" aria-hidden="true" />
      <span className="hud-corner hud-corner--br" aria-hidden="true" />

      <div className="operations-header">
        <span className="operations-comment t-mono">// SELECTED_OPERATIONS</span>
        <h2 className="operations-heading t-display">OPERATIONS</h2>
      </div>

      <ul className="operations-list">
        {OPERATIONS.map((op) => (
          <li key={op.index} className="operations-row">
            <span className="operations-index t-mono">{op.index}</span>
            <span className="operations-name t-display">{op.name}</span>
            <span className="operations-symbol" aria-hidden="true">
              <AsciiArt art={OPERATIONS_SYMBOLS[op.symbol]} color="#8b9986" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
