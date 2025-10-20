const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const unitSize = 25;
const tickSpeed = 24;

const boardWidth = canvas.width;
const boardHeight = canvas.height;

let snake = [];
let velocity = [];

let food = {
  x: 0,
  y: 0,
};

let specialFood = {
  x: 0,
  y: 0,
};

let score = 0;
let gameRunning = true;

const inputQueue = [];

const specialFoodPerSecondProbability = 10; // in %age
const specialFoodPerTickProbability =
  1 - Math.pow(1 - specialFoodPerSecondProbability / 100, 1 / tickSpeed);

let specialFoodGenerated = false;

window.addEventListener("keydown", changeDirection);

beginGame();

function assignDefaultValues() {
  snake = [
    { x: 100, y: boardHeight / 2 },
    { x: 75, y: boardHeight / 2 },
    { x: 50, y: boardHeight / 2 },
  ];
  velocity = {
    x: unitSize,
    y: 0,
  };
}

function beginGame() {
  assignDefaultValues();
  generateFoodPosition(food);

  intervalId = setInterval(() => {
    if (!gameRunning) {
      score = 0;

      renderGameOverScreen();
      clearInterval(intervalId);
    } else {
      updateBackground();
      renderFood();
      processSpecialFood();
      renderSnake();
      moveSnake();
      renderScore();
    }
  }, 1000 / tickSpeed);
}

function updateBackground() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, boardWidth, boardHeight);
}

function renderGameOverScreen() {
  ctx.font = "60px bolder Dosis";
  ctx.fillStyle = "black";

  const gameOverText = "Game Over!";

  ctx.fillText(
    gameOverText,
    boardWidth / 2 - gameOverText.length * 15,
    boardHeight / 2,
  );
}

function renderScore() {
  ctx.font = "30px bold Arial";
  ctx.fillStyle = "black";

  const scoreText = `Score: ${score}`;
  const tickSpeedText = `Tick Speed: ${tickSpeed}`;

  ctx.fillText(scoreText, boardWidth - scoreText.length * 15, 30);
  ctx.fillText(tickSpeedText, boardWidth - tickSpeedText.length * 15, 60);
}

function randomPosition(min, max) {
  return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
}

function generateFoodPosition(food) {
  food.x = randomPosition(0, boardWidth - unitSize);
  food.y = randomPosition(0, boardHeight - unitSize);

  snake.forEach((segment) => {
    if (food.x === segment.x && food.y === segment.y)
      generateFoodPosition(food);
  });
}

function renderFood() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(food.x, food.y + unitSize);
  ctx.lineTo(food.x + unitSize / 2, food.y);
  ctx.lineTo(food.x + unitSize, food.y + unitSize);
  ctx.lineTo(food.x, food.y + unitSize);
  ctx.fill();
  ctx.stroke();
}

function renderSpecialFood() {
  ctx.fillStyle = "blue";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.fillRect(specialFood.x, specialFood.y, unitSize, unitSize);
  ctx.stroke();
  ctx.strokeRect(specialFood.x, specialFood.y, unitSize, unitSize);
}

function processSpecialFood() {
  if (specialFoodGenerated) {
    renderSpecialFood();
    return;
  }
  if (Math.random() < specialFoodPerTickProbability) {
    specialFoodGenerated = true;
    generateFoodPosition(specialFood);
    renderSpecialFood();
  }
}

function isFoodEaten(food) {
  return snake[0].x === food.x && snake[0].y === food.y;
}

function isCollided(head) {
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}

function renderSnake() {
  ctx.fillStyle = "green";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];

    ctx.fillStyle = "green";

    // Outer circle
    ctx.beginPath();
    ctx.arc(
      segment.x + unitSize / 2,
      segment.y + unitSize / 2,
      unitSize / 2,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    ctx.stroke();

    // Inner eyes for head only
    if (i === 0) {
      ctx.beginPath();

      let x1, y1, x2, y2;

      if (velocity.x > 0) {
        // right
        x1 = segment.x + (3 * unitSize) / 4;
        y1 = segment.y + unitSize / 3;
        x2 = x1;
        y2 = segment.y + (2 * unitSize) / 3;
      } else if (velocity.x < 0) {
        // left
        x1 = segment.x + unitSize / 4;
        y1 = segment.y + unitSize / 3;
        x2 = x1;
        y2 = segment.y + (2 * unitSize) / 3;
      } else if (velocity.y > 0) {
        // down
        x1 = segment.x + unitSize / 3;
        y1 = segment.y + (3 * unitSize) / 4;
        x2 = segment.x + (2 * unitSize) / 3;
        y2 = y1;
      } else if (velocity.y < 0) {
        // up
        x1 = segment.x + unitSize / 3;
        y1 = segment.y + unitSize / 4;
        x2 = segment.x + (2 * unitSize) / 3;
        y2 = y1;
      }

      ctx.arc(x1, y1, unitSize / 8, 0, 2 * Math.PI);
      ctx.arc(x2, y2, unitSize / 8, 0, 2 * Math.PI);

      ctx.fillStyle = "white";
      ctx.fill();
    }
  }
}

function moveSnake() {
  if (inputQueue.length > 0) {
    velocity.x = inputQueue[0].x;
    velocity.y = inputQueue[0].y;

    inputQueue.shift();
  }

  const head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };

  if (isCollided(head)) gameRunning = false;
  snake.unshift(head);

  // Teleport the snake when it reaches the borders
  if (snake[0].x < 0) snake[0].x = boardWidth - unitSize;
  else if (snake[0].x >= boardWidth) snake[0].x = 0;

  if (snake[0].y < 0) snake[0].y = boardHeight - unitSize;
  else if (snake[0].y >= boardHeight) snake[0].y = 0;

  if (isFoodEaten(food)) {
    score++;
    generateFoodPosition(food);
  } else if (isFoodEaten(specialFood)) {
    score += 5;
    specialFoodGenerated = false;
  } else {
    snake.pop();
  }
}

function pushToInputQueue(x, y) {
  inputQueue.push({
    x,
    y,
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const W = 87;
  const A = 65;
  const S = 83;
  const D = 68;

  const ENTER = 13;

  const lastDir =
    inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : velocity;

  if ((keyPressed === W || keyPressed === UP) && lastDir.y === 0) {
    pushToInputQueue(0, -unitSize);
  } else if ((keyPressed === S || keyPressed === DOWN) && lastDir.y === 0) {
    pushToInputQueue(0, unitSize);
  } else if ((keyPressed === A || keyPressed === LEFT) && lastDir.x === 0) {
    pushToInputQueue(-unitSize, 0);
  } else if ((keyPressed === D || keyPressed === RIGHT) && lastDir.x === 0) {
    pushToInputQueue(unitSize, 0);
  }

  if (keyPressed === ENTER && !gameRunning) {
    gameRunning = true;

    beginGame();
  }
}
