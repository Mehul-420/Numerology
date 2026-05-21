import { normalizeName } from '../names/name-parser.js';

/**
 * Generates initial base candidates for optimization.
 * In the foundation layer, it primarily uses the user's input name.
 */
export function generateBaseCandidates(reading, analysis) {
  // Use the reading name as the primary base
  const baseName = normalizeName(reading.name);
  
  // Future: Could pull from a curated database of names compatible with Mulank
  const candidates = [baseName];
  
  return candidates;
}
