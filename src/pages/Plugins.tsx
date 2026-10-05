import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { plugins } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import PluginsNav from "../sections/plugins/PluginsNav";
import PluginsHero from "../sections/plugins/PluginsHero";
import PainSection from "../sections/plugins/PainSection";
import PluginSection from "../sections/plugins/PluginSection";
import ComparisonSection from "../sections/plugins/ComparisonSection";
import ComboOffer from "../sections/plugins/ComboOffer";
import WorkflowPhilosophy from "../sections/plugins/WorkflowPhilosophy";
import BenefitsGrid from "../sections/plugins/BenefitsGrid";
import DemoSection from "../sections/plugins/DemoSection";
import FinalOffer from "../sections/plugins/FinalOffer";
import FAQSection from "../sections/plugins/FAQSection";
import PluginsFooter from "../sections/plugins/PluginsFooter";
import "./Plugins.css";

gsap.registerPlugin(ScrollTrigger);

// High-conversion sales page for the two KVN Premiere plugins (Copy & Pasta,
// YouTube Importer) + the combo offer. Progressive-sale order per brief:
// hero -> pain -> product 01 -> product 02 -> comparison -> combo ->
// philosophy/how-it-works -> benefits -> demo -> final offer -> FAQ.
// All copy, prices and claims come from src/data/plugins.ts — no invented
// testimonials, user counts, reviews, refund policy or install/compat
// details; anywhere that info is missing the data carries an explicit
// placeholder instead.
export default function Plugins() {
  const { setSectionLabel } = useSystem();
  const [copyPasta, youtubeImporter] = plugins;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSectionLabel("KVN_PLUGINS");
  }, [setSectionLabel]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(".pfeature", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".pfeature", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".compare-col", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".compare-grid", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".combo-card", {
        opacity: 0,
        y: 24,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: ".combo-card", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".phil-example", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".phil-examples", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".bgrid-card", {
        opacity: 0,
        y: 16,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: ".bgrid", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".demo2-card", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".demo2-grid", start: "top 85%", toggleActions: "play none none reverse" },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <article className="plugins-page">
      <PluginsNav />
      <PluginsHero />
      <PainSection />

      <div className="plugins-stack" id="plugins">
        <PluginSection item={copyPasta} />
        <PluginSection item={youtubeImporter} reverse />
      </div>

      <ComparisonSection items={plugins} />
      <ComboOffer />
      <WorkflowPhilosophy items={plugins} />
      <BenefitsGrid />
      <DemoSection items={plugins} />
      <FinalOffer items={plugins} />
      <FAQSection />
      <PluginsFooter />
    </article>
  );
}
