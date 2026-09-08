import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { plugins, upcomingPlugins } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import { sfx } from "../lib/sound";
import PluginHero from "../sections/plugins/PluginHero";
import ProductSpotlight from "../sections/plugins/ProductSpotlight";
import WorkflowCompare from "../sections/plugins/WorkflowCompare";
import PluginBenefits from "../sections/plugins/PluginBenefits";
import PluginDemo from "../sections/plugins/PluginDemo";
import HowItWorks from "../sections/plugins/HowItWorks";
import PurchaseCTA from "../sections/plugins/PurchaseCTA";
import UpcomingSystems from "../sections/plugins/UpcomingSystems";
import "./Plugins.css";

gsap.registerPlugin(ScrollTrigger);

// Commercial landing page for the KVN plugin catalog — deliberately more
// direct than the Home experience (see PROBLEM -> SOLUTION -> PRODUCT ->
// BENEFITS -> DEMO -> PRICE -> PURCHASE order below). `plugins[0]` is the
// only shipped product today; every section below is written against the
// Plugin/UpcomingPlugin shape in src/data/plugins.ts, so a second product
// is a data change, not a rebuild of this page.
export default function Plugins() {
  const navigate = useNavigate();
  const { setSectionLabel } = useSystem();
  const plugin = plugins[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSectionLabel("KVN_SYSTEMS");
  }, [setSectionLabel]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(".spotlight-frame", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".spotlight-frame", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".workflow-step--old", {
        opacity: 0,
        x: -16,
        duration: 0.35,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: ".workflow-col--old", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".workflow-step--new", {
        opacity: 0,
        y: 20,
        duration: 0.45,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".workflow-col--new", start: "top 80%", toggleActions: "play none none reverse" },
      });

      gsap.from(".benefit", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".benefits-grid", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".how-step", {
        opacity: 0,
        y: 16,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".how-steps", start: "top 85%", toggleActions: "play none none reverse" },
      });

      gsap.from(".upcoming-card", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".upcoming-list", start: "top 88%", toggleActions: "play none none reverse" },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <article className="plugins-page">
      <div className="plugins-top t-mono">
        <span className="plugins-path">/SYSTEM/PLUGINS</span>
        <button
          type="button"
          className="plugins-back"
          onClick={() => {
            sfx.click();
            navigate("/");
          }}
          onMouseEnter={() => sfx.hover()}
        >
          ← BACK TO SYSTEM
        </button>
      </div>

      <PluginHero plugin={plugin} />
      <ProductSpotlight plugin={plugin} />
      <WorkflowCompare plugin={plugin} />
      <PluginBenefits plugin={plugin} />
      <PluginDemo plugin={plugin} />
      <HowItWorks plugin={plugin} />
      <PurchaseCTA plugin={plugin} />
      <UpcomingSystems items={upcomingPlugins} />

      <footer className="plugins-footer t-mono">
        <span>KVN_SYSTEMS © 2026</span>
        <span>END OF FILE</span>
      </footer>
    </article>
  );
}
