/**
 * Generates an Indic-Soundex inspired phonetic signature.
 * Normalizes aspirations, vowel length, and common transliteration variants.
 */
export function generateIndicSoundex(name) {
  if (!name) return { original: "", normalized: "", signature: "" };

  let n = name.toUpperCase();

  // 1. Aspiration Normalization (BH -> B, etc.)
  n = n.replace(/BH/g, 'B')
       .replace(/DH/g, 'D')
       .replace(/GH/g, 'G')
       .replace(/KH/g, 'K')
       .replace(/PH/g, 'F')
       .replace(/TH/g, 'T')
       .replace(/SH/g, 'S')
       .replace(/ZH/g, 'J');

  // 2. Vowel Normalization (AA -> A, EE -> I, etc.)
  let normalized = n.replace(/AA/g, 'A')
                    .replace(/EE/g, 'I')
                    .replace(/IE/g, 'I')
                    .replace(/OO/g, 'U')
                    .replace(/OU/g, 'U')
                    .replace(/Y/g, 'I')
                    .replace(/W/g, 'V')
                    .replace(/C/g, 'K');

  // 3. Consonant Grouping & Signature Generation
  // Remove vowels after the first letter and keep only primary consonants
  let signature = normalized[0];
  const consonantsOnly = normalized.slice(1).replace(/[AEIOU]/g, "");
  
  // Basic Soundex-like collapsing (remove consecutive duplicates)
  for (let i = 0; i < consonantsOnly.length; i++) {
    if (consonantsOnly[i] !== signature[signature.length - 1]) {
      signature += consonantsOnly[i];
    }
  }

  return {
    original: name,
    normalized: normalized,
    signature: signature.slice(0, 4) // Keep first 4 phonetic units
  };
}
