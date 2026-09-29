/* =========================================================
   1M — COMPLETE GAME
   LEVELS 1–10
   Built directly from the original Level 1–3 game
   ========================================================= */


/* ---------------------------------------------------------
   LEVEL
   --------------------------------------------------------- */

const params = new URLSearchParams(window.location.search);

let level = Number(params.get("level")) || 1;

if (level < 1 || level > 10) {
    level = 1;
}


/* ---------------------------------------------------------
   LEVEL SETTINGS
   --------------------------------------------------------- */

const LEVELS = {

    1: {
        name: "NEON RUN",
        label: "LEVEL 1",

        background: "#080d22",
        playerColor: "#42f5ff",
        obstacleColor: "#ff3b81",

        speed: 175,
        maxSpeed: 245,

        attack: false,
        strikes: 0,

        world: "neon"
    },

    2: {
        name: "NEON RUSH",
        label: "LEVEL 2",

        background: "#12081e",
        playerColor: "#64a8ff",
        obstacleColor: "#ff4d65",

        speed: 205,
        maxSpeed: 275,

        attack: true,
        strikes: 3,

        world: "neonRush"
    },

    3: {
        name: "ANIMAL RUN",
        label: "LEVEL 3",

        background: "#0a1912",
        playerColor: "#ffe66b",
        obstacleColor: "#b77b46",

        speed: 220,
        maxSpeed: 295,

        attack: true,
        strikes: 3,

        world: "animal"
    },

    4: {
        name: "ANIMAL RUSH",
        label: "LEVEL 4",

        background: "#07170d",
        playerColor: "#ffe66b",
        obstacleColor: "#805331",

        speed: 245,
        maxSpeed: 325,

        attack: true,
        strikes: 6,

        world: "animalRush"
    },

    5: {
        name: "FRUIT RUN",
        label: "LEVEL 5",

        background: "#1a0e0b",
        playerColor: "#ff7b5c",
        obstacleColor: "#d44738",

        speed: 255,
        maxSpeed: 340,

        attack: true,
        strikes: 6,

        world: "fruit"
    },

    6: {
        name: "OCEAN",
        label: "LEVEL 6",

        background: "#061722",
        playerColor: "#62e6ff",
        obstacleColor: "#ef6e8d",

        speed: 265,
        maxSpeed: 350,

        attack: true,
        strikes: 6,

        world: "ocean"
    },

    7: {
        name: "DESERT",
        label: "LEVEL 7",

        background: "#21150a",
        playerColor: "#ffd45c",
        obstacleColor: "#b97942",

        speed: 275,
        maxSpeed: 360,

        attack: true,
        strikes: 6,

        world: "desert"
    },

    8: {
        name: "FOREST",
        label: "LEVEL 8",

        background: "#07180e",
        playerColor: "#8cff8c",
        obstacleColor: "#5e3e28",

        speed: 285,
        maxSpeed: 370,

        attack: true,
        strikes: 6,

        world: "forest"
    },

    9: {
        name: "SPACE",
        label: "LEVEL 9",

        background: "#050714",
        playerColor: "#d5d8ff",
        obstacleColor: "#a98cff",

        speed: 295,
        maxSpeed: 385,

        attack: true,
        strikes: 6,

        world: "space"
    },

    10: {
        name: "ANTARCTICA",
        label: "LEVEL 10",

        background: "#07131d",
        playerColor: "#bdf5ff",
        obstacleColor: "#8ed9ee",

        speed: 305,
        maxSpeed: 400,

        attack: true,
        strikes: 6,

        world: "ice"
    }

};

const settings = LEVELS[level];


/* ---------------------------------------------------------
   DOM
   --------------------------------------------------------- */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const multiplierEl = document.getElementById("multiplier");

const strikesEl = document.getElementById("strikes");
const attackCountEl = document.getElementById("attackCount");

const overlay = document.getElementById("overlay");
const overlayLabel = document.getElementById("overlayLabel");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const startButton = document.getElementById("startButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const attackButton = document.getElementById("attackButton");

const strikeDisplay = document.getElementById("strikeDisplay");
const attackInstruction = document.getElementById("attackInstruction");

const animalChooser = document.getElementById("animalChooser");

const animalCards = document.querySelectorAll(".animal-card, .animal-button");

const levelNameEl = document.getElementById("levelName");
const gameMessage = document.getElementById("gameMessage");


/* ---------------------------------------------------------
   CANVAS
   --------------------------------------------------------- */

const canvasWidth = 360;
const canvasHeight = 560;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


/* ---------------------------------------------------------
   CHARACTER SETS
   --------------------------------------------------------- */

const CHARACTER_SETS = {

    animals: [
        {
            name: "BUNNY",
            emoji: "🐰",
            type: "bunny"
        },
        {
            name: "FOX",
            emoji: "🦊",
            type: "fox"
        },
        {
            name: "CAT",
            emoji: "🐱",
            type: "cat"
        },
        {
            name: "PANDA",
            emoji: "🐼",
            type: "panda"
        }
    ],

    fruit: [
        {
            name: "WATERMELON",
            emoji: "🍉",
            type: "watermelon"
        },
        {
            name: "PINEAPPLE",
            emoji: "🍍",
            type: "pineapple"
        },
        {
            name: "STRAWBERRY",
            emoji: "🍓",
            type: "strawberry"
        },
        {
            name: "PEACH",
            emoji: "🍑",
            type: "peach"
        }
    ],

    ocean: [
        {
            name: "FISH",
            emoji: "🐟",
            type: "fish"
        },
        {
            name: "FISH",
            emoji: "🐠",
            type: "fish2"
        },
        {
            name: "FISH",
            emoji: "🐡",
            type: "fish3"
        },
        {
            name: "FISH",
            emoji: "🐟",
            type: "fish"
        }
    ],

    desert: [
        {
            name: "SUN",
            emoji: "☀️",
            type: "sun"
        },
        {
            name: "SUN",
            emoji: "☀️",
            type: "sun"
        },
        {
            name: "SUN",
            emoji: "☀️",
            type: "sun"
        },
        {
            name: "SUN",
            emoji: "☀️",
            type: "sun"
        }
    ],

    forest: [
        {
            name: "FLOWER",
            emoji: "🌸",
            type: "flower"
        },
        {
            name: "FLOWER",
            emoji: "🌼",
            type: "flower2"
        },
        {
            name: "FLOWER",
            emoji: "🌻",
            type: "flower3"
        },
        {
            name: "FLOWER",
            emoji: "🌺",
            type: "flower4"
        }
    ],

    space: [
        {
            name: "ROBOT",
            emoji: "🤖",
            type: "robot"
        },
        {
            name: "ROBOT",
            emoji: "🤖",
            type: "robot"
        },
        {
            name: "ROBOT",
            emoji: "🤖",
            type: "robot"
        },
        {
            name: "ROBOT",
            emoji: "🤖",
            type: "robot"
        }
    ],

    ice: [
        {
            name: "ICE CUBE",
            emoji: "🧊",
            type: "icecube"
        },
        {
            name: "ICE CUBE",
            emoji: "🧊",
            type: "icecube"
        },
        {
            name: "ICE CUBE",
            emoji: "🧊",
            type: "icecube"
        },
        {
            name: "ICE CUBE",
            emoji: "🧊",
            type: "icecube"
        }
    ]

};


/* ---------------------------------------------------------
   GAME STATE
   --------------------------------------------------------- */

let running = false;
let gameOver = false;

let score = 0;

let bestScore =
    Number(
        localStorage.getItem(`1M_best_level_${level}`)
    ) || 0;

let multiplier = 1;

let strikes = settings.strikes;

let selectedCharacter = 0;

let lane = 1;
let targetLane = 1;

let obstacles = [];
let particles = [];

let spawnTimer = 0;

let lastTime = 0;
let elapsed = 0;

let currentSpeed = settings.speed;

let animationId = null;

let touchStartX = 0;
let touchStartY = 0;


/* ---------------------------------------------------------
   LEVEL CHARACTER INFORMATION
   --------------------------------------------------------- */

function getCharacterSet() {

    if (level === 3 || level === 4) {
        return CHARACTER_SETS.animals;
    }

    if (level === 5) {
        return CHARACTER_SETS.fruit;
    }

    if (level === 6) {
        return CHARACTER_SETS.ocean;
    }

    if (level === 7) {
        return CHARACTER_SETS.desert;
    }

    if (level === 8) {
        return CHARACTER_SETS.forest;
    }

    if (level === 9) {
        return CHARACTER_SETS.space;
    }

    if (level === 10) {
        return CHARACTER_SETS.ice;
    }

    return [];
}


function getSelectedCharacter() {

    const set = getCharacterSet();

    return set[selectedCharacter] || set[0] || null;
}


/* ---------------------------------------------------------
   RESIZE
   --------------------------------------------------------- */

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const ratio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
}


/* ---------------------------------------------------------
   CHARACTER CARD UI
   --------------------------------------------------------- */

function setupCharacterCards() {

    const set = getCharacterSet();

    if (!set.length) {
        if (animalChooser) {
            animalChooser.classList.add("hidden");
        }

        return;
    }

    if (animalChooser) {
        animalChooser.classList.remove("hidden");
    }

    animalCards.forEach((card, index) => {

        const character = set[index];

        if (!character) {
            card.style.display = "none";
            return;
        }

        card.style.display = "";

        const emoji =
            card.querySelector(".animal-emoji");

        const name =
            card.querySelector(".animal-name");

        if (emoji) {
            emoji.textContent = character.emoji;
        }

        if (name) {
            name.textContent = character.name;
        }

        card.classList.toggle(
            "selected",
            index === selectedCharacter
        );
    });
}


/* ---------------------------------------------------------
   LEVEL UI
   --------------------------------------------------------- */

function setupLevelUI() {

    if (levelNameEl) {
        levelNameEl.textContent =
            `${settings.label} · ${settings.name}`;
    }

    setupCharacterCards();

    if (level === 1) {

        overlayLabel.textContent = "LEVEL 1";

        overlayTitle.innerHTML =
            `NEON <span>RUN</span>`;

        overlayText.innerHTML =
            "Dodge everything.<br>How long can you survive?";

        if (animalChooser) {
            animalChooser.classList.add("hidden");
        }

        strikeDisplay.classList.add("hidden");
        attackButton.classList.add("hidden");
        attackInstruction.classList.add("hidden");

        startButton.textContent = "▶ START";

    }

    else if (level === 2) {

        overlayLabel.textContent = "LEVEL 2";

        overlayTitle.innerHTML =
            `NEON <span>RUSH</span>`;

        overlayText.innerHTML =
            "Dodge or destroy obstacles.<br>You have 3 strikes.";

        if (animalChooser) {
            animalChooser.classList.add("hidden");
        }

        strikeDisplay.classList.remove("hidden");
        attackButton.classList.remove("hidden");
        attackInstruction.classList.remove("hidden");

        startButton.textContent = "▶ START";

    }

    else if (level === 3) {

        overlayLabel.textContent = "LEVEL 3";

        overlayTitle.innerHTML =
            `ANIMAL <span>RUN</span>`;

        overlayText.innerHTML =
            "Choose your runner.<br>Dodge or destroy obstacles.";

        strikeDisplay.classList.remove("hidden");
        attackButton.classList.remove("hidden");
        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            `▶ START AS ${getSelectedCharacter().name}`;

    }

    else if (level === 4) {

        overlayLabel.textContent = "LEVEL 4";

        overlayTitle.innerHTML =
            `ANIMAL <span>RUSH</span>`;

        overlayText.innerHTML =
            "Choose your runner.<br>Faster. Harder. 6 strikes.";

        strikeDisplay.classList.remove("hidden");
        attackButton.classList.remove("hidden");
        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            `▶ START AS ${getSelectedCharacter().name}`;

    }

    else {

        strikeDisplay.classList.remove("hidden");
        attackButton.classList.remove("hidden");
        attackInstruction.classList.remove("hidden");

        const character =
            getSelectedCharacter();

        startButton.textContent =
            `▶ START AS ${character ? character.name : "RUNNER"}`;

        overlayLabel.textContent =
            settings.label;

        overlayTitle.innerHTML =
            `${settings.name.split(" ")[0]} <span>${settings.name.split(" ").slice(1).join(" ")}</span>`;

        const descriptions = {

            5:
                "Choose your fruit.<br>Dodge or destroy obstacles.",

            6:
                "Choose your fish.<br>Dodge coral and ocean hazards.",

            7:
                "Choose your sun.<br>Dodge sand piles and desert hazards.",

            8:
                "Choose your flower.<br>Dodge trees and forest hazards.",

            9:
                "Choose your robot.<br>Dodge comets and space hazards.",

            10:
                "Choose your ice cube.<br>Dodge icebergs and snow hazards."

        };

        overlayText.innerHTML =
            descriptions[level] || "Dodge or destroy obstacles.";
    }

    updateStrikeUI();
}


/* ---------------------------------------------------------
   STRIKE UI
   --------------------------------------------------------- */

function updateStrikeUI() {

    if (!settings.attack) {
        return;
    }

    if (strikesEl) {
        strikesEl.textContent =
            `STRIKES ${strikes}`;
    }

    if (attackCountEl) {
        attackCountEl.textContent =
            strikes;
    }

    attackButton.style.opacity =
        strikes > 0 ? "1" : "0.4";
}


/* ---------------------------------------------------------
   CHARACTER SELECTION
   --------------------------------------------------------- */

animalCards.forEach((card, index) => {

    card.addEventListener("click", () => {

        if (running) {
            return;
        }

        const set = getCharacterSet();

        if (!set[index]) {
            return;
        }

        selectedCharacter = index;

        setupCharacterCards();

        if (level >= 3) {

            startButton.textContent =
                `▶ START AS ${getSelectedCharacter().name}`;
        }

        draw();
    });

});


/* ---------------------------------------------------------
   START
   --------------------------------------------------------- */

function startGame() {

    running = true;
    gameOver = false;

    score = 0;

    multiplier = 1;

    strikes = settings.strikes;

    lane = 1;
    targetLane = 1;

    obstacles = [];
    particles = [];

    spawnTimer = 0;

    elapsed = 0;

    currentSpeed = settings.speed;

    gameMessage.textContent = "";

    overlay.classList.add("hidden");

    updateStrikeUI();
    updateHUD();

    lastTime = performance.now();

    cancelAnimationFrame(animationId);

    animationId =
        requestAnimationFrame(gameLoop);
}


/* ---------------------------------------------------------
   GAME LOOP
   --------------------------------------------------------- */

function gameLoop(time) {

    if (!running) {
        return;
    }

    let delta =
        (time - lastTime) / 1000;

    lastTime = time;

    delta =
        Math.min(delta, 0.035);

    update(delta);
    draw();

    animationId =
        requestAnimationFrame(gameLoop);
}


/* ---------------------------------------------------------
   UPDATE
   --------------------------------------------------------- */

function update(delta) {

    elapsed += delta;

    const difficulty =
        Math.min(elapsed / 70, 1);

    currentSpeed =
        settings.speed +
        (settings.maxSpeed - settings.speed) *
        difficulty;

    multiplier =
        Math.min(
            1 + Math.floor(elapsed / 10),
            9
        );

    score +=
        delta *
        10 *
        multiplier;

    lane +=
        (targetLane - lane) *
        Math.min(delta * 14, 1);


    /* -----------------------------------------------------
       SPAWNING
       ----------------------------------------------------- */

    spawnTimer -= delta;

    let spawnInterval =
        Math.max(
            0.38,
            0.88 - elapsed * 0.004
        );

    if (level >= 4) {
        spawnInterval -=
            Math.min(
                0.08,
                elapsed * 0.0008
            );
    }

    if (spawnTimer <= 0) {

        spawnObstacle();

        spawnTimer =
            Math.max(
                0.34,
                spawnInterval
            );
    }


    /* -----------------------------------------------------
       OBSTACLES
       ----------------------------------------------------- */

    for (let i = obstacles.length - 1; i >= 0; i--) {

        const obstacle =
            obstacles[i];

        obstacle.y +=
            currentSpeed *
            delta;

        obstacle.rotation +=
            obstacle.rotationSpeed *
            delta;

        if (
            obstacle.y >
            canvasHeight + 70
        ) {

            obstacles.splice(i, 1);

            score +=
                10 * multiplier;

            continue;
        }


        /* -------------------------------------------------
           COLLISION
           ------------------------------------------------- */

        if (
            obstacle.y >
            canvasHeight - 155 &&
            obstacle.y <
            canvasHeight - 65
        ) {

            const distance =
                Math.abs(
                    obstacle.lane - lane
                );

            if (distance < 0.34) {

                endGame();

                return;
            }
        }
    }


    /* -----------------------------------------------------
       PARTICLES
       ----------------------------------------------------- */

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            particles[i];

        particle.x +=
            particle.vx * delta;

        particle.y +=
            particle.vy * delta;

        particle.life -= delta;

        particle.vy +=
            100 * delta;

        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }

    updateHUD();
}


/* ---------------------------------------------------------
   SPAWN OBSTACLE
   --------------------------------------------------------- */

function spawnObstacle() {

    const firstLane =
        Math.floor(
            Math.random() * 3
        );

    obstacles.push(
        createObstacle(
            firstLane,
            -45,
            false
        )
    );


    /* -----------------------------------------------------
       SECOND OBSTACLE
       ----------------------------------------------------- */

    if (
        elapsed > 18 &&
        Math.random() < (
            level >= 4 ? 0.22 : 0.16
        )
    ) {

        let secondLane =
            Math.floor(
                Math.random() * 3
            );

        if (secondLane === firstLane) {
            secondLane =
                (secondLane + 1) % 3;
        }

        obstacles.push(
            createObstacle(
                secondLane,
                -130,
                true
            )
        );
    }
}


/* ---------------------------------------------------------
   CREATE OBSTACLE
   --------------------------------------------------------- */

function createObstacle(
    obstacleLane,
    y,
    secondary
) {

    let kind = "normal";

    if (level === 6) {
        kind =
            Math.random() < 0.55
                ? "coral"
                : "bubble";
    }

    else if (level === 7) {
        kind =
            Math.random() < 0.55
                ? "sand"
                : "cactus";
    }

    else if (level === 8) {
        kind =
            Math.random() < 0.55
                ? "tree"
                : "log";
    }

    else if (level === 9) {
        kind =
            Math.random() < 0.65
                ? "comet"
                : "asteroid";
    }

    else if (level === 10) {
        kind =
            Math.random() < 0.6
                ? "iceberg"
                : "snow";
    }

    else if (level === 5) {
        kind =
            Math.random() < 0.55
                ? "fruit"
                : "basket";
    }

    else if (
        level === 3 ||
        level === 4
    ) {
        kind =
            Math.random() < 0.55
                ? "rock"
                : "root";
    }

    return {

        lane: obstacleLane,

        y,

        size:
            30 +
            Math.random() * 8,

        kind,

        rotation:
            (Math.random() - 0.5) * 0.25,

        rotationSpeed:
            (Math.random() - 0.5) * 1.2,

        secondary
    };
}


/* ---------------------------------------------------------
   ATTACK
   --------------------------------------------------------- */

function attack() {

    if (!running) {
        return;
    }

    if (!settings.attack) {
        return;
    }

    if (strikes <= 0) {
        gameMessage.textContent =
            "NO STRIKES LEFT";

        return;
    }


    let closestIndex = -1;
    let closestDistance = Infinity;

    for (
        let i = 0;
        i < obstacles.length;
        i++
    ) {

        const obstacle =
            obstacles[i];

        if (
            obstacle.lane !==
            Math.round(lane)
        ) {
            continue;
        }

        if (
            obstacle.y <
            canvasHeight - 330 ||
            obstacle.y >
            canvasHeight - 45
        ) {
            continue;
        }

        const distance =
            Math.abs(
                obstacle.y -
                (canvasHeight - 112)
            );

        if (
            distance <
            closestDistance
        ) {

            closestDistance =
                distance;

            closestIndex = i;
        }
    }


    if (closestIndex === -1) {

        gameMessage.textContent =
            "MISS";

        return;
    }


    const obstacle =
        obstacles[closestIndex];

    const perfect =
        closestDistance < 65;


    createExplosion(
        laneX(obstacle.lane),
        obstacle.y
    );

    obstacles.splice(
        closestIndex,
        1
    );

    strikes--;

    score +=
        (
            perfect
                ? 70
                : 40
        ) * multiplier;

    gameMessage.textContent =
        perfect
            ? "PERFECT!"
            : "DESTROYED";

    updateStrikeUI();
}


/* ---------------------------------------------------------
   MOVEMENT
   --------------------------------------------------------- */

function moveLeft() {

    if (!running) {
        return;
    }

    targetLane =
        Math.max(
            0,
            targetLane - 1
        );
}


function moveRight() {

    if (!running) {
        return;
    }

    targetLane =
        Math.min(
            2,
            targetLane + 1
        );
}


/* ---------------------------------------------------------
   END GAME
   --------------------------------------------------------- */

function endGame() {

    running = false;
    gameOver = true;

    const finalScore =
        Math.floor(score);

    if (
        finalScore >
        bestScore
    ) {

        bestScore =
            finalScore;

        localStorage.setItem(
            `1M_best_level_${level}`,
            bestScore
        );
    }

    createExplosion(
        laneX(Math.round(lane)),
        canvasHeight - 112
    );

    overlay.classList.remove("hidden");

    overlayLabel.textContent =
        settings.label;

    overlayTitle.innerHTML =
        `RUN <span>OVER</span>`;

    overlayText.innerHTML =
        `SCORE ${finalScore}<br>BEST ${bestScore}<br><br>Ready for one more?`;

    if (level >= 3) {

        startButton.textContent =
            `▶ RUN AS ${getSelectedCharacter().name}`;

    } else {

        startButton.textContent =
            "▶ TRY AGAIN";
    }

    gameMessage.textContent =
        "ONE MORE.";

    updateHUD();
}


/* ---------------------------------------------------------
   HUD
   --------------------------------------------------------- */

function updateHUD() {

    if (scoreEl) {
        scoreEl.textContent =
            Math.floor(score);
    }

    if (bestScoreEl) {
        bestScoreEl.textContent =
            bestScore;
    }

    if (multiplierEl) {
        multiplierEl.textContent =
            `x${multiplier}`;
    }

    updateStrikeUI();
}


/* ---------------------------------------------------------
   DRAW
   --------------------------------------------------------- */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    ctx.fillStyle =
        settings.background;

    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    drawBackground();
    drawTrack();

    for (
        const obstacle of obstacles
    ) {

        drawObstacle(obstacle);
    }

    drawPlayer();

    for (
        const particle of particles
    ) {

        drawParticle(particle);
    }
}


/* ---------------------------------------------------------
   BACKGROUND
   --------------------------------------------------------- */

function drawBackground() {

    if (
        level === 1 ||
        level === 2
    ) {

        drawNeonBackground(
            level === 2
        );

        return;
    }


    if (
        level === 3 ||
        level === 4
    ) {

        drawAnimalBackground(
            level === 4
        );

        return;
    }


    if (level === 5) {

        drawFruitBackground();

        return;
    }


    if (level === 6) {

        drawOceanBackground();

        return;
    }


    if (level === 7) {

        drawDesertBackground();

        return;
    }


    if (level === 8) {

        drawForestBackground();

        return;
    }


    if (level === 9) {

        drawSpaceBackground();

        return;
    }


    if (level === 10) {

        drawIceBackground();

        return;
    }
}


/* ---------------------------------------------------------
   NEON BACKGROUND
   --------------------------------------------------------- */

function drawNeonBackground(fast) {

    const count =
        fast ? 22 : 18;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const x =
            (i * 43) % canvasWidth;

        const width =
            25 +
            ((i * 17) % 28);

        const height =
            80 +
            ((i * 31) % 130);

        const y =
            canvasHeight - 205 - height;

        ctx.fillStyle =
            fast
                ? "rgba(69,20,77,0.28)"
                : "rgba(19,43,79,0.30)";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        if (i % 2 === 0) {

            ctx.fillStyle =
                "rgba(85,232,255,0.10)";

            for (
                let wy = y + 14;
                wy < y + height - 10;
                wy += 18
            ) {

                ctx.fillRect(
                    x + 7,
                    wy,
                    4,
                    5
                );
            }
        }
    }
}


/* ---------------------------------------------------------
   ANIMAL BACKGROUND
   --------------------------------------------------------- */

function drawAnimalBackground(rush) {

    const treeCount =
        rush ? 15 : 12;

    for (
        let i = 0;
        i < treeCount;
        i++
    ) {

        const x =
            (i * 67 + 10) %
            canvasWidth;

        const height =
            95 +
            ((i * 23) % 85);

        const y =
            canvasHeight -
            205 -
            height;

        drawTree(
            x,
            y,
            0.8 +
            ((i % 3) * 0.12)
        );
    }


    if (rush) {

        ctx.strokeStyle =
            "rgba(64,130,66,0.22)";

        ctx.lineWidth = 3;

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const x =
                15 + i * 58;

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.quadraticCurveTo(
                x - 20,
                70,
                x + 10,
                145
            );

            ctx.stroke();
        }
    }
}


/* ---------------------------------------------------------
   FRUIT BACKGROUND
   --------------------------------------------------------- */

function drawFruitBackground() {

    for (
        let i = 0;
        i < 13;
        i++
    ) {

        const x =
            (i * 58) % canvasWidth;

        const y =
            55 +
            ((i * 47) % 145);

        ctx.fillStyle =
            i % 2 === 0
                ? "rgba(255,112,76,0.12)"
                : "rgba(255,213,77,0.10)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            8 + (i % 5),
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.fillStyle =
        "rgba(73,145,57,0.20)";

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const x =
            i * 40;

        ctx.fillRect(
            x,
            canvasHeight - 245,
            32,
            40
        );
    }
}


/* ---------------------------------------------------------
   OCEAN BACKGROUND
   --------------------------------------------------------- */

function drawOceanBackground() {

    ctx.fillStyle =
        "rgba(55,180,205,0.10)";

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const y =
            75 + i * 42;

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.quadraticCurveTo(
            90,
            y - 20,
            180,
            y
        );

        ctx.quadraticCurveTo(
            270,
            y + 20,
            360,
            y
        );

        ctx.lineTo(
            360,
            y + 4
        );

        ctx.lineTo(
            0,
            y + 4
        );

        ctx.fill();
    }

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const x =
            (i * 61) % canvasWidth;

        const y =
            130 +
            ((i * 43) % 190);

        ctx.strokeStyle =
            "rgba(92,225,218,0.18)";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            8,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }
}


/* ---------------------------------------------------------
   DESERT BACKGROUND
   --------------------------------------------------------- */

function drawDesertBackground() {

    ctx.fillStyle =
        "rgba(255,211,92,0.09)";

    ctx.beginPath();

    ctx.arc(
        285,
        115,
        42,
        0,
        Math.PI * 2
    );

    ctx.fill();

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const x =
            i * 48;

        const y =
            220 +
            (i % 3) * 18;

        ctx.fillStyle =
            "rgba(176,112,55,0.25)";

        ctx.beginPath();

        ctx.ellipse(
            x + 20,
            y,
            50,
            14,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* ---------------------------------------------------------
   FOREST BACKGROUND
   --------------------------------------------------------- */

function drawForestBackground() {

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        const x =
            (i * 47) % canvasWidth;

        const y =
            80 +
            ((i * 29) % 150);

        ctx.fillStyle =
            "rgba(46,116,57,0.20)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            24 + (i % 4) * 5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const x =
            i * 34;

        ctx.strokeStyle =
            "rgba(92,151,74,0.24)";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x + 18,
            120
        );

        ctx.stroke();
    }
}


/* ---------------------------------------------------------
   SPACE BACKGROUND
   --------------------------------------------------------- */

function drawSpaceBackground() {

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        const x =
            (i * 83) % canvasWidth;

        const y =
            (i * 47) % 350;

        const size =
            i % 3 === 0 ? 2 : 1;

        ctx.fillStyle =
            "rgba(255,255,255,0.55)";

        ctx.fillRect(
            x,
            y,
            size,
            size
        );
    }

    ctx.strokeStyle =
        "rgba(125,113,255,0.13)";

    ctx.lineWidth = 1;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.beginPath();

        ctx.arc(
            180,
            160,
            70 + i * 35,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }
}


/* ---------------------------------------------------------
   ICE BACKGROUND
   --------------------------------------------------------- */

function drawIceBackground() {

    ctx.fillStyle =
        "rgba(171,236,255,0.08)";

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const x =
            i * 43;

        const height =
            80 +
            (i % 4) * 30;

        ctx.beginPath();

        ctx.moveTo(
            x,
            canvasHeight - 205
        );

        ctx.lineTo(
            x + 18,
            canvasHeight - 205 - height
        );

        ctx.lineTo(
            x + 35,
            canvasHeight - 205
        );

        ctx.closePath();

        ctx.fill();
    }

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const x =
            (i * 73) % canvasWidth;

        const y =
            (i * 39) % 320;

        ctx.fillStyle =
            "rgba(210,247,255,0.55)";

        ctx.fillRect(
            x,
            y,
            2,
            5
        );
    }
}


/* ---------------------------------------------------------
   TRACK
   --------------------------------------------------------- */

function drawTrack() {

    const trackTop =
        canvasHeight - 205;

    ctx.fillStyle =
        "rgba(255,255,255,0.025)";

    ctx.fillRect(
        0,
        trackTop,
        canvasWidth,
        205
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.07)";

    ctx.lineWidth = 2;

    ctx.setLineDash([12, 16]);

    ctx.beginPath();

    ctx.moveTo(
        canvasWidth / 3,
        trackTop
    );

    ctx.lineTo(
        canvasWidth / 3,
        canvasHeight
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        canvasWidth * 2 / 3,
        trackTop
    );

    ctx.lineTo(
        canvasWidth * 2 / 3,
        canvasHeight
    );

    ctx.stroke();

    ctx.setLineDash([]);
}


/* ---------------------------------------------------------
   PLAYER
   --------------------------------------------------------- */

function drawPlayer() {

    const x =
        laneX(lane);

    const y =
        canvasHeight - 112;


    if (level === 1 || level === 2) {

        drawRunner(
            x,
            y
        );

        return;
    }


    drawCharacter(
        x,
        y,
        getSelectedCharacter()
    );
}


/* ---------------------------------------------------------
   ORIGINAL RUNNER
   --------------------------------------------------------- */

function drawRunner(
    x,
    y
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.shadowColor =
        settings.playerColor;

    ctx.shadowBlur = 18;

    ctx.fillStyle =
        settings.playerColor;

    roundedRect(
        ctx,
        -19,
        -27,
        38,
        48,
        12
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#061018";

    ctx.beginPath();

    ctx.arc(
        -7,
        -12,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        7,
        -12,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        settings.playerColor;

    ctx.fillRect(
        -15,
        19,
        9,
        12
    );

    ctx.fillRect(
        6,
        19,
        9,
        12
    );

    ctx.restore();
}


/* ---------------------------------------------------------
   CHARACTER
   --------------------------------------------------------- */

function drawCharacter(
    x,
    y,
    character
) {

    if (!character) {
        drawRunner(x, y);
        return;
    }


    if (
        character.type === "bunny" ||
        character.type === "fox" ||
        character.type === "cat" ||
        character.type === "panda"
    ) {

        drawAnimal(
            x,
            y,
            character.type
        );

        return;
    }


    if (
        character.type === "watermelon" ||
        character.type === "pineapple" ||
        character.type === "strawberry" ||
        character.type === "peach"
    ) {

        drawFruitCharacter(
            x,
            y,
            character.type
        );

        return;
    }


    if (
        character.type === "fish" ||
        character.type === "fish2" ||
        character.type === "fish3"
    ) {

        drawFish(
            x,
            y,
            character.type
        );

        return;
    }


    if (character.type === "sun") {

        drawSun(
            x,
            y
        );

        return;
    }


    if (
        character.type.startsWith("flower")
    ) {

        drawFlower(
            x,
            y,
            character.type
        );

        return;
    }


    if (character.type === "robot") {

        drawRobot(
            x,
            y
        );

        return;
    }


    if (character.type === "icecube") {

        drawIceCube(
            x,
            y
        );

        return;
    }


    drawRunner(x, y);
}


/* ---------------------------------------------------------
   ANIMALS
   --------------------------------------------------------- */

function drawAnimal(
    x,
    y,
    type
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    let bodyColor =
        "#ffe66b";

    if (type === "fox") {
        bodyColor = "#ff9b45";
    }

    if (type === "cat") {
        bodyColor = "#c7c9d6";
    }

    if (type === "panda") {
        bodyColor = "#f4f4f4";
    }

    ctx.shadowColor =
        bodyColor;

    ctx.shadowBlur = 14;

    ctx.fillStyle =
        bodyColor;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;


    /* EARS */

    ctx.fillStyle =
        bodyColor;

    ctx.beginPath();

    if (type === "bunny") {

        ctx.ellipse(
            -10,
            -31,
            7,
            16,
            -0.12,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            10,
            -31,
            7,
            16,
            0.12,
            0,
            Math.PI * 2
        );

    } else {

        ctx.moveTo(
            -22,
            -15
        );

        ctx.lineTo(
            -12,
            -34
        );

        ctx.lineTo(
            -3,
            -19
        );

        ctx.closePath();

        ctx.moveTo(
            22,
            -15
        );

        ctx.lineTo(
            12,
            -34
        );

        ctx.lineTo(
            3,
            -19
        );

        ctx.closePath();
    }

    ctx.fill();


    /* PANDA PATCHES */

    if (type === "panda") {

        ctx.fillStyle =
            "#15171b";

        ctx.beginPath();

        ctx.ellipse(
            -9,
            -7,
            6,
            9,
            -0.25,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            9,
            -7,
            6,
            9,
            0.25,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* EYES */

    ctx.fillStyle =
        "#101318";

    ctx.beginPath();

    ctx.arc(
        -8,
        -6,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        8,
        -6,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* NOSE */

    ctx.beginPath();

    ctx.arc(
        0,
        3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* LEGS */

    ctx.fillStyle =
        bodyColor;

    ctx.fillRect(
        -16,
        19,
        9,
        12
    );

    ctx.fillRect(
        7,
        19,
        9,
        12
    );

    ctx.restore();
}


/* ---------------------------------------------------------
   FRUIT CHARACTERS
   --------------------------------------------------------- */

function drawFruitCharacter(
    x,
    y,
    type
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    let color =
        "#ff4e52";

    if (type === "watermelon") {
        color = "#ff5964";
    }

    if (type === "pineapple") {
        color = "#ffc94d";
    }

    if (type === "strawberry") {
        color = "#ff4f67";
    }

    if (type === "peach") {
        color = "#ffad78";
    }

    ctx.shadowColor =
        color;

    ctx.shadowBlur = 15;

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        24,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;


    if (type === "pineapple") {

        ctx.strokeStyle =
            "#66bd57";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(
            -8,
            -20
        );

        ctx.lineTo(
            -13,
            -32
        );

        ctx.moveTo(
            0,
            -21
        );

        ctx.lineTo(
            0,
            -35
        );

        ctx.moveTo(
            8,
            -20
        );

        ctx.lineTo(
            14,
            -31
        );

        ctx.stroke();
    }


    if (type === "watermelon") {

        ctx.strokeStyle =
            "#45a84c";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            19,
            0,
            Math.PI
        );

        ctx.stroke();
    }


    if (
        type === "strawberry"
    ) {

        ctx.fillStyle =
            "#5dbb55";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -19
        );

        ctx.lineTo(
            -10,
            -28
        );

        ctx.lineTo(
            -3,
            -13
        );

        ctx.lineTo(
            8,
            -27
        );

        ctx.lineTo(
            7,
            -14
        );

        ctx.closePath();

        ctx.fill();
    }


    ctx.fillStyle =
        "#15171b";

    ctx.beginPath();

    ctx.arc(
        -8,
        -4,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        8,
        -4,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        -13,
        19,
        9,
        10
    );

    ctx.fillRect(
        4,
        19,
        9,
        10
    );

    ctx.restore();
}


/* ---------------------------------------------------------
   FISH
   --------------------------------------------------------- */

function drawFish(
    x,
    y,
    type
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    let color =
        "#4fdcff";

    if (type === "fish2") {
        color = "#ff77b8";
    }

    if (type === "fish3") {
        color = "#ffc85a";
    }

    ctx.shadowColor =
        color;

    ctx.shadowBlur = 15;

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        25,
        18,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
        -20,
        0
    );

    ctx.lineTo(
        -34,
        -13
    );

    ctx.lineTo(
        -34,
        13
    );

    ctx.closePath();

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#10151b";

    ctx.beginPath();

    ctx.arc(
        11,
        -5,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        -13,
        18,
        8,
        9
    );

    ctx.fillRect(
        6,
        18,
        8,
        9
    );

    ctx.restore();
}


/* ---------------------------------------------------------
   SUN
   --------------------------------------------------------- */

function drawSun(
    x,
    y
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.strokeStyle =
        "#ffd84d";

    ctx.lineWidth = 5;

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            4;

        ctx.beginPath();

        ctx.moveTo(
            Math.cos(angle) * 25,
            Math.sin(angle) * 25
        );

        ctx.lineTo(
            Math.cos(angle) * 34,
            Math.sin(angle) * 34
        );

        ctx.stroke();
    }

    ctx.shadowColor =
        "#ffd84d";

    ctx.shadowBlur = 18;

    ctx.fillStyle =
        "#ffd84d";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        22,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#7b4c18";

    ctx.beginPath();

    ctx.arc(
        -7,
        -4,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        7,
        -4,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* ---------------------------------------------------------
   FLOWER
   --------------------------------------------------------- */

function drawFlower(
    x,
    y,
    type
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    const colors = [
        "#ff79aa",
        "#ffd85b",
        "#ff9f5b",
        "#e77dff"
    ];

    const color =
        colors[
            Math.abs(
                type.length
            ) % colors.length
        ];

    ctx.shadowColor =
        color;

    ctx.shadowBlur = 14;

    ctx.fillStyle =
        color;

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            3;

        ctx.beginPath();

        ctx.arc(
            Math.cos(angle) * 12,
            Math.sin(angle) * 12,
            11,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.fillStyle =
        "#ffd84d";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#23351f";

    ctx.fillRect(
        -15,
        18,
        9,
        12
    );

    ctx.fillRect(
        6,
        18,
        9,
        12
    );

    ctx.restore();
}


/* ---------------------------------------------------------
   ROBOT
   --------------------------------------------------------- */

function drawRobot(
    x,
    y
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.shadowColor =
        "#9da9ff";

    ctx.shadowBlur = 14;

    ctx.fillStyle =
        "#cbd0e8";

    roundedRect(
        ctx,
        -22,
        -24,
        44,
        46,
        9
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#252b44";

    ctx.fillRect(
        -15,
        -14,
        30,
        19
    );

    ctx.fillStyle =
        "#66eaff";

    ctx.beginPath();

    ctx.arc(
        -7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
        "#cbd0e8";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        0,
        -24
    );

    ctx.lineTo(
        0,
        -34
    );

    ctx.stroke();

    ctx.fillStyle =
        "#66eaff";

    ctx.beginPath();

    ctx.arc(
        0,
        -37,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "#cbd0e8";

    ctx.fillRect(
        -17,
        21,
        10,
        10
    );

    ctx.fillRect(
        7,
        21,
        10,
        10
    );

    ctx.restore();
}


/* ---------------------------------------------------------
   ICE CUBE
   --------------------------------------------------------- */

function drawIceCube(
    x,
    y
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.shadowColor =
        "#9beeff";

    ctx.shadowBlur = 17;

    ctx.fillStyle =
        "#aeefff";

    roundedRect(
        ctx,
        -23,
        -23,
        46,
        46,
        9
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle =
        "rgba(255,255,255,0.75)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        -12,
        -15
    );

    ctx.lineTo(
        -3,
        -3
    );

    ctx.lineTo(
        -12,
        9
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        10,
        -18
    );

    ctx.lineTo(
        4,
        -4
    );

    ctx.lineTo(
        13,
        8
    );

    ctx.stroke();

    ctx.fillStyle =
        "#172c38";

    ctx.beginPath();

    ctx.arc(
        -7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* ---------------------------------------------------------
   OBSTACLES
   --------------------------------------------------------- */

function drawObstacle(
    obstacle
) {

    const x =
        laneX(obstacle.lane);

    const y =
        obstacle.y;

    const size =
        obstacle.size;

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.rotate(
        obstacle.rotation
    );


    /* LEVEL 1 */

    if (level === 1) {

        ctx.shadowColor =
            "#ff3b81";

        ctx.shadowBlur = 16;

        ctx.fillStyle =
            "#ff3b81";

        roundedRect(
            ctx,
            -size / 2,
            -size / 2,
            size,
            size,
            8
        );

        ctx.fill();

        ctx.shadowBlur = 0;

        ctx.fillStyle =
            "rgba(255,255,255,0.35)";

        ctx.fillRect(
            -size / 3,
            -size / 3,
            size / 2,
            3
        );

        ctx.restore();

        return;
    }


    /* LEVEL 2 */

    if (level === 2) {

        ctx.shadowColor =
            "#ff4d65";

        ctx.shadowBlur = 16;

        ctx.fillStyle =
            "#ff4d65";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -size / 2
        );

        ctx.lineTo(
            size / 2,
            0
        );

        ctx.lineTo(
            0,
            size / 2
        );

        ctx.lineTo(
            -size / 2,
            0
        );

        ctx.closePath();

        ctx.fill();

        ctx.restore();

        return;
    }


    /* ANIMAL LEVELS */

    if (
        level === 3 ||
        level === 4
    ) {

        if (obstacle.kind === "root") {

            ctx.fillStyle =
                "#684128";

            roundedRect(
                ctx,
                -size / 2,
                -size / 3,
                size,
                size / 1.5,
                8
            );

            ctx.fill();

            ctx.strokeStyle =
                "#98633b";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.moveTo(
                -size / 3,
                0
            );

            ctx.lineTo(
                size / 4,
                -2
            );

            ctx.stroke();

        } else {

            drawRock(
                size
            );
        }

        ctx.restore();

        return;
    }


    /* FRUIT */

    if (level === 5) {

        if (
            obstacle.kind === "fruit"
        ) {

            ctx.fillStyle =
                "#ef5a42";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                size / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle =
                "#72b84f";

            ctx.fillRect(
                -3,
                -size / 2 - 6,
                6,
                9
            );

        } else {

            ctx.fillStyle =
                "#b76d3e";

            roundedRect(
                ctx,
                -size / 2,
                -size / 2,
                size,
                size,
                7
            );

            ctx.fill();
        }

        ctx.restore();

        return;
    }


    /* OCEAN */

    if (level === 6) {

        if (
            obstacle.kind === "coral"
        ) {

            ctx.strokeStyle =
                "#ff7891";

            ctx.lineWidth = 8;

            ctx.lineCap = "round";

            ctx.beginPath();

            ctx.moveTo(
                0,
                size / 2
            );

            ctx.lineTo(
                0,
                -size / 2
            );

            ctx.moveTo(
                0,
                -size / 5
            );

            ctx.lineTo(
                -size / 2,
                -size / 2
            );

            ctx.moveTo(
                0,
                0
            );

            ctx.lineTo(
                size / 2,
                -size / 3
            );

            ctx.stroke();

        } else {

            ctx.strokeStyle =
                "rgba(112,235,255,0.8)";

            ctx.lineWidth = 3;

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                size / 2,
                0,
                Math.PI * 2
            );

            ctx.stroke();
        }

        ctx.restore();

        return;
    }


    /* DESERT */

    if (level === 7) {

        if (
            obstacle.kind === "cactus"
        ) {

            ctx.fillStyle =
                "#58a65c";

            roundedRect(
                ctx,
                -7,
                -size / 2,
                14,
                size,
                7
            );

            ctx.fill();

            ctx.fillRect(
                -size / 2,
                -5,
                size / 3,
                9
            );

            ctx.fillRect(
                size / 6,
                7,
                size / 3,
                9
            );

        } else {

            ctx.fillStyle =
                "#b97942";

            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                size / 1.8,
                size / 2.5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();

        return;
    }


    /* FOREST */

    if (level === 8) {

        if (
            obstacle.kind === "tree"
        ) {

            ctx.fillStyle =
                "#68432b";

            ctx.fillRect(
                -7,
                -size / 2,
                14,
                size
            );

            ctx.fillStyle =
                "#377c42";

            ctx.beginPath();

            ctx.arc(
                0,
                -size / 2,
                size / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();

        } else {

            ctx.fillStyle =
                "#75482b";

            roundedRect(
                ctx,
                -size / 2,
                -10,
                size,
                20,
                8
            );

            ctx.fill();
        }

        ctx.restore();

        return;
    }


    /* SPACE */

    if (level === 9) {

        if (
            obstacle.kind === "comet"
        ) {

            ctx.fillStyle =
                "#b8a4ff";

            ctx.shadowColor =
                "#927dff";

            ctx.shadowBlur = 15;

            ctx.beginPath();

            ctx.arc(
                8,
                0,
                size / 2.2,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.shadowBlur = 0;

            ctx.strokeStyle =
                "rgba(185,164,255,0.45)";

            ctx.lineWidth = 7;

            ctx.beginPath();

            ctx.moveTo(
                -size,
                0
            );

            ctx.lineTo(
                0,
                0
            );

            ctx.stroke();

        } else {

            ctx.fillStyle =
                "#777b99";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                size / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();

        return;
    }


    /* ICE */

    if (level === 10) {

        if (
            obstacle.kind === "iceberg"
        ) {

            ctx.fillStyle =
                "#9fe9f7";

            ctx.beginPath();

            ctx.moveTo(
                -size / 2,
                size / 2
            );

            ctx.lineTo(
                -size / 4,
                -size / 2
            );

            ctx.lineTo(
                0,
                -size / 4
            );

            ctx.lineTo(
                size / 3,
                -size / 2
            );

            ctx.lineTo(
                size / 2,
                size / 2
            );

            ctx.closePath();

            ctx.fill();

        } else {

            ctx.fillStyle =
                "rgba(225,250,255,0.85)";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                size / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();

        return;
    }


    ctx.restore();
}


/* ---------------------------------------------------------
   ROCK
   --------------------------------------------------------- */

function drawRock(
    size
) {

    ctx.fillStyle =
        "#8a6241";

    ctx.beginPath();

    ctx.moveTo(
        -size / 2,
        size / 3
    );

    ctx.lineTo(
        -size / 3,
        -size / 2
    );

    ctx.lineTo(
        size / 4,
        -size / 2
    );

    ctx.lineTo(
        size / 2,
        0
    );

    ctx.lineTo(
        size / 3,
        size / 2
    );

    ctx.lineTo(
        -size / 3,
        size / 2
    );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle =
        "rgba(255,255,255,0.12)";

    ctx.fillRect(
        -size / 5,
        -size / 4,
        size / 3,
        4
    );
}


/* ---------------------------------------------------------
   PARTICLES
   --------------------------------------------------------- */

function createExplosion(
    x,
    y
) {

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            60 +
            Math.random() * 180;

        particles.push({

            x,

            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life:
                0.35 +
                Math.random() * 0.45,

            size:
                2 +
                Math.random() * 4
        });
    }
}


function drawParticle(
    particle
) {

    ctx.globalAlpha =
        Math.max(
            particle.life / 0.8,
            0
        );

    ctx.fillStyle =
        settings.playerColor;

    ctx.beginPath();

    ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;
}


/* ---------------------------------------------------------
   TREE
   --------------------------------------------------------- */

function drawTree(
    x,
    y,
    scale
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(
        scale,
        scale
    );

    ctx.fillStyle =
        "rgba(79,57,38,0.55)";

    ctx.fillRect(
        -7,
        0,
        14,
        90
    );

    ctx.fillStyle =
        "rgba(31,88,48,0.55)";

    ctx.beginPath();

    ctx.arc(
        0,
        -5,
        34,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        -23,
        20,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        23,
        20,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* ---------------------------------------------------------
   HELPERS
   --------------------------------------------------------- */

function laneX(
    laneValue
) {

    return (
        canvasWidth / 6
    ) +
    laneValue *
    (
        canvasWidth / 3
    );
}


function roundedRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {

    const r =
        Math.min(
            radius,
            width / 2,
            height / 2
        );

    context.beginPath();

    context.moveTo(
        x + r,
        y
    );

    context.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r
    );

    context.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r
    );

    context.arcTo(
        x,
        y + height,
        x,
        y,
        r
    );

    context.arcTo(
        x,
        y,
        x + width,
        y,
        r
    );

    context.closePath();
}


/* ---------------------------------------------------------
   BUTTON CONTROLS
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


attackButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        attack();
    }
);


startButton.addEventListener(
    "click",
    () => {

        startGame();
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

        else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            moveRight();
        }

        else if (
            event.key === " " ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            attack();
        }

        else if (
            event.key === "Enter" &&
            !running
        ) {

            startGame();
        }
    }
);


/* ---------------------------------------------------------
   TOUCH / SWIPE
   --------------------------------------------------------- */

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

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < 35) {

            attack();

            return;
        }


        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (dx > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        }
    },
    {
        passive: true
    }
);


/* ---------------------------------------------------------
   INITIALIZE
   --------------------------------------------------------- */

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

setupLevelUI();

updateHUD();

draw();
