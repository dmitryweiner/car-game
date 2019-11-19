import Car from './car.mjs';
import Bonus from './bonus.mjs';
import * as constants from '../constants.mjs';
import { distance} from '../utils.mjs';

export default class Game {

    constructor(gameField, popSize = 0) {
        this.gameField = gameField;
        this.maxX = gameField.clientWidth;
        this.maxY = gameField.clientHeight;
        this.userScore = 0;
        this.aiScore = 0;
        this.collision = new Audio('public/sounds/collision.mp3');
        this.bonuses = [];
        this.userCar = new Car(
            this.maxX / 2 - Car.SIZE / 2,
            this.maxY / 2 - Car.SIZE / 2,
            gameField
        );
        this.aiCars = [];
        this.buttonsPressed = {
            accelerator: false,
            brakes: false,
            left: false,
            right: false,
        };

    }

    createBonus() {
        const bonus = new Bonus(
            (this.maxX - Bonus.SIZE) * Math.random(),
            (this.maxY - Bonus.SIZE) * Math.random(),
            this.gameField
        );

        this.bonuses.push(bonus);
    }
    
    handleKeyDown(code) {
        switch (code) {
            case 37: // left
                this.buttonsPressed.left = true;
                break;

            case 38: // up
                this.buttonsPressed.accelerator = true;
                break;

            case 39: // right
                this.buttonsPressed.right = true;
                break;

            case 40: // down
                this.buttonsPressed.brakes = true;
                break;
        }
    }

    handleKeyUp(code) {
        switch (code) {
            case 37: // left
                this.buttonsPressed.left = false;
                break;

            case 38: // up
                this.buttonsPressed.accelerator = false;
                break;

            case 39: // right
                this.buttonsPressed.right = false;
                break;

            case 40: // down
                this.buttonsPressed.brakes = false;
                break;
        }
    }

    handleBonuses() {
        const newBonuses = [];
        for (let i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].ttl -= constants.DELAY;

            //handle collision
            // TODO: handle collision with AI cars
            if (distance(this.bonuses[i].x, this.bonuses[i].y, this.userCar.x, this.userCar.y) < (Bonus.SIZE + Car.SIZE) / 2) {
                this.collision.play(); // TODO check if in console
                this.userScore++;
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
        this.userCar.handleControls(this.buttonsPressed);
        this.userCar.doTurn();
        this.userCar.redraw();
    }

    redrawScreenMessages() {
        // TODO: check if console
        document.getElementById('userScore').innerText = this.userScore;
        document.getElementById('aiScore').innerText = this.aiScore;
    }

    tick() {
        this.handleBonuses();
        this.handleUserCar();
        // TODO: handle AI cars
        this.redrawScreenMessages();
    }
}