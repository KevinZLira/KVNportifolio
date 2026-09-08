import { useEffect, useRef } from "react";

// Subtle scroll-linked depth offset for decorative/background layers only —
// translate3d driven by one passive scroll listener per instance (there are
// only ever a handful of these on a page), rAF-throttled. Disabled under
// reduced motion and on touch/coarse pointers, where the effect is neither
// visible nor desired. Never apply this to primary content — only backdrops,
// grid lines and other non-load-bearing texture.
export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    function update() {
      raf = 0;
      const rect = el!.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el!.style.transform = `translate3d(0, ${(-center * speed).toFixed(2)}px, 0)`;
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}
