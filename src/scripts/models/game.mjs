import * as constants from '../constants.mjs';
import { distance, isConsole } from '../utils.mjs';
import { createNeatapticObject } from '../neataptic-utils.mjs';
import { mutate } from '../neataptic-utils.mjs';
import population from '../population.mjs';

import Car from './car.mjs';
import AiCar from './ai-car.mjs';
import Bonus from './bonus.mjs';
import Obstacle from './obstacle.mjs';

export const BUTTON_LEFT = 37;
export const BUTTON_RIGHT = 39;
export const BUTTON_UP = 38;
export const BUTTON_DOWN = 40;

export default class Game {

    constructor(gameField, isTraining = false, initialPopulation) {
        this.gameField = gameField;
        this.maxX = gameField.clientWidth;
        this.maxY = gameField.clientHeight;
        this.bonuses = [];
        this.cars = [];
        this.obstacles = [];
        this.buttonsPressed = {
            accelerator: false,
            brakes: false,
            left: false,
            right: false,
        };
        this.onUserScoreChangeHandler = () => {};
        this.onAiScoreChangeHandler = () => {};


        this.neat = createNeatapticObject();
        if (isTraining) {
            if (initialPopulation) {
                this.neat.population = initialPopulation;
            }
        } else {
            const truncatedPopulation = population.splice(0, constants.NUMBER_OF_AI_CARS_IN_WEB);
            this.neat.population = truncatedPopulation.map((brain) => neataptic.Network.fromJSON(brain));
            this.cars.push(new Car(
                this.maxX / 2 - Car.SIZE / 2,
                this.maxY / 2 - Car.SIZE / 2,
                gameField
            ));
        }

        this.neat.population.map((brain) => {
            brain.score = 0;
            this.cars.push(
                new AiCar(this.gameField, brain)
            );
        });

        for (let i = 0; i < constants.OBSTACLES_COUNT; i++) {
            this.obstacles.push(new Obstacle(this.gameField, [...this.cars, ...this.obstacles]));
        }
    }

    addBonus() {
        const bonus = new Bonus(
            this.gameField,
            this.obstacles
        );

        this.bonuses.push(bonus);
    }
    
    handleKeyDown(code) {
        switch (code) {
            case BUTTON_LEFT: // left
                this.buttonsPressed.left = true;
                break;

            case BUTTON_UP: // up
                this.buttonsPressed.accelerator = true;
                break;

            case BUTTON_RIGHT: // right
                this.buttonsPressed.right = true;
                break;

            case BUTTON_DOWN: // down
                this.buttonsPressed.brakes = true;
                break;
        }
    }

    handleKeyUp(code) {
        switch (code) {
            case BUTTON_LEFT: // left
                this.buttonsPressed.left = false;
                break;

            case BUTTON_UP: // up
                this.buttonsPressed.accelerator = false;
                break;

            case BUTTON_RIGHT: // right
                this.buttonsPressed.right = false;
                break;

            case BUTTON_DOWN: // down
                this.buttonsPressed.brakes = false;
                break;
        }
    }

    handleBonuses() {
        const newBonuses = [];
        for (let i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].ttl -= constants.DELAY;

            const carFoundBonus = this.cars.find((car) => {
                return distance(this.bonuses[i].x, this.bonuses[i].y, car.x, car.y) < (Bonus.SIZE + Car.SIZE) / 2;
            });
            if (carFoundBonus) {
                carFoundBonus.playBonusCollisionSound();
                if (carFoundBonus instanceof AiCar) {
                    carFoundBonus.brain.score += constants.BONUS_REWARD;
                    this.onAiScoreChangeHandler(this.getMaxAiCarsScore());
                    carFoundBonus.ttl += constants.BONUS_TTL_REWARD;
                } else {
                    this.onUserScoreChangeHandler(carFoundBonus.score);
                }
                carFoundBonus.score++;
                this.bonuses[i].delete();
                continue;
            }

            if (this.bonuses[i].ttl > 0) {
                newBonuses.push(this.bonuses[i]);
            } else {
                this.bonuses[i].delete();
            }

        }
        this.bonuses = newBonuses;
        this.bonuses.map((bonus) => bonus.redraw());
    }

    handleCars() {
        this.cars = this.cars.filter((car) => {
            if (car instanceof AiCar) {
                car.seeWorld(this.bonuses, [...this.cars, ...this.obstacles]);
                if (car.ttl < 0) {
                    car.delete();
                    return false;
                }
            } else {
                car.handleControls(this.buttonsPressed);
            }
            car.doTurn([...this.cars, ...this.obstacles]);
            car.redraw();
            return true;
        });
    }

    onUserScoreChange(handler) {
        this.onUserScoreChangeHandler = handler;
    }

    onAiScoreChange(handler) {
        this.onAiScoreChangeHandler = handler;
    }

    tick() {
        this.handleBonuses();
        this.handleCars();
    }

    restart() {
        this.cars = this.cars.filter((car) => {
            if (car instanceof AiCar) {
                car.delete();
                return false;
            }
            return true;
        });

        this.neat = mutate(this.neat);
        this.neat.population.map((brain) => {
            brain.score = 0;
            this.cars.push(
                new AiCar(this.gameField, brain)
            );
        });
    }

    getMaxAiCarsScore() {
        const aiScores = this.cars
            .filter((car) => car instanceof AiCar)
            .map((car) => car.score);
        return Math.max(...aiScores);
    }
}