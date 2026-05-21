/**
 * Centralized configuration for temporal numerology.
 */

export const TEMPORAL_INSIGHTS = {
  1: {
    year: "A year of new beginnings, leadership, and independence.",
    month: "Focus on initiating new projects and personal goals.",
    day: "Initiate action and rely on your own strength."
  },
  2: {
    year: "A year of cooperation, relationships, and patience.",
    month: "Favor teamwork and emotional balance.",
    day: "Collaborate and practice diplomacy."
  },
  3: {
    year: "A year of self-expression, creativity, and social growth.",
    month: "Focus on communication and joyful activities.",
    day: "Express your ideas and socialize."
  },
  4: {
    year: "A year of hard work, discipline, and building foundations.",
    month: "Focus on organization and practical tasks.",
    day: "Stick to your routine and stay disciplined."
  },
  5: {
    year: "A year of change, freedom, and adaptability.",
    month: "Be open to new experiences and travel.",
    day: "Embrace variety and be flexible."
  },
  6: {
    year: "A year of responsibility, family, and home life.",
    month: "Focus on domestic duties and caring for others.",
    day: "Nurture your relationships and home environment."
  },
  7: {
    year: "A year of introspection, spiritual growth, and research.",
    month: "Spend time in reflection and deep thinking.",
    day: "Research and trust your inner wisdom."
  },
  8: {
    year: "A year of material success, power, and karma.",
    month: "Focus on finances and authoritative roles.",
    day: "Manage your resources and take charge."
  },
  9: {
    year: "A year of completion, humanitarian work, and letting go.",
    month: "Focus on finishing old tasks and helping others.",
    day: "Release what no longer serves you."
  }
};

/**
 * Maps Driver (Mulank) x Current Temporal Cycle to favorability score.
 * Simplistic version for foundation.
 */
export const SUCCESS_MATRIX = {
  1: { 1: 99, 2: 91, 3: 91, 4: 70, 5: 85, 6: 80, 7: 60, 8: 40, 9: 90 },
  2: { 1: 91, 2: 99, 3: 85, 4: 40, 5: 90, 6: 80, 7: 70, 8: 30, 9: 50 },
  3: { 1: 91, 2: 85, 3: 99, 4: 60, 5: 91, 6: 50, 7: 80, 8: 60, 9: 70 },
  4: { 1: 70, 2: 40, 3: 60, 4: 99, 5: 80, 6: 85, 7: 90, 8: 50, 9: 40 },
  5: { 1: 85, 2: 90, 3: 91, 4: 80, 5: 99, 6: 85, 7: 70, 8: 60, 9: 50 },
  6: { 1: 80, 2: 80, 3: 50, 4: 85, 5: 85, 6: 99, 7: 80, 8: 70, 9: 60 },
  7: { 1: 60, 2: 70, 3: 80, 4: 90, 5: 70, 6: 80, 7: 99, 8: 60, 9: 50 },
  8: { 1: 40, 2: 30, 3: 60, 4: 50, 5: 60, 6: 70, 7: 60, 8: 90, 9: 60 },
  9: { 1: 90, 2: 50, 3: 70, 4: 40, 5: 50, 6: 60, 7: 50, 8: 60, 9: 99 }
};

export const FAVORABILITY_LEVELS = [
  { min: 90, label: "Extremely Favorable", color: "green" },
  { min: 70, label: "Strong", color: "blue" },
  { min: 50, label: "Moderate", color: "orange" },
  { min: 30, label: "Weak", color: "grey" },
  { min: 0, label: "Challenging", color: "red" }
];
