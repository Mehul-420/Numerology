/**
 * Normalizes a name string by trimming, removing extra spaces,
 * and stripping non-alphabetic characters.
 */
export function normalizeName(name) {
  if (!name) return "";
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .replace(/[^A-Z\s]/g, ""); // Keep only letters and spaces
}

/**
 * Combines name parts into a single normalized full name string.
 */
export function combineNameParts(first = "", middle = "", last = "") {
  return normalizeName(`${first} ${middle} ${last}`);
}
