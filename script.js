const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = {
    x: 80,
    y: 200,
    radius: 20,
    velocity: 0
};

let gravity = 0.5;
let jump = -8;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

let pipe = {
    x: 350,
    width: 70,
    gap: 170,
    topHeight: 180
};

document.addEventListener("click", () => {
    if (gameOver) {
        location.reload();
    } else {
        bird.velocity = jump;
    }
});

function drawBird() {

    // Rocket Body
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Rocket Nose
    ctx.fillStyle = "orange";
    ctx.fillRect(bird.x - 28, bird.y - 5, 14, 10);

    // Window
    ctx.fillStyle = "lightblue";
    ctx.beginPath();
    ctx.arc(bird.x + 5, bird.y - 3, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipe() {

    ctx.fillStyle = "#228B22";

    ctx.fillRect(
        pipe.x,
        0,
        pipe.width,
        pipe.topHeight
    );

    ctx.fillRect(
        pipe.x,
        pipe.topHeight + pipe.gap,
        pipe.width,
        canvas.height
    );
}

function drawBackground() {

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clouds
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(80, 80, 20, 0, Math.PI * 2);
    ctx.arc(100, 80, 25, 0, Math.PI * 2);
    ctx.arc(120, 80, 20, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(
        0,
        canvas.height - 30,
        canvas.width,
        30
    );
}

function checkCollision() {

    if (
        bird.x + bird.radius > pipe.x &&
        bird.x - bird.radius < pipe.x + pipe.width &&
        (
            bird.y - bird.radius < pipe.topHeight ||
            bird.y + bird.radius >
            pipe.topHeight + pipe.gap
        )
    ) {
        gameOver = true;
    }

    if (
        bird.y > canvas.height ||
        bird.y < 0
    ) {
        gameOver = true;
    }
}

function update() {

    if (gameOver) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    pipe.x -= 3;

    if (pipe.x + pipe.width < 0) {

        pipe.x = canvas.width;

        pipe.topHeight =
            Math.random() * 200 + 50;

        score++;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem(
                "highScore",
                highScore
            );
        }
    }

    checkCollision();
}

function gameLoop() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();
    drawBird();
    drawPipe();

    update();

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";

    ctx.fillText(
        "Score: " + score,
        10,
        30
    );

    ctx.fillText(
        "High: " + highScore,
        220,
        30
    );

    if (gameOver) {

        ctx.fillStyle = "red";
        ctx.font = "30px Arial";

        ctx.fillText(
            "GAME OVER",
            80,
            220
        );

        ctx.font = "18px Arial";

        ctx.fillText(
            "Tap To Restart",
            95,
            260
        );
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
