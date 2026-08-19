// Procedural pixel-bitmap raccoon — no images. Shapes are painted onto a
// coarse grid (like a Tamagotchi's dot-matrix LCD) by testing each cell's
// center against a small stack of ellipses/rects, later shapes winning on
// overlap. Tune the shapes, not hand-typed ASCII grids — far less fragile.

interface Ellipse {
  kind: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  op: "add" | "sub";
  rot?: number;
}

interface Rect {
  kind: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  op: "add" | "sub";
  rot?: number;
}

type Shape = Ellipse | Rect;

function ellipse(cx: number, cy: number, rx: number, ry: number, op: "add" | "sub" = "add", rot = 0): Ellipse {
  return { kind: "ellipse", cx, cy, rx, ry, op, rot };
}

function rect(x: number, y: number, w: number, h: number, op: "add" | "sub" = "add", rot = 0): Rect {
  return { kind: "rect", x, y, w, h, op, rot };
}

function paint(px: number, py: number, s: Shape): boolean {
  if (s.kind === "ellipse") {
    let dx = px - s.cx;
    let dy = py - s.cy;
    if (s.rot) {
      const rad = (-s.rot * Math.PI) / 180;
      const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
      const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
      dx = rx;
      dy = ry;
    }
    return (dx * dx) / (s.rx * s.rx) + (dy * dy) / (s.ry * s.ry) <= 1;
  }
  let dx = px - (s.x + s.w / 2);
  let dy = py - (s.y + s.h / 2);
  if (s.rot) {
    const rad = (-s.rot * Math.PI) / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
    dx = rx;
    dy = ry;
  }
  return Math.abs(dx) <= s.w / 2 && Math.abs(dy) <= s.h / 2;
}

function scaleShape(s: Shape, k: number): Shape {
  if (s.kind === "ellipse") {
    return { ...s, cx: s.cx * k, cy: s.cy * k, rx: s.rx * k, ry: s.ry * k };
  }
  return { ...s, x: s.x * k, y: s.y * k, w: s.w * k, h: s.h * k };
}

function rasterize(w: number, h: number, shapes: Shape[]): boolean[][] {
  const grid: boolean[][] = Array.from({ length: h }, () => Array(w).fill(false));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      let on = false;
      for (const s of shapes) {
        if (paint(px, py, s)) on = s.op === "add";
      }
      grid[y][x] = on;
    }
  }
  return grid;
}

// Authored at a small "unit" scale, then rasterized onto a finer grid —
// more cells per curve makes the ellipses read as round instead of
// blocky, without hand-editing every coordinate.
const RACCOON_SCALE = 1.35;
export const RACCOON_W = 45;
export const RACCOON_H = 41;

// Row bands used by the "peek" crops (folder / wall) — how many rows from
// the top are needed to still read as "ears" vs "ears + eyes".
export const RACCOON_EARS_ROWS = 8;
export const RACCOON_EYES_ROWS = 16;

const rawRaccoonShapes: Shape[] = [
  // ears — attached higher on a bigger head, chibi proportions
  ellipse(6.8, 3.6, 3.3, 4.3),
  ellipse(20.2, 3.6, 3.3, 4.3),
  ellipse(6.9, 4.7, 1.5, 2, "sub"),
  ellipse(20.1, 4.7, 1.5, 2, "sub"),

  // tail — bigger, thicker sweep
  ellipse(23, 23.5, 5.2, 5.2),
  ellipse(26.3, 18, 4.6, 4.6),
  ellipse(27.3, 12, 4.1, 4.3),
  ellipse(25.3, 6.5, 3.6, 3.8),
  // stripe gaps cut across the tail
  ellipse(24.2, 21, 5.6, 1.4, "sub", -58),
  ellipse(27, 15.2, 5.2, 1.35, "sub", -72),
  ellipse(26.8, 9.3, 4.7, 1.3, "sub", -84),

  // head — large, round, chibi
  ellipse(13.5, 12, 8.6, 8.3),

  // body — small under the big head
  ellipse(13.5, 21.8, 6.6, 5.8),

  // legs / feet
  rect(9.5, 26.6, 3.2, 3.2, "add"),
  rect(15.3, 26.6, 3.2, 3.2, "add"),

  // paws + held object (small screen/frame, front and center)
  ellipse(9.8, 19.8, 2, 2.2),
  ellipse(17.2, 19.8, 2, 2.2),
  rect(10, 17.2, 7, 5.6, "add"),
  rect(11, 18.2, 5, 3.6, "sub"),

  // belly hint (unfilled patch)
  ellipse(13.5, 24, 2.6, 2, "sub"),

  // mask band — two round eye-holes bridged by a thin connecting cut,
  // reading as one continuous visor/mask instead of two separate patches
  ellipse(9.6, 10.6, 2.4, 2.6, "sub"),
  ellipse(17.4, 10.6, 2.4, 2.6, "sub"),
  rect(11.6, 9.5, 4, 2.1, "sub"),
  ellipse(9.95, 11.2, 0.98, 1.08),
  ellipse(17.05, 11.2, 0.98, 1.08),

  // pale, pointed snout under the mask, small dark nose at the tip
  ellipse(13.5, 14.8, 3.3, 2.7, "sub"),
  ellipse(13.5, 16.1, 1.2, 0.95),
];

const raccoonShapes: Shape[] = rawRaccoonShapes.map((s) => scaleShape(s, RACCOON_SCALE));

export const RACCOON_GRID: boolean[][] = rasterize(RACCOON_W, RACCOON_H, raccoonShapes);

// --- trash can (small standalone icon, contact section) ---
export const CAN_W = 14;
export const CAN_H = 16;

const canShapes: Shape[] = [
  rect(1, 0, 12, 2, "add"), // lid
  rect(3.5, -1.6, 7, 2, "add"), // lid handle
  rect(2, 2.2, 10, 12.5, "add"), // body
  rect(2.6, 2.8, 8.8, 11.3, "sub"), // hollow it out
  rect(4.4, 4.5, 1.1, 8, "add"), // rib lines
  rect(6.9, 4.5, 1.1, 8, "add"),
  rect(9.4, 4.5, 1.1, 8, "add"),
];

export const CAN_GRID: boolean[][] = rasterize(CAN_W, CAN_H, canShapes);

// --- folder icon (work database section) ---
export const FOLDER_W = 22;
export const FOLDER_H = 16;

const folderShapes: Shape[] = [
  rect(0, 3, 9, 2.4, "add"),
  rect(0, 4.6, 22, 11, "add"),
  rect(1, 6.4, 20, 8.6, "sub"),
];

export const FOLDER_GRID: boolean[][] = rasterize(FOLDER_W, FOLDER_H, folderShapes);
