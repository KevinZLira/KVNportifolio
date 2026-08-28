import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionLabel } from "../hooks/useSectionLabel";
import PendantViewer from "../components/PendantViewer/PendantViewer";
import "./ArtifactHero.css";

// ARTIFACT_HERO — a full alternative to Hero.tsx, not a slot-fill inside it
// (see src/config/heroExperience.ts). One object, centered, treated as a
// physical thing that belongs to KVN rather than a decorative 3D render;
// the rest of the page is mostly empty on purpose.
//
// DataVeil (the Matrix-rain background) is unplugged for now — it was
// noticeably janky on real hardware at the requested density. Component
// is still in src/components/DataVeil, kept for when a video background
// replaces it.
//
// ah-identity and ah-capabilities are the two corner blocks that balance
// the composition diagonally against the central object; both are
// position:absolute on desktop (zero effect on the existing hud/body/meta
// flex flow) and drop into normal flow on mobile via CSS, in the DOM order
// they're already written in below.

const CAPABILITIES = [
  { id: "01", label: "VISUAL IDENTITY" },
  { id: "02", label: "MOTION DESIGN" },
  { id: "03", label: "VIDEO PRODUCTION" },
];

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
        .from(".ah-tag", { opacity: 0, duration: reduce ? 0 : 0.5, stagger: reduce ? 0 : 0.08 }, reduce ? 0 : "-=0.5")
        .from(".ah-corner", { opacity: 0, duration: reduce ? 0 : 0.6, ease: "power2.out" }, reduce ? 0 : "-=0.3");
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
      <div className="ah-stage">
        <PendantViewer />
      </div>

      <div className="ah-hud t-mono">
        <span>/SYSTEM/HOME</span>
        <div className="ah-hud-right">
          <span ref={coordRef} className="ah-coords">
            X:0000 Y:0000
          </span>
        </div>
      </div>

      <div className="ah-identity ah-corner">
        <img src="/logo-kvn.svg" alt="KVN" className="ah-identity-logo" />
        <span className="ah-corner-tag t-mono">// IDENTITY</span>
        <h3 className="ah-corner-title t-mono">INDEPENDENT CREATIVE OPERATOR</h3>
        <p className="ah-identity-copy t-mono">
          VISUAL IDENTITY, MOTION DESIGN AND VIDEO PRODUCTION FOR WORK THAT DEMANDS MORE THAN A STANDARD SOLUTION.
        </p>
      </div>

      {/* Kept as an empty flex:1 spacer -- it's what pushes ah-meta to the
          bottom of the section; only its text content was removed. */}
      <div className="ah-body" />

      <div className="ah-capabilities ah-corner">
        <span className="ah-corner-tag t-mono">// CAPABILITIES</span>
        <h3 className="ah-corner-title t-mono">OPERATIONAL CAPABILITIES</h3>
        <ul className="ah-cap-list t-mono">
          {CAPABILITIES.map((cap) => (
            <li key={cap.id}>
              <span className="ah-cap-index">{cap.id}</span>
              {cap.label}
            </li>
          ))}
        </ul>
        <span className="ah-status t-mono">
          <span className="ah-status-dot" aria-hidden="true" />
          ALL SYSTEMS OPERATIONAL
        </span>
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
