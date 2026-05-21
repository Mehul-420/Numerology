import { SCORING_WEIGHTS } from '../config/scoring-config.js';

/**
 * Deterministic weighted scoring for a name candidate.
 * Evaluates the impact of the name's reduced number on the overall profile.
 */
export function calculateNameScore(impact, phoneticResult = null, weights = SCORING_WEIGHTS) {
  let score = 40; // Reduced baseline to allow for more additive growth
  const reasons = [];
  const warnings = [];

  // 1. Compatibility Scoring
  if (impact.compatibility.mulank === 'friendly') {
    score += weights.MULANK_FRIENDLY;
    reasons.push(`Friendly with Mulank`);
  } else if (impact.compatibility.mulank === 'hostile' || impact.compatibility.mulank === 'anti') {
    score += weights.HOSTILE_COMPATIBILITY;
    warnings.push(`Conflict with Mulank`);
  }

  if (impact.compatibility.bhagyank === 'friendly') {
    score += weights.BHAGYANK_FRIENDLY;
    reasons.push(`Friendly with Bhagyank`);
  }

  // 2. Grid Impact Scoring
  if (impact.gridImpact.fillsMissing) {
    score += weights.FILLS_MISSING_NUMBER;
    reasons.push(`Balances missing energy`);
  }

  if (impact.gridImpact.activatesPlane) {
    score += weights.ACTIVATES_PLANE;
    reasons.push(`Strengthens life planes`);
  }

  if (impact.gridImpact.overloadsEnergy) {
    score += weights.CONFLICT_OVERLOADED;
    warnings.push(`Excessive energy overload`);
  }

  // 3. Phonetic Quality Scoring
  if (phoneticResult) {
    const phoneticBonus = (phoneticResult.value / 100) * weights.PHONETIC_QUALITY;
    score += Math.round(phoneticBonus);
    
    // Pass through top-level reasons and warnings
    reasons.push(...phoneticResult.reasons);
    warnings.push(...phoneticResult.warnings);
  }

  // Clamp score between 0 and 100
  return {
    value: Math.min(Math.max(score, 0), 100),
    reasons: [...new Set(reasons)], // Deduplicate
    warnings: [...new Set(warnings)]
  };
}
