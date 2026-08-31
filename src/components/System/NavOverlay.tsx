import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { sfx } from "../../lib/sound";
import { useSystem } from "../../state/SystemContext";
import "./NavOverlay.css";

interface NavItem {
  index: string;
  label: string;
  target: string;
  filter?: string;
}

const ITEMS: NavItem[] = [
  { index: "00", label: "SYSTEM", target: "hero" },
  { index: "01", label: "OPERATIONS", target: "operations" },
  { index: "02", label: "WORK", target: "work" },
  { index: "03", label: "VIDEO", target: "work", filter: "VIDEO" },
  { index: "04", label: "DESIGN", target: "work", filter: "DESIGN" },
  { index: "05", label: "ABOUT", target: "about" },
  { index: "06", label: "CONTACT", target: "contact" },
];

export default function NavOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { requestFilter } = useSystem();

  useEffect(() => {
    if (!rootRef.current) return;
    if (open) {
      gsap.set(rootRef.current, { display: "flex" });
      gsap.fromTo(
        rootRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power4.out" },
      );
      gsap.fromTo(
        rootRef.current.querySelectorAll(".nav-item"),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.15, ease: "power3.out" },
      );
    } else {
      gsap.to(rootRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => gsap.set(rootRef.current, { display: "none" }),
      });
    }
  }, [open]);

  function goTo(item: NavItem) {
    sfx.click();
    if (item.filter) requestFilter(item.filter);
    onClose();
    const scroll = () =>
      document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scroll, 80);
    } else {
      scroll();
    }
  }

  return (
    <div ref={rootRef} className="nav-overlay" style={{ display: "none" }}>
      <div className="nav-overlay-noise" />
      <nav className="nav-list">
        {ITEMS.map((item) => (
          <button
            key={item.index + item.label}
            type="button"
            className="nav-item"
            onClick={() => goTo(item)}
            onMouseEnter={() => sfx.hover()}
          >
            <span className="nav-item-index t-mono">{item.index}</span>
            <span className="nav-item-label t-display">{item.label}</span>
            <span className="nav-item-arrow" aria-hidden="true">
              →
            </span>
          </button>
        ))}
      </nav>
      <button type="button" className="nav-close t-mono" onClick={onClose}>
        [ CLOSE_ ]
      </button>
      <div className="nav-footer t-mono">
        <span>/SYSTEM/NAVIGATION</span>
        <span>ESC TO CLOSE</span>
      </div>
    </div>
  );
}
