import { calculatePersonalYear } from './personal-year.js';
import { calculatePersonalMonth } from './personal-month.js';
import { calculatePersonalDay } from './personal-day.js';
import { interpretCycle, generateTemporalRecommendations } from './temporal-interpreter.js';

/**
 * Orchestrates the full temporal analysis.
 */
export function analyzeTemporalCycles(reading, referenceDate = new Date()) {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // 1-12
  const currentDay = referenceDate.getDate();

  // 1. Calculate raw values
  const year = calculatePersonalYear(reading.birthDate, currentYear);
  const month = calculatePersonalMonth(year, currentMonth);
  const day = calculatePersonalDay(year, month, currentDay);

  // 2. Interpretations
  const yearAnalysis = interpretCycle(reading.mulank, year, "year");
  const monthAnalysis = interpretCycle(reading.mulank, month, "month");
  const dayAnalysis = interpretCycle(reading.mulank, day, "day");

  const analysis = {
    personalYear: yearAnalysis,
    personalMonth: monthAnalysis,
    personalDay: dayAnalysis,
    referenceDate: referenceDate.toISOString()
  };

  analysis.recommendations = generateTemporalRecommendations(analysis);

  return analysis;
}
