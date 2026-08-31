// ARCHIVE_MODE — same one-line, fully-reversible toggle pattern as
// heroExperience.ts. "database" is the original filterable list
// (WorkDatabase.tsx, untouched); "market" is the new 2-column catalog
// grid built for the dark-market redesign (MarketArchive.tsx). Switching
// back is a one-line change — WorkDatabase's code is never deleted.
export type ArchiveMode = "database" | "market";

export const ARCHIVE_MODE: ArchiveMode = "market";
