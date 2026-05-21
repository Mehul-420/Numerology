import { languageProfiles } from './language-profiles.js';

/**
 * Checks if a name aligns with a specific cultural profile.
 */
export function checkCulturalAlignment(name, profileKey = 'indian') {
  const n = name.toUpperCase();
  const profile = languageProfiles[profileKey] || languageProfiles.indian;
  
  const matchesEnding = profile.preferredEndings.some(e => n.endsWith(e));
  const matchesStart = profile.commonStarts.some(s => n.startsWith(s));
  
  const vowelCount = (n.match(/[AEIOUY]/g) || []).length;
  const vowelDensity = vowelCount / n.length;
  const densityMatch = Math.abs(vowelDensity - profile.vowelDensityTarget) < 0.15;

  let score = 0.5;
  if (matchesEnding) score += 0.2;
  if (matchesStart) score += 0.2;
  if (densityMatch) score += 0.1;

  return {
    profile: profile.name,
    isAligned: score >= 0.7,
    score
  };
}
