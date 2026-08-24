// Hero's visual experience is swappable between independent implementations —
// change this one value to switch, with no code deleted and no rebuild of any
// of them. Each mode is its own self-contained component; only one renders.
export type HeroMode = "object_viewer" | "time_field" | "creative_system";

export const HERO_MODE: HeroMode = "creative_system";
