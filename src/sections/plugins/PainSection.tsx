import "./PainSection.css";

const PAINS = [
  "Precisar salvar uma imagem no computador só para conseguir colocá-la no Premiere.",
  "Abrir navegador, baixar arquivo, localizar pasta e importar manualmente.",
  "Ficar alternando entre Premiere e navegador para pegar vídeos ou músicas.",
  "Interromper o fluxo criativo por causa de tarefas pequenas e repetitivas.",
];

export default function PainSection() {
  return (
    <section className="pain">
      <h2 className="pain-title t-display">Seu tempo não deveria ser gasto com isso.</h2>

      <ul className="pain-list t-mono">
        {PAINS.map((pain) => (
          <li key={pain} className="pain-item">
            {pain}
          </li>
        ))}
      </ul>

      <p className="pain-text t-mono">Não são grandes problemas. E justamente por isso são tão irritantes.</p>
      <p className="pain-text t-mono">
        Você perde alguns segundos aqui, alguns minutos ali... até perceber quanto tempo foi embora.
      </p>

      <div className="pain-flow t-mono">
        <span>TAREFAS REPETITIVAS</span>
        <span className="pain-flow-arrow">→</span>
        <span className="pain-flow-accent">PLUGINS</span>
        <span className="pain-flow-arrow">→</span>
        <span>WORKFLOW MAIS RÁPIDO</span>
      </div>
    </section>
  );
}
