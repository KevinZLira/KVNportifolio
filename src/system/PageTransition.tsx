import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

const GLYPHS = "01·░▒▓█/\\|+-";

function randomGlyphLine(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

export default function PageTransition() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setLines(Array.from({ length: 5 }, () => randomGlyphLine(28)));
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 360);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className={`page-transition ${active ? "is-active" : ""}`} aria-hidden="true">
      <div className="page-transition__glyphs">
        {lines.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}
