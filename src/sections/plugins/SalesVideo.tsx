import { useState } from "react";
import type { PluginItem } from "../../data/plugins";
import SectionPurchaseLink from "./SectionPurchaseLink";
import "./SalesVideo.css";

export default function SalesVideo({ item }: { item: PluginItem }) {
  const [unavailable, setUnavailable] = useState(false);
  const youtubeUrl = item.youtubeVideoId ? `https://www.youtube-nocookie.com/embed/${item.youtubeVideoId}?rel=0&playsinline=1&hl=pt-BR` : undefined;
  const ready = Boolean(youtubeUrl || item.demoVideo) && !unavailable;

  return (
    <section id="video" className="sales-video lp-container" aria-labelledby="sales-video-heading">
      <div className="sales-video-heading">
        <div>
          <span className="lp-section-label">MENOS ETAPAS. NA PRÁTICA.</span>
          <h2 id="sales-video-heading">Seu próximo atalho.<br /><span>Veja como funciona.</span></h2>
        </div>
        <p>{item.mockup === "console" ? "Da busca ao efeito no seu clipe." : item.mockup === "paste" ? "Da imagem copiada ao seu projeto no Premiere." : "Do link ao seu projeto no Premiere."}<br />Conheça o {item.name} em vídeo.</p>
      </div>
      <div className="sales-video-window">
        <div className="sales-video-bar"><span><i /> {item.name.toUpperCase()}</span><span>DEMONSTRAÇÃO</span></div>
        <div className={`sales-video-frame${ready ? " sales-video-frame--ready" : ""}`}>
          {youtubeUrl ? (
            <iframe
              src={youtubeUrl}
              title={`Vídeo de apresentação do ${item.name}`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : ready ? (
            <video key={item.demoVideo} src={item.demoVideo} poster={item.demoPoster} controls playsInline preload="metadata" aria-label={`Vídeo de apresentação do ${item.name}`} onError={() => setUnavailable(true)} />
          ) : (
            <div className="sales-video-placeholder">
              <span className="sales-video-monogram" aria-hidden="true">{item.mockup === "console" ? "FX" : item.mockup === "paste" ? "C+V" : "URL"}</span>
              <span className="sales-video-status">{unavailable ? "VÍDEO INDISPONÍVEL NO MOMENTO" : "DEMONSTRAÇÃO EM VÍDEO EM BREVE"}</span>
              <p>Enquanto isso, explore o fluxo na prévia interativa.</p>
              <a href="#previa" className="lp-text-link">EXPLORAR A PRÉVIA ↑</a>
            </div>
          )}
        </div>
      </div>
      <SectionPurchaseLink />
      <div className="sales-video-caption"><span>FEITO PARA O SEU FLUXO NO PREMIERE PRO.</span>{item.youtubeVideoId && <a href={`https://www.youtube.com/watch?v=${item.youtubeVideoId}`} target="_blank" rel="noopener noreferrer">ASSISTIR NO YOUTUBE ↗</a>}</div>
    </section>
  );
}
