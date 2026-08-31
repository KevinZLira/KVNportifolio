import { useEffect, useMemo } from "react";
import { parseAsciiArt } from "../core/parseAsciiArt";
import { useAsciiRenderer } from "../core/useAsciiRenderer";
import { CELL_ASPECT } from "../core/renderer";
import type { AsciiCell, AsciiFit } from "../core/types";
import "./ascii.css";

export interface AsciiArtProps {
  art: string | AsciiCell[][];
  /** 'contain' shrinks/grows the whole authored piece to fit (default,
   * used for any single fixed composition). 'tile' keeps cellPx fixed and
   * lets the grid's effective size grow with the container instead. */
  fit?: AsciiFit;
  cellPx?: number;
  color?: string;
  className?: string;
}

/**
 * Purely static ASCII art: parses once, draws once, never starts a render
 * loop. The cheapest possible instance — use for any piece that should
 * just sit quietly (hero corner marks, operations micro-symbols).
 */
export default function AsciiArt({ art, fit = "contain", cellPx = 14, color, className }: AsciiArtProps) {
  const grid = useMemo(() => parseAsciiArt(art), [art]);

  function draw(size: { width: number; height: number }) {
    const resolvedCellPx =
      fit === "contain"
        ? Math.max(0.5, Math.min(size.width / grid.cols, size.height / (grid.rows * CELL_ASPECT)))
        : cellPx;
    renderer.draw(grid, { cellPx: resolvedCellPx, color });
  }

  const renderer = useAsciiRenderer({ color, onResize: draw });

  useEffect(() => {
    draw(renderer.sizeRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, fit, cellPx, color]);

  return (
    <div className={`ascii-instance ${className ?? ""}`}>
      <canvas ref={renderer.canvasRef} />
    </div>
  );
}
