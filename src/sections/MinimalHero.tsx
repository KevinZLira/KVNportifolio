import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionLabel } from "../hooks/useSectionLabel";
import { AsciiArt, HERO_CORNER_MARK } from "../lib/ascii";
import "./MinimalHero.css";

// MINIMAL_HERO — the editorial/typography-led revision of ArtifactHero.
// "Less, but better": logo, one line of copy, specialties, one CTA, and two
// small texture details. No 3D object, no HUD frame, no particles. This is
// a sibling composition, not a replacement — ArtifactHero, PendantViewer,
// DataVeil and every ASCII/HUD experiment stay exactly as they are; see
// src/config/heroExperience.ts to switch back with a one-line change.
//
// The one quiet ASCII touch the market-redesign brief allows in the Hero:
// a tiny static corner mark, sized and dimmed to stay clearly subordinate
// to the logo — texture, never a second focal point.

const SPECIALTIES = ["DESIGN", "MOTION", "VIDEO"];

export default function MinimalHero() {
  const sectionRef = useSectionLabel<HTMLElement>("KVN_SYSTEM");
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Entrance is the composition's only real flourish, so it's a single
    // short sequence (status -> logo -> message -> specialties -> cta ->
    // footer details) rather than several effects running at once — matches
    // the "interface initializing" feel asked for, not a shower of tweens.
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: reduce ? 0 : 0.2 })
        .from(".mh-status", { opacity: 0, y: 6, duration: reduce ? 0 : 0.5, ease: "power2.out" })
        .from(
          ".mh-logo",
          { opacity: 0, y: 14, duration: reduce ? 0 : 0.7, ease: "power3.out" },
          reduce ? 0 : "-=0.15",
        )
        .from(
          ".mh-message",
          { opacity: 0, y: 10, duration: reduce ? 0 : 0.6, ease: "power2.out" },
          reduce ? 0 : "-=0.35",
        )
        .from(
          ".mh-specialty",
          { opacity: 0, y: 8, duration: reduce ? 0 : 0.5, stagger: reduce ? 0 : 0.06, ease: "power2.out" },
          reduce ? 0 : "-=0.3",
        )
        .from(".mh-cta", { opacity: 0, y: 8, duration: reduce ? 0 : 0.5, ease: "power2.out" }, reduce ? 0 : "-=0.25")
        .from(
          ".mh-detail, .mh-ascii-mark",
          { opacity: 0, duration: reduce ? 0 : 0.6, stagger: reduce ? 0 : 0.1, ease: "power1.out" },
          reduce ? 0 : "-=0.3",
        );
    }, section);

    if (reduce || window.matchMedia("(hover: none)").matches) {
      return () => ctx.revert();
    }

    // Logo microinteraction: a very slight lift as the cursor passes near
    // it, nothing that reads as an effect on first glance. Proximity-based
    // rather than a plain :hover so it starts before the pointer actually
    // touches the mark.
    function onMove(e: MouseEvent) {
      const logo = logoRef.current;
      if (!logo) return;
      const rect = logo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const proximity = Math.max(0, 1 - dist / 420);
      logo.style.transform = `scale(${1 + proximity * 0.02})`;
      logo.style.filter = `brightness(${1 + proximity * 0.1})`;
    }
    section.addEventListener("mousemove", onMove);
    return () => {
      section.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, [sectionRef]);

  return (
    <section ref={sectionRef} id="hero" className="minimal-hero">
      <div className="mh-content">
        <span className="mh-status t-mono">
          <span className="mh-status-dot" aria-hidden="true" />
          KVN_SYS // ONLINE
        </span>

        <div className="mh-logo" ref={logoRef}>
          <img src="/logo-kvn.svg" alt="KVN" />
        </div>

        <p className="mh-message t-display">INDEPENDENT CREATIVE OPERATOR</p>

        <p className="mh-specialties t-mono">
          {SPECIALTIES.map((s, i) => (
            <span key={s} className="mh-specialty">
              {s}
              {i < SPECIALTIES.length - 1 && (
                <span className="mh-specialty-sep" aria-hidden="true">
                  /
                </span>
              )}
            </span>
          ))}
        </p>

        <a href="#work" className="mh-cta t-mono">
          <span className="mh-cta-bracket">[</span>
          <span className="mh-cta-label">ENTER ARCHIVE</span>
          <span className="mh-cta-arrow" aria-hidden="true">
            →
          </span>
          <span className="mh-cta-bracket">]</span>
        </a>
      </div>

      <span className="mh-detail mh-detail-left t-mono">AVAILABLE FOR CONTRACT</span>
      <span className="mh-detail mh-detail-right t-mono">2026</span>

      <span className="mh-ascii-mark" aria-hidden="true">
        <AsciiArt art={HERO_CORNER_MARK} color="#4a4f44" />
      </span>
    </section>
  );
}
