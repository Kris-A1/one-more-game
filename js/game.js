const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");
const overlay = document.getElementById("gameOverlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const levelSubtitle = document.getElementById("levelSubtitle");
const gameMessage = document.getElementById("gameMessage");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const controls = document.querySelector(".controls");


// --------------------------------------------------
// LEVEL
// --------------------------------------------------

const params = new URLSearchParams(window.location.search);

const level = Math.min(
    3,
    Math.max(
        1,
        Number(params.get("level")) || 1
    )
);


// --------------------------------------------------
// LEVEL SETTINGS
// --------------------------------------------------

const LEVELS = {

    1: {
        name: "NEON RUN",

        background: "#07111f",
        background2: "#10243d",

        playerColor: "#31e6d1",
        obstacleColor: "#ff4fa3",

        startSpeed: 175,
        maxSpeed: 195,

        spawnStart: 1.00,
        spawnMin: 0.42,
        spawnRandom: 0.38,

        sameLaneChance: 0.30,

        attacks: false
    },

    2: {
        name: "NEON RUSH",

        background: "#12051d",
        background2: "#350a31",

        playerColor: "#49a7ff",
        obstacleColor: "#ff304f",

        startSpeed: 205,
        maxSpeed: 235,

        spawnStart: 0.82,
        spawnMin: 0.30,
        spawnRandom: 0.28,

        sameLaneChance: 0.47,

        attacks: true
    },

    3: {
        name: "ANIMAL RUN",

        background: "#102719",
        background2: "#1d4528",

        playerColor: "#ffd84a",
        obstacleColor: "#a56b38",

        startSpeed: 220,
        maxSpeed: 250,

        spawnStart: 0.72,
        spawnMin: 0.27,
        spawnRandom: 0.25,

        sameLaneChance: 0.52,

        attacks: true
    }

};

const settings = LEVELS[level];


// --------------------------------------------------
// GAME VARIABLES
// --------------------------------------------------

let gameRunning = false;

let playerLane = 1;
let targetLane = 1;

let score = 0;
let bestScore = 0;

let elapsed = 0;
let multiplier = 1;

let obstacles = [];
let particles = [];

let spawnTimer = 0;

let lastTime = 0;

let strikes = 3;

let attackCooldown = 0;

let selectedAnimal = "BUNNY";


// --------------------------------------------------
// PLAYER
// --------------------------------------------------

const player = {

    x: 180,
    y: 405,

    width: 30,
    height: 30,

    laneWidth: 90,

    moveSpeed: 10

};


// --------------------------------------------------
// LANES
// --------------------------------------------------

function laneX(lane) {

    return 90 + lane * 90;

}


// --------------------------------------------------
// BEST SCORE
// --------------------------------------------------

const bestKey = `1M_best_level_${level}`;

bestScore =
    Number(
        localStorage.getItem(bestKey)
    ) || 0;

bestScoreEl.textContent = bestScore;


// --------------------------------------------------
// HEADER
// --------------------------------------------------

levelSubtitle.textContent =
    `LEVEL ${level} · ${settings.name}`;


// --------------------------------------------------
// MULTIPLIER UI
// --------------------------------------------------

const multiplierDisplay =
    document.getElementById("multiplierDisplay");


// --------------------------------------------------
// STRIKE UI
// --------------------------------------------------

let strikeDisplay = null;

if (settings.attacks) {

    strikeDisplay =
        document.createElement("div");

    strikeDisplay.id =
        "strikeDisplay";

    strikeDisplay.textContent =
        "STRIKES ×3";

    strikeDisplay.style.position =
        "absolute";

    strikeDisplay.style.left =
        "50%";

    strikeDisplay.style.top =
        "105px";

    strikeDisplay.style.transform =
        "translateX(-50%)";

    strikeDisplay.style.fontSize =
        "12px";

    strikeDisplay.style.fontWeight =
        "800";

    strikeDisplay.style.letterSpacing =
        "2px";

    strikeDisplay.style.color =
        "#ffffff";

    strikeDisplay.style.zIndex =
        "20";

    strikeDisplay.style.textShadow =
        "0 0 10px rgba(255,255,255,.7)";

    document.querySelector(".game-container")
        .appendChild(strikeDisplay);
}


// --------------------------------------------------
// ATTACK BUTTON
// --------------------------------------------------

let attackButton = null;

if (settings.attacks) {

    attackButton =
        document.createElement("button");

    attackButton.id =
        "attackButton";

    attackButton.textContent =
        "💥";

    attackButton.setAttribute(
        "aria-label",
        "Attack"
    );

    attackButton.style.width =
        "72px";

    attackButton.style.height =
        "58px";

    attackButton.style.border =
        "2px solid rgba(255,255,255,.35)";

    attackButton.style.borderRadius =
        "18px";

    attackButton.style.background =
        "rgba(255,50,80,.18)";

    attackButton.style.color =
        "#ffffff";

    attackButton.style.fontSize =
        "27px";

    attackButton.style.fontWeight =
        "900";

    attackButton.style.touchAction =
        "manipulation";

    attackButton.style.cursor =
        "pointer";

    attackButton.style.boxShadow =
        "0 0 20px rgba(255,40,80,.25)";

    controls.appendChild(
        attackButton
    );

    attackButton.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            attack();

        }
    );
}


// --------------------------------------------------
// ANIMAL SELECTOR
// --------------------------------------------------

let animalChooser = null;

const animals = [
    {
        id: "BUNNY",
        emoji: "🐰"
    },
    {
        id: "FOX",
        emoji: "🦊"
    },
    {
        id: "CAT",
        emoji: "🐱"
    },
    {
        id: "PANDA",
        emoji: "🐼"
    }
];


function createAnimalChooser() {

    if (level !== 3) {
        return;
    }

    animalChooser =
        document.createElement("div");

    animalChooser.id =
        "animalChooser";

    animalChooser.style.display =
        "flex";

    animalChooser.style.justifyContent =
        "center";

    animalChooser.style.flexWrap =
        "wrap";

    animalChooser.style.gap =
        "8px";

    animalChooser.style.margin =
        "14px auto";

    animalChooser.style.maxWidth =
        "300px";

    animals.forEach(function(animal) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.dataset.animal =
            animal.id;

        button.innerHTML =
            `${animal.emoji}<br><span>${animal.id}</span>`;

        button.style.width =
            "64px";

        button.style.height =
            "58px";

        button.style.borderRadius =
            "14px";

        button.style.border =
            "2px solid rgba(255,255,255,.2)";

        button.style.background =
            "rgba(255,255,255,.08)";

        button.style.color =
            "#ffffff";

        button.style.fontSize =
            "20px";

        button.style.lineHeight =
            "18px";

        button.style.cursor =
            "pointer";

        button.style.touchAction =
            "manipulation";

        const label =
            button.querySelector("span");

        label.style.fontSize =
            "8px";

        label.style.fontWeight =
            "800";

        label.style.letterSpacing =
            "1px";

        button.addEventListener(
            "click",
            function() {

                selectedAnimal =
                    animal.id;

                updateAnimalButtons();

                startButton.textContent =
                    `▶ START AS ${selectedAnimal}`;

            }
        );

        animalChooser.appendChild(
            button
        );

    });

    overlayText.insertAdjacentElement(
        "afterend",
        animalChooser
    );

    updateAnimalButtons();

}


function updateAnimalButtons() {

    if (!animalChooser) {
        return;
    }

    const buttons =
        animalChooser.querySelectorAll(
            "button"
        );

    buttons.forEach(function(button) {

        if (
            button.dataset.animal ===
            selectedAnimal
        ) {

            button.style.background =
                "rgba(255,216,74,.25)";

            button.style.border =
                "2px solid #ffd84a";

            button.style.transform =
                "scale(1.05)";

        } else {

            button.style.background =
                "rgba(255,255,255,.08)";

            button.style.border =
                "2px solid rgba(255,255,255,.2)";

            button.style.transform =
                "scale(1)";

        }

    });

}


createAnimalChooser();


// --------------------------------------------------
// CANVAS HELPERS
// --------------------------------------------------

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


// --------------------------------------------------
// RESET
// --------------------------------------------------

function resetGame() {

    score = 0;

    elapsed = 0;

    multiplier = 1;

    playerLane = 1;

    targetLane = 1;

    obstacles = [];

    particles = [];

    spawnTimer = 0;

    strikes = 3;

    attackCooldown = 0;

    player.x =
        laneX(1);

    scoreEl.textContent =
        "0";

    multiplierDisplay.textContent =
        "×1";

    if (strikeDisplay) {

        strikeDisplay.textContent =
            "STRIKES ×3";

    }

}


// --------------------------------------------------
// START
// --------------------------------------------------

function startGame() {

    resetGame();

    gameRunning = true;

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


// --------------------------------------------------
// GAME OVER
// --------------------------------------------------

function endGame() {

    gameRunning = false;

    if (score > bestScore) {

        bestScore =
            score;

        localStorage.setItem(
            bestKey,
            bestScore
        );

        bestScoreEl.textContent =
            bestScore;

    }

    overlay.style.display =
        "flex";

    overlayTitle.textContent =
        "RUN OVER";

    overlayText.innerHTML =
        `SCORE <strong>${score}</strong><br>BEST <strong>${bestScore}</strong>`;

    if (level === 3) {

        startButton.textContent =
            `▶ RUN AS ${selectedAnimal}`;

    } else {

        startButton.textContent =
            "▶ TRY AGAIN";

    }

    gameMessage.textContent =
        "ONE MORE RUN?";

}


// --------------------------------------------------
// SCORE
// --------------------------------------------------

function addScore(amount) {

    score +=
        Math.floor(
            amount * multiplier
        );

    scoreEl.textContent =
        score;

}


// --------------------------------------------------
// OBSTACLES
// --------------------------------------------------

function spawnObstacle() {

    let lane;

    if (
        obstacles.length > 0 &&
        Math.random() < settings.sameLaneChance
    ) {

        const last =
            obstacles[
                obstacles.length - 1
            ];

        lane =
            last.lane;

    } else {

        lane =
            Math.floor(
                Math.random() * 3
            );

    }

    obstacles.push({

        lane: lane,

        x: laneX(lane),

        y: -55,

        width: 54,

        height: 32,

        rotation:
            Math.random() *
            Math.PI,

        speed:
            settings.startSpeed +
            Math.random() * 20

    });

}


// --------------------------------------------------
// OBSTACLE DRAWING
// --------------------------------------------------

function drawObstacle(obstacle) {

    const x =
        obstacle.x;

    const y =
        obstacle.y;

    ctx.save();

    ctx.translate(
        x,
        y
    );

    if (level === 1) {

        // NEON RUN
        // Pink energy bars

        ctx.shadowBlur =
            18;

        ctx.shadowColor =
            settings.obstacleColor;

        ctx.fillStyle =
            settings.obstacleColor;

        roundedRect(
            -27,
            -16,
            54,
            32,
            9
        );

        ctx.fill();

        ctx.fillStyle =
            "rgba(255,255,255,.35)";

        roundedRect(
            -19,
            -5,
            38,
            4,
            2
        );

        ctx.fill();

    }

    else if (level === 2) {

        // NEON RUSH
        // Warning diamonds

        ctx.rotate(
            obstacle.rotation
        );

        ctx.shadowBlur =
            22;

        ctx.shadowColor =
            "#ff304f";

        ctx.fillStyle =
            "#ff304f";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -24
        );

        ctx.lineTo(
            30,
            0
        );

        ctx.lineTo(
            0,
            24
        );

        ctx.lineTo(
            -30,
            0
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle =
            "#ffb0bb";

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

    else {

        // ANIMAL RUN
        // Forest rocks

        ctx.shadowBlur =
            10;

        ctx.shadowColor =
            "rgba(0,0,0,.5)";

        ctx.fillStyle =
            "#8b5a32";

        ctx.beginPath();

        ctx.moveTo(
            -27,
            12
        );

        ctx.quadraticCurveTo(
            -25,
            -15,
            -8,
            -20
        );

        ctx.quadraticCurveTo(
            10,
            -30,
            27,
            -4
        );

        ctx.quadraticCurveTo(
            32,
            18,
            10,
            20
        );

        ctx.lineTo(
            -15,
            21
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle =
            "#c78a4a";

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

    ctx.restore();

}


// --------------------------------------------------
// PLAYER DRAWING
// --------------------------------------------------

function drawPlayer() {

    const x =
        player.x;

    const y =
        player.y;

    ctx.save();

    ctx.translate(
        x,
        y
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


// --------------------------------------------------
// ANIMAL DRAWING
// --------------------------------------------------

function drawAnimal() {

    ctx.shadowBlur =
        18;

    ctx.shadowColor =
        "#ffd84a";

    if (selectedAnimal === "BUNNY") {

        ctx.fillStyle =
            "#f2f2f2";

        // ears

        roundedRect(
            -12,
            -30,
            8,
            20,
            4
        );

        ctx.fill();

        roundedRect(
            4,
            -30,
            8,
            20,
            4
        );

        ctx.fill();

        // body

        ctx.beginPath();

        ctx.arc(
            0,
            3,
            17,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    else if (selectedAnimal === "FOX") {

        ctx.fillStyle =
            "#e87922";

        ctx.beginPath();

        ctx.moveTo(
            -19,
            -10
        );

        ctx.lineTo(
            -10,
            -25
        );

        ctx.lineTo(
            0,
            -17
        );

        ctx.lineTo(
            10,
            -25
        );

        ctx.lineTo(
            19,
            -10
        );

        ctx.lineTo(
            16,
            14
        );

        ctx.lineTo(
            -16,
            14
        );

        ctx.closePath();

        ctx.fill();

    }

    else if (selectedAnimal === "CAT") {

        ctx.fillStyle =
            "#b9b9c5";

        ctx.beginPath();

        ctx.moveTo(
            -19,
            -8
        );

        ctx.lineTo(
            -16,
            -24
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
            -24
        );

        ctx.lineTo(
            19,
            -8
        );

        ctx.lineTo(
            15,
            15
        );

        ctx.lineTo(
            -15,
            15
        );

        ctx.closePath();

        ctx.fill();

    }

    else {

        ctx.fillStyle =
            "#f2f2f2";

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
            -8,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.beginPath();

        ctx.arc(
            12,
            -8,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    // eyes

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


// --------------------------------------------------
// BACKGROUND
// --------------------------------------------------

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
        settings.background
    );

    gradient.addColorStop(
        1,
        settings.background2
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // road

    ctx.fillStyle =
        "rgba(255,255,255,.035)";

    ctx.fillRect(
        45,
        0,
        270,
        canvas.height
    );


    // lane lines

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


    // Level 2 speed streaks

    if (level === 2) {

        ctx.strokeStyle =
            "rgba(255,80,100,.25)";

        ctx.lineWidth =
            2;

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const x =
                (i * 37 + elapsed * 80) %
                canvas.width;

            const y =
                (i * 83 + elapsed * 170) %
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


    // Level 3 trees

    if (level === 3) {

        drawTree(
            18,
            105,
            0.8
        );

        drawTree(
            340,
            160,
            0.65
        );

        drawTree(
            20,
            300,
            0.55
        );

        drawTree(
            342,
            340,
            0.8
        );

    }

}


// --------------------------------------------------
// TREE
// --------------------------------------------------

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
        15,
        12,
        35
    );

    ctx.fillStyle =
        "#2e7138";

    ctx.beginPath();

    ctx.arc(
        0,
        5,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "#3f8c45";

    ctx.beginPath();

    ctx.arc(
        -14,
        -3,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        14,
        -3,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

}


// --------------------------------------------------
// PARTICLES
// --------------------------------------------------

function createHitParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 14;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            vx:
                (Math.random() - 0.5) *
                220,

            vy:
                (Math.random() - 0.5) *
                220,

            life: 0.5,

            size:
                3 +
                Math.random() * 5

        });

    }

}


function updateParticles(dt) {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.x +=
            p.vx * dt;

        p.y +=
            p.vy * dt;

        p.life -=
            dt;

        p.vy +=
            350 * dt;

        if (p.life <= 0) {

            particles.splice(
                i,
                1
            );

        }

    }

}


function drawParticles() {

    particles.forEach(
        function(p) {

            ctx.globalAlpha =
                Math.max(
                    0,
                    p.life * 2
                );

            ctx.fillStyle =
                "#ffffff";

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

    ctx.globalAlpha =
        1;

}


// --------------------------------------------------
// ATTACK
// --------------------------------------------------

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


    // Find nearest obstacle
    // in the player's lane.

    let target = null;

    let targetIndex = -1;

    let closestDistance =
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
            obstacle.y > 250 &&
            obstacle.y < 410 &&
            distance >= 0 &&
            distance < closestDistance
        ) {

            closestDistance =
                distance;

            target =
                obstacle;

            targetIndex =
                i;

        }

    }


    // No target:
    // do NOT waste a strike.

    if (!target) {

        gameMessage.textContent =
            "NO TARGET";

        return;

    }


    // Remove obstacle.

    obstacles.splice(
        targetIndex,
        1
    );

    strikes--;

    createHitParticles(
        target.x,
        target.y
    );


    // Perfect hit

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


    if (strikeDisplay) {

        strikeDisplay.textContent =
            `STRIKES ×${strikes}`;

    }

}


// --------------------------------------------------
// COLLISION
// --------------------------------------------------

function checkCollision(
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


// --------------------------------------------------
// MOVE PLAYER
// --------------------------------------------------

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


// --------------------------------------------------
// CONTROLS
// --------------------------------------------------

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


// --------------------------------------------------
// TOUCH SWIPE
// --------------------------------------------------

let touchStartX = 0;

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

        const endX =
            event.changedTouches[0].clientX;

        const distance =
            endX -
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


// --------------------------------------------------
// START BUTTON
// --------------------------------------------------

startButton.addEventListener(
    "click",
    startGame
);


// --------------------------------------------------
// UPDATE
// --------------------------------------------------

function update(dt) {

    elapsed +=
        dt;

    attackCooldown =
        Math.max(
            0,
            attackCooldown - dt
        );


    // Multiplier

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


    // Player movement

    const targetX =
        laneX(targetLane);

    player.x +=
        (
            targetX -
            player.x
        ) *
        Math.min(
            1,
            player.moveSpeed * dt
        );


    // Speed increases

    const currentSpeed =
        Math.min(
            settings.maxSpeed,
            settings.startSpeed +
            elapsed * 1.5
        );


    // Spawn

    spawnTimer -=
        dt;

    if (spawnTimer <= 0) {

        spawnObstacle();

        const spawnDelay =
            Math.max(
                settings.spawnMin,
                settings.spawnStart -
                elapsed * 0.004
            ) +
            Math.random() *
            settings.spawnRandom;

        spawnTimer =
            spawnDelay;

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
            (
                currentSpeed +
                obstacle.speed -
                settings.startSpeed
            ) *
            dt;


        if (
            checkCollision(
                obstacle
            )
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

}


// --------------------------------------------------
// DRAW
// --------------------------------------------------

function draw() {

    drawBackground();

    obstacles.forEach(
        drawObstacle
    );

    drawParticles();

    drawPlayer();

}


// --------------------------------------------------
// GAME LOOP
// --------------------------------------------------

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


// --------------------------------------------------
// INITIAL SCREEN
// --------------------------------------------------

overlay.style.display =
    "flex";

overlayTitle.textContent =
    "1M.";

if (level === 1) {

    overlayText.innerHTML =
        "Dodge. Survive.<br>Beat your best.";

    startButton.textContent =
        "▶ START RUN";

}

if (level === 2) {

    overlayText.innerHTML =
        "Dodge. Destroy.<br>You have 3 strikes.";

    startButton.textContent =
        "▶ START RUSH";

}

if (level === 3) {

    overlayText.innerHTML =
        "Choose your animal.<br>Dodge. Destroy. Survive.";

    startButton.textContent =
        `▶ START AS ${selectedAnimal}`;

}


// --------------------------------------------------
// INITIAL DRAW
// --------------------------------------------------

draw();
