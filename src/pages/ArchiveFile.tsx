import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getAdjacentProjects, getProjectBySlug, getStatus } from "../data/projects";
import AsciiIcon from "../ascii/AsciiIcon";
import FileThumb from "../system/FileThumb";
import { ParallaxLayer } from "../system/ParallaxField";
import "./ArchiveFile.css";

export default function ArchiveFile() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const [accessing, setAccessing] = useState(true);

  useEffect(() => {
    setAccessing(true);
    const t = window.setTimeout(() => setAccessing(false), 420);
    return () => window.clearTimeout(t);
  }, [slug]);

  if (!project) return <Navigate to="/archive" replace />;

  const { prev, next } = getAdjacentProjects(project.slug);

  return (
    <div className={`archive-file ${accessing ? "is-accessing" : ""}`}>
      <div className="archive-file__accessing" aria-hidden="true">
        ACCESSING FILE_{project.id}…
      </div>

      <div className="archive-file__content">
        <Link to="/archive" className="archive-file__back">
          ← ARCHIVE
        </Link>

        <header className="archive-file__header">
          <span className="archive-file__tag">FILE_{project.id}</span>
          <h1 className="archive-file__title">{project.title}</h1>
          <p className="archive-file__subtitle">{project.subtitle}</p>
        </header>

        <div className="archive-file__body">
          <ParallaxLayer depth={0.05} className="archive-file__visual">
            <FileThumb id={project.id} accent={project.accent} className="archive-file__thumb" />
          </ParallaxLayer>

          <dl className="archive-file__specs">
            <div>
              <dt>TYPE</dt>
              <dd>
                <AsciiIcon name={project.ascii} size="sm" animate={false} />
                {project.category}
              </dd>
            </div>
            <div>
              <dt>YEAR</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>STATUS</dt>
              <dd className={`archive-file__status archive-file__status--${getStatus(project)}`}>
                {getStatus(project).replace("_", " ")}
              </dd>
            </div>
            <div>
              <dt>TOOLS</dt>
              <dd>{project.tools.join(" · ")}</dd>
            </div>
          </dl>
        </div>

        <p className="archive-file__description">{project.description}</p>

        <nav className="archive-file__nav">
          <Link to={`/archive/${prev.slug}`} className="archive-file__nav-link">
            <span className="archive-file__nav-label">PREV</span>
            <span>FILE_{prev.id} — {prev.title}</span>
          </Link>
          <Link to={`/archive/${next.slug}`} className="archive-file__nav-link archive-file__nav-link--next">
            <span className="archive-file__nav-label">NEXT</span>
            <span>FILE_{next.id} — {next.title}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
