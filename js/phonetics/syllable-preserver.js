import { analyzeSyllables } from './syllable-analyzer.js';
import { MUTATION_CONSTRAINTS } from './phonetic-config.js';

/**
 * Checks if a mutation preserves the approximate syllable structure of the original.
 */
export function checkSyllablePreservation(original, mutated) {
  const s1 = analyzeSyllables(original);
  const s2 = analyzeSyllables(mutated);

  const countDiff = Math.abs(s1.count - s2.count);
  const drift = countDiff / Math.max(s1.count, 1);

  return {
    isPreserved: drift <= MUTATION_CONSTRAINTS.SYLLABLE_DRIFT_TOLERANCE,
    drift,
    originalCount: s1.count,
    mutatedCount: s2.count
  };
}
