import { useEffect, useMemo, useRef, type RefObject } from "react";
import { parseAsciiArt } from "../core/parseAsciiArt";
import { useAsciiRenderer } from "../core/useAsciiRenderer";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { breathe } from "./modulators/breathe";
import { flicker } from "./modulators/flicker";
import { wave } from "./modulators/wave";
import type { AsciiCell, AsciiGrid, AsciiModulator } from "../core/types";
import "./ascii.css";

const MODULATORS: Record<"breathe" | "flicker" | "wave", AsciiModulator> = { breathe, flicker, wave };

export interface AsciiParallaxLayer {
  art: string | AsciiCell[][];
  /** Relative depth: 0 = fixed, 1 = full parallax range. */
  depth: number;
  cellPx?: number;
  color?: string;
  opacity?: number;
  animated?: "breathe" | "flicker" | "wave";
}

export interface AsciiParallaxFieldProps {
  layers: AsciiParallaxLayer[];
  maxOffsetPx?: number;
  className?: string;
}

function ParallaxLayer({
  layer,
  maxOffsetPx,
  pointerRef,
  disabled,
}: {
  layer: AsciiParallaxLayer;
  maxOffsetPx: number;
  pointerRef: RefObject<{ x: number; y: number }>;
  disabled: boolean;
}) {
  const base = useMemo(() => parseAsciiArt(layer.art), [layer.art]);
  const working = useMemo<AsciiCell[]>(() => base.cells.map((c) => ({ ...c })), [base]);
  const cellPxRef = useRef(layer.cellPx ?? 16);
  const offset = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const startRef = useRef(0);

  function paint() {
    renderer.draw(base, { cellPx: cellPxRef.current, color: layer.color, globalAlpha: layer.opacity ?? 1 });
  }

  const renderer = useAsciiRenderer({ color: layer.color, onResize: paint });

  useEffect(() => {
    const el = renderer.canvasRef.current;
    startRef.current = performance.now();
    const modulator = layer.animated ? MODULATORS[layer.animated] : null;
    const workingGrid: AsciiGrid = { cols: base.cols, rows: base.rows, cells: working };

    function tick(now: number) {
      if (!disabled && el) {
        const p = pointerRef.current;
        const targetX = p.x * maxOffsetPx * layer.depth;
        const targetY = p.y * maxOffsetPx * layer.depth;
        offset.current.x += (targetX - offset.current.x) * 0.08;
        offset.current.y += (targetY - offset.current.y) * 0.08;
        el.style.transform = `translate3d(${offset.current.x.toFixed(2)}px, ${offset.current.y.toFixed(2)}px, 0)`;
      }

      if (modulator) {
        const t = (now - startRef.current) / 1000;
        modulator(base, working, t);
        renderer.draw(workingGrid, {
          cellPx: cellPxRef.current,
          color: layer.color,
          globalAlpha: layer.opacity ?? 1,
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    if (disabled && !modulator) {
      paint();
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, working, layer.animated, layer.depth, disabled]);

  return (
    <div className="ascii-parallax-layer">
      <canvas ref={renderer.canvasRef} />
    </div>
  );
}

/**
 * Stacks N independently-rendered ASCII canvases and moves each via a
 * shared, lerped pointer signal scaled by its own `depth`. Parallax offset
 * is applied as a `transform` on each canvas ELEMENT, never on the canvas
 * bitmap or any layout property — this is what lets a layer be
 * simultaneously animated (bitmap-internal rAF) and parallaxed (element
 * transform) without the two ever conflicting. Disabled outright under
 * reduced motion and on coarse pointers (no hover to drive it from) — in
 * both cases each layer's own animated modulator also pauses to a single
 * static paint, as an extra mobile perf margin.
 */
export default function AsciiParallaxField({ layers, maxOffsetPx = 24, className }: AsciiParallaxFieldProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const isCoarse = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  const disabled = reduced || isCoarse;

  useEffect(() => {
    if (disabled) return;
    const root = rootRef.current;
    if (!root) return;
    function onMove(e: PointerEvent) {
      const rect = root!.getBoundingClientRect();
      pointerRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    }
    root.addEventListener("pointermove", onMove);
    return () => root.removeEventListener("pointermove", onMove);
  }, [disabled]);

  return (
    <div ref={rootRef} className={`ascii-parallax-field ${className ?? ""}`}>
      {layers.map((layer, i) => (
        <ParallaxLayer key={i} layer={layer} maxOffsetPx={maxOffsetPx} pointerRef={pointerRef} disabled={disabled} />
      ))}
    </div>
  );
}
