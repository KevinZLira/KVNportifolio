import { useNavigate } from "react-router-dom";
import { categories, projects, getProjectStatus } from "../data/projects";
import { useSectionLabel } from "../hooks/useSectionLabel";
import { useProjectFilter } from "../hooks/useProjectFilter";
import { useSystem } from "../state/SystemContext";
import { useTransition } from "../state/TransitionContext";
import { sfx } from "../lib/sound";
import { emitToast } from "../lib/toast";
import { AsciiImageReveal, getCategoryPlaceholderArt } from "../lib/ascii";
import "./MarketArchive.css";

// MARKET_ARCHIVE — the 2-column catalog-grid revision of WorkDatabase.
// "Catálogo, arquivo, organização, precisão" per the market-redesign
// brief: symmetric grid, large tiles, ASCII image-reveal on hover.
// WorkDatabase itself stays fully intact — see
// src/config/archiveExperience.ts to switch back with a one-line change.
export default function MarketArchive() {
  const sectionRef = useSectionLabel<HTMLElement>("ARCHIVE");
  const { filter, setFilter, visible } = useProjectFilter();
  const { setCursorMode } = useSystem();
  const { runTransition } = useTransition();
  const navigate = useNavigate();

  function openProject(slug: string, id: string, category: string, status: string) {
    sfx.click();
    setCursorMode({ kind: "busy", label: "ACCESSING..." });
    runTransition(`LOADING PROJECT_${id}...`, () => navigate(`/work/${slug}`), undefined, {
      file: `FILE_${id}`,
      category,
      status,
    });
  }

  return (
    <section ref={sectionRef} id="work" className="market-archive">
      <span className="hud-corner hud-corner--tl" aria-hidden="true" />
      <span className="hud-corner hud-corner--br" aria-hidden="true" />

      <div className="market-archive-header">
        <div className="market-archive-title-row">
          <span className="market-archive-comment t-mono">// ARCHIVE</span>
          <span className="market-archive-count t-mono">
            TOTAL FILES: {String(projects.length).padStart(3, "0")}
          </span>
        </div>
        <h2 className="market-archive-heading t-display">ARCHIVE</h2>
      </div>

      <div className="market-archive-filters t-mono" role="tablist" aria-label="Filter projects">
        <span className="market-archive-filters-label">FILTER:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filter === cat}
            className={`market-archive-filter ${filter === cat ? "is-active" : ""}`}
            onMouseEnter={() => sfx.hover()}
            onClick={() => {
              sfx.click();
              setFilter(cat);
              emitToast(`FILTER: ${cat}`);
            }}
          >
            [{cat}]
          </button>
        ))}
      </div>

      <div className="market-archive-grid">
        {visible.map((project) => (
          <button
            key={project.id}
            type="button"
            className="market-archive-tile"
            onMouseEnter={() => setCursorMode({ kind: "project", id: project.id })}
            onMouseLeave={() => setCursorMode({ kind: "default" })}
            onClick={() =>
              openProject(project.slug, project.id, project.category, getProjectStatus(project))
            }
          >
            <AsciiImageReveal
              src={project.thumbnail}
              fallbackArt={getCategoryPlaceholderArt(project.category)}
              accent={project.accent}
              infoSlot={
                <div className="market-archive-info t-mono">
                  <span className="market-archive-info-file">FILE_{project.id}</span>
                  <span className="market-archive-info-title t-display">{project.title}</span>
                  <span className="market-archive-info-meta">
                    <span>{project.category}</span>
                    <span className={`market-archive-status status-${getProjectStatus(project).toLowerCase()}`}>
                      {getProjectStatus(project)}
                    </span>
                  </span>
                  <span className="market-archive-cta">[ OPEN FILE → ]</span>
                </div>
              }
            />
          </button>
        ))}
      </div>
    </section>
  );
}
