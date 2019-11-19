import fs from 'fs';
import * as constants from './constants.mjs';
import Game from './models/game.mjs';
import population from './population.mjs';
import neataptic from 'neataptic';
import { mutate } from './neataptic-utils.mjs';

let savedPopulation = null;
let lastCycleTime = new Date();

if (typeof process.argv[2] !== 'undefined' && process.argv[2] === 'continue') {
    console.log('Loading trained population.');
    savedPopulation = population.map((brain) => neataptic.Network.fromJSON(brain));
}

const trainingField = generateFakeDOMElement('trainingField', constants.TRAINING_CELL_SIZE, constants.TRAINING_CELL_SIZE);
let trainingGame = new Game(trainingField, true, savedPopulation);
let generation = 0;

setInterval(() => {
    // if not all died do run
    if (trainingGame.aiCars.length > 0) {
        if (trainingGame.bonuses.length < trainingGame.aiCars.length * constants.BONUS_RATE_COEFFICIENT) {
            trainingGame.addBonus();
        }
        trainingGame.tick();
    } else { // else mutate
        displayStatistics(
            trainingGame.neat.population.map((brain) => brain.score),
            generation,
            new Date() - lastCycleTime
        );
        savePopulation(trainingGame.neat.population);
        const mutatedPopulation = mutate(trainingGame.neat).population; // TODO: bad!
        trainingGame = new Game(trainingField, true, mutatedPopulation);
        lastCycleTime = new Date();
        generation++;
    }
}, 0);

function savePopulation(population) {
    population.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0)); // reverse sorting by score (best first)
    const json = 'export default ' + JSON.stringify(population) + ';';
    fs.writeFile('src/scripts/population.mjs', json, 'utf8', (err, data) => {
        if (err) {
            console.log('Error writing file: ', err);
        } else {
            console.log('Population saved');
        }
    });
}

function displayStatistics(scores, generation, time) {
    const sum = scores.reduce((sum, x) => sum + x);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const avg = sum / scores.length;

    console.log({
        generation,
        min: min.toFixed(2),
        avg: avg.toFixed(2),
        max: max.toFixed(2),
        time,
    });
}

function generateFakeDOMElement(id, clientWidth, clientHeight) {
    return {
        id,
        clientHeight,
        clientWidth,
        isFake: true,
    };
}
