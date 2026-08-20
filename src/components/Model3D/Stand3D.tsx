import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import "./Stand3D.css";

const STAND_URL = "/models/stand.obj";
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
  object.scale.setScalar(scale);
  object.position.sub(center.multiplyScalar(scale));
  return { size: size.multiplyScalar(scale), scale };
}

export default function Stand3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const disposables: { geometry?: THREE.BufferGeometry; material?: THREE.Material }[] = [];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 2.3, 3.1);
    camera.lookAt(0, 0.55, 0);

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

    const standGroup = new THREE.Group();
    scene.add(standGroup);

    const beamGroup = new THREE.Group();
    scene.add(beamGroup);

    const floppyGroup = new THREE.Group();
    scene.add(floppyGroup);

    function applyMetal(object: THREE.Group) {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const material = new THREE.MeshStandardMaterial({
          color: 0x232323,
          metalness: 0.7,
          roughness: 0.3,
        });
        child.material = material;
        disposables.push({ geometry: child.geometry, material });

        const wireGeo = new THREE.EdgesGeometry(child.geometry, 20);
        const wireMat = new THREE.LineBasicMaterial({
          color: PRIMARY,
          transparent: true,
          opacity: 0.5,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        child.add(wire);
        disposables.push({ geometry: wireGeo, material: wireMat });
      });
    }

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

    let pedestalTopY = 0.2;
    let floppyBottomY = 0.7;
    const rings: THREE.Mesh[] = [];

    async function build() {
      const [standObj, floppyObj] = await Promise.all([loadObj(STAND_URL), loadObj(FLOPPY_URL)]);
      if (disposed) return;

      const standFit = fitAndCenter(standObj, 2.2);
      applyMetal(standObj);
      standGroup.add(standObj);
      pedestalTopY = standFit.size.y / 2;

      const floppyFit = fitAndCenter(floppyObj, 1.05);
      applyHologram(floppyObj);
      const floppyBaseY = pedestalTopY + 0.55;
      floppyGroup.position.y = floppyBaseY;
      floppyGroup.add(floppyObj);
      floppyBottomY = floppyBaseY - floppyFit.size.y / 2 - 0.06;

      const coneHeight = floppyBottomY - pedestalTopY;
      const topRadius = Math.max(floppyFit.size.x, floppyFit.size.z) * 0.42;
      const coneGeo = new THREE.CylinderGeometry(topRadius, 0.04, coneHeight, 28, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: PRIMARY,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = pedestalTopY + coneHeight / 2;
      beamGroup.add(cone);
      disposables.push({ geometry: coneGeo, material: coneMat });

      const ringCount = 4;
      for (let i = 0; i < ringCount; i++) {
        const ringGeo = new THREE.RingGeometry(0.01, 0.03, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: PRIMARY,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.userData.phase = i / ringCount;
        ring.position.y = pedestalTopY + coneHeight * ring.userData.phase;
        beamGroup.add(ring);
        rings.push(ring);
        disposables.push({ geometry: ringGeo, material: ringMat });
      }
    }

    build().catch((err) => console.error("Failed to load 3D models", err));

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
        standGroup.rotation.y += delta * 0.5;
        floppyGroup.rotation.y += delta * 0.9;
        floppyGroup.position.y = pedestalTopY + 0.55 + Math.sin(elapsed * 1.4) * 0.03;

        const coneHeight = floppyBottomY - pedestalTopY;
        rings.forEach((ring) => {
          const phase = (ring.userData.phase + elapsed * 0.18) % 1;
          ring.userData.phase = phase;
          ring.position.y = pedestalTopY + coneHeight * phase;
          ring.scale.setScalar(1 + phase * 10);
          const mat = ring.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.sin(phase * Math.PI) * 0.35;
        });
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
  }, []);

  return (
    <div className="stand3d">
      <div className="stand3d-label t-mono">
        <span>STAND_MODEL.OBJ</span>
        <span className="stand3d-label-accent">PROJECTING: DATA_DISK</span>
      </div>
      <div ref={containerRef} className="stand3d-canvas" />
    </div>
  );
}
