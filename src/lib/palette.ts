interface Palette {
  primary: string;
  primaryDim: string;
  primaryGlow: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
}

const PALETTES: Palette[] = [
  {
    primary: "#80f425",
    primaryDim: "#366610",
    primaryGlow: "rgba(128, 244, 37, 0.35)",
    accent: "#ff2ec4",
    accentDim: "#7a1a63",
    accentGlow: "rgba(255, 46, 196, 0.3)",
  },
  {
    primary: "#f6ef03",
    primaryDim: "#676401",
    primaryGlow: "rgba(246, 239, 3, 0.35)",
    accent: "#fb3d87",
    accentDim: "#691a39",
    accentGlow: "rgba(251, 61, 135, 0.3)",
  },
];

export function applyRandomPalette() {
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const root = document.documentElement.style;
  root.setProperty("--primary", palette.primary);
  root.setProperty("--primary-dim", palette.primaryDim);
  root.setProperty("--primary-glow", palette.primaryGlow);
  root.setProperty("--accent", palette.accent);
  root.setProperty("--accent-dim", palette.accentDim);
  root.setProperty("--accent-glow", palette.accentGlow);
}
