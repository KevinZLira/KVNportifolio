import { combo, formatPriceAmount, getComboSavings, getComboTotal, getPurchaseHref } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./ComboOffer.css";

export default function ComboOffer() {
  const total = getComboTotal();
  const savings = getComboSavings();

  return (
    <section className="combo">
      <div className="combo-card">
        <span className="combo-badge t-mono">🔥 MELHOR OFERTA</span>
        <h2 className="combo-title t-display">Leve os dois e pague menos.</h2>
        <p className="combo-text t-mono">
          Se você trabalha com Premiere todos os dias, provavelmente vai acabar usando os dois.
        </p>

        <div className="combo-items t-mono">
          {combo.items.map((item, i) => (
            <div key={item.id} className="combo-item">
              <span>{item.name}</span>
              <span>
                {item.price.currency} {formatPriceAmount(item.price.amount)}
              </span>
              {i < combo.items.length - 1 && <span className="combo-plus">+</span>}
            </div>
          ))}
        </div>

        <div className="combo-pricing">
          <div className="combo-pricing-row">
            <span className="combo-pricing-label t-mono">Preço separado</span>
            <span className="combo-pricing-was t-mono">
              {combo.items[0].price.currency} {formatPriceAmount(total)}
            </span>
          </div>
          <div className="combo-pricing-row">
            <span className="combo-pricing-label t-mono">Preço do combo</span>
            <span className="combo-pricing-now t-display">
              {combo.items[0].price.currency} {formatPriceAmount(combo.price)}
            </span>
          </div>
        </div>

        <span className="combo-savings t-mono">
          ECONOMIZE {combo.items[0].price.currency} {formatPriceAmount(savings)}
        </span>
        <span className="combo-tagline t-mono">2 PLUGINS • 1 OFERTA • PAGAMENTO ÚNICO</span>

        <a
          href={getPurchaseHref(combo.name, combo.purchaseUrl)}
          className="combo-cta t-mono"
          onMouseEnter={() => sfx.hover()}
          onClick={() => sfx.confirm()}
        >
          QUERO OS DOIS — {combo.items[0].price.currency} {formatPriceAmount(combo.price)}
        </a>
        <span className="combo-microcopy t-mono">Sem assinatura. Sem mensalidade.</span>
      </div>
    </section>
  );
}
