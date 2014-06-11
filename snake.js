function Snake(id) {
    var scope = this;
    this.canvas = document.getElementById(id);
    if (this.canvas == null || this.canvas.nodeName != "CANVAS") {
        console.log(id + " is not a canvas element");
        return undefined;
    }

    this.context = this.canvas.getContext("2d");
    this.limt = 20;
    this.body = new SnakeBody(3);
    this.CurrnetDirection = "right";
    this.NextDirection = "right";
    this.newBlock = this.getNewBlock();
    this.speed = 1.2;
    this.frameProgress = 0;

    document.addEventListener('keydown', function (e) {
        scope.keyDown(e);
    }, false);

    scope.theLoop = setInterval(function () {
        scope.gameLoop(scope);
    }, 30);

    /*this.backgroundMusic = new Audio("sounds/background.wav");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = .25;
    this.backgroundMusic.load();
    

    this.gameOver = new Audio("sounds/gameover.wav");
    this.gameOver.loop = false;
    this.gameOver.volume = .25;
    this.gameOver.load();


    var verifyMedia = setInterval(function () {
        if (scope.gameOver.readyState === 4 && scope.backgroundOver.readyState === 4 ) {
            clearInterval(verifyMedia);
            scope.theLoop = setInterval(function () {
                scope.gameLoop(scope);
            }, 30);
        }
    }, 500);*/
}

Snake.prototype.keyDown = function (e) {
    if (e.keyCode == 37 && this.CurrnetDirection != "right") {
        this.NextDirection = "left";
    } else if (e.keyCode == 38 && this.CurrnetDirection != "down") {
        this.NextDirection = "up";
    } else if (e.keyCode == 39 && this.CurrnetDirection != "left") {
        this.NextDirection = "right";
    } else if (e.keyCode == 40 && this.CurrnetDirection != "up") {
        this.NextDirection = "down";
    }
}

Snake.prototype.getNewBlock = function () {
    var test = true;
    while (test) {
        test = false;
        var x = Math.floor((Math.random() * 20) + 1);
        var y = Math.floor((Math.random() * 20) + 1);
        for (var i = 0; i < this.body.blocks.length; i++) {
            if (this.body.blocks[i].x == x && this.body.blocks[i].y == y) {
                test = true;
            }
        }
    }
    return {
        x: x,
        y: y
    };
}

Snake.prototype.gameLoop = function (scope) {
    this.frameProgress += this.speed;
    var movimentResul = 0;
    if (this.frameProgress > 11) {
        this.frameProgress = 0;
        this.CurrnetDirection = this.NextDirection;
        if (this.NextDirection == "left") {
            movimentResul = this.body.move(-1, 0, this.newBlock);
        } else if (this.NextDirection == "up") {
            movimentResul = this.body.move(0, -1, this.newBlock);
        } else if (this.NextDirection == "right") {
            movimentResul = this.body.move(1, 0, this.newBlock);
        } else if (this.NextDirection == "down") {
            movimentResul = this.body.move(0, 1, this.newBlock);
        }

        if (movimentResul == 3) {
            this.body = new SnakeBody(3);
            this.NextDirection = this.CurrnetDirection = "right";
            this.speed = 1.2;
            clearInterval(scope.theLoop);
            //this.gameOver.play();
            setTimeout(function () {
                scope.theLoop = setInterval(function () {
                    scope.gameLoop(scope);
                }, 30);
            }, 4000);

        }
        if (movimentResul == 2) {
            this.newBlock = this.getNewBlock();
            if (this.speed <= 8) {
                this.speed += 0.05;
            }
        }
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#5c5050";
    this.context.fillRect(this.body.blocks[0].x * 11 - 10, this.body.blocks[0].y * 11 - 10, 10, 10);
    this.context.fillStyle = "#000";

    for (var i = 1; i < this.body.blocks.length; i++) {
        this.context.fillRect(this.body.blocks[i].x * 11 - 10, this.body.blocks[i].y * 11 - 10, 10, 10);
    }

    this.context.fillRect(this.newBlock.x * 11 - 10, this.newBlock.y * 11 - 10, 10, 10);

}

function SnakeBody(size) {
    this.blocks = [];
    for (i = 0; i < size; i++) {
        this.blocks.push({
            x: 10 - i,
            y: 10
        });
    }
}
SnakeBody.prototype.move = function (x, y, newBlock) {
    var impossibility = false;
    var SnakeLenght = this.blocks.lenght;
    var newHead = {
        x: this.blocks[0].x + x,
        y: this.blocks[0].y + y
    };
    if (this.isSamePos(newHead, newBlock)) {
        this.blocks.unshift(newHead);
        return 2;
    } else if (newHead.x <= 20 && newHead.x > 0 && newHead.y > 0 && newHead.y <= 20) {
        for (var i = 3; i < this.blocks.length - 1; i++) {
            if (this.isSamePos(newHead, this.blocks[i])) {
                return 3;
            }
        }
        this.blocks.unshift(newHead);
        this.blocks.pop();
        return 1;
    } else {
        return 3;
    }
}
SnakeBody.prototype.isSamePos = function (obj1, obj2) {
    if (JSON.stringify(obj1) == JSON.stringify(obj2)) {
        return true;
    }
    return false;
}