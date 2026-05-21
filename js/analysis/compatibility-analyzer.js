import { mulankDetails } from '../config/numerology-config.js';

export function analyzeCompatibility(mulank) {
  const info = mulankDetails[mulank];
  if (!info) return { friendlyNumbers: [], neutralNumbers: [], conflictNumbers: [] };

  return {
    friendlyNumbers: info.friendly || [],
    neutralNumbers: info.neutral || [],
    conflictNumbers: [...(info.anti || []), ...(info.hardcoreAnti || [])]
  };
}
