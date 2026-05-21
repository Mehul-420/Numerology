import { planeDefinitions } from '../utils/constants.js';
import { THRESHOLDS } from '../config/scoring-config.js';

/**
 * Analyzes the impact of a name's vibrational energy on the existing numerology profile.
 * Consumes the Analysis object from Part-1.
 */
export function analyzeNameImpact(nameData, analysis) {
  const n = nameData.reduced;
  
  // 1. Compatibility Analysis
  const compatibility = {
    mulank: analysis.friendlyNumbers.includes(n) ? 'friendly' : 
            analysis.conflictNumbers.includes(n) ? 'anti' : 'neutral',
    bhagyank: 'neutral' // Placeholder for now unless we expand Bhagyank friendly logic
  };

  // 2. Grid Impact Analysis
  const fillsMissing = analysis.missingNumbers.includes(n);
  
  // Check if adding this number completes a plane
  let activatesPlane = false;
  const missingInPlanes = planeDefinitions.map(plane => {
    const missing = plane.nums.filter(num => !analysis.repeatedNumbers[num]);
    return { name: plane.name, missing };
  });

  const completions = missingInPlanes.filter(p => p.missing.length === 1 && p.missing[0] === n);
  if (completions.length > 0) {
    activatesPlane = true;
  }

  // Check for overload (e.g. 3+ digits)
  const currentCount = analysis.repeatedNumbers[n] || 0;
  const overloadsEnergy = (currentCount + 1) >= THRESHOLDS.OVERLOAD;

  return {
    compatibility,
    gridImpact: {
      fillsMissing,
      activatesPlane,
      overloadsEnergy,
      impactedPlanes: completions.map(c => c.name)
    }
  };
}
