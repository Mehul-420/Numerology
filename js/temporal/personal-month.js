import { reduceToDigit } from './cycle-reducer.js';

/**
 * Formula: Personal Year + Current Month
 */
export function calculatePersonalMonth(personalYear, currentMonth) {
  // currentMonth is 1-indexed (1-12)
  const sum = personalYear + reduceToDigit(currentMonth);
  return reduceToDigit(sum);
}
