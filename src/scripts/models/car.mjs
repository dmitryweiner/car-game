import MovingObject from './moving-object';
import * as constants from '../constants.mjs';

class Car extends MovingObject{

    constructor(x, y, gameField) {
        super(x, y, gameField);

        const element = document.getElementById(this.id);
        element.setAttribute('class', 'car');
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

    doTurn() {
        super.doTurn();
        this.speed -= constants.V_DECR;
        if (this.speed < 0) {
            this.speed = 0;
        }
    }
}

Car.SIZE = 30;

export default Car;