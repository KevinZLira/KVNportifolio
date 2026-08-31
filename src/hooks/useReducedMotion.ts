import { useEffect, useState } from "react";

/**
 * Shared prefers-reduced-motion subscription. Every new ASCII behavior and
 * every new section built in the market redesign reads this instead of
 * rolling its own matchMedia check. Existing components keep their inline
 * checks — not retrofitted here to avoid touching working code.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
