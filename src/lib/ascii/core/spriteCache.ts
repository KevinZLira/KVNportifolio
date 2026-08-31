// Module-level sprite cache — the single most important perf decision in
// this library. Every (char, color, cell size) combination is rasterized
// with fillText/measureText EXACTLY ONCE, ever, into a tiny offscreen
// canvas; every draw afterwards is a cheap drawImage blit. This is the
// direct lesson learned from DataVeil.tsx, which was too slow at high
// density until it switched from per-frame fillText to pre-rendered
// sprites. No behavior in this library may call fillText inside a
// render loop — if a new one seems to need that, grow this cache's key
// space instead.

export const ASCII_FONT_FAMILY = '"Space Mono", "IBM Plex Mono", monospace';

const cache = new Map<string, HTMLCanvasElement>();

function quantize(px: number): number {
  return Math.round(px * 2) / 2;
}

function makeKey(char: string, color: string, cellW: number, cellH: number): string {
  return `${char}|${color}|${quantize(cellW)}|${quantize(cellH)}`;
}

function buildSprite(char: string, color: string, cellW: number, cellH: number): HTMLCanvasElement {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.ceil(cellW * dpr));
  const h = Math.max(1, Math.ceil(cellH * dpr));
  const sprite = document.createElement("canvas");
  sprite.width = w;
  sprite.height = h;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  ctx.font = `${Math.ceil(cellW * dpr * 1.35)}px ${ASCII_FONT_FAMILY}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, w / 2, h / 2 + h * 0.04);
  return sprite;
}

export function getSprite(char: string, color: string, cellW: number, cellH: number): HTMLCanvasElement | null {
  if (!char || char === " ") return null;
  const key = makeKey(char, color, cellW, cellH);
  let sprite = cache.get(key);
  if (!sprite) {
    sprite = buildSprite(char, color, cellW, cellH);
    cache.set(key, sprite);
  }
  return sprite;
}
