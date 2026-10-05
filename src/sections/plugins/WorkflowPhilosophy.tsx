import type { PluginItem } from "../../data/plugins";
import "./WorkflowPhilosophy.css";

const LINES = [
  "Não é sobre adicionar mais uma ferramenta.",
  "É sobre remover etapas desnecessárias.",
  "Você já passa horas no Premiere.",
  "Faça essas horas renderem mais.",
];

function Chain({ steps }: { steps: string[] }) {
  return (
    <div className="phil-chain">
      {steps.map((step, i) => (
        <span key={step} className="phil-chain-item">
          {step}
          {i < steps.length - 1 && <span className="phil-chain-arrow">→</span>}
        </span>
      ))}
    </div>
  );
}

export default function WorkflowPhilosophy({ items }: { items: PluginItem[] }) {
  return (
    <section id="como-funciona" className="phil">
      <h2 className="phil-heading t-display">Menos cliques. Mais edição.</h2>

      <div className="phil-lines t-mono">
        {LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="phil-examples">
        {items.map((item) => (
          <div key={item.id} className="phil-example">
            <span className="phil-example-name t-mono">{item.name}</span>
            <div className="phil-example-row">
              <span className="phil-example-label t-mono">ANTES</span>
              <Chain steps={item.oldWay} />
            </div>
            <div className="phil-example-row">
              <span className="phil-example-label phil-example-label--accent t-mono">DEPOIS</span>
              <Chain steps={item.newWay} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
