import SimpleObject from './object.mjs';
import * as constants from '../constants.mjs';
import {isConsole} from "../utils";

export default class MovingObject extends SimpleObject {

    constructor(x, y, gameField) {
        super(x, y, gameField);
        this.direction = 0;
        this.speed = 0;
        this.maxX = this.gameField.clientWidth;
        this.maxY = this.gameField.clientHeight;
    }

    doTurn() {

        this.vx = this.speed * Math.cos(this.direction) * constants.STEP;
        this.vy = this.speed * Math.sin(this.direction) * constants.STEP;

        this.x += this.vx;
        this.y += this.vy;

        //check borders
        if (this.x < 0) {
            this.x = this.maxX - this.size;
        }

        if (this.y < 0) {
            this.y = this.maxY - this.size;
        }

        if (this.x > (this.maxX - this.size)) {
            this.x = 0;
        }

        if (this.y > (this.maxY - this.size)) {
            this.y = 0;
        }
    }

    redraw() {
        super.redraw();

        if (isConsole()) return;
        this.element.style.transform = 'rotate(' + (this.direction + Math.PI / 2) + 'rad)';
    }
}