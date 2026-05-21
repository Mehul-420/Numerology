import { reduceToDigit } from './cycle-reducer.js';

/**
 * Formula: DOB Day + DOB Month + Current Year
 */
export function calculatePersonalYear(dob, currentYear) {
  const [y, m, d] = dob.split("-").map(Number);
  
  // Rule: Sum Day + Month + Current Year digits
  const sum = reduceToDigit(d) + reduceToDigit(m) + reduceToDigit(currentYear);
  return reduceToDigit(sum);
}
