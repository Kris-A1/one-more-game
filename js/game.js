const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const overlay = document.getElementById("gameOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("bestScore");
const multiplierElement = document.getElementById("multiplierDisplay");
const messageElement = document.getElementById("gameMessage");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let gameState = "ready";

/*
 * LEVEL SYSTEM
 *
 * Normal URL:
 * https://kris-a1.github.io/one-more-game/
 *
 * Level 2:
 * https://kris-a1.github.io/one-more-game/?level=2
 */

const urlParams = new URLSearchParams(window.location.search);

let currentLevel =
    urlParams.get("level") === "2"
        ? 2
        : 1;

let playerLane = 1;

let obstacles = [];

let score = 0;

let bestScore =
    Number(
        localStorage.getItem("oneMoreBest") || 0
    );

let elapsed = 0;

let speed = 175;

let spawnTimer = 0;

let lastTime = 0;

let flash = 0;

let streak = 0;

bestElement.textContent = bestScore;


// --------------------------------------------------
// PLAYER
// --------------------------------------------------

const player = {
    y: 395,
    width: 26,
    height: 30
};


// --------------------------------------------------
// LEVEL SETTINGS
// --------------------------------------------------

function getLevelSettings() {

    if (currentLevel === 2) {

        return {
            speed: 195,
            minimumSpawnTime: 0.32,
            maximumSpawnReduction: 0.45
        };

    }

    return {
        speed: 175,
        minimumSpawnTime: 0.38,
        maximumSpawnReduction: 0.38
    };
}


// --------------------------------------------------
// START GAME
// --------------------------------------------------

function startGame() {

    gameState = "running";

    playerLane = 1;

    obstacles = [];

    score = 0;

    elapsed = 0;

    const settings =
        getLevelSettings();

    speed = settings.speed;

    spawnTimer =
        currentLevel === 2
            ? 0.45
            : 0.5;

    streak = 0;

    flash = 0;

    scoreElement.textContent = "0";

    multiplierElement.textContent = "×1";

    if (currentLevel === 2) {

        messageElement.textContent =
            "LEVEL 2 — Stay sharp…";

    } else {

        messageElement.textContent =
            "Stay sharp…";
    }

    overlay.style.display = "none";
}


// --------------------------------------------------
// GAME OVER
// --------------------------------------------------

function gameOver() {

    gameState = "gameover";

    const finalScore =
        Math.floor(score);

    const isNewBest =
        finalScore > bestScore;

    if (isNewBest) {

        bestScore = finalScore;

        localStorage.setItem(
            "oneMoreBest",
            bestScore
        );

        bestElement.textContent =
            bestScore;
    }

    overlayTitle.innerHTML =
        "RUN<br>OVER<span>.</span>";

    overlayText.innerHTML =
        `LEVEL ${currentLevel}<br>
         SCORE:
         <strong
            style="color:#72f5d0;font-size:24px"
         >
            ${finalScore}
         </strong>
         <br>
         BEST:
         <strong>${bestScore}</strong>
         <br><br>
         ${
             isNewBest
                 ? "NEW PERSONAL BEST!"
                 : "YOU WERE GETTING CLOSER…"
         }`;

    startButton.textContent =
        "↻ TRY AGAIN";

    overlay.style.display =
        "flex";

    messageElement.textContent =
        "Every run makes you sharper.";
}


// --------------------------------------------------
// MOVEMENT
// --------------------------------------------------

function movePlayer(direction) {

    if (gameState !== "running") {
        return;
    }

    playerLane += direction;

    playerLane =
        Math.max(
            0,
            Math.min(2, playerLane)
        );
}


// --------------------------------------------------
// BUTTONS
// --------------------------------------------------

leftButton.addEventListener(
    "click",
    () => movePlayer(-1)
);

rightButton.addEventListener(
    "click",
    () => movePlayer(1)
);

startButton.addEventListener(
    "click",
    startGame
);


// --------------------------------------------------
// KEYBOARD
// --------------------------------------------------

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a" ||
            event.key === "A"
        ) {

            event.preventDefault();

            movePlayer(-1);
        }

        if (
            event.key === "ArrowRight" ||
            event.key === "d" ||
            event.key === "D"
        ) {

            event.preventDefault();

            movePlayer(1);
        }

        if (
            (
                event.key === " " ||
                event.key === "Enter"
            ) &&
            gameState !== "running"
        ) {

            event.preventDefault();

            startGame();
        }
    }
);


// --------------------------------------------------
// TOUCH SWIPES
// --------------------------------------------------

let touchStartX = null;

canvas.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].clientX;
    },
    { passive: true }
);

canvas.addEventListener(
    "touchend",
    (event) => {

        if (touchStartX === null) {
            return;
        }

        const touchEndX =
            event.changedTouches[0].clientX;

        const difference =
            touchEndX - touchStartX;

        if (Math.abs(difference) > 20) {

            movePlayer(
                difference > 0
                    ? 1
                    : -1
            );
        }

        touchStartX = null;
    },
    { passive: true }
);


// --------------------------------------------------
// CREATE OBSTACLE
// --------------------------------------------------

function createObstacle() {

    let lane =
        Math.floor(
            Math.random() * 3
        );

    /*
     * Occasionally make the next obstacle
     * appear in the same lane.
     *
     * This creates more interesting patterns.
     */

    if (
        obstacles.length > 0 &&
        Math.random() < 0.30
    ) {

        lane =
            obstacles[
                obstacles.length - 1
            ].lane;
    }

    obstacles.push({
        lane: lane,
        y: -30,
        checked: false
    });
}


// --------------------------------------------------
// UPDATE
// --------------------------------------------------

function update(deltaTime) {

    if (gameState !== "running") {
        return;
    }

    elapsed += deltaTime;

    const settings =
        getLevelSettings();


    /*
     * Difficulty gradually increases.
     */

    speed =
        settings.speed +
        Math.min(
            elapsed * 5,
            currentLevel === 2
                ? 210
                : 190
        );


    /*
     * Score multiplier increases
     * every 10 seconds.
     */

    const multiplier =
        1 +
        Math.floor(
            elapsed / 10
        );

    score +=
        deltaTime *
        10 *
        multiplier;

    scoreElement.textContent =
        Math.floor(score);

    multiplierElement.textContent =
        `×${multiplier}`;


    /*
     * Spawn obstacles.
     */

    spawnTimer -= deltaTime;

    if (spawnTimer <= 0) {

        createObstacle();

        const baseSpawnTime =
            currentLevel === 2
                ? 0.82
                : 1.0;

        spawnTimer =
            Math.max(
                settings.minimumSpawnTime,
                baseSpawnTime -
                    elapsed * 0.008
            ) +
            Math.random() * 0.38;
    }


    /*
     * Move obstacles.
     */

    for (const obstacle of obstacles) {

        obstacle.y +=
            speed * deltaTime;


        /*
         * Successful dodge.
         */

        if (
            !obstacle.checked &&
            obstacle.y > player.y
        ) {

            obstacle.checked = true;

            if (
                obstacle.lane !== playerLane
            ) {

                streak++;

                if (streak >= 3) {

                    messageElement.textContent =
                        `🔥 PERFECT DODGE STREAK ×${streak}`;

                    score += 25;
                }

            } else {

                streak = 0;
            }
        }


        /*
         * Collision.
         */

        if (
            obstacle.lane === playerLane &&
            obstacle.y + 20 >
                player.y - 17 &&
            obstacle.y <
                player.y + 20
        ) {

            gameOver();

            return;
        }
    }


    /*
     * Remove old obstacles.
     */

    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.y <
                HEIGHT + 30
        );


    flash =
        Math.max(
            0,
            flash - deltaTime
        );
}


// --------------------------------------------------
// DRAW BACKGROUND
// --------------------------------------------------

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );

    gradient.addColorStop(
        0,
        "#0c1528"
    );

    gradient.addColorStop(
        1,
        "#111e30"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /*
     * Lane separators.
     */

    ctx.strokeStyle =
        "#243249";

    ctx.lineWidth = 1;

    for (let i = 0; i < 4; i++) {

        const x =
            54 + i * 84;

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, HEIGHT);

        ctx.stroke();
    }


    /*
     * Moving road lines.
     */

    const offset =
        (elapsed * speed) % 42;

    ctx.strokeStyle =
        "#233149";

    for (
        let y = -42 + offset;
        y < HEIGHT;
        y += 42
    ) {

        ctx.beginPath();

        ctx.moveTo(18, y);

        ctx.lineTo(342, y);

        ctx.stroke();
    }


    /*
     * Neon edges.
     */

    ctx.fillStyle =
        currentLevel === 2
            ? "#3b82f6"
            : "#72f5d0";

    ctx.globalAlpha = 0.7;

    ctx.fillRect(
        12,
        0,
        2,
        HEIGHT
    );

    ctx.fillRect(
        346,
        0,
        2,
        HEIGHT
    );

    ctx.globalAlpha = 1;
}


// --------------------------------------------------
// DRAW OBSTACLES
// --------------------------------------------------

function drawObstacles() {

    const obstacleColor =
        currentLevel === 2
            ? "#3b82f6"
            : "#ff637d";

    const obstacleHighlight =
        currentLevel === 2
            ? "#93c5fd"
            : "#ffb1bd";

    for (const obstacle of obstacles) {

        const x =
            lanePositions[
                obstacle.lane
            ] - 30;

        const y =
            obstacle.y;

        ctx.shadowColor =
            obstacleColor;

        ctx.shadowBlur = 12;

        drawRoundedRect(
            x,
            y,
            60,
            20,
            5,
            obstacleColor
        );

        ctx.shadowBlur = 0;

        drawRoundedRect(
            x + 5,
            y + 4,
            50,
            3,
            2,
            obstacleHighlight
        );
    }
}


// --------------------------------------------------
// DRAW PLAYER
// --------------------------------------------------

function drawPlayer() {

    const x =
        lanePositions[playerLane];

    const y =
        player.y;

    const playerColor =
        currentLevel === 2
            ? "#ff3b3b"
            : "#72f5d0";

    const footColor =
        currentLevel === 2
            ? "#ffb3b3"
            : "#d8fff4";


    ctx.save();


    /*
     * Tiny movement animation.
     */

    if (gameState === "running") {

        ctx.rotate(
            Math.sin(
                elapsed * 12
            ) * 0.06
        );
    }

    ctx.translate(
        x,
        y
    );


    /*
     * Glow.
     */

    ctx.shadowColor =
        playerColor;

    ctx.shadowBlur = 20;


    /*
     * Body.
     */

    drawRoundedRect(
        -13,
        -16,
        26,
        29,
        8,
        playerColor
    );


    ctx.shadowBlur = 0;


    /*
     * Eyes.
     */

    drawRoundedRect(
        -7,
        -9,
        4,
        5,
        1,
        "#0c1528"
    );

    drawRoundedRect(
        4,
        -9,
        4,
        5,
        1,
        "#0c1528"
    );


    /*
     * Feet.
     */

    drawRoundedRect(
        -9,
        12,
        6,
        7,
        2,
        footColor
    );

    drawRoundedRect(
        4,
        12,
        6,
        7,
        2,
        footColor
    );

    ctx.restore();
}


// --------------------------------------------------
// ROUNDED RECTANGLE
// --------------------------------------------------

function drawRoundedRect(
    x,
    y,
    width,
    height,
    radius,
    color
) {

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        width,
        height,
        radius
    );

    ctx.fill();
}


// --------------------------------------------------
// DRAW
// --------------------------------------------------

function draw() {

    drawBackground();

    drawObstacles();

    drawPlayer();


    /*
     * Collision flash.
     */

    if (flash > 0) {

        ctx.fillStyle =
            `rgba(
                255,
                85,
                120,
                ${flash * 0.25}
            )`;

        ctx.fillRect(
            0,
            0,
            WIDTH,
            HEIGHT
        );
    }
}


// --------------------------------------------------
// MAIN LOOP
// --------------------------------------------------

function gameLoop(timestamp) {

    const deltaTime =
        lastTime
            ? Math.min(
                (timestamp - lastTime) / 1000,
                0.04
            )
            : 0;

    lastTime =
        timestamp;

    update(deltaTime);

    draw();

    requestAnimationFrame(
        gameLoop
    );
}


// --------------------------------------------------
// INITIALIZE
// --------------------------------------------------

if (currentLevel === 2) {

    messageElement.textContent =
        "LEVEL 2 — Red vs Blue";

} else {

    messageElement.textContent =
        "Stay sharp…";
}

draw();

requestAnimationFrame(
    gameLoop
);
