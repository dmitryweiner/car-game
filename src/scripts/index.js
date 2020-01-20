import '../styles/index.scss';
import Game from './models/game.mjs';
import { gameTick } from './utils.mjs';
import * as constants from './constants.mjs';
import population from './population-truncated.mjs';
import { BUTTON_RIGHT, BUTTON_LEFT, BUTTON_UP, BUTTON_DOWN } from './models/game.mjs';

document.addEventListener('DOMContentLoaded', () => {

    const field = document.getElementById('gameField');
    const truncatedPopulation = population.splice(0, constants.NUMBER_OF_AI_CARS_IN_WEB).map((brain) => neataptic.Network.fromJSON(brain));
    let game = new Game(field, false, truncatedPopulation);
    const bonusRateCoefficient = document.body.clientWidth < constants.TRAINING_CELL_SIZE
        ? constants.BONUS_RATE_COEFFICIENT
        : Math.ceil(constants.BONUS_RATE_COEFFICIENT* (document.body.clientWidth / constants.TRAINING_CELL_SIZE));

    game.onUserScoreChange((userScore) => {
        document.getElementById('userScore').innerText = '' + userScore;
    });

    game.onAiScoreChange((aiScore) => {
        document.getElementById('aiScore').innerText = '' + aiScore;
    });

    gameTick(() => {
        if (game.cars.length > 1) {
            if (game.bonuses.length < (game.cars.length + 1) * bonusRateCoefficient) {
                game.addBonus();
            }
            game.tick();
        } else {
            game.restart();
        }
    }, constants.FPS);

    /**
     * Disable zoom
     */
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });

    /**
     * Reload on screen resize
     */
    window.addEventListener('orientationchange', function (e) {
        document.location.reload();
    });


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

    addListeners(document.getElementById('right'), BUTTON_RIGHT);
    addListeners(document.getElementById('left'), BUTTON_LEFT);
    addListeners(document.getElementById('up'), BUTTON_UP);
    addListeners(document.getElementById('down'), BUTTON_DOWN);

    function addListeners(element, button) {
        element.addEventListener('touchstart', (e) => {
            game.handleKeyDown(button);
        });

        element.addEventListener('touchend', (e) => {
            game.handleKeyUp(button);
        });

        element.addEventListener('touchcancel', (e) => {
            game.handleKeyUp(button);
        });
    }

});
