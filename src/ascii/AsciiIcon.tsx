import { useEffect, useRef, useState } from "react";
import { asciiIcons, type AsciiIconName } from "./icons";
import "./AsciiIcon.css";

interface AsciiIconProps {
  name: AsciiIconName;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  interactive?: boolean;
  speed?: number; // ms per frame
  className?: string;
}

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function AsciiIcon({
  name,
  size = "md",
  animate = true,
  interactive = true,
  speed = 900,
  className = "",
}: AsciiIconProps) {
  const def = asciiIcons[name];
  const [hovered, setHovered] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const visibleRef = useRef(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const frames = hovered ? def.hoverFrames : def.frames;

  useEffect(() => {
    if (!animate || reducedMotion || frames.length <= 1) return;
    const id = window.setInterval(() => {
      if (!visibleRef.current) return;
      setFrameIndex((i) => (i + 1) % frames.length);
    }, speed);
    return () => window.clearInterval(id);
  }, [animate, frames.length, speed]);

  useEffect(() => {
    setFrameIndex(0);
  }, [hovered]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frame = frames[frameIndex % frames.length] ?? frames[0];

  return (
    <div
      ref={rootRef}
      className={`ascii-icon ascii-icon--${size} ${hovered ? "is-hovered" : ""} ${className}`}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
    >
      <pre className="ascii-icon__art" aria-hidden="true">
        {frame.join("\n")}
      </pre>
    </div>
  );
}
