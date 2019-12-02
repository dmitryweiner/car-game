import '../styles/index.scss';
import Game from './models/game.mjs';
import { gameTick } from './utils.mjs';
import * as constants from './constants.mjs';
import { mutate } from './neataptic-utils.mjs';
import population from './population.mjs';
import {isConsole} from "./utils";

document.addEventListener('DOMContentLoaded', () => {
    const field = document.getElementById('gameField');
    //let game = new Game(field, true, population.map((brain) => neataptic.Network.fromJSON(brain)));
    let game = new Game(field, false, population.splice(0, constants.NUMBER_OF_AI_CARS_IN_WEB).map((brain) => neataptic.Network.fromJSON(brain)));

    game.onUserScoreChange((newScore) => {
        document.getElementById('userScore').innerText = newScore;
    });

    game.onAiScoreChange((aiScores) => {
        document.getElementById('aiScore').innerText = '' + Math.max(...aiScores) / constants.BONUS_REWARD;
    });

    gameTick(() => {
        //
        // game.tick();
        //
        
        if (game.bonuses.length < (game.aiCars.length + 1) * constants.BONUS_RATE_COEFFICIENT) {
            game.addBonus();
        }
        game.tick();
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

    // TODO: move this to main
    function redrawScreenMessages(userScore, aiScore) {
        document.getElementById('userScore').innerText = userScore;
        document.getElementById('aiScore').innerText = aiScore;
    }
});
