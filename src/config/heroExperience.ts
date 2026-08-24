// Hero's visual experience is swappable between independent implementations —
// change this one value to switch, with no code deleted and no rebuild of any
// of them. Each mode is its own self-contained component; only one renders.
//
// "object_viewer" / "time_field" / "creative_system" are sub-modes of
// Hero.tsx itself (it picks which fills its right-side slot). "artifact" is
// a different animal — a full alternative hero section (see App.tsx/Home.tsx)
// with its own layout and copy, rendered instead of Hero.tsx entirely.
export type HeroMode = "object_viewer" | "time_field" | "creative_system" | "artifact";

export const HERO_MODE: HeroMode = "artifact";
