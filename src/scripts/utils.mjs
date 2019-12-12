export function generateId()
{
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Returns random emoji char like rat or mouse
 * @returns {string}
 */
export function getEmojiForCreature() {
    const emoji = [
        '\u{1F400}',
        '\u{1F407}',
        '\u{1F43F}',
        '\u{1F413}',
        '\u{1F427}',
        '\u{1F986}',
        '\u{1F989}',
        '\u{1F986}',
        '\u{1F41E}',
        '\u{1F577}',
        '\u{1F980}',
        '\u{1F980}',
        '\u{1F990}',
        '\u{1F991}',
        '\u{1F41C}',
    ];

    return emoji[Math.round(Math.random() * (emoji.length - 1))];
}

/**
 * Returns food emoji
 * @returns {string}
 */
export function getEmojiForFood() {
    const emoji = [
        '\u{1F966}',
        '\u{1F344}',
        '\u{1F955}',
        '\u{1F353}',
        '\u{1F352}',
        '\u{1F350}',
        '\u{1F34F}',
        '\u{1F34E}',
        '\u{1F34D}',
        '\u{1F34C}',
        '\u{1F349}',
        '\u{1F347}',
    ];

    return emoji[Math.round(Math.random() * (emoji.length - 1))];
}

/**
 * Normalize vector
 *
 * {array} v
 * @returns {array}
 */
export function normalize(v) {
    if (!Array.isArray(v) || v.length === 0) {
        throw new Error('Wrong parameter');
    }
    let result = v;
    const max = Math.max(...result);
    if (max !== 0) {
        result = result.map((e) => e / max);
    }
    return result;
}

/**
 *
 * {array} v
 * @returns {array}
 */
export function sigmoidize(v) {
    if (!Array.isArray(v) || v.length === 0) {
        throw new Error('Wrong parameter');
    }
    return v.map((element) => 1 / (1 + Math.pow(Math.E, - element)));
}

/** Get the angle from one point to another */
export function angleToPoint(x1, y1, x2, y2) {
    const d = distance(x1, y1, x2, y2);
    const dx = (x2 - x1) / d;
    const dy = (y2 - y1) / d;

    let a = Math.acos(dx);
    a = dy < 0 ? 2 * Math.PI - a : a;
    return a;
}

/** Calculate distance between two points */
export function distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}

export function checkIntersection(x1, y1, width1, height1, x2, y2, width2, height2) {
    return !(x1 + width1 < x2 || y1 + height1 < y2 || x1 > x2 + width2 || y1 > y2 + height2);
}

/**
 *
 * @param {function} callback
 * @param {number} fps
 */
export function gameTick(callback, fps) {
    const timeBegin = new Date();
    callback();
    const actualDelay = new Date() - timeBegin;
    const plannedDelay = 1000 / fps;

    if (actualDelay < plannedDelay) {
        setTimeout(() => requestAnimationFrame(() => gameTick(callback, fps)), plannedDelay - actualDelay);
    } else {
        requestAnimationFrame(() => gameTick(callback, fps));
    }
}

/**
 * Converts byte to string representation
 *
 * @param {number} b
 * @returns {string}
 */
export function byteToHex(b) {
    const hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];
    return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
}

export function getRandomColor() {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI*2;
    const i = Math.random();
    const red   = Math.sin(frequency*i+2+phase) * width + center;
    const green = Math.sin(frequency*i+0+phase) * width + center;
    const blue  = Math.sin(frequency*i+4+phase) * width + center;
    return '#' + byteToHex(red) + byteToHex(green) + byteToHex(blue);
}

export function isConsole() {
    return typeof document === 'undefined';
}
