const gameContainer = document.getElementById('game');
const resetBtn = document.getElementById('resetBtn');
const difficultySelect = document.getElementById('difficulty');
const darkModeToggle = document.getElementById('darkModeToggle');
const timerEl = document.getElementById('timer');

const soundClick = document.getElementById('soundClick');
const soundFlag = document.getElementById('soundFlag');
const soundBomb = document.getElementById('soundBomb');

let gameSize = 10;
let bombCount = 15;

let gameBoard = [];
let gameOver = false;
let timer = null;
let timeElapsed = 0;
let timerRunning = false;

function setDifficulty() {
  const diff = difficultySelect.value;
  if (diff === 'easy') {
    gameSize = 8;
    bombCount = 10;
  } else if (diff === 'medium') {
    gameSize = 10;
    bombCount = 15;
  } else if (diff === 'hard') {
    gameSize = 15;
    bombCount = 40;
  }
}

function initTimer() {
  clearInterval(timer);
  timeElapsed = 0;
  timerEl.textContent = '0';
  timerRunning = false;
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timer = setInterval(() => {
    timeElapsed++;
    timerEl.textContent = timeElapsed;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timerRunning = false;
}

function playSound(sound) {
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play();
  } catch (e) {
    // ignore errors
  }
}

function init() {
  setDifficulty();
  gameOver = false;
  gameBoard = [];
  gameContainer.innerHTML = '';
  gameContainer.style.gridTemplateColumns = `repeat(${gameSize}, 32px)`;
  initTimer();

  for (let i = 0; i < gameSize; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < gameSize; j++) {
      gameBoard[i][j] = {
        bomb: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
        element: null,
        x: i,
        y: j,
      };
    }
  }

  let bombsPlaced = 0;
  while (bombsPlaced < bombCount) {
    const x = Math.floor(Math.random() * gameSize);
    const y = Math.floor(Math.random() * gameSize);
    if (!gameBoard[x][y].bomb) {
      gameBoard[x][y].bomb = true;
      bombsPlaced++;
    }
  }

  for (let i = 0; i < gameSize; i++) {
    for (let j = 0; j < gameSize; j++) {
      if (gameBoard[i][j].bomb) continue;
      let count = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nx = i + dx;
          const ny = j + dy;
          if (nx >= 0 && nx < gameSize && ny >= 0 && ny < gameSize) {
            if (gameBoard[nx][ny].bomb) count++;
          }
        }
      }
      gameBoard[i][j].adjacent = count;
    }
  }

  for (let i = 0; i < gameSize; i++) {
    for (let j = 0; j < gameSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.setAttribute('tabindex', '0');
      cell.addEventListener('click', revealCell);
      cell.addEventListener('contextmenu', flagCell);
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          revealCell(e);
        }
        if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          flagCell(e);
        }
      });
      gameContainer.appendChild(cell);
      gameBoard[i][j].element = cell;
    }
  }
}

function revealCell(e) {
  if (gameOver) return;

  const x = parseInt(e.currentTarget.dataset.x);
  const y = parseInt(e.currentTarget.dataset.y);
  const cell = gameBoard[x][y];

  if (cell.revealed || cell.flagged) return;

  if (!timerRunning) startTimer();

  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.bomb) {
    cell.element.classList.add('bomb');
    cell.element.textContent = '💣';
    playSound(soundBomb);
    gameOver = true;
    revealAllBombs();
    stopTimer();
    setTimeout(() => alert('💥 Game Over! You hit a bomb.'), 150);
    return;
  }

  playSound(soundClick);

  if (cell.adjacent > 0) {
    cell.element.textContent = cell.adjacent;
    cell.element.setAttribute('data-value', cell.adjacent);
  } else {
    // No recursive reveal: just empty cell, no number shown
    cell.element.textContent = '';
  }

  checkWin();
}

function flagCell(e) {
  e.preventDefault();
  if (gameOver) return;

  const x = parseInt(e.currentTarget.dataset.x);
  const y = parseInt(e.currentTarget.dataset.y);
  const cell = gameBoard[x][y];

  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  if (cell.flagged) {
    cell.element.classList.add('flagged');
    cell.element.textContent = '⚑';
    playSound(soundFlag);
  } else {
    cell.element.classList.remove('flagged');
    cell.element.textContent = '';
  }
}

function revealAllBombs() {
  for (let i = 0; i < gameSize; i++) {
    for (let j = 0; j < gameSize; j++) {
      const cell = gameBoard[i][j];
      if (cell.bomb && !cell.revealed) {
        cell.element.classList.add('bomb', 'revealed');
        cell.element.textContent = '💣';
      }
    }
  }
}

function checkWin() {
  let unrevealedCount = 0;
  for (let i = 0; i < gameSize; i++) {
    for (let j = 0; j < gameSize; j++) {
      const cell = gameBoard[i][j];
      if (!cell.revealed && !cell.bomb) unrevealedCount++;
    }
  }
  if (unrevealedCount === 0 && !gameOver) {
    gameOver = true;
    stopTimer();
    revealAllBombs();
    setTimeout(() => alert(`🎉 You won! Time: ${timeElapsed} seconds`), 150);
  }
}

resetBtn.addEventListener('click', () => {
  stopTimer();
  init();
});

difficultySelect.addEventListener('change', () => {
  stopTimer();
  init();
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

init();
