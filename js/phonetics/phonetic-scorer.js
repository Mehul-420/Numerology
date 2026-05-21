import { analyzePronunciation } from './pronunciation-engine.js';
import { analyzeSyllables } from './syllable-analyzer.js';
import { analyzeReadability } from './readability-engine.js';
import { checkCulturalAlignment } from './cultural-rules.js';
import { calculateMutationConfidence } from './mutation-confidence.js';

/**
 * Orchestrates the phonetic and cultural scoring of a name.
 */
export function getPhoneticScore(name, profileKey = 'indian', originalName = null) {
  const pronunciation = analyzePronunciation(name);
  const syllables = analyzeSyllables(name);
  const readability = analyzeReadability(name);
  const cultural = checkCulturalAlignment(name, profileKey);
  
  let confidenceResult = null;
  if (originalName && originalName !== name) {
    confidenceResult = calculateMutationConfidence(originalName, name);
  }

  // Weighted phonetic baseline (0 to 100)
  let weightedScore = (
    (pronunciation.score * 0.4) + 
    (readability.score * 0.3) + 
    (cultural.score * 0.3)
  ) * 100;

  // Apply confidence penalty if applicable
  if (confidenceResult) {
    weightedScore *= confidenceResult.confidence;
  }

  const reasons = [];
  const warnings = [];

  if (pronunciation.score > 0.8) reasons.push("Natural pronunciation");
  if (readability.hasNaturalVibe) reasons.push("Clean visual structure");
  if (syllables.isRhythmic) reasons.push("Balanced syllables");
  if (cultural.isAligned) reasons.push(`Fits ${cultural.profile} patterns`);
  if (confidenceResult && confidenceResult.isHighConfidence) reasons.push("Preserves phonetic identity");

  if (!pronunciation.isSmooth) warnings.push("Awkward phonetic transitions");
  if (syllables.hasExcessiveVowels) warnings.push("Excessive vowel clusters");
  if (confidenceResult && !confidenceResult.isValid) warnings.push("High phonetic drift");

  return {
    value: Math.round(weightedScore),
    reasons,
    warnings,
    metadata: {
      pronunciation,
      syllables,
      readability,
      cultural,
      confidence: confidenceResult
    }
  };
}
