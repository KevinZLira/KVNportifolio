import { useMemo } from "react";
import "./PixelSprite.css";

interface PixelSpriteProps {
  grid: boolean[][];
  cell: number;
  color?: string;
  className?: string;
  glow?: boolean;
  rowStart?: number;
  rowEnd?: number;
}

export default function PixelSprite({
  grid,
  cell,
  color = "var(--primary)",
  className = "",
  glow = true,
  rowStart = 0,
  rowEnd,
}: PixelSpriteProps) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const end = rowEnd ?? rows;

  const cells = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let y = rowStart; y < end; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y]?.[x]) out.push({ x, y: y - rowStart });
      }
    }
    return out;
  }, [grid, rowStart, end, cols]);

  const height = end - rowStart;

  return (
    <div
      className={`pixel-sprite ${className}`}
      style={{
        width: cols * cell,
        height: height * cell,
        filter: glow ? `drop-shadow(0 0 ${Math.max(2, cell * 0.5)}px var(--primary-glow, rgba(109,255,168,0.55)))` : undefined,
      }}
    >
      {cells.map((c) => (
        <span
          key={`${c.x}-${c.y}`}
          className="pixel-sprite-dot"
          style={{
            width: cell,
            height: cell,
            left: c.x * cell,
            top: c.y * cell,
            background: color,
          }}
        />
      ))}
    </div>
  );
}
