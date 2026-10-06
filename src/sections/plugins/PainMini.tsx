import type { PluginItem } from "../../data/plugins";
import "./PainMini.css";

export default function PainMini({ item }: { item: PluginItem }) {
  return (
    <section className="pain-mini">
      <div className="pain-mini-list t-mono">
        {item.pains.map((pain) => (
          <p key={pain} className="pain-mini-item">
            <span aria-hidden="true">×</span>
            {pain}
          </p>
        ))}
      </div>
      <p className="pain-mini-note t-mono">Não é um grande problema. E justamente por isso é tão irritante.</p>
    </section>
  );
}
