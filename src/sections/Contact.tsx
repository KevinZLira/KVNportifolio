import { useState } from "react";
import { useSectionLabel } from "../hooks/useSectionLabel";
import { sfx } from "../lib/sound";
import { emitToast } from "../lib/toast";
import RaccoonSpot from "../raccoon/RaccoonSpot";
import { emitRaccoonSignal } from "../raccoon/raccoonBus";
import "./Contact.css";

interface Channel {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

// Placeholder channels — swap for real handles/links later.
const CHANNELS: Channel[] = [
  { id: "email", label: "EMAIL", href: "mailto:contact@kvnlira.com" },
  { id: "instagram", label: "INSTAGRAM", href: "https://instagram.com/", external: true },
  { id: "linkedin", label: "LINKEDIN", href: "https://linkedin.com/", external: true },
];

type ChannelState = "idle" | "opening" | "established";

export default function Contact() {
  const sectionRef = useSectionLabel<HTMLElement>("COMMUNICATION_MODULE");
  const [channelState, setChannelState] = useState<Record<string, ChannelState>>({});
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function openChannel(channel: Channel) {
    if (channelState[channel.id]) return;
    sfx.click();
    setChannelState((s) => ({ ...s, [channel.id]: "opening" }));
    emitToast(channel.external ? "OPENING EXTERNAL NODE..." : "OPENING CHANNEL...");

    window.setTimeout(() => {
      setChannelState((s) => ({ ...s, [channel.id]: "established" }));
      sfx.confirm();
      window.open(channel.href, channel.external ? "_blank" : "_self", "noopener,noreferrer");

      window.setTimeout(() => {
        setChannelState((s) => ({ ...s, [channel.id]: "idle" }));
      }, 1600);
    }, 550);
  }

  function sendTransmission() {
    if (!message.trim()) {
      sfx.error();
      emitToast("ERROR: EMPTY TRANSMISSION");
      return;
    }
    sfx.confirm();
    setSent(true);
    emitRaccoonSignal({ type: "celebrate" });
    const body = encodeURIComponent(message);
    window.setTimeout(() => {
      window.location.href = `mailto:contact@kvnlira.com?subject=TRANSMISSION%20FROM%20KVN_OS&body=${body}`;
    }, 500);
    window.setTimeout(() => {
      setSent(false);
      setMessage("");
    }, 2400);
  }

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <div className="contact-header">
        <span className="contact-comment t-mono">// COMMUNICATION_MODULE</span>
        <h2 className="contact-heading t-display">GET IN TOUCH</h2>
      </div>

      <div className="contact-grid">
        <div className="contact-channels">
          <span className="contact-label t-mono">SELECT CHANNEL:</span>
          <div className="contact-channel-list">
            {CHANNELS.map((channel) => {
              const state = channelState[channel.id] ?? "idle";
              return (
                <button
                  key={channel.id}
                  type="button"
                  className={`contact-channel t-mono state-${state}`}
                  onClick={() => openChannel(channel)}
                  onMouseEnter={() => sfx.hover()}
                >
                  <span className="contact-channel-bracket">[</span>
                  <span className="contact-channel-label">
                    {state === "opening"
                      ? "OPENING CHANNEL..."
                      : state === "established"
                        ? "CHANNEL ESTABLISHED."
                        : channel.label}
                  </span>
                  <span className="contact-channel-bracket">]</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="contact-transmit">
          <span className="contact-label t-mono">
            TRANSMISSION READY<span className="blink">_</span>
          </span>
          <textarea
            className="contact-textarea t-mono"
            placeholder="TYPE MESSAGE..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <div className="contact-send-row">
            <button
              type="button"
              className="contact-send t-mono"
              onClick={sendTransmission}
              onMouseEnter={() => sfx.hover()}
            >
              {sent ? "TRANSMISSION SENT." : "[ SEND TRANSMISSION ]"}
            </button>
            <RaccoonSpot id="contact-send" layer="front_decoration" wanderRadius={16} inline />
          </div>
        </div>
      </div>

      <footer className="contact-footer t-mono">
        <span>KVN_OS © 2026</span>
        <span>END OF FILE</span>
      </footer>
    </section>
  );
}
