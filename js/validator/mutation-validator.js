import { evaluateCandidateName } from '../names/candidate-evaluator.js';
import { compareNames } from './comparison-engine.js';
import { generateVerdict } from './verdict-engine.js';

/**
 * Validates a manually entered name variant against the original.
 */
export function validateManualMutation(originalName, customVariant, analysis) {
  // 1. Full Evaluation
  const evaluation = evaluateCandidateName(customVariant, analysis, 'indian', originalName);
  
  if (!evaluation) return null;

  // 2. Cross-Comparison
  const comparison = compareNames(originalName, customVariant);

  // 3. Generate Verdict
  const verdict = generateVerdict(evaluation);

  return {
    original: originalName,
    variant: customVariant,
    
    evaluation,
    comparison,
    verdict,
    
    score: evaluation.score,
    reasons: evaluation.reasons,
    warnings: evaluation.warnings
  };
}
