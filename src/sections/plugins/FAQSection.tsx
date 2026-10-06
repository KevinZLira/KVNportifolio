import { useState } from "react";
import type { FaqItem } from "../../data/plugins";
import { sfx } from "../../lib/sound";
import "./FAQSection.css";

export default function FAQSection({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="faq">
      <h2 className="faq-title t-display">Perguntas frequentes</h2>

      <div className="faq-list">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question} className={`faq-item ${isOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="faq-question t-mono"
                onClick={() => {
                  sfx.click();
                  setOpenIndex(isOpen ? null : i);
                }}
                onMouseEnter={() => sfx.hover()}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span className="faq-toggle" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p className={`faq-answer t-mono ${item.placeholder ? "is-placeholder" : ""}`}>{item.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
