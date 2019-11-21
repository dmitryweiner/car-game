import SimpleObject from './object.mjs';
import * as constants from '../constants.mjs';
import {isConsole} from '../utils.mjs';

export default class MovingObject extends SimpleObject {

    constructor(x, y, gameField) {
        super(x, y, gameField);
        this.direction = 0;
        this.speed = 0;
        this.maxX = this.gameField.clientWidth;
        this.maxY = this.gameField.clientHeight;
        this.directionShift = 0;
    }

    doTurn() {

        this.vx = this.speed * Math.cos(this.direction + this.directionShift) * constants.STEP;
        this.vy = this.speed * Math.sin(this.direction + this.directionShift) * constants.STEP;

        this.x += this.vx;
        this.y += this.vy;

        //check borders
        if (this.x < 0) {
            this.x = this.maxX - this.size;
            //this.x = 0;
        }

        if (this.y < 0) {
            this.y = this.maxY - this.size;
            //this.y = 0;
        }

        if (this.x > (this.maxX - this.size)) {
            this.x = 0;
            //this.x = this.maxX - this.size;
        }

        if (this.y > (this.maxY - this.size)) {
            this.y = 0;
            //this.y = this.maxY - this.size;
        }
    }

    redraw() {
        super.redraw();

        if (isConsole()) return;
        this.element.style.transform = 'rotate(' + (this.direction + this.directionShift + Math.PI / 2) + 'rad)';
    }
}