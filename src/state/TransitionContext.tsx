import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import "./TransitionContext.css";

/** Richer overlay template for "opening a file" navigations (Project
 * Page). Optional — existing single-string callers are unaffected. */
export interface FileAccessDetails {
  file: string;
  category?: string;
  status?: string;
}

interface TransitionContextValue {
  runTransition: (
    label: string,
    action: () => void,
    minMs?: number,
    details?: FileAccessDetails,
  ) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const [details, setDetails] = useState<FileAccessDetails | null>(null);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const pending = useRef<(() => void) | null>(null);

  const runTransition = useCallback(
    (text: string, action: () => void, minMs = 620, fileDetails?: FileAccessDetails) => {
      setLabel(text);
      setDetails(fileDetails ?? null);
      setPhase("in");
      pending.current = action;
      window.setTimeout(() => {
        pending.current?.();
        pending.current = null;
        setPhase("out");
        window.setTimeout(() => setLabel(null), 420);
      }, minMs);
    },
    [],
  );

  return (
    <TransitionContext.Provider value={{ runTransition }}>
      {children}
      {label && (
        <div className={`sys-transition ${phase === "out" ? "is-out" : ""}`}>
          <div className="sys-transition-noise" />
          {details ? (
            <div className="sys-transition-file t-mono">
              <span className="sys-transition-file-id">{details.file}</span>
              <span className="sys-transition-file-status">
                ACCESSING<span className="blink">_</span>
              </span>
              <span className="sys-transition-file-meta">
                {[details.category, details.status].filter(Boolean).join(" / ")}
              </span>
            </div>
          ) : (
            <div className="sys-transition-text t-mono">{label}</div>
          )}
        </div>
      )}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used within TransitionProvider");
  return ctx;
}
