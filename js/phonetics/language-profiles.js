export const PHONETIC_CONSTANTS = {
  vowels: ['A', 'E', 'I', 'O', 'U', 'Y'],
  consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'],
  awkwardClusters: [
    'YX', 'QZ', 'JX', 'VJ', 'WQ', 'ZW', 'ZX', 'QX', 'XQ', 'QK', 'QW', 'JQ', 'JP', 'BK', 'BK', 'CF', 'CP', 'CV'
  ],
  maxRepeatingLetters: 2
};

export const languageProfiles = {
  indian: {
    name: "Indian",
    preferredEndings: ['A', 'AN', 'YA', 'I', 'U', 'SH', 'TH'],
    commonStarts: ['AA', 'RA', 'SH', 'KR', 'AM', 'AN'],
    vowelDensityTarget: 0.45
  },
  western: {
    name: "Western",
    preferredEndings: ['N', 'ER', 'SON', 'Y', 'A', 'IE'],
    commonStarts: ['AL', 'ST', 'BR', 'CH', 'PH'],
    vowelDensityTarget: 0.4
  }
};
