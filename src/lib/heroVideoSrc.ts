// Shared between MinimalHero (the real, visible background video) and
// BootSequence (a hidden warm-up video, same URL, started during the boot
// screen so the browser has already fetched/decoded the resource by the
// time the real one appears — avoiding the stutter of a cold video start
// right as the Hero mounts). Both must resolve to the exact same URL for
// the warm-up to actually help.

export const HERO_VIDEO_4K = "/video/hero-bg.mp4";
export const HERO_VIDEO_1080P = "/video/hero-bg-1080p.mp4";

/** True when the physical monitor exceeds Full HD — screen.width/height are
 * already in CSS px, so devicePixelRatio converts them to actual device
 * pixels (a 1920x1080 CSS viewport at dpr 2, e.g. many "4K" laptop panels
 * run scaled, is genuinely a 4K panel). */
export function isHiResDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const dpr = window.devicePixelRatio || 1;
  const physicalWidth = window.screen.width * dpr;
  const physicalHeight = window.screen.height * dpr;
  return Math.max(physicalWidth, physicalHeight) > 1920;
}

export function getHeroVideoSrc(): string {
  return isHiResDisplay() ? HERO_VIDEO_4K : HERO_VIDEO_1080P;
}

/** Same gating MinimalHero uses for its own autoplay — no point warming up
 * a video loop that won't autoplay anyway (reduced motion / mobile). */
export function shouldSkipHeroVideoAutoplay(): boolean {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 640px), (hover: none)").matches
  );
}
