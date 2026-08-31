import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import "./TransitionContext.css";

interface TransitionContextValue {
  runTransition: (label: string, action: () => void, minMs?: number) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const pending = useRef<(() => void) | null>(null);

  const runTransition = useCallback((text: string, action: () => void, minMs = 620) => {
    setLabel(text);
    setPhase("in");
    pending.current = action;
    window.setTimeout(() => {
      pending.current?.();
      pending.current = null;
      setPhase("out");
      window.setTimeout(() => setLabel(null), 420);
    }, minMs);
  }, []);

  return (
    <TransitionContext.Provider value={{ runTransition }}>
      {children}
      {label && (
        <div className={`sys-transition ${phase === "out" ? "is-out" : ""}`}>
          <div className="sys-transition-noise" />
          <div className="sys-transition-text t-mono">{label}</div>
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
