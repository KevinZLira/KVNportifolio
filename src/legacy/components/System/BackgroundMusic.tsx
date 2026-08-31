import { useEffect, useRef } from "react";
import { useSystem } from "../../state/SystemContext";

const TRACK_URL = "/audio/neon-static.mp3";
const VOLUME = 0.35;

// Mounted once in AppShell (alongside SystemBar) so the <audio> element and
// its playback position survive route changes — it isn't tied to any one
// page. Plays/pauses strictly off the same sfxOn flag the SFX:ON/OFF toggle
// already drives; no separate on/off control of its own.
export default function BackgroundMusic() {
  const { sfxOn } = useSystem();
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
    if (sfxOn) {
      // toggleSfx() runs this state update from inside a click handler, so
      // this play() call still lands close enough to the user gesture for
      // autoplay policies — but browsers can still reject it (e.g. a second
      // rapid toggle racing an earlier pause), so this is swallowed rather
      // than surfaced as an unhandled rejection.
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [sfxOn]);

  return <audio ref={audioRef} src={TRACK_URL} loop preload="none" />;
}
