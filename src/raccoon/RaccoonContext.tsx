import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { bindGlobalInputTracking, isReturningVisitor } from "./raccoonMemory";

interface RaccoonContextValue {
  activeSpotId: string | null;
  registerSpotVisibility: (id: string, visible: boolean) => void;
  isReturning: boolean;
  systemReady: boolean;
}

const RaccoonContext = createContext<RaccoonContextValue | null>(null);

export function RaccoonProvider({ systemReady, children }: { systemReady: boolean; children: ReactNode }) {
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const visibleSpots = useRef<Set<string>>(new Set());
  const isReturning = useMemo(() => isReturningVisitor(), []);

  useEffect(() => {
    bindGlobalInputTracking();
  }, []);

  const registerSpotVisibility = useCallback((id: string, visible: boolean) => {
    const set = visibleSpots.current;
    if (visible) {
      set.add(id);
      setActiveSpotId(id);
    } else {
      set.delete(id);
      setActiveSpotId((current) => {
        if (current !== id) return current;
        const next = set.values().next();
        return next.done ? null : next.value;
      });
    }
  }, []);

  const value = useMemo(
    () => ({ activeSpotId, registerSpotVisibility, isReturning, systemReady }),
    [activeSpotId, registerSpotVisibility, isReturning, systemReady],
  );

  return <RaccoonContext.Provider value={value}>{children}</RaccoonContext.Provider>;
}

export function useRaccoon() {
  const ctx = useContext(RaccoonContext);
  if (!ctx) throw new Error("useRaccoon must be used within RaccoonProvider");
  return ctx;
}
