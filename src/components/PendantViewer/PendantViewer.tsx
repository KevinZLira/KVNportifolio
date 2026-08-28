import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import "./PendantViewer.css";

// PENDANT_VIEWER — a single artifact, not a catalog. Deliberately not built
// on top of ObjectViewer: that component's hologram-wireframe material and
// multi-object nav are wrong for "this is a real object belonging to the
// organization," so this gets its own small, independent Three.js scene
// with a solid metal material instead of a green wireframe ghost.

const ACCENT = 0xff2ec4;
// A punchier, fully-saturated neon green (not a lighter/pastel tint of
// the site's brand green — that read as washed out), used only for the
// pendant's own glow (emissive fill + edge lines + its rim light). The
// brand color (#80f425) stays as-is everywhere else on the site.
const GLOW = 0x8cff14;
// Purer/lower-red than GLOW on purpose: this drives an emissiveIntensity
// well above 1 on the "Detalhe" mesh (see build() below), and without HDR
// tone mapping/bloom in this renderer, a channel above 1 just clips — so
// GLOW's non-trivial red component would clip toward white/yellow at that
// intensity instead of reading as more green.
const DETAIL_GLOW = 0x33ff22;
const MODEL_URL = "/models/pendant.glb";
// A real studio HDRI, downsized from the original 4K/25MB source to
// 1024x512 (~1.5MB) — the environment only ever gets *reflected*, and
// PMREMGenerator blurs it heavily for every roughness above near-zero, so
// the extra resolution the source shipped with wasn't buying anything
// visible, just page weight.
const ENV_URL = "/hdri/ferndale-studio-1k.hdr";
// Fraction of the camera's vertical frustum the whole object (medallion +
// full chain, plus the gap MEDALLION_DROP opens between them) is allowed to
// fill. Sizing against the *whole* object's own height — not just the
// medallion's width — and leaving a generous margin is the point: anything
// tighter than this, tuned for one specific viewport, breaks again the
// moment the canvas's aspect or size changes (this is the third pass at
// this exact bug). The camera sits well back (see camera.position.z below)
// specifically so this margin has real room to work with.
const FRAME_MARGIN = 0.825;

// Centers the object on its own whole bounding box and returns its max
// dimension (the combined medallion+chain height) so the caller can turn
// that into a scale factor against the camera's current frustum.
function centerAndMeasure(object: THREE.Group) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
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

// The 13 chain-link meshes are always named "Torus"/"Torus.00N" (Blender's
// default for that primitive) regardless of how the medallion meshes
// themselves get renamed — so "not a Torus" is a more durable way to pick
// out the medallion than matching its own name, which has already changed
// once (Plane.* -> Detalhe/Envolta do KVN/KVN) as the model was iterated on.
function isMedallionMesh(mesh: THREE.Mesh) {
  return !mesh.name.startsWith("Torus");
}

// The chain links plus "Envolta do KVN" (the medallion's outer wrap) both
// read as actual chrome — mirror-flat, near-zero roughness — rather than
// the medallion body's brushed/etched metal. GLTFLoader sanitizes node
// names, replacing spaces with underscores, so the runtime name is
// "Envolta_do_KVN" even though it reads "Envolta do KVN" in Blender/the
// source file.
function isChromeMesh(name: string) {
  return name.startsWith("Torus") || name === "Envolta_do_KVN";
}

// Per-mesh material by name: chrome per isChromeMesh() above; "Detalhe" is
// a dedicated accent piece meant to read as a light source (black base,
// nothing but its own emissive contributes) rather than a lit surface;
// "KVN" is lightly frosted white glass (translucent, but the roughness
// keeps it from being clear-glass sharp); everything else keeps the
// medallion's default brushed metal + subtle emissive.
function buildMeshMaterial(name: string): THREE.MeshStandardMaterial {
  if (isChromeMesh(name)) {
    return new THREE.MeshStandardMaterial({
      color: 0xd9dcdd,
      metalness: 1,
      roughness: 0.035,
      envMapIntensity: 1.2,
    });
  }
  if (name === "Detalhe") {
    return new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: DETAIL_GLOW,
      emissiveIntensity: 1.8,
      metalness: 0.2,
      roughness: 0.4,
    });
  }
  if (name === "KVN") {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      roughness: 0.32,
      thickness: 0.5,
      ior: 1.45,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: 0x2a2c28,
    metalness: 0.82,
    roughness: 0.32,
    emissive: GLOW,
    emissiveIntensity: 0.12,
  });
}

function computeTargetSize(camera: THREE.PerspectiveCamera) {
  const vFov = (camera.fov * Math.PI) / 180;
  const frustumHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
  const frustumWidth = frustumHeight * camera.aspect;
  // The combined box is height-dominated (the chain), so the height
  // constraint binds first — but at a narrow aspect the width could bind
  // instead, so this stays honest and takes whichever is tighter.
  return FRAME_MARGIN * Math.min(frustumHeight, frustumWidth);
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
    // Sitting further back than the medallion alone would need gives the
    // frustum room to comfortably fit the *whole* object (medallion + full
    // chain) at a still-generous size — see FRAME_MARGIN/computeTargetSize.
    // Negative Y sits the camera below the object's center so it looks up
    // at it slightly, rather than down.
    camera.position.set(0, -0.15, 8);
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
    const rim1 = new THREE.PointLight(GLOW, 5, 9);
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
    scene.add(pivot);
    let hoverTargets: THREE.Mesh[] = [];
    const highlightMats: THREE.MeshStandardMaterial[] = [];
    let wholeMaxDim = 0;
    let pivotBaseY = 0;
    let medallionCenterY = 0;
    let envRT: THREE.WebGLRenderTarget | undefined;

    async function build() {
      // Loaded together: the model isn't shown (setLoaded(true) below)
      // until both resolve, so the chrome/glass materials never render
      // for even a frame without something to reflect.
      const [gltf, hdrTexture] = await Promise.all([
        new Promise<THREE.Group>((resolve, reject) => {
          new GLTFLoader().load(MODEL_URL, (g) => resolve(g.scene), undefined, reject);
        }),
        new Promise<THREE.DataTexture>((resolve, reject) => {
          new RGBELoader().load(ENV_URL, resolve, undefined, reject);
        }),
      ]);
      if (disposed || !container) return;

      // A near-zero-roughness metal has nothing to reflect but point-light
      // pinpricks without this — chrome reads as chrome because it mirrors
      // its surroundings, not because of direct specular highlights alone.
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      envRT = pmremGenerator.fromEquirectangular(hdrTexture);
      scene.environment = envRT.texture;
      hdrTexture.dispose();
      pmremGenerator.dispose();

      wholeMaxDim = centerAndMeasure(gltf);

      // The chain's lowest link sits low enough in the source model that it
      // pokes into the medallion's top edge instead of resting above it.
      // Moving the *chain* up to fix that (an earlier version of this)
      // pushed its top end past the camera frustum, clipping it against the
      // canvas edge instead. Dropping the *medallion* down instead opens the
      // same gap without moving the chain at all — and now that the whole
      // object (medallion + chain + this gap) is what gets fit to the
      // frustum below, that gap is accounted for rather than sneaking past
      // it. Same rotated-node conversion centerAndMeasure uses: the offset
      // is world-space straight down, converted into each mesh's own local
      // space so it still reads as "down" on screen regardless of that
      // mesh's rotation. BASE_GAP is offset by a raise requested in screen
      // pixels (moves the medallion only, not the chain) — converted to
      // this mesh's raw (pre object-scale) units via the frustum's
      // world-units-per-pixel at the object's depth, undoing the object
      // scale that gets applied afterward so the offset survives it.
      const BASE_GAP = 0.42;
      const objectScale = computeTargetSize(camera) / (wholeMaxDim + BASE_GAP);
      const vFov = (camera.fov * Math.PI) / 180;
      const frustumHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const worldUnitsPerPixel = frustumHeight / container.clientHeight;
      const MEDALLION_RAISE_PX = 30;
      const medallionRaise = (MEDALLION_RAISE_PX * worldUnitsPerPixel) / objectScale;

      const MEDALLION_DROP = BASE_GAP - medallionRaise;
      gltf.traverse((child) => {
        if (child instanceof THREE.Mesh && isMedallionMesh(child)) {
          const pos = new THREE.Vector3();
          const quat = new THREE.Quaternion();
          const scl = new THREE.Vector3();
          child.matrixWorld.decompose(pos, quat, scl);
          const invRotScale = new THREE.Matrix4().compose(new THREE.Vector3(), quat, scl).invert();
          const localDrop = new THREE.Vector3(0, -MEDALLION_DROP, 0).applyMatrix4(invRotScale);
          child.geometry.translate(localDrop.x, localDrop.y, localDrop.z);
        }
      });
      wholeMaxDim += MEDALLION_DROP;

      // Centering centerAndMeasure() did on the *whole* box (chain + medallion)
      // leaves the medallion itself sitting below the vertical middle, since
      // the chain occupies the upper portion of that box. What we actually
      // want on screen is the medallion centered with the chain free to run
      // off the top — so measure just the medallion (every mesh that isn't
      // a "Torus" chain link) post-drop, in the model's still-unscaled
      // local space, and
      // raise the whole pivot by exactly its own center offset once that's
      // converted through the same finalScale used to fit the model to the
      // frustum. Deriving the raise from the model's own proportions this
      // way (instead of a fixed pixel amount) is what makes it land the
      // medallion dead-center on any screen size — a fixed pixel raise is a
      // wildly different fraction of a short mobile viewport than a tall
      // desktop one, which is what sent the pendant off-screen on mobile
      // while it still looked fine on desktop.
      const medallionBox = new THREE.Box3();
      let hasMedallion = false;
      gltf.traverse((child) => {
        if (child instanceof THREE.Mesh && isMedallionMesh(child)) {
          const box = new THREE.Box3().setFromObject(child);
          if (hasMedallion) medallionBox.union(box);
          else {
            medallionBox.copy(box);
            hasMedallion = true;
          }
        }
      });
      medallionCenterY = hasMedallion ? medallionBox.getCenter(new THREE.Vector3()).y : 0;

      const finalScale = computeTargetSize(camera) / wholeMaxDim;
      gltf.scale.setScalar(finalScale);
      pivotBaseY = -medallionCenterY * finalScale;
      pivot.position.y = pivotBaseY;

      gltf.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const isChrome = isChromeMesh(child.name);
          const isDetail = child.name === "Detalhe";
          const isKvnGlass = child.name === "KVN";
          const material = buildMeshMaterial(child.name);
          child.material = material;
          // Only the medallion's default metal participates in the
          // hover/idle emissive pulse below — chrome parts, Detalhe (fixed
          // intense glow), and KVN (glass, no emissive at all) all stay
          // exactly as authored regardless of interaction state.
          if (!isChrome && !isDetail && !isKvnGlass) highlightMats.push(material);
          disposables.push({ geometry: child.geometry, material });

          const edgeGeo = new THREE.EdgesGeometry(child.geometry, 50);
          const edgeMat = new THREE.LineBasicMaterial({
            color: GLOW,
            transparent: true,
            opacity: 0.55,
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

    build().catch((err) => console.error("Failed to load pendant model or environment", err));

    function resize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // The stage's aspect ratio isn't fixed (it varies across
      // breakpoints, and on window resize), so the model's scale has to be
      // recomputed against the new frustum — otherwise a resize into a
      // narrower aspect than it was fit for could clip it again. The
      // medallion-centering raise is derived from that same scale (see
      // build()), so it has to be recomputed alongside it — otherwise a
      // resize would leave the raise matched to the *old* scale and the
      // medallion would drift off-center.
      const model = pivot.children[0] as THREE.Group | undefined;
      if (model && wholeMaxDim > 0) {
        const newScale = computeTargetSize(camera) / wholeMaxDim;
        model.scale.setScalar(newScale);
        pivotBaseY = -medallionCenterY * newScale;
        pivot.position.y = pivotBaseY;
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ---- drag-to-rotate with inertia ----
    const DRAG_SENSITIVITY = 0.011;
    const INERTIA_DECAY = 2.2;
    const INERTIA_EPSILON = 0.04;
    const IDLE_SPIN_SPEED = 0.11;
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
        pivot.position.y = pivotBaseY + Math.sin(elapsed * 0.7) * 0.045;
      }

      const targetEmissive = isHovering || isDragging ? 0.28 : 0.12;
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
      envRT?.dispose();
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
