import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../sections/Hero";
import ArtifactHero from "../sections/ArtifactHero";
import MinimalHero from "../sections/MinimalHero";
import Operations from "../sections/Operations";
import WorkDatabase from "../sections/WorkDatabase";
import MarketArchive from "../sections/MarketArchive";
import About from "../sections/About";
import Contact from "../sections/Contact";
import { HERO_MODE } from "../config/heroExperience";
import { ARCHIVE_MODE } from "../config/archiveExperience";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".workdb-row").forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          y: 30,
          duration: 0.5,
          ease: "power2.out",
          delay: (i % 6) * 0.02,
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".market-archive-tile").forEach((tile, i) => {
        gsap.from(tile, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          ease: "power2.out",
          delay: (i % 6) * 0.03,
          scrollTrigger: {
            trigger: tile,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });

      [".about-heading", ".contact-heading"].forEach((sel) => {
        gsap.from(sel, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sel,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.from(".operations-row", {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".operations-list",
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".sw-module", {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sw-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".about-field", {
        opacity: 0,
        x: -16,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-col--info",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-channel, .contact-transmit", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {HERO_MODE === "artifact" ? (
        <ArtifactHero />
      ) : HERO_MODE === "minimal" ? (
        <MinimalHero />
      ) : (
        <Hero />
      )}
      <Operations />
      {ARCHIVE_MODE === "market" ? <MarketArchive /> : <WorkDatabase />}
      <About />
      <Contact />
    </>
  );
}
