export const transliterationMap = {
  vowels: {
    'A': ['AA'],
    'E': ['EE', 'IE'],
    'I': ['EE', 'IE', 'Y'],
    'O': ['OO'],
    'U': ['OO', 'OU'],
    'Y': ['I', 'EE']
  },
  consonants: {
    'K': ['C', 'CK'],
    'C': ['K', 'S'],
    'V': ['W'],
    'W': ['V'],
    'PH': ['F'],
    'F': ['PH'],
    'SH': ['S'],
    'Z': ['S'],
    'KS': ['X'],
    'BH': ['B'],
    'DH': ['D'],
    'GH': ['G'],
    'KH': ['K'],
    'TH': ['T']
  }
};

/**
 * Returns a list of equivalent graphemes for a given character or cluster.
 */
export function getEquivalents(grapheme) {
  const g = grapheme.toUpperCase();
  return [
    ...(transliterationMap.vowels[g] || []),
    ...(transliterationMap.consonants[g] || [])
  ];
}
