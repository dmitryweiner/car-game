import Car from './car.mjs';
import { angleToPoint, distance, sigmoidize } from '../utils.mjs';
import * as constants from '../constants.mjs';

export default class AiCar extends Car {

    constructor(x, y, gameField, brain) {
        super(x, y, gameField);
        this.brain = brain;
        this.x = Math.random() * (this.maxX - AiCar.SIZE);
        this.y = Math.random() * (this.maxY - AiCar.SIZE);
        this.ttl = constants.MAX_TTL;
        this.directionShift = Math.random() * 2 * Math.PI;
    }

    seeBonuses(bonuses) {
        const nearestBonuses = getVisibleObjects(this.x, this.y, bonuses);
        const activationResult = sigmoidize(this.brain.activate([...sigmoidize(nearestBonuses)]));
        const controls = {
            accelerator: false,
            brakes: false,
            left: false,
            right: false,
        };
        if (activationResult[0] > constants.ACTIVATION_THRESHOLD) {
            controls.accelerator = true;
        } else if (activationResult[1] > constants.ACTIVATION_THRESHOLD) {
            controls.brakes = true;
        } else if (activationResult[2] > constants.ACTIVATION_THRESHOLD) {
            controls.left = true;
        } else if (activationResult[3] > constants.ACTIVATION_THRESHOLD) {
            controls.right = true;
        }
        this.handleControls(controls);
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
 * @param {number} seekingDistance
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