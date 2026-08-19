import { useRaccoonBehavior } from "./useRaccoonBehavior";
import type { RaccoonLayer } from "./types";
import { LAYER_Z } from "./types";
import "./RaccoonCreature.css";

interface RaccoonCreatureProps {
  spotId: string;
  layer: RaccoonLayer;
  wanderRadius: number;
  isFirstVisitSpot?: boolean;
}

export default function RaccoonCreature({
  spotId,
  layer,
  wanderRadius,
  isFirstVisitSpot,
}: RaccoonCreatureProps) {
  const { rootRef, behavior, facing, bubble, walkOffset, blinking, earTwitch, visibility } =
    useRaccoonBehavior({ spotId, wanderRadius, isFirstVisitSpot });

  return (
    <div
      ref={rootRef}
      className="raccoon-root"
      style={{
        zIndex: LAYER_Z[layer],
        transform: `translateX(${walkOffset}px)`,
      }}
      data-behavior={behavior}
      aria-hidden="true"
    >
      {bubble && <div className="raccoon-bubble t-mono">{bubble}</div>}

      <div className="raccoon-flip" style={{ transform: `scaleX(${facing})` }}>
      <svg
        className={`raccoon-svg vis-${visibility} ${blinking ? "is-blinking" : ""} ${earTwitch ? "is-eartwitch" : ""}`}
        viewBox="0 0 32 32"
        width="40"
        height="40"
        shapeRendering="crispEdges"
      >
        <g className="rc-tail">
          <rect className="rc-fill-dark" x="3" y="6" width="4" height="5" />
          <rect className="rc-fill-body" x="4" y="11" width="5" height="5" />
          <rect className="rc-fill-dark" x="6" y="16" width="5" height="5" />
          <rect className="rc-fill-body" x="9" y="20" width="5" height="5" />
        </g>

        <rect className="rc-leg rc-leg-back rc-fill-dark" x="13" y="25" width="4" height="5" />

        <g className="rc-body">
          <rect className="rc-fill-body" x="11" y="15" width="13" height="11" />
          <rect className="rc-fill-shadow" x="11" y="23" width="13" height="3" />
          <rect className="rc-fill-light" x="14" y="19" width="7" height="5" />
        </g>

        <rect className="rc-leg rc-leg-front rc-fill-dark" x="19" y="25" width="4" height="5" />

        <g className="rc-arm">
          <rect className="rc-fill-body" x="21" y="17" width="3" height="7" />
          <rect className="rc-fill-dark" x="21" y="22" width="3" height="2" />
        </g>

        <g className="rc-head">
          <g className="rc-ears">
            <g className="rc-ear-l">
              <rect className="rc-fill-body" x="17" y="2" width="4" height="4" />
              <rect className="rc-fill-dark" x="17" y="2" width="4" height="2" />
            </g>
            <g className="rc-ear-r">
              <rect className="rc-fill-body" x="24" y="2" width="4" height="4" />
              <rect className="rc-fill-dark" x="24" y="2" width="4" height="2" />
            </g>
          </g>

          <g className="rc-face">
            <rect className="rc-fill-body" x="17" y="5" width="11" height="10" />
            <rect className="rc-fill-dark rc-mask" x="17" y="9" width="11" height="4" />
            <rect className="rc-fill-light" x="20" y="13" width="5" height="3" />
            <rect className="rc-fill-dark" x="21" y="13" width="3" height="1" />
          </g>

          <g className="rc-eyes">
            <rect className="rc-eye rc-eye-l" x="19" y="10" width="2" height="2" />
            <rect className="rc-eye rc-eye-r" x="24" y="10" width="2" height="2" />
          </g>
        </g>
      </svg>
      </div>

      {behavior === "sleeping" && (
        <div className="raccoon-zzz t-mono" aria-hidden="true">
          <span>z</span>
          <span>Z</span>
          <span>Z</span>
        </div>
      )}

      {behavior === "steal_run" && (
        <div className="raccoon-stolen-cursor" aria-hidden="true">
          <span className="raccoon-stolen-cursor-mark" />
        </div>
      )}
    </div>
  );
}
