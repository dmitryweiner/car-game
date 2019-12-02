import '../styles/index.scss';
import Game from './models/game.mjs';
import { gameTick } from './utils.mjs';
import * as constants from './constants.mjs';
import { mutate } from './neataptic-utils.mjs';
import population from './population.mjs';

document.addEventListener('DOMContentLoaded', () => {
    const field = document.getElementById('gameField');
    //let game = new Game(field, true, population.map((brain) => neataptic.Network.fromJSON(brain)));
    let game = new Game(field, false, population.splice(0, constants.NUMBER_OF_AI_CARS_IN_WEB).map((brain) => neataptic.Network.fromJSON(brain)));

    gameTick(() => {
        //
        // game.tick();
        //
        
        // TODO: delete this
        if (game.aiCars.length > 0) {
            if (game.bonuses.length < (game.aiCars.length + 1) * constants.BONUS_RATE_COEFFICIENT) {
                game.addBonus();
            }
            game.tick();
        } else { // else mutate
            const mutatedPopulation = mutate(game.neat).population; // TODO: bad!
            game = new Game(field, false, mutatedPopulation);
        }
    }, constants.FPS);

    /*setInterval(() => {
        game.addBonus();
    }, constants.BONUS_DELAY);*/

    document.addEventListener('keydown', (e) => {
        // TODO: rewrite https://learn.javascript.ru/keyboard-events
        const keyCode = e.keyCode || e.which;
        if (keyCode > 40 || keyCode < 37) {
            return;
        }
        game.handleKeyDown(keyCode);
        e.preventDefault(); // prevent the default action (scroll / move caret)
        return false;
    });

    document.addEventListener('keyup', (e) => {
        // TODO: rewrite https://learn.javascript.ru/keyboard-events
        const keyCode = e.keyCode || e.which;
        if (keyCode > 40 || keyCode < 37) {
            return;
        }
        game.handleKeyUp(keyCode);
        e.preventDefault(); // prevent the default action (scroll / move caret)
        return false;
    });
});
