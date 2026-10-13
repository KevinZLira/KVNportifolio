import { useEffect, useRef, useState } from "react";
import "./OfferCountdown.css";

const STORAGE_KEY = "kvn:launch-offer:expires-at:v1";
const OFFER_DURATION_MS = 10 * 60 * 1000;
let memoryDeadline: number | undefined;

function getDeadline(): number {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      memoryDeadline = stored;
      return stored;
    }
  } catch { /* Preserve the deadline in memory when storage is unavailable. */ }
  memoryDeadline ??= Date.now() + OFFER_DURATION_MS;
  try { localStorage.setItem(STORAGE_KEY, String(memoryDeadline)); } catch { /* Private storage can be disabled. */ }
  return memoryDeadline;
}

function secondsLeft(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export default function OfferCountdown() {
  const [deadline, setDeadline] = useState(getDeadline);
  const [remaining, setRemaining] = useState(() => secondsLeft(deadline));
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setRemaining(secondsLeft(deadline));
    update();
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, [deadline]);

  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      const stored = Number(event.newValue);
      if (Number.isFinite(stored) && stored > 0) {
        memoryDeadline = stored;
        setDeadline(stored);
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    const nav = banner?.previousElementSibling;
    const article = banner?.closest<HTMLElement>(".lp");
    if (!banner || !nav || !article) return;
    const measure = () => {
      article.style.setProperty("--lp-nav-height", `${nav.getBoundingClientRect().height}px`);
      article.style.setProperty("--lp-banner-height", `${banner.getBoundingClientRect().height}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  const expired = remaining === 0;
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div ref={bannerRef} className={`offer-countdown${expired ? " is-expired" : ""}`} role="region" aria-label="Prazo da oferta de lançamento">
      <span className="offer-countdown-label"><span aria-hidden="true">{expired ? "◇" : "◷"}</span>{expired ? "TEMPO ENCERRADO" : "OFERTA POR TEMPO LIMITADO"}</span>
      <span className="offer-countdown-time" role="timer" aria-live="off" aria-label={`${minutes} minutos e ${seconds} segundos restantes`}>{minutes}<span aria-hidden="true">:</span>{seconds}</span>
      <a href="#oferta">{expired ? "VER OPÇÕES ↗" : "VER OFERTA ↗"}</a>
      <span className="offer-countdown-sr" role="status">{expired ? "A contagem regressiva da oferta terminou." : "A oferta tem prazo de dez minutos."}</span>
    </div>
  );
}
