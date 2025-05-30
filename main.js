const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanlives = document.querySelector('#lives');
const spantime = document.querySelector('#time');
const spanrecord = document.querySelector('#record');
const presult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let nivel = 0;
let lives = 4;
let timeStart;
let timeInterval;

const playerPosition = {
    row: undefined,
    col: undefined
};
const giftPosition = {
    row: undefined,
    col: undefined
};
let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = Math.floor(window.innerWidth * 0.8);
    } else {
        canvasSize = Math.floor(window.innerHeight * 0.8);
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = Math.floor(canvasSize / 10);

    startGame();
}

function startGame() {
    showLives();

    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[nivel];
    const mapRows = map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''));

    enemiesPositions = [];

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowsCol.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col === 'O') {
                if (playerPosition.row === undefined && playerPosition.col === undefined) {
                    playerPosition.row = rowI;
                    playerPosition.col = colI;
                }
            } else if (col === 'I') {
                giftPosition.row = rowI;
                giftPosition.col = colI;
            } else if (col === 'X') {
                enemiesPositions.push({
                    row: rowI,
                    col: colI
                });
            }

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function movePlayer() {
    const posX = elementsSize * (playerPosition.col + 1);
    const posY = elementsSize * (playerPosition.row + 1);

    game.fillText(emojis['PLAYER'], posX, posY);

    if (
        playerPosition.row === giftPosition.row &&
        playerPosition.col === giftPosition.col
    ) {
        if (nivel < maps.length - 1) {
            nivel++;
        } else {
            gameOver();
        }
        playerPosition.row = undefined;
        playerPosition.col = undefined;
        startGame();
    }

    const enemyCollision = enemiesPositions.find(enemy =>
        enemy.row === playerPosition.row &&
        enemy.col === playerPosition.col
    );

    if (enemyCollision) levelfailed();
}

function levelfailed() {
    lives--;
    if (lives <= 0) {
        gameOver();
    }
    playerPosition.row = undefined;
    playerPosition.col = undefined;
    startGame();
}

function gameOver() {
    nivel = 0;
    clearInterval(timeInterval);

    if (lives > 0) {
        getRecord();
    }

    lives = 4;
    timeStart = undefined;
    playerPosition.row = undefined;
    playerPosition.col = undefined;
}

function getRecord() {
    const playerTime = Date.now() - timeStart;
    const recordTime = parseInt(localStorage.getItem('record_time'));

    if (!isNaN(recordTime)) {
        if (playerTime <= recordTime) {
            localStorage.setItem('record_time', playerTime);
            presult.innerHTML = '¡SUPERASTE EL RÉCORD!';
        } else {
            presult.innerHTML = 'Lo siento, no superaste el récord :(';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        presult.innerHTML = '¡Primer récord establecido!';
    }
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);
    spanlives.innerHTML = heartsArray.join('');
}

function showTime() {
    spantime.innerHTML = ((Date.now() - timeStart) / 1000).toFixed(1);
}

function showRecord() {
    const record = localStorage.getItem('record_time');
    spanrecord.innerHTML = record ? (record / 1000).toFixed(1) : '0.0';
}

function moveByKeys(e) {
    switch (e.key) {
        case "ArrowUp": moveUp(); break;
        case "ArrowDown": moveDown(); break;
        case "ArrowLeft": moveLeft(); break;
        case "ArrowRight": moveRight(); break;
    }
}

function moveUp() {
    if (playerPosition.row > 0) {
        playerPosition.row--;
        startGame();
    }
}

function moveDown() {
    if (playerPosition.row < 9) {
        playerPosition.row++;
        startGame();
    }
}

function moveLeft() {
    if (playerPosition.col > 0) {
        playerPosition.col--;
        startGame();
    }
}

function moveRight() {
    if (playerPosition.col < 9) {
        playerPosition.col++;
        startGame();
    }
}
