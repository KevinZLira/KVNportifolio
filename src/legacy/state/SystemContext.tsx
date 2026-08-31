import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { setSfxEnabled, sfx } from "../lib/sound";

export type SystemState = "BOOT" | "ONLINE";

export type CursorMode =
  | { kind: "default" }
  | { kind: "link" }
  | { kind: "project"; id: string }
  | { kind: "busy"; label: string };

interface SystemContextValue {
  systemState: SystemState;
  enterSystem: () => void;
  sfxOn: boolean;
  toggleSfx: () => void;
  cursorMode: CursorMode;
  setCursorMode: (m: CursorMode) => void;
  sectionLabel: string;
  setSectionLabel: (s: string) => void;
  pendingFilter: string | null;
  requestFilter: (f: string) => void;
  clearPendingFilter: () => void;
}

const SystemContext = createContext<SystemContextValue | null>(null);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [systemState, setSystemState] = useState<SystemState>("BOOT");
  const [sfxOn, setSfxOn] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>({ kind: "default" });
  const [sectionLabel, setSectionLabel] = useState("KVN_SYSTEM");
  const [pendingFilter, setPendingFilter] = useState<string | null>(null);

  const enterSystem = useCallback(() => setSystemState("ONLINE"), []);
  const requestFilter = useCallback((f: string) => setPendingFilter(f), []);
  const clearPendingFilter = useCallback(() => setPendingFilter(null), []);

  const toggleSfx = useCallback(() => {
    setSfxOn((prev) => {
      const next = !prev;
      setSfxEnabled(next);
      if (next) sfx.toggle();
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      systemState,
      enterSystem,
      sfxOn,
      toggleSfx,
      cursorMode,
      setCursorMode,
      sectionLabel,
      setSectionLabel,
      pendingFilter,
      requestFilter,
      clearPendingFilter,
    }),
    [
      systemState,
      enterSystem,
      sfxOn,
      toggleSfx,
      cursorMode,
      sectionLabel,
      pendingFilter,
      requestFilter,
      clearPendingFilter,
    ],
  );

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used within SystemProvider");
  return ctx;
}
