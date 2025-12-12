const rows = 5;
const cols = 12;
const walls = [[0, 3], [0, 9], [1, 1], [1, 5], [2, 2], [2, 7], [2, 11], [3, 4]];

let cells = [];
let dp = [];

function initGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    cells = [];
    dp = [];
    
    for (let i = 0; i < rows; i++) {
        cells[i] = [];
        dp[i] = [];
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (isWall(i, j)) {
                cell.classList.add('wall');
                dp[i][j] = 0;
            } else {
                dp[i][j] = 0;
            }
            
            if (i === 0 && j === 0) {
                cell.classList.add('start');
                cell.textContent = 'S';
            } else if (i === rows - 1 && j === cols - 1) {
                cell.classList.add('end');
                cell.textContent = 'E';
            }
            
            cells[i][j] = cell;
            grid.appendChild(cell);
        }
    }
}

function isWall(i, j) {
    for (let w of walls) {
        if (w[0] === i && w[1] === j) return true;
    }
    return false;
}

async function calculate() {
    // Nulstil
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!isWall(i, j)) {
                dp[i][j] = 0;
                if (!(i === 0 && j === 0) && !(i === rows - 1 && j === cols - 1)) {
                    cells[i][j].textContent = '';
                }
            }
        }
    }
    
    // Start med E=1
    dp[rows - 1][cols - 1] = 1;
    cells[rows - 1][cols - 1].textContent = 'E=1';
    await sleep(100);
    
    // Udfyld nederste række
    for (let j = cols - 2; j >= 0; j--) {
        if (!isWall(rows - 1, j)) {
            dp[rows - 1][j] = dp[rows - 1][j + 1];
            cells[rows - 1][j].textContent = dp[rows - 1][j];
            await sleep(50);
        }
    }
    
    // Udfyld højre kolonne
    for (let i = rows - 2; i >= 0; i--) {
        if (!isWall(i, cols - 1)) {
            dp[i][cols - 1] = dp[i + 1][cols - 1];
            cells[i][cols - 1].textContent = dp[i][cols - 1];
            await sleep(50);
        }
    }
    
    // Udfyld resten - bottom-up
    for (let i = rows - 2; i >= 0; i--) {
        for (let j = cols - 2; j >= 0; j--) {
            if (isWall(i, j)) continue;
            
            let from_down = 0;
            let from_right = 0;
            
            if (i + 1 < rows && !isWall(i + 1, j)) {
                from_down = dp[i + 1][j];
            }
            
            if (j + 1 < cols && !isWall(i, j + 1)) {
                from_right = dp[i][j + 1];
            }
            
            dp[i][j] = from_down + from_right;
            cells[i][j].textContent = dp[i][j];
            
            if (i === 0 && j === 0) {
                await sleep(100);
                cells[0][0].classList.add('highlight');
                cells[0][0].textContent = 'S=' + dp[0][0];
            } else {
                await sleep(30);
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', initGrid);
