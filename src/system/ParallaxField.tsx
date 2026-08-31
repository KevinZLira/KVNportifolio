import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface ParallaxVector {
  x: number; // -1..1
  y: number; // -1..1
}

const ParallaxContext = createContext<ParallaxVector>({ x: 0, y: 0 });

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const isCoarsePointer =
  typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches;

export function ParallaxProvider({ children }: { children: ReactNode }) {
  const [vec, setVec] = useState<ParallaxVector>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const target = useRef<ParallaxVector>({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || isCoarsePointer) return;

    function onMove(e: MouseEvent) {
      target.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      if (raf.current == null) {
        raf.current = requestAnimationFrame(tick);
      }
    }

    function tick() {
      setVec((prev) => {
        const next = {
          x: prev.x + (target.current.x - prev.x) * 0.08,
          y: prev.y + (target.current.y - prev.y) * 0.08,
        };
        const settled =
          Math.abs(next.x - target.current.x) < 0.001 &&
          Math.abs(next.y - target.current.y) < 0.001;
        if (!settled) {
          raf.current = requestAnimationFrame(tick);
        } else {
          raf.current = null;
        }
        return next;
      });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, []);

  return <ParallaxContext.Provider value={vec}>{children}</ParallaxContext.Provider>;
}

export function useParallax() {
  return useContext(ParallaxContext);
}

interface ParallaxLayerProps {
  depth?: number; // 0 = static, 1 = strong
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({ depth = 0.2, children, className = "", style }: ParallaxLayerProps) {
  const { x, y } = useParallax();
  const tx = x * depth * 18;
  const ty = y * depth * 18;

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
