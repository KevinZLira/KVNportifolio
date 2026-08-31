// Shared type vocabulary for the ASCII art library. Every behavior
// (static/animated/parallax/interactive/image-reveal) ultimately produces
// or consumes an AsciiGrid — this is the one canonical shape the renderer
// and sprite cache understand.

export interface AsciiCell {
  char: string;
  /** CSS color string. Defaults to the renderer's `color` option when omitted. */
  color?: string;
  /** 0..1. Defaults to 1. */
  opacity?: number;
}

export interface AsciiGrid {
  cols: number;
  rows: number;
  /** Row-major, length === cols * rows. */
  cells: AsciiCell[];
}

export type AsciiFit = "contain" | "tile";

/**
 * Computes one animation tick's cell values purely from the authored
 * `base` grid and elapsed time `t` (seconds), writing into the caller's
 * reusable `out` array in place. Always deriving from `base` (never from
 * the previous tick's `out`) means a modulator can never drift/accumulate
 * — the same `t` always produces the same frame, which also makes these
 * safe to drive from a GSAP progress value instead of real time.
 */
export type AsciiModulator = (base: AsciiGrid, out: AsciiCell[], t: number) => void;
