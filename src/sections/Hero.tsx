import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionLabel } from "../hooks/useSectionLabel";
import "./Hero.css";

export default function Hero() {
  const sectionRef = useSectionLabel<HTMLElement>("KVN_SYSTEM");
  const layerRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(hover: none)").matches;

    // entrance — scoped context so StrictMode's mount/cleanup/mount cycle
    // can fully revert a half-finished timeline instead of leaving two
    // competing tweens fighting over the same transform.
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          delay: reduce ? 0 : 0.1,
          onComplete: () => titleRef.current?.classList.remove("is-revealing"),
        })
        .from(".hero-line", {
          yPercent: reduce ? 0 : 110,
          duration: reduce ? 0 : 0.9,
          stagger: reduce ? 0 : 0.08,
          ease: "power4.out",
        })
        .from(
          ".hero-meta-item",
          {
            opacity: reduce ? 1 : 0,
            y: reduce ? 0 : 10,
            duration: reduce ? 0 : 0.5,
            stagger: reduce ? 0 : 0.06,
            ease: "power2.out",
          },
          reduce ? 0 : "-=0.3",
        );
    }, section);

    if (reduce || isCoarse) {
      return () => ctx.revert();
    }

    const el = section;
    let raf = 0;
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (layerRef.current) {
          layerRef.current.style.transform = `translate(${x * -16}px, ${y * -10}px)`;
        }
        if (titleRef.current) {
          titleRef.current.style.transform = `translate(${x * 10}px, ${y * 6}px) rotate(${x * 0.6}deg)`;
        }
        if (coordRef.current) {
          coordRef.current.textContent = `X:${Math.round(e.clientX)
            .toString()
            .padStart(4, "0")} Y:${Math.round(e.clientY).toString().padStart(4, "0")}`;
        }
      });
    }

    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [sectionRef]);

  return (
    <section ref={sectionRef} id="hero" className="hero">
      <div className="hero-hud t-mono">
        <span>/SYSTEM/HOME</span>
        <span ref={coordRef} className="hero-hud-coords">
          X:0000 Y:0000
        </span>
      </div>

      <div ref={layerRef} className="hero-layer">
        <div ref={titleRef} className="hero-title is-revealing">
          <div className="hero-line-wrap">
            <h1 className="hero-line hero-logo" aria-label="KVN">
              <svg
                className="hero-logo-mark"
                viewBox="10 190 1900 700"
                aria-hidden="true"
                focusable="false"
              >
                <polygon
                  className="hero-logo-white"
                  points="522.88 574.78 681.94 574.78 1052.72 204 787.8 204 469.95 521.85 443.49 495.38 442.96 495.38 734.34 204 501.84 204 501.86 203.98 186.26 203.98 327.85 345.57 29.22 644.21 29.22 760.3 178.04 760.3 310.9 627.71 443.49 760.3 553.64 870.45 702.65 870.73 702.65 754.54 677.84 729.73 522.88 574.78"
                />
                <polygon
                  className="hero-logo-white"
                  points="1580.86 204 1078.84 706.02 974.62 601.81 1311.23 265.2 1250.32 204.3 1106.95 204.3 709.57 601.67 868.49 760.6 1133.41 760.6 1610.33 283.66 1663.26 283.66 1186.62 760.3 1451.54 760.3 1891.74 320.09 1891.74 204 1580.86 204"
                />
                <path
                  className="hero-logo-accent"
                  d="M1075.23,655.55l451.93-451.79h-109.61l-396.89,397.23,54.56,54.56ZM1424.14,219.71h64.65l-413.56,413.28-32.08-32,380.99-381.27Z"
                />
              </svg>
            </h1>
          </div>
          <div className="hero-line-wrap">
            <p className="hero-line hero-role t-display">DESIGNER / VIDEO MAKER</p>
          </div>
        </div>

        <p className="hero-sub t-mono">
          CREATING VISUAL SYSTEMS FOR THE DIGITAL WORLD<span className="blink">_</span>
        </p>
      </div>

      <div className="hero-meta t-mono">
        <span className="hero-meta-item">LOCATION: SAO PAULO / BR</span>
        <span className="hero-meta-item">STATUS: ● AVAILABLE FOR WORK</span>
        <span className="hero-meta-item hero-meta-scroll">
          SCROLL TO ACCESS DATABASE <span className="hero-meta-arrow">↓</span>
        </span>
      </div>

      <div className="hero-grid" aria-hidden="true" />
    </section>
  );
}
