export const VALIDATION_THRESHOLDS = {
  MIN_CONFIDENCE: 0.6,
  MIN_READABILITY: 0.4,
  MAX_PHONETIC_DISTANCE: 4.5,
  MAX_SYLLABLE_DRIFT: 0.25
};

export const VERDICTS = {
  HIGHLY_RECOMMENDED: "Highly Recommended",
  SAFE_VARIANT: "Safe Variant",
  CAUTION_DRIFT: "Caution: Phonetic Drift",
  REJECTED: "Not Recommended"
};
