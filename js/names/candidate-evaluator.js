import { normalizeName } from './name-parser.js';
import { calculateNameNumber } from './name-calculator.js';
import { analyzeNameImpact } from './name-analyzer.js';
import { calculateNameScore } from './scoring-engine.js';
import { getPhoneticScore } from '../phonetics/phonetic-scorer.js';

/**
 * Orchestrates the full evaluation pipeline for a candidate name.
 */
export function evaluateCandidateName(name, analysis, culturalProfile = 'indian', originalName = null) {
  // 1. Normalization
  const cleanName = normalizeName(name);
  if (!cleanName) return null;

  // 2. Chaldean Calculation
  const nameData = calculateNameNumber(cleanName);

  // 3. Phonetic & Cultural Analysis
  const phonetics = getPhoneticScore(cleanName, culturalProfile, originalName);

  // 4. Compatibility & Grid Analysis
  const impact = analyzeNameImpact(nameData, analysis);

  // 5. Score Evaluation
  const scoring = calculateNameScore(impact, phonetics);

  // 6. Final Result Object
  return {
    name: nameData.name,
    total: nameData.total,
    reduced: nameData.reduced,
    breakdown: nameData.breakdown,

    compatibility: impact.compatibility,
    gridImpact: impact.gridImpact,
    phonetics: phonetics.metadata,

    score: scoring.value,
    reasons: scoring.reasons,
    warnings: scoring.warnings
  };
}
