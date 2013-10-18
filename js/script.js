var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    if (!isGameOver) {
        render();
        update(dt);
    }

    lastTime = now;
    requestAnimFrame(main);
}

function init() {
    terrainPattern = ctx.createPattern(resources.get('pic/bgr.png'), 'repeat');
    lastTime = Date.now();
    main();
}

function update(dt) {

    handleInput();

    step += dt;
    if (step > speed) {
        step -= speed;

        //Game logic here
        move_snake();
    }
}

function move_snake() {
    //Добавляем кубик перед змеей (двигаем ее вперед)
    snake.unshift([snake[0][0]+direction[0],snake[0][1]+direction[1]]);

    if (snake[0][0] >= area_size[0]) {
        snake[0][0] -= area_size[0];
    }

    if (snake[0][1] >= area_size[1]) {
        snake[0][1] -= area_size[1];
    }

    if (snake[0][0] < 0) {
        snake[0][0] += area_size[0];
    }

    if (snake[0][1] < 0) {
        snake[0][1] += area_size[1];
    }

    //Проверка на то, является ли текущая ячейка "яблочком"
    if (array_compare(snake[0], apple)) {
        //Делаем змейку больше
        //Тоесть не убираем ее зад
        //Но убираем яблоко в другое место (но не на змейку!)
        apple = get_random_dot();
        console.log(apple);
    }
    else {
        snake.pop();
    }

    //Проверяем на столкновение с собой (или стенами)
    if (coll_on_snake(snake[0][0], snake[0][1])) {
        GameOver();
    }

}

function render()
{
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Рисуем яблоко
    print_apple();
    //Рисуем змею
    print_snake();

    ctx.restore();
}

function print_snake()
{
    for (var i in snake) {
        print_block(snake[i][0], snake[i][1], 'pic/block.png');
    }
}

function print_apple()
{
    print_block(apple[0], apple[1], 'pic/apple.png');
}

function coll_on_snake(x,y) {
    for (var i = 1; i < snake.length; i++) {
        if (snake[i][0] == x && snake[i][1] == y) {
            return true;
        }
    }
    return false;
}

function print_block(x,y, url) {
    var dx = x*8;
    var dy = y*8;

    ctx.save();
    ctx.translate(dx, dy);

    ctx.drawImage(resources.get(url),
        0, 0,
        8, 8);

    ctx.restore();
}

function handleInput() {
    if(input.isDown('DOWN') || input.isDown('s')) {
        if (direction[1] != -1) { direction = [0,1]; }
    }

    if(input.isDown('UP') || input.isDown('w')) {
        if (direction[1] != 1) { direction = [0,-1]; }
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        if (direction[0] != 1) { direction = [-1,0]; }
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        if (direction[0] != -1) { direction = [1,0]; }
    }
}

function array_compare(arr1, arr2) {
    return arr1[0] == arr2[0] && arr1[1] == arr2[1];
}

function GameOver() {
    isGameOver = true;

    ctx.fillStyle = "white";
    ctx.save();

    ctx.font = "normal normal 32px Helvetica";
    ctx.textAlign = "start";
    ctx.fillText("Game over", 50, 82, 100);

    ctx.restore();
}

function getRandomArbitary(min, max)
{
    var num = Math.random() * (max - min) + min;
    return num.toFixed();
}

function get_random_dot() {
    var x, y;
    do {
        x = getRandomArbitary(0,area_size[0]-1);
        y = getRandomArbitary(0, area_size[1]-1);
    } while(coll_on_snake(x,y));
    return [x,y];
}

// Create the canvas
var area_size = [20,20];

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 8*area_size[0];
canvas.height = 8*area_size[1];
document.getElementById('display').appendChild(canvas);

var step = 0;
var snake = [[5,3],[5,4],[5,5],[5,6],[5,7],[5,8]];
var apple = get_random_dot();
var direction = [0,-1];

var terrainPattern;

var lastTime;
var isGameOver = false;
var speed = 0.5;

document.getElementById('up').addEventListener('click', function() {
    if (direction[1] != 1) { direction = [0,-1]; }
});

document.getElementById('down').addEventListener('click', function() {
    if (direction[1] != -1) { direction = [0,1]; }
});
document.getElementById('left').addEventListener('click', function() {
    if (direction[0] != 1) { direction = [-1,0]; }
});

document.getElementById('right').addEventListener('click', function() {
    if (direction[0] != -1) { direction = [1,0]; }
});

resources.load([
    'pic/block.png',
    'pic/apple.png',
    'pic/bgr.png'
]);

resources.onReady(init);