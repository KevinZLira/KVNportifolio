import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFaqForPlugin, getOtherPlugin, getPluginBySlug, getPurchaseHref } from "../data/plugins";
import { useSystem } from "../state/SystemContext";
import { sfx } from "../lib/sound";
import DetailNav from "../sections/plugins/DetailNav";
import PainMini from "../sections/plugins/PainMini";
import PluginSection from "../sections/plugins/PluginSection";
import WorkflowPhilosophy from "../sections/plugins/WorkflowPhilosophy";
import BenefitsGrid from "../sections/plugins/BenefitsGrid";
import DemoSection from "../sections/plugins/DemoSection";
import FAQSection from "../sections/plugins/FAQSection";
import PluginsFooter from "../sections/plugins/PluginsFooter";
import "./PluginDetail.css";

gsap.registerPlugin(ScrollTrigger);

export default function PluginDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setSectionLabel } = useSystem();
  const item = getPluginBySlug(slug);
  const other = item ? getOtherPlugin(item.slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSectionLabel(item ? item.name.toUpperCase() : "PLUGIN_NOT_FOUND");
  }, [item, setSectionLabel]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !item) return;

    const ctx = gsap.context(() => {
      gsap.from(".pfeature", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".pfeature", start: "top 85%", toggleActions: "play none none reverse" },
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
        ease: "power2.out",
        scrollTrigger: { trigger: ".demo2-card", start: "top 85%", toggleActions: "play none none reverse" },
      });
    });

    return () => ctx.revert();
  }, [item]);

  if (!item) {
    return (
      <div className="plugin-detail-missing t-mono">
        <p>ERRO 404: PLUGIN NÃO ENCONTRADO</p>
        <button type="button" className="plugin-detail-back" onClick={() => navigate("/plugins")}>
          [ VOLTAR AOS PLUGINS ]
        </button>
      </div>
    );
  }

  return (
    <article className="plugin-detail">
      <DetailNav item={item} />

      <div className="plugin-detail-top t-mono">
        <span className="plugin-detail-path">/SISTEMA/PLUGINS/{item.slug}</span>
      </div>

      <PainMini item={item} />
      <PluginSection item={item} />
      <WorkflowPhilosophy item={item} />
      <BenefitsGrid />
      <DemoSection item={item} />
      <FAQSection items={getFaqForPlugin(item.slug)} />

      {other && (
        <section className="cross-sell">
          <span className="cross-sell-label t-mono">TAMBÉM NA KVN</span>
          <Link
            to={`/plugins/${other.slug}`}
            className="cross-sell-card"
            onMouseEnter={() => sfx.hover()}
            onClick={() => sfx.click()}
          >
            <span className="cross-sell-name t-display">{other.name}</span>
            <span className="cross-sell-pitch t-mono">{other.pitch}</span>
            <span className="cross-sell-cta t-mono">
              VER PLUGIN
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </section>
      )}

      <PluginsFooter purchaseHref={getPurchaseHref(item.name, item.purchaseUrl)} showFaqAnchor />
    </article>
  );
}
