/* =========================================================
   1M — COMPLETE GAME
   10 LEVEL PROGRESSION
   ========================================================= */


/* ---------------------------------------------------------
   LEVEL DATA
   --------------------------------------------------------- */

const LEVELS = {

    1: {
        name: "NEON RUN",
        world: "NEON",
        target: 500,

        bg: "#07111f",
        grid: "#12324b",
        obstacle: "#ff4f9a",
        obstacle2: "#ff75b5",
        player: "#55e8ff",

        startSpeed: 175,
        maxSpeed: 205,

        strikes: false
    },

    2: {
        name: "NEON RUSH",
        world: "RUSH",
        target: 700,

        bg: "#12091e",
        grid: "#34204a",
        obstacle: "#ff405f",
        obstacle2: "#ff7890",
        player: "#66b8ff",

        startSpeed: 205,
        maxSpeed: 240,

        strikes: false
    },

    3: {
        name: "ANIMAL RUN",
        world: "ANIMAL",
        target: 900,

        bg: "#0b1710",
        grid: "#1c3824",
        obstacle: "#9b6a3d",
        obstacle2: "#c28b55",
        player: "#ffd95a",

        startSpeed: 220,
        maxSpeed: 255,

        strikes: false
    },

    4: {
        name: "OCEAN RUN",
        world: "OCEAN",
        target: 1100,

        bg: "#061a27",
        grid: "#0c3b4d",
        obstacle: "#ff5f7e",
        obstacle2: "#ff9a62",
        player: "#58e7ff",

        startSpeed: 225,
        maxSpeed: 270,

        strikes: true
    },

    5: {
        name: "DESERT RUN",
        world: "DESERT",
        target: 1300,

        bg: "#241508",
        grid: "#54361c",
        obstacle: "#e89b42",
        obstacle2: "#f2c05e",
        player: "#72e6ff",

        startSpeed: 235,
        maxSpeed: 280,

        strikes: true
    },

    6: {
        name: "FOREST RUN",
        world: "FOREST",
        target: 1500,

        bg: "#07180d",
        grid: "#17351f",
        obstacle: "#4da35d",
        obstacle2: "#9a633e",
        player: "#ffe16a",

        startSpeed: 245,
        maxSpeed: 290,

        strikes: true
    },

    7: {
        name: "SPACE RUN",
        world: "SPACE",
        target: 1750,

        bg: "#070817",
        grid: "#20244b",
        obstacle: "#d95cff",
        obstacle2: "#ff7dca",
        player: "#67f4ff",

        startSpeed: 255,
        maxSpeed: 305,

        strikes: true
    },

    8: {
        name: "ICE RUN",
        world: "ICE",
        target: 2000,

        bg: "#071923",
        grid: "#214858",
        obstacle: "#8fe8ff",
        obstacle2: "#d4fbff",
        player: "#ffd45e",

        startSpeed: 265,
        maxSpeed: 320,

        strikes: true
    },

    9: {
        name: "FRUIT RUN",
        world: "FRUIT",
        target: 2250,

        bg: "#190914",
        grid: "#47203a",
        obstacle: "#ff4d69",
        obstacle2: "#7fe06a",
        player: "#61e9ff",

        startSpeed: 275,
        maxSpeed: 335,

        strikes: true
    },

    10: {
        name: "CHAOS RUN",
        world: "CHAOS",
        target: 2600,

        bg: "#100817",
        grid: "#38204a",
        obstacle: "#ff456d",
        obstacle2: "#b66aff",
        player: "#58f2ff",

        startSpeed: 290,
        maxSpeed: 350,

        strikes: true
    }

};


/* ---------------------------------------------------------
   URL / LEVEL
   --------------------------------------------------------- */

const params =
    new URLSearchParams(
        window.location.search
    );


let requestedLevel =
    Number(
        params.get("level")
    ) || 1;


requestedLevel =
    Math.min(
        10,
        Math.max(
            1,
            requestedLevel
        )
    );


let currentLevel =
    requestedLevel;


/* ---------------------------------------------------------
   DOM
   --------------------------------------------------------- */

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");


const levelSubtitle =
    document.getElementById(
        "levelSubtitle"
    );


const bestScore =
    document.getElementById(
        "bestScore"
    );


const scoreElement =
    document.getElementById(
        "score"
    );


const multiplierDisplay =
    document.getElementById(
        "multiplierDisplay"
    );


const strikeDisplay =
    document.getElementById(
        "strikeDisplay"
    );


const gameOverlay =
    document.getElementById(
        "gameOverlay"
    );


const overlayLabel =
    document.getElementById(
        "overlayLabel"
    );


const overlayTitle =
    document.getElementById(
        "overlayTitle"
    );


const overlayText =
    document.getElementById(
        "overlayText"
    );


const animalChooser =
    document.getElementById(
        "animalChooser"
    );


const animalButtons =
    document.querySelectorAll(
        ".animal-button"
    );


const startButton =
    document.getElementById(
        "startButton"
    );


const leftButton =
    document.getElementById(
        "leftButton"
    );


const rightButton =
    document.getElementById(
        "rightButton"
    );


const attackButton =
    document.getElementById(
        "attackButton"
    );


const gameMessage =
    document.getElementById(
        "gameMessage"
    );


/* ---------------------------------------------------------
   GAME STATE
   --------------------------------------------------------- */

let running = false;

let gameComplete = false;

let animationId = null;

let lastTime = 0;

let elapsed = 0;

let score = 0;

let multiplier = 1;

let strikes = 3;

let selectedAnimal = "BUNNY";

let playerX = 180;

let playerY = 420;

let playerWidth = 28;

let playerHeight = 34;

let moveDirection = 0;

let obstacleTimer = 0;

let obstacleInterval = 850;

let obstacles = [];

let particles = [];

let flash = 0;

let shake = 0;

let laneCenters = [
    90,
    180,
    270
];

let playerLane = 1;


/* ---------------------------------------------------------
   STORAGE
   --------------------------------------------------------- */

const UNLOCK_KEY =
    "1M_unlocked_level";


function getUnlockedLevel() {

    const stored =
        Number(
            localStorage.getItem(
                UNLOCK_KEY
            )
        );


    if (!stored || stored < 1) {

        localStorage.setItem(
            UNLOCK_KEY,
            "1"
        );

        return 1;
    }


    return Math.min(
        10,
        stored
    );
}


function unlockLevel(level) {

    const current =
        getUnlockedLevel();


    if (level > current) {

        localStorage.setItem(
            UNLOCK_KEY,
            String(
                Math.min(
                    10,
                    level
                )
            )
        );
    }
}


/* ---------------------------------------------------------
   BEST SCORE
   --------------------------------------------------------- */

function getBestScore() {

    return Number(
        localStorage.getItem(
            `1M_best_level_${currentLevel}`
        )
    ) || 0;
}


function saveBestScore() {

    const best =
        getBestScore();


    if (score > best) {

        localStorage.setItem(
            `1M_best_level_${currentLevel}`,
            String(
                Math.floor(score)
            )
        );
    }
}


/* ---------------------------------------------------------
   LEVEL UI
   --------------------------------------------------------- */

function applyLevelUI() {

    const config =
        LEVELS[currentLevel];


    levelSubtitle.textContent =
        `LEVEL ${currentLevel} · ${config.name}`;


    bestScore.textContent =
        getBestScore();


    strikeDisplay.style.display =
        config.strikes
            ? "block"
            : "none";


    attackButton.style.display =
        config.strikes
            ? "flex"
            : "none";


    animalChooser.style.display =
        currentLevel === 3
            ? "block"
            : "none";


    if (currentLevel === 3) {

        startButton.textContent =
            `▶ START AS ${selectedAnimal}`;

    } else {

        startButton.textContent =
            "▶ START RUN";
    }


    strikeDisplay.textContent =
        `STRIKES ×${strikes}`;


    document.body.style.background =
        config.bg;
}


/* ---------------------------------------------------------
   OVERLAY
   --------------------------------------------------------- */

function showStartScreen() {

    running = false;

    gameComplete = false;

    gameOverlay.style.display =
        "flex";


    overlayLabel.textContent =
        currentLevel === 1
            ? "JUST ONE MORE RUN"
            : `LEVEL ${currentLevel}`;


    overlayTitle.innerHTML =
        currentLevel === 1
            ? '1M<span>.</span>'
            : `LEVEL ${currentLevel}`;


    const config =
        LEVELS[currentLevel];


    if (currentLevel === 1) {

        overlayText.innerHTML =
            "Dodge. Survive.<br>Beat your best.";

    } else if (currentLevel === 2) {

        overlayText.innerHTML =
            "Faster. Cleaner.<br>Beat your target.";

    } else if (currentLevel === 3) {

        overlayText.innerHTML =
            "Choose your runner.<br>Dodge. Survive.";

    } else {

        overlayText.innerHTML =
            `${config.world} world.<br>Reach ${config.target} points.`;

    }


    if (currentLevel >= 4) {

        gameMessage.textContent =
            "💥 You have 3 strikes.";

    } else {

        gameMessage.textContent =
            "Ready when you are.";

    }


    applyLevelUI();
}


function showGameOver() {

    running = false;

    cancelAnimationFrame(
        animationId
    );


    saveBestScore();


    gameOverlay.style.display =
        "flex";


    overlayLabel.textContent =
        "RUN OVER";


    overlayTitle.innerHTML =
        `SCORE ${Math.floor(score)}`;


    overlayText.innerHTML =
        `BEST ${getBestScore()}<br>One more run?`;


    startButton.textContent =
        currentLevel === 3
            ? `▶ TRY AS ${selectedAnimal}`
            : "▶ TRY AGAIN";


    gameMessage.textContent =
        "You almost had it.";


    applyLevelUI();
}


/* ---------------------------------------------------------
   LEVEL COMPLETE
   --------------------------------------------------------- */

function completeLevel() {

    if (gameComplete) {
        return;
    }


    gameComplete = true;

    running = false;


    cancelAnimationFrame(
        animationId
    );


    saveBestScore();


    const nextLevel =
        currentLevel + 1;


    if (nextLevel <= 10) {

        unlockLevel(
            nextLevel
        );


        overlayLabel.textContent =
            "LEVEL COMPLETE";


        overlayTitle.innerHTML =
            `LEVEL ${currentLevel}`;


        overlayText.innerHTML =
            `
            TARGET REACHED<br>
            LEVEL ${nextLevel} UNLOCKED
            `;


        startButton.textContent =
            `▶ START LEVEL ${nextLevel}`;


        gameMessage.textContent =
            `Nice run. Level ${nextLevel} is ready.`;

    } else {

        overlayLabel.textContent =
            "YOU DID IT";


        overlayTitle.innerHTML =
            "1M<span>.</span>";


        overlayText.innerHTML =
            `
            ALL 10 LEVELS COMPLETE<br>
            FINAL SCORE ${Math.floor(score)}
            `;


        startButton.textContent =
            "▶ PLAY AGAIN";


        gameMessage.textContent =
            "You completed the full run.";
    }


    gameOverlay.style.display =
        "flex";
}


/* ---------------------------------------------------------
   START GAME
   --------------------------------------------------------- */

function startGame() {

    /*
       If the previous screen was a completed level,
       move automatically to the next level.
    */

    if (
        gameComplete &&
        currentLevel < 10
    ) {

        currentLevel++;

        gameComplete = false;
    }


    score = 0;

    elapsed = 0;

    multiplier = 1;

    strikes =
        LEVELS[currentLevel].strikes
            ? 3
            : 0;


    obstacles = [];

    particles = [];

    flash = 0;

    shake = 0;

    obstacleTimer = 0;

    obstacleInterval =
        850;


    playerLane = 1;

    playerX =
        laneCenters[playerLane];


    playerY =
        420;


    running = true;

    gameComplete = false;

    gameOverlay.style.display =
        "none";


    scoreElement.textContent =
        "0";


    multiplierDisplay.textContent =
        "×1";


    strikeDisplay.textContent =
        `STRIKES ×${strikes}`;


    applyLevelUI();


    gameMessage.textContent =
        currentLevel >= 4
            ? "Dodge or strike."
            : "Dodge and survive.";


    lastTime =
        performance.now();


    cancelAnimationFrame(
        animationId
    );


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* ---------------------------------------------------------
   PLAYER MOVEMENT
   --------------------------------------------------------- */

function moveLeft() {

    if (!running) {
        return;
    }


    playerLane =
        Math.max(
            0,
            playerLane - 1
        );


    playerX =
        laneCenters[playerLane];
}


function moveRight() {

    if (!running) {
        return;
    }


    playerLane =
        Math.min(
            2,
            playerLane + 1
        );


    playerX =
        laneCenters[playerLane];
}


/* ---------------------------------------------------------
   ATTACK
   --------------------------------------------------------- */

function attack() {

    const config =
        LEVELS[currentLevel];


    if (
        !running ||
        !config.strikes ||
        strikes <= 0
    ) {
        return;
    }


    let target = null;

    let closestDistance =
        Infinity;


    for (const obstacle of obstacles) {

        if (
            obstacle.lane !==
            playerLane
        ) {
            continue;
        }


        const distance =
            Math.abs(
                obstacle.y -
                playerY
            );


        if (
            obstacle.y > 250 &&
            obstacle.y < 430 &&
            distance < closestDistance
        ) {

            closestDistance =
                distance;

            target =
                obstacle;
        }
    }


    if (!target) {

        gameMessage.textContent =
            "No target.";

        return;
    }


    const perfect =
        closestDistance < 48;


    createParticles(
        target.x,
        target.y,
        config.obstacle
    );


    obstacles =
        obstacles.filter(
            item =>
                item !== target
        );


    strikes--;


    score +=
        perfect
            ? 70 * multiplier
            : 40 * multiplier;


    flash =
        perfect
            ? 0.35
            : 0.18;


    shake =
        perfect
            ? 8
            : 4;


    strikeDisplay.textContent =
        `STRIKES ×${strikes}`;


    scoreElement.textContent =
        Math.floor(score);


    gameMessage.textContent =
        perfect
            ? "PERFECT HIT! +70"
            : "OBSTACLE DESTROYED! +40";


    checkLevelComplete();
}


/* ---------------------------------------------------------
   SPAWN OBSTACLES
   --------------------------------------------------------- */

function spawnObstacle() {

    const config =
        LEVELS[currentLevel];


    const lane =
        Math.floor(
            Math.random() * 3
        );


    const size =
        24 +
        Math.random() * 12;


    obstacles.push({

        lane,

        x: laneCenters[lane],

        y: -40,

        size,

        type:
            Math.floor(
                Math.random() * 4
            ),

        rotation:
            Math.random() * Math.PI,

        color:
            Math.random() > 0.5
                ? config.obstacle
                : config.obstacle2
    });
}


/* ---------------------------------------------------------
   COLLISION
   --------------------------------------------------------- */

function checkCollision(
    obstacle
) {

    const ox =
        obstacle.x;

    const oy =
        obstacle.y;

    const half =
        obstacle.size / 2;


    const playerLeft =
        playerX -
        playerWidth / 2;


    const playerRight =
        playerX +
        playerWidth / 2;


    const playerTop =
        playerY -
        playerHeight / 2;


    const playerBottom =
        playerY +
        playerHeight / 2;


    const obstacleLeft =
        ox - half;


    const obstacleRight =
        ox + half;


    const obstacleTop =
        oy - half;


    const obstacleBottom =
        oy + half;


    return (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        playerBottom > obstacleTop &&
        playerTop < obstacleBottom
    );
}


/* ---------------------------------------------------------
   SCORE / LEVEL PROGRESSION
   --------------------------------------------------------- */

function updateScore(delta) {

    score +=
        delta *
        0.06 *
        multiplier;


    multiplier =
        Math.min(
            9,
            1 +
            Math.floor(
                elapsed / 10
            )
        );


    scoreElement.textContent =
        Math.floor(score);


    multiplierDisplay.textContent =
        `×${multiplier}`;


    checkLevelComplete();
}


function checkLevelComplete() {

    const target =
        LEVELS[currentLevel].target;


    if (
        running &&
        score >= target
    ) {

        completeLevel();
    }
}


/* ---------------------------------------------------------
   PARTICLES
   --------------------------------------------------------- */

function createParticles(
    x,
    y,
    color
) {

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        particles.push({

            x,

            y,

            vx:
                (Math.random() - 0.5)
                * 180,

            vy:
                (Math.random() - 0.5)
                * 180,

            life:
                0.4 +
                Math.random() * 0.35,

            size:
                2 +
                Math.random() * 4,

            color
        });
    }
}


function updateParticles(delta) {

    for (
        const particle
        of particles
    ) {

        particle.x +=
            particle.vx *
            delta;

        particle.y +=
            particle.vy *
            delta;

        particle.vy +=
            240 *
            delta;

        particle.life -=
            delta;
    }


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );
}


/* ---------------------------------------------------------
   DRAW BACKGROUND
   --------------------------------------------------------- */

function drawBackground() {

    const config =
        LEVELS[currentLevel];


    ctx.fillStyle =
        config.bg;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* grid */

    ctx.strokeStyle =
        config.grid;

    ctx.lineWidth =
        1;


    for (
        let x = 0;
        x <= canvas.width;
        x += 45
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y <= canvas.height;
        y += 45
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    /* horizon glow */

    const gradient =
        ctx.createLinearGradient(
            0,
            240,
            0,
            490
        );


    gradient.addColorStop(
        0,
        "rgba(255,255,255,0)"
    );


    gradient.addColorStop(
        1,
        "rgba(255,255,255,0.035)"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


/* ---------------------------------------------------------
   DRAW OBSTACLE
   --------------------------------------------------------- */

function drawObstacle(
    obstacle
) {

    const config =
        LEVELS[currentLevel];


    ctx.save();


    ctx.translate(
        obstacle.x,
        obstacle.y
    );


    ctx.rotate(
        obstacle.rotation
    );


    ctx.fillStyle =
        obstacle.color;


    ctx.shadowBlur =
        14;


    ctx.shadowColor =
        obstacle.color;


    const s =
        obstacle.size;


    /*
       World-specific shapes
    */

    if (
        currentLevel === 4
    ) {

        /* coral */

        ctx.beginPath();

        ctx.moveTo(
            -s / 2,
            s / 2
        );

        ctx.lineTo(
            -s / 4,
            -s / 3
        );

        ctx.lineTo(
            0,
            -s / 2
        );

        ctx.lineTo(
            s / 4,
            -s / 4
        );

        ctx.lineTo(
            s / 2,
            s / 2
        );

        ctx.closePath();

        ctx.fill();

    } else if (
        currentLevel === 5
    ) {

        /* sand pile */

        ctx.beginPath();

        ctx.moveTo(
            -s / 2,
            s / 2
        );

        ctx.quadraticCurveTo(
            0,
            -s / 2,
            s / 2,
            s / 2
        );

        ctx.closePath();

        ctx.fill();

    } else if (
        currentLevel === 6
    ) {

        /* tree */

        ctx.fillRect(
            -5,
            -s / 2,
            10,
            s
        );

        ctx.beginPath();

        ctx.moveTo(
            0,
            -s
        );

        ctx.lineTo(
            -s / 2,
            0
        );

        ctx.lineTo(
            s / 2,
            0
        );

        ctx.closePath();

        ctx.fill();

    } else if (
        currentLevel === 7
    ) {

        /* comet */

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            s / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha =
            0.35;

        ctx.fillRect(
            -s * 1.7,
            -4,
            s * 1.5,
            8
        );

    } else if (
        currentLevel === 8
    ) {

        /* iceberg */

        ctx.beginPath();

        ctx.moveTo(
            -s / 2,
            s / 2
        );

        ctx.lineTo(
            -s / 3,
            -s / 3
        );

        ctx.lineTo(
            0,
            -s / 2
        );

        ctx.lineTo(
            s / 3,
            -s / 3
        );

        ctx.lineTo(
            s / 2,
            s / 2
        );

        ctx.closePath();

        ctx.fill();

    } else if (
        currentLevel === 9
    ) {

        /* fruit */

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            s / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#6de05f";

        ctx.fillRect(
            -2,
            -s / 2 - 5,
            4,
            8
        );

    } else {

        /* classic diamond */

        ctx.beginPath();

        ctx.moveTo(
            0,
            -s / 2
        );

        ctx.lineTo(
            s / 2,
            0
        );

        ctx.lineTo(
            0,
            s / 2
        );

        ctx.lineTo(
            -s / 2,
            0
        );

        ctx.closePath();

        ctx.fill();
    }


    ctx.restore();
}


/* ---------------------------------------------------------
   DRAW ANIMAL
   --------------------------------------------------------- */

function drawAnimal() {

    const x =
        playerX;

    const y =
        playerY;


    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.shadowBlur =
        18;

    ctx.shadowColor =
        "#55e8ff";


    /* body */

    ctx.fillStyle =
        "#ffd95a";


    ctx.beginPath();

    ctx.roundRect(
        -13,
        -10,
        26,
        25,
        10
    );

    ctx.fill();


    /* animal variations */

    if (
        selectedAnimal === "BUNNY"
    ) {

        ctx.fillRect(
            -10,
            -28,
            7,
            18
        );

        ctx.fillRect(
            3,
            -28,
            7,
            18
        );

    } else if (
        selectedAnimal === "FOX"
    ) {

        ctx.fillStyle =
            "#ff9b4a";

        ctx.beginPath();

        ctx.moveTo(
            -14,
            -10
        );

        ctx.lineTo(
            -9,
            -27
        );

        ctx.lineTo(
            0,
            -17
        );

        ctx.lineTo(
            9,
            -27
        );

        ctx.lineTo(
            14,
            -10
        );

        ctx.closePath();

        ctx.fill();

    } else if (
        selectedAnimal === "CAT"
    ) {

        ctx.fillStyle =
            "#d5d9e5";

        ctx.beginPath();

        ctx.moveTo(
            -14,
            -9
        );

        ctx.lineTo(
            -10,
            -27
        );

        ctx.lineTo(
            -1,
            -17
        );

        ctx.lineTo(
            10,
            -27
        );

        ctx.lineTo(
            14,
            -9
        );

        ctx.closePath();

        ctx.fill();

    } else if (
        selectedAnimal === "PANDA"
    ) {

        ctx.fillStyle =
            "#ffffff";

        ctx.beginPath();

        ctx.arc(
            0,
            -8,
            15,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#111";

        ctx.beginPath();

        ctx.arc(
            -6,
            -9,
            4,
            0,
            Math.PI * 2
        );

        ctx.arc(
            6,
            -9,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* eyes */

    ctx.shadowBlur =
        0;

    ctx.fillStyle =
        "#111";


    ctx.beginPath();

    ctx.arc(
        -5,
        -5,
        2,
        0,
        Math.PI * 2
    );

    ctx.arc(
        5,
        -5,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();
}


/* ---------------------------------------------------------
   DRAW STANDARD PLAYER
   --------------------------------------------------------- */

function drawPlayer() {

    if (
        currentLevel === 3
    ) {

        drawAnimal();

        return;
    }


    const config =
        LEVELS[currentLevel];


    ctx.save();


    ctx.translate(
        playerX,
        playerY
    );


    ctx.shadowBlur =
        18;

    ctx.shadowColor =
        config.player;


    ctx.fillStyle =
        config.player;


    ctx.beginPath();

    ctx.roundRect(
        -14,
        -17,
        28,
        34,
        8
    );

    ctx.fill();


    ctx.shadowBlur =
        0;


    ctx.fillStyle =
        "#061018";


    ctx.fillRect(
        -6,
        -5,
        4,
        4
    );

    ctx.fillRect(
        2,
        -5,
        4,
        4
    );


    ctx.restore();
}


/* ---------------------------------------------------------
   DRAW PARTICLES
   --------------------------------------------------------- */

function drawParticles() {

    for (
        const particle
        of particles
    ) {

        ctx.globalAlpha =
            Math.max(
                0,
                particle.life
            );


        ctx.fillStyle =
            particle.color;


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.globalAlpha =
        1;
}


/* ---------------------------------------------------------
   UPDATE
   --------------------------------------------------------- */

function update(delta) {

    elapsed +=
        delta;


    const config =
        LEVELS[currentLevel];


    const progress =
        Math.min(
            1,
            elapsed / 60
        );


    const speed =
        config.startSpeed +
        (
            config.maxSpeed -
            config.startSpeed
        ) *
        progress;


    obstacleTimer +=
        delta * 1000;


    /*
       Obstacles become more frequent
       as the run progresses.
    */

    obstacleInterval =
        Math.max(
            390,
            850 -
            elapsed * 7
        );


    if (
        obstacleTimer >=
        obstacleInterval
    ) {

        obstacleTimer = 0;

        spawnObstacle();
    }


    for (
        const obstacle
        of obstacles
    ) {

        obstacle.y +=
            speed *
            delta;


        obstacle.rotation +=
            delta * 1.4;


        if (
            checkCollision(
                obstacle
            )
        ) {

            createParticles(
                playerX,
                playerY,
                config.obstacle
            );


            flash =
                0.4;

            shake =
                10;


            showGameOver();

            return;
        }
    }


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.y <
                canvas.height + 60
        );


    updateParticles(
        delta
    );


    updateScore(
        delta
    );


    flash =
        Math.max(
            0,
            flash - delta
        );


    shake =
        Math.max(
            0,
            shake - delta * 20
        );
}


/* ---------------------------------------------------------
   DRAW
   --------------------------------------------------------- */

function draw() {

    drawBackground();


    ctx.save();


    if (shake > 0) {

        ctx.translate(
            (Math.random() - 0.5) *
            shake,

            (Math.random() - 0.5) *
            shake
        );
    }


    for (
        const obstacle
        of obstacles
    ) {

        drawObstacle(
            obstacle
        );
    }


    drawPlayer();

    drawParticles();


    ctx.restore();


    if (flash > 0) {

        ctx.fillStyle =
            `rgba(255,255,255,${flash})`;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}


/* ---------------------------------------------------------
   GAME LOOP
   --------------------------------------------------------- */

function gameLoop(
    timestamp
) {

    if (!running) {

        draw();

        return;
    }


    const delta =
        Math.min(
            0.033,
            (
                timestamp -
                lastTime
            ) / 1000
        );


    lastTime =
        timestamp;


    update(
        delta
    );


    draw();


    if (running) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );
    }
}


/* ---------------------------------------------------------
   ANIMAL SELECTION
   --------------------------------------------------------- */

animalButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                selectedAnimal =
                    button.dataset.animal;


                animalButtons.forEach(
                    other =>
                        other.classList.remove(
                            "selected"
                        )
                );


                button.classList.add(
                    "selected"
                );


                if (
                    currentLevel === 3
                ) {

                    startButton.textContent =
                        `▶ START AS ${selectedAnimal}`;
                }
            }
        );
    }
);


/* ---------------------------------------------------------
   START BUTTON
   --------------------------------------------------------- */

startButton.addEventListener(
    "click",
    () => {

        /*
           If Level 10 is complete,
           return to Level 1 for replay.
        */

        if (
            gameComplete &&
            currentLevel === 10
        ) {

            currentLevel = 1;

            unlockLevel(10);

            history.replaceState(
                null,
                "",
                "?level=1"
            );
        }


        /*
           Completed levels automatically
           move to the next level.
        */

        startGame();
    }
);


/* ---------------------------------------------------------
   MOVEMENT BUTTONS
   --------------------------------------------------------- */

leftButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        moveLeft();
    }
);


rightButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        moveRight();
    }
);


/* ---------------------------------------------------------
   ATTACK BUTTON
   --------------------------------------------------------- */

attackButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        attack();
    }
);


/* ---------------------------------------------------------
   KEYBOARD
   --------------------------------------------------------- */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            moveLeft();
        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            moveRight();
        }


        if (
            event.key === " " ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            attack();
        }
    }
);


/* ---------------------------------------------------------
   SWIPE
   --------------------------------------------------------- */

let touchStartX = 0;

let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];


        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;
    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];


        const dx =
            touch.clientX -
            touchStartX;


        const dy =
            touch.clientY -
            touchStartY;


        if (
            Math.abs(dx) <
            25
        ) {
            return;
        }


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (dx < 0) {

                moveLeft();

            } else {

                moveRight();
            }
        }
    },
    {
        passive: true
    }
);


/* ---------------------------------------------------------
   INITIALISE
   --------------------------------------------------------- */

getUnlockedLevel();

applyLevelUI();

showStartScreen();

draw();
