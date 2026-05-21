import { reduceNumber } from '../utils/helpers.js';

/**
 * Normalizes any number to a single digit (1-9) for temporal cycles.
 */
export function reduceToDigit(num) {
  // Temporal cycles (Year, Month, Day) usually reduce to single digits.
  // We use reduceNumber(num, false) to force single digit reduction (no masters).
  return reduceNumber(num, false);
}
