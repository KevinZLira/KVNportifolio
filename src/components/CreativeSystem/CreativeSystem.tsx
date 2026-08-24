import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { getProjectBySlug, type Project } from "../../data/projects";
import { useSystem } from "../../state/SystemContext";
import { useTransition } from "../../state/TransitionContext";
import { sfx } from "../../lib/sound";
import MediaPreview from "../Media/MediaPreview";
import "./CreativeSystem.css";

// CREATIVE_SYSTEM — an alternative to OBJECT_VIEWER/TIME_FIELD: instead of
// one protagonist object filling the right side, the whole hero becomes a
// loosely-composed environment of small fragments (real project previews,
// file tags, a timeline, stray telemetry) that feels like it was already
// running before the visitor arrived. Two full-bleed layers sit behind and
// in front of the hero text (see CreativeSystem.css for the z-index story);
// nothing here touches Hero.tsx's own text/layout beyond where it mounts.

const FRAGMENT_SLUGS = ["mrblurryface", "nullpoint", "ghostwire-poster"];

const STATUS_CYCLE = ["PROCESSING", "ARCHIVED", "LOADING", "STANDBY"];

const FILE_TAGS = [
  { ext: ".AEP", top: "14%", left: "58%", delay: 0.4, dur: 7 },
  { ext: ".MP4", top: "68%", left: "84%", delay: 2.1, dur: 8.5 },
  { ext: ".PSD", top: "40%", left: "94%", delay: 4.4, dur: 6.5 },
  { ext: ".MOV", top: "82%", left: "62%", delay: 1.2, dur: 9 },
];

const BINARY_BLIPS = [
  { top: "8%", left: "72%", delay: 3 },
  { top: "58%", left: "6%", delay: 9 },
  { top: "88%", left: "40%", delay: 15 },
];

function pad(n: number, len: number) {
  return String(Math.max(0, Math.round(n))).padStart(len, "0");
}

interface FragmentProps {
  project: Project;
  className: string;
  index: number;
}

function PreviewFragment({ project, className, index }: FragmentProps) {
  const [hovered, setHovered] = useState(false);
  const [statusIdx, setStatusIdx] = useState(index % STATUS_CYCLE.length);
  const { setCursorMode } = useSystem();
  const { runTransition } = useTransition();
  const navigate = useNavigate();

  useEffect(() => {
    const id = window.setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS_CYCLE.length),
      5200 + index * 900,
    );
    return () => window.clearInterval(id);
  }, [index]);

  function open() {
    sfx.click();
    setCursorMode({ kind: "busy", label: "ACCESSING..." });
    runTransition(`LOADING PROJECT_${project.id}...`, () => navigate(`/work/${project.slug}`));
  }

  const status = hovered ? "PLAYBACK_ACTIVE" : STATUS_CYCLE[statusIdx];

  return (
    <div
      className={`cs-fragment ${className} ${hovered ? "is-hover" : ""}`}
      onMouseEnter={() => {
        setHovered(true);
        setCursorMode({ kind: "project", id: project.id });
        sfx.hover();
      }}
      onMouseLeave={() => {
        setHovered(false);
        setCursorMode({ kind: "default" });
      }}
      onClick={open}
    >
      <div
        className="cs-fragment-particles"
        style={{ animationDelay: `${1.6 + index * 0.22}s` }}
        aria-hidden="true"
      />
      <span className="cs-fragment-label t-mono">/ SIGNAL_{project.id}</span>
      <div className="cs-fragment-media">
        <MediaPreview accent={project.accent} id={project.id} interactive={false} />
      </div>
      <div className="cs-fragment-foot t-mono">
        <span className="cs-fragment-status">STATUS: {status}</span>
        <span className="cs-fragment-bar" aria-hidden="true">
          <span className="cs-fragment-bar-fill" />
        </span>
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <div className="cs-timeline" aria-hidden="true">
      <span className="cs-timeline-label t-mono">TIMELINE_01</span>
      <div className="cs-timeline-track">
        <span className="cs-timeline-playhead" />
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="cs-timeline-tick" style={{ left: `${(i / 11) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

function RenderReadout() {
  const [pct, setPct] = useState(12);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPct((p) => (p >= 98 ? 4 : p + Math.random() * 6));
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="cs-render t-mono" aria-hidden="true">
      RENDERING<span className="blink">_</span> {pad(pct, 2)}%
    </div>
  );
}

export default function CreativeSystem() {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const [bootLine, setBootLine] = useState("SYSTEM ONLINE");
  const [booting, setBooting] = useState(true);

  const fragments = FRAGMENT_SLUGS.map((slug) => getProjectBySlug(slug)).filter(
    (p): p is Project => Boolean(p),
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = window.setTimeout(() => setBootLine("CREATIVE ENVIRONMENT INITIALIZING"), reduce ? 0 : 650);
    const t2 = window.setTimeout(() => setBootLine("ELEMENTS LOADING"), reduce ? 0 : 1300);
    const t3 = window.setTimeout(() => setBooting(false), reduce ? 0 : 1900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.from(".cs-fragment", {
        opacity: 0,
        y: 24,
        scale: 0.96,
        duration: reduce ? 0 : 0.7,
        stagger: reduce ? 0 : 0.22,
        delay: reduce ? 0 : 1.6,
        ease: "power3.out",
      });
      gsap.from(".cs-ambient", {
        opacity: 0,
        duration: reduce ? 0 : 0.9,
        stagger: reduce ? 0 : 0.15,
        delay: reduce ? 0 : 2.1,
        ease: "power1.out",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const isCoarse = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduce) return;

    const root = rootRef.current;
    if (!root) return;
    let raf = 0;

    function onMove(e: MouseEvent) {
      const rect = root!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (backRef.current) backRef.current.style.transform = `translate(${x * -10}px, ${y * -6}px)`;
        if (frontRef.current) frontRef.current.style.transform = `translate(${x * 22}px, ${y * 14}px)`;
      });
    }

    root.addEventListener("mousemove", onMove);
    return () => {
      root.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="creative-system" aria-hidden="true">
      <div ref={backRef} className="cs-layer cs-layer-back">
        <svg className="cs-line cs-ambient" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 0 160 C 120 40, 260 180, 400 30" />
        </svg>
        <div className="cs-ghost-tag cs-ambient t-mono">PROJECT_FRAGMENT_09</div>
      </div>

      <div ref={frontRef} className="cs-layer cs-layer-front">
        {fragments[0] && <PreviewFragment project={fragments[0]} className="cs-fragment-a" index={0} />}
        {fragments[1] && <PreviewFragment project={fragments[1]} className="cs-fragment-b" index={1} />}
        {fragments[2] && <PreviewFragment project={fragments[2]} className="cs-fragment-c" index={2} />}

        {FILE_TAGS.map((tag) => (
          <span
            key={tag.ext}
            className="cs-file-tag cs-ambient t-mono"
            style={{
              top: tag.top,
              left: tag.left,
              animationDelay: `${tag.delay}s`,
              animationDuration: `${tag.dur}s`,
            }}
          >
            {tag.ext}
          </span>
        ))}

        {BINARY_BLIPS.map((b, i) => (
          <span
            key={i}
            className="cs-binary cs-ambient t-mono"
            style={{ top: b.top, left: b.left, animationDelay: `${b.delay}s` }}
          >
            {Array.from({ length: 6 }, () => Math.round(Math.random())).join("")}
          </span>
        ))}

        <div className="cs-ambient">
          <Timeline />
        </div>
        <div className="cs-ambient">
          <RenderReadout />
        </div>
      </div>

      <div className={`cs-boot t-mono ${booting ? "" : "is-done"}`}>{bootLine}</div>
    </div>
  );
}
