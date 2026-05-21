import { SUCCESS_MATRIX, FAVORABILITY_LEVELS } from './temporal-config.js';

/**
 * Looks up favorability score from the matrix.
 */
export function getSuccessScore(mulank, cycleNumber) {
  // Ensure we are looking at 1-9
  const d = Math.max(1, Math.min(9, Number(mulank)));
  const c = Math.max(1, Math.min(9, Number(cycleNumber)));

  return SUCCESS_MATRIX[d]?.[c] || 50; // Default to moderate
}

/**
 * Returns a human-readable interpretation of a score.
 */
export function getFavorabilityInterpretation(score) {
  const level = FAVORABILITY_LEVELS.find(l => score >= l.min) || FAVORABILITY_LEVELS[FAVORABILITY_LEVELS.length - 1];
  return level;
}
