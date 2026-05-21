import { reduceToDigit } from './cycle-reducer.js';

/**
 * Formula: Personal Year + Personal Month + Current Day
 */
export function calculatePersonalDay(personalYear, personalMonth, currentDay) {
  // Formula usually uses Personal Year + Personal Month + Day digits
  const sum = personalYear + personalMonth + reduceToDigit(currentDay);
  return reduceToDigit(sum);
}
