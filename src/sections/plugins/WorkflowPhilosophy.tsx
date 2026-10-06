import type { PluginItem } from "../../data/plugins";
import "./WorkflowPhilosophy.css";

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

export default function WorkflowPhilosophy({ item }: { item: PluginItem }) {
  return (
    <section id="como-funciona" className="phil">
      <h2 className="phil-heading t-display">Menos cliques. Mais edição.</h2>
      <p className="phil-sub t-mono">Não é sobre adicionar mais uma ferramenta. É sobre remover etapas desnecessárias.</p>

      <div className="phil-example">
        <div className="phil-example-row">
          <span className="phil-example-label t-mono">ANTES</span>
          <Chain steps={item.oldWay} />
        </div>
        <div className="phil-example-row">
          <span className="phil-example-label phil-example-label--accent t-mono">DEPOIS</span>
          <Chain steps={item.newWay} />
        </div>
      </div>
    </section>
  );
}
