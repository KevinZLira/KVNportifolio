import { Link } from "react-router-dom";
import { plugins } from "../data/plugins";
import AsciiIcon from "../ascii/AsciiIcon";
import FileHeader from "../system/FileHeader";
import StatusLabel from "../system/StatusLabel";
import { useReveal } from "../system/useReveal";
import "./Plugins.css";

const STATUS_MAP = {
  AVAILABLE: { status: "available" as const, label: "AVAILABLE" },
  COMING_SOON: { status: "pending" as const, label: "COMING SOON" },
  SOLD_OUT: { status: "locked" as const, label: "SOLD OUT" },
};

function PluginRow({ plugin }: { plugin: (typeof plugins)[number] }) {
  const ref = useReveal<HTMLDivElement>();
  const mapped = STATUS_MAP[plugin.status];
  const canBuy = plugin.status === "AVAILABLE" && plugin.buyUrl;

  return (
    <div className="plugin-row" ref={ref}>
      <span className="plugin-row__icon">
        <AsciiIcon name="plugin" size="md" />
      </span>

      <div className="plugin-row__main">
        <div className="plugin-row__title-line">
          <h2 className="plugin-row__name">{plugin.name}</h2>
          <StatusLabel status={mapped.status} label={mapped.label} />
        </div>
        <p className="plugin-row__tagline">{plugin.tagline}</p>
        <p className="plugin-row__desc">{plugin.description}</p>
        <span className="plugin-row__compat">{plugin.compatibility}</span>
      </div>

      <div className="plugin-row__side">
        <span className="plugin-row__price">{plugin.price}</span>
        {canBuy ? (
          <a href={plugin.buyUrl} className="plugin-row__cta" target="_blank" rel="noreferrer">
            [ BUY ]
          </a>
        ) : (
          <Link to="/contract" className="plugin-row__cta plugin-row__cta--muted">
            [ NOTIFY ME ]
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Plugins() {
  return (
    <div className="plugins-page">
      <div className="plugins-page__intro">
        <FileHeader index="EXT" title="PLUGINS" />
        <p className="plugins-page__lede">
          Tools built for Premiere Pro, released independently of client
          work. Small, focused, no bloat.
        </p>
      </div>

      <div className="plugins-list">
        {plugins.map((p) => (
          <PluginRow key={p.slug} plugin={p} />
        ))}
      </div>
    </div>
  );
}
