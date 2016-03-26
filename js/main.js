
$(document).ready(function () {
    Game.setGameField(
        $('#gameField').width() - $('#car').width(),
        $('#gameField').height() - $('#car').height()
    );

    Game.createObstacle();

    window.setInterval(Game.run, Game.quant);

    $(document).keydown(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode > 40 || keyCode < 37) {
            return;
        }
        Game.keyDown(keyCode);
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $(document).keyup(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode > 40 || keyCode < 37) {
            return;
        }
        Game.keyUp(keyCode);
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    $('.control').on('tapstart', function(event) {
        Game.mouseDown(this);
    });

    $('.control').on('tapend', function(event) {
        Game.mouseUp(this);
    });
});
