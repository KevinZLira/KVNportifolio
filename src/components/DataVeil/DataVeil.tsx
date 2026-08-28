import { useEffect, useRef } from "react";
import "./DataVeil.css";

// DATA_VEIL — a background that looks like a plain dark surface until the
// cursor passes over it. Underneath, a full field of Matrix-style code rain
// is always falling; a second canvas stacked on top stays opaque everywhere
// except a soft, slightly irregular hole punched out around the pointer,
// which heals itself shut a moment after the pointer moves on. Two canvases,
// not one, so the rain layer never has to know anything about the cursor.

const CHAR_POOL = "01010101" + "0123456789" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "$%#@&*+=<>/\\?!";
const UNIQUE_CHARS = Array.from(new Set(CHAR_POOL.split("")));

function randomChar() {
  return CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];
}

const CELL = 17; // px per character row/column
const BASE_SPEED = 120; // px/sec at speedScale = 1
const BUCKET_COUNT = 8; // discrete brightness steps along a stream's trail

// fillText is expensive per call, and re-setting fillStyle for every single
// character (each one a different point along its trail's fade) makes it
// worse. Both go away by pre-rendering every (char, brightness-bucket) pair
// once into a tiny offscreen canvas, then blitting those sprites with
// drawImage — a cheap bitmap copy — for every character on every frame.
function buildSprites(): Map<string, HTMLCanvasElement> {
  const cache = new Map<string, HTMLCanvasElement>();
  for (let b = 0; b < BUCKET_COUNT; b++) {
    const color = mixColor(b / (BUCKET_COUNT - 1));
    for (const ch of UNIQUE_CHARS) {
      const off = document.createElement("canvas");
      off.width = CELL;
      off.height = CELL;
      const octx = off.getContext("2d")!;
      octx.font = `${CELL - 2}px var(--font-mono, monospace)`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = color;
      octx.fillText(ch, CELL / 2, CELL / 2);
      cache.set(`${ch}|${b}`, off);
    }
  }
  return cache;
}

interface ColumnMeta {
  x: number;
  speedScale: number;
  spawnInterval: number;
  nextSpawn: number;
}

interface Stream {
  x: number;
  headY: number;
  speed: number;
  length: number;
  chars: string[];
}

function mixColor(t: number): string {
  // t: 0 at the falling head (brightest) -> 1 at the trailing end (darkest).
  // Only the very top of the fade sits near the bright site-accent green;
  // most of the trail lives in dim/medium green so the effect reads as
  // "sophisticated dark code," not a neon wash.
  const HEAD = [198, 255, 214, 0.95];
  const MID = [64, 190, 104, 0.5];
  const TAIL = [16, 58, 30, 0.14];
  let a = HEAD;
  let b = MID;
  let localT = t / 0.18;
  if (t >= 0.18) {
    a = MID;
    b = TAIL;
    localT = (t - 0.18) / 0.82;
  }
  const r = a[0] + (b[0] - a[0]) * localT;
  const g = a[1] + (b[1] - a[1]) * localT;
  const bch = a[2] + (b[2] - a[2]) * localT;
  const al = a[3] + (b[3] - a[3]) * localT;
  return `rgba(${r | 0}, ${g | 0}, ${bch | 0}, ${al.toFixed(3)})`;
}

export default function DataVeil() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dataCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dataCanvas = dataCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!root || !dataCanvas || !maskCanvas) return;
    const dataCtx = dataCanvas.getContext("2d");
    const maskCtx = maskCanvas.getContext("2d");
    if (!dataCtx || !maskCtx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(hover: none)").matches;
    const intervalScale = isCoarse ? 1.6 : 1;

    const sprites = buildSprites();
    let dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    let clock = 0;
    let colMeta: ColumnMeta[] = [];
    let streams: Stream[] = [];
    const MAX_STREAMS = 200;

    function spawnStream(col: ColumnMeta, initial: boolean): Stream {
      const length = 5 + Math.random() * 9;
      const headY = initial
        ? Math.random() * (h + length * CELL) - length * CELL
        : -length * CELL - Math.random() * h * 0.6;
      return {
        x: col.x,
        headY,
        speed: BASE_SPEED * col.speedScale * (0.85 + Math.random() * 0.3),
        length,
        chars: Array.from({ length: Math.ceil(length) }, randomChar),
      };
    }

    function makeColumns() {
      const count = Math.ceil(w / CELL) + 1;
      colMeta = Array.from({ length: count }, (_, i) => {
        const roll = Math.random();
        // a persistent per-column trait: some columns stay dense (frequent
        // overlapping streams), most sit medium, a few stay sparse/spaced out
        const [lo, hi] = roll < 0.25 ? [0.9, 1.8] : roll < 0.7 ? [2.0, 3.4] : [3.6, 6.2];
        return {
          x: i * CELL + CELL / 2,
          speedScale: 0.5 + Math.random(),
          spawnInterval: (lo + Math.random() * (hi - lo)) * intervalScale,
          nextSpawn: reduce ? Infinity : 0,
        };
      });
      streams = colMeta.map((col) => spawnStream(col, true));
    }

    function resize() {
      if (!root) return;
      w = root.clientWidth;
      h = root.clientHeight;
      if (w === 0 || h === 0) return;
      dpr = Math.min(window.devicePixelRatio, 2);
      for (const c of [dataCanvas, maskCanvas]) {
        c!.width = Math.round(w * dpr);
        c!.height = Math.round(h * dpr);
        c!.style.width = `${w}px`;
        c!.style.height = `${h}px`;
      }
      dataCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskCtx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeColumns();
      // start the mask fully opaque
      maskCtx!.globalCompositeOperation = "source-over";
      maskCtx!.fillStyle = "#0d0e0c";
      maskCtx!.fillRect(0, 0, w, h);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    // ---- pointer tracking — no trail: reveal only exists exactly where
    // the pointer currently is, not where it recently was ----
    let targetX = w / 2;
    let targetY = h / 2;
    let active = false;

    function setTarget(clientX: number, clientY: number) {
      const rect = root!.getBoundingClientRect();
      targetX = clientX - rect.left;
      targetY = clientY - rect.top;
      active = true;
    }
    function onPointerMove(e: PointerEvent) {
      setTarget(e.clientX, e.clientY);
    }
    function onPointerLeave() {
      active = false;
    }

    // The pendant's stage sits on top of this layer and covers the whole
    // section (it needs to, for 3D hover/drag hit-testing), so it — not
    // this div — is what the pointer actually hits. Listening on the
    // parent instead relies on normal event bubbling: the pointer event
    // still fires on whatever's on top, then bubbles up past this sibling
    // to their shared ancestor, which we can hear from.
    const listenTarget = root.parentElement ?? root;
    listenTarget.addEventListener("pointermove", onPointerMove);
    listenTarget.addEventListener("pointerleave", onPointerLeave);
    listenTarget.addEventListener("pointercancel", onPointerLeave);

    let raf = 0;
    let lastT = performance.now();
    const BRUSH_RADIUS = 46; // ~ the "20px diameter" ask read as too small once tried live; this is the size that actually reads as a reveal, not a pinprick

    function drawData(dt: number) {
      if (!reduce) {
        clock += dt;
        for (const col of colMeta) {
          if (clock >= col.nextSpawn && streams.length < MAX_STREAMS) {
            streams.push(spawnStream(col, false));
            col.nextSpawn = clock + col.spawnInterval * (0.7 + Math.random() * 0.6);
          }
        }
        for (const s of streams) {
          s.headY += s.speed * dt;
          if (Math.random() < 0.02) {
            const idx = Math.floor(Math.random() * s.chars.length);
            s.chars[idx] = randomChar();
          }
        }
        streams = streams.filter((s) => s.headY - (s.length - 1) * CELL <= h + CELL);
      }

      dataCtx!.clearRect(0, 0, w, h);
      dataCtx!.fillStyle = "#0d0e0c";
      dataCtx!.fillRect(0, 0, w, h);
      const half = CELL / 2;
      for (const s of streams) {
        const denom = s.length - 1 || 1;
        for (let j = 0; j < s.chars.length; j++) {
          const y = s.headY - j * CELL;
          if (y < -CELL || y > h + CELL) continue;
          const bucket = Math.min(BUCKET_COUNT - 1, Math.floor((j / denom) * BUCKET_COUNT));
          const sprite = sprites.get(`${s.chars[j]}|${bucket}`);
          if (sprite) dataCtx!.drawImage(sprite, s.x - half, y - half);
        }
      }
    }

    function healAndReveal(now: number) {
      // Fully re-solidify every frame — no persistence, no fade-out, no
      // trail. The reveal exists only for the frame(s) where the pointer
      // is actually there; move it on and the hole is gone immediately.
      maskCtx!.globalCompositeOperation = "source-over";
      maskCtx!.fillStyle = "#0d0e0c";
      maskCtx!.fillRect(0, 0, w, h);

      if (!active) return;

      // ...then punch an organic (non-circular) hole at the live pointer
      maskCtx!.globalCompositeOperation = "destination-out";
      const wobble = now * 0.002;
      const lobes = 4;
      for (let i = 0; i < lobes; i++) {
        const angle = (i / lobes) * Math.PI * 2 + wobble;
        const jitter = Math.sin(wobble * 1.7 + i * 2.1) * 0.35 + 0.65;
        const r = BRUSH_RADIUS * jitter;
        const ox = targetX + Math.cos(angle) * BRUSH_RADIUS * 0.32;
        const oy = targetY + Math.sin(angle) * BRUSH_RADIUS * 0.32;
        const grad = maskCtx!.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, "rgba(0,0,0,0.85)");
        grad.addColorStop(0.7, "rgba(0,0,0,0.4)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        maskCtx!.fillStyle = grad;
        maskCtx!.beginPath();
        maskCtx!.arc(ox, oy, r, 0, Math.PI * 2);
        maskCtx!.fill();
      }
    }

    function tick(now: number) {
      const dt = Math.min((now - lastT) / 1000, 1 / 20);
      lastT = now;
      drawData(dt);
      healAndReveal(now);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      listenTarget.removeEventListener("pointermove", onPointerMove);
      listenTarget.removeEventListener("pointerleave", onPointerLeave);
      listenTarget.removeEventListener("pointercancel", onPointerLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="data-veil" aria-hidden="true">
      <canvas ref={dataCanvasRef} className="data-veil-layer" />
      <canvas ref={maskCanvasRef} className="data-veil-layer" />
    </div>
  );
}
