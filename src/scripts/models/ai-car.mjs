import Car from './car.mjs';
import { angleToPoint, distance, sigmoidize, normalize } from '../utils.mjs';
import * as constants from '../constants.mjs';
import { isConsole } from '../utils.mjs';

export default class AiCar extends Car {

    constructor(x, y, gameField, brain) {
        super(x, y, gameField);
        this.brain = brain;
        this.x = Math.random() * (this.maxX - AiCar.SIZE);
        this.y = Math.random() * (this.maxY - AiCar.SIZE);
        this.ttl = constants.MAX_TTL;
        this.directionShift = Math.random() * 2 * Math.PI;

        if (isConsole()) return;
        this.element.setAttribute('class', 'car ai-car');
    }

    seeBonuses(bonuses) {
        const nearestBonuses = getVisibleObjects(this.x, this.y, bonuses);
        //let activationResult = this.brain.activate([...normalize(nearestBonuses)]);
        let activationResult = this.brain.activate(nearestBonuses);
        //console.log(activationResult);
        activationResult = sigmoidize(activationResult);
        //console.log(activationResult);

        this.speed = activationResult[0] * constants.V_MAX;
        if (this.speed < 0) {
            this.speed = 0;
        }
        if (this.speed > constants.V_MAX) {
            this.speed = constants.V_MAX;
        }

        this.direction += (constants.ACTIVATION_THRESHOLD - activationResult[1]) / 10;
        if (this.direction < 0) {
            this.direction = 2 * Math.PI + this.direction;
        }
        if (this.direction > 2 * Math.PI) {
            this.direction = this.direction - 2 * Math.PI;
        }
    }

    doTurn() {
        super.doTurn();
        this.ttl -= constants.DELAY;
    }
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {[]} objects
 * @return {array} [0, 0, 20, 0 ... ]
 */
function getVisibleObjects(x, y, objects) {
    const result = [];
    const nearest = [];

    for (const item of objects) {
        if (distance(x, y, item.x, item.y) <= constants.MAX_SEEKING_DISTANCE) {
            nearest.push(item);
        }
    }

    for (let i = 0; i < constants.SECTORS_OF_VISION; i++) {
        let angleBegin, angleEnd;
        result[i] = 0;
        angleBegin = i * 2 * Math.PI / constants.SECTORS_OF_VISION;
        angleEnd = (i + 1) * 2 * Math.PI / constants.SECTORS_OF_VISION;
        for (const item of nearest) {
            const angle = angleToPoint(x, y, item.x, item.y);
            const distanceToObj = distance(x, y, item.x, item.y);
            if (angle >= angleBegin && angle < angleEnd) {
                if (result[i] < distanceToObj) {
                    result[i] = distanceToObj;
                }
            }
        }
    }

    return result;
}