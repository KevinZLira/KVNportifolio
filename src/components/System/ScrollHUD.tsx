import { useScrollProgress } from "../../hooks/useScrollProgress";
import "./ScrollHUD.css";

export default function ScrollHUD() {
  const progress = useScrollProgress();
  const pct = Math.round(progress * 100);

  return (
    <div className="scroll-hud t-mono" aria-hidden="true">
      <span className="scroll-hud-label">SCROLL_POS</span>
      <div className="scroll-hud-track">
        <div className="scroll-hud-fill" style={{ height: `${pct}%` }} />
      </div>
      <span className="scroll-hud-pct">{String(pct).padStart(3, "0")}%</span>
    </div>
  );
}
