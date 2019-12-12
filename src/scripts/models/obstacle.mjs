import SimpleObject from './object.mjs';
import * as constants from '../constants.mjs';
import { isConsole, checkIntersection } from '../utils.mjs';

export default class Obstacle extends SimpleObject {

    constructor(gameField, obstacles) {
        const maxX = gameField.clientWidth;
        const maxY = gameField.clientHeight;
        const width = constants.MIN_OBSTACLE_SIZE + Math.random() * (constants.MAX_OBSTACLE_SIZE - constants.MIN_OBSTACLE_SIZE);
        const height = constants.MIN_OBSTACLE_SIZE + Math.random() * (constants.MAX_OBSTACLE_SIZE - constants.MIN_OBSTACLE_SIZE);
        let x, y;
        let isIntersected;

        do {
            x = Math.random() * (maxX - width);
            y = Math.random() * (maxY - height);
            isIntersected = obstacles.some((obstacle) => checkIntersection(
                obstacle.x, obstacle.y, obstacle.width, obstacle.height,
                x, y, width, height));
        } while (isIntersected);
        super(x, y, gameField);

        this.width = width;
        this.height = height;

        if (isConsole()) return;

        this.element.setAttribute('class', 'obstacle');
        this.element.style.width = '' + this.width + 'px';
        this.element.style.height = '' + this.height + 'px';
    }
}