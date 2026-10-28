import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdjacentProjects, getProjectBySlug } from "../data/projects";
import { useSystem } from "../state/SystemContext";
import { useTransition } from "../state/TransitionContext";
import { sfx } from "../lib/sound";
import "./ProjectPage.css";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { setSectionLabel } = useSystem();
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
          onClick={() => navigate("/#work")}
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

  function goToProject(targetSlug: string, id: string) {
    sfx.click();
    runTransition(`LOADING PROJECT_${id}...`, () => navigate(`/work/${targetSlug}`));
  }

  return (
    <article className="project-page">
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
        <span className="project-tag t-mono">PROJECT FILE</span>
        <h1 className="project-title t-display">{project.title}</h1>
        <div className="project-meta t-mono">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
      </header>

      <div className="project-gallery" aria-label={`Galeria de ${project.title}`}>
        {project.sections ? project.sections.map((section) => (
          <section key={section.slug} className="project-collection-section" aria-labelledby={`piece-${section.slug}`}>
            <h2 id={`piece-${section.slug}`} className="project-piece-title t-display">{section.title}</h2>
            {section.images.map((src, index) => (
              <img key={src} src={src} alt={`${section.title} — imagem ${index + 1}`} loading="lazy" decoding="async" />
            ))}
            <a className="project-source t-mono" href={section.behanceUrl} target="_blank" rel="noopener noreferrer">
              VER NO BEHANCE ↗
            </a>
          </section>
        )) : project.images.map((src, index) => (
          <img key={src} src={src} alt={`${project.title} — imagem ${index + 1}`}
            loading={index === 0 ? "eager" : "lazy"} decoding="async" />
        ))}
        {project.videos.map((src, index) => (
          <iframe key={src} src={src} title={`${project.title} — vídeo ${index + 1}`}
            loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen />
        ))}
      </div>
      {project.behanceUrl && <a className="project-source t-mono" href={project.behanceUrl} target="_blank" rel="noopener noreferrer">
        VER PROJETO NO BEHANCE ↗
      </a>}

      <div className="project-body">
        <section className="project-section">
          <h2 className="t-mono project-section-title">DESCRIPTION</h2>
          <p className="project-desc t-mono">{project.description}</p>
        </section>

        {project.tools.length > 0 && <section className="project-section">
          <h2 className="t-mono project-section-title">TOOLS</h2>
          <ul className="project-tools">
            {project.tools.map((tool) => (
              <li key={tool} className="t-mono">
                {tool}
              </li>
            ))}
          </ul>
        </section>}
      </div>

      <nav className="project-nav t-mono">
        <button
          type="button"
          className="project-nav-btn"
          onClick={() => goToProject(prev.slug, prev.id)}
          onMouseEnter={() => sfx.hover()}
        >
          <span className="project-nav-dir">← PREV</span>
          <span className="project-nav-name">PROJECT_{prev.id} / {prev.title}</span>
        </button>
        <button
          type="button"
          className="project-nav-btn project-nav-btn--next"
          onClick={() => goToProject(next.slug, next.id)}
          onMouseEnter={() => sfx.hover()}
        >
          <span className="project-nav-dir">NEXT →</span>
          <span className="project-nav-name">PROJECT_{next.id} / {next.title}</span>
        </button>
      </nav>
    </article>
  );
}
