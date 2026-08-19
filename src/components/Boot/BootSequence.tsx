import { useEffect, useRef, useState, useCallback } from "react";
import { sfx } from "../../lib/sound";
import "./BootSequence.css";

interface BootLine {
  text: string;
  delay: number;
  glitch?: boolean;
}

const LINES: BootLine[] = [
  { text: "SYSTEM INITIALIZATION...", delay: 120 },
  { text: "KVN_OS v.04.27", delay: 90 },
  { text: "BOOT DEVICE: /dev/creative0", delay: 70 },
  { text: "CHECKING MEMORY.......... 640K OK", delay: 60 },
  { text: "LOADING CREATIVE MODULES...", delay: 90 },
  { text: "PROGRESS", delay: 40, glitch: false },
  { text: "VIDEO_ENGINE ........ OK", delay: 70 },
  { text: "DESIGN_ENGINE ....... OK", delay: 70 },
  { text: "MOTION_ENGINE ....... OK", delay: 70 },
  { text: "VISUAL_MEMORY ....... OK", delay: 70 },
  { text: "TYPE_SYSTEM ......... OK", delay: 60 },
  { text: "SCANNING FOR SIGNAL...", delay: 100, glitch: true },
  { text: "USER DETECTED.", delay: 140 },
  { text: "ACCESS GRANTED.", delay: 120 },
];

const PROGRESS_LABEL_INDEX = LINES.findIndex((l) => l.text === "PROGRESS");

function ProgressBar({ pct }: { pct: number }) {
  const width = 24;
  const filled = Math.round((pct / 100) * width);
  return (
    <span className="boot-progress">
      [{"█".repeat(filled)}
      {"░".repeat(width - filled)}] {String(pct).padStart(3, " ")}%
    </span>
  );
}

export default function BootSequence({ onEnter }: { onEnter: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [glitchTick, setGlitchTick] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let i = 0;

    function step() {
      if (!mounted) return;
      if (i >= LINES.length) {
        setReady(true);
        sfx.confirm();
        return;
      }
      i += 1;
      setVisibleLines(i);
      if (i === PROGRESS_LABEL_INDEX + 1) {
        animateProgress();
      }
      if (Math.random() < 0.35) sfx.glitch();
      window.setTimeout(step, LINES[i - 1]?.delay ?? 80);
    }

    function animateProgress() {
      let p = 0;
      const id = window.setInterval(() => {
        p += 4 + Math.random() * 10;
        if (p >= 100) {
          p = 100;
          window.clearInterval(id);
        }
        setProgress(Math.round(p));
      }, 45);
    }

    window.setTimeout(step, 200);
    return () => {
      mounted = false;
    };
  }, []);

  // occasional flicker/glitch pass across the whole screen while booting
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Math.random() < 0.4) setGlitchTick((t) => t + 1);
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  const handleEnter = useCallback(() => {
    if (!ready || exiting) return;
    sfx.confirm();
    setExiting(true);
    window.setTimeout(onEnter, 650);
  }, [ready, exiting, onEnter]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") handleEnter();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleEnter]);

  return (
    <div
      ref={rootRef}
      className={`boot-root ${exiting ? "is-exiting" : ""} ${glitchTick % 2 ? "is-glitching" : ""}`}
    >
      <div className="boot-noise" />
      <div className="boot-scanlines" />
      <div className="boot-content">
        <div className="boot-log t-mono">
          {LINES.slice(0, visibleLines).map((line, idx) => {
            if (idx === PROGRESS_LABEL_INDEX) {
              return (
                <div key={idx} className="boot-line">
                  <ProgressBar pct={progress} />
                </div>
              );
            }
            return (
              <div key={idx} className={`boot-line ${line.glitch ? "is-glitch-line" : ""}`}>
                {line.text}
              </div>
            );
          })}
          {!ready && <span className="boot-cursor blink">_</span>}
        </div>

        <div className={`boot-enter ${ready ? "is-ready" : ""}`}>
          <button
            type="button"
            className="boot-enter-btn t-mono"
            onClick={handleEnter}
            disabled={!ready}
            aria-label="Enter system"
          >
            <span className="boot-enter-bracket">[</span>
            <span className="boot-enter-label">ENTER SYSTEM</span>
            <span className="boot-enter-bracket">]</span>
          </button>
          <div className="boot-enter-hint t-pixel">
            PRESS ENTER TO CONTINUE<span className="blink">_</span>
          </div>
        </div>
      </div>

      <div className="boot-footer t-mono">
        <span>KVN_OS</span>
        <span>BUILD 2026.08</span>
        <span>NO SIGNAL LOST</span>
      </div>

      {visibleLines > LINES.length - 4 && (
        <div className={`boot-visitor ${ready ? "is-blinking" : ""}`} aria-hidden="true">
          <span className="boot-visitor-ear" />
          <span className="boot-visitor-eye" />
          <span className="boot-visitor-eye" />
        </div>
      )}
    </div>
  );
}
