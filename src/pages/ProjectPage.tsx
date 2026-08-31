import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdjacentProjects, getProjectBySlug, getProjectStatus, type Project } from "../data/projects";
import { useSystem } from "../state/SystemContext";
import { useTransition } from "../state/TransitionContext";
import { sfx } from "../lib/sound";
import MediaPreview from "../components/Media/MediaPreview";
import { AsciiAnimated, getCategoryPlaceholderArt } from "../lib/ascii";
import "./ProjectPage.css";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { setSectionLabel, setCursorMode } = useSystem();
  const { runTransition } = useTransition();

  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSectionLabel(project ? `PROJECT_${project.id}` : "FILE_NOT_FOUND");
  }, [project, setSectionLabel]);

  if (!project) {
    return (
      <div className="project-missing t-mono">
        <p>ERROR 404: FILE NOT FOUND</p>
        <button
          type="button"
          className="project-back"
          onClick={() => navigate("/work")}
        >
          [ BACK TO DATABASE ]
        </button>
      </div>
    );
  }

  const { prev, next } = getAdjacentProjects(slug);

  function goToBack() {
    sfx.click();
    runTransition("RETURNING TO DATABASE...", () => {
      navigate("/");
      window.setTimeout(() => document.getElementById("work")?.scrollIntoView(), 60);
    });
  }

  function goToProject(target: Project) {
    sfx.click();
    runTransition(`LOADING PROJECT_${target.id}...`, () => navigate(`/work/${target.slug}`), undefined, {
      file: `FILE_${target.id}`,
      category: target.category,
      status: getProjectStatus(target),
    });
  }

  return (
    <article className="project-page">
      <span className="project-ascii-floater" aria-hidden="true">
        <AsciiAnimated
          art={getCategoryPlaceholderArt(project.category)}
          behavior="breathe"
          color="#4a4f44"
        />
      </span>

      <div className="project-path t-mono">/SYSTEM/WORK/PROJECT_{project.id}</div>

      <button
        type="button"
        className="project-back-top t-mono"
        onClick={goToBack}
        onMouseEnter={() => sfx.hover()}
      >
        ← BACK TO DATABASE
      </button>

      <header className="project-head">
        <span className="hud-corner hud-corner--tl" aria-hidden="true" />
        <span className="hud-corner hud-corner--tr" aria-hidden="true" />
        <span className="project-tag t-mono">PROJECT FILE</span>
        <h1 className="project-title t-display">{project.title}</h1>
        <div className="project-meta t-mono">
          <span>{project.category} / MOTION DESIGN</span>
          <span>{project.year}</span>
          <span>{getProjectStatus(project)}</span>
        </div>
      </header>

      <div
        className="project-media"
        onMouseEnter={() => setCursorMode({ kind: "busy", label: "VIEW SEQUENCE" })}
        onMouseLeave={() => setCursorMode({ kind: "default" })}
      >
        <MediaPreview accent={project.accent} id={project.id} label={project.title} />
      </div>

      <div className="project-body">
        <section className="project-section">
          <h2 className="t-mono project-section-title">DESCRIPTION</h2>
          <p className="project-desc t-mono">{project.description}</p>
        </section>

        <section className="project-section">
          <h2 className="t-mono project-section-title">TOOLS</h2>
          <ul className="project-tools">
            {project.tools.map((tool) => (
              <li key={tool} className="t-mono">
                {tool}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <nav className="project-nav t-mono">
        <button
          type="button"
          className="project-nav-btn"
          onClick={() => goToProject(prev)}
          onMouseEnter={() => sfx.hover()}
        >
          <span className="project-nav-dir">← PREV</span>
          <span className="project-nav-name">PROJECT_{prev.id} / {prev.title}</span>
        </button>
        <button
          type="button"
          className="project-nav-btn project-nav-btn--next"
          onClick={() => goToProject(next)}
          onMouseEnter={() => sfx.hover()}
        >
          <span className="project-nav-dir">NEXT →</span>
          <span className="project-nav-name">PROJECT_{next.id} / {next.title}</span>
        </button>
      </nav>
    </article>
  );
}
