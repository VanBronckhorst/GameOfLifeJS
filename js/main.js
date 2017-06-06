const WIDTH = 400;
const HEIGHT = 400;

// current state of the game
let state = createArray(HEIGHT, WIDTH);
fillRandomly(state, HEIGHT * 0.5, WIDTH * 0.5, Math.floor(HEIGHT * 0.25), Math.floor(WIDTH * 0.25));

console.log(state);






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