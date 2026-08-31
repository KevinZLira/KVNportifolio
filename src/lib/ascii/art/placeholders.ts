import type { ProjectCategory } from "../../../data/projects";

// Small abstract pieces, one per project category — used by the Archive
// when a project has no real thumbnail yet. Deliberately abstract (a
// grid, a lens, motion lines, a mark, noise) rather than literal icons,
// meant to read as "artifact found in an old terminal," not as a category
// logo. Any of these look right at almost any aspect ratio once resampled
// to a tile's actual grid dimensions.
const PLACEHOLDERS: Record<ProjectCategory, string> = {
  DESIGN: [
    "     .   .   .     ",
    "  .  +---+---+  .  ",
    "     |   |   |     ",
    "  +--+---+---+--+  ",
    "     |   |   |     ",
    "  .  +---+---+  .  ",
    "     .   .   .     ",
  ].join("\n"),

  VIDEO: [
    "     .-~~~~~-.     ",
    "   /    ___    \\   ",
    "  |    /   \\    |  ",
    "  |   |  .  |   |  ",
    "  |    \\___/    |  ",
    "   \\           /   ",
    "     `-_____-'     ",
  ].join("\n"),

  MOTION: [
    "        /          ",
    "       /           ",
    "      /            ",
    "  ---+----------   ",
    "    /|             ",
    "   / |             ",
    "  /  |             ",
  ].join("\n"),

  BRANDING: [
    "       /\\          ",
    "      /  \\         ",
    "     / /\\ \\        ",
    "    /_/  \\_\\       ",
    "    \\ \\  / /       ",
    "     \\ \\/ /        ",
    "      \\  /         ",
    "       \\/          ",
  ].join("\n"),

  EXPERIMENTAL: [
    "#.  .#  ..#  .#.   ",
    ".#.#..#.#..#.#..   ",
    "#..##.#..##.#.#.   ",
    "..#.#.#..#.#..##   ",
    "#.#..##.#....#.#   ",
  ].join("\n"),
};

export function getCategoryPlaceholderArt(category: ProjectCategory): string {
  return PLACEHOLDERS[category];
}
