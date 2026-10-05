import { getPurchaseHref } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./PluginsHero.css";

const TAGS = ["Copy & Paste de imagens", "YouTube • TikTok • Instagram", "Workflow mais rápido", "Feito para Premiere Pro"];

export default function PluginsHero() {
  return (
    <section id="plugins-hero" className="phero">
      <div className="phero-grid">
        <div className="phero-copy">
          <span className="phero-eyebrow t-mono">PLUGINS PARA ADOBE PREMIERE PRO</span>
          <h1 className="phero-title t-display">Pare de perder tempo com tarefas que o Premiere deveria facilitar.</h1>
          <p className="phero-sub t-mono">
            Dois plugins simples para deixar seu workflow mais rápido, direto e livre das pequenas tarefas que quebram
            seu ritmo de edição.
          </p>

          <div className="phero-actions">
            <a
              href={getPurchaseHref("Oferta KVN Plugins")}
              className="phero-cta-primary t-mono"
              onMouseEnter={() => sfx.hover()}
              onClick={() => sfx.confirm()}
            >
              QUERO OTIMIZAR MEU WORKFLOW
            </a>
            <button
              type="button"
              className="phero-cta-secondary t-mono"
              onClick={() => {
                sfx.click();
                document.querySelector("#plugins")?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={() => sfx.hover()}
            >
              VER OS PLUGINS ↓
            </button>
          </div>

          <p className="phero-microcopy t-mono">Pagamento único • Acesso vitalício • Sem mensalidade</p>

          <div className="phero-tags t-mono">
            {TAGS.map((tag) => (
              <span key={tag} className="phero-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="phero-visual" aria-hidden="true">
          <div className="phero-window">
            <div className="phero-window-bar">
              <span>Adobe Premiere Pro</span>
            </div>
            <div className="phero-window-body">
              <div className="phero-window-bins">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="phero-window-preview" />
            </div>
            <div className="phero-window-timeline">
              <div className="phero-clip phero-clip--a" />
              <div className="phero-clip phero-clip--b" />
              <div className="phero-clip phero-clip--c" />
            </div>
          </div>

          <div className="phero-float phero-float--a">
            <span className="phero-float-dot" />
            Copy &amp; Pasta
          </div>
          <div className="phero-float phero-float--b">
            <span className="phero-float-dot" />
            YouTube Importer
          </div>
        </div>
      </div>
    </section>
  );
}
