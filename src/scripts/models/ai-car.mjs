import Car from './car.mjs';
import { angleToPoint, distance, sigmoidize, normalize } from '../utils.mjs';
import * as constants from '../constants.mjs';
import { isConsole } from '../utils.mjs';
import { cloneNode } from '../neataptic-utils.mjs';

export default class AiCar extends Car {

    constructor(gameField, brain) {
        const x = Math.random() * (gameField.clientWidth - AiCar.SIZE);
        const y = Math.random() * (gameField.clientHeight - AiCar.SIZE);
        super(x, y, gameField);
        this.brain = brain;
        this.ttl = constants.MAX_TTL;
        this.direction = Math.random() * 2 * Math.PI;

        if (isConsole()) return;
        this.element.setAttribute('class', 'car ai-car');
        this.element.addEventListener('click', () => {
            console.log(this);
        });
        this.bonusSound = new Audio('public/sounds/ai-bonus-collision.mp3');
        this.bonusSound.volume = 0.2;
    }

    seeWorld(bonuses, objects) {
        const nearestBonuses = normalize(getVisibleObjects(this.direction, this.x, this.y, bonuses));

        objects = objects.filter((object) => object.id !== this.id);
        let nearestObjects = getVisibleObjects(this.direction, this.x, this.y, objects);
            //.map((l) => Math.exp(-l));
        nearestObjects = normalize(nearestObjects);
        let activationResult = this.brain.activate([...nearestBonuses, ...nearestObjects]);
        activationResult = sigmoidize(activationResult);

        /**
         * For some strange reason neural network could return NaN
         * probably due to glitch in neataptic.js
         */
        if (isNaN(activationResult[1])) {
            const score = this.brain.score;
            this.brain = cloneNode(this.brain);
            this.brain.score = score;
            return;
        }

        this.speed = activationResult[0] * constants.V_MAX;
        if (this.speed < 0) {
            this.speed = 0;
        }
        if (this.speed > constants.V_MAX) {
            this.speed = constants.V_MAX;
        }

        this.direction += (constants.ACTIVATION_THRESHOLD - activationResult[1]) / 3; // TODO: constants
        if (this.direction < 0) {
            this.direction = 2 * Math.PI + this.direction;
        }
        if (this.direction > 2 * Math.PI) {
            this.direction = this.direction - 2 * Math.PI;
        }
    }

    doTurn(objects) {
        if (this.isCollided(objects)) {
            this.brain.score -= constants.COLLISION_FINE;
            this.ttl -= constants.DELAY * constants.COLLISION_TTL_REDUCTION_COEFFICIENT;
        }
        super.doTurn(objects);
        this.ttl -= constants.DELAY;
    }
}

/**
 *
 * @param {number} direction angle of view
 * @param {number} x
 * @param {number} y
 * @param {[]} objects
 * @return {array} [0, 0, 20, 0 ... ]
 */
function getVisibleObjects(direction, x, y, objects) {
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
        angleBegin = direction + i * 2 * Math.PI / constants.SECTORS_OF_VISION;
        angleEnd = direction + (i + 1) * 2 * Math.PI / constants.SECTORS_OF_VISION;
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