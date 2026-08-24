import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./PendantViewer.css";

// PENDANT_VIEWER — a single artifact, not a catalog. Deliberately not built
// on top of ObjectViewer: that component's hologram-wireframe material and
// multi-object nav are wrong for "this is a real object belonging to the
// organization," so this gets its own small, independent Three.js scene
// with a solid metal material instead of a green wireframe ghost.

const PRIMARY = 0x80f425;
const ACCENT = 0xff2ec4;
const MODEL_URL = "/models/pendant.glb";
// The whole model (medallion + chain) is used for the scale calculation —
// this is a straight 4x over the original 1.7, i.e. the "+300%" the medallion
// itself should end up at once centering is decoupled from it below. The
// chain is long relative to the medallion, so at this size it runs well past
// the visible frame — which is the point (see focusPredicate below).
const TARGET_SIZE = 6.8;

// Recentering on the whole object (chain included) would put the medallion
// off-center, since the chain drags the combined bounding box upward.
// `focusPredicate`, when given, centers on just the meshes it matches
// instead — here, the medallion plates — while `targetSize` still scales
// against the *whole* object, so the chain's real length still determines
// how far it extends (off-screen) from that centered medallion.
function fitAndCenter(
  object: THREE.Group,
  targetSize: number,
  focusPredicate?: (mesh: THREE.Mesh) => boolean,
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;

  let center = box.getCenter(new THREE.Vector3());
  if (focusPredicate) {
    const focusBox = new THREE.Box3();
    let any = false;
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && focusPredicate(child)) {
        focusBox.expandByObject(child);
        any = true;
      }
    });
    if (any) center = focusBox.getCenter(new THREE.Vector3());
  }

  // Same fix as OBJECT_VIEWER's catalog needed for its .glb entries: a
  // node between this root and a given mesh can carry its own
  // rotation/scale (glTF exporters do this for axis conversion), so the
  // world-space centering offset has to be converted into that mesh's own
  // local space — not just written into its geometry as-is — or the
  // recenter lands in the wrong place for any mesh under a rotated node.
  const invRotScale = new THREE.Matrix4();
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      const scl = new THREE.Vector3();
      child.matrixWorld.decompose(pos, quat, scl);
      invRotScale.compose(new THREE.Vector3(), quat, scl).invert();
      const localOffset = center.clone().negate().applyMatrix4(invRotScale);
      child.geometry.translate(localOffset.x, localOffset.y, localOffset.z);
    }
  });
  object.scale.setScalar(scale);
}

export default function PendantViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInteractedRef = useRef(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const disposables: { geometry?: THREE.BufferGeometry; material?: THREE.Material }[] = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(2.2, 3, 2.5);
    scene.add(key);
    const rim1 = new THREE.PointLight(PRIMARY, 5, 9);
    rim1.position.set(-2, 0.6, -1.8);
    scene.add(rim1);
    const rim2 = new THREE.PointLight(ACCENT, 3.5, 9);
    rim2.position.set(1.8, -1, -1.6);
    scene.add(rim2);

    const pivot = new THREE.Group();
    // Fixed 3/4 presentation angle on Y — never touched again after this,
    // since the interactive/idle rotation below is Z-only. Set once,
    // synchronously, before the async model load below: pivot.rotation.z
    // doubles as the user's drag target, so assigning it again once the
    // (awaited) load resolves would silently wipe out a drag that happened
    // while the model was still in flight.
    pivot.rotation.y = 0.5;
    scene.add(pivot);
    let hoverTargets: THREE.Mesh[] = [];
    const highlightMats: THREE.MeshStandardMaterial[] = [];

    async function build() {
      const gltf = await new Promise<THREE.Group>((resolve, reject) => {
        new GLTFLoader().load(MODEL_URL, (g) => resolve(g.scene), undefined, reject);
      });
      if (disposed) return;

      fitAndCenter(gltf, TARGET_SIZE, (m) => m.name.startsWith("Plane"));

      gltf.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = new THREE.MeshStandardMaterial({
            color: 0x2a2c28,
            metalness: 0.82,
            roughness: 0.32,
            emissive: PRIMARY,
            emissiveIntensity: 0.05,
          });
          child.material = material;
          highlightMats.push(material);
          disposables.push({ geometry: child.geometry, material });

          const edgeGeo = new THREE.EdgesGeometry(child.geometry, 50);
          const edgeMat = new THREE.LineBasicMaterial({
            color: PRIMARY,
            transparent: true,
            opacity: 0.35,
          });
          const edges = new THREE.LineSegments(edgeGeo, edgeMat);
          child.add(edges);
          disposables.push({ geometry: edgeGeo, material: edgeMat });
          hoverTargets.push(child);
        }
      });

      pivot.add(gltf);
      setLoaded(true);
    }

    build().catch((err) => console.error("Failed to load pendant model", err));

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

    // ---- drag-to-rotate with inertia ----
    const DRAG_SENSITIVITY = 0.011;
    const INERTIA_DECAY = 2.2;
    const INERTIA_EPSILON = 0.04;
    const IDLE_SPIN_SPEED = 0.055;
    const IDLE_AFTER_MS = 2200;

    let isDragging = false;
    let activePointerId: number | null = null;
    let lastPointerX = 0;
    let lastMoveT = performance.now();
    let velocityZ = 0;
    let lastInteractionT = performance.now();
    let isHovering = false;
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    container.style.cursor = "grab";
    container.style.touchAction = "none";

    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      activePointerId = e.pointerId;
      lastPointerX = e.clientX;
      lastMoveT = performance.now();
      velocityZ = 0;
      container?.setPointerCapture(e.pointerId);
      if (container) container.style.cursor = "grabbing";
    }

    function updateHover(clientX: number, clientY: number) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hoverTargets, false);
      isHovering = hits.length > 0;
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) {
        updateHover(e.clientX, e.clientY);
        return;
      }
      if (e.pointerId !== activePointerId) return;
      const now = performance.now();
      const dt = Math.max((now - lastMoveT) / 1000, 1 / 120);
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      lastMoveT = now;
      lastInteractionT = now;

      // Z-axis only (roll, in the camera's own plane) — horizontal drag
      // spins it like a wheel; vertical movement doesn't map to a rotation
      // that exists here, so it's ignored rather than forced onto Z.
      const rotDelta = dx * DRAG_SENSITIVITY;
      pivot.rotation.z += rotDelta;
      velocityZ = rotDelta / dt;

      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        setHasInteracted(true);
      }
    }

    function endDrag(e: PointerEvent) {
      if (e.pointerId !== activePointerId) return;
      isDragging = false;
      activePointerId = null;
      lastInteractionT = performance.now();
      if (container) container.style.cursor = "grab";
      if (reduce) {
        velocityZ = 0;
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

      const coasting = Math.abs(velocityZ) > INERTIA_EPSILON;

      if (isDragging) {
        // applied directly in onPointerMove
      } else if (!reduce && coasting) {
        pivot.rotation.z += velocityZ * delta;
        velocityZ *= Math.exp(-INERTIA_DECAY * delta);
      } else if (!reduce && t - lastInteractionT > IDLE_AFTER_MS) {
        elapsed += delta;
        pivot.rotation.z += delta * IDLE_SPIN_SPEED;
        pivot.position.y = Math.sin(elapsed * 0.7) * 0.045;
      }

      const targetEmissive = isHovering || isDragging ? 0.16 : 0.05;
      for (const m of highlightMats) {
        m.emissiveIntensity += (targetEmissive - m.emissiveIntensity) * 0.1;
      }
      const targetScale = isHovering && !isDragging ? 1.02 : 1;
      pivot.scale.x += (targetScale - pivot.scale.x) * 0.12;
      pivot.scale.y = pivot.scale.z = pivot.scale.x;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pendant-viewer">
      <div ref={containerRef} className="pendant-canvas" />
      <span className={`pendant-hint t-mono ${hasInteracted || !loaded ? "is-hidden" : ""}`}>
        [ DRAG TO INSPECT ]
      </span>
    </div>
  );
}
