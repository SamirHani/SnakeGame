// define HTML elements
const board = document.getElementById('game-board');
let score = document.getElementById('score');
let highScore = document.getElementById('highScore');
let instructions = document.getElementById('instructions');
let lastGame = document.getElementById('lastGame');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'right';
let gameSpeed = 300;
let gameStarted = false;
let gameInterval;
let highScoreFromLocal = localStorage.getItem('highSocre');

// update the highScore from the local storage if exist
updateHighScore();

// to clear the hole board then draw the snake and the food
function draw() {
  board.innerHTML = '';
  if (gameStarted) {
    drawSnake();
    drawFood();
  }
}

// draw the snake elements
function drawSnake() {
  snake.forEach((obj) => {
    const snakeELement = createGameElement('div', 'snake');
    setPosition(snakeELement, obj);
    board.appendChild(snakeELement);
  });
}

// create the element food or snake
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// set the position of the food or snake
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// crate the food
function drawFood() {
  let tile = createGameElement('div', 'food');
  setPosition(tile, food);
  board.appendChild(tile);
}

// position the food randomly
function generateFood() {
  // if (gameStarted) {
  let x = Math.floor(Math.random() * gridSize) + 1;
  let y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
  // }
}

// move the snake direction and controle the size
function move() {
  let head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
  }

  // to add the new head position
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    updateScore();
    speedUp();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeed);
  } else {
    snake.pop();
  }
}

function speedUp() {
  if (snake.length < 20) {
    gameSpeed = gameSpeed - 5;
  } else if (snake.length > 20 && snake.length < 40) {
    gameSpeed = gameSpeed - 4;
  } else if (snake.length > 40 && snake.length < 60) {
    gameSpeed = gameSpeed - 3;
  } else if (snake.length > 60 && snake.length < 80) {
    gameSpeed = gameSpeed - 2;
  } else if (snake.length > 80) {
    gameSpeed = gameSpeed - 1;
  }
}

//the start of the interval
function startGame() {
  gameStarted = true;
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeed);
}

// the controlar function
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    // console.log(event , event.code , event.key)
    instructions.style.display = 'none';
    startGame();
  } else {
    // console.log(event , event.code , event.key)
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}
document.addEventListener('keydown', handleKeyPress);

// to update the score
function updateScore() {
  let currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, 0);
}

function updateHighScore() {
  lastGame.textContent = score.textContent;
  if (+highScore.textContent < +score.textContent) {
    highScore.textContent = score.textContent;
    localStorage.setItem('highScore', highScore.textContent);
  } else if (localStorage.getItem('highScore') > 0) {
    highScore.textContent = localStorage.getItem('highScore');
  }
}

// check if the snake ate his body or hit the boarder
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  if (snake.length > 2) {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame();
      }
    }
  }
}

// reset all parameters in the game to start new game
function resetGame() {
  updateHighScore();
  snake = [{ x: 10, y: 10 }];
  score.textContent = '0'.toString().padStart(3, '0');
  gameStarted = false;
  food = generateFood();
  direction = 'right';
  gameSpeed = 300;
  stopgame();
}

function stopgame() {
  clearInterval(gameInterval);
  instructions.style.display = 'block';
  handleKeyPress;
}
