import { useEffect, useState } from "react";
import { projects, type Project, type ProjectCategory } from "../data/projects";
import { useSystem } from "../state/SystemContext";

export interface UseProjectFilterResult {
  filter: ProjectCategory | "ALL";
  setFilter: (f: ProjectCategory | "ALL") => void;
  visible: Project[];
}

/**
 * Shared category-filter state for the Archive. Extracted so WorkDatabase
 * and MarketArchive — two parallel implementations toggled via
 * ARCHIVE_MODE — don't each reimplement the pendingFilter-from-NavOverlay
 * sync (a VIDEO/DESIGN nav entry sets a filter before scrolling to the
 * Archive section).
 */
export function useProjectFilter(): UseProjectFilterResult {
  const [filter, setFilter] = useState<ProjectCategory | "ALL">("ALL");
  const { pendingFilter, clearPendingFilter } = useSystem();

  useEffect(() => {
    if (pendingFilter) {
      setFilter(pendingFilter as ProjectCategory | "ALL");
      clearPendingFilter();
    }
  }, [pendingFilter, clearPendingFilter]);

  const visible = projects.filter((p) => filter === "ALL" || p.category === filter);

  return { filter, setFilter, visible };
}
