/**
 * Analyzes the visual cleanliness and common spelling patterns
 * to determine how "natural" a name looks.
 */
export function analyzeReadability(name) {
  const n = name.toUpperCase();
  
  const rules = {
    starts: ['CH', 'SH', 'TH', 'AA', 'RA', 'MA', 'KA'],
    ends: ['AN', 'AH', 'IA', 'EE', 'YA'],
    cleanPairs: ['EE', 'OO', 'AA', 'SH', 'TH', 'CH', 'KH', 'NN', 'RR']
  };

  let score = 0.5; // Neutral base

  // Bonus for clean common pairings
  rules.cleanPairs.forEach(pair => {
    if (n.includes(pair)) score += 0.1;
  });

  // Penalty for unusual double consonants (e.g. BB, CC, DD at start/end)
  const unusualDoubles = /([^AEIOUY])\1/.exec(n);
  if (unusualDoubles && !['NN', 'RR', 'LL', 'SS', 'TT'].includes(unusualDoubles[0])) {
    score -= 0.15;
  }

  // Length check
  if (n.length > 3 && n.length < 9) score += 0.1;
  if (n.length > 12) score -= 0.2;

  return {
    score: Math.min(1, Math.max(0, score)),
    hasNaturalVibe: score > 0.6
  };
}
