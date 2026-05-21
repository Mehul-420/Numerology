export const PHONETIC_COSTS = {
  IDENTICAL: 0,
  EQUIVALENT: 0.1,    // e.g., i <-> ee
  SIMILAR: 0.3,       // e.g., v <-> w
  SLIGHT_DRIFT: 0.6,  // e.g., s <-> sh
  HEAVY_DRIFT: 1.5,   // e.g., a <-> o
  Robotic: 5.0        // e.g., x <-> q
};

export const MUTATION_CONSTRAINTS = {
  MAX_REPETITION: 2,
  PRESERVE_LEFT_EDGE: true,
  LEFT_EDGE_LENGTH: 2, // First 2 characters/consonants
  SYLLABLE_DRIFT_TOLERANCE: 0.2
};
