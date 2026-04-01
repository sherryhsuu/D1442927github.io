const BOARD_SIZE = 15;
const boardElement = document.getElementById('board');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');

let currentPlayer = 'black'; // 'black' or 'white'
let gameActive = true;
let boardState = []; // 2D array to store board state: null, 'black', 'white'

// Initialize the game
function initGame() {
    currentPlayer = 'black';
    gameActive = true;
    boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    
    boardElement.innerHTML = '';
    boardElement.className = 'board playing black-turn';
    updateStatus();

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Create a placeholder piece for hover effects and actual placement
            const piece = document.createElement('div');
            piece.classList.add('piece');
            cell.appendChild(piece);

            cell.addEventListener('click', () => handleCellClick(r, c, cell, piece));
            boardElement.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(r, c, cell, piece) {
    if (!gameActive || boardState[r][c] !== null) {
        return; // Cell already occupied or game over
    }

    // Place the piece
    boardState[r][c] = currentPlayer;
    cell.classList.add('has-piece');
    piece.classList.add(currentPlayer);

    // Check for win
    if (checkWin(r, c, currentPlayer)) {
        gameActive = false;
        boardElement.classList.remove('playing', 'black-turn', 'white-turn');
        updateStatus(`${currentPlayer === 'black' ? '黑子' : '白子'} 獲勝！`);
        statusText.classList.add('win');
        return;
    }

    // Check for draw
    if (checkDraw()) {
        gameActive = false;
        boardElement.classList.remove('playing', 'black-turn', 'white-turn');
        updateStatus('遊戲平局！');
        return;
    }

    // Switch turns
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    boardElement.classList.remove('black-turn', 'white-turn');
    boardElement.classList.add(`${currentPlayer}-turn`);
    updateStatus();
}

function updateStatus(customMessage) {
    statusText.classList.remove('win', 'black-turn', 'white-turn');
    if (customMessage) {
        statusText.textContent = customMessage;
    } else {
        const playerDisplay = currentPlayer === 'black' ? '黑子' : '白子';
        statusText.textContent = `目前輪到：${playerDisplay}`;
        statusText.classList.add(`${currentPlayer}-turn`);
    }
}

function checkWin(r, c, player) {
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal (bottom-right)
        [1, -1]  // Anti-diagonal (bottom-left)
    ];

    for (let [dr, dc] of directions) {
        let count = 1; // Count the current piece
        
        // Check in positive direction
        let i = r + dr;
        let j = c + dc;
        while (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && boardState[i][j] === player) {
            count++;
            i += dr;
            j += dc;
        }

        // Check in negative direction
        i = r - dr;
        j = c - dc;
        while (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && boardState[i][j] === player) {
            count++;
            i -= dr;
            j -= dc;
        }

        if (count >= 5) {
            return true;
        }
    }

    return false;
}

function checkDraw() {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (boardState[r][c] === null) {
                return false;
            }
        }
    }
    return true;
}

restartBtn.addEventListener('click', initGame);

// Start the game on load
initGame();
