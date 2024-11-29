console.log("WELCOME WELCOME WELCOME DOSTON...");

let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let over = new Audio("gameover.mp3");
let gameover = false;
let playerturn = "X";

const boxes = document.querySelectorAll(".box");
const boxTexts = document.querySelectorAll("#boxtext");
const info = document.querySelector(".info");
const line = document.querySelector(".line");
const img = document.querySelector(".image img");
const resetButton = document.getElementById("reset");
const progressBarX = document.getElementById("progressBarX");
const progressBarO = document.getElementById("progressBarO");

// Function to change the turn
const changeTurn = () => (playerturn === "X" ? "O" : "X");

// Function to simulate a single game from the current board state
function simulateGame(board, currentPlayer) {
    const availableMoves = board.map((mark, index) => mark === " " ? index : -1).filter(index => index !== -1);
    
    while (availableMoves.length > 0) {
        const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        board[move] = currentPlayer;
        
        if (checkWinner(board, currentPlayer)) {
            return currentPlayer;
        }

        // Switch player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        availableMoves.splice(availableMoves.indexOf(move), 1);
    }
    
    return "Draw";
}

// Function to check if a player has won
function checkWinner(board, player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        if (combo.every(index => board[index] === player)) {
            return true;
        }
    }
    return false;
}

// Function to simulate multiple games and calculate probabilities from the current board state
function simulateGamesFromCurrentState(board, currentPlayer, numGames = 512) {
    let xWins = 0;
    let oWins = 0;
    let draws = 0;

    for (let i = 0; i < numGames; i++) {
        const boardCopy = [...board];
        const result = simulateGame(boardCopy, currentPlayer);
        if (result === "X") {
            xWins++;
        } else if (result === "O") {
            oWins++;
        } else {
            draws++;
        }
    }

    const total = xWins + oWins + draws;
    console.log(`X Wins: ${xWins}, O Wins: ${oWins}, Draws: ${draws}, Total: ${total}`);
    return { xWins, oWins, draws, total };
}

// Function to print probability bars
function printProbabilityBar(xWins, oWins, draws, total) {
    const xProb = (xWins / total * 100).toFixed(2);
    const oProb = (oWins / total * 100).toFixed(2);
    
    console.log(`X Probability: ${xProb}%, O Probability: ${oProb}%`);
    
    progressBarX.style.width = xProb + "%";
    progressBarX.innerText = `X: ${xProb}%`;

    progressBarO.style.width = oProb + "%";
    progressBarO.innerText = `O: ${oProb}%`;
}

// Function to update the probability bars based on the current state of the game
function updateProbabilityBars() {
    const board = Array.from(boxTexts).map(box => box.innerText === "" ? " " : box.innerText);
    console.log("Board State:", board);
    const { xWins, oWins, draws, total } = simulateGamesFromCurrentState(board, playerturn);
    printProbabilityBar(xWins, oWins, draws, total);
}

// Event listener for box clicks
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (boxTexts[index].innerText === "" && !gameover) {
            boxTexts[index].innerText = playerturn;
            audioTurn.play();
            checkWin();
            playerturn = changeTurn();
            info.innerText = "Turn for " + playerturn;
            updateProbabilityBars();
        }
    });
});

// Event listener for reset button
resetButton.addEventListener("click", () => {
    boxTexts.forEach(boxText => boxText.innerText = "");
    playerturn = "X";
    gameover = false;
    info.innerText = "Turn for " + playerturn;
    line.style.width = "0vw";
    img.style.width = "0";
    updateProbabilityBars(); // Reset probabilities
});

// Function to check win
const checkWin = () => {
    let wins = [
        [0, 1, 2, 0, 5, 0],
        [3, 4, 5, 0, 15, 0],
        [6, 7, 8, 0, 25, 0],
        [0, 3, 6, -10, 15, 90],
        [1, 4, 7, 0, 15, 90],
        [2, 5, 8, 10, 15, 90],
        [0, 4, 8, 0, 15, 45],
        [2, 4, 6, 0, 15, 315],
    ];

    wins.forEach(e => {
        if (
            boxTexts[e[0]].innerText === boxTexts[e[1]].innerText &&
            boxTexts[e[0]].innerText === boxTexts[e[2]].innerText &&
            boxTexts[e[0]].innerText !== ""
        ) {
            info.innerText = boxTexts[e[0]].innerText + " WON";
            gameover = true;
            img.style.width = "150px";
            line.style.width = "30vw";
            line.style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
        }
    });
};
