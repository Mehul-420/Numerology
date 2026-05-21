import { calculatePhoneticDistance } from './phonetic-distance.js';
import { checkSyllablePreservation } from './syllable-preserver.js';
import { validatePronunciation } from './pronunciation-validator.js';
import { generateIndicSoundex } from './indic-soundex.js';

/**
 * Calculates a confidence score (0.0 to 1.0) for a mutation.
 */
export function calculateMutationConfidence(original, mutated) {
  const o = original.toUpperCase();
  const m = mutated.toUpperCase();

  // 1. Phonetic Distance (0.4 weight)
  const distance = calculatePhoneticDistance(o, m);
  const distanceScore = Math.max(0, 1 - (distance / 5));

  // 2. Syllable Preservation (0.3 weight)
  const syllable = checkSyllablePreservation(o, m);
  const syllableScore = syllable.isPreserved ? 1 : 0.5;

  // 3. Soundex Signature Match (0.3 weight)
  const s1 = generateIndicSoundex(o);
  const s2 = generateIndicSoundex(m);
  const signatureMatch = s1.signature === s2.signature ? 1 : 0.4;

  // 4. Hard Constraints (Validation)
  const validation = validatePronunciation(o, m);
  
  const rawScore = (distanceScore * 0.4) + (syllableScore * 0.3) + (signatureMatch * 0.3);
  const finalScore = validation.isValid ? rawScore : rawScore * 0.2;

  return {
    confidence: finalScore,
    isHighConfidence: finalScore > 0.8,
    isValid: validation.isValid && syllable.isPreserved,
    reasons: validation.errors
  };
}
