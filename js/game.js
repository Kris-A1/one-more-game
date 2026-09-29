const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const multiplierElement = document.getElementById("multiplier");

const strikesElement = document.getElementById("strikes");
const attackCountElement = document.getElementById("attackCount");

const levelName = document.getElementById("levelName");

const overlay = document.getElementById("overlay");
const overlayLabel = document.getElementById("overlayLabel");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const animalChooser = document.getElementById("animalChooser");
const chooserTitle = document.getElementById("chooserTitle");
const characterGrid = document.getElementById("characterGrid");

const startButton = document.getElementById("startButton");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const attackButton = document.getElementById("attackButton");

const attackInstruction =
  document.getElementById("attackInstruction");

const strikeDisplay =
  document.getElementById("strikeDisplay");

const gameMessage =
  document.getElementById("gameMessage");


/* =========================================================
   LEVELS
========================================================= */

const LEVELS = {

  1: {
    name: "NEON RUN",
    world: "neon",
    character: "runner",
    characterName: "RUNNER",
    description:
      "Dodge everything.<br>How long can you survive?",
    attack: false,
    strikes: 0,
    baseSpeed: 175,
    maxSpeed: 245,
    obstacle: "neon-block",
    background: "#070b20"
  },

  2: {
    name: "NEON RUSH",
    world: "neon-rush",
    character: "runner",
    characterName: "RUNNER",
    description:
      "Dodge or destroy obstacles.<br>You have 3 strikes.",
    attack: true,
    strikes: 3,
    baseSpeed: 205,
    maxSpeed: 275,
    obstacle: "diamond",
    background: "#0b0820"
  },

  3: {
    name: "ANIMAL RUN",
    world: "animal",
    character: "animals",
    characterName: "ANIMAL",
    description:
      "Choose your runner.<br>Dodge or destroy obstacles.",
    attack: true,
    strikes: 3,
    baseSpeed: 220,
    maxSpeed: 295,
    obstacle: "rock",
    background: "#061914",

    characters: [
      ["BUNNY", "🐰"],
      ["FOX", "🦊"],
      ["CAT", "🐱"],
      ["PANDA", "🐼"]
    ]
  },

  4: {
    name: "ANIMAL RUSH",
    world: "animal-rush",
    character: "animals",
    characterName: "ANIMAL",
    description:
      "Faster. Harder.<br>Can you survive the rush?",
    attack: true,
    strikes: 3,
    baseSpeed: 250,
    maxSpeed: 330,
    obstacle: "rock-fast",
    background: "#07170f",

    characters: [
      ["BUNNY", "🐰"],
      ["FOX", "🦊"],
      ["CAT", "🐱"],
      ["PANDA", "🐼"]
    ]
  },

  5: {
    name: "FRUIT RUN",
    world: "fruit",
    character: "fruit",
    characterName: "FRUIT",
    description:
      "Pick your fruit.<br>Then survive the rush.",
    attack: true,
    strikes: 3,
    baseSpeed: 260,
    maxSpeed: 340,
    obstacle: "fruit-hazard",
    background: "#180d19",

    characters: [
      ["WATERMELON", "🍉"],
      ["PINEAPPLE", "🍍"],
      ["STRAWBERRY", "🍓"],
      ["PEACH", "🍑"]
    ]
  },

  6: {
    name: "OCEAN",
    world: "ocean",
    character: "fish",
    characterName: "FISH",
    description:
      "Dive through the neon deep.<br>Watch the coral.",
    attack: true,
    strikes: 5,
    baseSpeed: 270,
    maxSpeed: 350,
    obstacle: "coral",
    background: "#04172b"
  },

  7: {
    name: "DESERT",
    world: "desert",
    character: "sun",
    characterName: "SUN",
    description:
      "Cross the neon desert.<br>Don't get buried.",
    attack: true,
    strikes: 5,
    baseSpeed: 280,
    maxSpeed: 360,
    obstacle: "sand",
    background: "#1b100b"
  },

  8: {
    name: "FOREST",
    world: "forest",
    character: "plant",
    characterName: "PLANT",
    description:
      "The forest is alive.<br>Keep moving.",
    attack: true,
    strikes: 5,
    baseSpeed: 290,
    maxSpeed: 370,
    obstacle: "tree",
    background: "#04170f"
  },

  9: {
    name: "SPACE",
    world: "space",
    character: "robot",
    characterName: "ROBOT",
    description:
      "No gravity. No mercy.<br>Avoid the comets.",
    attack: true,
    strikes: 5,
    baseSpeed: 300,
    maxSpeed: 385,
    obstacle: "comet",
    background: "#050512"
  },

  10: {
    name: "ANTARCTICA",
    world: "ice",
    character: "icecube",
    characterName: "ICE CUBE",
    description:
      "Frozen ground.<br>One mistake is enough.",
    attack: true,
    strikes: 5,
    baseSpeed: 310,
    maxSpeed: 395,
    obstacle: "iceberg",
    background: "#061622"
  }

};


/* =========================================================
   CURRENT LEVEL
========================================================= */

const params =
  new URLSearchParams(window.location.search);

let level =
  Number(params.get("level")) || 1;

if (!LEVELS[level]) {
  level = 1;
}

const settings = LEVELS[level];


/* =========================================================
   STATE
========================================================= */

let canvasWidth = 360;
let canvasHeight = 560;

let running = false;

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
    : settings.characterName;

let lane = 1;
let targetLane = 1;

let obstacles = [];
let particles = [];

let spawnTimer = 0;
let elapsed = 0;

let currentSpeed =
  settings.baseSpeed;

let lastTime = 0;

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
}

window.addEventListener(
  "resize",
  resizeCanvas
);


/* =========================================================
   UI
========================================================= */

function setupUI() {

  levelName.textContent =
    settings.name;

  overlayLabel.textContent =
    `LEVEL ${level}`;

  overlayTitle.textContent =
    settings.name;

  overlayText.innerHTML =
    settings.description;

  bestScoreElement.textContent =
    bestScore;


  if (settings.attack) {

    strikeDisplay.classList.remove(
      "hidden"
    );

    attackButton.classList.remove(
      "hidden"
    );

    attackInstruction.classList.remove(
      "hidden"
    );

  } else {

    strikeDisplay.classList.add(
      "hidden"
    );

    attackButton.classList.add(
      "hidden"
    );

    attackInstruction.classList.add(
      "hidden"
    );
  }


  if (settings.characters) {

    animalChooser.classList.remove(
      "hidden"
    );

    characterGrid.innerHTML = "";

    settings.characters.forEach(
      character => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.className =
          "character-card";

        if (
          character[0] ===
          selectedCharacter
        ) {

          button.classList.add(
            "selected"
          );
        }

        button.dataset.character =
          character[0];

        button.innerHTML = `
          <span class="character-icon">
            ${character[1]}
          </span>

          <span class="character-name">
            ${character[0]}
          </span>

          <span class="character-check">
            ✓
          </span>
        `;

        button.addEventListener(
          "click",
          () => {

            if (running) {
              return;
            }

            selectedCharacter =
              character[0];

            document
              .querySelectorAll(
                ".character-card"
              )
              .forEach(card => {

                card.classList.remove(
                  "selected"
                );

              });

            button.classList.add(
              "selected"
            );

            startButton.textContent =
              `▶ START AS ${selectedCharacter}`;

            draw();

          }
        );

        characterGrid.appendChild(
          button
        );

      }
    );

    startButton.textContent =
      `▶ START AS ${selectedCharacter}`;

  } else {

    animalChooser.classList.add(
      "hidden"
    );

    startButton.textContent =
      "▶ START";
  }

  updateStrikeUI();
}


/* =========================================================
   STRIKES
========================================================= */

function updateStrikeUI() {

  if (!settings.attack) {
    return;
  }

  strikesElement.textContent =
    `×${strikes}`;

  attackCountElement.textContent =
    `×${strikes}`;

  attackButton.style.opacity =
    strikes > 0 ? "1" : ".4";
}


/* =========================================================
   START
========================================================= */

function startGame() {

  running = true;

  score = 0;

  multiplier = 1;

  strikes =
    settings.strikes;

  lane = 1;

  targetLane = 1;

  obstacles = [];

  particles = [];

  spawnTimer = .25;

  elapsed = 0;

  currentSpeed =
    settings.baseSpeed;

  gameMessage.textContent = "";

  overlay.style.display = "none";

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
   LOOP
========================================================= */

function gameLoop(time) {

  if (!running) {
    return;
  }

  const delta =
    Math.min(
      (time - lastTime) / 1000,
      .035
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

  const difficulty =
    Math.min(
      elapsed / 75,
      1
    );

  currentSpeed =
    settings.baseSpeed +
    (
      settings.maxSpeed -
      settings.baseSpeed
    ) *
    difficulty;


  multiplier =
    Math.min(
      1 +
      Math.floor(
        elapsed / 10
      ),
      9
    );


  score +=
    delta *
    10 *
    multiplier;


  lane +=
    (
      targetLane -
      lane
    ) *
    Math.min(
      delta * 12,
      1
    );


  spawnTimer -= delta;

  const spawnInterval =
    Math.max(
      .39,
      .86 -
      elapsed * .004
    );

  if (spawnTimer <= 0) {

    spawnObstacle();

    spawnTimer =
      spawnInterval *
      (
        .85 +
        Math.random() * .25
      );
  }


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

    if (
      obstacle.y >
      canvasHeight + 100
    ) {

      obstacles.splice(i, 1);

      score +=
        10 * multiplier;

      continue;
    }


    if (
      obstacle.y >
        canvasHeight - 155 &&
      obstacle.y <
        canvasHeight - 65 &&
      Math.abs(
        obstacle.lane -
        lane
      ) < .34
    ) {

      endGame();

      return;
    }
  }


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
      300 * delta;

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
   OBSTACLES
========================================================= */

function spawnObstacle() {

  const firstLane =
    Math.floor(
      Math.random() * 3
    );

  obstacles.push({
    lane: firstLane,
    y: -55,
    size:
      28 +
      Math.random() * 10
  });


  if (
    elapsed > 18 &&
    Math.random() < .18
  ) {

    let secondLane =
      Math.floor(
        Math.random() * 3
      );

    if (
      secondLane === firstLane
    ) {

      secondLane =
        (secondLane + 1) % 3;
    }

    obstacles.push({
      lane: secondLane,
      y: -145,
      size:
        26 +
        Math.random() * 9
    });
  }
}


/* =========================================================
   ATTACK
========================================================= */

function attack() {

  if (
    !running ||
    !settings.attack
  ) {
    return;
  }

  if (strikes <= 0) {

    gameMessage.textContent =
      "NO STRIKES — DODGE!";

    return;
  }


  let target = null;
  let targetIndex = -1;
  let bestDistance = Infinity;


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
      ) < .38 &&
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
    (
      perfect
        ? 70
        : 40
    ) *
    multiplier;

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
    finalScore.toString();

  overlayText.innerHTML =
    `BEST ${bestScore}<br><br>Ready for one more?`;


  if (settings.characters) {

    startButton.textContent =
      `▶ RUN AS ${selectedCharacter}`;

  } else {

    startButton.textContent =
      "▶ ONE MORE";
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
    `x${multiplier}`;

  if (settings.attack) {

    strikesElement.textContent =
      `×${strikes}`;

    attackCountElement.textContent =
      `×${strikes}`;
  }
}


/* =========================================================
   MAIN DRAW
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

  drawWorldBackground();

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
   SAME 1M NEON ARCADE LANGUAGE
========================================================= */

function drawWorldBackground() {

  if (
    settings.world === "neon" ||
    settings.world === "neon-rush"
  ) {

    drawNeonCity();

  } else if (
    settings.world === "animal" ||
    settings.world === "animal-rush"
  ) {

    drawAnimalWorld();

  } else if (
    settings.world === "fruit"
  ) {

    drawFruitWorld();

  } else if (
    settings.world === "ocean"
  ) {

    drawOceanWorld();

  } else if (
    settings.world === "desert"
  ) {

    drawDesertWorld();

  } else if (
    settings.world === "forest"
  ) {

    drawForestWorld();

  } else if (
    settings.world === "space"
  ) {

    drawSpaceWorld();

  } else if (
    settings.world === "ice"
  ) {

    drawIceWorld();
  }
}


/* =========================================================
   NEON CITY
========================================================= */

function drawNeonCity() {

  const rush =
    settings.world === "neon-rush";

  ctx.save();


  /* glow at horizon */

  const glow =
    ctx.createRadialGradient(
      canvasWidth / 2,
      canvasHeight * .45,
      20,
      canvasWidth / 2,
      canvasHeight * .45,
      canvasWidth * .8
    );

  glow.addColorStop(
    0,
    rush
      ? "rgba(90,80,255,.22)"
      : "rgba(0,220,255,.18)"
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


  /* moon */

  ctx.shadowBlur = 30;

  ctx.shadowColor =
    rush
      ? "#8f6cff"
      : "#45eaff";

  ctx.fillStyle =
    rush
      ? "#9a7cff"
      : "#64edff";

  ctx.beginPath();

  ctx.arc(
    canvasWidth * .78,
    105,
    34,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* skyline */

  ctx.shadowBlur = 0;

  for (
    let i = 0;
    i < 15;
    i++
  ) {

    const x =
      i *
      (canvasWidth / 14) -
      10;

    const h =
      80 +
      ((i * 43) % 130);

    ctx.fillStyle =
      i % 2
        ? "#101a3c"
        : "#15102f";

    ctx.fillRect(
      x,
      canvasHeight - 190 - h,
      55,
      h
    );


    /* windows */

    ctx.fillStyle =
      i % 2
        ? "rgba(60,220,255,.45)"
        : "rgba(255,70,170,.38)";

    for (
      let w = 0;
      w < 3;
      w++
    ) {

      for (
        let r = 0;
        r < 4;
        r++
      ) {

        ctx.fillRect(
          x + 10 + w * 14,
          canvasHeight - 170 - h + r * 25,
          5,
          9
        );
      }
    }
  }


  /* neon horizon */

  ctx.shadowBlur = 18;

  ctx.shadowColor =
    rush
      ? "#8d5cff"
      : "#19e9ff";

  ctx.strokeStyle =
    rush
      ? "#8d5cff"
      : "#19e9ff";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    0,
    canvasHeight - 188
  );

  ctx.lineTo(
    canvasWidth,
    canvasHeight - 188
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   ANIMAL WORLD
========================================================= */

function drawAnimalWorld() {

  ctx.save();

  const horizon =
    canvasHeight - 190;


  const glow =
    ctx.createLinearGradient(
      0,
      60,
      0,
      horizon
    );

  glow.addColorStop(
    0,
    "rgba(38,255,163,.04)"
  );

  glow.addColorStop(
    1,
    "rgba(24,160,90,.18)"
  );

  ctx.fillStyle = glow;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    horizon
  );


  /* moon */

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#73ffc4";

  ctx.fillStyle = "#c0ffe0";

  ctx.beginPath();

  ctx.arc(
    canvasWidth * .78,
    95,
    29,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* layered trees */

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const x =
      (i * 83) %
      (canvasWidth + 50) -
      25;

    const y =
      80 +
      ((i * 37) % 150);

    const size =
      35 +
      ((i * 11) % 25);

    ctx.shadowBlur = 12;
    ctx.shadowColor =
      "#1aff8a";

    ctx.fillStyle =
      i % 2
        ? "#0d5a38"
        : "#0a412b";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      "#70452a";

    ctx.fillRect(
      x - 5,
      y + size * .5,
      10,
      60
    );
  }

  ctx.restore();
}


/* =========================================================
   FRUIT WORLD
========================================================= */

function drawFruitWorld() {

  ctx.save();

  const glow =
    ctx.createRadialGradient(
      canvasWidth / 2,
      170,
      20,
      canvasWidth / 2,
      170,
      300
    );

  glow.addColorStop(
    0,
    "rgba(255,75,150,.18)"
  );

  glow.addColorStop(
    1,
    "rgba(255,60,100,0)"
  );

  ctx.fillStyle = glow;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /* floating fruit-like lights */

  for (
    let i = 0;
    i < 10;
    i++
  ) {

    const x =
      (i * 97) %
      canvasWidth;

    const y =
      75 +
      ((i * 51) % 175);

    const r =
      14 +
      (i % 3) * 5;

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      i % 2
        ? "#ff4f9a"
        : "#ffd34e";

    ctx.fillStyle =
      i % 2
        ? "rgba(255,72,135,.42)"
        : "rgba(255,203,65,.38)";

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


  /* vines */

  ctx.strokeStyle =
    "rgba(80,255,150,.3)";

  ctx.lineWidth = 4;

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const x =
      i *
      (canvasWidth / 4);

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.quadraticCurveTo(
      x + 30,
      90,
      x - 10,
      180
    );

    ctx.stroke();
  }

  ctx.restore();
}


/* =========================================================
   OCEAN WORLD
========================================================= */

function drawOceanWorld() {

  ctx.save();


  /* underwater glow */

  const water =
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvasHeight
    );

  water.addColorStop(
    0,
    "rgba(25,225,255,.13)"
  );

  water.addColorStop(
    .55,
    "rgba(8,90,160,.09)"
  );

  water.addColorStop(
    1,
    "rgba(0,20,55,.35)"
  );

  ctx.fillStyle = water;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /* light rays */

  ctx.globalAlpha = .12;

  ctx.fillStyle = "#52efff";

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    ctx.beginPath();

    ctx.moveTo(
      i * 100,
      0
    );

    ctx.lineTo(
      i * 100 + 55,
      0
    );

    ctx.lineTo(
      i * 100 + 120,
      canvasHeight - 190
    );

    ctx.lineTo(
      i * 100 + 70,
      canvasHeight - 190
    );

    ctx.closePath();

    ctx.fill();
  }

  ctx.globalAlpha = 1;


  /* bubbles */

  for (
    let i = 0;
    i < 16;
    i++
  ) {

    const x =
      (i * 67) %
      canvasWidth;

    const y =
      45 +
      ((i * 83) % 250);

    ctx.strokeStyle =
      "rgba(90,240,255,.42)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      4 + i % 5,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }


  /* distant coral */

  ctx.strokeStyle =
    "rgba(255,70,150,.28)";

  ctx.lineWidth = 5;

  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const x =
      i *
      (canvasWidth / 7);

    ctx.beginPath();

    ctx.moveTo(
      x,
      canvasHeight - 190
    );

    ctx.lineTo(
      x,
      canvasHeight - 240
    );

    ctx.moveTo(
      x,
      canvasHeight - 220
    );

    ctx.lineTo(
      x - 18,
      canvasHeight - 250
    );

    ctx.moveTo(
      x,
      canvasHeight - 225
    );

    ctx.lineTo(
      x + 18,
      canvasHeight - 250
    );

    ctx.stroke();
  }

  ctx.restore();
}


/* =========================================================
   DESERT WORLD
========================================================= */

function drawDesertWorld() {

  ctx.save();


  const sky =
    ctx.createLinearGradient(
      0,
      0,
      0,
      canvasHeight - 180
    );

  sky.addColorStop(
    0,
    "rgba(255,100,50,.08)"
  );

  sky.addColorStop(
    1,
    "rgba(255,190,60,.17)"
  );

  ctx.fillStyle = sky;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /* giant sun */

  ctx.shadowBlur = 35;

  ctx.shadowColor =
    "#ffb72e";

  ctx.fillStyle =
    "rgba(255,185,55,.8)";

  ctx.beginPath();

  ctx.arc(
    canvasWidth * .78,
    115,
    46,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* dunes */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "rgba(218,125,55,.24)";

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    ctx.beginPath();

    ctx.arc(
      i * 100 - 30,
      canvasHeight - 170,
      115,
      Math.PI,
      0
    );

    ctx.fill();
  }


  /* distant cactus */

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const x =
      35 +
      i * 82;

    const y =
      canvasHeight - 215;

    ctx.strokeStyle =
      "rgba(95,230,130,.45)";

    ctx.lineWidth = 8;

    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(
      x,
      y + 40
    );

    ctx.lineTo(
      x,
      y - 25
    );

    ctx.moveTo(
      x,
      y
    );

    ctx.lineTo(
      x - 15,
      y - 12
    );

    ctx.moveTo(
      x,
      y + 8
    );

    ctx.lineTo(
      x + 16,
      y - 3
    );

    ctx.stroke();
  }

  ctx.restore();
}


/* =========================================================
   FOREST WORLD
========================================================= */

function drawForestWorld() {

  ctx.save();


  const glow =
    ctx.createRadialGradient(
      canvasWidth / 2,
      120,
      10,
      canvasWidth / 2,
      120,
      330
    );

  glow.addColorStop(
    0,
    "rgba(80,255,150,.14)"
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


  /* giant tree silhouettes */

  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const x =
      i * 55;

    const top =
      80 +
      ((i * 29) % 100);

    ctx.fillStyle =
      "#082d20";

    ctx.fillRect(
      x,
      top + 55,
      16,
      canvasHeight
    );

    ctx.beginPath();

    ctx.arc(
      x + 8,
      top + 35,
      45,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  /* fireflies */

  ctx.shadowBlur = 14;
  ctx.shadowColor = "#6dff9e";
  ctx.fillStyle = "#8affb2";

  for (
    let i = 0;
    i < 20;
    i++
  ) {

    const x =
      (i * 71) %
      canvasWidth;

    const y =
      70 +
      ((i * 43) % 230);

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      2,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.restore();
}


/* =========================================================
   SPACE WORLD
========================================================= */

function drawSpaceWorld() {

  ctx.save();


  /* nebula */

  const nebula =
    ctx.createRadialGradient(
      canvasWidth * .45,
      170,
      20,
      canvasWidth * .45,
      170,
      330
    );

  nebula.addColorStop(
    0,
    "rgba(112,76,255,.20)"
  );

  nebula.addColorStop(
    .45,
    "rgba(30,150,255,.08)"
  );

  nebula.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = nebula;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /* stars */

  ctx.fillStyle =
    "rgba(255,255,255,.85)";

  for (
    let i = 0;
    i < 75;
    i++
  ) {

    const x =
      (i * 47) %
      canvasWidth;

    const y =
      (i * 83) %
      (canvasHeight - 180);

    const size =
      i % 7 === 0
        ? 2
        : 1;

    ctx.fillRect(
      x,
      y,
      size,
      size
    );
  }


  /* distant planet */

  ctx.shadowBlur = 25;

  ctx.shadowColor =
    "#7b63ff";

  ctx.fillStyle =
    "rgba(117,91,255,.7)";

  ctx.beginPath();

  ctx.arc(
    canvasWidth * .78,
    125,
    32,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}


/* =========================================================
   ICE WORLD
========================================================= */

function drawIceWorld() {

  ctx.save();


  const iceGlow =
    ctx.createRadialGradient(
      canvasWidth / 2,
      130,
      10,
      canvasWidth / 2,
      130,
      340
    );

  iceGlow.addColorStop(
    0,
    "rgba(100,235,255,.20)"
  );

  iceGlow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.fillStyle = iceGlow;

  ctx.fillRect(
    0,
    0,
    canvasWidth,
    canvasHeight
  );


  /* aurora */

  ctx.globalAlpha = .28;

  ctx.strokeStyle =
    "#56f5ff";

  ctx.lineWidth = 10;

  ctx.beginPath();

  ctx.moveTo(
    0,
    105
  );

  ctx.bezierCurveTo(
    80,
    40,
    120,
    180,
    210,
    90
  );

  ctx.bezierCurveTo(
    275,
    30,
    320,
    140,
    canvasWidth,
    70
  );

  ctx.stroke();


  ctx.globalAlpha = .16;

  ctx.strokeStyle =
    "#9c7cff";

  ctx.beginPath();

  ctx.moveTo(
    0,
    135
  );

  ctx.bezierCurveTo(
    90,
    75,
    145,
    205,
    240,
    120
  );

  ctx.bezierCurveTo(
    300,
    70,
    330,
    150,
    canvasWidth,
    100
  );

  ctx.stroke();

  ctx.globalAlpha = 1;


  /* distant ice mountains */

  ctx.fillStyle =
    "rgba(100,200,230,.18)";

  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const x =
      i * 75;

    ctx.beginPath();

    ctx.moveTo(
      x - 60,
      canvasHeight - 180
    );

    ctx.lineTo(
      x,
      canvasHeight - 285
    );

    ctx.lineTo(
      x + 70,
      canvasHeight - 180
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


  const gradient =
    ctx.createLinearGradient(
      0,
      trackTop,
      0,
      canvasHeight
    );

  gradient.addColorStop(
    0,
    "rgba(255,255,255,.045)"
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,.25)"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    trackTop,
    canvasWidth,
    205
  );


  ctx.save();

  ctx.strokeStyle =
    "rgba(255,255,255,.075)";

  ctx.lineWidth = 1;

  for (
    let i = 1;
    i < 3;
    i++
  ) {

    const x =
      canvasWidth / 3 *
      i;

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


  /* lane glow */

  ctx.strokeStyle =
    "rgba(80,220,255,.10)";

  ctx.lineWidth = 2;

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
    canvasWidth / 3 * 2,
    trackTop
  );

  ctx.lineTo(
    canvasWidth / 3 * 2,
    canvasHeight
  );

  ctx.stroke();

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
    settings.character ===
    "runner"
  ) {

    drawRunner(
      x,
      y
    );

    return;
  }


  if (
    settings.character ===
    "animals"
  ) {

    drawAnimalCharacter(
      x,
      y,
      selectedCharacter
    );

    return;
  }


  if (
    settings.character ===
    "fruit"
  ) {

    drawFruitCharacter(
      x,
      y,
      selectedCharacter
    );

    return;
  }


  drawSpecialCharacter(
    x,
    y,
    settings.character
  );
}


/* =========================================================
   ORIGINAL RUNNER
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


  const glow =
    settings.world ===
    "neon-rush"
      ? "#6f8cff"
      : "#35efff";


  /* shadow */

  ctx.globalAlpha = .3;

  ctx.fillStyle = "#000";

  ctx.beginPath();

  ctx.ellipse(
    0,
    31,
    25,
    7,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.globalAlpha = 1;


  /* body */

  ctx.shadowBlur = 28;
  ctx.shadowColor = glow;
  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.roundRect(
    -20,
    -29,
    40,
    51,
    14
  );

  ctx.fill();


  /* face */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#06111d";

  ctx.beginPath();

  ctx.roundRect(
    -14,
    -15,
    28,
    19,
    8
  );

  ctx.fill();


  ctx.fillStyle =
    "#b9fbff";

  ctx.beginPath();

  ctx.arc(
    -6,
    -6,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    6,
    -6,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* legs */

  ctx.strokeStyle =
    "#06111d";

  ctx.lineWidth = 5;

  ctx.lineCap = "round";

  ctx.beginPath();

  ctx.moveTo(
    -8,
    18
  );

  ctx.lineTo(
    -14,
    31
  );

  ctx.moveTo(
    8,
    18
  );

  ctx.lineTo(
    14,
    31
  );

  ctx.stroke();


  /* speed lines */

  ctx.strokeStyle =
    glow;

  ctx.lineWidth = 2;

  ctx.globalAlpha = .65;

  ctx.beginPath();

  ctx.moveTo(
    -27,
    -5
  );

  ctx.lineTo(
    -39,
    -5
  );

  ctx.moveTo(
    27,
    4
  );

  ctx.lineTo(
    39,
    4
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   ANIMAL CHARACTERS
========================================================= */

function drawAnimalCharacter(
  x,
  y,
  character
) {

  if (character === "BUNNY") {
    drawBunny(x, y);
  }

  else if (character === "FOX") {
    drawFox(x, y);
  }

  else if (character === "CAT") {
    drawCat(x, y);
  }

  else if (character === "PANDA") {
    drawPanda(x, y);
  }

  else {
    drawBunny(x, y);
  }
}


/* =========================================================
   BUNNY
========================================================= */

function drawBunny(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ff8fd8";

  ctx.fillStyle = "#ffd6ef";

  /* ears */

  ctx.beginPath();

  ctx.ellipse(
    -12,
    -37,
    9,
    24,
    -.12,
    0,
    Math.PI * 2
  );

  ctx.ellipse(
    12,
    -37,
    9,
    24,
    .12,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle = "#ff86c9";

  ctx.shadowBlur = 0;

  ctx.beginPath();

  ctx.ellipse(
    -12,
    -37,
    4,
    15,
    -.12,
    0,
    Math.PI * 2
  );

  ctx.ellipse(
    12,
    -37,
    4,
    15,
    .12,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* head */

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ff8fd8";

  ctx.fillStyle = "#ffd6ef";

  ctx.beginPath();

  ctx.arc(
    0,
    -5,
    29,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* cheeks */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "rgba(255,115,180,.55)";

  ctx.beginPath();

  ctx.arc(
    -18,
    3,
    5,
    0,
    Math.PI * 2
  );

  ctx.arc(
    18,
    3,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  drawCuteFace(
    0,
    -3
  );

  drawAnimalBody(
    "#ffb9e1"
  );

  ctx.restore();
}


/* =========================================================
   FOX
========================================================= */

function drawFox(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ff7b3d";

  ctx.fillStyle = "#ff8245";

  /* ears */

  ctx.beginPath();

  ctx.moveTo(
    -25,
    -22
  );

  ctx.lineTo(
    -20,
    -48
  );

  ctx.lineTo(
    -3,
    -28
  );

  ctx.closePath();

  ctx.moveTo(
    25,
    -22
  );

  ctx.lineTo(
    20,
    -48
  );

  ctx.lineTo(
    3,
    -28
  );

  ctx.closePath();

  ctx.fill();


  /* head */

  ctx.beginPath();

  ctx.arc(
    0,
    -3,
    29,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* muzzle */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#fff1df";

  ctx.beginPath();

  ctx.ellipse(
    0,
    9,
    17,
    13,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* nose */

  ctx.fillStyle =
    "#281522";

  ctx.beginPath();

  ctx.arc(
    0,
    5,
    4,
    0,
    Math.PI * 2
  );

  ctx.fill();


  drawAnimalBody(
    "#ff6d3d"
  );

  ctx.restore();
}


/* =========================================================
   CAT
========================================================= */

function drawCat(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#b38cff";

  ctx.fillStyle = "#b88cff";

  /* ears */

  ctx.beginPath();

  ctx.moveTo(
    -25,
    -22
  );

  ctx.lineTo(
    -20,
    -48
  );

  ctx.lineTo(
    -5,
    -27
  );

  ctx.closePath();

  ctx.moveTo(
    25,
    -22
  );

  ctx.lineTo(
    20,
    -48
  );

  ctx.lineTo(
    5,
    -27
  );

  ctx.closePath();

  ctx.fill();


  /* head */

  ctx.beginPath();

  ctx.arc(
    0,
    -4,
    29,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* muzzle */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#eee4ff";

  ctx.beginPath();

  ctx.arc(
    -9,
    8,
    9,
    0,
    Math.PI * 2
  );

  ctx.arc(
    9,
    8,
    9,
    0,
    Math.PI * 2
  );

  ctx.fill();


  drawAnimalBody(
    "#9d72ee"
  );

  ctx.restore();
}


/* =========================================================
   PANDA
========================================================= */

function drawPanda(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#72eaff";

  ctx.fillStyle = "#f2fbff";


  /* ears */

  ctx.beginPath();

  ctx.arc(
    -19,
    -29,
    11,
    0,
    Math.PI * 2
  );

  ctx.arc(
    19,
    -29,
    11,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    "#20243a";

  ctx.fill();


  /* head */

  ctx.fillStyle =
    "#f2fbff";

  ctx.beginPath();

  ctx.arc(
    0,
    -4,
    29,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* eye patches */

  ctx.fillStyle =
    "#25283b";

  ctx.beginPath();

  ctx.ellipse(
    -10,
    -7,
    8,
    12,
    -.4,
    0,
    Math.PI * 2
  );

  ctx.ellipse(
    10,
    -7,
    8,
    12,
    .4,
    0,
    Math.PI * 2
  );

  ctx.fill();


  drawAnimalBody(
    "#dceeff"
  );

  ctx.restore();
}


/* =========================================================
   ANIMAL BODY
========================================================= */

function drawAnimalBody(
  color
) {

  ctx.shadowBlur = 20;

  ctx.shadowColor =
    color;

  ctx.fillStyle =
    color;

  ctx.beginPath();

  ctx.roundRect(
    -23,
    18,
    46,
    28,
    13
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#161827";

  ctx.beginPath();

  ctx.arc(
    -9,
    -5,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    9,
    -5,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    "#161827";

  ctx.lineWidth = 3;

  ctx.lineCap = "round";

  ctx.beginPath();

  ctx.arc(
    0,
    3,
    7,
    0,
    Math.PI
  );

  ctx.stroke();


  /* feet */

  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.moveTo(
    -12,
    43
  );

  ctx.lineTo(
    -16,
    51
  );

  ctx.moveTo(
    12,
    43
  );

  ctx.lineTo(
    16,
    51
  );

  ctx.stroke();
}


/* =========================================================
   FACE
========================================================= */

function drawCuteFace(
  x,
  y
) {

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#27152a";

  ctx.beginPath();

  ctx.arc(
    x - 9,
    y,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    x + 9,
    y,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    "#27152a";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.arc(
    x,
    y + 7,
    7,
    0,
    Math.PI
  );

  ctx.stroke();
}


/* =========================================================
   FRUIT CHARACTERS
========================================================= */

function drawFruitCharacter(
  x,
  y,
  character
) {

  if (character === "WATERMELON") {
    drawWatermelon(x, y);
  }

  else if (character === "PINEAPPLE") {
    drawPineapple(x, y);
  }

  else if (character === "STRAWBERRY") {
    drawStrawberry(x, y);
  }

  else if (character === "PEACH") {
    drawPeach(x, y);
  }

  else {
    drawWatermelon(x, y);
  }
}


/* =========================================================
   WATERMELON
========================================================= */

function drawWatermelon(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#31ff91";

  ctx.fillStyle = "#37e889";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    31,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#ff5d87";

  ctx.beginPath();

  ctx.arc(
    0,
    2,
    24,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#1d1825";

  [
    [-9, -6],
    [8, -10],
    [-2, 10],
    [12, 7]
  ].forEach(
    p => {

      ctx.beginPath();

      ctx.ellipse(
        p[0],
        p[1],
        2,
        4,
        -.3,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );


  drawFruitFace();

  ctx.restore();
}


/* =========================================================
   PINEAPPLE
========================================================= */

function drawPineapple(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ffd84d";

  /* leaves */

  ctx.fillStyle =
    "#57e68a";

  for (
    let i = -2;
    i <= 2;
    i++
  ) {

    ctx.beginPath();

    ctx.ellipse(
      i * 8,
      -33,
      7,
      18,
      i * .25,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  ctx.fillStyle =
    "#ffc83d";

  ctx.beginPath();

  ctx.roundRect(
    -25,
    -18,
    50,
    58,
    20
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.strokeStyle =
    "#e79a2f";

  ctx.lineWidth = 2;

  for (
    let i = -18;
    i <= 18;
    i += 12
  ) {

    ctx.beginPath();

    ctx.moveTo(
      i,
      -10
    );

    ctx.lineTo(
      i + 8,
      2
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
      i,
      10
    );

    ctx.lineTo(
      i + 8,
      22
    );

    ctx.stroke();
  }

  drawFruitFace();

  ctx.restore();
}


/* =========================================================
   STRAWBERRY
========================================================= */

function drawStrawberry(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ff4779";

  ctx.fillStyle =
    "#ff4e78";

  ctx.beginPath();

  ctx.moveTo(
    0,
    34
  );

  ctx.bezierCurveTo(
    -35,
    10,
    -29,
    -22,
    0,
    -28
  );

  ctx.bezierCurveTo(
    29,
    -22,
    35,
    10,
    0,
    34
  );

  ctx.closePath();

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#5cff9c";

  ctx.beginPath();

  ctx.moveTo(
    -16,
    -22
  );

  ctx.lineTo(
    -4,
    -39
  );

  ctx.lineTo(
    0,
    -25
  );

  ctx.lineTo(
    9,
    -39
  );

  ctx.lineTo(
    16,
    -22
  );

  ctx.closePath();

  ctx.fill();


  ctx.fillStyle =
    "#ffe2a8";

  for (
    let i = -2;
    i <= 2;
    i++
  ) {

    ctx.beginPath();

    ctx.ellipse(
      i * 8,
      i % 2 ? 3 : 13,
      2,
      4,
      -.3,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  drawFruitFace();

  ctx.restore();
}


/* =========================================================
   PEACH
========================================================= */

function drawPeach(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ff9c6a";

  ctx.fillStyle =
    "#ff9f70";

  ctx.beginPath();

  ctx.arc(
    -8,
    0,
    23,
    0,
    Math.PI * 2
  );

  ctx.arc(
    8,
    0,
    23,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.strokeStyle =
    "#e66c64";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    0,
    -18
  );

  ctx.quadraticCurveTo(
    -5,
    0,
    0,
    26
  );

  ctx.stroke();


  ctx.fillStyle =
    "#5de68a";

  ctx.beginPath();

  ctx.ellipse(
    10,
    -25,
    8,
    4,
    -.5,
    0,
    Math.PI * 2
  );

  ctx.fill();

  drawFruitFace();

  ctx.restore();
}


/* =========================================================
   FRUIT FACE
========================================================= */

function drawFruitFace() {

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#30182a";

  ctx.beginPath();

  ctx.arc(
    -8,
    -2,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    8,
    -2,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    "#30182a";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.arc(
    0,
    7,
    7,
    0,
    Math.PI
  );

  ctx.stroke();
}


/* =========================================================
   SPECIAL CHARACTERS
========================================================= */

function drawSpecialCharacter(
  x,
  y,
  type
) {

  if (type === "fish") {
    drawFish(x, y);
  }

  else if (type === "sun") {
    drawBigSun(x, y);
  }

  else if (type === "plant") {
    drawBigPlant(x, y);
  }

  else if (type === "robot") {
    drawBigRobot(x, y);
  }

  else if (type === "icecube") {
    drawBigIceCube(x, y);
  }
}


/* =========================================================
   FISH
========================================================= */

function drawFish(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 28;
  ctx.shadowColor = "#36efff";


  /* body */

  ctx.fillStyle =
    "#39dff4";

  ctx.beginPath();

  ctx.ellipse(
    0,
    0,
    31,
    22,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* tail */

  ctx.fillStyle =
    "#ff6da8";

  ctx.beginPath();

  ctx.moveTo(
    -27,
    0
  );

  ctx.lineTo(
    -48,
    -19
  );

  ctx.lineTo(
    -48,
    19
  );

  ctx.closePath();

  ctx.fill();


  /* belly */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#b9f9ff";

  ctx.beginPath();

  ctx.ellipse(
    8,
    7,
    16,
    10,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* fin */

  ctx.fillStyle =
    "#ff77b5";

  ctx.beginPath();

  ctx.moveTo(
    0,
    -16
  );

  ctx.lineTo(
    8,
    -34
  );

  ctx.lineTo(
    17,
    -12
  );

  ctx.closePath();

  ctx.fill();


  /* eye */

  ctx.fillStyle =
    "#071526";

  ctx.beginPath();

  ctx.arc(
    15,
    -6,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#fff";

  ctx.beginPath();

  ctx.arc(
    17,
    -8,
    2,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* smile */

  ctx.strokeStyle =
    "#071526";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.arc(
    17,
    1,
    7,
    0,
    Math.PI
  );

  ctx.stroke();


  /* bubbles */

  ctx.strokeStyle =
    "#63f5ff";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.arc(
    38,
    -24,
    4,
    0,
    Math.PI * 2
  );

  ctx.arc(
    48,
    -35,
    2,
    0,
    Math.PI * 2
  );

  ctx.stroke();

  ctx.restore();
}


/* =========================================================
   SUN
========================================================= */

function drawBigSun(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 35;
  ctx.shadowColor = "#ffd23f";

  ctx.strokeStyle =
    "#ffda55";

  ctx.lineWidth = 7;

  ctx.lineCap = "round";

  for (
    let i = 0;
    i < 10;
    i++
  ) {

    const angle =
      i *
      Math.PI /
      5;

    ctx.beginPath();

    ctx.moveTo(
      Math.cos(angle) * 34,
      Math.sin(angle) * 34
    );

    ctx.lineTo(
      Math.cos(angle) * 48,
      Math.sin(angle) * 48
    );

    ctx.stroke();
  }


  ctx.fillStyle =
    "#ffc93f";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    31,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  drawSimpleFace(
    "#3b1d1d"
  );

  ctx.restore();
}


/* =========================================================
   PLANT
========================================================= */

function drawBigPlant(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#47ff8b";


  /* pot */

  ctx.fillStyle =
    "#ff766e";

  ctx.beginPath();

  ctx.roundRect(
    -24,
    18,
    48,
    25,
    7
  );

  ctx.fill();


  /* stem */

  ctx.strokeStyle =
    "#5cff91";

  ctx.lineWidth = 8;

  ctx.lineCap = "round";

  ctx.beginPath();

  ctx.moveTo(
    0,
    22
  );

  ctx.lineTo(
    0,
    -8
  );

  ctx.stroke();


  /* leaves */

  ctx.fillStyle =
    "#43e985";

  ctx.beginPath();

  ctx.ellipse(
    -19,
    -8,
    18,
    9,
    -.5,
    0,
    Math.PI * 2
  );

  ctx.ellipse(
    19,
    -16,
    18,
    9,
    .5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* flower head */

  ctx.fillStyle =
    "#ff7fc4";

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
      Math.cos(angle) * 18,
      Math.sin(angle) * 18 - 24,
      12,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  ctx.fillStyle =
    "#ffd94d";

  ctx.beginPath();

  ctx.arc(
    0,
    -24,
    13,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  drawSimpleFace(
    "#34202c",
    0,
    -24
  );

  ctx.restore();
}


/* =========================================================
   ROBOT
========================================================= */

function drawBigRobot(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 28;
  ctx.shadowColor = "#46eaff";


  /* antenna */

  ctx.strokeStyle =
    "#53eaff";

  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.moveTo(
    0,
    -36
  );

  ctx.lineTo(
    0,
    -48
  );

  ctx.stroke();


  ctx.fillStyle =
    "#ff5d9f";

  ctx.beginPath();

  ctx.arc(
    0,
    -51,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* head */

  ctx.fillStyle =
    "#63e9f6";

  ctx.beginPath();

  ctx.roundRect(
    -29,
    -32,
    58,
    49,
    12
  );

  ctx.fill();


  /* face screen */

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#071523";

  ctx.beginPath();

  ctx.roundRect(
    -22,
    -22,
    44,
    27,
    8
  );

  ctx.fill();


  /* eyes */

  ctx.shadowBlur = 12;
  ctx.shadowColor = "#63faff";

  ctx.fillStyle =
    "#63faff";

  ctx.beginPath();

  ctx.roundRect(
    -14,
    -13,
    8,
    7,
    2
  );

  ctx.roundRect(
    6,
    -13,
    8,
    7,
    2
  );

  ctx.fill();


  /* body */

  ctx.shadowBlur = 24;
  ctx.shadowColor = "#46eaff";

  ctx.fillStyle =
    "#3bc9dc";

  ctx.beginPath();

  ctx.roundRect(
    -23,
    22,
    46,
    27,
    9
  );

  ctx.fill();


  /* arms */

  ctx.strokeStyle =
    "#65edff";

  ctx.lineWidth = 7;

  ctx.lineCap = "round";

  ctx.beginPath();

  ctx.moveTo(
    -23,
    27
  );

  ctx.lineTo(
    -35,
    39
  );

  ctx.moveTo(
    23,
    27
  );

  ctx.lineTo(
    35,
    39
  );

  ctx.stroke();


  ctx.restore();
}


/* =========================================================
   ICE CUBE
========================================================= */

function drawBigIceCube(
  x,
  y
) {

  ctx.save();

  ctx.translate(x, y);

  ctx.shadowBlur = 30;
  ctx.shadowColor = "#69eaff";

  ctx.fillStyle =
    "#9aeaff";

  ctx.beginPath();

  ctx.roundRect(
    -31,
    -31,
    62,
    62,
    12
  );

  ctx.fill();


  /* inner glass */

  ctx.shadowBlur = 0;

  ctx.strokeStyle =
    "rgba(255,255,255,.65)";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.roundRect(
    -22,
    -22,
    44,
    44,
    8
  );

  ctx.stroke();


  /* highlight */

  ctx.strokeStyle =
    "rgba(255,255,255,.85)";

  ctx.lineWidth = 5;

  ctx.beginPath();

  ctx.moveTo(
    -18,
    -17
  );

  ctx.lineTo(
    -5,
    -24
  );

  ctx.stroke();


  drawSimpleFace(
    "#123148"
  );

  ctx.restore();
}


/* =========================================================
   SIMPLE FACE
========================================================= */

function drawSimpleFace(
  color,
  cx = 0,
  cy = 0
) {

  ctx.fillStyle =
    color;

  ctx.beginPath();

  ctx.arc(
    cx - 8,
    cy - 4,
    3,
    0,
    Math.PI * 2
  );

  ctx.arc(
    cx + 8,
    cy - 4,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.strokeStyle =
    color;

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.arc(
    cx,
    cy + 5,
    7,
    0,
    Math.PI
  );

  ctx.stroke();
}


/* =========================================================
   OBSTACLES
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


  if (
    settings.obstacle ===
    "neon-block"
  ) {

    ctx.shadowBlur = 25;
    ctx.shadowColor =
      "#ff3f91";

    ctx.fillStyle =
      "#ff3f91";

    ctx.beginPath();

    ctx.roundRect(
      -size / 2,
      -size / 2,
      size,
      size,
      9
    );

    ctx.fill();


    ctx.shadowBlur = 0;

    ctx.fillStyle =
      "rgba(255,255,255,.45)";

    ctx.fillRect(
      -size * .22,
      -size * .32,
      size * .16,
      size * .16
    );
  }


  else if (
    settings.obstacle ===
    "diamond"
  ) {

    ctx.rotate(
      Math.PI / 4
    );

    ctx.shadowBlur = 25;
    ctx.shadowColor =
      "#ff4f70";

    ctx.fillStyle =
      "#ff4f70";

    ctx.beginPath();

    ctx.roundRect(
      -size / 2,
      -size / 2,
      size,
      size,
      7
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
      "rgba(255,255,255,.45)";

    ctx.fillRect(
      -size * .2,
      -size * .2,
      size * .18,
      size * .18
    );
  }


  else if (
    settings.obstacle === "rock" ||
    settings.obstacle === "rock-fast"
  ) {

    const rockColor =
      settings.obstacle === "rock-fast"
        ? "#e4874f"
        : "#b77a50";

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      rockColor;

    ctx.fillStyle =
      rockColor;

    drawRock(
      size
    );


    ctx.shadowBlur = 0;

    ctx.fillStyle =
      "rgba(255,220,180,.28)";

    ctx.beginPath();

    ctx.moveTo(
      -size * .25,
      -size * .3
    );

    ctx.lineTo(
      size * .1,
      -size * .42
    );

    ctx.lineTo(
      size * .25,
      -size * .1
    );

    ctx.closePath();

    ctx.fill();
  }


  else if (
    settings.obstacle ===
    "fruit-hazard"
  ) {

    drawHazardFruit(
      size
    );
  }


  else if (
    settings.obstacle ===
    "coral"
  ) {

    drawCoralObstacle(
      size
    );
  }


  else if (
    settings.obstacle ===
    "sand"
  ) {

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      "#ffb64c";

    ctx.fillStyle =
      "#e69b42";

    ctx.beginPath();

    ctx.arc(
      0,
      8,
      size / 2,
      Math.PI,
      0
    );

    ctx.fill();

    ctx.fillStyle =
      "#ffc966";

    ctx.beginPath();

    ctx.arc(
      -8,
      3,
      5,
      0,
      Math.PI * 2
    );

    ctx.arc(
      8,
      7,
      4,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }


  else if (
    settings.obstacle ===
    "tree"
  ) {

    drawTreeObstacle(
      size
    );
  }


  else if (
    settings.obstacle ===
    "comet"
  ) {

    drawComet(
      size
    );
  }


  else if (
    settings.obstacle ===
    "iceberg"
  ) {

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
    -size * .5,
    size * .15
  );

  ctx.lineTo(
    -size * .25,
    -size * .45
  );

  ctx.lineTo(
    size * .25,
    -size * .55
  );

  ctx.lineTo(
    size * .55,
    0
  );

  ctx.lineTo(
    size * .25,
    size * .48
  );

  ctx.lineTo(
    -size * .4,
    size * .4
  );

  ctx.closePath();

  ctx.fill();
}


/* =========================================================
   FRUIT HAZARD
========================================================= */

function drawHazardFruit(
  size
) {

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "#ff477a";

  ctx.fillStyle =
    "#ff547f";

  ctx.beginPath();

  ctx.arc(
    0,
    4,
    size * .48,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#64ee91";

  ctx.beginPath();

  ctx.ellipse(
    9,
    -size * .42,
    10,
    5,
    -.5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#ffe7a5";

  ctx.beginPath();

  ctx.arc(
    -7,
    -2,
    2,
    0,
    Math.PI * 2
  );

  ctx.arc(
    7,
    6,
    2,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================================================
   CORAL OBSTACLE
========================================================= */

function drawCoralObstacle(
  size
) {

  ctx.shadowBlur = 20;

  ctx.shadowColor =
    "#ff5f9c";

  ctx.strokeStyle =
    "#ff6da8";

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
    -2
  );

  ctx.lineTo(
    -size / 2,
    -size / 3
  );

  ctx.moveTo(
    0,
    8
  );

  ctx.lineTo(
    size / 2,
    -size / 4
  );

  ctx.stroke();


  ctx.fillStyle =
    "#ff9bc3";

  ctx.beginPath();

  ctx.arc(
    -size / 2,
    -size / 3,
    5,
    0,
    Math.PI * 2
  );

  ctx.arc(
    size / 2,
    -size / 4,
    5,
    0,
    Math.PI * 2
  );

  ctx.arc(
    0,
    -size / 2,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();
}


/* =========================================================
   TREE OBSTACLE
========================================================= */

function drawTreeObstacle(
  size
) {

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "#42ff88";

  ctx.fillStyle =
    "#49d978";

  ctx.beginPath();

  ctx.arc(
    0,
    -size * .2,
    size * .48,
    0,
    Math.PI * 2
  );

  ctx.arc(
    -size * .28,
    size * .05,
    size * .32,
    0,
    Math.PI * 2
  );

  ctx.arc(
    size * .28,
    size * .05,
    size * .32,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#75472b";

  ctx.fillRect(
    -7,
    size * .15,
    14,
    size * .58
  );
}


/* =========================================================
   COMET
========================================================= */

function drawComet(
  size
) {

  ctx.shadowBlur = 25;
  ctx.shadowColor =
    "#80baff";

  ctx.strokeStyle =
    "#718cff";

  ctx.lineWidth =
    size * .28;

  ctx.lineCap =
    "round";

  ctx.beginPath();

  ctx.moveTo(
    size * .9,
    size * .8
  );

  ctx.lineTo(
    -size * 1.4,
    -size * 1.4
  );

  ctx.stroke();


  ctx.fillStyle =
    "#d8f5ff";

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


/* =========================================================
   ICEBERG
========================================================= */

function drawIceberg(
  size
) {

  ctx.shadowBlur = 22;

  ctx.shadowColor =
    "#5ce7ff";

  ctx.fillStyle =
    "#86ddf3";

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size
  );

  ctx.lineTo(
    size * .72,
    size * .6
  );

  ctx.lineTo(
    size * .25,
    size * .48
  );

  ctx.lineTo(
    -size * .7,
    size * .6
  );

  ctx.closePath();

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "rgba(255,255,255,.5)";

  ctx.beginPath();

  ctx.moveTo(
    0,
    -size + 7
  );

  ctx.lineTo(
    size * .25,
    size * .15
  );

  ctx.lineTo(
    -size * .05,
    size * .05
  );

  ctx.closePath();

  ctx.fill();
}


/* =========================================================
   EXPLOSION
========================================================= */

function createExplosion(
  x,
  y,
  perfect
) {

  const count =
    perfect
      ? 28
      : 18;


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
        .35 +
        Math.random() *
        .45,

      size:
        2 +
        Math.random() *
        4
    });
  }
}


/* =========================================================
   PARTICLE
========================================================= */

function drawParticle(
  particle
) {

  ctx.save();

  ctx.globalAlpha =
    Math.max(
      0,
      particle.life * 2
    );

  ctx.shadowBlur = 10;

  ctx.shadowColor =
    "#ffffff";

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
   LANE
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


/* =========================================================
   CONTROLS
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

setupUI();

updateHUD();

draw();
