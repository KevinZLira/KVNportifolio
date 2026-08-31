import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionLabel } from "../hooks/useSectionLabel";
import PendantViewer from "../components/PendantViewer/PendantViewer";
import "./ArtifactHero.css";

// ARTIFACT_HERO — a full alternative to Hero.tsx, not a slot-fill inside it
// (see src/config/heroExperience.ts). One object, centered, treated as a
// physical thing that belongs to KVN rather than a decorative 3D render;
// everything else on the page is either the fixed header (untouched here)
// or this peripheral frame — nothing competes with the object for the
// center of the screen.
//
// DataVeil (the Matrix-rain background) is unplugged for now — it was
// noticeably janky on real hardware at the requested density. Component
// is still in src/components/DataVeil, kept for when a video background
// replaces it.
//
// ah-frame is four independent corner clusters (own content, own line
// lengths) plus two broken tick-stacks on the sides — deliberately not a
// closed rectangle. See the CSS comment on .ah-frame for the reasoning.

export default function ArtifactHero() {
  const sectionRef = useSectionLabel<HTMLElement>("KVN_SYSTEM");
  const coordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: reduce ? 0 : 0.15 })
        .from(".ah-stage", { opacity: 0, scale: reduce ? 1 : 0.94, duration: reduce ? 0 : 0.9, ease: "power3.out" })
        .from(
          ".ah-frame-corner",
          { opacity: 0, duration: reduce ? 0 : 0.6, stagger: reduce ? 0 : 0.1, ease: "power2.out" },
          reduce ? 0 : "-=0.5",
        )
        .from(".ah-frame-side", { opacity: 0, duration: reduce ? 0 : 0.6, ease: "power2.out" }, reduce ? 0 : "-=0.4");
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

      <div className="ah-frame t-mono">
        <div className="ah-frame-side ah-frame-side-left" aria-hidden="true">
          <span className="ah-frame-ticks">
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick ah-frame-tick--faint" />
          </span>
          <span className="ah-frame-ticks">
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick ah-frame-tick--faint" />
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick" />
          </span>
        </div>

        <div className="ah-frame-side ah-frame-side-right" aria-hidden="true">
          <span className="ah-frame-ticks">
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick ah-frame-tick--faint" />
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick" />
          </span>
          <span className="ah-frame-ticks">
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick" />
            <span className="ah-frame-tick ah-frame-tick--faint" />
            <span className="ah-frame-tick" />
          </span>
        </div>

        {/* institutional — a plain location tag, nothing more */}
        <div className="ah-frame-corner ah-frame-tl">
          <div className="ah-frame-deco" aria-hidden="true">
            <span className="ah-frame-bracket" />
            <span className="ah-frame-line" />
          </div>
          <span className="ah-frame-label">/SYSTEM/HOME</span>
        </div>

        {/* technical — live pointer coordinates plus a status dot standing
            in for "status" without adding another line of text */}
        <div className="ah-frame-corner ah-frame-tr">
          <div className="ah-frame-deco" aria-hidden="true">
            <span className="ah-frame-line" />
            <span className="ah-frame-bracket" />
          </div>
          <span className="ah-frame-label ah-frame-label--live">
            <span className="ah-frame-dot" aria-hidden="true" />
            <span ref={coordRef}>X:0000 Y:0000</span>
          </span>
        </div>

        {/* small indicators / id + access — two stacked lines, the only
            corner with more than one text row */}
        <div className="ah-frame-corner ah-frame-bl">
          <span className="ah-frame-label">ACCESS: GRANTED</span>
          <span className="ah-frame-label ah-frame-label--dim">ID: KVN-001</span>
          <div className="ah-frame-deco" aria-hidden="true">
            <span className="ah-frame-bracket" />
            <span className="ah-frame-line" />
          </div>
        </div>

        {/* object/system reference — the one corner with a diagonal cut,
            for asymmetry */}
        <div className="ah-frame-corner ah-frame-br">
          <span className="ah-frame-label">ARCHIVE: KVN-001</span>
          <div className="ah-frame-deco" aria-hidden="true">
            <span className="ah-frame-line" />
            <span className="ah-frame-cut" />
            <span className="ah-frame-bracket" />
          </div>
        </div>
      </div>
    </section>
  );
}
