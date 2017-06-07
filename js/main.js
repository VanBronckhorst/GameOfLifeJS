// Conway's Game of Life Settings
// the next state is a convolution of the current state with this filter
const filter = [[1, 1, 1],
                [1, 9, 1],
                [1, 1, 1]];
const nextState = (cell) => (cell == 11 || cell == 12 || cell == 3) ? ALIVE : DEAD;
const ALIVE = 1;
const DEAD = 0;

// Canvas Size Configuration
const style = window.getComputedStyle(document.getElementById("viz", null));
const H = parseFloat(style.getPropertyValue('height'));
const W = parseFloat(style.getPropertyValue('width'));
const SIDE = Math.min(W, H);

const board = document.getElementById("board");
board.height = SIDE;
board.width = SIDE;

// Global constants for the board
const WIDTH = 50;
const HEIGHT = 50;
let state = createArray(HEIGHT, WIDTH);

// Canvas On click (Flip Bit)
board.addEventListener('click', (event) => {
    let x = event.pageX - board.offsetLeft;
    let y = event.pageY - board.offsetTop;

    let c = Math.floor(x / (SIDE / WIDTH));
    let r = Math.floor(y / (SIDE / HEIGHT));

    if (state[r][c] == ALIVE) {
        state[r][c] = DEAD;
    }else {
        state[r][c] = ALIVE;
    }

    displayState(state, board);
});


init();
function init() {
    
    fillRandomly(state, HEIGHT * 0.5, WIDTH * 0.5, Math.floor(HEIGHT * 0.25), Math.floor(WIDTH * 0.25));
    displayState(state, board);

    // tick(state);
} 

function tick(state) {
    state = computeNextGeneration(state);
    displayState(state, board);
    requestAnimationFrame(() => tick(state));
} 

// compute the next generation from the current one using Conway's Game of Life rules
// The computation is a convolution between the current state and the filter
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
function computeNextGeneration(state) {
    let next = createArray(HEIGHT, WIDTH);

    // Center of the filter coordinates
    const c_r = Math.floor(filter.length / 2);
    const c_c = Math.floor(filter[0].length / 2);

    for (let i = 1; i < state.length -1; i++) {
        for (let j = 1; j < state[i].length -1; j++) {
            let cellSum = 0;
            // Convolution
            if (state[i][j] == ALIVE) {
                cellSum += 9;
            } 
            // Top
            cellSum += state[i - 1][j - 1];
            cellSum += state[i - 1][j];
            cellSum += state[i - 1][j + 1];
            // Middle
            cellSum += state[i][j - 1];
            cellSum += state[i][j + 1];
            // Bottom
            cellSum += state[i + 1][j - 1];
            cellSum += state[i + 1][j];
            cellSum += state[i + 1][j + 1];

            next[i][j] = nextState(cellSum);
        }
    }

    // Copy Borders For Wrapover 
    // Works because real border is always empty (already mirrored)
    let w = state[0].length;
    for (let i = 0; i < state.length; i++) {
        next[i][0] = next[i][w - 3];
        next[i][w - 2] = next[i][1];
    }

    let h = state.length;
    for (let i = 0; i < state[0].length; i++) {
        next[0][i] = next[h - 3][i];
        next[h - 2][i] = next[1][i];
    }

    return next;
}

// draws a generation defined by the state variable on the board canvas
function displayState(state, board) {
    const context = board.getContext('2d');
    const boardW = board.width;
    const boardH = board.height;

    const cellW = boardW / WIDTH;
    const cellH = boardH / HEIGHT;

    context.clearRect(0, 0, boardW, boardH);

    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            if (state[i][j] == ALIVE) {
                context.fillRect(j * cellW, i * cellH, cellW, cellH);
            }
        }
    }
}

// fill part of an array randomly with 0 or 1
function fillRandomly(array, row, cols, startRow = 0, startCol = 0) {
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < cols; j++) {
            array[startRow + i][startCol + j] = Math.round(Math.random());
        }
    }
}

// Helper function to create empty array of arrays
function createArray(rows, cols, val = 0) {
    let res = [];
    for (let i = 0; i < rows; i++) {
        res.push([]);
        for(let j = 0; j < cols; j++) {
            res[i].push(val);
        }
    }
    return res;
}