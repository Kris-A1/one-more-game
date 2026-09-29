/* =========================================================
   1M — COMPLETE GAME
   MASTER VISUAL STYLE
   Levels 1–10
   ========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");

const multiplierElement =
  document.getElementById("multiplierDisplay");

const strikeDisplay =
  document.getElementById("strikeDisplay");

const overlay =
  document.getElementById("gameOverlay");

const overlayLabel =
  document.querySelector(".overlay-label");

const overlayTitle =
  document.getElementById("overlayTitle");

const overlayText =
  document.getElementById("overlayText");

const startButton =
  document.getElementById("startButton");

const leftButton =
  document.getElementById("leftButton");

const rightButton =
  document.getElementById("rightButton");

const attackButton =
  document.getElementById("attackButton");

const animalChooser =
  document.getElementById("animalChooser");

const animalCards =
  document.querySelectorAll(".animal-button");

const levelSubtitle =
  document.getElementById("levelSubtitle");

const gameMessage =
  document.getElementById("gameMessage");


/* =========================================================
   LEVEL SETUP
   ========================================================= */

const params =
  new URLSearchParams(window.location.search);

let level =
  Number(params.get("level")) || 1;

if (level < 1 || level > 10) {
  level = 1;
}


const LEVELS = {

  1: {
    name: "NEON RUN",
    label: "LEVEL 1",
    world: "neon",
    background: "#080d22",
    playerColor: "#42f5ff",
    obstacleColor: "#ff3b81",
    speed: 175,
    maxSpeed: 245,
    attack: false,
    strikes: 0,
    character: "RUNNER"
  },

  2: {
    name: "NEON RUSH",
    label: "LEVEL 2",
    world: "neon",
    background: "#12081e",
    playerColor: "#64a8ff",
    obstacleColor: "#ff4d65",
    speed: 205,
    maxSpeed: 275,
    attack: true,
    strikes: 3,
    character: "RUNNER"
  },

  3: {
    name: "ANIMAL RUN",
    label: "LEVEL 3",
    world: "animal",
    background: "#0a1912",
    playerColor: "#ffe66b",
    obstacleColor: "#b77b46",
    speed: 220,
    maxSpeed: 295,
    attack: true,
    strikes: 3,
    character: "ANIMAL",
    characters: [
      ["BUNNY", "🐰"],
      ["FOX", "🦊"],
      ["CAT", "🐱"],
      ["PANDA", "🐼"]
    ]
  },

  4: {
    name: "ANIMAL RUSH",
    label: "LEVEL 4",
    world: "animal",
    background: "#07150e",
    playerColor: "#ffe66b",
    obstacleColor: "#d88b48",
    speed: 250,
    maxSpeed: 330,
    attack: true,
    strikes: 3,
    character: "ANIMAL",
    characters: [
      ["BUNNY", "🐰"],
      ["FOX", "🦊"],
      ["CAT", "🐱"],
      ["PANDA", "🐼"]
    ]
  },

  5: {
    name: "FRUIT RUN",
    label: "LEVEL 5",
    world: "fruit",
    background: "#24130d",
    playerColor: "#ff6f61",
    obstacleColor: "#ffb347",
    speed: 260,
    maxSpeed: 340,
    attack: true,
    strikes: 3,
    character: "FRUIT",
    characters: [
      ["WATERMELON", "🍉"],
      ["PINEAPPLE", "🍍"],
      ["STRAWBERRY", "🍓"],
      ["PEACH", "🍑"]
    ]
  },

  6: {
    name: "OCEAN",
    label: "LEVEL 6",
    world: "ocean",
    background: "#061a2b",
    playerColor: "#43e8ff",
    obstacleColor: "#ff6b9d",
    speed: 270,
    maxSpeed: 350,
    attack: true,
    strikes: 5,
    character: "FISH"
  },

  7: {
    name: "DESERT",
    label: "LEVEL 7",
    world: "desert",
    background: "#29180b",
    playerColor: "#ffd95a",
    obstacleColor: "#d88b4b",
    speed: 280,
    maxSpeed: 360,
    attack: true,
    strikes: 5,
    character: "SUN"
  },

  8: {
    name: "FOREST",
    label: "LEVEL 8",
    world: "forest",
    background: "#07170d",
    playerColor: "#72ef6a",
    obstacleColor: "#795438",
    speed: 290,
    maxSpeed: 370,
    attack: true,
    strikes: 5,
    character: "PLANT"
  },

  9: {
    name: "SPACE",
    label: "LEVEL 9",
    world: "space",
    background: "#050511",
    playerColor: "#a8b8ff",
    obstacleColor: "#ff6b5e",
    speed: 300,
    maxSpeed: 385,
    attack: true,
    strikes: 5,
    character: "ROBOT"
  },

  10: {
    name: "ANTARCTICA",
    label: "LEVEL 10",
    world: "ice",
    background: "#081923",
    playerColor: "#dff9ff",
    obstacleColor: "#79d7ff",
    speed: 310,
    maxSpeed: 395,
    attack: true,
    strikes: 5,
    character: "ICE CUBE"
  }

};


const settings = LEVELS[level];


/* =========================================================
   STATE
   ========================================================= */

let canvasWidth = 360;
let canvasHeight = 490;

let running = false;
let gameOver = false;

let score = 0;

let bestScore =
  Number(
    localStorage.getItem(
      `1M_best_level_${level}`
    ) || 0
  );

let multiplier = 1;

let strikes =
  settings.strikes;

let selectedCharacter =
  settings.characters
    ? settings.characters[0][0]
    : "BUNNY";

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


/* =========================================================
   RESIZE
   ========================================================= */

function resizeCanvas() {

  const rect =
    canvas.getBoundingClientRect();

  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

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

  draw();
}

window.addEventListener(
  "resize",
  resizeCanvas
);


/* =========================================================
   LEVEL UI
   ========================================================= */

function setupLevelUI() {

  levelSubtitle.textContent =
    `${settings.label} · ${settings.name}`;

  bestScoreElement.textContent =
    bestScore;


  /*
    Character selector.
  */

  if (
    settings.characters
  ) {

    animalChooser.style.display =
      "block";

    updateCharacterCards();

  } else {

    animalChooser.style.display =
      "none";
  }


  /*
    Strike UI.
  */

  if (settings.attack) {

    strikeDisplay.style.display =
      "block";

    attackButton.style.display =
      "flex";

  } else {

    strikeDisplay.style.display =
      "none";

    attackButton.style.display =
      "none";
  }


  /*
    Overlay.
  */

  overlayLabel.textContent =
    settings.label;

  overlayTitle.textContent =
    settings.name;


  if (level === 1) {

    overlayText.innerHTML =
      "Dodge everything.<br>How long can you survive?";

    startButton.textContent =
      "▶ START RUN";

  }


  if (level === 2) {

    overlayText.innerHTML =
      "Dodge or destroy obstacles.<br>You have 3 strikes.";

    startButton.textContent =
      "▶ START RUN";

  }


  if (level === 3) {

    overlayText.innerHTML =
      "Choose your runner.<br>Dodge or destroy obstacles.";

    startButton.textContent =
      `▶ START AS ${selectedCharacter}`;

  }


  if (level === 4) {

    overlayText.innerHTML =
      "Faster. Harder.<br>Can you survive the rush?";

    startButton.textContent =
      `▶ START AS ${selectedCharacter}`;

  }


  if (level === 5) {

    overlayText.innerHTML =
      "Pick your fruit.<br>Then survive the rush.";

    startButton.textContent =
      `▶ START AS ${selectedCharacter}`;

  }


  if (level === 6) {

    overlayText.innerHTML =
      "Dive through the ocean.<br>Watch the coral.";

    startButton.textContent =
      "▶ START RUN";

  }


  if (level === 7) {

    overlayText.innerHTML =
      "Cross the desert.<br>Don't get buried.";

    startButton.textContent =
      "▶ START RUN";

  }


  if (level === 8) {

    overlayText.innerHTML =
      "The forest is alive.<br>Keep moving.";

    startButton.textContent =
      "▶ START RUN";

  }


  if (level === 9) {

    overlayText.innerHTML =
      "No gravity. No mercy.<br>Avoid the comets.";

    startButton.textContent =
      "▶ START RUN";

  }


  if (level === 10) {

    overlayText.innerHTML =
      "Frozen ground.<br>One mistake is enough.";

    startButton.textContent =
      "▶ START RUN";

  }


  updateStrikeUI();
}


/* =========================================================
   CHARACTER CARDS
   ========================================================= */

function updateCharacterCards() {

  if (!settings.characters) {
    return;
  }

  animalCards.forEach(
    (card, index) => {

      const character =
        settings.characters[index];

      if (!character) {
        card.style.display =
          "none";
        return;
      }

      card.style.display =
        "flex";

      const emoji =
        card.querySelector(
          ".animal-emoji"
        );

      const name =
        card.querySelector(
          ".animal-name"
        );

      if (emoji) {
        emoji.textContent =
          character[1];
      }

      if (name) {
        name.textContent =
          character[0];
      }

      card.dataset.animal =
        character[0];

      card.classList.toggle(
        "selected",
        character[0] ===
        selectedCharacter
      );
    }
  );
}


animalCards.forEach(
  card => {

    card.addEventListener(
      "click",
      () => {

        if (
          !settings.characters ||
          running
        ) {
          return;
        }

        selectedCharacter =
          card.dataset.animal;

        animalCards.forEach(
          other =>
            other.classList.remove(
              "selected"
            )
        );

        card.classList.add(
          "selected"
        );

        startButton.textContent =
          `▶ START AS ${selectedCharacter}`;

        draw();
      }
    );
  }
);


/* =========================================================
   STRIKE UI
   ========================================================= */

function updateStrikeUI() {

  if (!settings.attack) {
    return;
  }

  strikeDisplay.textContent =
    `STRIKES ×${strikes}`;

  attackButton.innerHTML =
    `<span>💥</span><small>STRIKE ×${strikes}</small>`;

  attackButton.style.opacity =
    strikes <= 0
      ? "0.4"
      : "1";
}


/* =========================================================
   GAME START
   ========================================================= */

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

  spawnTimer = 0.25;
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


/* =========================================================
   GAME LOOP
   ========================================================= */

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


/* =========================================================
   UPDATE
   ========================================================= */

function update(delta) {

  /*
    Difficulty curve.

    Every level starts harder than
    the previous level.
  */

  const difficulty =
    Math.min(
      elapsed / 75,
      1
    );

  currentSpeed =
    settings.speed +
    (
      settings.maxSpeed -
      settings.speed
    ) * difficulty;


  /*
    Multiplier every 10 seconds.
  */

  multiplier =
    Math.min(
      1 +
      Math.floor(
        elapsed / 10
      ),
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
    Smooth movement.
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
    Spawn.
  */

  spawnTimer -= delta;

  const spawnInterval =
    Math.max(
      0.39,
      0.88 -
      elapsed * 0.004
    );

  if (
    spawnTimer <= 0
  ) {

    spawnObstacle();

    spawnTimer =
      spawnInterval *
      (
        0.82 +
        Math.random() *
        0.25
      );
  }


  /*
    Obstacles.
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
        obstacle.lane - lane
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


/* =========================================================
   OBSTACLE SPAWN
   ========================================================= */

function spawnObstacle() {

  const laneChoice =
    Math.floor(
      Math.random() * 3
    );

  obstacles.push({

    lane:
      laneChoice,

    y:
      -55,

    size:
      30 +
      Math.random() * 8
  });


  /*
    Two-obstacle patterns.
  */

  const secondChance =
    level >= 4
      ? 0.23
      : 0.16;

  if (
    elapsed > 18 &&
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
        (secondLane + 1) % 3;
    }

    obstacles.push({

      lane:
        secondLane,

      y:
        -145,

      size:
        27 +
        Math.random() * 7
    });
  }
}


/* =========================================================
   ATTACK
   ========================================================= */

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
        obstacle.lane - lane
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
    laneX(target.lane),
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


/* =========================================================
   MOVEMENT
   ========================================================= */

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


/* =========================================================
   GAME OVER
   ========================================================= */

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
    finalScore;


  overlayText.innerHTML =
    `BEST ${bestScore}<br><br>Ready for one more?`;


  if (
    settings.characters
  ) {

    startButton.textContent =
      `▶ RUN AS ${selectedCharacter}`;

  } else {

    startButton.textContent =
      "▶ TRY AGAIN";
  }


  gameMessage.textContent =
    "ONE MORE.";
}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

  scoreElement.textContent =
    Math.floor(score);

  multiplierElement.textContent =
    `×${multiplier}`;


  if (settings.attack) {

    strikeDisplay.textContent =
      `STRIKES ×${strikes}`;
  }
}


/* =========================================================
   DRAW
   ========================================================= */

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

  obstacles.forEach(
    drawObstacle
  );

  drawPlayer();

  particles.forEach(
    drawParticle
  );
}


/* =========================================================
   WORLD BACKGROUNDS
   SAME CLEAN 1M STYLE
   ========================================================= */

function drawBackground() {

  if (
    level === 1 ||
    level === 2
  ) {

    drawNeonBackground();
    return;
  }


  if (
    level === 3 ||
    level === 4
  ) {

    drawAnimalBackground();
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
  }
}


/* =========================================================
   NEON
   ========================================================= */

function drawNeonBackground() {

  ctx.save();

  const glow =
    ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight * 0.35,
      10,
      canvasWidth / 2,
      canvasHeight * 0.35,
      canvasWidth * 0.75
    );

  glow.addColorStop(
    0,
    level === 1
      ? "rgba(70,180,255,0.15)"
      : "rgba(210,70,255,0.14)"
  );

  glow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = glow;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  ctx.globalAlpha =
    0.22;


  for (
    let i = 0;
    i < 15;
    i++
  ) {

    const x =
      (i * 83) %
      canvasWidth;

    const h =
      45 +
      (
        (i * 31) %
        130
      );

    ctx.fillStyle =
      i % 2 === 0
        ? "#132b4f"
        : "#21133c";

    ctx.fillRect(
      x,
      canvasHeight -
        150 -
        h,
      42,
      h
    );
  }


  ctx.restore();
}


/* =========================================================
   ANIMAL FOREST
   ========================================================= */

function drawAnimalBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.30;


  for (
    let i = 0;
    i < 10;
    i++
  ) {

    const x =
      (i * 91) %
      canvasWidth;

    const y =
      80 +
      (
        (i * 43) %
        190
      );

    drawSmallTree(
      x,
      y
    );
  }


  ctx.restore();
}


function drawSmallTree(
  x,
  y
) {

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
}


/* =========================================================
   FRUIT
   ========================================================= */

function drawFruitBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.13;


  for (
    let i = 0;
    i < 18;
    i++
  ) {

    const x =
      (i * 61) %
      canvasWidth;

    const y =
      45 +
      (
        (i * 77) %
        230
      );

    const r =
      10 +
      (
        i % 3
      ) * 5;


    ctx.fillStyle =
      [
        "#ff4d6d",
        "#ffca3a",
        "#8ac926",
        "#ff924c"
      ][
        i % 4
      ];


    ctx.beginPath();

    ctx.arc(
      x,
      y,
      r,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  ctx.restore();
}


/* =========================================================
   OCEAN
   ========================================================= */

function drawOceanBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.16;


  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const x =
      (i * 73) %
      canvasWidth;

    const y =
      60 +
      (
        (i * 83) %
        250
      );

    ctx.strokeStyle =
      "#45dff5";

    ctx.lineWidth =
      2;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      8 +
      (i % 3) * 6,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }


  /*
    Coral silhouettes.
  */

  ctx.globalAlpha =
    0.18;

  ctx.strokeStyle =
    "#ff6394";

  ctx.lineWidth =
    5;

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const x =
      25 +
      i *
      78;

    const base =
      canvasHeight -
      150;

    ctx.beginPath();

    ctx.moveTo(
      x,
      base
    );

    ctx.lineTo(
      x,
      base - 30
    );

    ctx.lineTo(
      x - 10,
      base - 52
    );

    ctx.moveTo(
      x,
      base - 30
    );

    ctx.lineTo(
      x + 13,
      base - 48
    );

    ctx.stroke();
  }


  ctx.restore();
}


/* =========================================================
   DESERT
   ========================================================= */

function drawDesertBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.16;


  for (
    let i = 0;
    i < 7;
    i++
  ) {

    const x =
      i * 70;

    const y =
      120 +
      (
        i % 3
      ) * 35;

    ctx.fillStyle =
      "#d49a5a";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      42,
      Math.PI,
      Math.PI * 2
    );

    ctx.fill();
  }


  ctx.restore();
}


/* =========================================================
   FOREST
   ========================================================= */

function drawForestBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.22;


  for (
    let i = 0;
    i < 11;
    i++
  ) {

    const x =
      (i * 81) %
      canvasWidth;

    const y =
      70 +
      (
        (i * 49) %
        200
      );

    drawDeepTree(
      x,
      y
    );
  }


  ctx.restore();
}


function drawDeepTree(
  x,
  y
) {

  ctx.fillStyle =
    "#173b25";

  ctx.fillRect(
    x - 5,
    y + 18,
    10,
    50
  );


  ctx.fillStyle =
    "#1d5331";

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


/* =========================================================
   SPACE
   ========================================================= */

function drawSpaceBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.7;


  for (
    let i = 0;
    i < 55;
    i++
  ) {

    const x =
      (i * 47) %
      canvasWidth;

    const y =
      (i * 83) %
      canvasHeight;

    const r =
      i % 4 === 0
        ? 1.5
        : 0.7;


    ctx.fillStyle =
      "#ffffff";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      r,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  ctx.restore();
}


/* =========================================================
   ICE
   ========================================================= */

function drawIceBackground() {

  ctx.save();

  ctx.globalAlpha =
    0.15;

  ctx.fillStyle =
    "#8cecff";


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const x =
      (i * 74) %
      canvasWidth;

    const y =
      80 +
      (
        (i * 67) %
        210
      );

    ctx.beginPath();

    ctx.moveTo(
      x,
      y - 35
    );

    ctx.lineTo(
      x + 25,
      y + 20
    );

    ctx.lineTo(
      x - 20,
      y + 20
    );

    ctx.closePath();

    ctx.fill();
  }


  ctx.restore();
}


/* =========================================================
   TRACK
   ========================================================= */

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


/* =========================================================
   PLAYER
   ========================================================= */

function drawPlayer() {

  const x =
    laneX(lane);

  const y =
    canvasHeight - 112;


  if (
    level === 1 ||
    level === 2
  ) {

    drawRunner(
      x,
      y
    );

    return;
  }


  if (
    level === 3 ||
    level === 4
  ) {

    drawAnimal(
      x,
      y,
      selectedCharacter
    );

    return;
  }


  if (level === 5) {

    drawFruit(
      x,
      y,
      selectedCharacter
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

    drawPlant(
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
  }
}


/* =========================================================
   RUNNER
   ORIGINAL STYLE
   ========================================================= */

function drawRunner(
  x,
  y
) {

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


/* =========================================================
   ANIMALS
   ORIGINAL STYLE
   ========================================================= */

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

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    "#ffe66b";


  /*
    Bunny.
  */

  if (
    animal === "BUNNY"
  ) {

    drawBunny();
  }


  /*
    Fox.
  */

  if (
    animal === "FOX"
  ) {

    drawFox();
  }


  /*
    Cat.
  */

  if (
    animal === "CAT"
  ) {

    drawCat();
  }


  /*
    Panda.
  */

  if (
    animal === "PANDA"
  ) {

    drawPanda();
  }


  ctx.restore();
}


/* =========================================================
   BUNNY
   ========================================================= */

function drawBunny() {

  ctx.fillStyle =
    "#ffe66b";


  roundedRect(
    ctx,
    -15,
    -45,
    10,
    28,
    5
  );

  roundedRect(
    ctx,
    5,
    -45,
    10,
    28,
    5
  );


  drawAnimalBody(
    "#ffe66b"
  );
}


/* =========================================================
   FOX
   ========================================================= */

function drawFox() {

  ctx.fillStyle =
    "#ff9a4d";


  triangle(
    ctx,
    -20,
    -9,
    -7,
    -42,
    3,
    -9
  );

  triangle(
    ctx,
    20,
    -9,
    7,
    -42,
    -3,
    -9
  );


  drawAnimalBody(
    "#ff9a4d"
  );
}


/* =========================================================
   CAT
   ========================================================= */

function drawCat() {

  ctx.fillStyle =
    "#9aa8b7";


  triangle(
    ctx,
    -20,
    -9,
    -7,
    -39,
    3,
    -9
  );

  triangle(
    ctx,
    20,
    -9,
    7,
    -39,
    -3,
    -9
  );


  drawAnimalBody(
    "#9aa8b7"
  );
}


/* =========================================================
   PANDA
   ========================================================= */

function drawPanda() {

  drawAnimalBody(
    "#f5f5f5"
  );


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


/* =========================================================
   ANIMAL BODY
   ========================================================= */

function drawAnimalBody(
  color
) {

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    color;

  ctx.fillStyle =
    color;

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


  ctx.beginPath();

  ctx.arc(
    0,
    5,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


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
}


/* =========================================================
   FRUITS
   ========================================================= */

function drawFruit(
  x,
  y,
  fruit
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );


  if (
    fruit === "WATERMELON"
  ) {

    drawWatermelon();
  }


  if (
    fruit === "PINEAPPLE"
  ) {

    drawPineapple();
  }


  if (
    fruit === "STRAWBERRY"
  ) {

    drawStrawberry();
  }


  if (
    fruit === "PEACH"
  ) {

    drawPeach();
  }


  ctx.restore();
}


/* =========================================================
   WATERMELON
   ========================================================= */

function drawWatermelon() {

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    "#55e878";

  ctx.fillStyle =
    "#58e878";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    24,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#ff5d73";

  ctx.beginPath();

  ctx.arc(
    0,
    1,
    17,
    0,
    Math.PI * 2
  );

  ctx.fill();


  drawFruitFace();
}


/* =========================================================
   PINEAPPLE
   ========================================================= */

function drawPineapple() {

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    "#ffd34d";

  ctx.fillStyle =
    "#ffd34d";

  ctx.beginPath();

  ctx.roundRect(
    -19,
    -21,
    38,
    43,
    12
  );

  ctx.fill();


  ctx.fillStyle =
    "#5be06d";

  triangle(
    ctx,
    -13,
    -18,
    -8,
    -38,
    -1,
    -19
  );

  triangle(
    ctx,
    0,
    -19,
    7,
    -40,
    11,
    -17
  );


  drawFruitFace();
}


/* =========================================================
   STRAWBERRY
   ========================================================= */

function drawStrawberry() {

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    "#ff5474";

  ctx.fillStyle =
    "#ff5474";

  ctx.beginPath();

  ctx.moveTo(
    -23,
    -12
  );

  ctx.quadraticCurveTo(
    0,
    -28,
    23,
    -12
  );

  ctx.quadraticCurveTo(
    19,
    18,
    0,
    27
  );

  ctx.quadraticCurveTo(
    -19,
    18,
    -23,
    -12
  );

  ctx.fill();


  ctx.fillStyle =
    "#63e46e";

  triangle(
    ctx,
    -12,
    -12,
    -5,
    -29,
    0,
    -15
  );

  triangle(
    ctx,
    0,
    -14,
    7,
    -31,
    12,
    -10
  );


  drawFruitFace();
}


/* =========================================================
   PEACH
   ========================================================= */

function drawPeach() {

  ctx.shadowBlur =
    18;

  ctx.shadowColor =
    "#ff9c6b";

  ctx.fillStyle =
    "#ff9c6b";

  ctx.beginPath();

  ctx.arc(
    -9,
    1,
    17,
    0,
    Math.PI * 2
  );

  ctx.arc(
    9,
    1,
    17,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#5fcf68";

  ctx.beginPath();

  ctx.ellipse(
    5,
    -22,
    7,
    3,
    -0.5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  drawFruitFace();
}


/* =========================================================
   FRUIT FACE
   ========================================================= */

function drawFruitFace() {

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#17131a";

  ctx.beginPath();

  ctx.arc(
    -7,
    -2,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    7,
    -2,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    "#17131a";

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.arc(
    0,
    5,
    6,
    0.2,
    Math.PI - 0.2
  );

  ctx.stroke();
}


/* =========================================================
   FISH
   ========================================================= */

function drawFish(
  x,
  y
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    20;

  ctx.shadowColor =
    "#43e8ff";


  /*
    Tail.
  */

  ctx.fillStyle =
    "#ff709f";

  ctx.beginPath();

  ctx.moveTo(
    18,
    0
  );

  ctx.lineTo(
    35,
    -15
  );

  ctx.lineTo(
    35,
    15
  );

  ctx.closePath();

  ctx.fill();


  /*
    Body.
  */

  ctx.fillStyle =
    "#43e8ff";

  ctx.beginPath();

  ctx.ellipse(
    -2,
    0,
    27,
    19,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Belly.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#c9f9ff";

  ctx.beginPath();

  ctx.ellipse(
    -7,
    6,
    14,
    9,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Fin.
  */

  ctx.fillStyle =
    "#ff709f";

  ctx.beginPath();

  ctx.moveTo(
    -2,
    -13
  );

  ctx.lineTo(
    8,
    -29
  );

  ctx.lineTo(
    15,
    -10
  );

  ctx.closePath();

  ctx.fill();


  /*
    Eye.
  */

  ctx.fillStyle =
    "#10131a";

  ctx.beginPath();

  ctx.arc(
    -13,
    -5,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Smile.
  */

  ctx.strokeStyle =
    "#10131a";

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.arc(
    -4,
    2,
    8,
    0.15,
    1.1
  );

  ctx.stroke();


  ctx.restore();
}


/* =========================================================
   SUN
   ========================================================= */

function drawSun(
  x,
  y
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    22;

  ctx.shadowColor =
    "#ffd95a";

  ctx.strokeStyle =
    "#ffd95a";

  ctx.lineWidth =
    5;


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


  ctx.fillStyle =
    "#ffd95a";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    23,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#3b2a0b";

  ctx.beginPath();

  ctx.arc(
    -7,
    -3,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    7,
    -3,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    "#3b2a0b";

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.arc(
    0,
    3,
    7,
    0.15,
    Math.PI - 0.15
  );

  ctx.stroke();


  ctx.restore();
}


/* =========================================================
   PLANT
   ========================================================= */

function drawPlant(
  x,
  y
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    20;

  ctx.shadowColor =
    "#72ef6a";


  /*
    Pot.
  */

  ctx.fillStyle =
    "#c66a45";

  ctx.beginPath();

  ctx.roundRect(
    -18,
    5,
    36,
    25,
    7
  );

  ctx.fill();


  /*
    Stem.
  */

  ctx.strokeStyle =
    "#72ef6a";

  ctx.lineWidth =
    5;

  ctx.beginPath();

  ctx.moveTo(
    0,
    8
  );

  ctx.lineTo(
    0,
    -18
  );

  ctx.stroke();


  /*
    Leaves.
  */

  ctx.fillStyle =
    "#72ef6a";

  ctx.beginPath();

  ctx.ellipse(
    -12,
    -18,
    14,
    7,
    -0.45,
    0,
    Math.PI * 2
  );

  ctx.ellipse(
    12,
    -28,
    14,
    7,
    0.45,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Face.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#1b3020";

  ctx.beginPath();

  ctx.arc(
    -7,
    15,
    2.5,
    0,
    Math.PI * 2
  );

  ctx.arc(
    7,
    15,
    2.5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.restore();
}


/* =========================================================
   ROBOT
   ========================================================= */

function drawRobot(
  x,
  y
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    22;

  ctx.shadowColor =
    "#9baaff";


  /*
    Antenna.
  */

  ctx.strokeStyle =
    "#9baaff";

  ctx.lineWidth =
    4;

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
    "#ff6b6b";

  ctx.beginPath();

  ctx.arc(
    0,
    -38,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /*
    Head.
  */

  ctx.fillStyle =
    "#aebcff";

  ctx.beginPath();

  ctx.roundRect(
    -23,
    -24,
    46,
    39,
    9
  );

  ctx.fill();


  /*
    Face.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "#141827";

  ctx.beginPath();

  ctx.arc(
    -9,
    -5,
    4,
    0,
    Math.PI * 2
  );

  ctx.arc(
    9,
    -5,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillRect(
    -10,
    7,
    20,
    3
  );


  /*
    Body.
  */

  ctx.fillStyle =
    "#6d7aa9";

  ctx.beginPath();

  ctx.roundRect(
    -18,
    15,
    36,
    20,
    6
  );

  ctx.fill();


  /*
    Legs.
  */

  ctx.strokeStyle =
    "#9baaff";

  ctx.lineWidth =
    5;

  ctx.beginPath();

  ctx.moveTo(
    -9,
    34
  );

  ctx.lineTo(
    -12,
    44
  );

  ctx.moveTo(
    9,
    34
  );

  ctx.lineTo(
    12,
    44
  );

  ctx.stroke();


  ctx.restore();
}


/* =========================================================
   ICE CUBE
   ========================================================= */

function drawIceCube(
  x,
  y
) {

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.shadowBlur =
    22;

  ctx.shadowColor =
    "#79d7ff";


  /*
    Main cube.
  */

  ctx.fillStyle =
    "#bcefff";

  ctx.beginPath();

  ctx.roundRect(
    -23,
    -23,
    46,
    46,
    10
  );

  ctx.fill();


  /*
    Inner blue facets.
  */

  ctx.shadowBlur =
    0;

  ctx.fillStyle =
    "rgba(90,190,235,0.35)";

  ctx.beginPath();

  ctx.moveTo(
    -20,
    -5
  );

  ctx.lineTo(
    0,
    -18
  );

  ctx.lineTo(
    18,
    -5
  );

  ctx.lineTo(
    0,
    5
  );

  ctx.closePath();

  ctx.fill();


  /*
    Face.
  */

  ctx.fillStyle =
    "#173344";

  ctx.beginPath();

  ctx.arc(
    -8,
    2,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    8,
    2,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    "#173344";

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.arc(
    0,
    8,
    7,
    0.15,
    Math.PI - 0.15
  );

  ctx.stroke();


  ctx.restore();
}


/* =========================================================
   OBSTACLE DRAWING
   SAME SIMPLE ARCADE LANGUAGE
   ========================================================= */

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


  /*
    Level 1 block.
  */

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


  /*
    Level 2 diamond.
  */

  else if (level === 2) {

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


  /*
    Animal rocks.
  */

  else if (
    level === 3 ||
    level === 4
  ) {

    drawRock(
      size
    );
  }


  /*
    Fruit hazards.
  */

  else if (level === 5) {

    drawFruitHazard(
      size
    );
  }


  /*
    Ocean coral.
  */

  else if (level === 6) {

    drawCoral(
      size
    );
  }


  /*
    Desert rock / sand.
  */

  else if (level === 7) {

    drawSandPile(
      size
    );
  }


  /*
    Forest tree.
  */

  else if (level === 8) {

    drawForestObstacle(
      size
    );
  }


  /*
    Space comet.
  */

  else if (level === 9) {

    drawComet(
      size
    );
  }


  /*
    Iceberg.
  */

  else if (level === 10) {

    drawIceberg(
      size
    );
  }


  ctx.restore();
}


/* =========================================================
   ROCK
   ========================================================= */

function drawRock(
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


/* =========================================================
   FRUIT HAZARD
   ========================================================= */

function drawFruitHazard(
  size
) {

  ctx.beginPath();

  ctx.arc(
    -7,
    3,
    size * 0.38,
    0,
    Math.PI * 2
  );

  ctx.arc(
    7,
    3,
    size * 0.38,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#72df69";

  ctx.beginPath();

  ctx.ellipse(
    8,
    -size * 0.45,
    8,
    4,
    -0.5,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================================================
   CORAL
   ========================================================= */

function drawCoral(
  size
) {

  ctx.strokeStyle =
    settings.obstacleColor;

  ctx.lineWidth =
    Math.max(
      5,
      size * 0.18
    );

  ctx.lineCap =
    "round";

  ctx.beginPath();

  ctx.moveTo(
    0,
    size * 0.5
  );

  ctx.lineTo(
    0,
    -size * 0.35
  );

  ctx.moveTo(
    0,
    -size * 0.05
  );

  ctx.lineTo(
    -size * 0.35,
    -size * 0.4
  );

  ctx.moveTo(
    0,
    -size * 0.18
  );

  ctx.lineTo(
    size * 0.38,
    -size * 0.48
  );

  ctx.stroke();
}


/* =========================================================
   SAND PILE
   ========================================================= */

function drawSandPile(
  size
) {

  ctx.beginPath();

  ctx.arc(
    0,
    size * 0.2,
    size * 0.58,
    Math.PI,
    0
  );

  ctx.fill();
}


/* =========================================================
   FOREST OBSTACLE
   ========================================================= */

function drawForestObstacle(
  size
) {

  ctx.fillRect(
    -size * 0.16,
    -size * 0.15,
    size * 0.32,
    size * 0.8
  );


  ctx.beginPath();

  ctx.arc(
    0,
    -size * 0.25,
    size * 0.55,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================================================
   COMET
   ========================================================= */

function drawComet(
  size
) {

  ctx.strokeStyle =
    "rgba(255,120,100,0.55)";

  ctx.lineWidth =
    size * 0.22;

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.85,
    size * 0.55
  );

  ctx.lineTo(
    -size * 0.15,
    size * 0.1
  );

  ctx.stroke();


  ctx.fillStyle =
    settings.obstacleColor;

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    size * 0.42,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================================================
   ICEBERG
   ========================================================= */

function drawIceberg(
  size
) {

  ctx.beginPath();

  ctx.moveTo(
    -size * 0.55,
    size * 0.45
  );

  ctx.lineTo(
    -size * 0.25,
    -size * 0.5
  );

  ctx.lineTo(
    0,
    -size * 0.75
  );

  ctx.lineTo(
    size * 0.3,
    -size * 0.25
  );

  ctx.lineTo(
    size * 0.58,
    size * 0.45
  );

  ctx.closePath();

  ctx.fill();
}


/* =========================================================
   PARTICLES
   ========================================================= */

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


/* =========================================================
   HELPERS
   ========================================================= */

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


/* =========================================================
   BUTTON CONTROLS
   ========================================================= */

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


/* =========================================================
   KEYBOARD
   ========================================================= */

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


/* =========================================================
   SWIPE
   ========================================================= */

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


/* =========================================================
   INITIALIZE
   ========================================================= */

resizeCanvas();

setupLevelUI();

updateHUD();

draw();
