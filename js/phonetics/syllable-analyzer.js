import { PHONETIC_CONSTANTS } from './language-profiles.js';

/**
 * Heuristic syllable analysis.
 * Uses vowel clusters to estimate syllable count and rhythm.
 */
export function analyzeSyllables(name) {
  const n = name.toUpperCase();
  const vowels = PHONETIC_CONSTANTS.vowels;
  
  let syllableCount = 0;
  let inVowelBlock = false;
  
  for (let i = 0; i < n.length; i++) {
    const isVowel = vowels.includes(n[i]);
    if (isVowel && !inVowelBlock) {
      syllableCount++;
      inVowelBlock = true;
    } else if (!isVowel) {
      inVowelBlock = false;
    }
  }

  // Handle silent 'E' at the end (simplistic heuristic)
  if (n.endsWith('E') && syllableCount > 1) {
    syllableCount--;
  }

  // Detect rhythmic patterns (vowel gaps)
  const segments = n.split(/[^AEIOUY]+/).filter(Boolean);
  const avgSyllableLength = n.length / (syllableCount || 1);

  return {
    count: syllableCount || 1,
    avgLength: avgSyllableLength,
    isRhythmic: syllableCount >= 2 && avgSyllableLength <= 4,
    hasExcessiveVowels: segments.some(s => s.length > 2)
  };
}
