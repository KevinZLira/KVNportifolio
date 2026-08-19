import { useEffect, useRef, useState } from "react";
import { useSystem } from "../../state/SystemContext";
import "./CustomCursor.css";

export default function CustomCursor() {
  const { cursorMode, cursorCaptured } = useSystem();
  const dotRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    function onMove(e: MouseEvent) {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    }
    function onDown() {
      setClicking(true);
    }
    function onUp() {
      setClicking(false);
    }
    function onLeave() {
      setVisible(false);
    }

    function tick() {
      setCoords({ x: Math.round(target.current.x), y: Math.round(target.current.y) });
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
    return null;
  }

  const label =
    cursorMode.kind === "link"
      ? "LINK DETECTED"
      : cursorMode.kind === "project"
        ? `TARGET ACQUIRED / PROJECT_${cursorMode.id}`
        : cursorMode.kind === "busy"
          ? cursorMode.label
          : null;

  return (
    <div
      ref={dotRef}
      className={`kvn-cursor ${visible ? "is-visible" : ""} ${clicking ? "is-clicking" : ""} ${cursorCaptured ? "is-captured" : ""} mode-${cursorMode.kind}`}
      aria-hidden="true"
    >
      <div className="kvn-cursor-mark">
        <span className="kvn-cursor-line kvn-cursor-line--h" />
        <span className="kvn-cursor-line kvn-cursor-line--v" />
        <span className="kvn-cursor-ring" />
      </div>
      {label && <div className="kvn-cursor-label t-mono">{label}</div>}
      <div className="kvn-cursor-coords t-mono">
        {String(coords.x).padStart(4, "0")}, {String(coords.y).padStart(4, "0")}
      </div>
    </div>
  );
}
