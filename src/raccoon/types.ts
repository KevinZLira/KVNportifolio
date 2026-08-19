export type RaccoonBehavior =
  | "hidden"
  | "peek_ears"
  | "peek_eyes"
  | "emerging"
  | "greeting_wave"
  | "idle_stand"
  | "idle_sit"
  | "walking"
  | "watching_cursor"
  | "curious"
  | "hiding"
  | "sleeping"
  | "waking"
  | "startled"
  | "glitching"
  | "eating"
  | "confused"
  | "excited"
  | "steal_observe"
  | "steal_approach"
  | "steal_reach"
  | "steal_run"
  | "steal_return"
  | "petted"
  | "fleeing";

export type RaccoonLayer =
  | "background"
  | "behind_ui"
  | "between_ui"
  | "front_decoration"
  | "near_foreground";

export const LAYER_Z: Record<RaccoonLayer, number> = {
  background: -2,
  behind_ui: -1,
  between_ui: 1,
  front_decoration: 4,
  near_foreground: 8,
};

export interface SpotDefinition {
  id: string;
  layer: RaccoonLayer;
  /** px the raccoon may wander left/right of its anchor while walking */
  wanderRadius: number;
}
