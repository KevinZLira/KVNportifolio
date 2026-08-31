import type { AsciiModulator } from "../../core/types";

const FLICKER_CHARS = [".", ":", "'", "`", ","];

function hash(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Sparse, slow flicker — a small rotating subset of cells dim or briefly
 * swap glyph, each on its own offset cycle. Deliberately NOT "everything
 * trembling"; only ~4% of cells are ever eligible. */
export const flicker: AsciiModulator = (base, out, t) => {
  for (let i = 0; i < base.cells.length; i++) {
    const cell = base.cells[i];
    out[i].char = cell.char;
    out[i].color = cell.color;
    out[i].opacity = cell.opacity ?? 1;
    if (!cell.char || cell.char === " ") continue;

    const seed = hash(i);
    if (seed > 0.04) continue;

    const phase = Math.sin(t * 1.6 + seed * 1000);
    if (phase > 0.85) {
      out[i].opacity = (cell.opacity ?? 1) * 0.25;
    } else if (phase > 0.7) {
      out[i].char = FLICKER_CHARS[Math.floor(seed * 997) % FLICKER_CHARS.length];
    }
  }
};
