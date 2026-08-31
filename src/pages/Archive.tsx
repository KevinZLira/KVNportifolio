import { Link } from "react-router-dom";
import { projects, getStatus } from "../data/projects";
import AsciiIcon from "../ascii/AsciiIcon";
import FileThumb from "../system/FileThumb";
import AsciiReveal from "../system/AsciiReveal";
import FileHeader from "../system/FileHeader";
import { useReveal } from "../system/useReveal";
import "./Archive.css";

// A rare subset of files get the special ASCII transformation on hover.
const ASCII_SPECIAL = new Set(["signal-loss", "cathode"]);

function ArchiveCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useReveal<HTMLAnchorElement>();
  const isSpecial = ASCII_SPECIAL.has(project.slug);

  return (
    <Link
      to={`/archive/${project.slug}`}
      className="archive-card"
      style={{ transitionDelay: `${(index % 6) * 40}ms` }}
      ref={ref}
    >
      <div className="archive-card__thumb-wrap">
        <FileThumb id={project.id} accent={project.accent} />
        {isSpecial && (
          <div className="archive-card__ascii-overlay">
            <AsciiReveal seed={parseInt(project.id, 10)} />
          </div>
        )}
        <span className="archive-card__icon">
          <AsciiIcon name={project.ascii} size="sm" />
        </span>
      </div>

      <div className="archive-card__meta">
        <span className="archive-card__file">FILE_{project.id}</span>
        <span className="archive-card__name">{project.title}</span>
        <span className="archive-card__row">
          <span>{project.category}</span>
          <span>{project.year}</span>
          <span className={`archive-card__status archive-card__status--${getStatus(project)}`}>
            {getStatus(project).replace("_", " ")}
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function Archive() {
  return (
    <div className="archive-page">
      <div className="archive-page__intro">
        <FileHeader index="02" title="ARCHIVE" />
        <p className="archive-page__lede">
          Catalogued record of contracted work. Every entry is a closed file —
          open one to review the operation.
        </p>
      </div>

      <div className="archive-grid">
        {projects.map((p, i) => (
          <ArchiveCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}
