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


// --------------------------------------------------
// LEVEL
// --------------------------------------------------

const urlParams = new URLSearchParams(window.location.search);

const level =
    urlParams.get("level") === "2"
        ? 2
        : 1;


// --------------------------------------------------
// LEVEL SETTINGS
// --------------------------------------------------

const levelSettings = {

    1: {
        speed: 175,
        maxSpeedIncrease: 190,
        obstacleColor: "#ff637d",
        obstacleHighlight: "#ffb1bd",
        playerColor: "#72f5d0",
        playerFeet: "#d8fff4",
        edgeColor: "#72f5d0",
        backgroundTop: "#0c1528",
        backgroundBottom: "#111e30",
        laneColor: "#243249",
        roadColor: "#233149"
    },

    2: {
        speed: 195,
        maxSpeedIncrease: 215,
        obstacleColor: "#ff4d4d",
        obstacleHighlight: "#ffd0d0",
        playerColor: "#4da6ff",
        playerFeet: "#d7ebff",
        edgeColor: "#4da6ff",
        backgroundTop: "#160b18",
        backgroundBottom: "#21102a",
        laneColor: "#42233f",
        roadColor: "#3a2038"
    }
};

const settings =
    levelSettings[level];


// --------------------------------------------------
// GAME STATE
// --------------------------------------------------

let gameState = "ready";

let playerLane = 1;

let obstacles = [];

let score = 0;

let bestScore =
    Number(
        localStorage.getItem(
            `oneMoreBestLevel${level}`
        ) || 0
    );

let elapsed = 0;

let speed = settings.speed;

let spawnTimer = 0;

let lastTime = 0;

let flash = 0;

let streak = 0;

bestElement.textContent =
    bestScore;


// --------------------------------------------------
// LEVEL LABEL
// --------------------------------------------------

if (level === 2) {

    messageElement.textContent =
        "LEVEL 2 · GET READY…";

} else {

    messageElement.textContent =
        "Stay sharp…";
}


// --------------------------------------------------
// PLAYER
// --------------------------------------------------

const player = {
    y: 395,
    width: 26,
    height: 30
};


// --------------------------------------------------
// LANES
// --------------------------------------------------

const lanePositions = [
    96,
    180,
    264
];


// --------------------------------------------------
// START GAME
// --------------------------------------------------

function startGame() {

    gameState = "running";

    playerLane = 1;

    obstacles = [];

    score = 0;

    elapsed = 0;

    speed = settings.speed;

    spawnTimer = 0.5;

    streak = 0;

    flash = 0;

    scoreElement.textContent =
        "0";

    multiplierElement.textContent =
        "×1";

    messageElement.textContent =
        level === 2
            ? "LEVEL 2 · STAY SHARP"
            : "Stay sharp…";

    overlay.style.display =
        "none";
}


// --------------------------------------------------
// GAME OVER
// --------------------------------------------------

function gameOver() {

    gameState = "gameover";

    const finalScore =
        Math.floor(score);

    if (finalScore > bestScore) {

        bestScore =
            finalScore;

        localStorage.setItem(
            `oneMoreBestLevel${level}`,
            bestScore
        );

        bestElement.textContent =
            bestScore;
    }

    overlayTitle.innerHTML =
        "RUN<br>OVER<span>.</span>";

    overlayText.innerHTML =
        `SCORE: <strong style="color:${settings.playerColor};font-size:24px">${finalScore}</strong><br>
         BEST: <strong>${bestScore}</strong><br><br>
         ${finalScore >= bestScore
            ? "NEW PERSONAL BEST!"
            : "YOU WERE GETTING CLOSER…"}`;

    startButton.textContent =
        "↻ TRY AGAIN";

    overlay.style.display =
        "flex";

    messageElement.textContent =
        level === 2
            ? "Level 2 is waiting for you."
            : "Every run makes you sharper.";
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
            Math.min(
                2,
                playerLane
            )
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

        if (
            Math.abs(difference) > 20
        ) {

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
     * Level 2 has more repeated-lane
     * patterns.
     */

    const sameLaneChance =
        level === 2
            ? 0.45
            : 0.30;

    if (
        obstacles.length > 0 &&
        Math.random() < sameLaneChance
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


    /*
     * Difficulty increases over time.
     */

    speed =
        settings.speed +
        Math.min(
            elapsed * 5,
            settings.maxSpeedIncrease
        );


    /*
     * Score multiplier.
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

        const baseSpawn =
            level === 2
                ? 0.82
                : 1.0;

        const minimumSpawn =
            level === 2
                ? 0.32
                : 0.38;

        const randomSpawn =
            level === 2
                ? 0.30
                : 0.38;

        spawnTimer =
            Math.max(
                minimumSpawn,
                baseSpawn -
                elapsed * 0.008
            ) +
            Math.random() *
            randomSpawn;
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

            obstacle.checked =
                true;

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
        settings.backgroundTop
    );

    gradient.addColorStop(
        1,
        settings.backgroundBottom
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
        settings.laneColor;

    ctx.lineWidth = 1;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const x =
            54 + i * 84;

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            HEIGHT
        );

        ctx.stroke();
    }


    /*
     * Moving road lines.
     */

    const offset =
        (elapsed * speed) % 42;

    ctx.strokeStyle =
        settings.roadColor;

    for (
        let y = -42 + offset;
        y < HEIGHT;
        y += 42
    ) {

        ctx.beginPath();

        ctx.moveTo(
            18,
            y
        );

        ctx.lineTo(
            342,
            y
        );

        ctx.stroke();
    }


    /*
     * Neon edges.
     */

    ctx.fillStyle =
        settings.edgeColor;

    ctx.globalAlpha =
        0.7;

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

    ctx.globalAlpha =
        1;
}


// --------------------------------------------------
// DRAW OBSTACLES
// --------------------------------------------------

function drawObstacles() {

    for (
        const obstacle of obstacles
    ) {

        const x =
            lanePositions[
                obstacle.lane
            ] - 30;

        const y =
            obstacle.y;

        ctx.shadowColor =
            settings.obstacleColor;

        ctx.shadowBlur = 12;

        drawRoundedRect(
            x,
            y,
            60,
            20,
            5,
            settings.obstacleColor
        );

        ctx.shadowBlur = 0;

        drawRoundedRect(
            x + 5,
            y + 4,
            50,
            3,
            2,
            settings.obstacleHighlight
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

    ctx.save();


    /*
     * Tiny movement animation.
     */

    if (
        gameState === "running"
    ) {

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
        settings.playerColor;

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
        settings.playerColor
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
        settings.playerFeet
    );

    drawRoundedRect(
        4,
        12,
        6,
        7,
        2,
        settings.playerFeet
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
            `rgba(255,85,120,${flash * 0.25})`;

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

draw();

requestAnimationFrame(
    gameLoop
);
