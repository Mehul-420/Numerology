import { PHONETIC_COSTS } from './phonetic-config.js';
import { transliterationMap } from './transliteration-map.js';

/**
 * Calculates a weighted phonetic distance between two names.
 * Phonetically equivalent changes (i <-> ee) have low cost.
 * Random changes (i <-> x) have high cost.
 */
export function calculatePhoneticDistance(a, b) {
  const s1 = a.toUpperCase();
  const s2 = b.toUpperCase();
  
  const m = s1.length;
  const n = s2.length;
  
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];

      if (char1 === char2) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const cost = getPhoneticEditCost(char1, char2);
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }
  }

  return dp[m][n];
}

function getPhoneticEditCost(char1, char2) {
  // Check if they are equivalent in our map
  for (const [v, equivalents] of Object.entries(transliterationMap.vowels)) {
    if ((v === char1 && equivalents.includes(char2)) || (v === char2 && equivalents.includes(char1))) {
      return PHONETIC_COSTS.EQUIVALENT;
    }
  }
  
  for (const [c, equivalents] of Object.entries(transliterationMap.consonants)) {
    if ((c === char1 && equivalents.includes(char2)) || (c === char2 && equivalents.includes(char1))) {
      return PHONETIC_COSTS.EQUIVALENT;
    }
  }

  // Similar groups (Manual mapping for drift)
  const similar = [
    ['V', 'W'], ['S', 'Z'], ['K', 'C'], ['J', 'Y'], ['B', 'P'], ['D', 'T']
  ];
  
  if (similar.some(pair => pair.includes(char1) && pair.includes(char2))) {
    return PHONETIC_COSTS.SIMILAR;
  }

  return PHONETIC_COSTS.HEAVY_DRIFT;
}
