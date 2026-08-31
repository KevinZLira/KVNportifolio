import type { AsciiModulator } from "../../core/types";

/** A soft brightness wave sweeping across the piece by column, rather than
 * physical displacement — the renderer draws cells at fixed grid
 * positions, so "wave" reads as light passing over the art, not the art
 * moving. Calm/organic rather than glitchy. */
export const wave: AsciiModulator = (base, out, t) => {
  for (let i = 0; i < base.cells.length; i++) {
    const cell = base.cells[i];
    const col = i % base.cols;
    out[i].char = cell.char;
    out[i].color = cell.color;
    const baseOpacity = cell.opacity ?? 1;
    const sweep = 0.15 * Math.sin(t * 0.5 - col * 0.25);
    out[i].opacity = Math.max(0, Math.min(1, baseOpacity + sweep * baseOpacity));
  }
};
