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
        .from(".ah-stage", { opacity: 0, scale: reduce ? 1 : 0.94, duration: reduce ? 0 : 0.9, ease: "power3.out" })
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

      <div className="ah-stage">
        <PendantViewer />
      </div>

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
