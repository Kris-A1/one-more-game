// ============================================================
// 1M GAME
// LEVEL 1 = NEON RUN
// LEVEL 2 = NEON RUSH
// LEVEL 3 = ANIMAL RUN
// LEVEL 4 = OCEAN RUN
// LEVEL 5 = DESERT RUN
// LEVEL 6 = FOREST RUN
// LEVEL 7 = SPACE RUN
// LEVEL 8 = ICE RUN
// LEVEL 9 = FRUIT RUN
// LEVEL 10 = CHAOS RUN
// ============================================================


// ------------------------------------------------------------
// ELEMENTS
// ------------------------------------------------------------

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const scoreEl =
    document.getElementById("score");

const bestScoreEl =
    document.getElementById("bestScore");

const overlay =
    document.getElementById("gameOverlay");

const overlayTitle =
    document.getElementById("overlayTitle");

const overlayText =
    document.getElementById("overlayText");

const startButton =
    document.getElementById("startButton");

const levelSubtitle =
    document.getElementById("levelSubtitle");

const gameMessage =
    document.getElementById("gameMessage");

const multiplierDisplay =
    document.getElementById("multiplierDisplay");

const strikeDisplay =
    document.getElementById("strikeDisplay");

const animalChooser =
    document.getElementById("animalChooser");

const attackButton =
    document.getElementById("attackButton");

const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");

const gameContainer =
    document.querySelector(".game-container");


// ------------------------------------------------------------
// LEVEL
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// LEVEL SETTINGS
// ------------------------------------------------------------

const LEVELS = {

    1: {

        name: "NEON RUN",

        target: 500,

        backgroundTop: "#07111f",

        backgroundBottom: "#10243d",

        playerColor: "#31e6d1",

        obstacleColor: "#ff4fa3",

        startSpeed: 175,

        maxSpeed: 195,

        spawnDelay: 0.95,

        spawnMinimum: 0.40,

        sameLaneChance: 0.30,

        attacks: false

    },


    2: {

        name: "NEON RUSH",

        target: 700,

        backgroundTop: "#12051d",

        backgroundBottom: "#3b092f",

        playerColor: "#4ba7ff",

        obstacleColor: "#ff304f",

        startSpeed: 205,

        maxSpeed: 240,

        spawnDelay: 0.78,

        spawnMinimum: 0.29,

        sameLaneChance: 0.48,

        attacks: true

    },


    3: {

        name: "ANIMAL RUN",

        target: 900,

        backgroundTop: "#0d2517",

        backgroundBottom: "#2c5a32",

        playerColor: "#ffd84a",

        obstacleColor: "#9a6538",

        startSpeed: 220,

        maxSpeed: 255,

        spawnDelay: 0.70,

        spawnMinimum: 0.27,

        sameLaneChance: 0.53,

        attacks: true

    },


    4: {

        name: "OCEAN RUN",

        target: 1100,

        backgroundTop: "#061c2a",

        backgroundBottom: "#073f57",

        playerColor: "#55e8ff",

        obstacleColor: "#ff5c91",

        startSpeed: 235,

        maxSpeed: 275,

        spawnDelay: 0.66,

        spawnMinimum: 0.25,

        sameLaneChance: 0.56,

        attacks: true,

        world: "ocean"

    },


    5: {

        name: "DESERT RUN",

        target: 1300,

        backgroundTop: "#291306",

        backgroundBottom: "#704019",

        playerColor: "#ffe36b",

        obstacleColor: "#d28a43",

        startSpeed: 250,

        maxSpeed: 295,

        spawnDelay: 0.62,

        spawnMinimum: 0.235,

        sameLaneChance: 0.59,

        attacks: true,

        world: "desert"

    },


    6: {

        name: "FOREST RUN",

        target: 1500,

        backgroundTop: "#07180c",

        backgroundBottom: "#194d27",

        playerColor: "#76ff72",

        obstacleColor: "#754629",

        startSpeed: 265,

        maxSpeed: 315,

        spawnDelay: 0.58,

        spawnMinimum: 0.22,

        sameLaneChance: 0.61,

        attacks: true,

        world: "forest"

    },


    7: {

        name: "SPACE RUN",

        target: 1750,

        backgroundTop: "#05061c",

        backgroundBottom: "#16174a",

        playerColor: "#c78cff",

        obstacleColor: "#ff5b72",

        startSpeed: 280,

        maxSpeed: 335,

        spawnDelay: 0.54,

        spawnMinimum: 0.205,

        sameLaneChance: 0.63,

        attacks: true,

        world: "space"

    },


    8: {

        name: "ICE RUN",

        target: 2000,

        backgroundTop: "#071925",

        backgroundBottom: "#326d86",

        playerColor: "#b9f5ff",

        obstacleColor: "#b9e9ff",

        startSpeed: 295,

        maxSpeed: 355,

        spawnDelay: 0.51,

        spawnMinimum: 0.19,

        sameLaneChance: 0.65,

        attacks: true,

        world: "ice"

    },


    9: {

        name: "FRUIT RUN",

        target: 2250,

        backgroundTop: "#250b0b",

        backgroundBottom: "#5a2014",

        playerColor: "#ffed66",

        obstacleColor: "#ff674d",

        startSpeed: 310,

        maxSpeed: 375,

        spawnDelay: 0.48,

        spawnMinimum: 0.18,

        sameLaneChance: 0.67,

        attacks: true,

        world: "fruit"

    },


    10: {

        name: "CHAOS RUN",

        target: 2600,

        backgroundTop: "#120719",

        backgroundBottom: "#39143c",

        playerColor: "#ffffff",

        obstacleColor: "#ff4fa3",

        startSpeed: 330,

        maxSpeed: 410,

        spawnDelay: 0.44,

        spawnMinimum: 0.16,

        sameLaneChance: 0.70,

        attacks: true,

        world: "chaos"

    }

};


// ------------------------------------------------------------
// CURRENT SETTINGS
// ------------------------------------------------------------

let settings =
    LEVELS[level];


// ------------------------------------------------------------
// GAME STATE
// ------------------------------------------------------------

let gameRunning =
    false;

let score =
    0;

let bestScore =
    Number(
        localStorage.getItem(
            `1M_best_level_${level}`
        )
    ) || 0;

let elapsed =
    0;

let multiplier =
    1;

let strikes =
    3;

let spawnTimer =
    0;

let attackCooldown =
    0;

let lastTime =
    0;

let selectedAnimal =
    "BUNNY";

let playerLane =
    1;

let targetLane =
    1;

let obstacles =
    [];

let particles =
    [];

let levelComplete =
    false;


// ------------------------------------------------------------
// PLAYER
// ------------------------------------------------------------

const player = {

    x: 180,

    y: 410,

    width: 30,

    height: 30

};


// ------------------------------------------------------------
// PROGRESS STORAGE
// ------------------------------------------------------------

const UNLOCK_KEY =
    "1M_unlocked_level";


function getUnlockedLevel() {

    return Math.min(
        10,
        Math.max(
            1,
            Number(
                localStorage.getItem(
                    UNLOCK_KEY
                )
            ) || 1
        )
    );

}


function setUnlockedLevel(value) {

    const current =
        getUnlockedLevel();

    if (value > current) {

        localStorage.setItem(
            UNLOCK_KEY,
            String(
                Math.min(
                    10,
                    value
                )
            )
        );

    }

}


// ------------------------------------------------------------
// LEVEL UI
// ------------------------------------------------------------

function applyLevelUI() {

    settings =
        LEVELS[level];

    levelSubtitle.textContent =
        `LEVEL ${level} · ${settings.name}`;

    bestScore =
        Number(
            localStorage.getItem(
                `1M_best_level_${level}`
            )
        ) || 0;

    bestScoreEl.textContent =
        bestScore;

    gameContainer.className =
        `game-container level-${level}`;


    /*
       LEVEL 1–3 UI IS PRESERVED
    */

    if (level === 1) {

        animalChooser.style.display =
            "none";

        strikeDisplay.style.display =
            "none";

        attackButton.style.display =
            "none";

        overlayText.innerHTML =
            "Dodge. Survive.<br>Beat your best.";

        startButton.textContent =
            "▶ START RUN";

    }


    if (level === 2) {

        animalChooser.style.display =
            "none";

        strikeDisplay.style.display =
            "block";

        attackButton.style.display =
            "flex";

        overlayText.innerHTML =
            "Dodge. Destroy.<br>You have 3 strikes.";

        startButton.textContent =
            "▶ START RUSH";

    }


    if (level === 3) {

        animalChooser.style.display =
            "flex";

        strikeDisplay.style.display =
            "block";

        attackButton.style.display =
            "flex";

        overlayText.innerHTML =
            "Choose your animal.<br>Dodge. Destroy. Survive.";

        startButton.textContent =
            `▶ START AS ${selectedAnimal}`;

    }


    /*
       NEW LEVELS
    */

    if (level >= 4) {

        animalChooser.style.display =
            "none";

        strikeDisplay.style.display =
            "block";

        attackButton.style.display =
            "flex";

        overlayText.innerHTML =
            `${settings.name}<br>Reach ${settings.target}.<br>You have 3 strikes.`;

        startButton.textContent =
            `▶ START ${settings.name}`;

    }

}


applyLevelUI();


// ------------------------------------------------------------
// ANIMAL BUTTONS
// ------------------------------------------------------------

const animalButtons =
    document.querySelectorAll(
        ".animal-button"
    );


animalButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                selectedAnimal =
                    button.dataset.animal;

                animalButtons.forEach(
                    function(other) {

                        other.classList.remove(
                            "selected"
                        );

                    }
                );

                button.classList.add(
                    "selected"
                );

                if (level === 3) {

                    startButton.textContent =
                        `▶ START AS ${selectedAnimal}`;

                }

            }
        );

    }
);


// ------------------------------------------------------------
// CANVAS ROUNDED RECTANGLE
// ------------------------------------------------------------

function roundedRect(
    x,
    y,
    width,
    height,
    radius
) {

    radius =
        Math.min(
            radius,
            width / 2,
            height / 2
        );

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.lineTo(
        x + width - radius,
        y
    );

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

}


// ------------------------------------------------------------
// LANE POSITION
// ------------------------------------------------------------

function laneX(lane) {

    return 90 + lane * 90;

}


// ------------------------------------------------------------
// RESET GAME
// ------------------------------------------------------------

function resetGame() {

    score =
        0;

    elapsed =
        0;

    multiplier =
        1;

    strikes =
        3;

    spawnTimer =
        0;

    attackCooldown =
        0;

    obstacles =
        [];

    particles =
        [];

    playerLane =
        1;

    targetLane =
        1;

    player.x =
        laneX(1);

    levelComplete =
        false;

    scoreEl.textContent =
        "0";

    multiplierDisplay.textContent =
        "×1";

    updateStrikeDisplay();

}


// ------------------------------------------------------------
// STRIKE DISPLAY
// ------------------------------------------------------------

function updateStrikeDisplay() {

    if (level === 1) {
        return;
    }

    strikeDisplay.textContent =
        `STRIKES ×${strikes}`;

    if (strikes === 0) {

        strikeDisplay.style.opacity =
            "0.45";

    } else {

        strikeDisplay.style.opacity =
            "1";

    }

}


// ------------------------------------------------------------
// START GAME
// ------------------------------------------------------------

function startGame() {

    resetGame();

    gameRunning =
        true;

    overlay.style.display =
        "none";

    gameMessage.textContent =
        "GO!";

    lastTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );

}


// ------------------------------------------------------------
// SAVE BEST
// ------------------------------------------------------------

function saveBest() {

    if (score > bestScore) {

        bestScore =
            score;

        localStorage.setItem(
            `1M_best_level_${level}`,
            bestScore
        );

        bestScoreEl.textContent =
            bestScore;

    }

}


// ------------------------------------------------------------
// LEVEL COMPLETE
// ------------------------------------------------------------

function completeLevel() {

    if (!gameRunning) {
        return;
    }

    gameRunning =
        false;

    levelComplete =
        true;

    saveBest();


    if (level < 10) {

        setUnlockedLevel(
            level + 1
        );

        overlay.style.display =
            "flex";

        overlayTitle.textContent =
            "LEVEL COMPLETE";

        overlayText.innerHTML =
            `SCORE <strong>${score}</strong><br>` +
            `${LEVELS[level + 1].name} UNLOCKED`;

        startButton.textContent =
            `▶ START LEVEL ${level + 1}`;

        gameMessage.textContent =
            "ONE MORE LEVEL!";

    } else {

        setUnlockedLevel(10);

        overlay.style.display =
            "flex";

        overlayTitle.textContent =
            "1M COMPLETE";

        overlayText.innerHTML =
            `FINAL SCORE <strong>${score}</strong><br>` +
            `YOU BEAT ALL 10 LEVELS`;

        startButton.textContent =
            "▶ PLAY AGAIN";

        gameMessage.textContent =
            "THE RUN NEVER ENDS";

    }

}


// ------------------------------------------------------------
// GAME OVER
// ------------------------------------------------------------

function endGame() {

    gameRunning =
        false;

    saveBest();

    overlay.style.display =
        "flex";

    overlayTitle.textContent =
        "RUN OVER";

    overlayText.innerHTML =
        `SCORE <strong>${score}</strong><br>BEST <strong>${bestScore}</strong>`;


    if (level === 1) {

        startButton.textContent =
            "▶ TRY AGAIN";

    }


    if (level === 2) {

        startButton.textContent =
            "▶ TRY AGAIN";

    }


    if (level === 3) {

        startButton.textContent =
            `▶ RUN AS ${selectedAnimal}`;

    }


    if (level >= 4) {

        startButton.textContent =
            "▶ TRY AGAIN";

    }


    gameMessage.textContent =
        "ONE MORE RUN?";

}


// ------------------------------------------------------------
// SCORE
// ------------------------------------------------------------

function addScore(amount) {

    score +=
        Math.floor(
            amount * multiplier
        );

    scoreEl.textContent =
        score;

}


// ------------------------------------------------------------
// SPAWN OBSTACLE
// ------------------------------------------------------------

function spawnObstacle() {

    let lane;


    if (
        obstacles.length > 0 &&
        Math.random() <
        settings.sameLaneChance
    ) {

        const previous =
            obstacles[
                obstacles.length - 1
            ];

        lane =
            previous.lane;

    } else {

        lane =
            Math.floor(
                Math.random() * 3
            );

    }


    obstacles.push({

        lane: lane,

        x: laneX(lane),

        y: -60,

        width: 54,

        height: 34,

        rotation:
            Math.random() *
            Math.PI,

        type:
            Math.floor(
                Math.random() * 4
            )

    });

}


// ------------------------------------------------------------
// DRAW OBSTACLE
// ------------------------------------------------------------

function drawObstacle(obstacle) {

    ctx.save();

    ctx.translate(
        obstacle.x,
        obstacle.y
    );


    // --------------------------------------------------------
    // LEVEL 1
    // Pink neon blocks
    // --------------------------------------------------------

    if (level === 1) {

        ctx.shadowBlur =
            20;

        ctx.shadowColor =
            "#ff4fa3";

        ctx.fillStyle =
            "#ff4fa3";

        roundedRect(
            -27,
            -17,
            54,
            34,
            9
        );

        ctx.fill();


        ctx.shadowBlur =
            0;

        ctx.fillStyle =
            "rgba(255,255,255,.45)";

        roundedRect(
            -18,
            -4,
            36,
            5,
            2
        );

        ctx.fill();

    }


    // --------------------------------------------------------
    // LEVEL 2
    // Red warning diamonds
    // --------------------------------------------------------

    if (level === 2) {

        ctx.rotate(
            obstacle.rotation
        );

        ctx.shadowBlur =
            24;

        ctx.shadowColor =
            "#ff304f";

        ctx.fillStyle =
            "#ff304f";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -27
        );

        ctx.lineTo(
            32,
            0
        );

        ctx.lineTo(
            0,
            27
        );

        ctx.lineTo(
            -32,
            0
        );

        ctx.closePath();

        ctx.fill();


        ctx.shadowBlur =
            0;

        ctx.fillStyle =
            "#ffb7c0";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // --------------------------------------------------------
    // LEVEL 3
    // Forest rocks
    // --------------------------------------------------------

    if (level === 3) {

        ctx.shadowBlur =
            10;

        ctx.shadowColor =
            "rgba(0,0,0,.6)";

        ctx.fillStyle =
            "#87562f";

        ctx.beginPath();

        ctx.moveTo(
            -28,
            12
        );

        ctx.quadraticCurveTo(
            -27,
            -12,
            -10,
            -20
        );

        ctx.quadraticCurveTo(
            10,
            -29,
            27,
            -5
        );

        ctx.quadraticCurveTo(
            31,
            18,
            9,
            21
        );

        ctx.lineTo(
            -17,
            20
        );

        ctx.closePath();

        ctx.fill();


        ctx.shadowBlur =
            0;

        ctx.fillStyle =
            "#c38a50";

        ctx.beginPath();

        ctx.arc(
            -8,
            -5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // --------------------------------------------------------
    // LEVEL 4 — OCEAN
    // Coral
    // --------------------------------------------------------

    if (level === 4) {

        ctx.shadowBlur =
            18;

        ctx.shadowColor =
            "#ff5c91";

        ctx.fillStyle =
            "#ff5c91";

        ctx.lineWidth =
            9;

        ctx.lineCap =
            "round";

        ctx.beginPath();

        ctx.moveTo(
            -20,
            20
        );

        ctx.lineTo(
            -20,
            -4
        );

        ctx.lineTo(
            -30,
            -17
        );

        ctx.moveTo(
            -20,
            0
        );

        ctx.lineTo(
            -5,
            -15
        );

        ctx.lineTo(
            0,
            -29
        );

        ctx.moveTo(
            -5,
            -15
        );

        ctx.lineTo(
            14,
            -25
        );

        ctx.moveTo(
            0,
            2
        );

        ctx.lineTo(
            19,
            -7
        );

        ctx.lineTo(
            28,
            -22
        );

        ctx.stroke();

    }


    // --------------------------------------------------------
    // LEVEL 5 — DESERT
    // Sand rock
    // --------------------------------------------------------

    if (level === 5) {

        ctx.shadowBlur =
            8;

        ctx.shadowColor =
            "#9a5b25";

        ctx.fillStyle =
            "#d28a43";

        ctx.beginPath();

        ctx.moveTo(
            -31,
            17
        );

        ctx.quadraticCurveTo(
            -27,
            -15,
            -10,
            -19
        );

        ctx.quadraticCurveTo(
            8,
            -29,
            27,
            -9
        );

        ctx.quadraticCurveTo(
            34,
            10,
            22,
            20
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle =
            "#f2bd65";

        ctx.beginPath();

        ctx.arc(
            -8,
            -6,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // --------------------------------------------------------
    // LEVEL 6 — FOREST
    // Tree obstacle
    // --------------------------------------------------------

    if (level === 6) {

        ctx.fillStyle =
            "#754629";

        ctx.fillRect(
            -7,
            -3,
            14,
            29
        );

        ctx.shadowBlur =
            13;

        ctx.shadowColor =
            "#35a94b";

        ctx.fillStyle =
            "#28783a";

        ctx.beginPath();

        ctx.arc(
            -13,
            -12,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            12,
            -13,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            0,
            -22,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // --------------------------------------------------------
    // LEVEL 7 — SPACE
    // Comet
    // --------------------------------------------------------

    if (level === 7) {

        ctx.rotate(
            obstacle.rotation
        );

        ctx.shadowBlur =
            22;

        ctx.shadowColor =
            "#ff5b72";

        ctx.fillStyle =
            "#ff5b72";

        ctx.beginPath();

        ctx.arc(
            9,
            0,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur =
            0;

        ctx.strokeStyle =
            "rgba(255,180,200,.75)";

        ctx.lineWidth =
            7;

        ctx.beginPath();

        ctx.moveTo(
            -35,
            0
        );

        ctx.lineTo(
            -6,
            0
        );

        ctx.stroke();

    }


    // --------------------------------------------------------
    // LEVEL 8 — ICE
    // Iceberg
    // --------------------------------------------------------

    if (level === 8) {

        ctx.shadowBlur =
            17;

        ctx.shadowColor =
            "#9eeeff";

        ctx.fillStyle =
            "#b9e9ff";

        ctx.beginPath();

        ctx.moveTo(
            -30,
            18
        );

        ctx.lineTo(
            -19,
            -8
        );

        ctx.lineTo(
            -8,
            -28
        );

        ctx.lineTo(
            4,
            -8
        );

        ctx.lineTo(
            15,
            -22
        );

        ctx.lineTo(
            30,
            18
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.beginPath();

        ctx.moveTo(
            -8,
            -26
        );

        ctx.lineTo(
            4,
            -8
        );

        ctx.lineTo(
            -3,
            4
        );

        ctx.closePath();

        ctx.fill();

    }


    // --------------------------------------------------------
    // LEVEL 9 — FRUIT
    // Fruit
    // --------------------------------------------------------

    if (level === 9) {

        const fruits = [
            "#ff4d4d",
            "#ffb52e",
            "#7be35b",
            "#d86bff"
        ];

        ctx.shadowBlur =
            17;

        ctx.shadowColor =
            fruits[obstacle.type];

        ctx.fillStyle =
            fruits[obstacle.type];

        ctx.beginPath();

        ctx.arc(
            -8,
            5,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            10,
            5,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur =
            0;

        ctx.strokeStyle =
            "#72c34a";

        ctx.lineWidth =
            5;

        ctx.beginPath();

        ctx.moveTo(
            0,
            -9
        );

        ctx.quadraticCurveTo(
            3,
            -20,
            13,
            -22
        );

        ctx.stroke();

    }


    // --------------------------------------------------------
    // LEVEL 10 — CHAOS
    // Random neon shapes
    // --------------------------------------------------------

    if (level === 10) {

        const chaosColors = [
            "#ff4fa3",
            "#55e8ff",
            "#ffd84a",
            "#9cff62"
        ];

        ctx.shadowBlur =
            24;

        ctx.shadowColor =
            chaosColors[obstacle.type];

        ctx.fillStyle =
            chaosColors[obstacle.type];

        if (obstacle.type === 0) {

            roundedRect(
                -27,
                -17,
                54,
                34,
                9
            );

            ctx.fill();

        }

        if (obstacle.type === 1) {

            ctx.rotate(
                obstacle.rotation
            );

            ctx.beginPath();

            ctx.moveTo(
                0,
                -29
            );

            ctx.lineTo(
                31,
                0
            );

            ctx.lineTo(
                0,
                29
            );

            ctx.lineTo(
                -31,
                0
            );

            ctx.closePath();

            ctx.fill();

        }

        if (obstacle.type === 2) {

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                25,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        if (obstacle.type === 3) {

            ctx.rotate(
                obstacle.rotation
            );

            ctx.beginPath();

            ctx.moveTo(
                0,
                -30
            );

            ctx.lineTo(
                27,
                22
            );

            ctx.lineTo(
                -27,
                22
            );

            ctx.closePath();

            ctx.fill();

        }

    }


    ctx.restore();

}


// ------------------------------------------------------------
// DRAW PLAYER
// ------------------------------------------------------------

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    if (level === 3) {

        drawAnimal();

    } else {

        ctx.shadowBlur =
            22;

        ctx.shadowColor =
            settings.playerColor;

        ctx.fillStyle =
            settings.playerColor;

        roundedRect(
            -15,
            -15,
            30,
            30,
            9
        );

        ctx.fill();


        ctx.shadowBlur =
            0;

        ctx.fillStyle =
            "#ffffff";

        roundedRect(
            -7,
            -5,
            14,
            5,
            2
        );

        ctx.fill();

    }


    ctx.restore();

}


// ------------------------------------------------------------
// DRAW ANIMAL
// ------------------------------------------------------------

function drawAnimal() {

    ctx.shadowBlur =
        18;

    ctx.shadowColor =
        "#ffd84a";


    // BUNNY

    if (selectedAnimal === "BUNNY") {

        ctx.fillStyle =
            "#f0f0f0";


        roundedRect(
            -12,
            -31,
            8,
            22,
            4
        );

        ctx.fill();


        roundedRect(
            4,
            -31,
            8,
            22,
            4
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            0,
            3,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // FOX

    if (selectedAnimal === "FOX") {

        ctx.fillStyle =
            "#e87922";

        ctx.beginPath();

        ctx.moveTo(
            -20,
            -9
        );

        ctx.lineTo(
            -12,
            -27
        );

        ctx.lineTo(
            0,
            -18
        );

        ctx.lineTo(
            12,
            -27
        );

        ctx.lineTo(
            20,
            -9
        );

        ctx.lineTo(
            16,
            15
        );

        ctx.lineTo(
            -16,
            15
        );

        ctx.closePath();

        ctx.fill();

    }


    // CAT

    if (selectedAnimal === "CAT") {

        ctx.fillStyle =
            "#b9bac5";

        ctx.beginPath();

        ctx.moveTo(
            -20,
            -8
        );

        ctx.lineTo(
            -16,
            -25
        );

        ctx.lineTo(
            -4,
            -16
        );

        ctx.lineTo(
            4,
            -16
        );

        ctx.lineTo(
            16,
            -25
        );

        ctx.lineTo(
            20,
            -8
        );

        ctx.lineTo(
            16,
            15
        );

        ctx.lineTo(
            -16,
            15
        );

        ctx.closePath();

        ctx.fill();

    }


    // PANDA

    if (selectedAnimal === "PANDA") {

        ctx.fillStyle =
            "#f1f1f1";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#151515";


        ctx.beginPath();

        ctx.arc(
            -12,
            -9,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            12,
            -9,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // EYES

    ctx.shadowBlur =
        0;

    ctx.fillStyle =
        "#111";


    ctx.beginPath();

    ctx.arc(
        -7,
        -4,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        7,
        -4,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// ------------------------------------------------------------
// BACKGROUND
// ------------------------------------------------------------

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
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
        canvas.width,
        canvas.height
    );


    // Road

    ctx.fillStyle =
        "rgba(255,255,255,.035)";

    ctx.fillRect(
        45,
        0,
        270,
        canvas.height
    );


    // Lane lines

    ctx.strokeStyle =
        "rgba(255,255,255,.09)";

    ctx.lineWidth =
        2;

    ctx.setLineDash(
        [8, 15]
    );


    for (
        let i = 1;
        i < 3;
        i++
    ) {

        const x =
            45 + i * 90;

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


    ctx.setLineDash([]);


    // LEVEL 2 SPEED STREAKS

    if (level === 2) {

        ctx.strokeStyle =
            "rgba(255,70,100,.30)";

        ctx.lineWidth =
            2;


        for (
            let i = 0;
            i < 14;
            i++
        ) {

            const x =
                (
                    i * 47 +
                    elapsed * 100
                ) %
                canvas.width;

            const y =
                (
                    i * 79 +
                    elapsed * 180
                ) %
                canvas.height;


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x,
                y + 30
            );

            ctx.stroke();

        }

    }


    // LEVEL 3 TREES

    if (level === 3) {

        drawTree(
            18,
            100,
            0.8
        );

        drawTree(
            342,
            145,
            0.7
        );

        drawTree(
            18,
            300,
            0.55
        );

        drawTree(
            342,
            350,
            0.8
        );

    }


    // --------------------------------------------------------
    // LEVEL 4 — OCEAN
    // --------------------------------------------------------

    if (level === 4) {

        drawBubbles();

        ctx.fillStyle =
            "rgba(85,232,255,.08)";

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const y =
                (
                    i * 83 +
                    elapsed * 35
                ) %
                canvas.height;

            ctx.fillRect(
                48,
                y,
                264,
                1
            );

        }

    }


    // --------------------------------------------------------
    // LEVEL 5 — DESERT
    // --------------------------------------------------------

    if (level === 5) {

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const x =
                (i * 67) % 360;

            const y =
                (
                    i * 93 +
                    elapsed * 25
                ) %
                490;

            ctx.fillStyle =
                "rgba(255,210,120,.18)";

            ctx.fillRect(
                x,
                y,
                2,
                2
            );

        }

    }


    // --------------------------------------------------------
    // LEVEL 6 — FOREST
    // --------------------------------------------------------

    if (level === 6) {

        drawTree(
            12,
            90,
            0.65
        );

        drawTree(
            348,
            125,
            0.75
        );

        drawTree(
            15,
            285,
            0.55
        );

        drawTree(
            345,
            350,
            0.65
        );

    }


    // --------------------------------------------------------
    // LEVEL 7 — SPACE
    // --------------------------------------------------------

    if (level === 7) {

        drawStars();

    }


    // --------------------------------------------------------
    // LEVEL 8 — ICE
    // --------------------------------------------------------

    if (level === 8) {

        drawSnow();

    }


    // --------------------------------------------------------
    // LEVEL 9 — FRUIT
    // --------------------------------------------------------

    if (level === 9) {

        drawFruitBackground();

    }


    // --------------------------------------------------------
    // LEVEL 10 — CHAOS
    // --------------------------------------------------------

    if (level === 10) {

        drawChaosBackground();

    }

}


// ------------------------------------------------------------
// OCEAN BUBBLES
// ------------------------------------------------------------

function drawBubbles() {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const x =
            (i * 71 + 25) % 350;

        const y =
            (
                i * 61 -
                elapsed * (18 + i)
            ) % 500;

        ctx.strokeStyle =
            "rgba(120,235,255,.25)";

        ctx.lineWidth =
            2;

        ctx.beginPath();

        ctx.arc(
            x,
            y < 0 ? y + 500 : y,
            3 + (i % 3),
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

}


// ------------------------------------------------------------
// STARS
// ------------------------------------------------------------

function drawStars() {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const x =
            (i * 83) % 360;

        const y =
            (
                i * 47 +
                elapsed * (8 + i % 4)
            ) % 490;

        const size =
            1 + (i % 3);

        ctx.fillStyle =
            "rgba(255,255,255,.65)";

        ctx.fillRect(
            x,
            y,
            size,
            size
        );

    }

}


// ------------------------------------------------------------
// SNOW
// ------------------------------------------------------------

function drawSnow() {

    for (
        let i = 0;
        i < 22;
        i++
    ) {

        const x =
            (i * 53) % 360;

        const y =
            (
                i * 71 +
                elapsed * (25 + i % 5)
            ) % 490;

        ctx.fillStyle =
            "rgba(220,250,255,.55)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            2 + i % 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// ------------------------------------------------------------
// FRUIT BACKGROUND
// ------------------------------------------------------------

function drawFruitBackground() {

    const dots = [
        "#ff5757",
        "#ffd34d",
        "#70e45b",
        "#d46bff"
    ];

    for (
        let i = 0;
        i < 14;
        i++
    ) {

        const x =
            (i * 61 + 20) % 350;

        const y =
            (i * 89 + elapsed * 12) % 490;

        ctx.fillStyle =
            dots[i % dots.length];

        ctx.globalAlpha =
            0.18;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            3 + (i % 3),
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    ctx.globalAlpha =
        1;

}


// ------------------------------------------------------------
// CHAOS BACKGROUND
// ------------------------------------------------------------

function drawChaosBackground() {

    const colors = [
        "#ff4fa3",
        "#55e8ff",
        "#ffd84a",
        "#9cff62"
    ];

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const x =
            (i * 47) % 360;

        const y =
            (
                i * 91 +
                elapsed * (20 + i)
            ) % 490;

        ctx.fillStyle =
            colors[i % colors.length];

        ctx.globalAlpha =
            0.18;

        ctx.fillRect(
            x,
            y,
            3,
            3
        );

    }

    ctx.globalAlpha =
        1;

}


// ------------------------------------------------------------
// DRAW TREE
// ------------------------------------------------------------

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
        "#5b3823";

    ctx.fillRect(
        -6,
        12,
        12,
        38
    );


    ctx.fillStyle =
        "#286b35";

    ctx.beginPath();

    ctx.arc(
        0,
        3,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#3d8a45";

    ctx.beginPath();

    ctx.arc(
        -14,
        -4,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        14,
        -4,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


// ------------------------------------------------------------
// PARTICLES
// ------------------------------------------------------------

function createParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 16;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5) *
                240,

            vy:
                (Math.random() - 0.5) *
                240,

            life:
                0.55,

            size:
                3 +
                Math.random() * 4

        });

    }

}


function updateParticles(dt) {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            particles[i];


        particle.x +=
            particle.vx * dt;


        particle.y +=
            particle.vy * dt;


        particle.vy +=
            350 * dt;


        particle.life -=
            dt;


        if (
            particle.life <= 0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }

}


function drawParticles() {

    particles.forEach(
        function(particle) {

            ctx.globalAlpha =
                Math.max(
                    0,
                    particle.life * 2
                );

            ctx.fillStyle =
                "#ffffff";


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
    );


    ctx.globalAlpha =
        1;

}


// ------------------------------------------------------------
// ATTACK
// ------------------------------------------------------------

function attack() {

    if (!gameRunning) {
        return;
    }


    if (!settings.attacks) {
        return;
    }


    if (strikes <= 0) {

        gameMessage.textContent =
            "NO STRIKES LEFT";

        return;

    }


    if (attackCooldown > 0) {
        return;
    }


    attackCooldown =
        0.25;


    let targetIndex =
        -1;

    let closest =
        Infinity;


    for (
        let i = 0;
        i < obstacles.length;
        i++
    ) {

        const obstacle =
            obstacles[i];


        if (
            obstacle.lane !==
            playerLane
        ) {

            continue;

        }


        const distance =
            player.y -
            obstacle.y;


        if (
            obstacle.y > 245 &&
            obstacle.y < 405 &&
            distance >= 0 &&
            distance < closest
        ) {

            closest =
                distance;

            targetIndex =
                i;

        }

    }


    // No target = no strike lost

    if (
        targetIndex === -1
    ) {

        gameMessage.textContent =
            "NO TARGET";

        return;

    }


    const target =
        obstacles[targetIndex];


    obstacles.splice(
        targetIndex,
        1
    );


    strikes--;


    createParticles(
        target.x,
        target.y
    );


    const perfect =
        target.y > 335 &&
        target.y < 395;


    if (perfect) {

        addScore(70);

        gameMessage.textContent =
            "💥 PERFECT HIT!";

    } else {

        addScore(40);

        gameMessage.textContent =
            "💥 HIT!";

    }


    updateStrikeDisplay();

}


// ------------------------------------------------------------
// COLLISION
// ------------------------------------------------------------

function collision(
    obstacle
) {

    const playerLeft =
        player.x -
        player.width / 2;

    const playerRight =
        player.x +
        player.width / 2;

    const playerTop =
        player.y -
        player.height / 2;

    const playerBottom =
        player.y +
        player.height / 2;


    const obstacleLeft =
        obstacle.x -
        obstacle.width / 2;

    const obstacleRight =
        obstacle.x +
        obstacle.width / 2;

    const obstacleTop =
        obstacle.y -
        obstacle.height / 2;

    const obstacleBottom =
        obstacle.y +
        obstacle.height / 2;


    return (

        playerLeft <
        obstacleRight &&

        playerRight >
        obstacleLeft &&

        playerTop <
        obstacleBottom &&

        playerBottom >
        obstacleTop

    );

}


// ------------------------------------------------------------
// MOVE LEFT
// ------------------------------------------------------------

function moveLeft() {

    if (!gameRunning) {
        return;
    }


    targetLane =
        Math.max(
            0,
            targetLane - 1
        );

}


// ------------------------------------------------------------
// MOVE RIGHT
// ------------------------------------------------------------

function moveRight() {

    if (!gameRunning) {
        return;
    }


    targetLane =
        Math.min(
            2,
            targetLane + 1
        );

}


// ------------------------------------------------------------
// BUTTON CONTROLS
// ------------------------------------------------------------

leftButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        moveLeft();

    }
);


rightButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        moveRight();

    }
);


attackButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        attack();

    }
);


// ------------------------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------------------------

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            moveLeft();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            moveRight();

        }


        if (
            event.code ===
            "Space" ||
            event.key ===
            "ArrowUp"
        ) {

            event.preventDefault();

            attack();

        }

    }
);


// ------------------------------------------------------------
// TOUCH SWIPE
// ------------------------------------------------------------

let touchStartX =
    0;


canvas.addEventListener(
    "touchstart",
    function(event) {

        if (
            event.touches.length !== 1
        ) {

            return;

        }


        touchStartX =
            event.touches[0].clientX;

    },
    {
        passive: true
    }
);


canvas.addEventListener(
    "touchend",
    function(event) {

        if (
            !gameRunning ||
            event.changedTouches.length !== 1
        ) {

            return;

        }


        const touchEndX =
            event.changedTouches[0].clientX;


        const distance =
            touchEndX -
            touchStartX;


        if (
            Math.abs(distance) <
            30
        ) {

            return;

        }


        if (distance < 0) {

            moveLeft();

        } else {

            moveRight();

        }

    },
    {
        passive: true
    }
);


// ------------------------------------------------------------
// START / NEXT LEVEL BUTTON
// ------------------------------------------------------------

startButton.addEventListener(
    "click",
    function() {

        /*
           If the current level has been completed,
           move directly to the next level.
        */

        if (
            levelComplete &&
            level < 10
        ) {

            level++;

            levelComplete =
                false;

            history.replaceState(
                null,
                "",
                `?level=${level}`
            );

            applyLevelUI();

        }


        /*
           Level 10 is the final level.
           After completion, PLAY AGAIN
           restarts Level 1.
        */

        else if (
            levelComplete &&
            level === 10
        ) {

            level =
                1;

            levelComplete =
                false;

            history.replaceState(
                null,
                "",
                "?level=1"
            );

            applyLevelUI();

        }


        startGame();

    }
);


// ------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------

function update(dt) {

    elapsed +=
        dt;


    attackCooldown =
        Math.max(
            0,
            attackCooldown - dt
        );


    // Multiplier every 10 seconds

    multiplier =
        Math.min(
            9,
            1 +
            Math.floor(
                elapsed / 10
            )
        );


    multiplierDisplay.textContent =
        `×${multiplier}`;


    // Smooth player movement

    const targetX =
        laneX(targetLane);


    player.x +=
        (
            targetX -
            player.x
        ) *
        Math.min(
            1,
            12 * dt
        );


    // Increasing speed

    const speed =
        Math.min(
            settings.maxSpeed,
            settings.startSpeed +
            elapsed * 1.6
        );


    // Spawn

    spawnTimer -=
        dt;


    if (
        spawnTimer <= 0
    ) {

        spawnObstacle();


        const nextSpawn =
            Math.max(
                settings.spawnMinimum,
                settings.spawnDelay -
                elapsed * 0.004
            );


        spawnTimer =
            nextSpawn +
            Math.random() * 0.22;

    }


    // Obstacles

    for (
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const obstacle =
            obstacles[i];


        obstacle.y +=
            speed * dt;


        if (
            collision(obstacle)
        ) {

            endGame();

            return;

        }


        if (
            obstacle.y >
            canvas.height + 70
        ) {

            obstacles.splice(
                i,
                1
            );


            addScore(10);

        }

    }


    updateParticles(dt);


    // --------------------------------------------------------
    // LEVEL COMPLETION
    // --------------------------------------------------------

    if (
        score >= settings.target
    ) {

        completeLevel();

        return;

    }

}


// ------------------------------------------------------------
// DRAW
// ------------------------------------------------------------

function draw() {

    drawBackground();


    obstacles.forEach(
        function(obstacle) {

            drawObstacle(
                obstacle
            );

        }
    );


    drawParticles();

    drawPlayer();

}


// ------------------------------------------------------------
// GAME LOOP
// ------------------------------------------------------------

function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }


    const dt =
        Math.min(
            0.033,
            (
                timestamp -
                lastTime
            ) / 1000
        );


    lastTime =
        timestamp;


    update(dt);

    draw();


    if (gameRunning) {

        requestAnimationFrame(
            gameLoop
        );

    }

}


// ------------------------------------------------------------
// INITIAL DRAW
// ------------------------------------------------------------

updateStrikeDisplay();

draw();
