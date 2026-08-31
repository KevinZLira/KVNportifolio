import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, projects } from "../data/projects";
import { useSectionLabel } from "../hooks/useSectionLabel";
import { useProjectFilter } from "../hooks/useProjectFilter";
import { useSystem } from "../state/SystemContext";
import { useTransition } from "../state/TransitionContext";
import { sfx } from "../lib/sound";
import { emitToast } from "../lib/toast";
import MediaPreview from "../components/Media/MediaPreview";
import "./WorkDatabase.css";

export default function WorkDatabase() {
  const sectionRef = useSectionLabel<HTMLElement>("WORK_DATABASE");
  const { filter, setFilter, visible } = useProjectFilter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setCursorMode } = useSystem();
  const { runTransition } = useTransition();
  const navigate = useNavigate();

  function openProject(slug: string, id: string) {
    sfx.click();
    setCursorMode({ kind: "busy", label: "ACCESSING..." });
    runTransition(`LOADING PROJECT_${id}...`, () => navigate(`/work/${slug}`));
  }

  return (
    <section ref={sectionRef} id="work" className="workdb">
      <div className="workdb-header">
        <div className="workdb-title-row">
          <span className="workdb-comment t-mono">// WORK_DATABASE</span>
          <span className="workdb-count t-mono">
            TOTAL PROJECTS: {String(projects.length).padStart(3, "0")}
          </span>
        </div>
        <h2 className="workdb-heading t-display">ARCHIVE</h2>
      </div>

      <div className="workdb-filters t-mono" role="tablist" aria-label="Filter projects">
        <span className="workdb-filters-label">FILTER:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filter === cat}
            className={`workdb-filter ${filter === cat ? "is-active" : ""}`}
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

      <ul className="workdb-list">
        {visible.map((project) => {
          const isActive = activeId === project.id;
          return (
            <li
              key={project.id}
              className={`workdb-row ${isActive ? "is-active" : ""}`}
              onMouseEnter={() => {
                setActiveId(project.id);
                setCursorMode({ kind: "project", id: project.id });
              }}
              onMouseLeave={() => {
                setActiveId((cur) => (cur === project.id ? null : cur));
                setCursorMode({ kind: "default" });
              }}
            >
              <button
                type="button"
                className="workdb-row-main"
                onClick={() => openProject(project.slug, project.id)}
              >
                <span className="workdb-row-id t-mono">PROJECT_{project.id}</span>
                <span className="workdb-row-title t-display">{project.title}</span>
                <span className="workdb-row-cat t-mono">{project.category}</span>
                <span className="workdb-row-year t-mono">{project.year}</span>
                <span className="workdb-row-open t-mono">OPEN →</span>
              </button>

              <div className="workdb-row-expand">
                <div className="workdb-row-expand-inner">
                  <div className="workdb-preview">
                    <MediaPreview accent={project.accent} id={project.id} interactive={false} />
                  </div>
                  <div className="workdb-details t-mono">
                    <p className="workdb-details-desc">{project.subtitle}</p>
                    <div className="workdb-details-tools">
                      {project.tools.map((tool) => (
                        <span key={tool} className="workdb-tool">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
