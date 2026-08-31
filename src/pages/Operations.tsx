import { Link } from "react-router-dom";
import AsciiIcon from "../ascii/AsciiIcon";
import type { AsciiIconName } from "../ascii/icons";
import FileHeader from "../system/FileHeader";
import { useReveal } from "../system/useReveal";
import "./Operations.css";

interface Operation {
  index: string;
  name: string;
  icon: AsciiIconName;
  items: string[];
}

const OPERATIONS: Operation[] = [
  {
    index: "01",
    name: "DESIGN",
    icon: "design",
    items: ["Visual identity", "Art direction", "Graphic design"],
  },
  {
    index: "02",
    name: "MOTION",
    icon: "motion",
    items: ["Motion design", "Animation", "Titles"],
  },
  {
    index: "03",
    name: "VIDEO",
    icon: "video",
    items: ["Editing", "Production", "Visual storytelling"],
  },
];

function OperationRow({ op }: { op: Operation }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div className="operation-row" ref={ref}>
      <span className="operation-row__index">{op.index}</span>

      <div className="operation-row__main">
        <h2 className="operation-row__name">{op.name}</h2>
        <ul className="operation-row__items">
          {op.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <span className="operation-row__icon">
        <AsciiIcon name={op.icon} size="lg" />
      </span>
    </div>
  );
}

export default function Operations() {
  return (
    <div className="operations-page">
      <div className="operations-page__intro">
        <FileHeader index="03" title="OPERATIONS" />
        <p className="operations-page__lede">
          Three capabilities. No packages, no tiers — every operation is
          scoped to the brief.
        </p>
      </div>

      <div className="operations-list">
        {OPERATIONS.map((op) => (
          <OperationRow key={op.index} op={op} />
        ))}
      </div>

      <div className="operations-page__cta">
        <Link to="/contract" className="operations-page__cta-link">
          [ INITIATE CONTRACT ]
        </Link>
      </div>
    </div>
  );
}
