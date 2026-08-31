// Tiny WebAudio SFX engine — no external audio files.
// Everything here is generated at runtime so the "sound layer"
// costs nothing on load and can be toggled instantly.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface Tone {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  glide?: number;
}

function playTone({ freq, duration, type = "square", gain = 0.05, delay = 0, glide }: Tone) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  const t0 = audio.currentTime + delay;
  osc.frequency.setValueAtTime(freq, t0);
  if (glide) osc.frequency.linearRampToValueAtTime(glide, t0 + duration);
  amp.gain.setValueAtTime(0, t0);
  amp.gain.linearRampToValueAtTime(gain, t0 + 0.008);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

let enabled = false;
export function setSfxEnabled(v: boolean) {
  enabled = v;
}
export function isSfxEnabled() {
  return enabled;
}

export const sfx = {
  hover: () => enabled && playTone({ freq: 1400, duration: 0.035, type: "square", gain: 0.02 }),
  click: () =>
    enabled &&
    playTone({ freq: 720, duration: 0.05, type: "square", gain: 0.045, glide: 340 }),
  confirm: () => {
    if (!enabled) return;
    playTone({ freq: 660, duration: 0.06, gain: 0.04 });
    playTone({ freq: 990, duration: 0.09, gain: 0.04, delay: 0.06 });
  },
  error: () => {
    if (!enabled) return;
    playTone({ freq: 180, duration: 0.14, type: "sawtooth", gain: 0.05 });
  },
  boot: () => enabled && playTone({ freq: 220, duration: 0.4, type: "sine", gain: 0.03, glide: 60 }),
  glitch: () =>
    enabled &&
    playTone({ freq: 2200 + Math.random() * 800, duration: 0.02, type: "sawtooth", gain: 0.02 }),
  toggle: () => enabled && playTone({ freq: 900, duration: 0.03, gain: 0.03 }),
};
