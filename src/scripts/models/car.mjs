import MovingObject from './moving-object.mjs';
import * as constants from '../constants.mjs';
import { isConsole } from '../utils.mjs';

class Car extends MovingObject{

    constructor(x, y, gameField) {
        super(x, y, gameField);
        this.size = Car.SIZE;
        this.width = this.size;
        this.height = this.size;
        this.score = 0;

        if (isConsole()) return;
        this.element.setAttribute('class', 'car');
        this.bonusSound = new Audio('public/sounds/collision.mp3');
    }

    handleControls({accelerator, brakes, right, left}) {
        if (brakes) {
            this.speed -= constants.V_BRAKE_DECR;
            if (this.speed < 0) {
                this.speed = 0;
            }
        } else if (accelerator) {
            this.speed += constants.V_ACC;
            if (this.speed > constants.V_MAX) {
                this.speed = constants.V_MAX;
            }
        }

        if (left) {
            this.direction -= constants.DELTA_ANGLE;
            if (this.direction < 0) {
                this.direction = 2 * Math.PI + this.direction;
            }
        } else if (right) {
            this.direction += constants.DELTA_ANGLE;
            if (this.direction > 2 * Math.PI) {
                this.direction = this.direction - 2 * Math.PI;
            }
        }
    }

    doTurn(objects) {
        super.doTurn(objects);
        this.speed -= constants.V_DECR;
        if (this.speed < 0) {
            this.speed = 0;
        }

    }

    playBonusCollisionSound() {
        if (isConsole()) return;
        this.bonusSound.play();
    }
}

Car.SIZE = 30;

export default Car;