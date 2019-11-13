var Game = (function () {
    var item_size = 30; //size of car and obstacle in pixels
    var score;
    var start_time;

    var collision = new Audio('sounds/collision.mp3');

    var max_x = null;
    var max_y = null;
    var x = null;
    var y = null;

    var v = 0.0;
    var v_decr = 0.05; // decrement of the velocity with time
    var v_acc = 0.2; // increment of the velocity with pressing accelerator
    var v_brake = 0.3; // decrement of brakes
    var v_max = 3.0;

    var angle = 0.0;
    var delta_angle = 5;

    var dt = 5; // step
    var quant = 50;

    //obstacles
    var obstacles = [];
    var max_obstacle_ttl = 12000;
    var min_obstacle_ttl = 12000;

    //keys
    var isArrowUpPressed = false;
    var isArrowDownPressed = false;
    var isArrowLeftPressed = false;
    var isArrowRightPressed = false;

    function keyUp(code) {
        switch (code) {
            case 37: // left
                isArrowLeftPressed = false;
                break;

            case 38: // up
                isArrowUpPressed = false;
                break;

            case 39: // right
                isArrowRightPressed = false;
                break;

            case 40: // down
                isArrowDownPressed = false;
                break;
        }
    }

    function keyDown(code) {
        switch (code) {
            case 37: // left
                isArrowLeftPressed = true;
                break;

            case 38: // up
                isArrowUpPressed = true;
                break;

            case 39: // right
                isArrowRightPressed = true;
                break;

            case 40: // down
                isArrowDownPressed = true;
                break;
        }
    }

    function mouseDown(element) {
        if ($(element).hasClass('left')) {
            isArrowLeftPressed = true;
        }

        if ($(element).hasClass('right')) {
            isArrowRightPressed = true;
        }

        if ($(element).hasClass('up')) {
            isArrowUpPressed = true;
        }

        if ($(element).hasClass('down')) {
            isArrowDownPressed = true;
        }

    }

    function mouseUp(element) {
        if ($(element).hasClass('left')) {
            isArrowLeftPressed = false;
        }

        if ($(element).hasClass('right')) {
            isArrowRightPressed = false;
        }

        if ($(element).hasClass('up')) {
            isArrowUpPressed = false;
        }

        if ($(element).hasClass('down')) {
            isArrowDownPressed = false;
        }

    }

    function handleKeys() {

        if (isArrowDownPressed) {
            v = v - v_brake;
            if (v < 0) {
                v = 0;
            }
        } else if (isArrowUpPressed) {
            v = v + v_acc;
            if (v > v_max) {
                v = v_max;
            }
        }

        if (isArrowLeftPressed) {
            angle = angle - delta_angle;
            if (angle < 0) {
                angle = 360 + angle;
            }
        } else if (isArrowRightPressed) {
            angle = angle + delta_angle;
            if (angle > 359) {
                angle = angle - 360;
            }
        }

    }

    function setGameField(maxX, maxY) {
        max_x = maxX;
        max_y = maxY;
        x = max_x / 2; //determine middle point
        y = max_y / 2;
        score = 0;
        start_time = new Date();
    }

    function toRadians(angle) {
        return angle * (Math.PI / 180);
    }


    function byteToHex(b) {
        var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];
        return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
    }

    function getRandomColor() {
        var phase = 0;
        var center = 128;
        var width = 127;
        var frequency = Math.PI*2;
        var i = Math.random();
        var red   = Math.sin(frequency*i+2+phase) * width + center;
        var green = Math.sin(frequency*i+0+phase) * width + center;
        var blue  = Math.sin(frequency*i+4+phase) * width + center;
        return '#' + byteToHex(red) + byteToHex(green) + byteToHex(blue);
    }

    function createObstacle() {
        var nextTime = Math.random() * 2000 + 3000;

        var obstacle = {
            ttl: Math.random() * (max_obstacle_ttl - min_obstacle_ttl) + min_obstacle_ttl, // time to live in ms
            x: (max_x - item_size) * Math.random(),
            y: (max_y - item_size) * Math.random(),
            color: getRandomColor()
        };

        obstacles.push(obstacle);

        window.setTimeout(createObstacle, nextTime);
    }

    function getObstacleId(obstacle) {
        return parseInt(obstacle.x) + '_' + parseInt(obstacle.y);
    }

    function redrawObstacles() {
        for (var i = 0; i < obstacles.length; i++) {
            var obstacleId = getObstacleId(obstacles[i]);
            var obstacleElement = $('#' + obstacleId);
            if (obstacleElement.length == 0) {//create if not exists
                obstacleElement = $('<div id="' + obstacleId + '" class="obstacle"><p></p></div>');
                obstacleElement.css({
                    left: obstacles[i].x,
                    top: obstacles[i].y,
                    'background-color': obstacles[i].color
                });
                $('#gameField').append(obstacleElement);
            }
            obstacleElement.css({opacity: obstacles[i].ttl / max_obstacle_ttl});

            //display here seconds to live
            obstacleElement.find('p').html(Math.round(obstacles[i].ttl / 1000));
        }
    }

    function handleObstacles() {
        var newObstacles = [];
        for (var i = 0; i < obstacles.length; i++) {
            var obstacleId = getObstacleId(obstacles[i]);
            obstacles[i].ttl -= quant;

            //handle collision
            if ((Math.abs(obstacles[i].x - x) < item_size) && (Math.abs(obstacles[i].y - y) < item_size)) {
                collision.play();
                score++;
                $('#' + obstacleId).remove();
                continue;
            }

            if (obstacles[i].ttl > 0) {
                newObstacles.push(obstacles[i]);
            } else {
                $('#' + obstacleId).remove();
            }

        }
        obstacles = newObstacles;
        redrawObstacles();
    }

    function redrawScreenMessages() {
        $('#score span').html(score);

        var currentTime = new Date();
        $('#time span').html(Math.floor((currentTime.getTime() - start_time.getTime()) / 1000));
    }

    function run() {
        handleKeys();
        handleObstacles();
        redrawScreenMessages();

        var x_old = x;
        var y_old = y;

        var vx = parseFloat(v * Math.sin(toRadians(180 - angle)));
        var vy = parseFloat(v * Math.cos(toRadians(180 - angle)));
        x = x + vx * dt;
        y = y + vy * dt;

        v = v - v_decr;
        if (v < 0) {
            v = 0;
        }

        //collision with border
        if (x > (max_x - 5) || x < 0) {
            x = x_old;
            v = 0;
        }
        if (y > (max_y - 5) || y < 0) {
            y = y_old;
            v = 0;
        }

        $('#car').css({ left: x, top: y, transform: 'rotate(' + angle + 'deg)' });
    }

    return {
        quant: quant,
        run: run,
        setGameField: setGameField,
        keyUp: keyUp,
        keyDown: keyDown,
        createObstacle: createObstacle,
        mouseDown: mouseDown,
        mouseUp: mouseUp
    }
})();