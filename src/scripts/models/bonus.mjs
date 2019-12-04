import SimpleObject from './object.mjs';
import * as constants from '../constants.mjs';
import { getRandomColor, isConsole } from '../utils.mjs';

class Bonus extends SimpleObject {
    constructor(x, y, gameField) {
        super(x, y, gameField);
        this.size = Bonus.SIZE;
        this.color = getRandomColor();
        this.ttl = Math.random() * (constants.MAX_BONUS_TTL - constants.MIM_BONUS_TTL) + constants.MIM_BONUS_TTL; // time to live in ms

        if (isConsole()) return;

        this.element.setAttribute('class', 'bonus');
        this.element.style.backgroundColor = this.color;
        this.element.innerText = this.getTtlText();
    }

    redraw() {
        super.redraw();

        if (isConsole()) return;

        this.element.style.opacity = '' + this.ttl / constants.MAX_BONUS_TTL;

        // display seconds
        this.element.innerText = this.getTtlText();

    }

    getTtlText() {
        return  '' + Math.round(this.ttl / 1000);
    }
}

Bonus.SIZE = 30;

export default Bonus;