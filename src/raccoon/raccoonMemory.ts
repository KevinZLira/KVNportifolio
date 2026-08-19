// Module-scoped, non-reactive state shared by every raccoon instance.
// Lives outside React on purpose: input tracking and cooldowns must
// survive the creature unmounting/remounting as it hops between
// section spots, without forcing re-renders on every mousemove.

const VISITED_KEY = "kvn_raccoon_visited";

export const raccoonMemory = {
  mouse: { x: -9999, y: -9999 },
  lastInputAt: Date.now(),
  lastClick: null as { x: number; y: number; t: number } | null,
  lastStealAttemptAt: 0,
  hasGreetedThisSession: false,
};

export function msSinceInput() {
  return Date.now() - raccoonMemory.lastInputAt;
}

export function isReturningVisitor(): boolean {
  try {
    return window.localStorage.getItem(VISITED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markVisited() {
  try {
    window.localStorage.setItem(VISITED_KEY, "1");
  } catch {
    // storage unavailable — first-visit greeting will just replay next time
  }
}

let listenersBound = false;

export function bindGlobalInputTracking() {
  if (listenersBound || typeof window === "undefined") return;
  listenersBound = true;

  const bump = () => {
    raccoonMemory.lastInputAt = Date.now();
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      raccoonMemory.mouse.x = e.clientX;
      raccoonMemory.mouse.y = e.clientY;
      bump();
    },
    { passive: true },
  );
  window.addEventListener(
    "click",
    (e) => {
      raccoonMemory.lastClick = { x: e.clientX, y: e.clientY, t: Date.now() };
      bump();
    },
    { passive: true },
  );
  ["keydown", "wheel", "scroll", "touchstart"].forEach((type) => {
    window.addEventListener(type, bump, { passive: true });
  });
}
