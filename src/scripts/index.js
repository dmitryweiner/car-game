import '../styles/index.scss';
import Game from './models/game.mjs';
import { gameTick } from './utils.mjs';
import * as constants from './constants.mjs';
import population from './population.mjs';
import { BUTTON_RIGHT, BUTTON_LEFT, BUTTON_UP, BUTTON_DOWN } from './models/game.mjs';

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
        if (game.aiCars.length > 0) {
            if (game.bonuses.length < (game.aiCars.length + 1) * constants.BONUS_RATE_COEFFICIENT) {
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
