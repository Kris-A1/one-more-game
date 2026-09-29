/* =========================================================
   1M. — COMPLETE GAME
   10 LEVELS
   ========================================================= */


/* ---------------------------------------------------------
   LEVEL DATA
   --------------------------------------------------------- */

const LEVELS = {

    1: {
        name: "NEON RUN",
        theme: "neon",
        target: 350,
        startSpeed: 175,
        maxSpeed: 195,
        strikes: false,
        obstacle: "barrier"
    },

    2: {
        name: "NEON RUSH",
        theme: "rush",
        target: 500,
        startSpeed: 200,
        maxSpeed: 225,
        strikes: false,
        obstacle: "diamond"
    },

    3: {
        name: "ANIMAL RUN",
        theme: "animal",
        target: 650,
        startSpeed: 215,
        maxSpeed: 245,
        strikes: false,
        obstacle: "rock"
    },

    4: {
        name: "OCEAN RUN",
        theme: "ocean",
        target: 800,
        startSpeed: 225,
        maxSpeed: 260,
        strikes: true,
        obstacle: "coral"
    },

    5: {
        name: "DESERT RUN",
        theme: "desert",
        target: 950,
        startSpeed: 235,
        maxSpeed: 275,
        strikes: true,
        obstacle: "sand"
    },

    6: {
        name: "FOREST RUN",
        theme: "forest",
        target: 1100,
        startSpeed: 245,
        maxSpeed: 290,
        strikes: true,
        obstacle: "tree"
    },

    7: {
        name: "SPACE RUN",
        theme: "space",
        target: 1250,
        startSpeed: 255,
        maxSpeed: 305,
        strikes: true,
        obstacle: "comet"
    },

    8: {
        name: "ICE RUN",
        theme: "ice",
        target: 1400,
        startSpeed: 265,
        maxSpeed: 320,
        strikes: true,
        obstacle: "iceberg"
    },

    9: {
        name: "FRUIT RUN",
        theme: "fruit",
        target: 1550,
        startSpeed: 275,
        maxSpeed: 335,
        strikes: true,
        obstacle: "fruit"
    },

    10: {
        name: "CHAOS RUN",
        theme: "chaos",
        target: 1800,
        startSpeed: 290,
        maxSpeed: 355,
        strikes: true,
        obstacle: "chaos"
    }

};


/* ---------------------------------------------------------
   URL / LEVEL
   --------------------------------------------------------- */

const params =
    new URLSearchParams(
        window.location.search
    );


let level =
    Math.min(
        10,
        Math.max(
            1,
            Number(
                params.get("level")
            ) || 1
        )
    );


const currentLevel =
    LEVELS[level];


/* ---------------------------------------------------------
   DOM
   --------------------------------------------------------- */

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");


const scoreElement =
    document.getElementById("score");

const bestElement =
    document.getElementById("bestScore");

const levelSubtitle =
    document.getElementById(
        "levelSubtitle"
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

const startButton =
    document.getElementById(
        "startButton"
    );

const nextButton =
    document.getElementById(
        "nextButton"
    );

const retryButton =
    document.getElementById(
        "retryButton"
    );

const animalChooser =
    document.getElementById(
        "animalChooser"
    );

const animalButtons =
    document.querySelectorAll(
        ".animal-button"
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

const controls =
    document.getElementById(
        "controls"
    );

const gameMessage =
    document.getElementById(
        "gameMessage"
    );

const attackInstruction =
    document.getElementById(
        "attackInstruction"
    );


/* ---------------------------------------------------------
   GAME STATE
   --------------------------------------------------------- */

const WIDTH = 360;
const HEIGHT = 490;

let running = false;

let gameOver = false;

let completed = false;

let score = 0;

let bestScore =
    Number(
        localStorage.getItem(
            `1M_best_${level}`
        )
    ) || 0;

let strikes =
    currentLevel.strikes
        ? 3
        : 0;

let multiplier = 1;

let elapsed = 0;

let speed =
    currentLevel.startSpeed;

let lastTime = 0;

let spawnTimer = 0;

let particles = [];

let obstacles = [];


/* ---------------------------------------------------------
   PLAYER
   --------------------------------------------------------- */

const player = {

    x: WIDTH / 2,

    y: HEIGHT - 82,

    width: 30,

    height: 30,

    moveSpeed: 280

};


let selectedAnimal =
    localStorage.getItem(
        "1M_selected_animal"
    ) || "BUNNY";


/* ---------------------------------------------------------
   UNLOCKED LEVEL
   --------------------------------------------------------- */

let unlockedLevel =
    Number(
        localStorage.getItem(
            "1M_unlocked_level"
        )
    ) || 1;


/*
   For testing:
   ?level=2, ?level=3, etc.
   will still open the requested level.

   Normal progression is controlled by
   the NEXT LEVEL button and saved progress.
*/


/* ---------------------------------------------------------
   THEME COLORS
   --------------------------------------------------------- */

const THEMES = {

    neon: {
        background: "#071426",
        road: "#0a1830",
        grid: "#15385b",
        player: "#55e8ff",
        obstacle: "#ff3f91",
        accent: "#55e8ff"
    },

    rush: {
        background: "#180a26",
        road: "#210d34",
        grid: "#4d205f",
        player: "#55b9ff",
        obstacle: "#ff405d",
        accent: "#ff4d8d"
    },

    animal: {
        background: "#0a1b11",
        road: "#0d2416",
        grid: "#214b2e",
        player: "#ffe45c",
        obstacle: "#9b6035",
        accent: "#9dff77"
    },

    ocean: {
        background: "#041b29",
        road: "#06283a",
        grid: "#0b526b",
        player: "#65f2ff",
        obstacle: "#ff6b9d",
        accent: "#38d9ff"
    },

    desert: {
        background: "#291609",
        road: "#3b1e0c",
        grid: "#75401d",
        player: "#fff0a5",
        obstacle: "#e79a45",
        accent: "#ffbd55"
    },

    forest: {
        background: "#07180d",
        road: "#0c2614",
        grid: "#1d4a28",
        player: "#8cff7a",
        obstacle: "#75502e",
        accent: "#6aff8a"
    },

    space: {
        background: "#050516",
        road: "#080824",
        grid: "#25255b",
        player: "#ffffff",
        obstacle: "#dca7ff",
        accent: "#bd8cff"
    },

    ice: {
        background: "#061b27",
        road: "#082b3d",
        grid: "#1a5870",
        player: "#ffffff",
        obstacle: "#79dcff",
        accent: "#8ee9ff"
    },

    fruit: {
        background: "#210817",
        road: "#300b1f",
        grid: "#5e1838",
        player: "#ffe86a",
        obstacle: "#ff537c",
        accent: "#ffcb55"
    },

    chaos: {
        background: "#120714",
        road: "#21091f",
        grid: "#572047",
        player: "#ffffff",
        obstacle: "#ff4f75",
        accent: "#55e8ff"
    }

};


/* ---------------------------------------------------------
   INITIAL UI
   --------------------------------------------------------- */

function setupUI() {

    const theme =
        THEMES[currentLevel.theme];

    document.body.style.background =
        theme.background;

    levelSubtitle.textContent =
        `LEVEL ${level} · ${currentLevel.name}`;

    bestElement.textContent =
        Math.floor(bestScore);

    scoreElement.textContent =
        "0";

    multiplierDisplay.textContent =
        "×1";

    if (currentLevel.strikes) {

        strikeDisplay.style.display =
            "block";

        attackButton.style.display =
            "flex";

        attackInstruction.style.display =
            "inline";

    } else {

        strikeDisplay.style.display =
            "none";

        attackButton.style.display =
            "none";

        attackInstruction.style.display =
            "none";

    }


    if (level === 3) {

        animalChooser.style.display =
            "block";

        updateAnimalSelection();

    } else {

        animalChooser.style.display =
            "none";

    }


    if (level >= 4) {

        overlayText.innerHTML =
            `Dodge. Destroy.<br>Reach ${currentLevel.target}.`;

    } else {

        overlayText.innerHTML =
            `Dodge. Survive.<br>Reach ${currentLevel.target}.`;

    }


    startButton.style.display =
        "block";

    nextButton.style.display =
        "none";

    retryButton.style.display =
        "none";


    if (level === 3) {

        startButton.textContent =
            `▶ START AS ${selectedAnimal}`;

    } else {

        startButton.textContent =
            "▶ START RUN";

    }


    gameMessage.textContent =
        `Target ${currentLevel.target}`;

}


setupUI();


/* ---------------------------------------------------------
   ANIMAL SELECTION
   --------------------------------------------------------- */

function updateAnimalSelection() {

    animalButtons.forEach(
        button => {

            const animal =
                button.dataset.animal;

            button.classList.toggle(
                "selected",
                animal === selectedAnimal
            );

        }
    );


    startButton.textContent =
        `▶ START AS ${selectedAnimal}`;


    localStorage.setItem(
        "1M_selected_animal",
        selectedAnimal
    );

}


animalButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                selectedAnimal =
                    button.dataset.animal;

                updateAnimalSelection();

            }
        );

    }
);


/* ---------------------------------------------------------
   START GAME
   --------------------------------------------------------- */

function startGame() {

    running = true;

    gameOver = false;

    completed = false;

    score = 0;

    multiplier = 1;

    elapsed = 0;

    speed =
        currentLevel.startSpeed;

    spawnTimer = 0;

    particles = [];

    obstacles = [];

    strikes =
        currentLevel.strikes
            ? 3
            : 0;


    player.x =
        WIDTH / 2;


    scoreElement.textContent =
        "0";

    multiplierDisplay.textContent =
        "×1";


    if (currentLevel.strikes) {

        strikeDisplay.style.display =
            "block";

        strikeDisplay.textContent =
            "💥 ×3";

    }


    gameOverlay.style.display =
        "none";


    controls.style.display =
        "grid";


    gameMessage.textContent =
        level >= 4
            ? "Dodge or destroy."
            : "Stay alive.";


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


/* ---------------------------------------------------------
   START BUTTON
   --------------------------------------------------------- */

startButton.addEventListener(
    "click",
    startGame
);


/* ---------------------------------------------------------
   RETRY
   --------------------------------------------------------- */

retryButton.addEventListener(
    "click",
    () => {

        setupUI();

        startGame();

    }
);


/* ---------------------------------------------------------
   NEXT LEVEL
   --------------------------------------------------------- */

nextButton.addEventListener(
    "click",
    () => {

        if (level >= 10) {

            level = 1;

            unlockedLevel = 1;

            localStorage.setItem(
                "1M_unlocked_level",
                "1"
            );

        } else {

            level++;

        }


        window.location.href =
            `?level=${level}`;

    }
);


/* ---------------------------------------------------------
   MOVEMENT
   --------------------------------------------------------- */

function moveLeft() {

    if (!running) return;

    player.x -=
        player.moveSpeed * 0.08;

    clampPlayer();

}


function moveRight() {

    if (!running) return;

    player.x +=
        player.moveSpeed * 0.08;

    clampPlayer();

}


function clampPlayer() {

    const half =
        player.width / 2;

    player.x =
        Math.max(
            half + 12,
            Math.min(
                WIDTH - half - 12,
                player.x
            )
        );

}


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
   KEYBOARD
   --------------------------------------------------------- */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            moveLeft();

        }


        if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

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


canvas.addEventListener(
    "touchstart",
    event => {

        if (!event.touches.length) return;

        touchStartX =
            event.touches[0].clientX;

    },
    { passive: true }
);


canvas.addEventListener(
    "touchend",
    event => {

        if (!event.changedTouches.length)
            return;

        const endX =
            event.changedTouches[0].clientX;

        const delta =
            endX - touchStartX;


        if (Math.abs(delta) < 20)
            return;


        if (delta < 0) {

            moveLeft();

        } else {

            moveRight();

        }

    },
    { passive: true }
);


/* ---------------------------------------------------------
   ATTACK
   --------------------------------------------------------- */

attackButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        attack();

    }
);


function attack() {

    if (!running) return;

    if (!currentLevel.strikes)
        return;

    if (strikes <= 0) {

        gameMessage.textContent =
            "No strikes left — dodge!";

        return;

    }


    let target = null;

    let bestDistance =
        Infinity;


    obstacles.forEach(
        obstacle => {

            const vertical =
                obstacle.y > 220 &&
                obstacle.y < 420;

            const horizontal =
                Math.abs(
                    obstacle.x - player.x
                ) < 65;


            if (
                vertical &&
                horizontal
            ) {

                const distance =
                    Math.abs(
                        obstacle.y -
                        player.y
                    );


                if (
                    distance <
                    bestDistance
                ) {

                    bestDistance =
                        distance;

                    target =
                        obstacle;

                }

            }

        }
    );


    if (!target) {

        gameMessage.textContent =
            "Miss!";

        return;

    }


    const perfect =
        bestDistance < 55;


    target.dead = true;

    strikes--;


    score +=
        perfect
            ? 70
            : 40;


    createExplosion(
        target.x,
        target.y,
        currentLevel.theme
    );


    gameMessage.textContent =
        perfect
            ? "PERFECT HIT! +70"
            : "DESTROYED! +40";


    updateStrikeUI();

}


function updateStrikeUI() {

    strikeDisplay.textContent =
        `💥 ×${strikes}`;

}


/* ---------------------------------------------------------
   GAME LOOP
   --------------------------------------------------------- */

function gameLoop(timestamp) {

    if (!running)
        return;


    const delta =
        Math.min(
            0.035,
            (timestamp - lastTime) / 1000
        );


    lastTime =
        timestamp;


    elapsed += delta;


    score +=
        delta *
        10 *
        multiplier;


    multiplier =
        Math.min(
            5,
            1 +
            Math.floor(
                elapsed / 10
            )
        );


    speed =
        Math.min(
            currentLevel.maxSpeed,
            currentLevel.startSpeed +
            elapsed * 1.4
        );


    scoreElement.textContent =
        Math.floor(score);


    multiplierDisplay.textContent =
        `×${multiplier}`;


    spawnTimer += delta;


    const spawnInterval =
        Math.max(
            0.42,
            0.92 -
            elapsed * 0.008
        );


    if (
        spawnTimer >=
        spawnInterval
    ) {

        spawnTimer = 0;

        spawnObstacle();

    }


    updateObstacles(delta);

    updateParticles(delta);

    draw();


    if (
        score >=
        currentLevel.target
    ) {

        completeLevel();

        return;

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* ---------------------------------------------------------
   SPAWN OBSTACLE
   --------------------------------------------------------- */

function spawnObstacle() {

    let type =
        currentLevel.obstacle;


    if (
        level === 10
    ) {

        const types = [
            "barrier",
            "diamond",
            "rock",
            "coral",
            "comet"
        ];

        type =
            types[
                Math.floor(
                    Math.random() *
                    types.length
                )
            ];

    }


    obstacles.push({

        x:
            28 +
            Math.random() *
            (WIDTH - 56),

        y:
            -35,

        width:
            30 +
            Math.random() * 20,

        height:
            28 +
            Math.random() * 22,

        type,

        dead: false

    });

}


/* ---------------------------------------------------------
   UPDATE OBSTACLES
   --------------------------------------------------------- */

function updateObstacles(delta) {

    obstacles.forEach(
        obstacle => {

            obstacle.y +=
                speed * delta;

        }
    );


    obstacles =
        obstacles.filter(
            obstacle => {

                if (
                    obstacle.dead
                ) {

                    return false;

                }


                if (
                    obstacle.y >
                    HEIGHT + 60
                ) {

                    return false;

                }


                if (
                    checkCollision(
                        obstacle
                    )
                ) {

                    endGame();

                    return false;

                }


                return true;

            }
        );

}


/* ---------------------------------------------------------
   COLLISION
   --------------------------------------------------------- */

function checkCollision(
    obstacle
) {

    const px =
        player.x;

    const py =
        player.y;


    const halfPlayer =
        player.width / 2;


    return (

        obstacle.x -
            obstacle.width / 2
            <
            px + halfPlayer

        &&

        obstacle.x +
            obstacle.width / 2
            >
            px - halfPlayer

        &&

        obstacle.y +
            obstacle.height / 2
            >
            py - player.height / 2

        &&

        obstacle.y -
            obstacle.height / 2
            <
            py + player.height / 2

    );

}


/* ---------------------------------------------------------
   GAME OVER
   --------------------------------------------------------- */

function endGame() {

    if (!running)
        return;


    running = false;

    gameOver = true;


    if (
        score >
        bestScore
    ) {

        bestScore =
            Math.floor(score);

        localStorage.setItem(
            `1M_best_${level}`,
            bestScore
        );

        bestElement.textContent =
            bestScore;

    }


    gameOverlay.style.display =
        "flex";


    overlayLabel.textContent =
        "RUN OVER";


    overlayTitle.innerHTML =
        "ONE MORE";


    overlayText.innerHTML =
        `SCORE ${Math.floor(score)}<br>` +
        `TARGET ${currentLevel.target}`;


    startButton.style.display =
        "none";

    nextButton.style.display =
        "none";

    retryButton.style.display =
        "inline-block";


    gameMessage.textContent =
        "So close. One more run.";


    draw();

}


/* ---------------------------------------------------------
   LEVEL COMPLETE
   --------------------------------------------------------- */

function completeLevel() {

    if (!running)
        return;


    running = false;

    completed = true;


    if (
        score >
        bestScore
    ) {

        bestScore =
            Math.floor(score);

        localStorage.setItem(
            `1M_best_${level}`,
            bestScore
        );

        bestElement.textContent =
            bestScore;

    }


    if (
        level <
        10
    ) {

        unlockedLevel =
            Math.max(
                unlockedLevel,
                level + 1
            );

        localStorage.setItem(
            "1M_unlocked_level",
            unlockedLevel
        );

    }


    gameOverlay.style.display =
        "flex";


    overlayLabel.textContent =
        "LEVEL COMPLETE";


    if (level < 10) {

        overlayTitle.innerHTML =
            `LEVEL ${level}<span>✓</span>`;


        overlayText.innerHTML =
            `TARGET ${currentLevel.target}<br>` +
            `LEVEL ${level + 1} UNLOCKED`;

        nextButton.style.display =
            "block";

        nextButton.textContent =
            `▶ LEVEL ${level + 1}`;

    } else {

        overlayTitle.innerHTML =
            `1M<span>!</span>`;


        overlayText.innerHTML =
            "YOU BEAT ALL 10 LEVELS";


        nextButton.style.display =
            "block";

        nextButton.textContent =
            "▶ PLAY AGAIN";

    }


    startButton.style.display =
        "none";

    retryButton.style.display =
        "none";


    gameMessage.textContent =
        "New level unlocked!";

    draw();

}


/* ---------------------------------------------------------
   PARTICLES
   --------------------------------------------------------- */

function createExplosion(
    x,
    y,
    themeName
) {

    const theme =
        THEMES[themeName];


    for (
        let i = 0;
        i < 14;
        i++
    ) {

        particles.push({

            x,
            y,

            vx:
                (Math.random() - .5)
                * 180,

            vy:
                (Math.random() - .5)
                * 180,

            life: .55,

            size:
                2 +
                Math.random() * 4,

            color:
                theme.accent

        });

    }

}


function updateParticles(
    delta
) {

    particles.forEach(
        particle => {

            particle.x +=
                particle.vx *
                delta;

            particle.y +=
                particle.vy *
                delta;

            particle.life -=
                delta;

        }
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );

}


/* ---------------------------------------------------------
   DRAW
   --------------------------------------------------------- */

function draw() {

    const theme =
        THEMES[currentLevel.theme];


    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    /* BACKGROUND */

    ctx.fillStyle =
        theme.background;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    drawWorld(
        theme
    );


    obstacles.forEach(
        drawObstacle
    );


    drawPlayer(
        theme
    );


    particles.forEach(
        drawParticle
    );

}


/* ---------------------------------------------------------
   WORLD
   --------------------------------------------------------- */

function drawWorld(
    theme
) {

    /* ROAD */

    ctx.fillStyle =
        theme.road;

    ctx.fillRect(
        35,
        0,
        WIDTH - 70,
        HEIGHT
    );


    /* GRID */

    ctx.strokeStyle =
        theme.grid;

    ctx.lineWidth = 1;


    const offset =
        (elapsed * speed) % 40;


    for (
        let y = -40 + offset;
        y < HEIGHT;
        y += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            35,
            y
        );

        ctx.lineTo(
            WIDTH - 35,
            y
        );

        ctx.stroke();

    }


    /* SIDE LINES */

    ctx.strokeStyle =
        theme.accent;

    ctx.globalAlpha =
        .16;

    ctx.beginPath();

    ctx.moveTo(
        35,
        0
    );

    ctx.lineTo(
        35,
        HEIGHT
    );

    ctx.moveTo(
        WIDTH - 35,
        0
    );

    ctx.lineTo(
        WIDTH - 35,
        HEIGHT
    );

    ctx.stroke();

    ctx.globalAlpha = 1;


    /* SPECIAL WORLD DETAILS */

    if (
        level === 4
    ) {

        drawOceanDetails();

    }


    if (
        level === 5
    ) {

        drawDesertDetails();

    }


    if (
        level === 6
    ) {

        drawForestDetails();

    }


    if (
        level === 7
    ) {

        drawSpaceDetails();

    }


    if (
        level === 8
    ) {

        drawIceDetails();

    }


    if (
        level === 9
    ) {

        drawFruitDetails();

    }

}


/* ---------------------------------------------------------
   WORLD DETAILS
   --------------------------------------------------------- */

function drawOceanDetails() {

    ctx.globalAlpha = .18;

    ctx.strokeStyle =
        "#38d9ff";

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const y =
            90 +
            i * 85;

        ctx.beginPath();

        ctx.arc(
            65,
            y,
            20,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

    ctx.globalAlpha = 1;

}


function drawDesertDetails() {

    ctx.globalAlpha = .20;

    ctx.fillStyle =
        "#ffbd55";

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        ctx.beginPath();

        ctx.arc(
            55,
            80 + i * 90,
            18,
            0,
            Math.PI
        );

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


function drawForestDetails() {

    ctx.globalAlpha = .18;

    ctx.fillStyle =
        "#6aff8a";

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const y =
            70 +
            i * 110;

        ctx.beginPath();

        ctx.moveTo(
            58,
            y + 25
        );

        ctx.lineTo(
            75,
            y - 10
        );

        ctx.lineTo(
            92,
            y + 25
        );

        ctx.closePath();

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


function drawSpaceDetails() {

    ctx.fillStyle =
        "rgba(255,255,255,.5)";

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const x =
            (i * 73) % WIDTH;

        const y =
            (i * 137) % HEIGHT;

        ctx.fillRect(
            x,
            y,
            1.5,
            1.5
        );

    }

}


function drawIceDetails() {

    ctx.globalAlpha = .20;

    ctx.fillStyle =
        "#8ee9ff";

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const y =
            80 +
            i * 100;

        ctx.beginPath();

        ctx.moveTo(
            WIDTH - 88,
            y + 30
        );

        ctx.lineTo(
            WIDTH - 70,
            y - 5
        );

        ctx.lineTo(
            WIDTH - 50,
            y + 30
        );

        ctx.closePath();

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


function drawFruitDetails() {

    ctx.globalAlpha = .16;

    ctx.fillStyle =
        "#ffcb55";

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.beginPath();

        ctx.arc(
            60,
            70 + i * 100,
            13,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}


/* ---------------------------------------------------------
   DRAW OBSTACLE
   --------------------------------------------------------- */

function drawObstacle(
    obstacle
) {

    if (obstacle.dead)
        return;


    const theme =
        THEMES[currentLevel.theme];


    ctx.save();

    ctx.translate(
        obstacle.x,
        obstacle.y
    );


    ctx.fillStyle =
        theme.obstacle;

    ctx.strokeStyle =
        "rgba(255,255,255,.22)";

    ctx.lineWidth = 2;


    switch (
        obstacle.type
    ) {

        case "diamond":

            ctx.rotate(
                Math.PI / 4
            );

            ctx.fillRect(
                -17,
                -17,
                34,
                34
            );

            break;


        case "rock":

            ctx.beginPath();

            ctx.moveTo(
                -22,
                15
            );

            ctx.lineTo(
                -17,
                -14
            );

            ctx.lineTo(
                3,
                -22
            );

            ctx.lineTo(
                22,
                -4
            );

            ctx.lineTo(
                18,
                17
            );

            ctx.closePath();

            ctx.fill();

            break;


        case "coral":

            ctx.beginPath();

            ctx.moveTo(
                -20,
                18
            );

            ctx.lineTo(
                -14,
                -12
            );

            ctx.lineTo(
                -5,
                2
            );

            ctx.lineTo(
                2,
                -22
            );

            ctx.lineTo(
                9,
                1
            );

            ctx.lineTo(
                20,
                -13
            );

            ctx.lineTo(
                19,
                20
            );

            ctx.closePath();

            ctx.fill();

            break;


        case "sand":

            ctx.beginPath();

            ctx.arc(
                0,
                10,
                24,
                Math.PI,
                0
            );

            ctx.fill();

            break;


        case "tree":

            ctx.fillRect(
                -6,
                0,
                12,
                25
            );

            ctx.beginPath();

            ctx.moveTo(
                -25,
                8
            );

            ctx.lineTo(
                0,
                -28
            );

            ctx.lineTo(
                25,
                8
            );

            ctx.closePath();

            ctx.fill();

            break;


        case "comet":

            ctx.beginPath();

            ctx.arc(
                8,
                0,
                17,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.globalAlpha = .3;

            ctx.beginPath();

            ctx.moveTo(
                -5,
                -7
            );

            ctx.lineTo(
                -34,
                -18
            );

            ctx.lineTo(
                -12,
                0
            );

            ctx.closePath();

            ctx.fill();

            ctx.globalAlpha = 1;

            break;


        case "iceberg":

            ctx.beginPath();

            ctx.moveTo(
                -24,
                20
            );

            ctx.lineTo(
                -12,
                -18
            );

            ctx.lineTo(
                2,
                -30
            );

            ctx.lineTo(
                20,
                10
            );

            ctx.lineTo(
                17,
                20
            );

            ctx.closePath();

            ctx.fill();

            break;


        case "fruit":

            ctx.beginPath();

            ctx.arc(
                0,
                2,
                19,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.stroke();

            ctx.strokeStyle =
                "#65ff77";

            ctx.beginPath();

            ctx.moveTo(
                3,
                -17
            );

            ctx.lineTo(
                12,
                -27
            );

            ctx.stroke();

            break;


        default:

            ctx.fillRect(
                -22,
                -18,
                44,
                36
            );

            ctx.strokeRect(
                -22,
                -18,
                44,
                36
            );

    }


    ctx.restore();

}


/* ---------------------------------------------------------
   DRAW PLAYER
   --------------------------------------------------------- */

function drawPlayer(
    theme
) {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    if (
        level === 3
    ) {

        drawAnimal();

    } else {

        ctx.fillStyle =
            theme.player;

        ctx.shadowColor =
            theme.accent;

        ctx.shadowBlur =
            18;

        ctx.beginPath();

        ctx.roundRect(
            -15,
            -15,
            30,
            30,
            9
        );

        ctx.fill();

        ctx.shadowBlur = 0;


        ctx.fillStyle =
            "#071018";

        ctx.beginPath();

        ctx.arc(
            -6,
            -3,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.arc(
            6,
            -3,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.restore();

}


/* ---------------------------------------------------------
   ANIMAL DRAWING
   --------------------------------------------------------- */

function drawAnimal() {

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.font =
        "30px Arial";

    ctx.fillText(
        animalEmoji(
            selectedAnimal
        ),
        0,
        1
    );

}


function animalEmoji(
    animal
) {

    if (
        animal === "FOX"
    )
        return "🦊";


    if (
        animal === "CAT"
    )
        return "🐱";


    if (
        animal === "PANDA"
    )
        return "🐼";


    return "🐰";

}


/* ---------------------------------------------------------
   PARTICLE DRAW
   --------------------------------------------------------- */

function drawParticle(
    particle
) {

    ctx.save();

    ctx.globalAlpha =
        Math.max(
            0,
            particle.life
        );

    ctx.fillStyle =
        particle.color;

    ctx.fillRect(
        particle.x,
        particle.y,
        particle.size,
        particle.size
    );

    ctx.restore();

}


/* ---------------------------------------------------------
   SAVE BEST
   --------------------------------------------------------- */

window.addEventListener(
    "beforeunload",
    () => {

        if (
            score >
            bestScore
        ) {

            localStorage.setItem(
                `1M_best_${level}`,
                Math.floor(score)
            );

        }

    }
);


/* ---------------------------------------------------------
   INITIAL DRAW
   --------------------------------------------------------- */

draw();
