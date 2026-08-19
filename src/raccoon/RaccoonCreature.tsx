import type { CSSProperties } from "react";
import { useRaccoonBehavior } from "./useRaccoonBehavior";
import type { RaccoonLayer } from "./types";
import { LAYER_Z } from "./types";
import PixelSprite from "./PixelSprite";
import { RACCOON_GRID, RACCOON_H, RACCOON_EARS_ROWS, RACCOON_EYES_ROWS } from "./pixelSprites";
import "./RaccoonCreature.css";

interface RaccoonCreatureProps {
  spotId: string;
  layer: RaccoonLayer;
  wanderRadius: number;
  isFirstVisitSpot?: boolean;
  /** px per bitmap cell — this is what makes the hero raccoon big and the others small. */
  cell?: number;
  fleeOnScroll?: boolean;
}

export default function RaccoonCreature({
  spotId,
  layer,
  wanderRadius,
  isFirstVisitSpot,
  cell = 4,
  fleeOnScroll,
}: RaccoonCreatureProps) {
  const { rootRef, behavior, facing, bubble, walkOffset, visibility } = useRaccoonBehavior({
    spotId,
    wanderRadius,
    isFirstVisitSpot,
    fleeOnScroll,
  });

  const rowEnd =
    visibility === "hidden"
      ? 0
      : visibility === "peek_ears"
        ? RACCOON_EARS_ROWS
        : visibility === "peek_eyes"
          ? RACCOON_EYES_ROWS
          : RACCOON_H;

  return (
    <div
      ref={rootRef}
      className="raccoon-root"
      style={{ zIndex: LAYER_Z[layer], transform: `translateX(${walkOffset}px)` }}
      data-behavior={behavior}
      aria-hidden="true"
    >
      {bubble && <div className="raccoon-bubble t-mono">{bubble}</div>}

      {rowEnd > 0 && (
        <div className="raccoon-flip" style={{ "--rc-facing": facing } as CSSProperties}>
          <PixelSprite grid={RACCOON_GRID} cell={cell} rowEnd={rowEnd} className="raccoon-sprite" />
        </div>
      )}

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
