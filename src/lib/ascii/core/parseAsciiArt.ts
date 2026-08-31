import type { AsciiCell, AsciiGrid } from "./types";

// Ordered lightest -> densest. Used only to auto-derive a default
// opacity for hand-authored plain-string art so a simple text-file piece
// still reads with a sense of depth without hand-annotating every glyph.
// The advanced AsciiCell[][] form (e.g. luminance-sampled image reveals)
// skips this entirely and builds cells directly.
const DENSITY_RAMP = " `.'^,:;-_~<>!i?/\\|()1{}[]tfjrxnuvczXYJUQOZmwqpdbkhao*#MW&8%B@$";

function densityOf(char: string): number {
  if (char === " " || char === "") return 0;
  const idx = DENSITY_RAMP.indexOf(char);
  if (idx === -1) return 0.6; // unlisted glyph: assume mid-to-bright
  return idx / (DENSITY_RAMP.length - 1);
}

export function densityToOpacity(density: number): number {
  return density === 0 ? 0 : 0.32 + density * 0.68;
}

/**
 * Normalizes either authoring shape into the canonical AsciiGrid the
 * renderer understands.
 *
 * - string: a plain multi-line template-string art piece. Lines are padded
 *   to a rectangle (short lines treated as space-padded). Per-cell opacity
 *   is auto-derived from glyph density via DENSITY_RAMP.
 * - AsciiCell[][]: escape hatch for programmatically generated grids that
 *   already carry their own per-cell color/opacity (e.g. image-luminance
 *   sampling in AsciiImageReveal).
 */
export function parseAsciiArt(source: string | AsciiCell[][]): AsciiGrid {
  if (Array.isArray(source)) {
    const rows = source.length;
    const cols = rows > 0 ? Math.max(...source.map((r) => r.length)) : 0;
    const cells: AsciiCell[] = [];
    for (let y = 0; y < rows; y++) {
      const row = source[y];
      for (let x = 0; x < cols; x++) {
        cells.push(row[x] ?? { char: " ", opacity: 0 });
      }
    }
    return { cols, rows, cells };
  }

  const lines = source.replace(/^\n+|\n+$/g, "").split("\n");
  const cols = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const rows = lines.length;
  const cells: AsciiCell[] = [];
  for (let y = 0; y < rows; y++) {
    const line = lines[y];
    for (let x = 0; x < cols; x++) {
      const char = line[x] ?? " ";
      cells.push({ char, opacity: densityToOpacity(densityOf(char)) });
    }
  }
  return { cols, rows, cells };
}
