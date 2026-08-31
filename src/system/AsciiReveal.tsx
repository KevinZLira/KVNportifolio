import { useMemo } from "react";
import "./AsciiReveal.css";

const CHARS = "01·:+*#%@░▒▓█";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic ASCII "portrait" of a project — a rare, special
// transformation used only on select archive entries.
export default function AsciiReveal({ seed, cols = 26, rows = 10 }: { seed: number; cols?: number; rows?: number }) {
  const art = useMemo(() => {
    const rand = mulberry32(seed);
    const lines: string[] = [];
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let c = 0; c < cols; c++) {
        const dx = c / cols - 0.5;
        const dy = r / rows - 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const density = 1 - dist * 1.6 + (rand() - 0.5) * 0.5;
        const idx = Math.max(0, Math.min(CHARS.length - 1, Math.floor(density * CHARS.length)));
        line += CHARS[idx];
      }
      lines.push(line);
    }
    return lines.join("\n");
  }, [seed, cols, rows]);

  return (
    <pre className="ascii-reveal" aria-hidden="true">
      {art}
    </pre>
  );
}
