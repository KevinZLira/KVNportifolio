import { useSectionLabel } from "../hooks/useSectionLabel";
import { sfx } from "../lib/sound";
import RaccoonSpot from "../raccoon/RaccoonSpot";
import "./About.css";

const ROLES = ["GRAPHIC DESIGNER", "VIDEO MAKER", "MOTION DESIGNER"];

const SOFTWARE = [
  { code: "SW_01", name: "PHOTOSHOP", level: 96 },
  { code: "SW_02", name: "ILLUSTRATOR", level: 90 },
  { code: "SW_03", name: "PREMIERE PRO", level: 97 },
  { code: "SW_04", name: "AFTER EFFECTS", level: 88 },
  { code: "SW_05", name: "BLENDER", level: 64 },
  { code: "SW_06", name: "FIGMA", level: 84 },
];

const INTERESTS = [
  "DESIGN",
  "MOTION",
  "VIDEO",
  "TECHNOLOGY",
  "AUTOMOTIVE",
  "GAMES",
  "DIGITAL CULTURE",
];

function SoftwareModule({ code, name, level }: { code: string; name: string; level: number }) {
  const segments = 12;
  const filled = Math.round((level / 100) * segments);
  return (
    <div className="sw-module t-mono" onMouseEnter={() => sfx.hover()}>
      <div className="sw-module-top">
        <span className="sw-code">{code}</span>
        <span className="sw-level">{level}%</span>
      </div>
      <div className="sw-name t-display">{name}</div>
      <div className="sw-bar" aria-hidden="true">
        {Array.from({ length: segments }).map((_, i) => (
          <span key={i} className={i < filled ? "is-filled" : ""} />
        ))}
      </div>
      <div className="sw-status">STATUS: OPERATIONAL</div>
    </div>
  );
}

export default function About() {
  const sectionRef = useSectionLabel<HTMLElement>("USER_PROFILE");

  return (
    <section ref={sectionRef} id="about" className="about">
      <div className="about-header">
        <span className="about-comment t-mono">// USER_PROFILE</span>
        <h2 className="about-heading t-display">KEVIN LIRA</h2>
      </div>

      <div className="about-grid">
        <div className="about-col about-col--info t-mono">
          <div className="about-field">
            <span className="about-field-key">NAME</span>
            <span className="about-field-value">KEVIN LIRA</span>
          </div>
          <div className="about-field">
            <span className="about-field-key">ROLE</span>
            <span className="about-field-value about-roles">
              {ROLES.map((r) => (
                <span key={r} className="about-role">
                  {r}
                </span>
              ))}
            </span>
          </div>
          <div className="about-field">
            <span className="about-field-key">LOCATION</span>
            <span className="about-field-value">
              SAO PAULO / BRAZIL
              <span className="about-coords"> [-23.5505, -46.6333]</span>
            </span>
          </div>
          <div className="about-field">
            <span className="about-field-key">INTERESTS</span>
            <span className="about-field-value about-interests">
              {INTERESTS.map((tag, i) => (
                <span key={tag} className="about-tag">
                  <span className="about-tag-id">{String(i + 1).padStart(2, "0")}</span>
                  {tag}
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="about-col about-col--software">
          <span className="about-software-label t-mono">SOFTWARE</span>
          <div className="about-wall-scene">
            <RaccoonSpot
              id="about-wall"
              layer="behind_ui"
              wanderRadius={6}
              wrapperClassName="about-wall-raccoon-spot"
              cell={3}
            />
            <div className="sw-grid">
              {SOFTWARE.map((sw) => (
                <SoftwareModule key={sw.code} {...sw} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
