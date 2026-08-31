import { NavLink } from "react-router-dom";
import AsciiIcon from "../ascii/AsciiIcon";
import type { AsciiIconName } from "../ascii/icons";
import "./Nav.css";

const LINKS: { to: string; label: string; icon: AsciiIconName }[] = [
  { to: "/archive", label: "ARCHIVE", icon: "archive" },
  { to: "/operations", label: "OPERATIONS", icon: "motion" },
  { to: "/contract", label: "CONTRACT", icon: "contract" },
];

export default function Nav() {
  return (
    <header className="kvn-nav">
      <NavLink to="/" className="kvn-nav__logo">
        KVN
      </NavLink>

      <nav className="kvn-nav__links">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `kvn-nav__link ${isActive ? "is-active" : ""}`}
          >
            <span className="kvn-nav__link-icon">
              <AsciiIcon name={link.icon} size="sm" animate={false} />
            </span>
            <span className="kvn-nav__link-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
