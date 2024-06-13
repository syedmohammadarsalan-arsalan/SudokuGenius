var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);
    }
}

var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                arr[i][j].innerText = board[i][j];
            } else {
                arr[i][j].innerText = '';
            }
        }
    }
}

function clearBoard() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            arr[i][j].innerText = '';
            board[i][j] = 0;
        }
    }
}

let GetPuzzle = document.getElementById('GetPuzzle')
let SolvePuzzle = document.getElementById('SolvePuzzle')
let ResetPuzzle = document.getElementById('ResetPuzzle')
let StatusMessage = document.getElementById('StatusMessage')

let difficulty = 'easy';

document.querySelectorAll('.difficulty').forEach(button => {
    button.onclick = function() {
        difficulty = this.id;
        document.querySelectorAll('.difficulty').forEach(btn => btn.style.backgroundColor = '');
        this.style.backgroundColor = '#2d6898';
    }
});

GetPuzzle.onclick = function () {
    var xhrRequest = new XMLHttpRequest()
    xhrRequest.onload = function () {
        var response = JSON.parse(xhrRequest.response)
        console.log(response)
        board = response.board
        FillBoard(board)
        StatusMessage.innerText = '';
    }
    xhrRequest.open('get', `https://sugoku.onrender.com/board?difficulty=${difficulty}`)
    xhrRequest.send()
}

SolvePuzzle.onclick = () => {
  // Check if board is empty or not initialized
  if (!board || board.length === 0 || board[0].length === 0) {
      console.log('No puzzle loaded. Fetch a puzzle first.');
      StatusMessage.innerText = 'No puzzle loaded. Fetch a puzzle first.';
      StatusMessage.style.color = 'red';
      return;
  }

  // Attempt to solve the puzzle
  if (SudokuSolver(board, 0, 0, 9)) {
      FillBoard(board); // Update the UI with the solved board
      StatusMessage.innerText = 'Solved!';
      StatusMessage.style.color = 'green';
  } else {
      StatusMessage.innerText = 'Unsolved!'; // This should ideally never happen
      StatusMessage.style.color = 'red';
  }
};


ResetPuzzle.onclick = () => {
    clearBoard();
    StatusMessage.innerText = '';
};

function isValid(board, i, j, num, n) {
    for (let x = 0; x < n; x++) {
        if (board[i][x] == num || board[x][j] == num) {
            return false;
        }
    }

    let rn = Math.sqrt(n);
    let si = i - i % rn;
    let sj = j - j % rn;

    for (let x = si; x < si + rn; x++) {
        for (let y = sj; y < sj + rn; y++) {
            if (board[x][y] == num) {
                return false;
            }
        }
    }
    return true;
}

function SudokuSolver(board, i, j, n) {
    if (i == n) {
        return true;
    }

    if (j == n) {
        return SudokuSolver(board, i + 1, 0, n);
    }

    if (board[i][j] != 0) {
        return SudokuSolver(board, i, j + 1, n);
    }

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, i, j, num, n)) {
            board[i][j] = num;
            if (SudokuSolver(board, i, j + 1, n)) {
                return true;
            }
            board[i][j] = 0;
        }
    }
    return false;
}