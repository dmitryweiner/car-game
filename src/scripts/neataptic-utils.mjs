import * as constants from './constants.mjs';
import neataptic from 'neataptic';

/**
 *
 * @param {Neat} neat
 * @returns {Neat}
 */
export function mutate(neat) {
    neat.sort();

    let newGeneration = [];
    const max = neat.population[0].score;
    const sum = neat.population.map((brain) => brain.score).reduce((sum, x) => sum + x);
    const avg = sum / neat.population.length;


    // genotypes with highest scores will reproduce
    console.log(neat.population.map((brain) => brain.score));
    const maxIndex = neat.population.length > neat.elitism ? neat.elitism : neat.population.length;
    for (let i = 0; i < maxIndex; i++) {
        const offsprings = neat.population[i].score > (max - (max - avg) / constants.OVERHEAD)
            ? constants.SCORE_REPRODUCTION_COEFFICIENT
            : 1;
        for (let j = 0; j < offsprings; j++) {
            newGeneration.push(cloneNode(neat.population[i]));
        }
    }
    //newGeneration = newGeneration.splice(0, neat.elitism);
    newGeneration = newGeneration.splice(0, neat.population.length);

    while(newGeneration.length < neat.population.length) {
        const offspring = neat.getOffspring();
        newGeneration.push(offspring);
    }

    // resetting scores
    for (let i = 0; i < newGeneration.length; i++) {
        newGeneration[i].score = 0;
    }
    neat.population = newGeneration;
    neat.mutate();

    neat.generation++;
    return neat;
}

/**
 *
 * @param {number | null} popSize
 * @returns {Neat}
 */
export function createNeatapticObject(popSize = null) {
    const realPopSize = popSize ? popSize : constants.POPULATION_SIZE;
    return new neataptic.Neat(
        constants.SECTORS_OF_VISION * 2, // inputs: bonuses + obstacles (cars and walls)
        2, // output channels: accelerator/brakes, left/right
        null, // ranking function
        {
            mutation: [
                neataptic.methods.mutation.ADD_NODE,
                neataptic.methods.mutation.SUB_NODE,
                neataptic.methods.mutation.ADD_CONN,
                neataptic.methods.mutation.SUB_CONN,
                neataptic.methods.mutation.MOD_WEIGHT,
                neataptic.methods.mutation.MOD_BIAS,
                neataptic.methods.mutation.MOD_ACTIVATION,
                neataptic.methods.mutation.ADD_GATE,
                neataptic.methods.mutation.SUB_GATE,
                neataptic.methods.mutation.ADD_SELF_CONN,
                neataptic.methods.mutation.SUB_SELF_CONN,
                neataptic.methods.mutation.ADD_BACK_CONN,
                neataptic.methods.mutation.SUB_BACK_CONN
            ],
            popsize: realPopSize,
            elitism: constants.ELITISM,
            mutationRate: constants.MUTATION_RATE,
            mutationAmount: constants.MUTATION_AMOUNT,
            network: new neataptic.architect.LSTM(
                constants.SECTORS_OF_VISION * 2,
                10,
                10,
                10,
                2
            ),
        }
    );
}

/**
 *
 * @param {neataptic.Node} node
 * @returns {neataptic.Node}
 */
export function cloneNode(node) {
    return neataptic.Network.fromJSON(node.toJSON());
}
