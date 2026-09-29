/* =========================================================
   1M — ONE MORE
   LEVELS 1–10
   ========================================================= */


/* ---------------------------------------------------------
   ELEMENTS
   --------------------------------------------------------- */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gameContainer = document.getElementById("gameContainer");

const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const multiplierEl = document.getElementById("multiplier");
const strikeDisplay = document.getElementById("strikeDisplay");

const overlay = document.getElementById("overlay");
const overlayLabel = document.getElementById("overlayLabel");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const startButton = document.getElementById("startButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const attackButton = document.getElementById("attackButton");

const attackInstruction =
    document.getElementById("attackInstruction");

const animalChooser =
    document.getElementById("animalChooser");

const animalCards =
    document.querySelectorAll(".animal-button");

const gameMessage =
    document.getElementById("gameMessage");


/* ---------------------------------------------------------
   LEVEL
   --------------------------------------------------------- */

const params =
    new URLSearchParams(window.location.search);

let level =
    Number(params.get("level")) || 1;

if (level < 1 || level > 10) {
    level = 1;
}


/* ---------------------------------------------------------
   LEVEL DATA
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

        world: "forest"
    },


    4: {
        name: "ANIMAL RUSH",
        label: "LEVEL 4",

        background: "#081a10",

        playerColor: "#ffe66b",
        obstacleColor: "#805532",

        speed: 235,
        maxSpeed: 315,

        attack: true,
        strikes: 6,

        world: "animalRush"
    },


    5: {
        name: "FRUIT RUN",
        label: "LEVEL 5",

        background: "#17100b",

        playerColor: "#ffdf72",
        obstacleColor: "#f28c38",

        speed: 250,
        maxSpeed: 330,

        attack: true,
        strikes: 6,

        world: "fruit"
    },


    6: {
        name: "OCEAN",
        label: "LEVEL 6",

        background: "#061722",

        playerColor: "#70efff",
        obstacleColor: "#ff6d82",

        speed: 265,
        maxSpeed: 345,

        attack: true,
        strikes: 6,

        world: "ocean"
    },


    7: {
        name: "DESERT",
        label: "LEVEL 7",

        background: "#24160a",

        playerColor: "#ffe27a",
        obstacleColor: "#bd7942",

        speed: 280,
        maxSpeed: 360,

        attack: true,
        strikes: 6,

        world: "desert"
    },


    8: {
        name: "FOREST",
        label: "LEVEL 8",

        background: "#09170d",

        playerColor: "#91ff87",
        obstacleColor: "#5f7b45",

        speed: 295,
        maxSpeed: 375,

        attack: true,
        strikes: 6,

        world: "forestDeep"
    },


    9: {
        name: "SPACE",
        label: "LEVEL 9",

        background: "#070b1c",

        playerColor: "#c8d9ff",
        obstacleColor: "#d5a2ff",

        speed: 310,
        maxSpeed: 395,

        attack: true,
        strikes: 6,

        world: "space"
    },


    10: {
        name: "ANTARCTICA",
        label: "LEVEL 10",

        background: "#101c29",

        playerColor: "#e8fbff",
        obstacleColor: "#7ed7ff",

        speed: 325,
        maxSpeed: 415,

        attack: true,
        strikes: 6,

        world: "ice"
    }

};


const settings = LEVELS[level];


/* ---------------------------------------------------------
   STATE
   --------------------------------------------------------- */

const canvasWidth = 360;
const canvasHeight = 490;

let running = false;
let gameOver = false;

let score = 0;

const bestKey =
    `1M_best_level_${level}`;

let bestScore =
    Number(localStorage.getItem(bestKey)) || 0;

let multiplier = 1;

let strikes =
    settings.strikes;

let selectedAnimal = "BUNNY";

let lane = 1;
let targetLane = 1;

let obstacles = [];
let particles = [];

let spawnTimer = 0;

let lastTime = 0;

let elapsed = 0;

let currentSpeed =
    settings.speed;

let animationId = null;


/* ---------------------------------------------------------
   SINGLE CHARACTER LEVELS
   --------------------------------------------------------- */

const SINGLE_CHARACTERS = {

    6: {
        name: "FISH",
        emoji: "🐟"
    },

    7: {
        name: "SUN",
        emoji: "☀️"
    },

    8: {
        name: "FLOWER",
        emoji: "🌸"
    },

    9: {
        name: "ROBOT",
        emoji: "🤖"
    },

    10: {
        name: "ICECUBE",
        emoji: "🧊"
    }

};


/* ---------------------------------------------------------
   RESIZE
   --------------------------------------------------------- */

function resizeCanvas() {

    const ratio =
        Math.min(window.devicePixelRatio || 1, 2);

    canvas.width =
        canvasWidth * ratio;

    canvas.height =
        canvasHeight * ratio;

    canvas.style.width =
        "100%";

    canvas.style.height =
        "100%";

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
   LEVEL UI
   --------------------------------------------------------- */

function setupLevelUI() {

    gameContainer.className =
        `game-container level-${level}`;


    overlayLabel.textContent =
        settings.label;


    /* ---------------------------------------------
       LEVEL 1
       --------------------------------------------- */

    if (level === 1) {

        overlayTitle.innerHTML =
            `NEON <span>RUN</span>`;

        overlayText.innerHTML =
            `Dodge everything.<br>How long can you survive?`;

        animalChooser.classList.add("hidden");

        strikeDisplay.classList.add("hidden");

        attackButton.classList.add("hidden");

        attackInstruction.classList.add("hidden");

        startButton.textContent =
            "▶ START";
    }


    /* ---------------------------------------------
       LEVEL 2
       --------------------------------------------- */

    else if (level === 2) {

        overlayTitle.innerHTML =
            `NEON <span>RUSH</span>`;

        overlayText.innerHTML =
            `Dodge or destroy obstacles.<br>You have 3 strikes.`;

        animalChooser.classList.add("hidden");

        strikeDisplay.classList.remove("hidden");

        attackButton.classList.remove("hidden");

        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            "▶ START";
    }


    /* ---------------------------------------------
       LEVEL 3
       --------------------------------------------- */

    else if (level === 3) {

        overlayTitle.innerHTML =
            `ANIMAL <span>RUN</span>`;

        overlayText.innerHTML =
            `Choose your runner.<br>Dodge or destroy obstacles.`;

        animalChooser.classList.remove("hidden");

        strikeDisplay.classList.remove("hidden");

        attackButton.classList.remove("hidden");

        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            `▶ START AS ${selectedAnimal}`;
    }


    /* ---------------------------------------------
       LEVEL 4
       --------------------------------------------- */

    else if (level === 4) {

        overlayTitle.innerHTML =
            `ANIMAL <span>RUSH</span>`;

        overlayText.innerHTML =
            `Faster and harder.<br>You have 6 strikes.`;

        animalChooser.classList.remove("hidden");

        strikeDisplay.classList.remove("hidden");

        attackButton.classList.remove("hidden");

        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            `▶ START AS ${selectedAnimal}`;
    }


    /* ---------------------------------------------
       LEVEL 5
       --------------------------------------------- */

    else if (level === 5) {

        overlayTitle.innerHTML =
            `FRUIT <span>RUN</span>`;

        overlayText.innerHTML =
            `Dodge the fruit hazards.<br>You have 6 strikes.`;

        animalChooser.classList.remove("hidden");

        strikeDisplay.classList.remove("hidden");

        attackButton.classList.remove("hidden");

        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            "▶ START";
    }


    /* ---------------------------------------------
       LEVELS 6–10
       --------------------------------------------- */

    else {

        const character =
            SINGLE_CHARACTERS[level];

        overlayTitle.innerHTML =
            `${settings.name.split(" ")[0]} <span>RUN</span>`;

        overlayText.innerHTML =
            `Dodge the hazards.<br>You have 6 strikes.`;

        animalChooser.classList.remove("hidden");

        strikeDisplay.classList.remove("hidden");

        attackButton.classList.remove("hidden");

        attackInstruction.classList.remove("hidden");

        startButton.textContent =
            `▶ START AS ${character.name}`;
    }


    configureCharacterCards();

    updateStrikeUI();
}


/* ---------------------------------------------------------
   CHARACTER CARDS
   --------------------------------------------------------- */

function configureCharacterCards() {

    animalCards.forEach(card => {

        card.style.display = "";

    });


    /* Level 3 and 4 = animals */

    if (level === 3 || level === 4) {

        const animals = [
            ["BUNNY", "🐰"],
            ["FOX", "🦊"],
            ["CAT", "🐱"],
            ["PANDA", "🐼"]
        ];

        animalCards.forEach((card, index) => {

            const emoji =
                card.querySelector(".animal-emoji");

            const name =
                card.querySelector(".animal-name");

            emoji.textContent =
                animals[index][1];

            name.textContent =
                animals[index][0];

            card.dataset.animal =
                animals[index][0];

            card.style.display =
                "flex";
        });

        return;
    }


    /* Level 5 = fruits */

    if (level === 5) {

        const fruits = [
            ["WATERMELON", "🍉"],
            ["PINEAPPLE", "🍍"],
            ["STRAWBERRY", "🍓"],
            ["PEACH", "🍑"]
        ];

        animalCards.forEach((card, index) => {

            const emoji =
                card.querySelector(".animal-emoji");

            const name =
                card.querySelector(".animal-name");

            emoji.textContent =
                fruits[index][1];

            name.textContent =
                fruits[index][0];

            card.dataset.animal =
                fruits[index][0];

            card.style.display =
                "flex";
        });

        return;
    }


    /* Levels 6–10 = one character */

    const character =
        SINGLE_CHARACTERS[level];

    if (!character) {
        return;
    }

    const first =
        animalCards[0];

    first.querySelector(".animal-emoji").textContent =
        character.emoji;

    first.querySelector(".animal-name").textContent =
        character.name;

    first.dataset.animal =
        character.name;

    first.style.display =
        "flex";


    for (let i = 1; i < animalCards.length; i++) {
        animalCards[i].style.display =
            "none";
    }

}


/* ---------------------------------------------------------
   CHARACTER SELECTION
   --------------------------------------------------------- */

animalCards.forEach(card => {

    card.addEventListener("click", () => {

        if (running) {
            return;
        }


        if (
            level !== 3 &&
            level !== 4 &&
            level !== 5
        ) {
            return;
        }


        animalCards.forEach(c => {
            c.classList.remove("selected");
        });


        card.classList.add("selected");


        selectedAnimal =
            card.dataset.animal;


        if (level === 3 || level === 4) {

            startButton.textContent =
                `▶ START AS ${selectedAnimal}`;
        }


        draw();
    });

});


/* ---------------------------------------------------------
   STRIKE UI
   --------------------------------------------------------- */

function updateStrikeUI() {

    if (!settings.attack) {

        strikeDisplay.classList.add("hidden");

        return;
    }


    strikeDisplay.classList.remove("hidden");


    strikeDisplay.textContent =
        `STRIKES ${strikes}`;


    attackButton.style.opacity =
        strikes > 0 ? "1" : "0.4";
}


/* ---------------------------------------------------------
   START
   --------------------------------------------------------- */

function startGame() {

    running = true;
    gameOver = false;

    score = 0;

    multiplier = 1;

    strikes =
        settings.strikes;

    lane = 1;
    targetLane = 1;

    obstacles = [];
    particles = [];

    spawnTimer = 0;

    elapsed = 0;

    currentSpeed =
        settings.speed;

    lastTime =
        performance.now();


    overlay.style.display =
        "none";


    gameMessage.textContent =
        "ONE MORE.";


    updateHUD();

    updateStrikeUI();


    cancelAnimationFrame(animationId);

    animationId =
        requestAnimationFrame(gameLoop);
}


/* ---------------------------------------------------------
   GAME LOOP
   --------------------------------------------------------- */

function gameLoop(timestamp) {

    if (!running) {
        return;
    }


    let delta =
        (timestamp - lastTime) / 1000;


    lastTime =
        timestamp;


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


    /* gradual difficulty */

    const difficulty =
        Math.min(elapsed / 70, 1);


    currentSpeed =
        settings.speed +
        (settings.maxSpeed - settings.speed) *
        difficulty;


    /* multiplier */

    multiplier =
        Math.min(
            1 + Math.floor(elapsed / 10),
            9
        );


    /* score */

    score +=
        delta * 10 * multiplier;


    /* lane movement */

    lane +=
        (targetLane - lane) *
        Math.min(delta * 13, 1);


    /* spawn */

    spawnTimer -= delta;


    /*
       The original rhythm remains the foundation.
       Higher levels simply tighten the timing.
    */

    const levelPressure =
        Math.min(
            Math.max(level - 3, 0) * 0.025,
            0.15
        );


    const spawnInterval =
        Math.max(
            0.36,
            0.88 -
            elapsed * 0.004 -
            levelPressure
        );


    if (spawnTimer <= 0) {

        spawnObstacle();

        spawnTimer =
            spawnInterval;
    }


    /* obstacles */

    for (let i = obstacles.length - 1; i >= 0; i--) {

        const obstacle =
            obstacles[i];


        obstacle.y +=
            currentSpeed * delta;


        if (!obstacle.passed &&
            obstacle.y > canvasHeight - 60) {

            obstacle.passed = true;

            score +=
                10 * multiplier;
        }


        /*
           Collision zone
        */

        if (
            obstacle.y >
                canvasHeight - 155 &&
            obstacle.y <
                canvasHeight - 70 &&
            Math.abs(
                obstacle.lane - lane
            ) < 0.34
        ) {

            endGame();

            return;
        }


        if (
            obstacle.y >
            canvasHeight + 70
        ) {

            obstacles.splice(i, 1);
        }

    }


    /* particles */

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.x += p.vx * delta;
        p.y += p.vy * delta;

        p.life -= delta;

        p.vy +=
            90 * delta;


        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }


    updateHUD();
}


/* ---------------------------------------------------------
   SPAWN OBSTACLE
   --------------------------------------------------------- */

function spawnObstacle() {

    const laneIndex =
        Math.floor(Math.random() * 3);


    obstacles.push({

        lane: laneIndex,

        y: -45,

        size:
            30 + Math.random() * 8,

        passed: false,

        variant:
            Math.floor(
                Math.random() * 3
            )

    });


    /*
       Keep the original double-obstacle
       idea, but only after the game has
       had time to build up.
    */

    if (
        elapsed > 22 &&
        Math.random() < (
            0.16 +
            Math.min(
                Math.max(level - 3, 0) * 0.015,
                0.08
            )
        )
    ) {

        let secondLane =
            Math.floor(Math.random() * 3);


        while (
            secondLane === laneIndex
        ) {

            secondLane =
                Math.floor(Math.random() * 3);
        }


        obstacles.push({

            lane: secondLane,

            y: -120,

            size:
                30 + Math.random() * 8,

            passed: false,

            variant:
                Math.floor(
                    Math.random() * 3
                )

        });

    }

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
        return;
    }


    let closest = null;
    let closestDistance = Infinity;


    for (const obstacle of obstacles) {

        if (
            obstacle.lane !==
            Math.round(lane)
        ) {
            continue;
        }


        const distance =
            Math.abs(
                obstacle.y -
                (canvasHeight - 112)
            );


        if (
            obstacle.y >
                canvasHeight - 330 &&
            obstacle.y <
                canvasHeight - 45 &&
            distance <
                closestDistance
        ) {

            closest =
                obstacle;

            closestDistance =
                distance;
        }

    }


    if (!closest) {

        gameMessage.textContent =
            "MISS.";

        return;
    }


    const perfect =
        closestDistance < 65;


    createExplosion(
        laneX(closest.lane),
        closest.y
    );


    const index =
        obstacles.indexOf(closest);


    if (index !== -1) {
        obstacles.splice(index, 1);
    }


    strikes--;


    if (perfect) {

        score +=
            70 * multiplier;

        gameMessage.textContent =
            "PERFECT HIT!";
    }

    else {

        score +=
            40 * multiplier;

        gameMessage.textContent =
            "HIT!";
    }


    updateStrikeUI();
    updateHUD();
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

    if (!running) {
        return;
    }


    running = false;

    gameOver = true;


    const finalScore =
        Math.floor(score);


    if (finalScore > bestScore) {

        bestScore =
            finalScore;

        localStorage.setItem(
            bestKey,
            bestScore
        );
    }


    bestScoreEl.textContent =
        bestScore;


    createExplosion(
        laneX(lane),
        canvasHeight - 112
    );


    overlay.style.display =
        "flex";


    overlayLabel.textContent =
        settings.label;


    overlayTitle.innerHTML =
        `RUN <span>OVER</span>`;


    overlayText.innerHTML =
        `SCORE ${finalScore}<br>
         BEST ${bestScore}<br>
         Ready for one more?`;


    if (level === 3 || level === 4) {

        startButton.textContent =
            `▶ RUN AS ${selectedAnimal}`;
    }

    else if (level >= 6) {

        startButton.textContent =
            `▶ RUN AS ${SINGLE_CHARACTERS[level].name}`;
    }

    else {

        startButton.textContent =
            "▶ TRY AGAIN";
    }


    gameMessage.textContent =
        "ONE MORE.";


    updateHUD();


    /*
       Level progression message
    */

    if (
        level < 10 &&
        finalScore >= 500
    ) {

        gameMessage.textContent =
            `LEVEL ${level + 1} AWAITS.`;
    }

}


/* ---------------------------------------------------------
   HUD
   --------------------------------------------------------- */

function updateHUD() {

    scoreEl.textContent =
        Math.floor(score);


    multiplierEl.textContent =
        `x${multiplier}`;


    if (settings.attack) {

        strikeDisplay.textContent =
            `STRIKES ${strikes}`;
    }

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


    for (const obstacle of obstacles) {

        drawObstacle(obstacle);
    }


    drawPlayer();


    for (const p of particles) {

        ctx.save();

        ctx.globalAlpha =
            Math.max(
                p.life / p.maxLife,
                0
            );

        ctx.fillStyle =
            p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }

}


/* ---------------------------------------------------------
   BACKGROUND
   --------------------------------------------------------- */

function drawBackground() {

    if (settings.world === "neon") {

        drawNeonCity(
            18,
            "#132b4f",
            "#21133c"
        );

        return;
    }


    if (settings.world === "neonRush") {

        drawNeonCity(
            22,
            "#45144d",
            "#162c54"
        );

        return;
    }


    if (
        settings.world === "forest" ||
        settings.world === "animalRush"
    ) {

        drawForest(
            settings.world === "animalRush"
                ? 16
                : 12
        );

        return;
    }


    if (settings.world === "fruit") {

        drawFruitWorld();

        return;
    }


    if (settings.world === "ocean") {

        drawOcean();

        return;
    }


    if (settings.world === "desert") {

        drawDesert();

        return;
    }


    if (settings.world === "forestDeep") {

        drawDeepForest();

        return;
    }


    if (settings.world === "space") {

        drawSpace();

        return;
    }


    if (settings.world === "ice") {

        drawIce();

        return;
    }

}


/* ---------------------------------------------------------
   NEON CITY
   --------------------------------------------------------- */

function drawNeonCity(
    count,
    colorA,
    colorB
) {

    const buildingWidth =
        canvasWidth / count;


    for (let i = 0; i < count; i++) {

        const height =
            70 +
            ((i * 37) % 100);


        ctx.fillStyle =
            i % 2 === 0
                ? colorA
                : colorB;


        ctx.globalAlpha =
            0.25;


        ctx.fillRect(
            i * buildingWidth,
            100 - height / 3,
            buildingWidth + 2,
            height
        );


        ctx.globalAlpha =
            1;
    }

}


/* ---------------------------------------------------------
   FOREST
   --------------------------------------------------------- */

function drawForest(count) {

    for (let i = 0; i < count; i++) {

        const x =
            (i + 0.5) *
            (canvasWidth / count);


        const y =
            145 +
            ((i * 19) % 75);


        drawTree(
            x,
            y,
            0.7 +
            ((i % 3) * 0.12)
        );
    }

}


/* ---------------------------------------------------------
   DEEP FOREST
   --------------------------------------------------------- */

function drawDeepForest() {

    drawForest(18);


    ctx.strokeStyle =
        "rgba(67,125,72,0.28)";

    ctx.lineWidth = 3;


    for (let i = 0; i < 7; i++) {

        const x =
            20 +
            i * 55;


        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.quadraticCurveTo(
            x - 15,
            70,
            x + 5,
            140
        );

        ctx.stroke();
    }

}


/* ---------------------------------------------------------
   FRUIT WORLD
   --------------------------------------------------------- */

function drawFruitWorld() {

    ctx.fillStyle =
        "rgba(72,38,18,0.28)";

    ctx.fillRect(
        0,
        100,
        canvasWidth,
        150
    );


    for (let i = 0; i < 9; i++) {

        const x =
            20 +
            ((i * 43) % 320);

        const y =
            110 +
            ((i * 31) % 90);


        ctx.font =
            "24px Arial";

        ctx.globalAlpha =
            0.25;

        ctx.fillText(
            ["🍃", "🍉", "🍓"][i % 3],
            x,
            y
        );

        ctx.globalAlpha =
            1;
    }

}


/* ---------------------------------------------------------
   OCEAN
   --------------------------------------------------------- */

function drawOcean() {

    ctx.fillStyle =
        "rgba(35,135,165,0.12)";

    for (let i = 0; i < 6; i++) {

        ctx.beginPath();

        ctx.arc(
            40 + i * 70,
            150 + (i % 2) * 30,
            55,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.strokeStyle =
        "rgba(90,220,240,0.15)";

    ctx.lineWidth = 2;


    for (let i = 0; i < 8; i++) {

        const y =
            120 + i * 28;

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.quadraticCurveTo(
            80,
            y - 12,
            180,
            y
        );

        ctx.quadraticCurveTo(
            260,
            y + 12,
            360,
            y
        );

        ctx.stroke();
    }

}


/* ---------------------------------------------------------
   DESERT
   --------------------------------------------------------- */

function drawDesert() {

    ctx.fillStyle =
        "rgba(220,150,65,0.12)";

    ctx.beginPath();

    ctx.moveTo(
        0,
        190
    );

    ctx.quadraticCurveTo(
        80,
        135,
        170,
        190
    );

    ctx.quadraticCurveTo(
        270,
        245,
        360,
        175
    );

    ctx.lineTo(
        360,
        260
    );

    ctx.lineTo(
        0,
        260
    );

    ctx.closePath();

    ctx.fill();


    for (let i = 0; i < 6; i++) {

        const x =
            25 + i * 65;

        ctx.fillStyle =
            "rgba(244,194,100,0.35)";

        ctx.fillRect(
            x,
            105 + (i % 3) * 25,
            3,
            32
        );
    }

}


/* ---------------------------------------------------------
   SPACE
   --------------------------------------------------------- */

function drawSpace() {

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";


    for (let i = 0; i < 55; i++) {

        const x =
            (i * 71) % canvasWidth;

        const y =
            (i * 37) % 280;

        const size =
            i % 5 === 0
                ? 2
                : 1;


        ctx.fillRect(
            x,
            y,
            size,
            size
        );
    }


    ctx.strokeStyle =
        "rgba(100,130,255,0.12)";

    ctx.lineWidth = 1;


    ctx.beginPath();

    ctx.arc(
        280,
        100,
        55,
        0,
        Math.PI * 2
    );

    ctx.stroke();

}


/* ---------------------------------------------------------
   ICE
   --------------------------------------------------------- */

function drawIce() {

    ctx.fillStyle =
        "rgba(180,230,255,0.12)";


    for (let i = 0; i < 8; i++) {

        const x =
            i * 52;

        const height =
            45 + (i % 3) * 25;


        ctx.beginPath();

        ctx.moveTo(
            x,
            220
        );

        ctx.lineTo(
            x + 25,
            220 - height
        );

        ctx.lineTo(
            x + 48,
            220
        );

        ctx.closePath();

        ctx.fill();
    }


    ctx.fillStyle =
        "rgba(255,255,255,0.55)";


    for (let i = 0; i < 30; i++) {

        const x =
            (i * 53) % canvasWidth;

        const y =
            (i * 29) % 260;


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            1.3,
            0,
            Math.PI * 2
        );

        ctx.fill();
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

    ctx.lineWidth = 1;


    ctx.beginPath();

    ctx.moveTo(
        canvasWidth / 3,
        trackTop
    );

    ctx.lineTo(
        canvasWidth / 3,
        canvasHeight
    );

    ctx.moveTo(
        canvasWidth * 2 / 3,
        trackTop
    );

    ctx.lineTo(
        canvasWidth * 2 / 3,
        canvasHeight
    );

    ctx.stroke();

}


/* ---------------------------------------------------------
   PLAYER
   --------------------------------------------------------- */

function drawPlayer() {

    const x =
        laneX(lane);

    const y =
        canvasHeight - 112;


    /*
       Levels 3–10 use character runners.
    */

    if (level >= 3) {

        drawCharacter(
            x,
            y
        );

        return;
    }


    /*
       Original neon runner.
    */

    ctx.save();


    ctx.shadowColor =
        settings.playerColor;

    ctx.shadowBlur =
        16;


    ctx.fillStyle =
        settings.playerColor;


    roundedRect(
        x - 20,
        y - 25,
        40,
        50,
        13
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    ctx.fillStyle =
        "#071018";


    ctx.beginPath();

    ctx.arc(
        x - 7,
        y - 5,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 7,
        y - 5,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        settings.playerColor;

    ctx.lineWidth = 4;


    ctx.beginPath();

    ctx.moveTo(
        x - 8,
        y + 25
    );

    ctx.lineTo(
        x - 12,
        y + 35
    );

    ctx.moveTo(
        x + 8,
        y + 25
    );

    ctx.lineTo(
        x + 12,
        y + 35
    );

    ctx.stroke();


    ctx.restore();

}


/* ---------------------------------------------------------
   CHARACTER
   --------------------------------------------------------- */

function drawCharacter(
    x,
    y
) {

    if (level === 3 || level === 4) {

        drawAnimal(
            x,
            y,
            selectedAnimal
        );

        return;
    }


    if (level === 5) {

        drawFruitCharacter(
            x,
            y,
            selectedAnimal
        );

        return;
    }


    if (level === 6) {

        drawFish(
            x,
            y
        );

        return;
    }


    if (level === 7) {

        drawSun(
            x,
            y
        );

        return;
    }


    if (level === 8) {

        drawFlower(
            x,
            y
        );

        return;
    }


    if (level === 9) {

        drawRobot(
            x,
            y
        );

        return;
    }


    if (level === 10) {

        drawIceCube(
            x,
            y
        );

        return;
    }

}


/* ---------------------------------------------------------
   ANIMALS
   --------------------------------------------------------- */

function drawAnimal(
    x,
    y,
    animal
) {

    ctx.save();


    ctx.shadowColor =
        "#ffe66b";

    ctx.shadowBlur =
        14;


    ctx.fillStyle =
        "#ffe66b";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        23,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    /* ears */

    ctx.fillStyle =
        "#ffe66b";


    if (animal === "BUNNY") {

        ctx.beginPath();

        ctx.ellipse(
            x - 10,
            y - 29,
            7,
            18,
            -0.15,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            x + 10,
            y - 29,
            7,
            18,
            0.15,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    if (animal === "FOX") {

        triangle(
            x - 20,
            y - 20,
            x - 8,
            y - 38,
            x,
            y - 20
        );

        triangle(
            x + 20,
            y - 20,
            x + 8,
            y - 38,
            x,
            y - 20
        );
    }


    if (animal === "CAT") {

        triangle(
            x - 20,
            y - 20,
            x - 9,
            y - 38,
            x,
            y - 20
        );

        triangle(
            x + 20,
            y - 20,
            x + 9,
            y - 38,
            x,
            y - 20
        );
    }


    if (animal === "PANDA") {

        ctx.fillStyle =
            "#171717";


        ctx.beginPath();

        ctx.arc(
            x - 14,
            y - 14,
            8,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 14,
            y - 14,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* eyes */

    ctx.fillStyle =
        "#111";


    ctx.beginPath();

    ctx.arc(
        x - 8,
        y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 8,
        y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* nose */

    ctx.beginPath();

    ctx.arc(
        x,
        y + 6,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* legs */

    ctx.strokeStyle =
        "#ffe66b";

    ctx.lineWidth = 5;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        x - 10,
        y + 20
    );

    ctx.lineTo(
        x - 14,
        y + 33
    );

    ctx.moveTo(
        x + 10,
        y + 20
    );

    ctx.lineTo(
        x + 14,
        y + 33
    );

    ctx.stroke();


    ctx.restore();

}


/* ---------------------------------------------------------
   FRUIT CHARACTER
   --------------------------------------------------------- */

function drawFruitCharacter(
    x,
    y,
    fruit
) {

    const colors = {

        WATERMELON: "#ff5f75",
        PINEAPPLE: "#ffd45a",
        STRAWBERRY: "#ff405c",
        PEACH: "#ff9b6a"

    };


    const color =
        colors[fruit] ||
        "#ff6b6b";


    ctx.save();


    ctx.shadowColor =
        color;

    ctx.shadowBlur =
        18;


    ctx.fillStyle =
        color;


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        23,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.shadowBlur = 0;


    if (fruit === "PINEAPPLE") {

        ctx.fillStyle =
            "#72c85a";


        for (let i = 0; i < 5; i++) {

            triangle(
                x - 12 + i * 6,
                y - 18,
                x - 8 + i * 6,
                y - 34,
                x - 2 + i * 6,
                y - 18
            );
        }
    }


    if (fruit === "WATERMELON") {

        ctx.strokeStyle =
            "#4cae62";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            18,
            0.2,
            Math.PI - 0.2
        );

        ctx.stroke();
    }


    ctx.fillStyle =
        "#171717";


    ctx.beginPath();

    ctx.arc(
        x - 7,
        y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 7,
        y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   FISH
   --------------------------------------------------------- */

function drawFish(x, y) {

    ctx.save();

    ctx.shadowColor =
        "#70efff";

    ctx.shadowBlur =
        16;


    ctx.fillStyle =
        "#70efff";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        25,
        17,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    triangle(
        x - 22,
        y,
        x - 40,
        y - 15,
        x - 40,
        y + 15
    );


    ctx.shadowBlur = 0;


    ctx.fillStyle =
        "#07151d";


    ctx.beginPath();

    ctx.arc(
        x + 10,
        y - 4,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   SUN
   --------------------------------------------------------- */

function drawSun(x, y) {

    ctx.save();

    ctx.shadowColor =
        "#ffe66b";

    ctx.shadowBlur =
        20;


    ctx.strokeStyle =
        "#ffe66b";

    ctx.lineWidth = 5;


    for (let i = 0; i < 8; i++) {

        const a =
            i * Math.PI / 4;


        ctx.beginPath();

        ctx.moveTo(
            x + Math.cos(a) * 27,
            y + Math.sin(a) * 27
        );

        ctx.lineTo(
            x + Math.cos(a) * 36,
            y + Math.sin(a) * 36
        );

        ctx.stroke();
    }


    ctx.fillStyle =
        "#ffe66b";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        23,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   FLOWER
   --------------------------------------------------------- */

function drawFlower(x, y) {

    ctx.save();

    ctx.shadowColor =
        "#ff8ad8";

    ctx.shadowBlur =
        16;


    const petalColors =
        [
            "#ff82d0",
            "#a98cff",
            "#ff9bc8",
            "#7fe7ff"
        ];


    for (let i = 0; i < 8; i++) {

        const a =
            i * Math.PI / 4;


        ctx.fillStyle =
            petalColors[i % 4];


        ctx.beginPath();

        ctx.arc(
            x + Math.cos(a) * 15,
            y + Math.sin(a) * 15,
            11,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.fillStyle =
        "#ffe66b";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   ROBOT
   --------------------------------------------------------- */

function drawRobot(x, y) {

    ctx.save();

    ctx.shadowColor =
        "#c8d9ff";

    ctx.shadowBlur =
        16;


    ctx.fillStyle =
        "#c8d9ff";


    roundedRect(
        x - 22,
        y - 24,
        44,
        45,
        8
    );


    ctx.fill();


    ctx.shadowBlur = 0;


    ctx.fillStyle =
        "#151b30";


    ctx.beginPath();

    ctx.arc(
        x - 8,
        y - 5,
        4,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 8,
        y - 5,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#c8d9ff";

    ctx.lineWidth = 4;


    ctx.beginPath();

    ctx.moveTo(
        x - 10,
        y + 21
    );

    ctx.lineTo(
        x - 14,
        y + 34
    );

    ctx.moveTo(
        x + 10,
        y + 21
    );

    ctx.lineTo(
        x + 14,
        y + 34
    );

    ctx.stroke();


    ctx.restore();

}


/* ---------------------------------------------------------
   ICE CUBE
   --------------------------------------------------------- */

function drawIceCube(x, y) {

    ctx.save();

    ctx.shadowColor =
        "#7ed7ff";

    ctx.shadowBlur =
        18;


    ctx.fillStyle =
        "#bcefff";


    roundedRect(
        x - 23,
        y - 23,
        46,
        46,
        9
    );


    ctx.fill();


    ctx.strokeStyle =
        "rgba(255,255,255,0.7)";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        x - 12,
        y - 15
    );

    ctx.lineTo(
        x - 3,
        y + 15
    );

    ctx.moveTo(
        x + 10,
        y - 18
    );

    ctx.lineTo(
        x + 3,
        y + 12
    );

    ctx.stroke();


    ctx.restore();

}


/* ---------------------------------------------------------
   OBSTACLES
   --------------------------------------------------------- */

function drawObstacle(obstacle) {

    const x =
        laneX(obstacle.lane);

    const y =
        obstacle.y;

    const size =
        obstacle.size;


    /* ---------------------------------------------
       LEVEL 1
       --------------------------------------------- */

    if (level === 1) {

        ctx.save();

        ctx.shadowColor =
            settings.obstacleColor;

        ctx.shadowBlur =
            14;

        ctx.fillStyle =
            settings.obstacleColor;


        roundedRect(
            x - size / 2,
            y - size / 2,
            size,
            size,
            8
        );


        ctx.fill();

        ctx.restore();

        return;
    }


    /* ---------------------------------------------
       LEVEL 2
       --------------------------------------------- */

    if (level === 2) {

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            Math.PI / 4
        );


        ctx.fillStyle =
            settings.obstacleColor;


        ctx.shadowColor =
            settings.obstacleColor;

        ctx.shadowBlur =
            12;


        ctx.fillRect(
            -size / 2,
            -size / 2,
            size,
            size
        );


        ctx.restore();

        return;
    }


    /* ---------------------------------------------
       LEVEL 3 + 4
       ROCK / LOG
       --------------------------------------------- */

    if (
        level === 3 ||
        level === 4 ||
        level === 8
    ) {

        drawRockObstacle(
            x,
            y,
            size
        );

        return;
    }


    /* ---------------------------------------------
       LEVEL 5
       FRUIT
       --------------------------------------------- */

    if (level === 5) {

        drawFruitObstacle(
            x,
            y,
            size,
            obstacle.variant
        );

        return;
    }


    /* ---------------------------------------------
       LEVEL 6
       CORAL
       --------------------------------------------- */

    if (level === 6) {

        drawCoralObstacle(
            x,
            y,
            size
        );

        return;
    }


    /* ---------------------------------------------
       LEVEL 7
       SAND
       --------------------------------------------- */

    if (level === 7) {

        drawSandObstacle(
            x,
            y,
            size
        );

        return;
    }


    /* ---------------------------------------------
       LEVEL 9
       COMET
       --------------------------------------------- */

    if (level === 9) {

        drawCometObstacle(
            x,
            y,
            size
        );

        return;
    }


    /* ---------------------------------------------
       LEVEL 10
       ICEBERG
       --------------------------------------------- */

    if (level === 10) {

        drawIcebergObstacle(
            x,
            y,
            size
        );

    }

}


/* ---------------------------------------------------------
   ROCK / LOG
   --------------------------------------------------------- */

function drawRockObstacle(
    x,
    y,
    size
) {

    ctx.save();


    ctx.fillStyle =
        settings.obstacleColor;


    ctx.beginPath();

    ctx.moveTo(
        x - size / 2,
        y + size / 3
    );

    ctx.lineTo(
        x - size / 3,
        y - size / 2
    );

    ctx.lineTo(
        x + size / 4,
        y - size / 2
    );

    ctx.lineTo(
        x + size / 2,
        y
    );

    ctx.lineTo(
        x + size / 3,
        y + size / 2
    );

    ctx.lineTo(
        x - size / 3,
        y + size / 2
    );

    ctx.closePath();

    ctx.fill();


    if (level === 4) {

        ctx.strokeStyle =
            "rgba(45,25,10,0.55)";

        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.moveTo(
            x - size / 3,
            y
        );

        ctx.lineTo(
            x + size / 3,
            y
        );

        ctx.stroke();
    }


    ctx.restore();

}


/* ---------------------------------------------------------
   FRUIT OBSTACLE
   --------------------------------------------------------- */

function drawFruitObstacle(
    x,
    y,
    size,
    variant
) {

    const fruits =
        ["🍉", "🍍", "🍓", "🍑"];


    ctx.font =
        `${Math.round(size + 12)}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(
        fruits[variant % fruits.length],
        x,
        y
    );

}


/* ---------------------------------------------------------
   CORAL OBSTACLE
   --------------------------------------------------------- */

function drawCoralObstacle(
    x,
    y,
    size
) {

    ctx.save();

    ctx.fillStyle =
        "#ff718c";


    ctx.beginPath();

    ctx.moveTo(
        x - size / 2,
        y + size / 2
    );

    ctx.lineTo(
        x - size / 3,
        y - size / 3
    );

    ctx.lineTo(
        x - size / 8,
        y - size / 8
    );

    ctx.lineTo(
        x,
        y - size / 2
    );

    ctx.lineTo(
        x + size / 8,
        y - size / 8
    );

    ctx.lineTo(
        x + size / 3,
        y - size / 3
    );

    ctx.lineTo(
        x + size / 2,
        y + size / 2
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   SAND OBSTACLE
   --------------------------------------------------------- */

function drawSandObstacle(
    x,
    y,
    size
) {

    ctx.save();

    ctx.fillStyle =
        "#c88b4b";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 5,
        size / 2,
        size / 3,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "rgba(255,220,140,0.35)";


    ctx.beginPath();

    ctx.ellipse(
        x - 5,
        y,
        size / 4,
        size / 7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   COMET
   --------------------------------------------------------- */

function drawCometObstacle(
    x,
    y,
    size
) {

    ctx.save();


    ctx.strokeStyle =
        "rgba(180,150,255,0.55)";

    ctx.lineWidth =
        size / 2;


    ctx.beginPath();

    ctx.moveTo(
        x - size * 1.5,
        y - size * 0.7
    );

    ctx.lineTo(
        x,
        y
    );

    ctx.stroke();


    ctx.fillStyle =
        "#d6a8ff";


    ctx.shadowColor =
        "#d6a8ff";

    ctx.shadowBlur =
        18;


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        size / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   ICEBERG
   --------------------------------------------------------- */

function drawIcebergObstacle(
    x,
    y,
    size
) {

    ctx.save();


    ctx.fillStyle =
        "#7ed7ff";


    ctx.beginPath();

    ctx.moveTo(
        x - size / 2,
        y + size / 2
    );

    ctx.lineTo(
        x - size / 4,
        y - size / 2
    );

    ctx.lineTo(
        x + size / 8,
        y - size / 5
    );

    ctx.lineTo(
        x + size / 3,
        y - size / 2
    );

    ctx.lineTo(
        x + size / 2,
        y + size / 2
    );

    ctx.closePath();

    ctx.fill();


    ctx.fillStyle =
        "rgba(255,255,255,0.45)";


    ctx.beginPath();

    ctx.moveTo(
        x - size / 4,
        y - size / 2
    );

    ctx.lineTo(
        x,
        y - size / 10
    );

    ctx.lineTo(
        x + size / 8,
        y - size / 5
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* ---------------------------------------------------------
   EXPLOSION
   --------------------------------------------------------- */

function createExplosion(
    x,
    y
) {

    const count =
        level >= 6
            ? 20
            : 15;


    for (let i = 0; i < count; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;


        const speed =
            70 +
            Math.random() * 150;


        const color =
            level === 10
                ? "#bdefff"
                : level === 9
                    ? "#d3a6ff"
                    : settings.playerColor;


        particles.push({

            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                2 +
                Math.random() * 4,

            life:
                0.35 +
                Math.random() * 0.35,

            maxLife:
                0.7,

            color

        });
    }

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

    ctx.globalAlpha =
        0.35;


    ctx.fillStyle =
        "#4b3522";


    ctx.fillRect(
        x - 5 * scale,
        y,
        10 * scale,
        75 * scale
    );


    ctx.fillStyle =
        "#315a38";


    ctx.beginPath();

    ctx.arc(
        x,
        y - 15 * scale,
        30 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x - 20 * scale,
        y + 5 * scale,
        22 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 20 * scale,
        y + 5 * scale,
        22 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.globalAlpha =
        1;

    ctx.restore();

}


/* ---------------------------------------------------------
   HELPERS
   --------------------------------------------------------- */

function laneX(laneValue) {

    return (
        canvasWidth / 6 +
        laneValue *
        (canvasWidth / 3)
    );
}


function roundedRect(
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


    ctx.beginPath();

    ctx.moveTo(
        x + r,
        y
    );

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        r
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        r
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        r
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        r
    );

    ctx.closePath();
}


function triangle(
    x1,
    y1,
    x2,
    y2,
    x3,
    y3
) {

    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.lineTo(
        x3,
        y3
    );

    ctx.closePath();

    ctx.fill();

}


/* ---------------------------------------------------------
   BUTTON EVENTS
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

document.addEventListener(
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


        if (
            event.key === "Enter" &&
            !running
        ) {

            startGame();
        }

    }
);


/* ---------------------------------------------------------
   TOUCH SWIPE
   --------------------------------------------------------- */

let touchStartX = 0;
let touchStartY = 0;


canvas.addEventListener(
    "touchstart",
    event => {

        if (!event.touches.length) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;

        touchStartY =
            event.touches[0].clientY;
    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    event => {

        if (!event.changedTouches.length) {
            return;
        }


        const touch =
            event.changedTouches[0];


        const dx =
            touch.clientX -
            touchStartX;

        const dy =
            touch.clientY -
            touchStartY;


        if (Math.abs(dx) > 35) {

            if (dx < 0) {
                moveLeft();
            }

            else {
                moveRight();
            }

            return;
        }


        /*
           Tap = attack
        */

        if (
            Math.abs(dx) < 20 &&
            Math.abs(dy) < 20
        ) {

            attack();
        }

    },
    {
        passive: true
    }
);


/* ---------------------------------------------------------
   INITIALIZE
   --------------------------------------------------------- */

window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();

setupLevelUI();

bestScoreEl.textContent =
    bestScore;

updateHUD();

updateStrikeUI();

draw();
