export const mutationRules = {
  doubleableLetters: ['A', 'E', 'I', 'O', 'U', 'N', 'R', 'L', 'S'],
  substitutions: {
    'I': ['EE', 'Y'],
    'U': ['OO'],
    'K': ['C', 'CK'],
    'C': ['K', 'CH'],
    'S': ['Z', 'SH'],
    'Y': ['I'],
    'PH': ['F'],
    'F': ['PH'],
    'V': ['W'],
    'W': ['V']
  },
  vowels: ['A', 'E', 'I', 'O', 'U'],
  silentLetters: ['H']
};
