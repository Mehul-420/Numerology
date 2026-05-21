import { TEMPORAL_INSIGHTS } from './temporal-config.js';
import { getSuccessScore, getFavorabilityInterpretation } from './success-matrix.js';

/**
 * Interprets a specific temporal cycle.
 */
export function interpretCycle(mulank, cycleNumber, type) {
  const score = getSuccessScore(mulank, cycleNumber);
  const favorability = getFavorabilityInterpretation(score);
  const insight = TEMPORAL_INSIGHTS[cycleNumber]?.[type] || "";

  return {
    value: cycleNumber,
    score,
    favorability,
    insight
  };
}

/**
 * Generates high-level recommendations based on the analysis.
 */
export function generateTemporalRecommendations(analysis) {
  const recs = [];
  
  if (analysis.personalYear.score >= 90) {
    recs.push("This year is ideal for major life transitions and high-stakes decisions.");
  } else if (analysis.personalYear.score <= 40) {
    recs.push("This year suggests a period of caution and inner reflection rather than outward expansion.");
  }

  return recs;
}
