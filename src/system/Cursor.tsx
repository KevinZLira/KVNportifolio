import { useEffect, useRef } from "react";
import "./Cursor.css";

const isCoarsePointer =
  typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches;

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (isCoarsePointer) return;

    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        dotRef.current.style.opacity = "1";
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
      }
    }

    function onDown() {
      ringRef.current?.classList.add("is-active");
    }
    function onUp() {
      ringRef.current?.classList.remove("is-active");
    }

    function tick() {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18;
      ring.current.y += (pos.current.y - ring.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (isCoarsePointer) return null;

  return (
    <>
      <div ref={dotRef} className="kvn-cursor-dot" />
      <div ref={ringRef} className="kvn-cursor-ring" />
    </>
  );
}
