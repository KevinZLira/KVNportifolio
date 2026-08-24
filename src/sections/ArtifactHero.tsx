import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionLabel } from "../hooks/useSectionLabel";
import DataVeil from "../components/DataVeil/DataVeil";
import PendantViewer from "../components/PendantViewer/PendantViewer";
import "./ArtifactHero.css";

// ARTIFACT_HERO — a full alternative to Hero.tsx, not a slot-fill inside it
// (see src/config/heroExperience.ts). One object, centered, treated as a
// physical thing that belongs to KVN rather than a decorative 3D render;
// the rest of the page is mostly empty on purpose, with a second layer
// hidden under the background that the cursor uncovers.

export default function ArtifactHero() {
  const sectionRef = useSectionLabel<HTMLElement>("KVN_SYSTEM");
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: reduce ? 0 : 0.15 })
        .from(".ah-logo", { opacity: 0, y: 12, duration: reduce ? 0 : 0.7, ease: "power2.out" })
        .from(
          ".ah-stage",
          { opacity: 0, scale: reduce ? 1 : 0.94, duration: reduce ? 0 : 0.9, ease: "power3.out" },
          reduce ? 0 : "-=0.3",
        )
        .from(
          ".ah-role, .ah-sub",
          { opacity: 0, y: 10, duration: reduce ? 0 : 0.6, stagger: reduce ? 0 : 0.1, ease: "power2.out" },
          reduce ? 0 : "-=0.4",
        )
        .from(".ah-tag", { opacity: 0, duration: reduce ? 0 : 0.5, stagger: reduce ? 0 : 0.08 }, reduce ? 0 : "-=0.2");
    }, section);

    if (reduce || window.matchMedia("(hover: none)").matches) {
      return () => ctx.revert();
    }

    function onMove(e: MouseEvent) {
      if (coordRef.current) {
        coordRef.current.textContent = `X:${Math.round(e.clientX).toString().padStart(4, "0")} Y:${Math.round(
          e.clientY,
        )
          .toString()
          .padStart(4, "0")}`;
      }
    }
    section.addEventListener("mousemove", onMove);
    return () => {
      section.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, [sectionRef]);

  return (
    <section ref={sectionRef} id="hero" className="artifact-hero">
      <DataVeil />

      <div className="ah-hud t-mono">
        <span>/SYSTEM/HOME</span>
        <div className="ah-hud-right">
          <span className="ah-tag">OBJECT: KVN-001</span>
          <span ref={coordRef} className="ah-coords">
            X:0000 Y:0000
          </span>
        </div>
      </div>

      <div className="ah-body">
        <h1 className="ah-logo" aria-label="KVN">
          <svg className="ah-logo-mark" viewBox="10 190 1900 700" aria-hidden="true" focusable="false">
            <polygon
              className="ah-logo-white"
              points="522.88 574.78 681.94 574.78 1052.72 204 787.8 204 469.95 521.85 443.49 495.38 442.96 495.38 734.34 204 501.84 204 501.86 203.98 186.26 203.98 327.85 345.57 29.22 644.21 29.22 760.3 178.04 760.3 310.9 627.71 443.49 760.3 553.64 870.45 702.65 870.73 702.65 754.54 677.84 729.73 522.88 574.78"
            />
            <polygon
              className="ah-logo-white"
              points="1580.86 204 1078.84 706.02 974.62 601.81 1311.23 265.2 1250.32 204.3 1106.95 204.3 709.57 601.67 868.49 760.6 1133.41 760.6 1610.33 283.66 1663.26 283.66 1186.62 760.3 1451.54 760.3 1891.74 320.09 1891.74 204 1580.86 204"
            />
            <path
              className="ah-logo-accent"
              d="M1075.23,655.55l451.93-451.79h-109.61l-396.89,397.23,54.56,54.56ZM1424.14,219.71h64.65l-413.56,413.28-32.08-32,380.99-381.27Z"
            />
          </svg>
        </h1>

        <div className="ah-stage">
          <PendantViewer />
        </div>

        <p className="ah-role t-display">VISUAL CONTRACTOR</p>
        <p className="ah-sub t-mono">AVAILABLE FOR SELECTED WORK.</p>
      </div>

      <div className="ah-meta t-mono">
        <span className="ah-tag">ACCESS: GRANTED</span>
        <span className="ah-tag ah-scroll">
          ARCHIVE ACCESS <span className="ah-scroll-arrow">↓</span>
        </span>
      </div>
    </section>
  );
}
