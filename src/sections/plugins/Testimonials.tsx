import { useState } from "react";
import "./Testimonials.css";

export interface Testimonial {
  id: string;
  comment: string;
  rating?: number;
}

function AnonymousAvatar({ index }: { index: number }) {
  const shapes = [
    <><path d="M16 18h13v13H16zM35 18h13v13H35zM16 37h13v13H16zM35 37h13v13H35z" /><path d="M25 10h14v5H25zM25 53h14v5H25z" opacity=".4" /></>,
    <><path d="m32 10 22 22-22 22L10 32z" opacity=".3" /><path d="m32 19 13 13-13 13-13-13z" /><path d="M30 4h4v8h-4zM30 52h4v8h-4z" /></>,
    <><circle cx="32" cy="32" r="19" fill="none" stroke="currentColor" strokeWidth="5" /><path d="M29 10h6v44h-6zM10 29h44v6H10z" opacity=".65" /></>,
    <><path d="M12 14h40v9H12zM12 28h27v9H12zM12 42h40v9H12z" /><path d="M44 28h8v9h-8z" opacity=".4" /></>,
  ];
  return <svg className={`testimonials-avatar testimonials-avatar--${index % 4}`} viewBox="0 0 64 64" aria-hidden="true">{shapes[index % shapes.length]}</svg>;
}

export default function Testimonials({ items, productName }: { items: Testimonial[]; productName: string }) {
  const [paused, setPaused] = useState(false);
  if (!items.length) return null;
  return <section className="testimonials" aria-labelledby="testimonials-title">
    <div className="lp-container testimonials-heading"><div><span className="lp-section-label">NA ROTINA DE QUEM EDITA</span><h2 id="testimonials-title">Menos etapas.<br /><span>Na voz de quem usa.</span></h2><p>Feedbacks de quem testou o {productName}. Identidades preservadas com avatares abstratos.</p></div><button className="testimonials-pause" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Retomar movimento dos comentários" : "Pausar movimento dos comentários"}>{paused ? "RETOMAR →" : "PAUSAR Ⅱ"}</button></div>
    <div className={`testimonials-window${paused ? " is-paused" : ""}`} tabIndex={0} role="region" aria-label="Comentários. Passe o mouse ou mantenha o foco aqui para pausar.">
      <div className="testimonials-track" style={{ animationDuration: `${items.length * 14}s` }}>
        {[0, 1].map(copy => <div className="testimonials-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{items.map((item, index) => <figure className="testimonials-card" key={item.id}>
          <figcaption><AnonymousAvatar index={index} /><span>Editor(a) anônimo(a)<small>{productName}</small></span><span className="testimonials-quote" aria-hidden="true">“</span></figcaption>
          {item.rating !== undefined && <div className="testimonials-stars" aria-label={`Nota ${item.rating} de 5`}>{Array.from({ length: 5 }, (_, i) => <span key={i} aria-hidden="true">{i < (item.rating ?? 0) ? "★" : "☆"}</span>)}</div>}
          <blockquote>{item.comment}</blockquote>
        </figure>)}</div>)}
      </div>
    </div>
  </section>;
}
