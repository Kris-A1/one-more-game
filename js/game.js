const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const multiplierElement = document.getElementById("multiplier");
const strikesElement = document.getElementById("strikes");
const attackCountElement = document.getElementById("attackCount");

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
const animalCards = document.querySelectorAll(".animal-card");

const levelName = document.getElementById("levelName");
const gameMessage = document.getElementById("gameMessage");


/* =========================
   LEVEL SETUP
========================= */

const params = new URLSearchParams(window.location.search);

let level = Number(params.get("level")) || 1;

if (level < 1 || level > 10) {
  level = 1;
}


/*
  LEVELS 1–3 ARE THE ORIGINAL
  FOUNDATION.

  LEVELS 4–10 continue the same
  mechanics and visual language.
*/

const LEVELS = {

  /* =========================
     ORIGINAL LEVEL 1
  ========================= */

  1: {
    name: "NEON RUN",
    label: "LEVEL 1",
    background: "#080d22",
    playerColor: "#42f5ff",
    obstacleColor: "#ff3b81",
    speed: 175,
    maxSpeed: 245,
    attack: false,
    strikes: 0
  },


  /* =========================
     ORIGINAL LEVEL 2
  ========================= */

  2: {
    name: "NEON RUSH",
    label: "LEVEL 2",
    background: "#12081e",
    playerColor: "#64a8ff",
    obstacleColor: "#ff4d65",
    speed: 205,
    maxSpeed: 275,
    attack: true,
    strikes: 3
  },


  /* =========================
     ORIGINAL LEVEL 3
  ========================= */

  3: {
    name: "ANIMAL RUN",
    label: "LEVEL 3",
    background: "#0a1912",
    playerColor: "#ffe66b",
    obstacleColor: "#b77b46",
    speed: 220,
    maxSpeed: 295,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 4
  ========================= */

  4: {
    name: "JUNGLE RUN",
    label: "LEVEL 4",
    background: "#071b12",
    playerColor: "#8cff75",
    obstacleColor: "#70452a",
    speed: 235,
    maxSpeed: 275,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 5
  ========================= */

  5: {
    name: "OCEAN RUN",
    label: "LEVEL 5",
    background: "#06243a",
    playerColor: "#7ee7ff",
    obstacleColor: "#ff785c",
    speed: 245,
    maxSpeed: 285,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 6
  ========================= */

  6: {
    name: "DESERT RUN",
    label: "LEVEL 6",
    background: "#3b210c",
    playerColor: "#ffe16b",
    obstacleColor: "#7a4a2a",
    speed: 255,
    maxSpeed: 295,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 7
  ========================= */

  7: {
    name: "VOLCANO RUN",
    label: "LEVEL 7",
    background: "#1b0606",
    playerColor: "#ffcf4a",
    obstacleColor: "#ff5a36",
    speed: 265,
    maxSpeed: 305,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 8
  ========================= */

  8: {
    name: "SPACE RUN",
    label: "LEVEL 8",
    background: "#050512",
    playerColor: "#9ad7ff",
    obstacleColor: "#c76cff",
    speed: 275,
    maxSpeed: 315,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 9
  ========================= */

  9: {
    name: "ICE RUN",
    label: "LEVEL 9",
    background: "#071a2a",
    playerColor: "#ffffff",
    obstacleColor: "#73d7ff",
    speed: 285,
    maxSpeed: 325,
    attack: true,
    strikes: 3
  },


  /* =========================
     LEVEL 10
  ========================= */

  10: {
    name: "FINAL RUN",
    label: "LEVEL 10",
    background: "#06131a",
    playerColor: "#72f5d0",
    obstacleColor: "#ffdc5e",
    speed: 295,
    maxSpeed: 340,
    attack: true,
    strikes: 3
  }

};


const settings = LEVELS[level];


/* =========================
   STATE
========================= */

let canvasWidth = 360;
let canvasHeight = 560;

let running = false;
let gameOver = false;

let score = 0;

let bestScore = Number(
  localStorage.getItem(`1M_best_level_${level}`) || 0
);

let multiplier = 1;

let strikes = settings.strikes;

let selectedAnimal = "BUNNY";

let lane = 1;
let targetLane = 1;

let obstacles = [];
let particles = [];

let spawnTimer = 0;
let lastTime = 0;
let elapsed = 0;

let currentSpeed = settings.speed;

let animationId = null;


/* =========================
   RESIZE
========================= */

function resizeCanvas() {

  const rect = canvas.getBoundingClientRect();

  const dpr =
    Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth =
    Math.max(320, rect.width);

  canvasHeight =
    Math.max(420, rect.height);

  canvas.width =
    canvasWidth * dpr;

  canvas.height =
    canvasHeight * dpr;

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}

window.addEventListener(
  "resize",
  resizeCanvas
);


/* =========================
   LEVEL UI
========================= */

function setupLevelUI() {

  levelName.textContent =
    settings.name;

  overlayLabel.textContent =
    settings.label;

  bestScoreElement.textContent =
    bestScore;


  /*
    LEVEL 1
  */

  if (level === 1) {

    overlayTitle.textContent =
      "NEON RUN";

    overlayText.innerHTML =
      "Dodge everything.<br>How long can you survive?";

    animalChooser.classList.add("hidden");

    strikeDisplay.classList.add("hidden");

    attackButton.classList.add("hidden");

    attackInstruction.classList.add("hidden");

    startButton.textContent =
      "▶ START";
  }


  /*
    LEVEL 2
  */

  if (level === 2) {

    overlayTitle.textContent =
      "NEON RUSH";

    overlayText.innerHTML =
      "Dodge or destroy obstacles.<br>You have 3 strikes.";

    animalChooser.classList.add("hidden");

    strikeDisplay.classList.remove("hidden");

    attackButton.classList.remove("hidden");

    attackInstruction.classList.remove("hidden");

    startButton.textContent =
      "▶ START";
  }


  /*
    LEVEL 3
  */

  if (level === 3) {

    overlayTitle.textContent =
      "ANIMAL RUN";

    overlayText.innerHTML =
      "Choose your runner.<br>Dodge or destroy obstacles.";

    animalChooser.classList.remove("hidden");

    strikeDisplay.classList.remove("hidden");

    attackButton.classList.remove("hidden");

    attackInstruction.classList.remove("hidden");

    startButton.textContent =
      `▶ START AS ${selectedAnimal}`;
  }


  /*
    LEVELS 4–10
  */

  if (level >= 4) {

    animalChooser.classList.add("hidden");

    strikeDisplay.classList.remove("hidden");

    attackButton.classList.remove("hidden");

    attackInstruction.classList.remove("hidden");

    overlayTitle.textContent =
      settings.name;

    overlayText.innerHTML =
      getLevelDescription();

    startButton.textContent =
      "▶ START RUN";
  }


  updateStrikeUI();
}


/* =========================
   LEVEL DESCRIPTIONS
========================= */

function getLevelDescription() {

  switch (level) {

    case 4:
      return "Run through the jungle.<br>Dodge or destroy obstacles.";

    case 5:
      return "Race through the ocean.<br>Dodge or destroy obstacles.";

    case 6:
      return "Cross the desert.<br>Dodge or destroy obstacles.";

    case 7:
      return "Survive the volcano.<br>Dodge or destroy obstacles.";

    case 8:
      return "Enter deep space.<br>Dodge or destroy obstacles.";

    case 9:
      return "Race across the ice.<br>Dodge or destroy obstacles.";

    case 10:
      return "The final run.<br>Everything is faster.";

    default:
      return "Dodge or destroy obstacles.";
  }
}


/* =========================
   STRIKE UI
========================= */

function updateStrikeUI() {

  if (!settings.attack) {
    return;
  }

  strikesElement.textContent =
    `×${strikes}`;

  attackCountElement.textContent =
    `×${strikes}`;

  if (strikes <= 0) {

    attackButton.style.opacity =
      "0.4";

  } else {

    attackButton.style.opacity =
      "1";
  }
}


/* =========================
   ANIMAL SELECTOR
========================= */

animalCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      if (
        level !== 3 ||
        running
      ) {
        return;
      }

      animalCards.forEach(
        other => {
          other.classList.remove(
            "selected"
          );
        }
      );

      card.classList.add(
        "selected"
      );

      selectedAnimal =
        card.dataset.animal;

      startButton.textContent =
        `▶ START AS ${selectedAnimal}`;

      draw();
    }
  );

});


/* =========================
   GAME START
========================= */

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

  gameMessage.textContent =
    "";

  overlay.style.display =
    "none";

  updateHUD();
  updateStrikeUI();

  lastTime =
    performance.now();

  if (animationId) {

    cancelAnimationFrame(
      animationId
    );
  }

  animationId =
    requestAnimationFrame(
      gameLoop
    );
}


/* =========================
   GAME LOOP
========================= */

function gameLoop(time) {

  if (!running) {
    return;
  }

  const delta =
    Math.min(
      (time - lastTime) / 1000,
      0.035
    );

  lastTime = time;

  elapsed += delta;

  update(delta);

  draw();

  animationId =
    requestAnimationFrame(
      gameLoop
    );
}


/* =========================
   UPDATE
========================= */

function update(delta) {

  /*
    Difficulty increases gradually.
  */

  const difficulty =
    Math.min(
      elapsed / 70,
      1
    );

  currentSpeed =
    settings.speed +
    (
      settings.maxSpeed -
      settings.speed
    ) *
    difficulty;


  /*
    Multiplier every 10 seconds.
  */

  multiplier =
    Math.min(
      1 +
      Math.floor(elapsed / 10),
      9
    );


  /*
    Score.
  */

  score +=
    delta *
    10 *
    multiplier;


  /*
    Smooth lane movement.
  */

  lane +=
    (
      targetLane -
      lane
    ) *
    Math.min(
      delta * 12,
      1
    );


  /*
    Spawn obstacles.
  */

  spawnTimer -= delta;

  const spawnInterval =
    getSpawnInterval();

  if (spawnTimer <= 0) {

    spawnObstacle();

    spawnTimer =
      spawnInterval *
      (
        0.85 +
        Math.random() * 0.25
      );
  }


  /*
    Move obstacles.
  */

  for (
    let i = obstacles.length - 1;
    i >= 0;
    i--
  ) {

    const obstacle =
      obstacles[i];

    obstacle.y +=
      currentSpeed *
      delta;


    /*
      Passed player.
    */

    if (
      obstacle.y >
      canvasHeight + 80
    ) {

      obstacles.splice(
        i,
        1
      );

      score +=
        10 *
        multiplier;

      continue;
    }


    /*
      Collision.
    */

    if (
      obstacle.y >
        canvasHeight - 155 &&
      obstacle.y <
        canvasHeight - 70 &&
      Math.abs(
        obstacle.lane -
        lane
      ) < 0.34
    ) {

      endGame();

      return;
    }
  }


  /*
    Particles.
  */

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const particle =
      particles[i];

    particle.x +=
      particle.vx *
      delta;

    particle.y +=
      particle.vy *
      delta;

    particle.vy +=
      300 *
      delta;

    particle.life -=
      delta;

    if (
      particle.life <= 0
    ) {

      particles.splice(
        i,
        1
      );
    }
  }


  updateHUD();
}


/* =========================
   SPAWN DIFFICULTY
========================= */

function getSpawnInterval() {

  /*
    Original levels keep the
    original timing behavior.
  */

  if (level <= 3) {

    return Math.max(
      0.45,
      0.88 -
      elapsed * 0.004
    );
  }


  /*
    Later levels become gradually
    more aggressive.
  */

  const base =
    0.88 -
    (
      level - 3
    ) *
    0.045;

  const reduction =
    elapsed *
    (
      0.004 +
      (
        level - 3
      ) *
      0.00025
    );

  const minimum =
    Math.max(
      0.18,
      0.45 -
      (
        level - 3
      ) *
      0.035
    );

  return Math.max(
    minimum,
    base - reduction
  );
}


/* =========================
   OBSTACLES
========================= */

function spawnObstacle() {

  /*
    Three-lane system remains
    exactly the same.
  */

  const laneChoice =
    Math.floor(
      Math.random() * 3
    );


  obstacles.push({

    lane:
      laneChoice,

    y:
      -45,

    size:
      30 +
      Math.random() * 8

  });


  /*
    Later levels introduce
    more frequent two-obstacle
    patterns.
  */

  let secondChance = 0.16;

  if (level >= 4) {
    secondChance =
      0.18 +
      (level - 4) *
      0.025;
  }


  if (
    elapsed > 22 &&
    Math.random() <
      secondChance
  ) {

    let secondLane =
      Math.floor(
        Math.random() * 3
      );

    if (
      secondLane ===
      laneChoice
    ) {

      secondLane =
        (
          secondLane + 1
        ) % 3;
    }


    obstacles.push({

      lane:
        secondLane,

      y:
        -120,

      size:
        27 +
        Math.random() * 7

    });
  }


  /*
    Levels 7–10 occasionally
    create a third obstacle
    pattern, but never fill all
    three lanes at once.
  */

  if (
    level >= 7 &&
    elapsed > 30 &&
    Math.random() <
      0.08 +
      (
        level - 7
      ) * 0.018
  ) {

    let thirdLane =
      Math.floor(
        Math.random() * 3
      );

    while (
      thirdLane ===
      laneChoice
    ) {

      thirdLane =
        Math.floor(
          Math.random() * 3
        );
    }

    obstacles.push({

      lane:
        thirdLane,

      y:
        -200,

      size:
        25 +
        Math.random() * 6

    });
  }
}


/* =========================
   ATTACK
========================= */

function attack() {

  if (!running) {
    return;
  }

  if (!settings.attack) {
    return;
  }

  if (strikes <= 0) {

    gameMessage.textContent =
      "NO STRIKES LEFT — DODGE!";

    return;
  }


  /*
    Find nearest obstacle
    in player's lane.
  */

  let target = null;
  let targetIndex = -1;
  let bestDistance =
    Infinity;


  for (
    let i = 0;
    i < obstacles.length;
    i++
  ) {

    const obstacle =
      obstacles[i];

    if (
      Math.abs(
        obstacle.lane -
        lane
      ) < 0.38 &&
      obstacle.y >
        canvasHeight - 330 &&
      obstacle.y <
        canvasHeight - 45
    ) {

      const distance =
        Math.abs(
          obstacle.y -
          (
            canvasHeight -
            115
          )
        );

      if (
        distance <
        bestDistance
      ) {

        bestDistance =
          distance;

        target =
          obstacle;

        targetIndex =
          i;
      }
    }
  }


  if (!target) {

    gameMessage.textContent =
      "MISS";

    return;
  }


  const perfect =
    bestDistance < 65;


  createExplosion(
    laneX(
      target.lane
    ),
    target.y,
    perfect
  );


  obstacles.splice(
    targetIndex,
    1
  );

  strikes--;


  score +=
    perfect
      ? 70 * multiplier
      : 40 * multiplier;


  gameMessage.textContent =
    perfect
      ? "PERFECT HIT!"
      : "NICE HIT!";


  updateStrikeUI();
}


/* =========================
   MOVEMENT
========================= */

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


/* =========================
   COLLISION / GAME OVER
========================= */

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


  bestScoreElement.textContent =
    bestScore;


  createExplosion(
    laneX(lane),
    canvasHeight - 115,
    false
  );


  draw();


  overlay.style.display =
    "flex";


  overlayLabel.textContent =
    "RUN OVER";


  overlayTitle.textContent =
    finalScore > 0
      ? `${finalScore}`
      : "0";


  overlayText.innerHTML =
    `BEST ${bestScore}<br><br>Ready for one more?`;


  if (level === 3) {

    startButton.textContent =
      `▶ RUN AS ${selectedAnimal}`;

  } else {

    startButton.textContent =
      "▶ TRY AGAIN";
  }


  gameMessage.textContent =
    "ONE MORE.";


  /*
    Keep the original unlock
    messages for the first levels.
  */

  if (
    level === 1 &&
    elapsed >= 30
  ) {

    gameMessage.textContent =
      "LEVEL 2 UNLOCK CONDITION REACHED";
  }


  if (
    level === 2 &&
    elapsed >= 45
  ) {

    gameMessage.textContent =
      "LEVEL 3 UNLOCK CONDITION REACHED";
  }
}


/* =========================
   HUD
========================= */

function updateHUD() {

  scoreElement.textContent =
    Math.floor(score);

  multiplierElement.textContent =
    `x${multiplier}`;


  if (settings.attack) {

    strikesElement.textContent =
      `×${strikes}`;

    attackCountElement.textContent =
      `×${strikes}`;
  }
}


/* =========================
   DRAW
========================= */

function draw() {

  ctx.clearRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /*
    Main background.
  */

  ctx.fillStyle =
    settings.background;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /*
    World.
  */

  drawBackground();


  /*
    Track.
  */

  drawTrack();


  /*
    Obstacles.
  */

  obstacles.forEach(
    drawObstacle
  );


  /*
    Player.
  */

  drawPlayer();


  /*
    Particles.
  */

  particles.forEach(
    drawParticle
  );
}


/* =========================
   BACKGROUND
========================= */

function drawBackground() {


  /* =========================
     LEVEL 1
  ========================= */

  if (level === 1) {

    ctx.save();

    ctx.globalAlpha =
      0.25;

    for (
      let i = 0;
      i < 18;
      i++
    ) {

      const x =
        (
          i * 83
        ) % canvasWidth;

      const h =
        40 +
        (
          i * 31
        ) % 120;


      ctx.fillStyle =
        i % 2 === 0
          ? "#132b4f"
          : "#21133c";


      ctx.fillRect(
        x,
        canvasHeight -
          150 -
          h,
        48,
        h
      );
    }

    ctx.restore();
  }


  /* =========================
     LEVEL 2
  ========================= */

  if (level === 2) {

    ctx.save();

    ctx.globalAlpha =
      0.22;

    for (
      let i = 0;
      i < 22;
      i++
    ) {

      const x =
        (
          i * 67
        ) % canvasWidth;

      const h =
        50 +
        (
          i * 37
        ) % 150;


      ctx.fillStyle =
        i % 2 === 0
          ? "#45144d"
          : "#162c54";


      ctx.fillRect(
        x,
        canvasHeight -
          150 -
          h,
        38,
        h
      );
    }

    ctx.restore();
  }


  /* =========================
     LEVEL 3
  ========================= */

  if (level === 3) {

    ctx.save();

    ctx.globalAlpha =
      0.35;

    for (
      let i = 0;
      i < 12;
      i++
    ) {

      const x =
        (
          i * 91
        ) % canvasWidth;

      const y =
        70 +
        (
          i * 43
        ) % 210;

      drawTree(
        x,
        y
      );
    }

    ctx.restore();
  }


  /* =========================
     LEVEL 4 — JUNGLE
  ========================= */

  if (level === 4) {

    drawJungleBackground();
  }


  /* =========================
     LEVEL 5 — OCEAN
  ========================= */

  if (level === 5) {

    drawOceanBackground();
  }


  /* =========================
     LEVEL 6 — DESERT
  ========================= */

  if (level === 6) {

    drawDesertBackground();
  }


  /* =========================
     LEVEL 7 — VOLCANO
  ========================= */

  if (level === 7) {

    drawVolcanoBackground();
  }


  /* =========================
     LEVEL 8 — SPACE
  ========================= */

  if (level === 8) {

    drawSpaceBackground();
  }


  /* =========================
     LEVEL 9 — ICE
  ========================= */

  if (level === 9) {

    drawIceBackground();
  }


  /* =========================
     LEVEL 10 — FINAL
  ========================= */

  if (level === 10) {

    drawFinalBackground();
  }
}


/* =========================
   JUNGLE BACKGROUND
========================= */

function drawJungleBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.35;


  /*
    Jungle trees.
  */

  for (
    let i = 0;
    i < 14;
    i++
  ) {

    const x =
      (
        i * 71
      ) % canvasWidth;

    const y =
      50 +
      (
        i * 57
      ) % 220;


    ctx.fillStyle =
      "#102d1b";

    ctx.fillRect(
      x - 5,
      y + 15,
      10,
      70
    );


    ctx.fillStyle =
      i % 2 === 0
        ? "#174a28"
        : "#1d5b31";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      30,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  /*
    Hanging vines.
  */

  ctx.strokeStyle =
    "#27663a";

  ctx.lineWidth =
    4;

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const x =
      20 +
      (
        i * 59
      ) % canvasWidth;

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.quadraticCurveTo(
      x - 12,
      45,
      x + 5,
      90
    );

    ctx.stroke();
  }

  ctx.restore();
}


/* =========================
   OCEAN BACKGROUND
========================= */

function drawOceanBackground() {

  ctx.save();

  /*
    Bubbles.
  */

  ctx.globalAlpha =
    0.30;

  for (
    let i = 0;
    i < 24;
    i++
  ) {

    const x =
      (
        i * 67
      ) % canvasWidth;

    const y =
      25 +
      (
        i * 91
      ) % 300;

    const radius =
      3 +
      (
        i % 5
      );


    ctx.strokeStyle =
      "#9beeff";

    ctx.lineWidth =
      1.5;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }


  /*
    Seaweed.
  */

  ctx.globalAlpha =
    0.45;

  ctx.strokeStyle =
    "#155e62";

  ctx.lineWidth =
    5;

  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const x =
      (
        i * 47
      ) % canvasWidth;

    ctx.beginPath();

    ctx.moveTo(
      x,
      canvasHeight - 145
    );

    ctx.quadraticCurveTo(
      x - 12,
      canvasHeight - 185,
      x + 4,
      canvasHeight - 225
    );

    ctx.stroke();
  }

  ctx.restore();
}


/* =========================
   DESERT BACKGROUND
========================= */

function drawDesertBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.35;


  /*
    Distant dunes.
  */

  ctx.fillStyle =
    "#7e461d";

  ctx.beginPath();

  ctx.moveTo(
    0,
    canvasHeight - 180
  );

  ctx.quadraticCurveTo(
    canvasWidth * 0.25,
    canvasHeight - 250,
    canvasWidth * 0.5,
    canvasHeight - 185
  );

  ctx.quadraticCurveTo(
    canvasWidth * 0.75,
    canvasHeight - 120,
    canvasWidth,
    canvasHeight - 200
  );

  ctx.lineTo(
    canvasWidth,
    canvasHeight
  );

  ctx.lineTo(
    0,
    canvasHeight
  );

  ctx.closePath();

  ctx.fill();


  /*
    Cacti.
  */

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const x =
      (
        i * 67
      ) % canvasWidth;

    const y =
      100 +
      (
        i * 41
      ) % 180;

    drawCactus(
      x,
      y
    );
  }

  ctx.restore();
}


/* =========================
   VOLCANO BACKGROUND
========================= */

function drawVolcanoBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.45;


  /*
    Mountains.
  */

  ctx.fillStyle =
    "#330d0d";

  ctx.beginPath();

  ctx.moveTo(
    0,
    canvasHeight - 150
  );

  ctx.lineTo(
    75,
    170
  );

  ctx.lineTo(
    145,
    canvasHeight - 150
  );

  ctx.lineTo(
    220,
    125
  );

  ctx.lineTo(
    320,
    canvasHeight - 150
  );

  ctx.lineTo(
    canvasWidth,
    170
  );

  ctx.lineTo(
    canvasWidth,
    canvasHeight
  );

  ctx.lineTo(
    0,
    canvasHeight
  );

  ctx.closePath();

  ctx.fill();


  /*
    Lava glow.
  */

  ctx.strokeStyle =
    "#ff542e";

  ctx.lineWidth =
    5;

  ctx.globalAlpha =
    0.5;

  ctx.beginPath();

  ctx.moveTo(
    30,
    canvasHeight - 175
  );

  ctx.quadraticCurveTo(
    90,
    canvasHeight - 200,
    145,
    canvasHeight - 170
  );

  ctx.quadraticCurveTo(
    205,
    canvasHeight - 135,
    280,
    canvasHeight - 175
  );

  ctx.stroke();


  /*
    Flying embers.
  */

  ctx.fillStyle =
    "#ffb33b";

  ctx.globalAlpha =
    0.65;

  for (
    let i = 0;
    i < 20;
    i++
  ) {

    const x =
      (
        i * 59
      ) % canvasWidth;

    const y =
      35 +
      (
        i * 73
      ) % 260;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      2 +
      (i % 3),
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}


/* =========================
   SPACE BACKGROUND
========================= */

function drawSpaceBackground() {

  ctx.save();

  /*
    Stars.
  */

  for (
    let i = 0;
    i < 55;
    i++
  ) {

    const x =
      (
        i * 47
      ) % canvasWidth;

    const y =
      (
        i * 83
      ) % (
        canvasHeight - 100
      );

    const size =
      1 +
      (
        i % 3
      );

    ctx.globalAlpha =
      0.35 +
      (
        i % 4
      ) * 0.12;

    ctx.fillStyle =
      "#ffffff";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  /*
    Distant planets.
  */

  ctx.globalAlpha =
    0.25;

  ctx.fillStyle =
    "#6945b5";

  ctx.beginPath();

  ctx.arc(
    65,
    120,
    34,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#376c98";

  ctx.beginPath();

  ctx.arc(
    canvasWidth - 55,
    230,
    23,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}


/* =========================
   ICE BACKGROUND
========================= */

function drawIceBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.35;


  /*
    Ice mountains.
  */

  ctx.fillStyle =
    "#b8efff";

  ctx.beginPath();

  ctx.moveTo(
    0,
    canvasHeight - 155
  );

  ctx.lineTo(
    55,
    185
  );

  ctx.lineTo(
    115,
    canvasHeight - 155
  );

  ctx.lineTo(
    190,
    145
  );

  ctx.lineTo(
    270,
    canvasHeight - 155
  );

  ctx.lineTo(
    330,
    205
  );

  ctx.lineTo(
    canvasWidth,
    canvasHeight - 155
  );

  ctx.lineTo(
    canvasWidth,
    canvasHeight
  );

  ctx.lineTo(
    0,
    canvasHeight
  );

  ctx.closePath();

  ctx.fill();


  /*
    Snow / ice particles.
  */

  ctx.fillStyle =
    "#ffffff";

  for (
    let i = 0;
    i < 28;
    i++
  ) {

    const x =
      (
        i * 53
      ) % canvasWidth;

    const y =
      (
        i * 67
      ) % 320;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      2 +
      (i % 3),
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}


/* =========================
   FINAL BACKGROUND
========================= */

function drawFinalBackground() {

  ctx.save();

  /*
    Final level combines
    several visual elements
    from the earlier worlds.
  */

  ctx.globalAlpha =
    0.22;


  /*
    Neon towers.
  */

  for (
    let i = 0;
    i < 14;
    i++
  ) {

    const x =
      (
        i * 71
      ) % canvasWidth;

    const h =
      60 +
      (
        i * 29
      ) % 140;

    ctx.fillStyle =
      i % 2 === 0
        ? "#1b4b55"
        : "#273a65";

    ctx.fillRect(
      x,
      canvasHeight -
        155 -
        h,
      35,
      h
    );
  }


  /*
    Final glowing particles.
  */

  ctx.globalAlpha =
    0.6;

  for (
    let i = 0;
    i < 18;
    i++
  ) {

    const x =
      (
        i * 61
      ) % canvasWidth;

    const y =
      50 +
      (
        i * 47
      ) % 260;

    ctx.fillStyle =
      i % 2 === 0
        ? "#72f5d0"
        : "#ffdc5e";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      2 +
      (i % 3),
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}


/* =========================
   TRACK
========================= */

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


  /*
    Lane separators.
  */

  ctx.save();

  ctx.strokeStyle =
    "rgba(255,255,255,0.055)";

  ctx.lineWidth =
    1;


  for (
    let i = 1;
    i < 3;
    i++
  ) {

    const x =
      canvasWidth / 3 * i;

    ctx.beginPath();

    ctx.moveTo(
      x,
      trackTop
    );

    ctx.lineTo(
      x,
      canvasHeight
    );

    ctx.stroke();
  }

  ctx.restore();
}


/* =========================
   PLAYER
========================= */

function drawPlayer() {

  const x =
    laneX(lane);

  const y =
    canvasHeight - 112;


  /*
    Level 3 keeps the original
    animal system.

    Levels 4–10 also use the
    selected animal as the
    player's visual identity,
    but the selection screen
    remains unique to Level 3.
  */

  if (level >= 3) {

    drawAnimal(
      x,
      y,
      selectedAnimal
    );

    return;
  }


  /*
    Original runner.
  */

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    20;

  ctx.shadowColor =
    settings.playerColor;

  ctx.fillStyle =
    settings.playerColor;

  ctx.beginPath();

  ctx.roundRect(
    -17,
    -22,
    34,
    44,
    11
  );

  ctx.fill();


  /*
    Eyes.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#07101b";

  ctx.beginPath();

  ctx.arc(
    -6,
    -5,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    6,
    -5,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Runner legs.
  */

  ctx.strokeStyle =
    "#07101b";

  ctx.lineWidth =
    4;

  ctx.beginPath();

  ctx.moveTo(
    -7,
    18
  );

  ctx.lineTo(
    -12,
    27
  );

  ctx.moveTo(
    7,
    18
  );

  ctx.lineTo(
    12,
    27
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================
   ANIMALS
========================= */

function drawAnimal(
  x,
  y,
  animal
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );


  /*
    Later levels give the animal
    a subtle world-colored glow.
  */

  ctx.shadowBlur =
    level >= 4
      ? 20
      : 18;

  ctx.shadowColor =
    level >= 4
      ? settings.playerColor
      : "#ffe66b";


  /*
    Body.
  */

  ctx.fillStyle =
    level >= 4
      ? settings.playerColor
      : "#ffe66b";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    22,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.shadowBlur =
    0;


  /*
    Ears.
  */

  ctx.fillStyle =
    level >= 4
      ? settings.playerColor
      : "#ffe66b";


  if (
    animal === "BUNNY"
  ) {

    roundedRect(
      ctx,
      -15,
      -42,
      10,
      25,
      5
    );

    roundedRect(
      ctx,
      5,
      -42,
      10,
      25,
      5
    );
  }


  if (
    animal === "FOX"
  ) {

    triangle(
      ctx,
      -19,
      -10,
      -5,
      -40,
      4,
      -10
    );

    triangle(
      ctx,
      19,
      -10,
      5,
      -40,
      -4,
      -10
    );
  }


  if (
    animal === "CAT"
  ) {

    triangle(
      ctx,
      -19,
      -10,
      -7,
      -37,
      3,
      -10
    );

    triangle(
      ctx,
      19,
      -10,
      7,
      -37,
      -3,
      -10
    );
  }


  if (
    animal === "PANDA"
  ) {

    ctx.fillStyle =
      "#20242b";

    ctx.beginPath();

    ctx.arc(
      -15,
      -17,
      8,
      0,
      Math.PI * 2
    );

    ctx.arc(
      15,
      -17,
      8,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  /*
    Eyes.
  */

  ctx.fillStyle =
    "#10131a";

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


  /*
    Nose.
  */

  ctx.beginPath();

  ctx.arc(
    0,
    5,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Legs.
  */

  ctx.strokeStyle =
    "#10131a";

  ctx.lineWidth =
    4;

  ctx.beginPath();

  ctx.moveTo(
    -9,
    18
  );

  ctx.lineTo(
    -14,
    28
  );

  ctx.moveTo(
    9,
    18
  );

  ctx.lineTo(
    14,
    28
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================
   OBSTACLE DRAW
========================= */

function drawObstacle(
  obstacle
) {

  const x =
    laneX(
      obstacle.lane
    );

  const y =
    obstacle.y;

  const size =
    obstacle.size;


  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    settings.obstacleColor;

  ctx.fillStyle =
    settings.obstacleColor;


  /* =========================
     LEVEL 1
  ========================= */

  if (level === 1) {

    ctx.beginPath();

    ctx.roundRect(
      -size / 2,
      -size / 2,
      size,
      size,
      8
    );

    ctx.fill();
  }


  /* =========================
     LEVEL 2
  ========================= */

  if (level === 2) {

    ctx.rotate(
      Math.PI / 4
    );

    ctx.fillRect(
      -size / 2,
      -size / 2,
      size,
      size
    );
  }


  /* =========================
     LEVEL 3
  ========================= */

  if (level === 3) {

    drawRockObstacle(
      size
    );
  }


  /* =========================
     LEVEL 4 — JUNGLE
  ========================= */

  if (level === 4) {

    drawJungleObstacle(
      size
    );
  }


  /* =========================
     LEVEL 5 — OCEAN
  ========================= */

  if (level === 5) {

    drawOceanObstacle(
      size
    );
  }


  /* =========================
     LEVEL 6 — DESERT
  ========================= */

  if (level === 6) {

    drawDesertObstacle(
      size
    );
  }


  /* =========================
     LEVEL 7 — VOLCANO
  ========================= */

  if (level === 7) {

    drawVolcanoObstacle(
      size
    );
  }


  /* =========================
     LEVEL 8 — SPACE
  ========================= */

  if (level === 8) {

    drawSpaceObstacle(
      size
    );
  }


  /* =========================
     LEVEL 9 — ICE
  ========================= */

  if (level === 9) {

    drawIceObstacle(
      size
    );
  }


  /* =========================
     LEVEL 10 — FINAL
  ========================= */

  if (level === 10) {

    drawFinalObstacle(
      size
    );
  }


  ctx.restore();
}


/* =========================
   ORIGINAL ROCK
========================= */

function drawRockObstacle(
  size
) {

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.5,
    size * 0.15
  );

  ctx.lineTo(
    -size * 0.25,
    -size * 0.45
  );

  ctx.lineTo(
    size * 0.25,
    -size * 0.55
  );

  ctx.lineTo(
    size * 0.55,
    0
  );

  ctx.lineTo(
    size * 0.25,
    size * 0.48
  );

  ctx.lineTo(
    -size * 0.4,
    size * 0.4
  );

  ctx.closePath();

  ctx.fill();
}


/* =========================
   JUNGLE OBSTACLE
========================= */

function drawJungleObstacle(
  size
) {

  /*
    Fallen log.
  */

  ctx.fillStyle =
    settings.obstacleColor;

  ctx.beginPath();

  ctx.roundRect(
    -size * 0.65,
    -size * 0.35,
    size * 1.3,
    size * 0.7,
    8
  );

  ctx.fill();


  /*
    Cut end.
  */

  ctx.fillStyle =
    "#a87945";

  ctx.beginPath();

  ctx.arc(
    size * 0.5,
    0,
    size * 0.32,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================
   OCEAN OBSTACLE
========================= */

function drawOceanObstacle(
  size
) {

  /*
    Coral.
  */

  ctx.fillStyle =
    settings.obstacleColor;

  ctx.beginPath();

  ctx.arc(
    0,
    size * 0.25,
    size * 0.38,
    Math.PI,
    Math.PI * 2
  );

  ctx.lineTo(
    size * 0.38,
    size * 0.45
  );

  ctx.lineTo(
    size * 0.15,
    size * 0.45
  );

  ctx.lineTo(
    0,
    size * 0.65
  );

  ctx.lineTo(
    -size * 0.15,
    size * 0.45
  );

  ctx.lineTo(
    -size * 0.38,
    size * 0.45
  );

  ctx.closePath();

  ctx.fill();


  /*
    Small coral branches.
  */

  ctx.lineWidth =
    4;

  ctx.strokeStyle =
    settings.obstacleColor;

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.2,
    0
  );

  ctx.lineTo(
    -size * 0.4,
    -size * 0.45
  );

  ctx.moveTo(
    size * 0.2,
    0
  );

  ctx.lineTo(
    size * 0.42,
    -size * 0.42
  );

  ctx.stroke();
}


/* =========================
   DESERT OBSTACLE
========================= */

function drawDesertObstacle(
  size
) {

  /*
    Cactus.
  */

  ctx.fillStyle =
    settings.obstacleColor;

  ctx.beginPath();

  ctx.roundRect(
    -size * 0.18,
    -size * 0.65,
    size * 0.36,
    size * 1.3,
    7
  );

  ctx.fill();


  ctx.fillRect(
    -size * 0.55,
    -size * 0.15,
    size * 0.32,
    size * 0.18
  );

  ctx.fillRect(
    size * 0.23,
    -size * 0.38,
    size * 0.32,
    size * 0.18
  );
}


/* =========================
   VOLCANO OBSTACLE
========================= */

function drawVolcanoObstacle(
  size
) {

  /*
    Hot lava rock.
  */

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.55,
    size * 0.35
  );

  ctx.lineTo(
    -size * 0.3,
    -size * 0.45
  );

  ctx.lineTo(
    0,
    -size * 0.6
  );

  ctx.lineTo(
    size * 0.42,
    -size * 0.25
  );

  ctx.lineTo(
    size * 0.58,
    size * 0.35
  );

  ctx.lineTo(
    size * 0.1,
    size * 0.55
  );

  ctx.closePath();

  ctx.fill();


  /*
    Lava cracks.
  */

  ctx.strokeStyle =
    "#ffd34a";

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.2,
    -size * 0.35
  );

  ctx.lineTo(
    0,
    0
  );

  ctx.lineTo(
    -size * 0.08,
    size * 0.3
  );

  ctx.moveTo(
    size * 0.2,
    -size * 0.25
  );

  ctx.lineTo(
    size * 0.08,
    0
  );

  ctx.stroke();
}


/* =========================
   SPACE OBSTACLE
========================= */

function drawSpaceObstacle(
  size
) {

  /*
    Meteor.
  */

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    size * 0.52,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Meteor craters.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "rgba(30,10,50,0.5)";

  ctx.beginPath();

  ctx.arc(
    -size * 0.18,
    -size * 0.12,
    size * 0.13,
    0,
    Math.PI * 2
  );

  ctx.arc(
    size * 0.2,
    size * 0.16,
    size * 0.1,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================
   ICE OBSTACLE
========================= */

function drawIceObstacle(
  size
) {

  /*
    Ice crystal.
  */

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size * 0.7
  );

  ctx.lineTo(
    size * 0.45,
    -size * 0.15
  );

  ctx.lineTo(
    size * 0.3,
    size * 0.6
  );

  ctx.lineTo(
    0,
    size * 0.4
  );

  ctx.lineTo(
    -size * 0.3,
    size * 0.6
  );

  ctx.lineTo(
    -size * 0.45,
    -size * 0.15
  );

  ctx.closePath();

  ctx.fill();
}


/* =========================
   FINAL OBSTACLE
========================= */

function drawFinalObstacle(
  size
) {

  /*
    Final glowing crystal.
  */

  ctx.rotate(
    Math.PI / 4
  );

  ctx.fillRect(
    -size * 0.42,
    -size * 0.42,
    size * 0.84,
    size * 0.84
  );


  /*
    Inner core.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#ffffff";

  ctx.fillRect(
    -size * 0.13,
    -size * 0.13,
    size * 0.26,
    size * 0.26
  );
}


/* =========================
   PARTICLES
========================= */

function createExplosion(
  x,
  y,
  perfect
) {

  const count =
    perfect
      ? 20
      : 14;


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;

    const speed =
      70 +
      Math.random() *
      180;


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
        Math.random() *
        0.45,

      size:
        2 +
        Math.random() *
        4
    });
  }
}


function drawParticle(
  particle
) {

  ctx.save();

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

  ctx.restore();
}


/* =========================
   ORIGINAL FOREST
========================= */

function drawTree(
  x,
  y
) {

  ctx.save();

  ctx.fillStyle =
    "#10291c";

  ctx.fillRect(
    x - 4,
    y + 20,
    8,
    38
  );

  ctx.fillStyle =
    "#173c26";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    25,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}


/* =========================
   CACTUS
========================= */

function drawCactus(
  x,
  y
) {

  ctx.save();

  ctx.fillStyle =
    "#315b25";

  ctx.fillRect(
    x - 5,
    y,
    10,
    50
  );

  ctx.fillRect(
    x - 19,
    y + 16,
    14,
    7
  );

  ctx.fillRect(
    x + 5,
    y + 28,
    14,
    7
  );

  ctx.restore();
}


/* =========================
   HELPERS
========================= */

function laneX(
  laneValue
) {

  const laneWidth =
    canvasWidth / 3;

  return (
    laneWidth *
      laneValue +
    laneWidth / 2
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

  context.beginPath();

  context.roundRect(
    x,
    y,
    width,
    height,
    radius
  );

  context.fill();
}


function triangle(
  context,
  x1,
  y1,
  x2,
  y2,
  x3,
  y3
) {

  context.beginPath();

  context.moveTo(
    x1,
    y1
  );

  context.lineTo(
    x2,
    y2
  );

  context.lineTo(
    x3,
    y3
  );

  context.closePath();

  context.fill();
}


/* =========================
   BUTTON CONTROLS
========================= */

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
  startGame
);


/* =========================
   KEYBOARD
========================= */

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
      event.code === "Space" ||
      event.key === "ArrowUp"
    ) {

      event.preventDefault();

      attack();
    }
  }
);


/* =========================
   SWIPE
========================= */

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

    if (!running) {
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


    if (
      Math.abs(dx) > 35 &&
      Math.abs(dx) >
        Math.abs(dy)
    ) {

      if (dx < 0) {

        moveLeft();

      } else {

        moveRight();
      }

      return;
    }


    /*
      Tap = attack.
    */

    if (
      Math.abs(dx) < 25 &&
      Math.abs(dy) < 25
    ) {

      attack();
    }
  },
  {
    passive: true
  }
);


/* =========================
   INITIAL DRAW
========================= */

resizeCanvas();

setupLevelUI();

updateHUD();

draw();
