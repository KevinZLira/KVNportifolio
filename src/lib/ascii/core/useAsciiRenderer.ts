import { useCallback, useEffect, useRef } from "react";
import { renderAsciiFrame, type RenderAsciiFrameOptions } from "./renderer";
import type { AsciiGrid } from "./types";

export interface UseAsciiRendererOptions {
  color?: string;
  /** Called after the canvas is (re)sized, in logical CSS px — behaviors
   * that need to recompute cellPx for a 'contain' fit hook in here. */
  onResize?: (size: { width: number; height: number }) => void;
}

export interface AsciiRenderer {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  draw: (grid: AsciiGrid, opts: Partial<RenderAsciiFrameOptions> & { cellPx: number }) => void;
  clear: () => void;
  sizeRef: React.RefObject<{ width: number; height: number }>;
}

/**
 * Owns canvas mounting, devicePixelRatio handling and resize tracking for
 * one ASCII canvas instance. Deliberately does NOT run its own rAF loop —
 * it is agnostic to *why* a grid changes frame to frame. A purely static
 * piece (AsciiArt) calls draw() once and never again; an animated piece
 * drives its own gated rAF loop and calls draw() each tick. This keeps a
 * static instance's cost at exactly one paint, forever.
 */
export function useAsciiRenderer(options: UseAsciiRendererOptions = {}): AsciiRenderer {
  const { onResize } = options;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const isCoarse = window.matchMedia("(hover: none)").matches;
    const dprCap = isCoarse ? 1.5 : 2;

    function applySize(width: number, height: number) {
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      sizeRef.current = { width, height };
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      onResizeRef.current?.({ width, height });
    }

    const initial = parent.getBoundingClientRect();
    applySize(initial.width, initial.height);

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      applySize(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(parent);

    return () => ro.disconnect();
  }, []);

  const draw = useCallback((grid: AsciiGrid, opts: Partial<RenderAsciiFrameOptions> & { cellPx: number }) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);
    renderAsciiFrame(ctx, grid, { color: options.color, ...opts });
  }, [options.color]);

  const clear = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);
  }, []);

  return { canvasRef, draw, clear, sizeRef };
}
