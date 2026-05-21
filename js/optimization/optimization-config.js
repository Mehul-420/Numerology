export const OPTIMIZATION_CONFIG = {
  BEAM_WIDTH: 5,           // How many top candidates to keep per iteration
  MAX_ITERATIONS: 3,       // Max steps of mutation
  MIN_SCORE_THRESHOLD: 60, // Only keep suggestions above this score
  MAX_SUGGESTIONS: 6       // Final number of suggestions to show
};

export const MUTATION_LIMITS = {
  MAX_NAME_LENGTH: 15,
  MAX_MUTATIONS_PER_NAME: 2
};
