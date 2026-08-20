import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import "./Stand3D.css";

const FLOPPY_URL = "/models/floppy.obj";

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
  // once the object is rotated.
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.translate(-center.x, -center.y, -center.z);
    }
  });
  object.scale.setScalar(scale);

  return { size: size.multiplyScalar(scale), scale };
}

// Desktop-only for now — skip mounting the WebGL scene below this width
// rather than just hiding it with CSS, on both tablet and mobile.
const COMPACT_QUERY = "(max-width: 1099px)";

export default function Stand3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isCompact = useRef(
    typeof window !== "undefined" && window.matchMedia(COMPACT_QUERY).matches,
  ).current;

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

    const floppyGroup = new THREE.Group();
    scene.add(floppyGroup);

    function applyHologram(object: THREE.Group) {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
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
        const wireMat = new THREE.LineBasicMaterial({
          color: PRIMARY,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        child.add(wire);
        disposables.push({ geometry: wireGeo, material: wireMat });
      });
    }

    async function build() {
      const floppyObj = await loadObj(FLOPPY_URL);
      if (disposed) return;

      fitAndCenter(floppyObj, 2.3);
      applyHologram(floppyObj);
      // stand the disk upright on its edge (90° to how it was authored,
      // lying flat) — its bounding box after fitAndCenter is centered on
      // the object's local origin, so rotating in place keeps it centered
      floppyObj.rotation.x = Math.PI / 2;
      floppyGroup.add(floppyObj);
      // start at a 3/4 angle instead of face-on — face-on reads as an
      // oversized close-up (and is the only frame reduced-motion users see)
      floppyGroup.rotation.y = 0.7;
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

    let raf = 0;
    let lastT = performance.now();
    let elapsed = 0;
    function tick(t: number) {
      const delta = (t - lastT) / 1000;
      lastT = t;

      if (!reduce) {
        elapsed += delta;
        floppyGroup.rotation.y += delta * 0.9;
        floppyGroup.position.y = Math.sin(elapsed * 1.4) * 0.05;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposables.forEach((d) => {
        d.geometry?.dispose();
        d.material?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isCompact]);

  if (isCompact) return null;

  return (
    <div className="stand3d">
      <div className="stand3d-label t-mono">
        <span>DATA_DISK.OBJ</span>
        <span className="stand3d-label-accent">HOLOGRAM ACTIVE</span>
      </div>
      <div ref={containerRef} className="stand3d-canvas" />
    </div>
  );
}
