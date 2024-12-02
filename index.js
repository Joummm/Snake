// --- Selecting HTML Elements ---
const gameCanvas = document.querySelector("#gameCanvas"); // Canvas element for the game board
const ctx = gameCanvas.getContext("2d"); // Context for drawing on the canvas
const scoreDisplay = document.querySelector("#scoreDisplay"); // Element to show the current score
const resetButton = document.querySelector("#resetButton"); // Button to reset the game
const highScoreDisplay = document.querySelector("#highScoreDisplay"); // Element to show the high score

// --- Game Constants ---
const canvasWidth = gameCanvas.width; // Width of the game board
const canvasHeight = gameCanvas.height; // Height of the game board
const backgroundColor = "#1e1e1e"; // Canvas background color (dark mode)
const snakeBodyColor = "#1db954"; // Snake body color
const snakeBorderColor = "#111"; // Snake border color
const foodColor = "#ff3e3e"; // Food color (red)
const unitSize = 25; // The size of each square unit on the board

// --- Game Variables ---
let gameRunning = false; // Boolean to track if the game is running
let xVelocity = unitSize; // Horizontal movement speed of the snake
let yVelocity = 0; // Vertical movement speed of the snake
let foodX; // X-coordinate of the food
let foodY; // Y-coordinate of the food
let score = 0; // Current score
let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score from local storage, default is 0
let snake = [ // Initial snake segments (5 blocks)
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

// --- Event Listeners ---
window.addEventListener("keydown", changeDirection); // Listen for arrow key presses
resetButton.addEventListener("click", resetGame); // Reset game when button is clicked

// --- Start the Game ---
startGame(); // Initialize the game

/**
 * Initializes the game state and starts the game loop.
 */
function startGame() {
    gameRunning = true; // Game starts running
    score = 0; // Reset the score
    scoreDisplay.textContent = `Score: ${score}`; // Update score display
    highScoreDisplay.textContent = `High Score: ${highScore}`; // Display high score
    createFood(); // Generate initial food location
    drawFood(); // Draw the food on the board
    gameLoop(); // Start the game loop
}

/**
 * Game loop to handle frame updates.
 */
function gameLoop() {
    if (gameRunning) {
        setTimeout(() => {
            clearCanvas(); // Clear the board
            drawFood(); // Draw the food
            moveSnake(); // Move the snake
            drawSnake(); // Draw the snake
            checkGameOver(); // Check if the game is over
            gameLoop(); // Recursively call the game loop
        }, 75); // Frame rate in milliseconds
    } else {
        showGameOver(); // Display "Game Over" message
    }
}

/**
 * Clears the canvas for the next frame.
 */
function clearCanvas() {
    ctx.fillStyle = backgroundColor; // Set background color
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Fill the entire canvas
}

/**
 * Creates a new random location for the food.
 */
function createFood() {
    function randomCoordinate(min, max) {
        return Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomCoordinate(0, canvasWidth - unitSize); // Generate random X coordinate
    foodY = randomCoordinate(0, canvasHeight - unitSize); // Generate random Y coordinate
}

/**
 * Draws the food on the canvas.
 */
function drawFood() {
    ctx.fillStyle = foodColor; // Set food color
    ctx.fillRect(foodX, foodY, unitSize, unitSize); // Draw the food as a square
}

/**
 * Moves the snake by updating its head position.
 * If the snake eats food, it grows; otherwise, the tail is removed.
 */
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity }; // New head position
    snake.unshift(head); // Add the new head to the snake

    // Check if food is eaten
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1; // Increment score
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (score > highScore) { // Check for new high score
            highScore = score;
            localStorage.setItem("highScore", highScore); // Save high score in local storage
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
        createFood(); // Generate new food location
    } else {
        snake.pop(); // Remove the tail if food is not eaten
    }
}

/**
 * Draws the snake on the canvas.
 */
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = snakeBodyColor; // Set snake body color
        ctx.strokeStyle = snakeBorderColor; // Set snake border color
        ctx.fillRect(segment.x, segment.y, unitSize, unitSize); // Draw the segment
        ctx.strokeRect(segment.x, segment.y, unitSize, unitSize); // Draw the border
    });
}

/**
 * Changes the snake's direction based on user input.
 */
function changeDirection(event) {
    const keyPressed = event.keyCode; // Get the key code of the pressed key
    const swipeMap = {
        37: [-unitSize, 0], // Left
        38: [0, -unitSize], // Up
        39: [unitSize, 0], // Right
        40: [0, unitSize]  // Down
    };

    if (swipeMap[keyPressed]) {
        const [newX, newY] = swipeMap[keyPressed];
        if (!(xVelocity === -newX && yVelocity === -newY)) { // Prevent reversing direction
            xVelocity = newX;
            yVelocity = newY;
        }
    }
}

/**
 * Checks if the game is over by detecting collisions.
 */
function checkGameOver() {
    // Check wall collision
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvasWidth ||
        snake[0].y < 0 ||
        snake[0].y >= canvasHeight
    ) {
        gameRunning = false;
    }

    // Check self-collision
    snake.slice(1).forEach(segment => {
        if (segment.x === snake[0].x && segment.y === snake[0].y) {
            gameRunning = false;
        }
    });
}

/**
 * Displays "Game Over" message on the canvas.
 */
function showGameOver() {
    ctx.fillStyle = "white"; // Set text color
    ctx.font = "40px 'Press Start 2P', sans-serif"; // Set font
    ctx.textAlign = "center"; // Center align the text
    ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2 - 20);
    ctx.fillText(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 + 40);
}

/**
 * Resets the game state and restarts the game.
 */
function resetGame() {
    gameRunning = true;
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    startGame(); // Restart the game
}
