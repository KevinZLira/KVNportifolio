import { useClock } from "../../hooks/useClock";
import { useSystem } from "../../state/SystemContext";
import { sfx } from "../../lib/sound";
import "./SystemBar.css";

export default function SystemBar({ onMenu }: { onMenu: () => void }) {
  const time = useClock();
  const { sfxOn, toggleSfx, sectionLabel } = useSystem();

  return (
    <header className="sysbar t-mono">
      <div className="sysbar-row">
        <div className="sysbar-cluster">
          <span className="sysbar-logo t-display">KVN_SYS</span>
          <span className="sysbar-dot" aria-hidden="true">
            ●
          </span>
          <span className="sysbar-status">ONLINE</span>
        </div>

        <div className="sysbar-cluster sysbar-cluster--center">
          <span className="sysbar-section">{sectionLabel}</span>
        </div>

        <div className="sysbar-cluster sysbar-cluster--right">
          <span className="sysbar-user">USER: VISITOR_001</span>
          <span className="sysbar-time">{time}</span>
          <button
            type="button"
            className={`sysbar-sfx ${sfxOn ? "is-on" : ""}`}
            onClick={() => {
              toggleSfx();
            }}
            onMouseEnter={() => sfx.hover()}
            aria-pressed={sfxOn}
          >
            SFX:{sfxOn ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            className="sysbar-menu"
            onClick={() => {
              sfx.click();
              onMenu();
            }}
            onMouseEnter={() => sfx.hover()}
          >
            <span>MENU</span>
            <span className="sysbar-menu-icon">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
      <div className="sysbar-rule" />
    </header>
  );
}
