import { useEffect, useRef } from "react";
import { useSystem } from "../state/SystemContext";

// Registers a section as the active one (updates the top bar's
// breadcrumb-like label) whenever it crosses the middle of the viewport.
export function useSectionLabel<T extends HTMLElement>(label: string) {
  const ref = useRef<T>(null);
  const { setSectionLabel } = useSystem();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSectionLabel(label);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return ref;
}
