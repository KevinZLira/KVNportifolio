import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { plugins } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import { sfx } from "../lib/sound";
import "./Plugins.css";

const STATUS_LABEL: Record<string, string> = {
  IN_DEVELOPMENT: "IN DEVELOPMENT",
  COMING_SOON: "COMING SOON",
};

export default function Plugins() {
  const navigate = useNavigate();
  const { setSectionLabel } = useSystem();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSectionLabel("PLUGIN_STORE");
  }, [setSectionLabel]);

  return (
    <article className="plugins-page">
      <div className="plugins-path t-mono">/SYSTEM/PLUGINS</div>

      <button
        type="button"
        className="plugins-back t-mono"
        onClick={() => {
          sfx.click();
          navigate("/");
        }}
        onMouseEnter={() => sfx.hover()}
      >
        ← BACK TO SYSTEM
      </button>

      <header className="plugins-head">
        <span className="plugins-tag t-mono">MODULE STORE</span>
        <h1 className="plugins-title t-display">PREMIERE PLUGINS</h1>
        <p className="plugins-intro t-mono">
          Ferramentas próprias para acelerar o fluxo de edição no Premiere Pro. Em desenvolvimento —
          novos módulos serão listados aqui assim que estiverem prontos.
        </p>
      </header>

      <ul className="plugins-list">
        {plugins.map((plugin) => (
          <li key={plugin.id} className="plugins-item">
            <span className="plugins-item-id t-mono">{plugin.id}</span>
            <div className="plugins-item-body">
              <span className="plugins-item-name t-display">{plugin.name}</span>
              <span className="plugins-item-category t-mono">{plugin.category}</span>
              <p className="plugins-item-desc t-mono">{plugin.description}</p>
            </div>
            <span
              className="plugins-item-status t-mono"
              style={{ color: plugin.accent }}
            >
              {STATUS_LABEL[plugin.status]}
            </span>
          </li>
        ))}
      </ul>

      <footer className="plugins-footer t-mono">
        <span>QUER SER AVISADO NO LANÇAMENTO?</span>
        <a
          href="mailto:contact@kvnlira.com?subject=PLUGINS%20-%20AVISO%20DE%20LAN%C3%87AMENTO"
          className="plugins-notify"
          onMouseEnter={() => sfx.hover()}
          onClick={() => sfx.click()}
        >
          [ ENTRAR EM CONTATO ]
        </a>
      </footer>
    </article>
  );
}
