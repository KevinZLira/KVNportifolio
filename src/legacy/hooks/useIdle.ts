import { useEffect, useState } from "react";

// Fires `idle = true` after `ms` of no pointer/keyboard input.
// Used for the occasional "SYSTEM IS WAITING FOR INPUT..." message —
// personality, not a constant tic.
export function useIdle(ms = 25000) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: number;

    const reset = () => {
      if (idle) setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), ms);
    };

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "touchstart",
      "wheel",
      "scroll",
    ];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    timer = window.setTimeout(() => setIdle(true), ms);

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms]);

  return idle;
}
