import { useEffect, useRef, useState } from "react";
import { subscribeToast } from "../../lib/toast";
import "./SystemToaster.css";

interface Toast {
  id: number;
  text: string;
}

export default function SystemToaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    return subscribeToast((text, duration) => {
      const id = idRef.current++;
      setToasts((prev) => [...prev.slice(-2), { id, text }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    });
  }, []);

  return (
    <div className="toaster t-mono" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toaster-item">
          {t.text}
        </div>
      ))}
    </div>
  );
}
