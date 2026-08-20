import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { projects, type Project, type ProjectCategory } from "../../data/projects";
import { useSystem } from "../../state/SystemContext";
import { useTransition } from "../../state/TransitionContext";
import { sfx } from "../../lib/sound";
import "./BeaconArray.css";

type Depth = "bg" | "mid" | "fg";
type Variant = "frames" | "brand" | "featured" | "data" | "glitch";

interface Frame {
  lines: string[];
  projectId?: string;
}

interface BeaconDef {
  id: string;
  depth: Depth;
  heightVh: number;
  widthPx: number;
  speedMs: number;
  category: ProjectCategory;
  variant: Variant;
  hideTablet?: boolean;
  hideMobile?: boolean;
}

const BEACONS: BeaconDef[] = [
  { id: "01", depth: "bg", heightVh: 60, widthPx: 40, speedMs: 2600, category: "VIDEO", variant: "frames" },
  { id: "02", depth: "bg", heightVh: 46, widthPx: 22, speedMs: 4000, category: "BRANDING", variant: "brand", hideTablet: true, hideMobile: true },
  { id: "03", depth: "fg", heightVh: 36, widthPx: 58, speedMs: 2200, category: "MOTION", variant: "featured" },
  { id: "04", depth: "mid", heightVh: 25, widthPx: 32, speedMs: 1500, category: "DESIGN", variant: "data", hideMobile: true },
  { id: "05", depth: "bg", heightVh: 42, widthPx: 26, speedMs: 6000, category: "EXPERIMENTAL", variant: "glitch", hideTablet: true, hideMobile: true },
];

const GLITCH_LINES = ["NO_SIGNAL", "▓▓▓▓▓▓", "UNKNOWN_SOURCE", "[REDACTED]", "ECHO...", "??? "];

function framesFor(def: BeaconDef): Frame[] {
  const pool = projects.filter((p) => p.category === def.category);
  const base = pool.length ? pool : projects;

  switch (def.variant) {
    case "frames":
      return base.slice(0, 4).map((p) => ({
        lines: [`PROJECT_${p.id}`, p.title, `${p.category} · ${p.year}`],
        projectId: p.id,
      }));
    case "brand":
      return base.slice(0, 4).map((p) => ({
        lines: [p.title.slice(0, 8), "LOGO_SYS"],
        projectId: p.id,
      }));
    case "featured": {
      const p = base[0];
      return [
        { lines: ["FEATURED", p.title], projectId: p.id },
        { lines: [p.subtitle.slice(0, 24)], projectId: p.id },
        { lines: p.tools, projectId: p.id },
        { lines: [`${p.category} · ${p.year}`], projectId: p.id },
      ];
    }
    case "data":
      return [
        { lines: ["NODE_04", "STATUS: OK"] },
        { lines: [`SIG: ${88 + (base.length % 10)}%`] },
        { lines: [`ARCHIVE: ${String(projects.length).padStart(3, "0")}`] },
        ...base.slice(0, 2).map((p) => ({ lines: [`PROJECT_${p.id}`], projectId: p.id })),
      ];
    case "glitch":
      return [
        { lines: [GLITCH_LINES[0]] },
        { lines: [GLITCH_LINES[1]] },
        { lines: [base[0].title], projectId: base[0].id },
        { lines: [GLITCH_LINES[2]] },
        { lines: [GLITCH_LINES[3]] },
        { lines: [GLITCH_LINES[4]] },
      ];
  }
}

function Beacon({ def, index, reduce }: { def: BeaconDef; index: number; reduce: boolean }) {
  const frames = useRef(framesFor(def)).current;
  const [frameIndex, setFrameIndex] = useState(0);
  const [transmitting, setTransmitting] = useState(false);
  const [locked, setLocked] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const lockedRef = useRef(false);
  const { setCursorMode, requestFilter } = useSystem();
  const { runTransition } = useTransition();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (lockedRef.current) return;
      setTransmitting(true);
      window.setTimeout(() => {
        if (lockedRef.current) return;
        setFrameIndex((i) => (i + 1) % frames.length);
        setTransmitting(false);
      }, 180);
    }, def.speedMs);
    return () => window.clearInterval(id);
  }, [def.speedMs, frames.length, reduce]);

  useEffect(() => {
    if (reduce || def.variant !== "glitch") return;
    const id = window.setInterval(
      () => {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 200);
      },
      5200 + index * 900,
    );
    return () => window.clearInterval(id);
  }, [reduce, def.variant, index]);

  const frame = frames[frameIndex];
  const project: Project | undefined = frame.projectId
    ? projects.find((p) => p.id === frame.projectId)
    : undefined;

  function handleEnter() {
    setLocked(true);
    sfx.hover();
    setCursorMode(project ? { kind: "project", id: project.id } : { kind: "link" });
  }

  function handleLeave() {
    setLocked(false);
    setCursorMode({ kind: "default" });
  }

  function handleClick() {
    sfx.click();
    runTransition("SIGNAL LOCKED — OPENING ARCHIVE...", () => {
      requestFilter(def.category);
      const scroll = () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
      if (location.pathname !== "/") {
        navigate("/");
        window.setTimeout(scroll, 80);
      } else {
        scroll();
      }
    });
  }

  return (
    <button
      type="button"
      className={`beacon beacon--${def.depth} ${locked ? "is-locked" : ""} ${glitching ? "is-glitching" : ""}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      aria-label={`Signal node ${def.id} — ${def.category}`}
    >
      <span className="beacon-id t-mono">N{def.id}</span>
      <span className="beacon-glow" aria-hidden="true" />
      <span className="beacon-scan" aria-hidden="true" />

      <div className="beacon-feed t-mono">
        {transmitting ? (
          <span className="beacon-transmit">TRANSMITTING…</span>
        ) : (
          <span key={frameIndex} className="beacon-frame">
            {frame.lines.map((line, i) => (
              <span key={i} className="beacon-frame-line">
                {line}
              </span>
            ))}
          </span>
        )}
      </div>

      {locked && (
        <div className="beacon-lock t-mono">
          <span className="beacon-lock-title">SIGNAL LOCKED</span>
          {project && <span className="beacon-lock-project">{project.title}</span>}
        </div>
      )}

      <span className="beacon-cat t-mono">{def.category.slice(0, 3)}</span>
    </button>
  );
}

export default function BeaconArray() {
  const [nodesOnline, setNodesOnline] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setNodesOnline(BEACONS.length);
      return;
    }
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setNodesOnline(n);
      if (n >= BEACONS.length) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, []);

  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="beacon-array">
      <div className="beacon-array-label t-mono" aria-hidden="true">
        <span>ARCHIVE SIGNAL NETWORK</span>
        <span>
          STATUS: <span className="beacon-array-status">ACTIVE</span> · [{" "}
          {String(nodesOnline).padStart(2, "0")} NODES ONLINE ]
        </span>
      </div>
      {BEACONS.map((def, i) => (
        <div
          key={def.id}
          className={`beacon-slot ${def.hideTablet ? "hide-tablet" : ""} ${
            def.hideMobile ? "hide-mobile" : ""
          }`}
          style={{ "--beacon-h": `${def.heightVh}vh`, "--beacon-w": `${def.widthPx}px` } as React.CSSProperties}
        >
          <Beacon def={def} index={i} reduce={reduce} />
        </div>
      ))}
    </div>
  );
}
