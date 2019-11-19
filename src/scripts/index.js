import '../styles/index.scss';
import Game from './models/game.mjs';
import { gameTick } from './utils.mjs';
import * as constants from './constants.mjs';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game(document.getElementById('gameField'));

    gameTick(() => {
        game.tick();
    }, constants.FPS);

    setInterval(() => {
        game.createBonus();
    }, constants.BONUS_DELAY);

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
