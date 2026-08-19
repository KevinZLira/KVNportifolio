import { useEffect, useRef, type CSSProperties } from "react";
import { useRaccoon } from "./RaccoonContext";
import RaccoonCreature from "./RaccoonCreature";
import type { RaccoonLayer } from "./types";

interface RaccoonSpotProps {
  id: string;
  layer: RaccoonLayer;
  wanderRadius?: number;
  inline?: boolean;
  /** Overrides where the creature grows from its zero-size anchor point. */
  creatureStyle?: CSSProperties;
  /** Extra class on the anchor itself — for responsive placement via CSS. */
  wrapperClassName?: string;
  isFirstVisitSpot?: boolean;
  /** px per bitmap cell — bigger for a hero-sized mascot, small elsewhere. */
  cell?: number;
}

export default function RaccoonSpot({
  id,
  layer,
  wanderRadius = 18,
  inline = false,
  creatureStyle,
  wrapperClassName,
  isFirstVisitSpot,
  cell,
}: RaccoonSpotProps) {
  const { activeSpotId, registerSpotVisibility, systemReady } = useRaccoon();
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!systemReady) return;
    const el = anchorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => registerSpotVisibility(id, entry.isIntersecting));
      },
      // generous band (not a thin center strip): a spot should stay
      // "found" for as long as its anchor is reasonably on screen, not
      // just the instant it crosses dead-center.
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      registerSpotVisibility(id, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, systemReady]);

  const isActive = systemReady && activeSpotId === id;

  return (
    <div
      ref={anchorRef}
      className={wrapperClassName}
      style={{
        position: "relative",
        display: inline ? "inline-block" : "block",
        // 1x1, not 0x0: a zero-area target never reports as intersecting
        // in IntersectionObserver (some engines treat 0 intersection area
        // as never-intersecting regardless of position) — 1px is visually
        // inert but keeps visibility detection working.
        width: 1,
        height: 1,
        overflow: "visible",
        pointerEvents: "none",
        // Contain the creature's negative z-index (behind_ui/background
        // layers) to this spot alone. Without it, z-index:-1 is resolved
        // against the page's root stacking context instead of just the
        // nearby text, and the raccoon vanishes behind unrelated content
        // anywhere on the page.
        isolation: "isolate",
        ...creatureStyle,
      }}
    >
      {isActive && (
        <RaccoonCreature
          spotId={id}
          layer={layer}
          wanderRadius={wanderRadius}
          isFirstVisitSpot={isFirstVisitSpot}
          cell={cell}
        />
      )}
    </div>
  );
}
