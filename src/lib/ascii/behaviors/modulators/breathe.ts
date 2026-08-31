import type { AsciiModulator } from "../../core/types";

/** Whole-piece slow opacity envelope — "arte respirando lentamente".
 * Every cell oscillates together around its authored base opacity. */
export const breathe: AsciiModulator = (base, out, t) => {
  const envelope = 0.82 + 0.18 * Math.sin(t * 0.35);
  for (let i = 0; i < base.cells.length; i++) {
    const cell = base.cells[i];
    out[i].char = cell.char;
    out[i].color = cell.color;
    out[i].opacity = (cell.opacity ?? 1) * envelope;
  }
};
