import SimpleObject from './object.mjs';
import * as constants from '../constants.mjs';
import { isConsole } from '../utils.mjs';
import { checkIntersection } from '../utils.mjs';

export default class MovingObject extends SimpleObject {

    constructor(x, y, gameField) {
        super(x, y, gameField);
        this.direction = 0;
        this.speed = 0;
        this.maxX = this.gameField.clientWidth;
        this.maxY = this.gameField.clientHeight;
        this.collision = false;
    }

    doTurn(objects) {
        const oldX = this.x;
        const oldY = this.y;


        this.vx = this.speed * Math.cos(this.direction) * constants.STEP;
        this.vy = this.speed * Math.sin(this.direction) * constants.STEP;

        this.x += this.vx;
        this.y += this.vy;

        //check borders
        if (this.x < 0) {
            //this.x = this.maxX - this.size;
            this.x = 0;
            this.y = oldY;
        }

        if (this.y < 0) {
            //this.y = this.maxY - this.size;
            this.y = 0;
            this.x = oldX;
        }

        if (this.x > (this.maxX - this.size)) {
            //this.x = 0;
            this.x = this.maxX - this.size;
            this.y = oldY;
        }

        if (this.y > (this.maxY - this.size)) {
            //this.y = 0;
            this.y = this.maxY - this.size;
            this.x = oldX;
        }

        if (this.isCollided(objects)) {
            this.x = oldX;
            this.y = oldY;
            this.speed = 0;
            this.collision = true;
        } else {
            this.collision = false;
        }

    }

    isCollided(objects) {
        return objects
            .some((object) => checkIntersection(this.x, this.y, this.width, this.height, object.x, object.y, object.width, object.height) && this.id !== object.id);

    }

    redraw() {
        super.redraw();

        if (isConsole()) return;
        this.element.style.transform = 'rotate(' + (this.direction + Math.PI / 2) + 'rad)';
    }
}