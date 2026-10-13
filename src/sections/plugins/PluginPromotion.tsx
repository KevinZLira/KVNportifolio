import { formatPriceAmount, pluginBonus, type PluginItem } from "../../data/plugins";
import "./PluginPromotion.css";

export default function PluginPromotion({ item, compact = false }: { item: PluginItem; compact?: boolean }) {
  const saving = item.price.originalAmount === undefined ? 0 : (Math.round(item.price.originalAmount * 100) - Math.round(item.price.amount * 100)) / 100;
  return <div className={`plugin-promotion${compact ? " is-compact" : ""}`}>
    <div className="plugin-promotion-price">
      {item.price.originalAmount !== undefined && <span className="plugin-promotion-before">DE <s>{item.price.currency} {formatPriceAmount(item.price.originalAmount)}</s></span>}
      <span className="plugin-promotion-now">POR <strong>{item.price.currency} {formatPriceAmount(item.price.amount)}</strong></span>
    </div>
    {saving > 0 && <span className="plugin-promotion-badge">{item.price.currency} {formatPriceAmount(saving)} OFF</span>}
    {!compact && <div className="plugin-promotion-bonus"><span aria-hidden="true">＋</span><p><strong>BÔNUS EM QUALQUER COMPRA</strong>{pluginBonus.name}</p></div>}
  </div>;
}
