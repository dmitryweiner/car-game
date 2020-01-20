import fs from 'fs';
import population from './population.mjs';
import * as constants from './constants.mjs';

const truncatedPopulation = population.splice(0, constants.NUMBER_OF_AI_CARS_IN_WEB);
const json = 'export default ' + JSON.stringify(truncatedPopulation) + ';';
fs.writeFile('src/scripts/population-truncated.mjs', json, 'utf8', (err, data) => {
    if (err) {
        console.log('Error writing file: ', err);
    } else {
        console.log('Population truncated to ', constants.NUMBER_OF_AI_CARS_IN_WEB);
    }
});
