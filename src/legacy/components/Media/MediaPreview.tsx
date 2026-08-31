import { useEffect, useRef, useState } from "react";
import { sfx } from "../../lib/sound";
import { emitToast } from "../../lib/toast";
import "./MediaPreview.css";

interface MediaPreviewProps {
  accent: string;
  id: string;
  label?: string;
  interactive?: boolean;
}

const TOTAL_FRAMES = 1024;

function formatTimecode(frame: number) {
  const totalSeconds = frame / 24;
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(Math.floor(totalSeconds % 60)).padStart(2, "0");
  const ff = String(Math.floor((totalSeconds % 1) * 100)).padStart(2, "0");
  return `${mm}:${ss}:${ff}`;
}

export default function MediaPreview({ accent, id, label, interactive = true }: MediaPreviewProps) {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(() => Math.floor(Math.random() * 400));
  const raf = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    if (!playing) return;
    function tick(t: number) {
      if (t - last.current > 1000 / 24) {
        last.current = t;
        setFrame((f) => (f + 1) % TOTAL_FRAMES);
      }
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  return (
    <div
      className="media-preview"
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={() => {
        if (!interactive) return;
        setPlaying((p) => {
          const next = !p;
          sfx.click();
          emitToast(next ? "VIDEO_STREAM ACTIVE" : "STREAM PAUSED");
          return next;
        });
      }}
    >
      <div className={`media-sweep ${playing ? "is-playing" : ""}`} />
      <div className="media-scanlines" />
      <div className="media-grid" />

      <div className="media-corner media-corner--tl t-mono">PROJECT_{id}</div>
      <div className="media-corner media-corner--tr t-mono">
        {playing ? "● REC" : "◌ IDLE"}
      </div>

      {interactive && (
        <button type="button" className="media-play" aria-label={playing ? "Pause" : "Play"}>
          {playing ? "❙❙" : "▶"}
        </button>
      )}

      {label && <div className="media-label t-display">{label}</div>}

      <div className="media-corner media-corner--bl t-mono">
        FRAME {String(frame).padStart(5, "0")} / {TOTAL_FRAMES}
      </div>
      <div className="media-corner media-corner--br t-mono">{formatTimecode(frame)}</div>
    </div>
  );
}
