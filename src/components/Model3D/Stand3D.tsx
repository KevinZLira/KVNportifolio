import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import "./Stand3D.css";

const MODEL_URL = "/models/stand.obj";

export default function Stand3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.1, 3.4);
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

    const rim1 = new THREE.PointLight(0x80f425, 6, 8);
    rim1.position.set(-2, 0.5, -1.5);
    scene.add(rim1);

    const rim2 = new THREE.PointLight(0xff2ec4, 5, 8);
    rim2.position.set(2, -0.5, -1.5);
    scene.add(rim2);

    const group = new THREE.Group();
    scene.add(group);

    let disposed = false;
    const disposables: { geometry?: THREE.BufferGeometry; material?: THREE.Material }[] = [];

    new OBJLoader().load(
      MODEL_URL,
      (object) => {
        if (disposed) return;

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.2 / maxDim;

        object.position.sub(center);
        object.scale.setScalar(scale);

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
            color: 0x80f425,
            transparent: true,
            opacity: 0.5,
          });
          const wire = new THREE.LineSegments(wireGeo, wireMat);
          child.add(wire);
          disposables.push({ geometry: wireGeo, material: wireMat });
        });

        group.add(object);
      },
      undefined,
      (err) => console.error("Failed to load stand model", err),
    );

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
    function tick(t: number) {
      const delta = (t - lastT) / 1000;
      lastT = t;
      if (!reduce) group.rotation.y += delta * 0.5;
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
      <div className="stand3d-label t-mono">STAND_MODEL.OBJ</div>
      <div ref={containerRef} className="stand3d-canvas" />
    </div>
  );
}
