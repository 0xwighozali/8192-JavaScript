let board;
let score = 0;
let rows = 4;
let columns = 4;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

window.onload = function () {
  setGame();
};

document.addEventListener('touchstart', function (event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', function (event) {
  event.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function (event) {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;

  const boardElement = document.getElementById('board');
  const boardRect = boardElement.getBoundingClientRect();

  const isTouchInsideBoard = touchEndX >= boardRect.left && touchEndX <= boardRect.right && touchEndY >= boardRect.top && touchEndY <= boardRect.bottom;

  if (isTouchInsideBoard) {
    handleSwipe();
  }
});

function handleSwipe() {
  const swipeThreshold = 50;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > swipeThreshold) {
      // Swipe right
      slideRight();
      setNewTile('right');
    } else if (deltaX < -swipeThreshold) {
      // Swipe left
      slideLeft();
      setNewTile('left');
    }
  } else {
    if (deltaY > swipeThreshold) {
      // Swipe down
      slideDown();
      setNewTile('down');
    } else if (deltaY < -swipeThreshold) {
      // Swipe up
      slideUp();
      setNewTile('up');
    }
  }
}

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  // board = [
  //   [2, 4, 8, 16],
  //   [32, 64, 128, 256],
  //   [512, 1024, 2048, 4096],
  //   [8192, 0, 0, 0],
  // ];

  // board = [
  //   [2, 4, 8, 16],
  //   [32, 64, 128, 256],
  //   [32, 0, 0, 0],
  //   [0, 0, 0, 0],
  // ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement('div');
      tile.id = r.toString() + '-' + c.toString();
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }
  //create 2 to begin the game
  setTwo();
  setTwo();
}

function gameOver() {
  if (!hasEmptyTile()) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if ((row < rows - 1 && board[row][col] === board[row + 1][col]) || (col < columns - 1 && board[row][col] === board[row][col + 1])) {
          return false;
        }
      }
    }
    alert('Game Over');
    return true;
  }
  return false;
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');
  tile.setAttribute('data-value', num.toString());
  if (num > 0) {
    tile.innerText = num.toString();
    if (num <= 4096) {
      tile.classList.add('x' + num.toString());
    } else {
      tile.classList.add('x8192');
    }
  } else {
    tile.classList.add('x0');
  }
}

function deepEquals(arr1, arr2) {
  if (arr1 === arr2) {
    return true;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      if (!deepEquals(arr1[i], arr2[i])) {
        return false;
      }
    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

document.addEventListener('keyup', (e) => {
  var board1 = JSON.parse(JSON.stringify(board)); // Menggunakan deep copy menggunakan JSON.parse(JSON.stringify())
  if (e.code == 'ArrowLeft') {
    slideLeft();
    if (!deepEquals(board1, board)) {
      setNewTile('left');
    }
  } else if (e.code == 'ArrowRight') {
    slideRight();
    if (!deepEquals(board1, board)) {
      setNewTile('right');
    }
  } else if (e.code == 'ArrowUp') {
    slideUp();
    if (!deepEquals(board1, board)) {
      setNewTile('up');
    }
  } else if (e.code == 'ArrowDown') {
    slideDown();
    if (!deepEquals(board1, board)) {
      setNewTile('down');
    }
  }
  document.getElementById('score').innerText = score;
});

function filterZero(row) {
  return row.filter((num) => num != 0); //create new array of all nums != 0
}

function slide(row) {
  //[0, 2, 2, 2]
  row = filterZero(row); //[2, 2, 2]
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  } //[4, 0, 2]
  row = filterZero(row); //[4, 2]
  //add zeroes
  while (row.length < columns) {
    row.push(0);
  } //[4, 2, 0, 0]
  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r]; //[0, 2, 2, 2]
    row.reverse(); //[2, 2, 2, 0]
    row = slide(row); //[4, 2, 0, 0]
    board[r] = row.reverse(); //[0, 0, 2, 4];
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }
  let maxTile = Math.max(...board.flat());
  let found = false;

  while (!found) {
    //find random row and column to place a 2 in
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      tile.innerText = '2';
      tile.classList.add('x2');
      found = true;
    }
  }
}

function setNewTile(move) {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;
  let maxTile = Math.max(...board.flat());

  let generateTile = (r, c, genNum) => {
    if (board[r][c] == 0) {
      board[r][c] = genNum;
      let tile = document.getElementById(r.toString() + '-' + c.toString());
      tile.innerText = genNum.toString();
      tile.classList.add('x' + genNum.toString());
      found = true;
    }
  };

  let generateRandomNumber = (num, weights) => {
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let randomWeightedIndex = () => {
      let random = Math.random() * totalWeight;
      let cumulativeWeight = 0;

      for (let i = 0; i < num.length; i++) {
        cumulativeWeight += weights[i];
        if (random < cumulativeWeight) {
          return i;
        }
      }
    };

    let genNum = num[randomWeightedIndex()];
    return genNum;
  };

  let addTile = (num, weights) => {
    while (!found) {
      if (move == 'up') {
        let r = 3;
        let c = Math.floor(Math.random() * columns);
        generateTile(r, c, generateRandomNumber(num, weights));
      }

      if (move == 'down') {
        let r = 0;
        let c = Math.floor(Math.random() * columns);
        generateTile(r, c, generateRandomNumber(num, weights));
      }

      if (move == 'right') {
        let r = Math.floor(Math.random() * rows);
        let c = 0;
        generateTile(r, c, generateRandomNumber(num, weights));
      }

      if (move == 'left') {
        let r = Math.floor(Math.random() * columns);
        let c = 3;
        generateTile(r, c, generateRandomNumber(num, weights));
      }
    }
  };

  if (maxTile >= 2048) {
    let num = [2, 4, 8];
    let weights = [6, 3, 1];
    addTile(num, weights);
  } else {
    let num = [2, 4];
    let weights = [4, 1];
    addTile(num, weights);
  }
  gameOver();
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        //at least one zero in the board
        return true;
      }
    }
  }
  return false;
}
