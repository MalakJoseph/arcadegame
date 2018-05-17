/*=================================*/
// Classes
/*=================================*/
class Core {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    // Draw player and enemies on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies our player must avoid
class Enemy extends Core {
    constructor(x, y, speed) {
        super(x, y, speed);
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;

        // Reset bugs position after getting off the canvas
        if (this.x > 550) {
            this.x = -100;
            this.speed = 100 + Math.floor(Math.random() * 500);
        }

        // Collisions Detection. Credit to https://codepen.io/mixal_bl4/pen/qZYWOm
        if (player.x < this.x + 50 &&
            player.x + 50 > this.x &&
            player.y < this.y + 50 &&
            player.y + 50 > this.y) {
            player.x = 200;
            player.y = 380;
            // player.brokenHearts();
            life.update();
            reset();
        }
    }
}

// Our player class
class Player extends Core {
    constructor(x, y, speed, xSpeed, ySpeed) {
        super(x, y, speed);
        this.xSpeed = 50;
        this.ySpeed = 30;
        this.sprite = 'images/char-boy.png';
    }

    // Update the player's position
    update() {
        // Prevent player from crossing the canvas boundaries
        if (this.x > 400) {
            this.x = 400;
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y > 380) {
            this.y = 380;
        }

        // Hitting the top, Resetting the player
        if (this.y < 0) {
            this.x = 200;
            this.y = 380;
            this.incrementScore();
        }
    }

    // Setting keyboards' movements
    handleInput(keyPress) {
        switch (keyPress) {
            case 'left':
            this.x -= this.speed + this.xSpeed;
            break;
            case 'up':
            this.y -= this.speed + this.ySpeed;
            break;
            case 'right':
            this.x += this.speed + this.xSpeed;
            break;
            case 'down':
            this.y += this.speed + this.ySpeed;
        }
    }

    // A method to keep incrementing score
    incrementScore() {
        const score = document.querySelector(".points");
        score.innerHTML = (points = points + 1000);
        if (score.innerHTML == 5000) {
            // To stop enemies from moving after winning
            allEnemies.forEach(function(enemy) {
                enemy.speed = false;
            });
            // To stop player from moving after winning
            this.speed = 0 + (this.xSpeed = false, this.ySpeed = false);
            gameover.classList.add("show");
            reset();
        }
    }
}

// Hearts showed on canvas
class Heart extends Core {
    constructor(x, y) {
        super(x, y);
        this.sprite = 'images/Heart.png';
    }

    // Removing hearts based on collisions
    update() {
        lives -= 1;
        if (lives === 2) {
            allHearts[0].x = 600;
        } else if (lives === 1) {
            allHearts[1].x = 600;
        } else if (lives === 0) {
            allHearts[2].x = 600;
            // To stop enemies from moving after losing
            allEnemies.forEach(function(enemy) {
                enemy.speed = false;
            });
            // To stop player from moving after losing
            player.speed = 0 + (player.xSpeed = 0, player.ySpeed = 0);
            gameover.classList.add("show");
            gameover.innerHTML = "<h2>Looooser!!</h2><button>Try Again?</button>"
        }
    }

    // Draw hearts on the screen with different width & height than original
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 30, 50);
    };
}

/*=================================*/
// Variables Declaration
/*=================================*/
let points = 0;
const player = new Player(200, 380, 50);
const enemyPosition = [60, 140, 220, 140, 60]; //Multible bugs through the 3 lines
let enemy;
let allEnemies = [];
const heartPosition = [410, 440, 470]; //3 hearts next to each other
let life;
let allHearts = [];
let lives = 3;
const gameover = document.querySelector(".gameover");

heartPosition.forEach(function(posX) {
    life = new Heart(posX, 540);
    allHearts.push(life);
});

enemyPosition.forEach(function(posY) {
    enemy = new Enemy(0, posY, 100 + Math.floor(Math.random() * 500));
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*=================================*/
// Functions
/*=================================*/
// Changing characters
(function characters() {
    const img = document.querySelectorAll("img");
    img.forEach((char) => {
        char.addEventListener('click', (e) => {
            /**
            * @description looping through element's attributes to change it
            * @credit to: https://stackoverflow.com/questions/12274748/setting-multiple-attributes-for-an-element-at-once-with-javascript
            * @param el - element to be changed
            * @param attrs - attributes of element
            */
            function setAttributes(el, attrs) {
                Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
            }

            if (e.target.matches('.cat') && player.sprite === 'images/char-boy.png') {
                setAttributes(e.target, { src: 'images/char-boy.png', class: 'boy' });
                player.sprite = 'images/char-cat-girl.png';
            } else if (e.target.matches('.princess') && player.sprite === 'images/char-boy.png') {
                setAttributes(e.target, { src: 'images/char-boy.png', class: 'boy' });
                player.sprite = 'images/char-princess-girl.png';
            } else if (e.target.matches('.princess') && player.sprite === 'images/char-cat-girl.png') {
                setAttributes(e.target, { src: 'images/char-cat-girl.png', class: 'cat' });
                player.sprite = 'images/char-princess-girl.png';
            } else if (e.target.matches('.boy') && player.sprite === 'images/char-cat-girl.png') {
                setAttributes(e.target, { src: 'images/char-cat-girl.png', class: 'cat' });
                player.sprite = 'images/char-boy.png';
            } else if (e.target.matches('.boy') && player.sprite === 'images/char-princess-girl.png') {
                setAttributes(e.target, { src: 'images/char-princess-girl.png', class: 'princess' });
                player.sprite = 'images/char-boy.png';
            } else if (e.target.matches('.cat') && player.sprite === 'images/char-princess-girl.png') {
                setAttributes(e.target, { src: 'images/char-princess-girl.png', class: 'princess' });
                player.sprite = 'images/char-cat-girl.png';
            }
        });
    });
}());

// Reloading page after clicking the button
function reset() {
    document.querySelector("button").addEventListener('click', () => window.location.reload());
};

// TODO:
// Button's characteristics