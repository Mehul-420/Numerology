import { chaldeanMap } from './chaldean-map.js';
import { reduceNumber } from '../utils/helpers.js';

/**
 * Calculates the Chaldean value of a name.
 * Returns compound total, reduced digit, and character breakdown.
 */
export function calculateNameNumber(name) {
  const letters = name.toLowerCase().replace(/[^a-z]/g, "").split("");
  const breakdown = [];
  
  let compound = 0;
  for (const char of letters) {
    const value = chaldeanMap[char] || 0;
    if (value > 0) {
      compound += value;
      breakdown.push({ char, value });
    }
  }

  return {
    name: name.toUpperCase(),
    total: compound,
    reduced: reduceNumber(compound, true), // Keep master numbers if applicable
    breakdown
  };
}
