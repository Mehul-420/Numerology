import { VALIDATION_THRESHOLDS, VERDICTS } from './validator-config.js';

/**
 * Determines the final verdict for a manual name mutation.
 */
export function generateVerdict(evaluation) {
  const { score, phonetics, warnings } = evaluation;
  
  const reasons = [];
  const status = "success";

  // Decision Logic
  if (score > 85 && phonetics.confidence > 0.8 && warnings.length === 0) {
    return {
      title: VERDICTS.HIGHLY_RECOMMENDED,
      color: "green",
      summary: "This mutation is perfect. It improves your numerology without losing your identity."
    };
  }

  if (phonetics.confidence < VALIDATION_THRESHOLDS.MIN_CONFIDENCE) {
    return {
      title: VERDICTS.REJECTED,
      color: "red",
      summary: "This mutation drifts too far from the original pronunciation. It may feel robotic or unreadable."
    };
  }

  if (score < 50) {
    return {
      title: VERDICTS.CAUTION_DRIFT,
      color: "orange",
      summary: "The numerology score is low. Consider a variant that aligns better with your birth profile."
    };
  }

  return {
    title: VERDICTS.SAFE_VARIANT,
    color: "blue",
    summary: "A safe, readable variant that provides moderate improvement."
  };
}
