import { useEffect, useRef } from "react";
import { useSystem } from "../../state/SystemContext";

const TRACK_URL = "/audio/cold-rain-noise.mp3";
const VOLUME = 0.35;

// Mounted once in AppShell (alongside SystemBar) so the <audio> element and
// its playback position survive route changes — it isn't tied to any one
// page. Plays/pauses strictly off the same sfxOn flag the SFX:ON/OFF toggle
// already drives; no separate on/off control of its own.
export default function BackgroundMusic() {
  const { sfxOn, systemState } = useSystem();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Set imperatively rather than via a `volume` prop -- it's a DOM
    // property, not an HTML attribute, and doing it here (once, on mount)
    // is unambiguous about when it actually applies.
    if (audioRef.current) audioRef.current.volume = VOLUME;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // sfxOn now defaults to true, so this component's very first mount
    // (during BOOT, no user gesture yet) would otherwise attempt play()
    // immediately and get silently blocked by autoplay policy, with
    // nothing to ever retry it. Gating on systemState === "ONLINE" ties
    // the actual play() attempt to the ENTER SYSTEM click instead — a
    // real user gesture, which autoplay policies allow.
    if (sfxOn && systemState === "ONLINE") {
      // Still swallowed rather than surfaced as an unhandled rejection —
      // browsers can reject even a gesture-adjacent play() (e.g. a second
      // rapid toggle racing an earlier pause).
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [sfxOn, systemState]);

  return <audio ref={audioRef} src={TRACK_URL} loop preload="none" />;
}
