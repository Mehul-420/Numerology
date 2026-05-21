import { THRESHOLDS } from '../config/scoring-config.js';

export function analyzeNumbers(counts, threshold = THRESHOLDS.OVERLOAD) {
  const missingNumbers = [];
  const repeatedNumbers = {};
  const overloadedNumbers = [];
  const dominantNumbers = [];

  for (let i = 1; i <= 9; i++) {
    const val = counts[String(i)] || "";
    const count = val.length;

    if (count === 0) {
      missingNumbers.push(i);
    } else {
      repeatedNumbers[i] = count;
      if (count >= threshold) {
        overloadedNumbers.push(i);
      }
      if (count >= THRESHOLDS.DOMINANT) {
        dominantNumbers.push(i);
      }
    }
  }

  return { missingNumbers, repeatedNumbers, overloadedNumbers, dominantNumbers };
}
