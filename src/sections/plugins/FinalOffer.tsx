import { combo, formatPriceAmount, getPurchaseHref, type PluginItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./FinalOffer.css";

export default function FinalOffer({ items }: { items: PluginItem[] }) {
  return (
    <section className="final-offer">
      <h2 className="final-offer-title t-display">
        Seu workflow pode continuar igual.
        <br />
        Ou pode ficar mais rápido hoje.
      </h2>

      <div className="final-offer-grid">
        {items.map((item) => (
          <div key={item.id} className="final-offer-card">
            <span className="final-offer-name t-mono">{item.name}</span>
            <span className="final-offer-price t-display">
              {item.price.currency} {formatPriceAmount(item.price.amount)}
            </span>
          </div>
        ))}

        <div className="final-offer-card final-offer-card--combo">
          <span className="final-offer-best t-mono">MELHOR VALOR</span>
          <span className="final-offer-name t-mono">Combo</span>
          <span className="final-offer-price t-display">
            {combo.items[0].price.currency} {formatPriceAmount(combo.price)}
          </span>
        </div>
      </div>

      <a
        href={getPurchaseHref("Oferta KVN Plugins")}
        className="final-offer-cta t-mono"
        onMouseEnter={() => sfx.hover()}
        onClick={() => sfx.confirm()}
      >
        QUERO OTIMIZAR MEU WORKFLOW
      </a>
      <span className="final-offer-microcopy t-mono">Pagamento único • Sem mensalidade</span>
    </section>
  );
}
