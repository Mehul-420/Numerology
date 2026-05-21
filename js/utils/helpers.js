import { masterNumbers } from './constants.js';

export function reduceNumber(value, keepMasters = true) {
  let total = Math.abs(Number(value));
  while (total > 9) {
    if (keepMasters && masterNumbers.has(total)) {
      return total;
    }
    total = String(total)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return total;
}

export function detectDuringReduction(value, candidates) {
  let total = Math.abs(Number(value));
  while (total > 9) {
    if (candidates.has(total)) {
      return total;
    }
    total = String(total)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return candidates.has(total) ? total : null;
}

export function formatDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function isMasterNumber(value) {
  return [11, 22, 33].includes(Number(value));
}

export function sumDateDigits(dateValue) {
  return dateValue.replace(/\D/g, "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}
