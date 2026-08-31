// A small library of generic, reusable decorative pieces — quiet texture
// meant to sit in a single corner or beside a label, never competing with
// a page's real focal point (logo, headline, image).

/** Tiny quiet mark for the Hero's one permitted corner of decorative
 * ASCII — must stay clearly subordinate to the KVN logo. */
export const HERO_CORNER_MARK = [" . ", "-+-", " . "].join("\n");

/** One small symbol per Operations service row. Kept to a couple of
 * characters tall so it reads as a micro-detail beside the service name,
 * never a big illustration. */
export const OPERATIONS_SYMBOLS: Record<"DESIGN" | "MOTION" | "VIDEO", string> = {
  DESIGN: ["+-+", "| |", "+-+"].join("\n"),
  MOTION: ["-->", "->>"].join("\n"),
  VIDEO: ["[>]", "---"].join("\n"),
};

export { getCategoryPlaceholderArt } from "./placeholders";
