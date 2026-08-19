import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionLabel } from "../hooks/useSectionLabel";
import RaccoonSpot from "../raccoon/RaccoonSpot";
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
            <h1 className="hero-line t-display">KVN LIRA</h1>
          </div>
          <div className="hero-line-wrap">
            <p className="hero-line hero-role t-display">VISUAL DESIGNER / VIDEO MAKER</p>
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

      <RaccoonSpot
        id="hero-mascot"
        layer="near_foreground"
        wanderRadius={0}
        wrapperClassName="hero-mascot-spot"
        cell={8}
        fleeOnScroll
        isFirstVisitSpot
      />
    </section>
  );
}
