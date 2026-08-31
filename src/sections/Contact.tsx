import { useState } from "react";
import { useSectionLabel } from "../hooks/useSectionLabel";
import { sfx } from "../lib/sound";
import { emitToast } from "../lib/toast";
import { AsciiAnimated } from "../lib/ascii";
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
type SubmitState = "idle" | "sending" | "sent";

interface BriefForm {
  name: string;
  email: string;
  project: string;
  budget: string;
  brief: string;
}

const EMPTY_FORM: BriefForm = { name: "", email: "", project: "", budget: "", brief: "" };

// Small, quiet "processing" glyph for the brief-submit confirmation beat —
// not a fake-hacker screen, just one animated beat between submit and
// confirmation, per the brief.
const LOADING_ART = "[ . . . ]";

export default function Contact() {
  const sectionRef = useSectionLabel<HTMLElement>("CONTRACT_MODULE");
  const [channelState, setChannelState] = useState<Record<string, ChannelState>>({});
  const [form, setForm] = useState<BriefForm>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

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

  function updateField(key: keyof BriefForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submitBrief() {
    if (!form.name.trim() || !form.email.trim() || !form.brief.trim()) {
      sfx.error();
      emitToast("ERROR: INCOMPLETE BRIEF");
      return;
    }
    sfx.confirm();
    setSubmitState("sending");

    const subject = encodeURIComponent(`CONTRACT REQUEST — ${form.project || "UNTITLED"}`);
    const body = encodeURIComponent(
      `NAME: ${form.name}\nEMAIL: ${form.email}\nPROJECT: ${form.project}\nBUDGET: ${form.budget}\n\nBRIEF:\n${form.brief}`,
    );

    window.setTimeout(() => {
      setSubmitState("sent");
      window.location.href = `mailto:contact@kvnlira.com?subject=${subject}&body=${body}`;
    }, 900);

    window.setTimeout(() => {
      setSubmitState("idle");
      setForm(EMPTY_FORM);
    }, 3400);
  }

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <span className="hud-corner hud-corner--tl" aria-hidden="true" />
      <span className="hud-corner hud-corner--br" aria-hidden="true" />

      <div className="contact-header">
        <span className="contact-comment t-mono">// CONTRACT_MODULE</span>
        <h2 className="contact-heading t-display">INITIATE CONTRACT</h2>
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
            {submitState === "idle" && (
              <>
                BRIEF READY<span className="blink">_</span>
              </>
            )}
            {submitState === "sending" && "REQUEST RECEIVED"}
            {submitState === "sent" && "CONTRACT STATUS: PENDING"}
          </span>

          {submitState === "sending" && (
            <div className="contact-loading" aria-hidden="true">
              <AsciiAnimated art={LOADING_ART} behavior="flicker" color="#80f425" fit="tile" cellPx={16} />
            </div>
          )}

          {submitState === "sent" && (
            <div className="contact-confirm t-mono">
              CONTRACT SUBMITTED. KVN WILL RESPOND WITHIN 48H.
            </div>
          )}

          {submitState === "idle" && (
            <form
              className="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                submitBrief();
              }}
            >
              <div className="contact-field-row">
                <label className="contact-field">
                  <span className="contact-field-label t-mono">NAME</span>
                  <input
                    className="contact-input t-mono"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </label>
                <label className="contact-field">
                  <span className="contact-field-label t-mono">EMAIL</span>
                  <input
                    type="email"
                    className="contact-input t-mono"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </label>
              </div>

              <div className="contact-field-row">
                <label className="contact-field">
                  <span className="contact-field-label t-mono">PROJECT</span>
                  <input
                    className="contact-input t-mono"
                    value={form.project}
                    onChange={(e) => updateField("project", e.target.value)}
                  />
                </label>
                <label className="contact-field">
                  <span className="contact-field-label t-mono">BUDGET</span>
                  <input
                    className="contact-input t-mono"
                    value={form.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                  />
                </label>
              </div>

              <label className="contact-field contact-field--full">
                <span className="contact-field-label t-mono">BRIEF</span>
                <textarea
                  className="contact-textarea t-mono"
                  placeholder="DESCRIBE THE OPERATION..."
                  value={form.brief}
                  onChange={(e) => updateField("brief", e.target.value)}
                  rows={5}
                />
              </label>

              <button type="submit" className="contact-send t-mono" onMouseEnter={() => sfx.hover()}>
                [ SUBMIT BRIEF ]
              </button>
            </form>
          )}
        </div>
      </div>

      <footer className="contact-footer t-mono">
        <span>KVN_OS © 2026</span>
        <span>END OF FILE</span>
      </footer>
    </section>
  );
}
