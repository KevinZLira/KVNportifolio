import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { parseAsciiArt } from "../core/parseAsciiArt";
import { resampleGrid } from "../core/resampleGrid";
import { useAsciiRenderer } from "../core/useAsciiRenderer";
import { CELL_ASPECT } from "../core/renderer";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { imageToAsciiCells } from "./luminanceToAscii";
import type { AsciiCell, AsciiGrid } from "../core/types";
import "./ascii.css";

export interface AsciiImageRevealProps {
  /** Real project image. When omitted, the tile shows a flat accent-tinted
   * placeholder and reveals straight into `fallbackArt` on hover. */
  src?: string;
  fallbackArt: string | AsciiCell[][];
  accent?: string;
  /** Externally-controlled reveal state, for touch/keyboard where there's
   * no hover — when omitted, the component drives itself off pointer
   * enter/leave. */
  active?: boolean;
  infoSlot?: ReactNode;
  className?: string;
  cols?: number;
}

const REVEAL_START = 0.1;
const REVEAL_END = 0.78;
const REVEAL_WINDOW = 0.28;
const INTERFERENCE_FRACTION = 0.4;
const INTERFERENCE_CHARS = ["#", "%", "+", "*", "/", "\\", "x", "X"];

function seededRandom(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * The Archive's signature interaction: image (or, with no real asset yet,
 * a flat placeholder) crossfades into a live ASCII representation on
 * hover, with a brief per-cell "interference" beat before each glyph
 * settles into place. Everything (raster fade, ascii materialize, info
 * panel reveal) is driven from one GSAP-tweened `progress` value, so the
 * whole sequence is a pure function of `progress` — correct at any frame
 * rate, and correct even when GSAP resolves it instantly under
 * `prefers-reduced-motion`.
 */
export default function AsciiImageReveal({
  src,
  fallbackArt,
  accent = "#80f425",
  active,
  infoSlot,
  className,
  cols = 44,
}: AsciiImageRevealProps) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const seedsRef = useRef<Float32Array | null>(null);
  const tweenState = useRef({ progress: 0 });

  const [hovered, setHovered] = useState(false);
  const [imageGrid, setImageGrid] = useState<AsciiGrid | null>(null);
  const isActive = active ?? hovered;

  const fallbackGrid = useMemo(() => parseAsciiArt(fallbackArt), [fallbackArt]);
  const grid = imageGrid ?? fallbackGrid;

  const workingCells = useMemo<AsciiCell[]>(() => grid.cells.map((c) => ({ ...c })), [grid]);

  useEffect(() => {
    const arr = new Float32Array(grid.cells.length);
    for (let i = 0; i < arr.length; i++) arr[i] = seededRandom(i);
    seedsRef.current = arr;
  }, [grid]);

  function rebuildGrid() {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const rows = Math.max(1, Math.round((cols * (rect.height / rect.width)) / CELL_ASPECT));

    if (src) {
      const img = loadedImgRef.current;
      if (!img) return;
      setImageGrid({ cols, rows, cells: imageToAsciiCells(img, { cols, rows }) });
    } else {
      setImageGrid(resampleGrid(fallbackGrid, cols, rows));
    }
  }

  useEffect(() => {
    if (!src) {
      rebuildGrid();
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      loadedImgRef.current = img;
      rebuildGrid();
    };
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function draw(progress: number) {
    const seeds = seedsRef.current;
    if (!seeds || seeds.length !== grid.cells.length) return;

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      const out = workingCells[i];
      const targetOpacity = cell.opacity ?? 1;
      if (!cell.char || cell.char === " " || targetOpacity <= 0) {
        out.char = " ";
        out.opacity = 0;
        continue;
      }

      const seed = seeds[i];
      const cellStart = REVEAL_START + seed * (REVEAL_END - REVEAL_START - REVEAL_WINDOW);
      const local = Math.max(0, Math.min(1, (progress - cellStart) / REVEAL_WINDOW));

      if (local <= 0) {
        out.char = " ";
        out.opacity = 0;
      } else if (local < INTERFERENCE_FRACTION && !reduced) {
        out.char = INTERFERENCE_CHARS[Math.floor(seed * 997) % INTERFERENCE_CHARS.length];
        out.color = cell.color;
        out.opacity = targetOpacity * 0.55 * (local / INTERFERENCE_FRACTION);
      } else {
        const settle = reduced ? 1 : (local - INTERFERENCE_FRACTION) / (1 - INTERFERENCE_FRACTION);
        out.char = cell.char;
        out.color = cell.color;
        out.opacity = targetOpacity * (0.55 + 0.45 * Math.max(0, Math.min(1, settle)));
      }
    }

    const width = renderer.sizeRef.current.width;
    if (width > 0) {
      renderer.draw({ cols: grid.cols, rows: grid.rows, cells: workingCells }, { cellPx: width / grid.cols });
    }

    if (imgRef.current) {
      imgRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.7));
      imgRef.current.style.filter = `brightness(${(1 - progress * 0.4).toFixed(2)})`;
    }
    if (infoRef.current) {
      const infoLocal = Math.max(0, Math.min(1, (progress - 0.4) / 0.6));
      infoRef.current.style.opacity = String(infoLocal);
      infoRef.current.style.transform = `translateY(${((1 - infoLocal) * 8).toFixed(1)}px)`;
    }
  }

  const renderer = useAsciiRenderer({ color: "#eef2e8", onResize: () => draw(tweenState.current.progress) });

  useEffect(() => {
    const target = isActive ? 1 : 0;
    const duration = reduced ? 0.15 : isActive ? 0.65 : 0.4;
    const tween = gsap.to(tweenState.current, {
      progress: target,
      duration,
      ease: reduced ? "none" : "power2.out",
      onUpdate: () => draw(tweenState.current.progress),
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, reduced, grid]);

  return (
    <div
      ref={rootRef}
      className={`ascii-image-reveal ${className ?? ""}`}
      style={{ "--accent": accent } as CSSProperties}
      onPointerEnter={() => active === undefined && setHovered(true)}
      onPointerLeave={() => active === undefined && setHovered(false)}
      onFocus={() => active === undefined && setHovered(true)}
      onBlur={() => active === undefined && setHovered(false)}
    >
      {src ? (
        <img ref={imgRef} src={src} alt="" className="ascii-image-reveal-img" />
      ) : (
        <div className="ascii-image-reveal-tile" />
      )}
      <canvas ref={renderer.canvasRef} className="ascii-image-reveal-canvas" />
      <div ref={infoRef} className="ascii-image-reveal-info">
        {infoSlot}
      </div>
    </div>
  );
}
