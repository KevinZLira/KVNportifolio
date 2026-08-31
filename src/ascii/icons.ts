// ============================================================
// ASCII ICON LIBRARY — KVN's proprietary iconography.
// Every icon is a set of character-grid frames. No SVG, no
// images, no emoji. Frames cycle for idle "alive" motion;
// hoverFrames take over on interaction.
// ============================================================

export type AsciiFrame = string[];

export interface AsciiIconDef {
  id: string;
  label: string;
  hoverLabel?: string;
  frames: AsciiFrame[];
  hoverFrames: AsciiFrame[];
}

const design: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ╱╲          │",
    "│╱░░╲  · · ·  │",
    "│╲░░╱         │",
    "│ ╲╱   ─ ─ ─  │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ╱╲          │",
    "│╱██╲  · · ·  │",
    "│╲██╱         │",
    "│ ╲╱   ─ ─ ─  │",
    "└─────────────┘",
  ],
];

const designHover: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ╱╲   ┌─┐    │",
    "│╱██╲··┤ ├··  │",
    "│╲██╱  └─┘    │",
    "│ ╲╱   ═══    │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ╱╲   ┌─┐    │",
    "│╱░░╲··┤█├··  │",
    "│╲░░╱  └─┘    │",
    "│ ╲╱   ═══    │",
    "└─────────────┘",
  ],
];

const motion: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ›            │",
    "│  › ·         │",
    "│   › · ·      │",
    "│    ›  ·  ·   │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│   ›          │",
    "│    › ·       │",
    "│     › · ·    │",
    "│      ›  ·  · │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│     ›        │",
    "│      › ·     │",
    "│       › · ·  │",
    "│        ›  ·  │",
    "└─────────────┘",
  ],
];

const motionHover: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ➤➤           │",
    "│  ➤➤ ·        │",
    "│   ➤➤ · ·     │",
    "│    ➤➤  ·  ·  │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│   ➤➤         │",
    "│    ➤➤ ·      │",
    "│     ➤➤ · ·   │",
    "│      ➤➤  ·   │",
    "└─────────────┘",
  ],
];

const video: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ░▒▓██▓▒░    │",
    "│ ▓█  ▷  █▓   │",
    "│ ░▒▓██▓▒░    │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ▒▓██▓▒░░    │",
    "│ █▓  ▷  ▓█   │",
    "│ ▒▓██▓▒░░    │",
    "└─────────────┘",
  ],
];

const videoHover: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ▓█████████▓ │",
    "│ █    ▶    █ │",
    "│ ▓█████████▓ │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ █████████▓▓ │",
    "│ █    ▶    ▓ │",
    "│ ▓▓█████████ │",
    "└─────────────┘",
  ],
];

const archive: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ▁▁▁▁▁▁▁▁▁   │",
    "│ │ file.001│  │",
    "│ ▔▔▔▔▔▔▔▔▔   │",
    "│  · · · ·    │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ▁▁▁▁▁▁▁▁▁   │",
    "│ │ file.002│  │",
    "│ ▔▔▔▔▔▔▔▔▔   │",
    "│   · · · ·   │",
    "└─────────────┘",
  ],
];

const archiveHover: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ┌─────────┐ │",
    "│ │ OPEN··· │ │",
    "│ └─────────┘ │",
    "│  ■ ■ ■ ■    │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ┌─────────┐ │",
    "│ │ ···OPEN │ │",
    "│ └─────────┘ │",
    "│  ■ ■ ■ ■    │",
    "└─────────────┘",
  ],
];

const contract: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ───────     │",
    "│ ──────      │",
    "│ ────────    │",
    "│         ✕   │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ───────     │",
    "│ ──────      │",
    "│ ────────    │",
    "│         ✕   │",
    "└─────────────┘",
  ],
];

const contractHover: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│ ▓▓▓▓▓▓▓     │",
    "│ ▓▓▓▓▓▓      │",
    "│ ▓▓▓▓▓▓▓▓    │",
    "│         ✓   │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│ ───────     │",
    "│ ──────      │",
    "│ ────────    │",
    "│         ✓   │",
    "└─────────────┘",
  ],
];

const contact: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│   ╱╲         │",
    "│  ╱··╲··)     │",
    "│  ╲__╱        │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│   ╱╲         │",
    "│  ╱··╲·)      │",
    "│  ╲__╱        │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│   ╱╲         │",
    "│  ╱··╲)       │",
    "│  ╲__╱        │",
    "└─────────────┘",
  ],
];

const contactHover: AsciiFrame[] = [
  [
    "┌─────────────┐",
    "│   ╱╲         │",
    "│  ╱██╲ )))    │",
    "│  ╲__╱        │",
    "└─────────────┘",
  ],
  [
    "┌─────────────┐",
    "│   ╱╲         │",
    "│  ╱██╲  )))   │",
    "│  ╲__╱        │",
    "└─────────────┘",
  ],
];

const system: AsciiFrame[] = [
  ["[ ●───○───○ ]"],
  ["[ ○───●───○ ]"],
  ["[ ○───○───● ]"],
];

const systemHover: AsciiFrame[] = [["[ ●───●───● ]"]];

const available: AsciiFrame[] = [["· AVAILABLE ·"], [" ·AVAILABLE· "]];
const availableHover: AsciiFrame[] = [["■ AVAILABLE ■"]];

const locked: AsciiFrame[] = [
  ["┌──┐", "│▓▓│  LOCKED", "└──┘"],
];
const lockedHover: AsciiFrame[] = [
  ["┌──┐", "│▓▓│  DENIED", "└──┘"],
];

const completed: AsciiFrame[] = [["[ ✓ COMPLETED ]"]];
const completedHover: AsciiFrame[] = [["[ ✓✓ COMPLETED ]"]];

const pending: AsciiFrame[] = [["[ … PENDING ]"], ["[ ·.. PENDING ]"], ["[ ..· PENDING ]"]];
const pendingHover: AsciiFrame[] = [["[ ▓▓▓ PENDING ]"]];

// abstract decorative marks — used as texture, dividers, corner glyphs
const glyphA: AsciiFrame[] = [
  ["+──+  ·  +──+"],
  [" +──+ ·  +──+ "],
];
const glyphAHover: AsciiFrame[] = [["+══+  ·  +══+"]];

const glyphB: AsciiFrame[] = [["░▒▓█▓▒░"], ["▒▓█▓▒░░"], ["▓█▓▒░░▒"]];
const glyphBHover: AsciiFrame[] = [["█████████"]];

export const asciiIcons: Record<string, AsciiIconDef> = {
  design: { id: "design", label: "DESIGN", hoverLabel: "SELECTED OPERATION", frames: design, hoverFrames: designHover },
  motion: { id: "motion", label: "MOTION", hoverLabel: "SELECTED OPERATION", frames: motion, hoverFrames: motionHover },
  video: { id: "video", label: "VIDEO", hoverLabel: "SELECTED OPERATION", frames: video, hoverFrames: videoHover },
  archive: { id: "archive", label: "ARCHIVE", hoverLabel: "OPEN FILE", frames: archive, hoverFrames: archiveHover },
  contract: { id: "contract", label: "CONTRACT", hoverLabel: "SIGNED", frames: contract, hoverFrames: contractHover },
  contact: { id: "contact", label: "CONTACT", hoverLabel: "LISTENING", frames: contact, hoverFrames: contactHover },
  system: { id: "system", label: "SYSTEM", frames: system, hoverFrames: systemHover },
  available: { id: "available", label: "AVAILABLE", frames: available, hoverFrames: availableHover },
  locked: { id: "locked", label: "LOCKED", frames: locked, hoverFrames: lockedHover },
  completed: { id: "completed", label: "COMPLETED", frames: completed, hoverFrames: completedHover },
  pending: { id: "pending", label: "PENDING", frames: pending, hoverFrames: pendingHover },
  glyphA: { id: "glyphA", label: "", frames: glyphA, hoverFrames: glyphAHover },
  glyphB: { id: "glyphB", label: "", frames: glyphB, hoverFrames: glyphBHover },
};

export type AsciiIconName = keyof typeof asciiIcons;
