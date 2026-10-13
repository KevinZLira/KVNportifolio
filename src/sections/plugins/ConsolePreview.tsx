import { useState } from "react";
import "./ConsolePreview.css";

const effects = [
  { name: "Transformar", type: "EFEITO DE VÍDEO" },
  { name: "Desfoque gaussiano", type: "EFEITO DE VÍDEO" },
  { name: "Dissolução cruzada", type: "TRANSIÇÃO" },
  { name: "Lumetri Color", type: "EFEITO DE VÍDEO" },
];
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ConsolePreview() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["Transformar"]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [applied, setApplied] = useState("");
  const results = effects.filter(effect => normalize(effect.name).includes(normalize(query)) && (!onlyFavorites || favorites.includes(effect.name)));

  function toggleFavorite(name: string) {
    setFavorites(current => current.includes(name) ? current.filter(value => value !== name) : [...current, name]);
  }

  return (
    <div id="previa" className="lp-preview console-preview">
      <div className="lp-windowbar"><span><i /> KVN_WORKSPACE</span><span>Pr / 03</span></div>
      <div className="console-canvas" aria-hidden="true"><span>SEQUÊNCIA 01</span><div className={applied ? "console-image has-effect" : "console-image"}><strong>KVN</strong><small>CRIATIVIDADE EM MOVIMENTO</small></div></div>
      <div className="console-panel">
        <div className="console-panel-title"><span>KVN Console</span><kbd>ESC</kbd></div>
        <label className="console-search"><span aria-hidden="true">⌕</span><input aria-label="Experimente a busca de efeitos e transições" value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque um efeito ou transição…" /></label>
        <div className="console-tabs"><button type="button" aria-pressed={!onlyFavorites} onClick={() => setOnlyFavorites(false)}>TODOS</button><button type="button" aria-pressed={onlyFavorites} onClick={() => setOnlyFavorites(true)}>FAVORITOS ★</button></div>
        <ul className="console-results">{results.map(effect => <li key={effect.name}><button className="console-apply" type="button" onClick={() => setApplied(effect.name)} aria-label={`Experimentar ${effect.name}`}><span>{effect.name}<small>{effect.type}</small></span><span aria-hidden="true">↗</span></button><button className="console-favorite" type="button" aria-label={`Favoritar ${effect.name}`} aria-pressed={favorites.includes(effect.name)} onClick={() => toggleFavorite(effect.name)}>{favorites.includes(effect.name) ? "★" : "☆"}</button></li>)}</ul>
        {!results.length && <p className="console-empty">Nenhum resultado nesta prévia. Experimente “Transformar”.</p>}
      </div>
      <div className="lp-timeline"><div className="lp-track-label"><span>CLIPE SELECIONADO</span><span aria-live="polite">{applied ? `${applied.toUpperCase()} ✓` : "EXPERIMENTE A BUSCA ↑"}</span></div><div className="lp-track"><span>V1</span><i /><i className="is-imported">{applied ? "FX" : "CLIPE"}</i><i /></div><div className="lp-track lp-track-audio"><span>A1</span><i /><i /></div></div>
      <div className="lp-preview-caption"><span>PRÉVIA ILUSTRATIVA DO FLUXO</span><span>BUSQUE · FAVORITE · EXPLORE</span></div>
    </div>
  );
}
