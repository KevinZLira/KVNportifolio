// Lightweight signal bus for cross-cutting raccoon reactions (project
// category hovered, an error surfaced, etc). Same pattern as lib/toast.ts —
// kept outside React state so emitting on every hover doesn't re-render
// anything; only the single mounted RaccoonCreature listens.

export type RaccoonSignal =
  | { type: "project-category"; category: string | null }
  | { type: "error-seen" }
  | { type: "celebrate" };

const bus = new EventTarget();

export function emitRaccoonSignal(signal: RaccoonSignal) {
  bus.dispatchEvent(new CustomEvent("raccoon-signal", { detail: signal }));
}

export function subscribeRaccoonSignal(cb: (signal: RaccoonSignal) => void) {
  function handler(e: Event) {
    cb((e as CustomEvent).detail);
  }
  bus.addEventListener("raccoon-signal", handler);
  return () => bus.removeEventListener("raccoon-signal", handler);
}
