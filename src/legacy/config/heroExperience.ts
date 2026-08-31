// Hero's visual experience is swappable between independent implementations —
// change this one value to switch, with no code deleted and no rebuild of any
// of them. Each mode is its own self-contained component; only one renders.
//
// "object_viewer" / "time_field" / "creative_system" are sub-modes of
// Hero.tsx itself (it picks which fills its right-side slot). "artifact" and
// "minimal" are different animals — full alternative hero sections (see
// Home.tsx) with their own layout and copy, rendered instead of Hero.tsx
// entirely. "minimal" is the editorial/typography-led revision of
// "artifact": logo, one line of copy, specialties, one CTA, a couple of
// small texture details — no 3D object, no HUD. Nothing from any other mode
// is deleted by switching this value; every mode's code stays in the repo
// so this stays a one-line, fully reversible A/B toggle.
export type HeroMode = "object_viewer" | "time_field" | "creative_system" | "artifact" | "minimal";

export const HERO_MODE: HeroMode = "minimal";
