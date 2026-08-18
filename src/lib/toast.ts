// Minimal event bus for the short-lived "system message" toasts
// (HOVER DETECTED, COMMAND EXECUTED, IMAGE_BUFFER 74%...). Kept
// outside React state so firing one on every hover doesn't cost a
// context re-render.

const bus = new EventTarget();

export function emitToast(text: string, duration = 900) {
  bus.dispatchEvent(new CustomEvent("toast", { detail: { text, duration } }));
}

export function subscribeToast(cb: (text: string, duration: number) => void) {
  function handler(e: Event) {
    const { text, duration } = (e as CustomEvent).detail;
    cb(text, duration);
  }
  bus.addEventListener("toast", handler);
  return () => bus.removeEventListener("toast", handler);
}
