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

export const RACCOON_W = 31;
export const RACCOON_H = 30;

// Row bands used by the "peek" crops (folder / wall) — how many rows from
// the top are needed to still read as "ears" vs "ears + eyes".
export const RACCOON_EARS_ROWS = 6;
export const RACCOON_EYES_ROWS = 12;

const raccoonShapes: Shape[] = [
  // ears — narrower + taller so tips read as pointed, not round bear ears
  ellipse(6.6, 4.2, 3.1, 4.6),
  ellipse(19.4, 4.2, 3.1, 4.6),
  ellipse(6.7, 5.3, 1.5, 2.3, "sub"),
  ellipse(19.3, 5.3, 1.5, 2.3, "sub"),

  // tail — a curved sweep of overlapping circles behind/right of the body
  ellipse(22.5, 23.5, 4.8, 4.8),
  ellipse(25.6, 18.2, 4.3, 4.3),
  ellipse(26.6, 12.3, 3.8, 4),
  ellipse(24.8, 7, 3.3, 3.5),
  // stripe gaps cut across the tail
  ellipse(23.7, 21, 5, 1.3, "sub", -58),
  ellipse(26.3, 15.4, 4.7, 1.25, "sub", -72),
  ellipse(26, 9.7, 4.3, 1.2, "sub", -84),

  // head — slightly narrower/taller oval, less round-bear
  ellipse(13, 11.8, 7.9, 7.6),

  // body
  ellipse(13, 21.5, 7.6, 7),

  // legs / feet
  rect(8.5, 26.5, 3.4, 3.6, "add"),
  rect(15.5, 26.5, 3.4, 3.6, "add"),

  // paws + held object (small screen/frame, front and center)
  ellipse(9.3, 19.5, 2.1, 2.4),
  ellipse(17, 19.5, 2.1, 2.4),
  rect(9.5, 16.8, 7.2, 6, "add"),
  rect(10.6, 17.9, 5, 3.8, "sub"),

  // belly hint (unfilled patch)
  ellipse(13, 24.3, 3, 2.2, "sub"),

  // mask band — eyes sit inside one continuous dark swath, bandit-style
  ellipse(9.5, 10.5, 2.5, 2.7, "sub"),
  ellipse(16.5, 10.5, 2.5, 2.7, "sub"),
  ellipse(9.85, 11.1, 1, 1.1),
  ellipse(16.85, 11.1, 1, 1.1),

  // pale, pointed snout under the mask, small dark nose at the tip
  ellipse(13, 14.3, 3.1, 2.6, "sub"),
  ellipse(13, 15.6, 1.15, 0.9),
];

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
