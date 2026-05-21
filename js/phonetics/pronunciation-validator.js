import { MUTATION_CONSTRAINTS } from './phonetic-config.js';
import { PHONETIC_CONSTANTS } from './language-profiles.js';

/**
 * Validates a name against grapheme repetition and left-edge rules.
 */
export function validatePronunciation(original, mutated) {
  const o = original.toUpperCase();
  const m = mutated.toUpperCase();
  const { maxRepeatingLetters } = PHONETIC_CONSTANTS;
  
  const errors = [];

  // 1. Grapheme Repetition Rule
  for (let i = 0; i < m.length - maxRepeatingLetters; i++) {
    if (m[i] === m[i+1] && m[i] === m[i+2]) {
      errors.push(`Robotic repetition of ${m[i]}`);
    }
  }

  // 2. Left-Edge Preservation (Onset)
  if (MUTATION_CONSTRAINTS.PRESERVE_LEFT_EDGE) {
    const edge = MUTATION_CONSTRAINTS.LEFT_EDGE_LENGTH;
    if (o.slice(0, edge) !== m.slice(0, edge)) {
      // Special allowance: if it's a known phonetic substitution (K->C), allow it
      // But generally, the user's name start should be preserved.
      errors.push("Core identity (name start) modified");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
