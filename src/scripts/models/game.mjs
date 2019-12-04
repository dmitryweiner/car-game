import Car from './car.mjs';
import AiCar from './ai-car.mjs';
import Bonus from './bonus.mjs';
import * as constants from '../constants.mjs';
import { distance, isConsole } from '../utils.mjs';
import { createNeatapticObject } from '../neataptic-utils.mjs';
import population from '../population.mjs';
import { mutate } from '../neataptic-utils.mjs';

export const BUTTON_LEFT = 37;
export const BUTTON_RIGHT = 39;
export const BUTTON_UP = 38;
export const BUTTON_DOWN = 40;

export default class Game {

    constructor(gameField, isTraining = false, initialPopulation) {
        this.gameField = gameField;
        this.maxX = gameField.clientWidth;
        this.maxY = gameField.clientHeight;
        this.userScore = 0;
        this.aiScore = 0;
        this.bonuses = [];
        this.userCar = null;
        this.aiCars = [];
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
            this.userCar = new Car(
                this.maxX / 2 - Car.SIZE / 2,
                this.maxY / 2 - Car.SIZE / 2,
                gameField
            );
        }

        this.neat.population.map((brain) => {
            brain.score = 0;
            this.aiCars.push(
                new AiCar(null, null, this.gameField, brain)
            );
        });
    }

    addBonus() {
        const bonus = new Bonus(
            (this.maxX - Bonus.SIZE) * Math.random(),
            (this.maxY - Bonus.SIZE) * Math.random(),
            this.gameField
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

            //handle collision
            if (this.userCar && distance(this.bonuses[i].x, this.bonuses[i].y, this.userCar.x, this.userCar.y) < (Bonus.SIZE + Car.SIZE) / 2) {
                this.userCar.playBonusCollisionSound();
                this.userScore++;
                this.onUserScoreChangeHandler(this.userScore);
                this.bonuses[i].delete();
                continue;
            }

            const aiCarFoundBonus = this.aiCars.find((aiCar) => {
                return distance(this.bonuses[i].x, this.bonuses[i].y, aiCar.x, aiCar.y) < (Bonus.SIZE + Car.SIZE) / 2;
            });
            if (aiCarFoundBonus) {
                aiCarFoundBonus.playBonusCollisionSound();
                aiCarFoundBonus.brain.score += constants.BONUS_REWARD;
                this.onAiScoreChangeHandler(this.aiCars.map((car) => car.brain.score));
                aiCarFoundBonus.ttl += constants.BONUS_TTL_REWARD;
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

    handleUserCar() {
        if (!this.userCar) return;

        this.userCar.handleControls(this.buttonsPressed);
        this.userCar.doTurn();
        this.userCar.redraw();
    }

    handleAiCars() {
        this.aiCars = this.aiCars.filter((aiCar) => {
            aiCar.seeBonuses(this.bonuses);
            aiCar.doTurn();
            aiCar.redraw();
            if (aiCar.ttl < 0) {
                aiCar.delete();
                return false;
            }
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
        this.handleUserCar();
        this.handleAiCars();
    }

    restart() {
        this.aiCars.map((aiCar) => aiCar.delete());
        this.aiCars = [];

        this.neat = mutate(this.neat);
        this.neat.population.map((brain) => {
            brain.score = 0;
            this.aiCars.push(
                new AiCar(null, null, this.gameField, brain)
            );
        });
    }
}