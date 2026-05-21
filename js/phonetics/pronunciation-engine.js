import { PHONETIC_CONSTANTS } from './language-profiles.js';

/**
 * Checks if a name is likely pronounceable by looking at consonant/vowel balance
 * and avoiding forbidden clusters.
 */
export function analyzePronunciation(name) {
  const n = name.toUpperCase();
  const { vowels, consonants, awkwardClusters, maxRepeatingLetters } = PHONETIC_CONSTANTS;
  
  const issues = [];
  
  // 1. Check for awkward consonant clusters
  for (const cluster of awkwardClusters) {
    if (n.includes(cluster)) {
      issues.push(`Awkward transition: ${cluster}`);
    }
  }

  // 2. Check for too many consecutive consonants
  const consonantRegex = new RegExp(`[${consonants.join("")}]{4,}`, 'g');
  if (consonantRegex.test(n)) {
    issues.push("Too many consecutive consonants");
  }

  // 3. Check for too many consecutive vowels
  const vowelRegex = new RegExp(`[${vowels.join("")}]{4,}`, 'g');
  if (vowelRegex.test(n)) {
    issues.push("Too many consecutive vowels");
  }

  // 4. Check for excessive repetition (e.g. AAA, SSS)
  for (let i = 0; i < n.length - maxRepeatingLetters; i++) {
    if (n[i] === n[i+1] && n[i] === n[i+2]) {
      issues.push(`Excessive repetition of ${n[i]}`);
    }
  }

  // Calculate flow score (0 to 1)
  const vowelCount = (n.match(/[AEIOUY]/g) || []).length;
  const vowelDensity = vowelCount / n.length;
  const densityIssue = (vowelDensity < 0.2 || vowelDensity > 0.6) ? 0.3 : 0;

  const score = Math.max(0, 1 - (issues.length * 0.25) - densityIssue);

  return {
    isSmooth: issues.length === 0,
    score,
    issues,
    vowelDensity
  };
}
