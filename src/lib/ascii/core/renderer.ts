import { getSprite } from "./spriteCache";
import type { AsciiGrid } from "./types";

// Row height relative to column width — monospace glyphs read better with
// a little vertical breathing room than a literally square cell.
export const CELL_ASPECT = 1.15;

const OPACITY_BUCKETS = 8;

export interface RenderAsciiFrameOptions {
  /** Column width in CSS px. Row height is derived via CELL_ASPECT. */
  cellPx: number;
  originX?: number;
  originY?: number;
  /** Fallback color for cells that don't carry their own. */
  color?: string;
  /** Multiplies every cell's own opacity — the one knob callers animate
   * (GSAP progress tweens, fade-ins) without touching per-cell data. */
  globalAlpha?: number;
}

/**
 * Pure draw call: no state, no time, no pointer awareness. Everything
 * about *why* a grid looks the way it does happens before this is called
 * — a behavior component/hook produces the AsciiGrid for this frame, this
 * function just paints it.
 *
 * Cells are bucketed by quantized opacity so ctx.globalAlpha is set once
 * per bucket rather than once per glyph (the DataVeil "one alpha set per
 * layer, not per character" trick) — keeps a few thousand cells cheap.
 */
export function renderAsciiFrame(
  ctx: CanvasRenderingContext2D,
  grid: AsciiGrid,
  options: RenderAsciiFrameOptions,
) {
  const { cellPx, originX = 0, originY = 0, color = "#eef2e8", globalAlpha = 1 } = options;
  if (globalAlpha <= 0 || cellPx <= 0) return;
  const cellH = cellPx * CELL_ASPECT;

  const buckets: number[][] = Array.from({ length: OPACITY_BUCKETS + 1 }, () => []);
  for (let i = 0; i < grid.cells.length; i++) {
    const cell = grid.cells[i];
    if (!cell.char || cell.char === " ") continue;
    const opacity = cell.opacity ?? 1;
    if (opacity <= 0) continue;
    const bucket = Math.round(Math.min(1, opacity) * OPACITY_BUCKETS);
    buckets[bucket].push(i);
  }

  for (let b = 0; b <= OPACITY_BUCKETS; b++) {
    const indices = buckets[b];
    if (indices.length === 0) continue;
    ctx.globalAlpha = (b / OPACITY_BUCKETS) * globalAlpha;
    for (const i of indices) {
      const cell = grid.cells[i];
      const col = i % grid.cols;
      const row = Math.floor(i / grid.cols);
      const sprite = getSprite(cell.char, cell.color ?? color, cellPx, cellH);
      if (!sprite) continue;
      ctx.drawImage(sprite, originX + col * cellPx, originY + row * cellH, cellPx, cellH);
    }
  }
  ctx.globalAlpha = 1;
}
