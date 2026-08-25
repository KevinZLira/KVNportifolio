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
// How much of the visible frame the medallion's own width should fill. The
// stage is no longer a fixed square (it's now tall enough for the chain to
// run up behind the fixed header), and its aspect ratio changes across
// breakpoints — so the target size can't be a single constant tuned for one
// aspect, it has to be recomputed from the camera's actual frustum width
// whenever that aspect changes (see computeTargetSize/resize below).
const FRAME_MARGIN = 0.92;
// Base vertical offset (world units) applied to the whole pivot — see the
// comment where it's assigned, next to `pivot.position.y`, for why.
const PIVOT_Y_OFFSET = 0.95;

function computeTargetSize(camera: THREE.PerspectiveCamera) {
  const vFov = (camera.fov * Math.PI) / 180;
  const frustumHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
  const frustumWidth = frustumHeight * camera.aspect;
  return FRAME_MARGIN * frustumWidth;
}

// Centers the object on just the meshes `focusPredicate` matches (the
// medallion plates) rather than the whole object — recentering on the whole
// object would put the medallion off-center since the chain drags the
// combined bounding box upward. Returns the focus box's own max dimension
// (its width — the medallion is wider than tall) so the caller can turn
// that into a scale factor against the current camera frustum, and redo it
// whenever the frustum's aspect changes.
function centerAndMeasure(object: THREE.Group, focusPredicate?: (mesh: THREE.Mesh) => boolean) {
  const box = new THREE.Box3().setFromObject(object);

  let sizeBox = box;
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
    if (any) {
      sizeBox = focusBox;
      center = focusBox.getCenter(new THREE.Vector3());
    }
  }

  const size = sizeBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

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

  return maxDim;
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
    // Starting yaw, on the same axis (Y) the interactive/idle rotation
    // below uses. Set once, synchronously, before the async model load
    // below: pivot.rotation.y doubles as the user's drag target, so
    // assigning it again once the (awaited) load resolves would silently
    // wipe out a drag that happened while the model was still in flight.
    pivot.rotation.y = 0.5;
    // Shifts the whole medallion+chain group up within the frustum so the
    // chain's own length runs past the top of the (fixed-height) frustum
    // instead of stopping short with a gap of empty canvas above it. The
    // stage's CSS box starts at the very top of the section (behind the
    // fixed site header), so whatever gets clipped here is exactly what
    // ends up hidden behind that header, reading as "runs behind it"
    // rather than "floats, disconnected, below it". The frustum's own
    // vertical extent depends only on fov/distance, not aspect, so one
    // offset works the same way across every breakpoint.
    pivot.position.y = PIVOT_Y_OFFSET;
    scene.add(pivot);
    let hoverTargets: THREE.Mesh[] = [];
    const highlightMats: THREE.MeshStandardMaterial[] = [];
    let focusMaxDim = 0;

    async function build() {
      const gltf = await new Promise<THREE.Group>((resolve, reject) => {
        new GLTFLoader().load(MODEL_URL, (g) => resolve(g.scene), undefined, reject);
      });
      if (disposed) return;

      // Plane002 is a solid filler layer sitting right behind Plane001 (the
      // actual detailed emblem, with its correct negative-space gaps between
      // strokes) — with both rendered, Plane002 shows through those gaps and
      // reads as a single solid block/plate rather than an open "K" mark.
      const toRemove: THREE.Object3D[] = [];
      gltf.traverse((c) => {
        if (c.name === "Plane002") toRemove.push(c);
      });
      toRemove.forEach((c) => c.removeFromParent());

      focusMaxDim = centerAndMeasure(gltf, (m) => m.name.startsWith("Plane"));
      gltf.scale.setScalar(computeTargetSize(camera) / focusMaxDim);

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
      // The stage's aspect ratio changes across breakpoints (and on
      // window resize), so the medallion's scale has to be recomputed
      // against the new frustum width — otherwise a resize into a
      // narrower aspect than it was fit for clips it again.
      const model = pivot.children[0] as THREE.Group | undefined;
      if (model && focusMaxDim > 0) {
        model.scale.setScalar(computeTargetSize(camera) / focusMaxDim);
      }
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
    let velocityY = 0;
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
      velocityY = 0;
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

      // Y-axis only (spin/yaw) — horizontal drag turns it; vertical
      // movement doesn't map to a rotation that exists here, so it's
      // ignored rather than forced onto Y.
      const rotDelta = dx * DRAG_SENSITIVITY;
      pivot.rotation.y += rotDelta;
      velocityY = rotDelta / dt;

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

      const coasting = Math.abs(velocityY) > INERTIA_EPSILON;

      if (isDragging) {
        // applied directly in onPointerMove
      } else if (!reduce && coasting) {
        pivot.rotation.y += velocityY * delta;
        velocityY *= Math.exp(-INERTIA_DECAY * delta);
      } else if (!reduce && t - lastInteractionT > IDLE_AFTER_MS) {
        elapsed += delta;
        pivot.rotation.y += delta * IDLE_SPIN_SPEED;
        pivot.position.y = PIVOT_Y_OFFSET + Math.sin(elapsed * 0.7) * 0.045;
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
