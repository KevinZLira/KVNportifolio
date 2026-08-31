// Barrel export for the ASCII art library. Page authors import from here
// rather than reaching into core/behaviors/art directly.

export type { AsciiCell, AsciiGrid, AsciiFit, AsciiModulator } from "./core/types";
export { parseAsciiArt } from "./core/parseAsciiArt";
export { resampleGrid } from "./core/resampleGrid";
export { CELL_ASPECT } from "./core/renderer";

export { default as AsciiArt } from "./behaviors/AsciiArt";
export { default as AsciiAnimated } from "./behaviors/AsciiAnimated";
export { default as AsciiParallaxField } from "./behaviors/AsciiParallaxField";
export type { AsciiParallaxLayer } from "./behaviors/AsciiParallaxField";
export { useAsciiInteractive } from "./behaviors/useAsciiInteractive";
export type { UseAsciiInteractiveOptions } from "./behaviors/useAsciiInteractive";
export { default as AsciiImageReveal } from "./behaviors/AsciiImageReveal";
export { imageToAsciiCells } from "./behaviors/luminanceToAscii";

export { HERO_CORNER_MARK, OPERATIONS_SYMBOLS, getCategoryPlaceholderArt } from "./art";
