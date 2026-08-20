interface Palette {
  primary: string;
  primaryDim: string;
  primaryGlow: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  logoBody: string;
  logoAccent: string;
  roleColor: string;
  roleGlow: string;
}

const PALETTES: Palette[] = [
  {
    primary: "#80f425",
    primaryDim: "#366610",
    primaryGlow: "rgba(128, 244, 37, 0.35)",
    accent: "#ff2ec4",
    accentDim: "#7a1a63",
    accentGlow: "rgba(255, 46, 196, 0.3)",
    logoBody: "#eef2e8",
    logoAccent: "#80f425",
    roleColor: "#80f425",
    roleGlow: "rgba(128, 244, 37, 0.35)",
  },
  {
    primary: "#f6ef03",
    primaryDim: "#676401",
    primaryGlow: "rgba(246, 239, 3, 0.35)",
    accent: "#fb3d87",
    accentDim: "#691a39",
    accentGlow: "rgba(251, 61, 135, 0.3)",
    logoBody: "#f6ef03",
    logoAccent: "#fb3d87",
    roleColor: "#fb3d87",
    roleGlow: "rgba(251, 61, 135, 0.3)",
  },
  {
    primary: "#33e2ff",
    primaryDim: "#155f6b",
    primaryGlow: "rgba(51, 226, 255, 0.35)",
    accent: "#c60ac1",
    accentDim: "#530451",
    accentGlow: "rgba(198, 10, 193, 0.3)",
    logoBody: "#33e2ff",
    logoAccent: "#c60ac1",
    roleColor: "#c60ac1",
    roleGlow: "rgba(198, 10, 193, 0.3)",
  },
];

const STORAGE_KEY = "kvn-palette-index";

function nextPaletteIndex(): number {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prevIndex = stored === null ? -1 : Number(stored);
    const index = (prevIndex + 1) % PALETTES.length;
    window.localStorage.setItem(STORAGE_KEY, String(index));
    return index;
  } catch {
    return Math.floor(Math.random() * PALETTES.length);
  }
}

export function applyNextPalette() {
  const palette = PALETTES[nextPaletteIndex()];
  const root = document.documentElement.style;
  root.setProperty("--primary", palette.primary);
  root.setProperty("--primary-dim", palette.primaryDim);
  root.setProperty("--primary-glow", palette.primaryGlow);
  root.setProperty("--accent", palette.accent);
  root.setProperty("--accent-dim", palette.accentDim);
  root.setProperty("--accent-glow", palette.accentGlow);
  root.setProperty("--logo-body", palette.logoBody);
  root.setProperty("--logo-accent", palette.logoAccent);
  root.setProperty("--role-color", palette.roleColor);
  root.setProperty("--role-glow", palette.roleGlow);
}
