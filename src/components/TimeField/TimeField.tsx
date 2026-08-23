import { useEffect, useRef, useState } from "react";
import "./TimeField.css";

// TIME_IS_PASSING — an alternative to OBJECT_VIEWER's 3D hologram: a grid-based
// falling-sand simulation standing in for an hourglass, without ever drawing
// one. Grains spawn at the top, pile up at the bottom, and drain away once
// the pile gets too full, looping forever. The user can push, part or throw
// the pile with the pointer.

type Phase = "init" | "flowing" | "unstable" | "collapsing" | "empty";

const COMPACT_QUERY = "(max-width: 1099px)";

const CELL = 4;
const CELL_MOBILE = 6;
const MAX_PARTICLES = 2200;
const MAX_PARTICLES_MOBILE = 900;
const SPAWN_RATE = 60; // grains/sec once fully ramped
const SPAWN_RATE_MOBILE = 30;
const RAMP_MS = 5000;
const UNSTABLE_AT = 0.88; // fraction of max that trips the "unstable" warning
const UNSTABLE_MAX_MS = 2500;
const EMPTY_PAUSE_MS = 700;
const INIT_TEXT_MS = 1200;
const INIT_BINARY_MS = 700;
const INTERACT_RADIUS = 15; // grid cells
const MIN_SPEED = 40; // px/s before the pointer starts moving grains
const IDLE_AFTER_MS = 22000;

const V_NORMAL = 1;
const V_BRIGHT = 2;
const V_ZERO = 3;
const V_ONE = 4;

function pickVariant(): number {
  const r = Math.random();
  if (r < 0.04) return V_ZERO;
  if (r < 0.08) return V_ONE;
  if (r < 0.32) return V_BRIGHT;
  return V_NORMAL;
}

function pad(n: number, len: number) {
  return String(Math.max(0, Math.round(n))).padStart(len, "0");
}

function randomBinaryFlicker() {
  const group = () =>
    Array.from({ length: 3 }, () => Math.round(Math.random())).join("");
  return `${group()} ${group()} ${group()} ${group()}`;
}

const MESSAGES: Record<Phase, string> = {
  init: "INITIALIZING...",
  flowing: "TIME IS PASSING.",
  unstable: "IT WON'T STAY HERE.",
  collapsing: "TIME DOESN'T STOP.",
  empty: "WHAT'S NEXT?",
};

const STATUS: Record<Phase, string> = {
  init: "INITIALIZING",
  flowing: "FLOWING",
  unstable: "ACCUMULATING",
  collapsing: "RELEASE",
  empty: "EMPTY",
};

const IDLE_MESSAGES = ["STILL HERE?", "TIME IS STILL MOVING."];

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export default function TimeField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hud, setHud] = useState({
    phase: "init" as Phase,
    count: 0,
    cycle: 0,
    message: MESSAGES.init,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isCompact = window.matchMedia(COMPACT_QUERY).matches;
    let cell = isCompact ? CELL_MOBILE : CELL;
    let dpr = Math.min(window.devicePixelRatio, 2);
    let W = 0;
    let H = 0;
    let grid = new Uint8Array(0);

    function resize() {
      if (!container || !canvas || !ctx) return;
      isCompact = window.matchMedia(COMPACT_QUERY).matches;
      cell = isCompact ? CELL_MOBILE : CELL;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      const newDpr = Math.min(window.devicePixelRatio, 2);
      const newW = Math.max(1, Math.floor(w / cell));
      const newH = Math.max(1, Math.floor(h / cell));
      // ResizeObserver fires once right after .observe() even when nothing
      // actually changed. Assigning canvas.width/height clears its bitmap
      // as a side effect regardless of the value assigned, so touching it
      // on a no-op resize would wipe whatever was already drawn — with
      // nothing to redraw it in reduced-motion mode, which has no running
      // animation loop to repaint afterward. Skip the whole thing, grid
      // included, when nothing actually changed.
      if (newW === W && newH === H && newDpr === dpr && grid.length === newW * newH) return;
      dpr = newDpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = newW;
      H = newH;
      grid = new Uint8Array(W * H);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function maxParticles() {
      return isCompact ? MAX_PARTICLES_MOBILE : MAX_PARTICLES;
    }
    function spawnRateBase() {
      return isCompact ? SPAWN_RATE_MOBILE : SPAWN_RATE;
    }

    // ---- pointer tracking (Pointer Events unify mouse/touch/pen) ----
    let pointerX = -9999;
    let pointerY = -9999;
    let velX = 0;
    let velY = 0;
    let lastPX = 0;
    let lastPY = 0;
    let lastMoveT = performance.now();
    let pointerInside = false;
    let lastSignificantMoveT = performance.now();

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max((now - lastMoveT) / 1000, 1 / 120);
      const instVx = (x - lastPX) / dt;
      const instVy = (y - lastPY) / dt;
      velX = velX * 0.5 + instVx * 0.5;
      velY = velY * 0.5 + instVy * 0.5;
      lastPX = x;
      lastPY = y;
      lastMoveT = now;
      pointerX = x;
      pointerY = y;
      pointerInside = true;
      if (Math.hypot(instVx, instVy) > MIN_SPEED) {
        lastSignificantMoveT = now;
        idleMessageUntil = 0; // real interaction always outranks the idle flash
      }
    }
    function onPointerLeave() {
      pointerInside = false;
      velX = 0;
      velY = 0;
    }

    container.style.cursor = "crosshair";
    container.style.touchAction = "none";
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointercancel", onPointerLeave);

    // ---- simulation state ----
    let phase: Phase = "init";
    let cycle = 0;
    let phaseStartT = performance.now();
    const initStartT = phaseStartT;
    let spawnAccumulator = 0;
    let frameParity = 0;
    let lastIdleFlashT = performance.now();
    let idleMessage = "";
    let idleMessageUntil = 0;
    let lastCount = 0;

    function moveTowards(x: number, y: number, stepX: number, stepY: number, v: number, srcIdx: number) {
      let sx = stepX;
      let sy = stepY;
      while (sx !== 0 || sy !== 0) {
        const tx = x + sx;
        const ty = y + sy;
        if (tx >= 0 && tx < W && ty >= 0 && ty < H) {
          const tIdx = ty * W + tx;
          if (grid[tIdx] === 0) {
            grid[tIdx] = v;
            grid[srcIdx] = 0;
            return;
          }
        }
        if (Math.abs(sx) >= Math.abs(sy) && sx !== 0) sx += sx > 0 ? -1 : 1;
        else if (sy !== 0) sy += sy > 0 ? -1 : 1;
        else break;
      }
    }

    function stepGravity(draining: boolean): number {
      let count = 0;
      frameParity ^= 1;
      for (let y = H - 1; y >= 0; y--) {
        for (let xi = 0; xi < W; xi++) {
          const x = frameParity === 0 ? xi : W - 1 - xi;
          const idx = y * W + x;
          const v = grid[idx];
          if (v === 0) continue;
          if (y === H - 1) {
            if (draining) {
              grid[idx] = 0;
            } else {
              count++;
            }
            continue;
          }
          const belowIdx = idx + W;
          if (grid[belowIdx] === 0) {
            grid[belowIdx] = v;
            grid[idx] = 0;
            count++;
            continue;
          }
          const dir = Math.random() < 0.5 ? 1 : -1;
          const d1x = x + dir;
          const d2x = x - dir;
          if (d1x >= 0 && d1x < W && grid[belowIdx + dir] === 0) {
            grid[belowIdx + dir] = v;
            grid[idx] = 0;
            count++;
            continue;
          }
          if (d2x >= 0 && d2x < W && grid[belowIdx - dir] === 0) {
            grid[belowIdx - dir] = v;
            grid[idx] = 0;
            count++;
            continue;
          }
          count++;
        }
      }
      return count;
    }

    let sweptX = pointerX;
    let sweptY = pointerY;

    function applyImpulseAt(px: number, py: number, vx: number, vy: number) {
      const gx = Math.floor(px / cell);
      const gy = Math.floor(py / cell);
      const r = INTERACT_RADIUS;
      const vxCells = vx / 1000;
      const vyCells = vy / 1000;
      for (let oy = -r; oy <= r; oy++) {
        const cy = gy + oy;
        if (cy < 0 || cy >= H) continue;
        for (let ox = -r; ox <= r; ox++) {
          const cx = gx + ox;
          if (cx < 0 || cx >= W) continue;
          const dist = Math.hypot(ox, oy);
          if (dist > r) continue;
          const idx = cy * W + cx;
          const v = grid[idx];
          if (v === 0) continue;
          const falloff = 1 - dist / r;
          let stepX = Math.round(vxCells * falloff * 3);
          let stepY = Math.round(vyCells * falloff * 3);
          if (dist > 0.001 && falloff > 0.6) {
            stepX += Math.sign(ox);
            stepY += Math.sign(oy);
          }
          stepX = clamp(stepX, -6, 6);
          stepY = clamp(stepY, -6, 6);
          if (stepX === 0 && stepY === 0) continue;
          moveTowards(cx, cy, stepX, stepY, v, idx);
        }
      }
    }

    // A fast real swipe can cover many grid cells between two animation
    // frames — sampling only the pointer's latest position would skip right
    // over a slice of the pile without ever nudging it. Sweep a handful of
    // sub-points along the path traveled since the last frame instead, so a
    // quick flick still catches everything it crossed.
    function applyInteraction() {
      if (!pointerInside) {
        sweptX = pointerX;
        sweptY = pointerY;
        return;
      }
      const speed = Math.hypot(velX, velY);
      if (speed < MIN_SPEED) {
        sweptX = pointerX;
        sweptY = pointerY;
        return;
      }
      const dist = Math.hypot(pointerX - sweptX, pointerY - sweptY);
      const steps = clamp(Math.ceil(dist / (cell * 2)), 1, 10);
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        applyImpulseAt(sweptX + (pointerX - sweptX) * t, sweptY + (pointerY - sweptY) * t, velX, velY);
      }
      sweptX = pointerX;
      sweptY = pointerY;
    }

    function applyIdleNudge() {
      for (let i = 0; i < 6; i++) {
        const x = Math.floor(Math.random() * W);
        for (let y = 0; y < H; y++) {
          const idx = y * W + x;
          if (grid[idx] !== 0) {
            const dir = Math.random() < 0.5 ? 1 : -1;
            const tx = x + dir;
            const ty = y - 1;
            if (tx >= 0 && tx < W && ty >= 0 && grid[ty * W + tx] === 0) {
              grid[ty * W + tx] = grid[idx];
              grid[idx] = 0;
            }
            break;
          }
        }
      }
    }

    function spawnParticles(dt: number, now: number) {
      if (phase !== "flowing" && phase !== "unstable") return;
      const elapsed = now - phaseStartT;
      const ramp = Math.min(1, elapsed / RAMP_MS);
      const rate = spawnRateBase() * ramp;
      spawnAccumulator += rate * dt;
      let toSpawn = Math.floor(spawnAccumulator);
      spawnAccumulator -= toSpawn;
      toSpawn = Math.min(toSpawn, 40);
      // Concentrated near center (Irwin-Hall sum-of-uniforms ~ a soft
      // gaussian) rather than uniform across the full width — an hourglass's
      // neck funnels grains through roughly one spot, and that's what turns
      // the pile into an actual peaked mountain instead of a flat, even
      // floor spanning the whole stage.
      const spread = W * 0.16;
      for (let i = 0; i < toSpawn; i++) {
        const jitter = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
        const x = clamp(Math.round(W / 2 + jitter * spread), 0, W - 1);
        if (grid[x] === 0) grid[x] = pickVariant();
      }
    }

    function render() {
      if (!ctx || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(128, 244, 37, 0.55)";
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (grid[y * W + x] === V_NORMAL) ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
        }
      }
      ctx.fillStyle = "rgba(178, 255, 120, 0.92)";
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (grid[y * W + x] === V_BRIGHT) ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
        }
      }
      ctx.fillStyle = "rgba(205, 255, 175, 0.9)";
      ctx.font = `${Math.max(8, cell * 2.6)}px monospace`;
      ctx.textBaseline = "middle";
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const v = grid[y * W + x];
          if (v === V_ZERO || v === V_ONE) {
            ctx.fillText(v === V_ZERO ? "0" : "1", x * cell - cell * 0.7, y * cell + cell * 0.5);
          }
        }
      }
    }

    // Reduced motion gets one static settled pile instead of a running
    // loop — built synchronously by driving the same spawn/gravity used
    // for the real thing, just without an animation frame moving it.
    if (reduce) {
      phase = "flowing";
      phaseStartT = performance.now() - RAMP_MS;
      for (let i = 0; i < 400; i++) {
        spawnParticles(1 / 60, performance.now());
        stepGravity(false);
      }
      lastCount = stepGravity(false);
      setHud({ phase, count: lastCount, cycle, message: MESSAGES.flowing });
      render();
      return () => {
        ro.disconnect();
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("pointercancel", onPointerLeave);
      };
    }

    let raf = 0;
    let lastT = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastT) / 1000, 1 / 30);
      lastT = now;

      if (phase === "init") {
        if (now - initStartT > INIT_TEXT_MS + INIT_BINARY_MS) {
          phase = "flowing";
          phaseStartT = now;
        }
      }

      const draining = phase === "collapsing";
      const count = stepGravity(draining);
      lastCount = count;
      applyInteraction();
      spawnParticles(dt, now);

      // Decay here, not just on new pointer events — otherwise a single
      // fast swipe leaves velX/velY pinned at their last nonzero value and
      // keeps shoving grains long after the hand has stopped moving.
      const decay = Math.exp(-6 * dt);
      velX *= decay;
      velY *= decay;

      const max = maxParticles();
      if (phase === "flowing" && count >= max * UNSTABLE_AT) {
        phase = "unstable";
        phaseStartT = now;
      } else if (phase === "unstable" && (count >= max || now - phaseStartT > UNSTABLE_MAX_MS)) {
        phase = "collapsing";
        phaseStartT = now;
      } else if (phase === "collapsing" && count <= 4) {
        phase = "empty";
        phaseStartT = now;
      } else if (phase === "empty" && now - phaseStartT > EMPTY_PAUSE_MS) {
        phase = "flowing";
        phaseStartT = now;
        cycle += 1;
      }

      if (
        (phase === "flowing" || phase === "unstable") &&
        !pointerInside &&
        now - lastSignificantMoveT > IDLE_AFTER_MS &&
        now - lastIdleFlashT > IDLE_AFTER_MS
      ) {
        lastIdleFlashT = now;
        idleMessage = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
        idleMessageUntil = now + 2600;
        applyIdleNudge();
      }

      render();
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const hudInterval = window.setInterval(() => {
      const now = performance.now();
      let message: string;
      if (now < idleMessageUntil) {
        message = idleMessage;
      } else if (phase === "init") {
        message = now - initStartT < INIT_TEXT_MS ? MESSAGES.init : randomBinaryFlicker();
      } else if ((phase === "flowing" || phase === "unstable") && pointerInside && now - lastSignificantMoveT < 1200) {
        message = "YOU CAN MOVE IT.";
      } else {
        message = MESSAGES[phase];
      }
      setHud({ phase, count: lastCount, cycle, message });
    }, 150);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(hudInterval);
      ro.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointercancel", onPointerLeave);
    };
  }, []);

  return (
    <div className="time-field">
      <div className={`tf-stage is-${hud.phase}`}>
        <div className="tf-field" aria-hidden="true" />

        <div ref={containerRef} className="tf-canvas-wrap">
          <canvas ref={canvasRef} className="tf-canvas" />
        </div>

        <span className="tf-corner tf-corner-bl" aria-hidden="true" />
        <span className="tf-corner tf-corner-br" aria-hidden="true" />

        <div className="tf-hud tf-hud-bottom t-mono">
          <span className="tf-hud-label">/ TIME_FIELD</span>
          <span>STATUS: {STATUS[hud.phase]}</span>
          <span>CYCLE: {pad(hud.cycle, 2)}</span>
          <span className="tf-hud-count">PARTICLES: {pad(hud.count, 4)}</span>
          <span className="tf-message">[ {hud.message} ]</span>
        </div>
      </div>
    </div>
  );
}
