import { runFullAnalysis } from '../analysis/analysis-engine.js';
import { generateBaseCandidates } from './candidate-generator.js';
import { runBeamSearch } from './beam-search.js';
import { rankSuggestions } from './ranking-engine.js';

/**
 * Orchestrates the high-level suggestion and optimization pipeline.
 * @param {object} reading - The normalized reading object.
 * @param {string} culturalProfile - The cultural naming profile to use.
 */
export function generateNameSuggestions(reading, culturalProfile = 'indian') {
  // 1. Run full profile analysis
  const analysis = runFullAnalysis(reading);

  // 2. Generate starting seeds
  const seeds = generateBaseCandidates(reading, analysis);

  // 3. Run Beam Search optimization
  const candidates = runBeamSearch(seeds, analysis, culturalProfile);

  // 4. Final Ranking and pruning
  const suggestions = rankSuggestions(candidates);

  return {
    analysis,
    suggestions
  };
}
