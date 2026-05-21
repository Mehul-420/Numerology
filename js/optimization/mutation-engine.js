import { mutationRules } from './mutation-rules.js';
import { analyzePronunciation } from '../phonetics/pronunciation-engine.js';
import { MUTATION_LIMITS } from './optimization-config.js';
import { calculateMutationConfidence } from '../phonetics/mutation-confidence.js';

/**
 * Generates immediate spelling variants of a given name.
 * Focuses on maintaining phonetic similarity.
 */
export function generateMutations(name) {
  const variants = new Set();
  const n = name.toUpperCase();

  // 1. Double Letters Rule
  for (let i = 0; i < n.length; i++) {
    const char = n[i];
    if (mutationRules.doubleableLetters.includes(char)) {
      if (n[i+1] !== char && n[i-1] !== char) {
        const variant = n.slice(0, i + 1) + char + n.slice(i + 1);
        if (variant.length <= MUTATION_LIMITS.MAX_NAME_LENGTH) variants.add(variant);
      }
    }
  }

  // 2. Substitutions Rule
  for (const [target, repls] of Object.entries(mutationRules.substitutions)) {
    if (n.includes(target)) {
      repls.forEach(replacement => {
        const variant = n.replace(new RegExp(target, 'g'), replacement);
        if (variant !== n && variant.length <= MUTATION_LIMITS.MAX_NAME_LENGTH) {
          variants.add(variant);
        }
      });
    }
  }

  // 3. Vowel Addition (Safe suffixes)
  if (!mutationRules.vowels.includes(n[n.length - 1])) {
    const v1 = n + 'A';
    const v2 = n + 'I';
    if (v1.length <= MUTATION_LIMITS.MAX_NAME_LENGTH) variants.add(v1);
    if (v2.length <= MUTATION_LIMITS.MAX_NAME_LENGTH) variants.add(v2);
  }

  // 4. Silent Letters Rule
  mutationRules.silentLetters.forEach(letter => {
    const v = n + letter;
    if (v.length <= MUTATION_LIMITS.MAX_NAME_LENGTH) variants.add(v);
  });

  // PHONETIC IDENTITY FILTERING
  // Prune variants that drift too far or are invalid
  const filtered = Array.from(variants).filter(v => {
    const confidence = calculateMutationConfidence(n, v);
    // Only keep variants with decent confidence and that are valid
    return confidence.isValid && confidence.confidence > 0.5;
  });

  return filtered;
}
