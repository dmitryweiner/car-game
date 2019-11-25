export const V_DECR = 0.05; // decrement of the velocity with time
export const V_ACC = 0.2; // increment of the velocity with pressing accelerator
export const V_BRAKE_DECR = 0.3; // decrement of brakes
export const V_MAX = 3.0;
export const DELTA_ANGLE = 0.05;
export const STEP = 3; // max pixels per turn
export const DELAY = 50;
export const FPS = 1000 / DELAY;

export const BONUS_DELAY = 1000;
export const BONUS_RATE_COEFFICIENT = 1;
export const MAX_TTL = 15000;
export const BONUS_TTL_REWARD = MAX_TTL * 1.5;
export const MAX_BONUS_TTL = MAX_TTL;
export const MIM_BONUS_TTL = MAX_BONUS_TTL;

export const POPULATION_SIZE = 40;
export const ELITISM = POPULATION_SIZE * 0.1;
export const MUTATION_RATE = 0.4;
export const MUTATION_AMOUNT = 4;
export const TRAINING_CELL_SIZE = 3000;
export const MAX_SEEKING_DISTANCE = TRAINING_CELL_SIZE * 0.5;
export const SECTORS_OF_VISION = 32;
export const SCORE_REPRODUCTION_COEFFICIENT = 2; // offspring for highest score
export const OVERHEAD = 2;
export const BONUS_REWARD = 10;
export const NUMBER_OF_AI_CARS_IN_WEB = 3;
export const ACTIVATION_THRESHOLD = 0.73;

