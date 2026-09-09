export type PluginStatus = "AVAILABLE" | "IN_DEVELOPMENT" | "CLASSIFIED";

export interface PluginBenefit {
  index: string;
  title: string;
  description: string;
}

export interface PluginPrice {
  amount: number;
  currency: string;
  interval?: string; // e.g. "ONE-TIME", "/MO" — omit for a flat one-time price
}

export interface Plugin {
  id: string; // "001"
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: PluginStatus;
  pitch: string;
  highlights: string[]; // short "no X. no Y." friction-removal lines
  oldWay: string[];
  newWay: string[];
  benefits: PluginBenefit[];
  steps: string[];
  signals: string[]; // short build-log lines for the horizontal ticker — creator's voice, not customer quotes
  demoVideo?: string;
  demoPoster?: string;
  price?: PluginPrice; // omit entirely until a real price is set — never invent one
  purchaseUrl?: string; // omit until a real checkout/store link exists
  accent: string;
}

export const featuredPlugin: Plugin = {
  id: "001",
  slug: "video-importer",
  name: "KVN VIDEO IMPORTER",
  tagline: "YOUTUBE → PREMIERE PRO",
  category: "IMPORT UTILITY",
  status: "AVAILABLE",
  pitch: "Import video directly into your Premiere timeline.",
  highlights: ["NO DOWNLOAD.", "NO MANUAL FILE HANDLING.", "NO BROKEN WORKFLOW."],
  oldWay: [
    "COPY LINK",
    "OPEN DOWNLOADER",
    "DOWNLOAD FILE",
    "WAIT",
    "FIND FILE",
    "IMPORT TO PREMIERE",
    "DRAG TO TIMELINE",
  ],
  newWay: ["YOUTUBE", "KVN VIDEO IMPORTER", "TIMELINE"],
  benefits: [
    { index: "01", title: "DIRECT", description: "YouTube → Premiere without leaving your workflow." },
    { index: "02", title: "FAST", description: "Skip unnecessary downloads, tabs and file management." },
    { index: "03", title: "NATIVE", description: "Built specifically around your Premiere workflow." },
    { index: "04", title: "SIMPLE", description: "Paste. Import. Edit." },
  ],
  steps: ["COPY URL", "PASTE", "IMPORT", "EDIT"],
  signals: [
    "BUILT BECAUSE TAB-SWITCHING MID-EDIT SHOULDN'T BE A STEP.",
    "ONE PASTE. ONE IMPORT. BACK TO THE TIMELINE.",
    "NO DOWNLOAD FOLDER. NO ORPHANED FILES.",
    "MADE FOR THE WORKFLOW, NOT AROUND IT.",
    "LESS FRICTION BETWEEN FOOTAGE AND EDIT.",
    "SHIPPED BY SOMEONE WHO EDITS FOR A LIVING.",
  ],
  accent: "#80f425",
};

// Only shipped product today — the list is the extension point for every
// plugin that ships after this one; nothing above this file needs to change.
export const plugins: Plugin[] = [featuredPlugin];

export function getPluginBySlug(slug: string) {
  return plugins.find((p) => p.slug === slug);
}

export interface UpcomingPlugin {
  id: string; // "002"
  codename: string;
  status: "IN_DEVELOPMENT" | "CLASSIFIED";
  progress?: number; // 0..1 — only rendered for IN_DEVELOPMENT
}

// PLACEHOLDER DATASET — swap for real roadmap entries as they firm up.
export const upcomingPlugins: UpcomingPlugin[] = [
  { id: "002", codename: "SYSTEM_002", status: "IN_DEVELOPMENT", progress: 0.35 },
  { id: "003", codename: "SYSTEM_003", status: "CLASSIFIED" },
];
