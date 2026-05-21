import { generateIndicSoundex } from './indic-soundex.js';

/**
 * Creates a unique phonetic fingerprint for a name.
 * Useful for grouping spelling variants that sound the same.
 */
export function getPhoneticSignature(name) {
  const soundex = generateIndicSoundex(name);
  return soundex.signature;
}

/**
 * Checks if two names sound identical or very similar.
 */
export function arePhoneticallySimilar(name1, name2) {
  return getPhoneticSignature(name1) === getPhoneticSignature(name2);
}
