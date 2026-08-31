import type { AsciiGrid } from "./types";

/**
 * Nearest-neighbor resample of an AsciiGrid to a different cols x rows —
 * lets any authored piece (arbitrary dimensions) be redrawn to match a
 * container's aspect ratio, the same way an image gets downsampled for
 * the luminance path. Cheap: only ever called on resize/art-change, never
 * per frame.
 */
export function resampleGrid(grid: AsciiGrid, cols: number, rows: number): AsciiGrid {
  if (grid.cols === cols && grid.rows === rows) return grid;
  const cells = new Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    const sy = Math.min(grid.rows - 1, Math.floor((y / rows) * grid.rows));
    for (let x = 0; x < cols; x++) {
      const sx = Math.min(grid.cols - 1, Math.floor((x / cols) * grid.cols));
      cells[y * cols + x] = grid.cells[sy * grid.cols + sx];
    }
  }
  return { cols, rows, cells };
}
