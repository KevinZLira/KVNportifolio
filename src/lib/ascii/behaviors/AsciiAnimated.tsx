import { useEffect, useMemo, useRef } from "react";
import { parseAsciiArt } from "../core/parseAsciiArt";
import { useAsciiRenderer } from "../core/useAsciiRenderer";
import { CELL_ASPECT } from "../core/renderer";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useAsciiInteractive, type UseAsciiInteractiveOptions } from "./useAsciiInteractive";
import { breathe } from "./modulators/breathe";
import { flicker } from "./modulators/flicker";
import { wave } from "./modulators/wave";
import type { AsciiCell, AsciiFit, AsciiGrid, AsciiModulator } from "../core/types";
import "./ascii.css";

const MODULATORS: Record<"breathe" | "flicker" | "wave", AsciiModulator> = { breathe, flicker, wave };

export interface AsciiAnimatedProps {
  art: string | AsciiCell[][];
  behavior?: "breathe" | "flicker" | "wave";
  fit?: AsciiFit;
  cellPx?: number;
  color?: string;
  className?: string;
  /** Chains a cursor-proximity modulator after `behavior` on this
   * specific instance — omit for the vast majority of usages. */
  interactive?: UseAsciiInteractiveOptions;
}

/**
 * Same authored art as AsciiArt, with a sparse, gated rAF loop layered on
 * top — collapses to the static single-draw path under reduced motion.
 * Meant to be used deliberately, not everywhere: this is the piece that
 * should feel "quietly alive," not ambient decoration running full-time.
 */
export default function AsciiAnimated({
  art,
  behavior = "breathe",
  fit = "contain",
  cellPx = 14,
  color,
  className,
  interactive,
}: AsciiAnimatedProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const base = useMemo(() => parseAsciiArt(art), [art]);
  const working = useMemo<AsciiCell[]>(() => base.cells.map((c) => ({ ...c })), [base]);
  const cellPxRef = useRef(cellPx);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  const interactiveModulator = useAsciiInteractive(containerRef, interactive ?? {});

  function paintStatic() {
    renderer.draw(base, { cellPx: cellPxRef.current, color });
  }

  const renderer = useAsciiRenderer({
    color,
    onResize: (size) => {
      cellPxRef.current =
        fit === "contain"
          ? Math.max(0.5, Math.min(size.width / base.cols, size.height / (base.rows * CELL_ASPECT)))
          : cellPx;
      paintStatic();
    },
  });

  useEffect(() => {
    if (reduced) {
      paintStatic();
      return;
    }

    const modulator = MODULATORS[behavior];
    const workingGrid: AsciiGrid = { cols: base.cols, rows: base.rows, cells: working };
    startRef.current = performance.now();

    function tick(now: number) {
      const t = (now - startRef.current) / 1000;
      modulator(base, working, t);
      if (interactive) interactiveModulator(base, working, t);
      renderer.draw(workingGrid, { cellPx: cellPxRef.current, color });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, working, behavior, reduced, color, interactive]);

  return (
    <div ref={containerRef} className={`ascii-instance ${className ?? ""}`}>
      <canvas ref={renderer.canvasRef} />
    </div>
  );
}
