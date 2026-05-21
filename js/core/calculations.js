import { reduceNumber, detectDuringReduction, sumDateDigits } from '../utils/helpers.js';
import { letterValues, chaldeanLetterValues } from '../config/numerology-config.js';
import { masterNumbers, karmicNumbers, vowels } from '../utils/constants.js';

export function sumLetters(name, mode = "all") {
  return name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((sum, letter) => {
      const isVowel = vowels.has(letter);
      if (mode === "vowels" && !isVowel) return sum;
      if (mode === "consonants" && isVowel) return sum;
      return sum + (letterValues[letter] || 0);
    }, 0);
}

export function calculateNameNumber(name) {
  const total = name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((sum, letter) => sum + (chaldeanLetterValues[letter] || 0), 0);

  return reduceNumber(total, true);
}

export function getChaldeanNameTotal(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((sum, letter) => sum + (chaldeanLetterValues[letter] || 0), 0);
}

export function calculateLifePath(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const total = reduceNumber(year, false) + reduceNumber(month, false) + reduceNumber(day, false);
  return reduceNumber(total);
}

export function calculateLifePathKarmic(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const total = reduceNumber(year, false) + reduceNumber(month, false) + reduceNumber(day, false);
  return detectDuringReduction(total, karmicNumbers);
}

export function calculateBhagyank(dateValue) {
  return reduceNumber(sumDateDigits(dateValue), false);
}

export function calculateBhagyankMaster(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return reduceNumber(day + month + year, true);
}

export function calculateBhagyankKarmic(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return detectDuringReduction(day + month + year, karmicNumbers);
}

export function calculateKua(year, gender) {
  const yearDigit = reduceNumber(year, false);
  const rawKua = gender === "female" ? 4 + yearDigit : 11 - yearDigit;
  const kua = reduceNumber(rawKua, false);

  if (kua === 5) {
    return gender === "female" ? 8 : 2;
  }

  return kua;
}

export function calculateLoShuGrid(birthDate, mulank, bhagyank, kua, nameNumber) {
  const digits = birthDate.replace(/\D/g, "").split("");
  if (mulank) digits.push(String(mulank));
  if (bhagyank) digits.push(String(bhagyank));
  if (kua) digits.push(String(kua));
  if (nameNumber) digits.push(String(nameNumber));

  const counts = {};
  digits.forEach(d => {
    if (d === "0" || !d || d === "undefined") return;
    counts[d] = (counts[d] || "") + d;
  });
  return counts;
}

export function normalizeReading(reading) {
  if (!reading || !reading.birthDate) return reading;
  const [year, month, day] = reading.birthDate.split("-").map(Number);
  const gender = reading.gender || "male";
  const personalYearBase = reduceNumber(new Date().getFullYear(), false) + reduceNumber(month, false) + reduceNumber(day, false);

  const m = reduceNumber(month, false);
  const d = reduceNumber(day, false);
  const y = reduceNumber(year, false);
  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  return {
    ...reading,
    gender,
    mulank: reading.mulank || reduceNumber(day, false),
    mulankMaster: reading.mulankMaster || reduceNumber(day, true),
    mulankKarmic: reading.mulankKarmic || detectDuringReduction(day, karmicNumbers),
    bhagyank: reading.bhagyank || calculateBhagyank(reading.birthDate),
    bhagyankMaster: reading.bhagyankMaster || calculateBhagyankMaster(reading.birthDate),
    bhagyankKarmic: reading.bhagyankKarmic || calculateBhagyankKarmic(reading.birthDate),
    kua: reading.kua || calculateKua(year, gender),
    nameNumber: reading.nameNumber || calculateNameNumber(reading.name),
    nameNumberKarmic: reading.nameNumberKarmic || detectDuringReduction(getChaldeanNameTotal(reading.name), karmicNumbers),
    lifePathKarmic: reading.lifePathKarmic || calculateLifePathKarmic(reading.birthDate),
    destinyKarmic: reading.destinyKarmic || detectDuringReduction(sumLetters(reading.name), karmicNumbers),
    soulUrgeKarmic: reading.soulUrgeKarmic || detectDuringReduction(sumLetters(reading.name, "vowels"), karmicNumbers),
    personalityKarmic: reading.personalityKarmic || detectDuringReduction(sumLetters(reading.name, "consonants"), karmicNumbers),
    birthdayKarmic: reading.birthdayKarmic || detectDuringReduction(day, karmicNumbers),
    personalYearKarmic: reading.personalYearKarmic || detectDuringReduction(personalYearBase, karmicNumbers),
    challengeNumbers: reading.challengeNumbers || { c1, c2, c3, c4 }
  };
}

export function calculateReading(name, birthDate, gender) {
  const [year, month, day] = birthDate.split("-").map(Number);
  const personalYearBase = reduceNumber(new Date().getFullYear(), false) + reduceNumber(month, false) + reduceNumber(day, false);
  const nameTotal = sumLetters(name);
  const soulUrgeTotal = sumLetters(name, "vowels");
  const personalityTotal = sumLetters(name, "consonants");
  const chaldeanNameTotal = getChaldeanNameTotal(name);

  const m = reduceNumber(month, false);
  const d = reduceNumber(day, false);
  const y = reduceNumber(year, false);
  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  return {
    id: `${Date.now()}`,
    name: name.trim(),
    birthDate,
    gender,
    mulank: reduceNumber(day, false),
    mulankMaster: reduceNumber(day, true),
    mulankKarmic: detectDuringReduction(day, karmicNumbers),
    bhagyank: calculateBhagyank(birthDate),
    bhagyankMaster: calculateBhagyankMaster(birthDate),
    bhagyankKarmic: calculateBhagyankKarmic(birthDate),
    kua: calculateKua(year, gender),
    nameNumber: reduceNumber(chaldeanNameTotal, true),
    nameNumberKarmic: detectDuringReduction(chaldeanNameTotal, karmicNumbers),
    lifePath: calculateLifePath(birthDate),
    lifePathKarmic: calculateLifePathKarmic(birthDate),
    destiny: reduceNumber(nameTotal),
    destinyKarmic: detectDuringReduction(nameTotal, karmicNumbers),
    soulUrge: reduceNumber(soulUrgeTotal),
    soulUrgeKarmic: detectDuringReduction(soulUrgeTotal, karmicNumbers),
    personality: reduceNumber(personalityTotal),
    personalityKarmic: detectDuringReduction(personalityTotal, karmicNumbers),
    birthday: reduceNumber(day),
    birthdayKarmic: detectDuringReduction(day, karmicNumbers),
    personalYear: reduceNumber(personalYearBase, false),
    personalYearKarmic: detectDuringReduction(personalYearBase, karmicNumbers),
    challengeNumbers: { c1, c2, c3, c4 }
  };
}
