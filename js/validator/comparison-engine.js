import { calculateNameNumber } from '../names/name-calculator.js';
import { calculatePhoneticDistance } from '../phonetics/phonetic-distance.js';
import { getPhoneticSignature } from '../phonetics/phonetic-signature.js';
import { checkSyllablePreservation } from '../phonetics/syllable-preserver.js';

/**
 * Compares two names across all numerological and phonetic metrics.
 */
export function compareNames(original, variant) {
  const oData = calculateNameNumber(original);
  const vData = calculateNameNumber(variant);
  
  const distance = calculatePhoneticDistance(original, variant);
  const sigMatch = getPhoneticSignature(original) === getPhoneticSignature(variant);
  const syllable = checkSyllablePreservation(original, variant);

  return {
    metrics: {
      original: {
        total: oData.total,
        reduced: oData.reduced
      },
      variant: {
        total: vData.total,
        reduced: vData.reduced
      }
    },
    phonetics: {
      distance,
      soundexMatch: sigMatch,
      syllablePreserved: syllable.isPreserved,
      syllableDrift: syllable.drift
    }
  };
}
