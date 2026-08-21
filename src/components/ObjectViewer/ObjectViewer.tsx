import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OBJECTS, type ViewerObject } from "./objects";
import "./ObjectViewer.css";

const PRIMARY = 0x80f425;
const ACCENT = 0xff2ec4;

function loadObj(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    new OBJLoader().load(url, resolve, undefined, reject);
  });
}

function fitAndCenter(object: THREE.Group, targetSize: number) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;

  // Bake the centering offset into the geometry itself (not object.position)
  // so it survives any rotation applied to the object afterward — position
  // is applied *after* rotation in the local transform, so a position-based
  // offset computed for the unrotated object would land in the wrong place
  // once the object is rotated. Applies to LineSegments too, not just
  // Mesh — a sub-object OBJLoader couldn't triangulate falls back to a
  // LineSegments (see applyHologram) and needs the same recentering or it
  // stays at its original, now-mismatched local coordinates.
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
      child.geometry.translate(-center.x, -center.y, -center.z);
    }
  });
  object.scale.setScalar(scale);

  return { size: size.multiplyScalar(scale), scale };
}

// Desktop-only for now — skip mounting the WebGL scene below this width
// rather than just hiding it with CSS, on both tablet and mobile.
const COMPACT_QUERY = "(max-width: 1099px)";

function pad3(n: number) {
  return String(Math.abs(Math.round(n)) % 1000).padStart(3, "0");
}

function toDeg(rad: number) {
  const deg = (rad * 180) / Math.PI;
  return ((deg % 360) + 360) % 360;
}

interface ObjectViewerProps {
  objects?: ViewerObject[];
}

export default function ObjectViewer({ objects = OBJECTS }: ObjectViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isCompact = useRef(
    typeof window !== "undefined" && window.matchMedia(COMPACT_QUERY).matches,
  ).current;

  const [index, setIndex] = useState(0);
  const object = objects[index];

  // Glitch out, swap the object once it's fully off-screen, then glitch the
  // new one in. Timings match the CSS animation durations below.
  const [glitch, setGlitch] = useState<"out" | "in" | null>(null);
  const glitchTimers = useRef<number[]>([]);
  useEffect(() => {
    return () => glitchTimers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  function switchTo(next: (i: number) => number) {
    if (glitch) return;
    setGlitch("out");
    const outTimer = window.setTimeout(() => {
      setIndex(next);
      setGlitch("in");
      const inTimer = window.setTimeout(() => setGlitch(null), 340);
      glitchTimers.current.push(inTimer);
    }, 220);
    glitchTimers.current.push(outTimer);
  }

  const goPrev = () => switchTo((i) => (i - 1 + objects.length) % objects.length);
  const goNext = () => switchTo((i) => (i + 1) % objects.length);

  const [phase, setPhase] = useState<"boot" | "idle">("boot");
  const [readout, setReadout] = useState({ rotX: 0, rotY: 0 });
  const liveRef = useRef({ rotX: 0, rotY: 0 });

  // Boot log plays on mount and again on every object switch, then the HUD
  // settles into the live metadata/readout state for that object.
  useEffect(() => {
    if (isCompact) return;
    setPhase("boot");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setPhase("idle"), reduce ? 0 : 1600);
    return () => window.clearTimeout(timer);
  }, [isCompact, object]);

  // Low-frequency poll of the live rotation ref (written every frame inside
  // the render loop below) so the HUD readout updates without forcing a
  // React re-render on every animation frame.
  useEffect(() => {
    if (isCompact) return;
    const id = window.setInterval(() => {
      setReadout({
        rotX: toDeg(liveRef.current.rotX),
        rotY: toDeg(liveRef.current.rotY),
      });
    }, 180);
    return () => window.clearInterval(id);
  }, [isCompact]);

  useEffect(() => {
    if (isCompact) return;
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const disposables: { geometry?: THREE.BufferGeometry; material?: THREE.Material }[] = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2, 3, 2);
    scene.add(key);

    const rim1 = new THREE.PointLight(PRIMARY, 6, 8);
    rim1.position.set(-2, 0.5, -1.5);
    scene.add(rim1);

    const rim2 = new THREE.PointLight(ACCENT, 5, 8);
    rim2.position.set(2, -0.5, -1.5);
    scene.add(rim2);

    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    // One shared factory for every line/edge in the model — solids' edge
    // overlay and any stray fallback lines alike — so they're guaranteed
    // to be pixel-identical instead of independently-tuned materials that
    // can drift apart. No additive blending: that mode's brightness stacks
    // with how many lines happen to overlap on screen, which is exactly
    // what made some sub-objects read as a different shade than others.
    function makeLineMaterial() {
      return new THREE.LineBasicMaterial({
        color: PRIMARY,
        transparent: true,
        opacity: 1,
      });
    }

    function applyHologram(mesh: THREE.Group) {
      // Collect first, mutate after — some .obj exports contain a
      // non-triangulated n-gon sub-object that OBJLoader can't build into a
      // proper Mesh; it falls back to a bare LineSegments (default white)
      // instead. Restyle those too so a bad sub-object reads as matching
      // green wireframe, rather than silently leaving the loader's
      // default material in place.
      const solids: THREE.Mesh[] = [];
      const strayLines: THREE.LineSegments[] = [];
      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          solids.push(child);
        } else if (child instanceof THREE.LineSegments && child.parent === mesh) {
          strayLines.push(child);
        }
      });

      solids.forEach((child) => {
        const material = new THREE.MeshStandardMaterial({
          color: 0x0a2e08,
          emissive: PRIMARY,
          emissiveIntensity: 0.7,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
          depthWrite: false,
          metalness: 0.1,
          roughness: 0.4,
        });
        child.material = material;
        disposables.push({ geometry: child.geometry, material });

        const wireGeo = new THREE.EdgesGeometry(child.geometry, 25);
        const wireMat = makeLineMaterial();
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        child.add(wire);
        disposables.push({ geometry: wireGeo, material: wireMat });
      });

      strayLines.forEach((line) => {
        const material = makeLineMaterial();
        line.material = material;
        disposables.push({ material });
        // nudge down — this sub-object's own authored origin doesn't
        // line up with the rest of the model even after the shared
        // bounding-box recenter above
        line.geometry.translate(0, -0.18, 0);
      });
    }

    async function build() {
      const mesh = await loadObj(object.modelUrl);
      if (disposed) return;

      fitAndCenter(mesh, object.targetSize);
      applyHologram(mesh);
      // each model has its own authored resting orientation — its bounding
      // box after fitAndCenter is centered on the object's local origin, so
      // rotating in place here keeps it centered
      mesh.rotation.x = object.standRotationX ?? 0;
      objectGroup.add(mesh);
      // start at a 3/4 angle instead of face-on — face-on reads as an
      // oversized close-up (and is the only frame reduced-motion users see)
      objectGroup.rotation.y = 0.7;
    }

    build().catch((err) => console.error("Failed to load 3D model", err));

    function resize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Drag-to-rotate with inertia — while held, rotation tracks the pointer
    // directly; on release the last drag speed carries on and decays, then
    // blends back into the idle auto-spin once it's slow enough to not read
    // as a jump.
    const DRAG_SENSITIVITY = 0.012;
    const INERTIA_DECAY = 1.8;
    const INERTIA_EPSILON = 0.05;
    const AUTO_SPIN_SPEED = 0.9;

    let isDragging = false;
    let activePointerId: number | null = null;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastMoveT = performance.now();
    let velocityX = 0;
    let velocityY = 0;

    container.style.cursor = "grab";
    container.style.touchAction = "none";

    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      activePointerId = e.pointerId;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastMoveT = performance.now();
      velocityX = 0;
      velocityY = 0;
      container?.setPointerCapture(e.pointerId);
      if (container) container.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging || e.pointerId !== activePointerId) return;
      const now = performance.now();
      const dt = Math.max((now - lastMoveT) / 1000, 1 / 120);
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      lastMoveT = now;

      const rotDeltaY = dx * DRAG_SENSITIVITY;
      const rotDeltaX = dy * DRAG_SENSITIVITY;
      objectGroup.rotation.y += rotDeltaY;
      objectGroup.rotation.x += rotDeltaX;

      velocityY = rotDeltaY / dt;
      velocityX = rotDeltaX / dt;
    }

    function endDrag(e: PointerEvent) {
      if (e.pointerId !== activePointerId) return;
      isDragging = false;
      activePointerId = null;
      if (container) container.style.cursor = "grab";
      if (reduce) {
        velocityX = 0;
        velocityY = 0;
      }
    }

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);

    let raf = 0;
    let lastT = performance.now();
    let elapsed = 0;
    function tick(t: number) {
      const delta = (t - lastT) / 1000;
      lastT = t;

      const coasting = Math.abs(velocityX) > INERTIA_EPSILON || Math.abs(velocityY) > INERTIA_EPSILON;

      if (isDragging) {
        // rotation already applied directly in onPointerMove
      } else if (!reduce && coasting) {
        objectGroup.rotation.y += velocityY * delta;
        objectGroup.rotation.x += velocityX * delta;
        const decay = Math.exp(-INERTIA_DECAY * delta);
        velocityX *= decay;
        velocityY *= decay;
      } else if (!reduce) {
        elapsed += delta;
        objectGroup.rotation.y += delta * AUTO_SPIN_SPEED;
        objectGroup.position.y = Math.sin(elapsed * 1.4) * 0.05;
      }

      liveRef.current.rotX = objectGroup.rotation.x;
      liveRef.current.rotY = objectGroup.rotation.y;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", endDrag);
      container.removeEventListener("pointercancel", endDrag);
      disposables.forEach((d) => {
        d.geometry?.dispose();
        d.material?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isCompact, object]);

  if (isCompact) return null;

  // Both HUD blocks live inside .ov-stage, tucked into the top-right and
  // bottom-left corners next to the reticle marks — the exact box the
  // canvas fills — so the frame and HUD text share one coordinate space
  // with the object itself and can never drift apart from it.
  return (
    <div className="object-viewer">
      <div className={`ov-stage is-${phase}`}>
        <div className="ov-field" aria-hidden="true" />

        <div
          ref={containerRef}
          className={`ov-canvas${glitch ? ` is-glitch-${glitch}` : ""}`}
        />

        <span className="ov-corner ov-corner-tl" aria-hidden="true" />
        <span className="ov-corner ov-corner-tr" aria-hidden="true" />
        <span className="ov-corner ov-corner-bl" aria-hidden="true" />
        <span className="ov-corner ov-corner-br" aria-hidden="true" />

        {objects.length > 1 && (
          <>
            <button
              type="button"
              className="ov-nav ov-nav-prev t-mono"
              onClick={goPrev}
              disabled={!!glitch}
              aria-label="Previous object"
            >
              ‹
            </button>
            <button
              type="button"
              className="ov-nav ov-nav-next t-mono"
              onClick={goNext}
              disabled={!!glitch}
              aria-label="Next object"
            >
              ›
            </button>
          </>
        )}

        <div className="ov-hud ov-hud-top t-mono">
          {phase === "boot" ? (
            <div className="ov-boot">
              <p>&gt; OBJECT DETECTED</p>
              <p style={{ animationDelay: "0.45s" }}>
                &gt; {object.id} · {object.name}
              </p>
              <p style={{ animationDelay: "0.9s" }}>&gt; MANUAL INSPECTION ENABLED</p>
            </div>
          ) : (
            <div className="ov-meta">
              <span className="ov-meta-label">/ OBJECT_VIEWER_01</span>
              <span className="ov-meta-name">
                {object.id} <i>/</i> {object.name}
              </span>
              <span className="ov-meta-sub">
                <span>{object.category}</span>
                <span className="ov-meta-status">
                  <i className="ov-dot" />
                  {object.status}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="ov-hud ov-hud-bottom t-mono">
          <span className="ov-rot">
            ROT_X {pad3(readout.rotX)}° · ROT_Y {pad3(readout.rotY)}°
          </span>
          <span className="ov-instruction">[ DRAG TO ROTATE ]</span>
        </div>
      </div>
    </div>
  );
}
