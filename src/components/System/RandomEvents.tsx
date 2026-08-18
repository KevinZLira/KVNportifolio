import { useEffect, useRef, useState } from "react";
import { useIdle } from "../../hooks/useIdle";
import "./RandomEvents.css";

export default function RandomEvents() {
  const idle = useIdle(25000);
  const [message, setMessage] = useState<string | null>(null);
  const wasIdle = useRef(false);

  useEffect(() => {
    if (idle && !wasIdle.current) {
      setMessage("SYSTEM IS WAITING FOR INPUT...");
    } else if (!idle && wasIdle.current) {
      setMessage("INPUT DETECTED.");
      window.setTimeout(() => setMessage(null), 1400);
    }
    wasIdle.current = idle;
  }, [idle]);

  if (!message) return null;

  return (
    <div className="random-event t-mono" role="status">
      {message}
    </div>
  );
}
