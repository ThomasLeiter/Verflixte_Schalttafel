const canvas = document.getElementById("canvasId");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();

const statusMessage = document.getElementById("statusMessageId");

const switchGameModeButton = document.getElementById("switchGameModeId");
const gameModeLabel = document.getElementById("gameModeLabelId");

const width = 5;
const height = 5;

const cellWidth = rect.width / width;
const cellHeight = rect.height / height;

const cellBorder = 2;

var gameState = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

const EDIT_MODE = 0;
const SOLVE_MODE = 1;

var gameMode = EDIT_MODE;

updateControls();
drawGameState();

/**
 * Update the control elements on switching game mode
 */
function updateControls() {
    if (gameMode === EDIT_MODE) {
        switchGameModeButton.value = "Wechsel zum Spielmodus";
        gameModeLabel.innerHTML = "EDITIERMODUS";
    } else {
        switchGameModeButton.value = "Wechsel zum Editiermodus";
        gameModeLabel.innerHTML = "SPIELMODUS";
    }
}

/**
 * Switch game mode between 'EDIT_MODE' and 'SOLVE_MODE'
 */
function switchGameMode() {
    gameMode ^= 1;
    drawGameState();
    updateControls();
}

/**
 * Output messages for debugging purpose
 * @param {*} msg 
 */
function putStatusMessage(msg) {
    statusMessage.innerHTML += msg + "<br>";
}

/**
 * Draw the "bulb" at (row, col).
 * 
 * @param {*} row 
 * @param {*} col 
 * @param {*} status 
 */
function drawField(row, col, status) {
    context.fillStyle = (status == 1) ? "#0000FF" : "#FF0000";
    context.fillRect(
        col * cellWidth + cellBorder,
        row * cellHeight + cellBorder,
        cellWidth - 2 * cellBorder,
        cellHeight - 2 * cellBorder);
}

/**
 * Draw the whole "board".
 */
function drawGameState() {
    for (let row = 0; row < height; ++row) {
        for (let col = 0; col < width; ++col) {
            drawField(row, col, gameState[row][col]);
        }
    }
}

/**
 * Check whether (row, col) is a valid coordinate
 * 
 * @param {*} row 
 * @param {*} col 
 * @returns 
 */
function isValid(row, col) {
    return row >= 0 && row < height && col >= 0 && col < width;
}

/**
 * Get the neighborhood of grid cell (row, col)
 * including (row, col) itself.
 * 
 * @param {*} row 
 * @param {*} col 
 * @returns 
 */
function getNeighborhood(row, col) {
    let neighbors = [{ r: row, c: col }];
    if (isValid(row, col + 1)) {
        neighbors.push({ r: row, c: col + 1 });
    }
    if (isValid(row - 1, col)) {
        neighbors.push({ r: row - 1, c: col });
    }
    if (isValid(row, col - 1)) {
        neighbors.push({ r: row, c: col - 1 });
    }
    if (isValid(row + 1, col)) {
        neighbors.push({ r: row + 1, c: col });
    }
    return neighbors;
}

/**
 * Invert the state of a single cell.
 * 
 * @param {*} row 
 * @param {*} col 
 */
function invertCell(row, col) {
    gameState[row][col] ^= 1;
}

/**
 * Invert the neighborhood a a cell including the cell itself.
 * 
 * @param {*} row 
 * @param {*} col 
 */
function invertNeighborhood(row, col) {
    for (let n of getNeighborhood(row, col)) {
        invertCell(n.r, n.c);
    }
}

/**
 * Handle a mouseclick on the canvas depending on game mode.
 * 
 * @param {*} event 
 */
function handleMouseClick(event) {
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let col = Math.floor(x / cellWidth);
    let row = Math.floor(y / cellHeight);
    if (gameMode === EDIT_MODE) {
        invertCell(row, col);
    } else {
        invertNeighborhood(row, col);
    }
    drawGameState();
}