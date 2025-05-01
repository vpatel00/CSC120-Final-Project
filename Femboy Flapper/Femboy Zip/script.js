// Declare the constants for the game
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const img = document.getElementById("bird");
const img2 = document.getElementById("pipe");

// Add background music
const backgroundMusic = new Audio("Femboy_Music.mp3");
backgroundMusic.loop = true; // Ensure the music loops continuously

// Game variables
let bird = { x: 100, y: 200, width: 60, height: 90, velocity: 0 }; // Adjusted dimensions (30% wider, 20% taller)
let gravity = 0.5;
let jump = -8;
let isGameOver = false;
let isGameStarted = false;
let pipes = [];
let pipeGap = 150;
let pipeWidth = 80;
let pipeSpeed = 2;
let score = 0;

// Start game when start button is clicked
startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    isGameStarted = true;
    backgroundMusic.play();
    createPipe();
    gameLoop();
});

function restartGame() {
    restartBtn.style.display = "none";
    const winScreen = document.getElementById("winScreen");
    winScreen.style.display = "none";
    isGameOver = false;
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    backgroundMusic.play(); // Resume background music
    createPipe();
    gameLoop();
}

// Listen for spacebar input to make the bird jump or restart game
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!isGameOver && isGameStarted) {
            bird.velocity = jump;
        } else if (isGameOver) {
            restartGame();
        }
    }
});

// Generate pipes with a larger gap between the top and bottom pipes
function createPipe() {
    const pipeHeight = Math.random() * (canvas.height - pipeGap - 200) + 100; // Increase the gap
    pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap - 60,  // Bigger gap
    });
}

// Draw the bird
function drawBird() {
    ctx.drawImage(img, bird.x, bird.y, bird.width, bird.height);
}

// Draw pipes
function drawPipes() {
    pipes.forEach((pipe) => {
        ctx.drawImage(img2, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(img2, pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}

// Update game mechanics
function update() {
    if (isGameOver || !isGameStarted) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    // Check if bird hits the top or bottom of the game area
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        isGameOver = true;
        backgroundMusic.pause(); // Pause background music
        backgroundMusic.currentTime = 0; // Reset music to the start
        restartBtn.style.display = "block";
        return;
    }

    pipes.forEach((pipe) => {
        pipe.x -= pipeSpeed;
    });

    pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        createPipe();
    }

    pipes.forEach((pipe) => {
        if (
            (bird.x < pipe.x + pipeWidth &&
                bird.x + bird.width > pipe.x &&
                (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight))
        ) {
            isGameOver = true;
            backgroundMusic.pause(); // Pause background music
            backgroundMusic.currentTime = 0; // Reset music to the start
            restartBtn.style.display = "block";
        }
    });

    pipes.forEach((pipe) => {
        if (!pipe.scored && bird.x > pipe.x + pipeWidth) {
            score++;
            pipe.scored = true;
        }
    });

    // Check for win condition (score >= 10)
    if (score >= 100) {
        isGameOver = true;
        backgroundMusic.pause(); // Pause background music
        backgroundMusic.currentTime = 0; // Reset music to the start
        displayWinScreen();
        return;
    }
}

// Display the win screen
function displayWinScreen() {
    const winScreen = document.getElementById("winScreen");
    winScreen.style.display = "block";
    restartBtn.style.display = "block";
}

// Draw everything on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();


    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    if (!isGameOver && isGameStarted) {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize the game
restartBtn.style.display = "none";
startScreen.style.display = "block";
