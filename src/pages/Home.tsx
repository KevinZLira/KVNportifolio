import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../sections/Hero";
import WorkDatabase from "../sections/WorkDatabase";
import About from "../sections/About";
import Contact from "../sections/Contact";

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
      <Hero />
      <WorkDatabase />
      <About />
      <Contact />
    </>
  );
}
