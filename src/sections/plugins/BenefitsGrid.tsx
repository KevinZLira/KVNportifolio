import "./BenefitsGrid.css";

const BENEFITS = [
  { icon: "⚡", title: "VELOCIDADE", text: "Faça em segundos o que antes exigia várias etapas." },
  { icon: "🧠", title: "MENOS INTERRUPÇÕES", text: "Mantenha sua atenção na edição." },
  { icon: "📁", title: "MENOS ARQUIVOS DESNECESSÁRIOS", text: "Evite encher o computador com arquivos temporários." },
  { icon: "🎬", title: "FEITO PARA PREMIERE", text: "Tudo pensado para funcionar dentro do seu fluxo de edição." },
  { icon: "💰", title: "ACESSO VITALÍCIO", text: "Pague uma vez, use para sempre. Sem assinatura mensal." },
  { icon: "🛠️", title: "SIMPLES DE USAR", text: "Sem curva de aprendizado complicada." },
];

export default function BenefitsGrid() {
  return (
    <section className="bgrid-section">
      <h2 className="bgrid-title t-display">Pequenos plugins. Grande diferença no workflow.</h2>

      <div className="bgrid">
        {BENEFITS.map((b) => (
          <div key={b.title} className="bgrid-card">
            <span className="bgrid-icon" aria-hidden="true">
              {b.icon}
            </span>
            <span className="bgrid-card-title t-mono">{b.title}</span>
            <p className="bgrid-card-text t-mono">{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
