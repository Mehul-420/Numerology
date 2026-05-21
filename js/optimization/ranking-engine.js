import { OPTIMIZATION_CONFIG } from './optimization-config.js';

/**
 * Finalizes and ranks the candidates.
 */
export function rankSuggestions(candidates) {
  return candidates
    .filter(c => c.score >= OPTIMIZATION_CONFIG.MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, OPTIMIZATION_CONFIG.MAX_SUGGESTIONS);
}
