import type { AsciiCell } from "../core/types";

// Ordered sparse -> dense. Bright source pixels map to dense/bold glyphs
// at higher opacity, dark source pixels to sparse glyphs at low opacity —
// inverted from a literal photo negative so it reads as "a glowing line
// drawing emerging from the dark" against the site's near-black
// background, not an inverted photograph.
const RAMP = " .`'-:;+*#%@";

export interface LuminanceGridOptions {
  cols: number;
  rows: number;
  color?: string;
}

/**
 * Downsamples a loaded image into a cols x rows luminance grid (via
 * drawImage scaling, which does the averaging for free) and maps each
 * texel to a glyph + opacity. Callers compute this once per image and
 * cache the result — never per frame or per hover.
 */
export function imageToAsciiCells(img: HTMLImageElement, options: LuminanceGridOptions): AsciiCell[] {
  const { cols, rows, color = "#eef2e8" } = options;
  const cells: AsciiCell[] = new Array(cols * rows);

  const off = document.createElement("canvas");
  off.width = cols;
  off.height = rows;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    for (let i = 0; i < cells.length; i++) cells[i] = { char: " ", opacity: 0 };
    return cells;
  }

  ctx.drawImage(img, 0, 0, cols, rows);
  const { data } = ctx.getImageData(0, 0, cols, rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const p = (y * cols + x) * 4;
      const luma = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
      const rampIdx = Math.min(RAMP.length - 1, Math.floor(luma * RAMP.length));
      const char = RAMP[rampIdx];
      cells[y * cols + x] = {
        char,
        color,
        opacity: char === " " ? 0 : 0.25 + luma * 0.75,
      };
    }
  }
  return cells;
}
