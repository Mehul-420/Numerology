import { OPTIMIZATION_CONFIG } from './optimization-config.js';
import { generateMutations } from './mutation-engine.js';
import { evaluateCandidateName } from '../names/candidate-evaluator.js';

/**
 * Performs a Beam Search to find the best name variants.
 * @param {string[]} seeds - Initial names to start from.
 * @param {object} analysis - The Numerology Analysis object.
 * @param {string} culturalProfile - The cultural profile for phonetic scoring.
 */
export function runBeamSearch(seeds, analysis, culturalProfile = 'indian') {
  // Use the first seed as the 'original' if it's the base name optimization
  const original = seeds[0];
  let beam = seeds.map(name => evaluateCandidateName(name, analysis, culturalProfile, original)).filter(Boolean);
  const seen = new Set(seeds);

  for (let i = 0; i < OPTIMIZATION_CONFIG.MAX_ITERATIONS; i++) {
    const nextCandidates = [];

    for (const candidate of beam) {
      const mutations = generateMutations(candidate.name);
      
      for (const mutatedName of mutations) {
        if (!seen.has(mutatedName)) {
          seen.add(mutatedName);
          const evaluation = evaluateCandidateName(mutatedName, analysis, culturalProfile, original);
          if (evaluation) nextCandidates.push(evaluation);
        }
      }
    }

    // Combine current beam with new candidates and sort by score
    const allCandidates = [...beam, ...nextCandidates];
    allCandidates.sort((a, b) => b.score - a.score);

    // Prune to beam width
    beam = allCandidates.slice(0, OPTIMIZATION_CONFIG.BEAM_WIDTH);
    
    // Stop if we aren't finding better results
    if (nextCandidates.length === 0) break;
  }

  return beam;
}
