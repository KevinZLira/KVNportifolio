import { useEffect, useRef } from "react";
import { useSectionLabel } from "../hooks/useSectionLabel";
import { getHeroVideoSrc, shouldSkipHeroVideoAutoplay } from "../lib/heroVideoSrc";
import "./MinimalHero.css";

// MINIMAL_HERO — the editorial/typography-led revision of ArtifactHero.
// "Less, but better": logo, one line of copy, specialties, one CTA, and two
// small texture details. No 3D object, no HUD frame, no particles. This is
// a sibling composition, not a replacement — ArtifactHero, PendantViewer,
// DataVeil and every ASCII/HUD experiment stay exactly as they are; see
// src/config/heroExperience.ts to switch back with a one-line change.
//
// Background is a real video loop (muted/looped) with a left-heavy dark
// scrim so the now left-aligned text stays legible. object-fit: cover
// always fills the frame edge-to-edge on any screen size/aspect ratio —
// cropping the sides or top/bottom is preferred over letterbox bars.
// Source resolution matches the viewer's actual monitor: a 4K screen gets
// the native 4K encode, anything at or below Full HD gets a separate
// 1080p encode — no point shipping 4K bytes to a screen that cannot
// render more than 1080p of it.
//
// This component is mounted the whole time, even during BOOT (see
// App.tsx's AppShell) — inert and hidden behind BootSequence's opaque
// overlay — specifically so the video/fonts/layout are already warm by
// the time the user enters. No entrance animation on the content itself
// (removed) — everything renders in its final state immediately; the
// logo still has a subtle cursor-proximity microinteraction.

const SPECIALTIES = ["DESIGN", "MOTION", "3D", "VIDEO"];

export default function MinimalHero() {
  const sectionRef = useSectionLabel<HTMLElement>("KVN_SYSTEM");
  const logoRef = useRef<HTMLDivElement>(null);

  // Read once at mount — not reactive, matching the matchMedia checks used
  // elsewhere in this codebase. Autoplay is skipped (poster frame only)
  // under reduced motion and on coarse/narrow (mobile) viewports, where a
  // multi-MB video loop is a poor use of a mobile data connection.
  const skipAutoplay = shouldSkipHeroVideoAutoplay();
  const videoSrc = getHeroVideoSrc();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.matchMedia("(hover: none)").matches) return;

    // Mini parallax across the whole composition: every element drifts a
    // few px toward the cursor's position within the section, each at its
    // own depth (bigger/foreground-feeling elements move more) — one
    // shared mousemove listener, not one per element. The logo additionally
    // keeps its cursor-proximity scale/glow, layered on top of its own
    // parallax offset. All of it eases via each element's own CSS
    // transition rather than snapping to the cursor on every tick.
    const LOGO_DEPTH = 10;
    const PARALLAX_TARGETS: { selector: string; depth: number }[] = [
      { selector: ".mh-status", depth: 4 },
      { selector: ".mh-message", depth: 7 },
      { selector: ".mh-specialties", depth: 5 },
      { selector: ".mh-cta", depth: 5 },
      { selector: ".mh-detail-left", depth: 3 },
      { selector: ".mh-detail-right", depth: 3 },
    ];
    const parallaxEls = PARALLAX_TARGETS.map(({ selector, depth }) => {
      const el = section.querySelector<HTMLElement>(selector);
      return el ? { el, depth } : null;
    }).filter((x): x is { el: HTMLElement; depth: number } => x !== null);

    function onMove(e: MouseEvent) {
      const logo = logoRef.current;
      const sectionEl = sectionRef.current;
      if (!logo || !sectionEl) return;
      const rect = logo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const proximity = Math.max(0, 1 - dist / 420);

      const sectionRect = sectionEl.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (sectionRect.left + sectionRect.width / 2)) / (sectionRect.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (sectionRect.top + sectionRect.height / 2)) / (sectionRect.height / 2)));

      logo.style.transform = `translate(${(nx * LOGO_DEPTH).toFixed(2)}px, ${(ny * LOGO_DEPTH).toFixed(2)}px) scale(${1 + proximity * 0.02})`;
      logo.style.filter = `brightness(${1 + proximity * 0.1})`;

      for (const { el, depth } of parallaxEls) {
        el.style.transform = `translate(${(nx * depth).toFixed(2)}px, ${(ny * depth).toFixed(2)}px)`;
      }
    }
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [sectionRef]);

  return (
    <section ref={sectionRef} id="hero" className="minimal-hero">
      <video
        className="mh-video-bg"
        src={videoSrc}
        poster="/video/hero-bg-poster.jpg"
        autoPlay={!skipAutoplay}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="mh-video-scrim" aria-hidden="true" />

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

      <span className="mh-detail mh-detail-left t-mono">AVAILABLE FOR SELECTED CONTRACTS</span>
      <span className="mh-detail mh-detail-right t-mono">2026</span>
    </section>
  );
}
