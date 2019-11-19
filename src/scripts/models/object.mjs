import { generateId } from '../utils.mjs';

class SimpleObject {

    constructor(x, y, gameField) {
        this.id = generateId();
        this.gameField = gameField;
        this.x = x;
        this.y = y;
        this.size = SimpleObject.SIZE;
        this.needDelete = false;

        if (this.inConsole()) return;

        this.element = document.createElement('div');
        this.element.setAttribute('id', this.id);
        this.gameField.appendChild(this.element);
        this.redraw();
    }

    delete() {
        if (this.inConsole()) return;

        this.element.parentNode.removeChild(this.element);
    }

    redraw() {
        if (this.inConsole()) return;

        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    inConsole() {
        return typeof this.gameField['inConsole'] !== 'undefined';
    }
}

SimpleObject.SIZE = 10;

export default SimpleObject;

