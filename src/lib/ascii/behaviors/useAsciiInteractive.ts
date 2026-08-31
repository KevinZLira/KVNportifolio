import { useEffect, useRef, type RefObject } from "react";
import type { AsciiCell, AsciiGrid, AsciiModulator } from "../core/types";

export interface UseAsciiInteractiveOptions {
  /** 0..1, fraction of the container's diagonal that counts as "near". */
  radius?: number;
  mode?: "repel" | "sharpen";
  strength?: number;
}

/**
 * Cursor-proximity modulator, meant to be used on specific pieces only —
 * never applied library-wide. Tracks pointer position (normalized 0..1
 * within the container) via its own listener and returns a modulator of
 * the same shape AsciiAnimated's built-ins use, so a caller can chain it
 * after an existing animated modulator in one tick.
 */
export function useAsciiInteractive(
  containerRef: RefObject<HTMLElement | null>,
  options: UseAsciiInteractiveOptions = {},
): AsciiModulator {
  const { radius = 0.35, mode = "sharpen", strength = 1 } = options;
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      pointer.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
    function onLeave() {
      pointer.current = null;
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef]);

  const modulator = useRef<AsciiModulator>((base: AsciiGrid, out: AsciiCell[]) => {
    const p = pointer.current;
    if (!p) return;
    for (let i = 0; i < base.cells.length; i++) {
      const cell = base.cells[i];
      if (!cell.char || cell.char === " ") continue;
      const col = i % base.cols;
      const row = Math.floor(i / base.cols);
      const cx = (col + 0.5) / base.cols;
      const cy = (row + 0.5) / base.rows;
      const dist = Math.hypot(cx - p.x, cy - p.y);
      if (dist > radius) continue;
      const proximity = 1 - dist / radius;
      const baseOpacity = cell.opacity ?? 1;
      if (mode === "repel") {
        out[i].opacity = baseOpacity * (1 - proximity * 0.7 * strength);
      } else {
        out[i].opacity = Math.min(1, baseOpacity + proximity * 0.5 * strength);
      }
    }
  }).current;

  return modulator;
}
