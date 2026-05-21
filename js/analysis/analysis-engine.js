import { analyzeNumbers } from './number-analyzer.js';
import { analyzePlanes } from './plane-analyzer.js';
import { analyzeCompatibility } from './compatibility-analyzer.js';
import { calculateLoShuGrid } from '../core/calculations.js';

export function runFullAnalysis(reading) {
  const counts = calculateLoShuGrid(reading.birthDate, reading.mulank, reading.bhagyank, reading.kua, reading.nameNumber);
  
  const numAnalysis = analyzeNumbers(counts);
  const planeAnalysis = analyzePlanes(counts);
  const compatAnalysis = analyzeCompatibility(reading.mulank);

  return {
    ...numAnalysis,
    ...planeAnalysis,
    ...compatAnalysis,
    
    balancingNumbers: numAnalysis.missingNumbers.filter(n => compatAnalysis.friendlyNumbers.includes(n)),
    
    recommendations: {
      shouldAddNumbers: numAnalysis.missingNumbers.filter(n => compatAnalysis.friendlyNumbers.includes(n)),
      shouldAvoidNumbers: compatAnalysis.conflictNumbers
    },
    
    scoringContext: {
      preferredNameNumbers: compatAnalysis.friendlyNumbers,
      avoidedNameNumbers: compatAnalysis.conflictNumbers,
      balancingTargets: numAnalysis.missingNumbers,
      weakAreas: planeAnalysis.weakPlanes
    }
  };
}
