import "./FileThumb.css";

// A generated "file thumbnail" — no photography, no stock images.
// Pattern is deterministic per project id, tinted with the project accent.
export default function FileThumb({
  id,
  accent,
  ascii,
  className = "",
}: {
  id: string;
  accent: string;
  ascii?: boolean;
  className?: string;
}) {
  const seed = parseInt(id, 10) || 0;
  const angle = (seed * 37) % 180;
  const scale = 1 + ((seed * 13) % 40) / 100;

  return (
    <div
      className={`file-thumb ${ascii ? "file-thumb--ascii" : ""} ${className}`}
      style={
        {
          "--thumb-accent": accent,
          "--thumb-angle": `${angle}deg`,
          "--thumb-scale": scale,
        } as React.CSSProperties
      }
    >
      <div className="file-thumb__id">{id}</div>
      <div className="file-thumb__grid" />
    </div>
  );
}
