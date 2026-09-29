// ============================================================
// 1M GAME
// LEVEL 1 = NEON RUN
// LEVEL 2 = NEON RUSH
// LEVEL 3 = ANIMAL RUN
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


// ------------------------------------------------------------
// LEVEL
// ------------------------------------------------------------

const params =
    new URLSearchParams(
        window.location.search
    );

const level =
    Math.min(
        3,
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

    }

};


const settings =
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
// INITIAL UI
// ------------------------------------------------------------

levelSubtitle.textContent =
    `LEVEL ${level} · ${settings.name}`;

bestScoreEl.textContent =
    bestScore;


// ------------------------------------------------------------
// LEVEL 1 UI
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// LEVEL 2 UI
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// LEVEL 3 UI
// ------------------------------------------------------------

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
        "▶ START AS BUNNY";

}


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

                startButton.textContent =
                    `▶ START AS ${selectedAnimal}`;

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
// GAME OVER
// ------------------------------------------------------------

function endGame() {

    gameRunning =
        false;


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
            Math.PI

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


    // LEVEL 1
    // Pink neon blocks

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


    // LEVEL 2
    // Red warning diamonds

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


    // LEVEL 3
    // Forest rocks

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
// START BUTTON
// ------------------------------------------------------------

startButton.addEventListener(
    "click",
    function() {

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
