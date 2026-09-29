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
    background: "#080d22"
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
    background: "#12081e"
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
    background: "#0a1912",

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
    background: "#07150e",

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
    background: "#24130d",

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
    character: "bubble",
    characterName: "BUBBLE",
    description:
      "Dive through the ocean.<br>Watch the coral.",
    attack: true,
    strikes: 5,
    baseSpeed: 270,
    maxSpeed: 350,
    obstacle: "coral",
    background: "#061a2b"
  },

  7: {
    name: "DESERT",
    world: "desert",
    character: "sun",
    characterName: "SUN",
    description:
      "Cross the desert.<br>Don't get buried.",
    attack: true,
    strikes: 5,
    baseSpeed: 280,
    maxSpeed: 360,
    obstacle: "sand",
    background: "#29180b"
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
    background: "#07170d"
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
    background: "#050511"
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
    background: "#081923"
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


  /*
    Attack UI.
  */

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


  /*
    Character UI.
  */

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

  /*
    Difficulty ramps up during
    every run.
  */

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


  /*
    Multiplier.
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
    Movement.
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
    Obstacles.
  */

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

    if (
      obstacle.y >
      canvasHeight + 100
    ) {

      obstacles.splice(i, 1);

      score +=
        10 * multiplier;

      continue;
    }


    /*
      Collision.
    */

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


  /*
    Harder patterns after
    the player has survived.
  */

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
========================================================= */

function drawWorldBackground() {

  if (
    settings.world ===
      "neon" ||
    settings.world ===
      "neon-rush"
  ) {

    drawNeonCity();

  }

  else if (
    settings.world ===
      "animal" ||
    settings.world ===
      "animal-rush"
  ) {

    drawForestBackground();

  }

  else if (
    settings.world ===
    "fruit"
  ) {

    drawFruitBackground();

  }

  else if (
    settings.world ===
    "ocean"
  ) {

    drawOceanBackground();

  }

  else if (
    settings.world ===
    "desert"
  ) {

    drawDesertBackground();

  }

  else if (
    settings.world ===
    "forest"
  ) {

    drawDeepForest();

  }

  else if (
    settings.world ===
    "space"
  ) {

    drawSpaceBackground();

  }

  else if (
    settings.world ===
    "ice"
  ) {

    drawIceBackground();

  }
}


/* =========================================================
   NEON CITY
========================================================= */

function drawNeonCity() {

  ctx.save();

  ctx.globalAlpha =
    settings.world ===
    "neon-rush"
      ? .28
      : .22;

  for (
    let i = 0;
    i < 22;
    i++
  ) {

    const x =
      (i * 67) %
      canvasWidth;

    const height =
      45 +
      ((i * 37) % 150);

    ctx.fillStyle =
      i % 2 === 0
        ? "#162b52"
        : "#28143e";

    ctx.fillRect(
      x,
      canvasHeight -
        150 -
        height,
      38,
      height
    );

  }

  ctx.restore();
}


/* =========================================================
   FOREST BACKGROUND
========================================================= */

function drawForestBackground() {

  ctx.save();

  ctx.globalAlpha = .35;

  for (
    let i = 0;
    i < 13;
    i++
  ) {

    const x =
      (i * 91) %
      canvasWidth;

    const y =
      65 +
      ((i * 43) % 220);

    drawTree(
      x,
      y
    );

  }

  ctx.restore();
}


/* =========================================================
   FRUIT BACKGROUND
========================================================= */

function drawFruitBackground() {

  ctx.save();

  ctx.globalAlpha = .16;

  for (
    let i = 0;
    i < 16;
    i++
  ) {

    const x =
      (i * 71) %
      canvasWidth;

    const y =
      60 +
      ((i * 49) % 230);

    ctx.fillStyle =
      i % 2 === 0
        ? "#ffcc55"
        : "#ff5878";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      18 +
        (i % 3) * 5,
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

  ctx.globalAlpha = .35;

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const x =
      (i * 83) %
      canvasWidth;

    const y =
      90 +
      ((i * 57) % 260);

    ctx.strokeStyle =
      "#1c8da5";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      15 +
        (i % 4) * 7,
      0,
      Math.PI
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

  ctx.globalAlpha = .25;

  ctx.fillStyle =
    "#d79548";

  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const x =
      i *
      (canvasWidth / 8);

    ctx.beginPath();

    ctx.arc(
      x,
      canvasHeight - 120,
      70,
      Math.PI,
      0
    );

    ctx.fill();

  }

  ctx.restore();
}


/* =========================================================
   DEEP FOREST
========================================================= */

function drawDeepForest() {

  ctx.save();

  ctx.globalAlpha = .4;

  for (
    let i = 0;
    i < 15;
    i++
  ) {

    drawTree(
      (i * 73) %
        canvasWidth,
      60 +
        ((i * 31) % 240)
    );

  }

  ctx.restore();
}


/* =========================================================
   SPACE
========================================================= */

function drawSpaceBackground() {

  ctx.save();

  ctx.fillStyle =
    "rgba(255,255,255,.7)";

  for (
    let i = 0;
    i < 65;
    i++
  ) {

    const x =
      (i * 47) %
      canvasWidth;

    const y =
      (i * 83) %
      canvasHeight;

    const size =
      i % 4 === 0
        ? 2
        : 1;

    ctx.fillRect(
      x,
      y,
      size,
      size
    );

  }

  ctx.restore();
}


/* =========================================================
   ICE
========================================================= */

function drawIceBackground() {

  ctx.save();

  ctx.globalAlpha = .25;

  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const x =
      (i * 91) %
      canvasWidth;

    const y =
      80 +
      ((i * 57) % 250);

    ctx.fillStyle =
      "#8ed7ef";

    ctx.beginPath();

    ctx.moveTo(
      x,
      y - 35
    );

    ctx.lineTo(
      x + 25,
      y + 30
    );

    ctx.lineTo(
      x - 25,
      y + 30
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
    "rgba(255,255,255,.025)";

  ctx.fillRect(
    0,
    trackTop,
    canvasWidth,
    205
  );


  ctx.save();

  ctx.strokeStyle =
    "rgba(255,255,255,.055)";

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

    drawEmojiCharacter(
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

    drawEmojiCharacter(
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

  ctx.shadowBlur = 20;

  ctx.shadowColor =
    settings.world ===
      "neon-rush"
      ? "#64a8ff"
      : "#42f5ff";

  ctx.fillStyle =
    settings.world ===
      "neon-rush"
      ? "#64a8ff"
      : "#42f5ff";

  ctx.beginPath();

  ctx.roundRect(
    -17,
    -22,
    34,
    44,
    11
  );

  ctx.fill();


  ctx.shadowBlur = 0;

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

  ctx.lineWidth = 4;

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
   EMOJI CHARACTER
========================================================= */

function drawEmojiCharacter(
  x,
  y,
  character
) {

  const map = {

    BUNNY: "🐰",
    FOX: "🦊",
    CAT: "🐱",
    PANDA: "🐼",

    WATERMELON: "🍉",
    PINEAPPLE: "🍍",
    STRAWBERRY: "🍓",
    PEACH: "🍑"

  };

  const emoji =
    map[character] ||
    "🙂";


  ctx.save();

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  ctx.font =
    "52px Arial";

  ctx.shadowBlur = 14;

  ctx.shadowColor =
    "rgba(255,255,255,.3)";

  ctx.fillText(
    emoji,
    x,
    y
  );

  ctx.restore();
}


/* =========================================================
   SPECIAL CHARACTERS
========================================================= */

function drawSpecialCharacter(
  x,
  y,
  type
) {

  ctx.save();

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  const map = {

    bubble: "🫧",
    sun: "☀️",
    plant: "🌱",
    robot: "🤖",
    icecube: "🧊"

  };

  ctx.font =
    "54px Arial";

  ctx.shadowBlur = 18;

  ctx.shadowColor =
    "#ffffff";

  ctx.fillText(
    map[type] || "⭐",
    x,
    y
  );

  ctx.restore();
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


  /* NEON */

  if (
    settings.obstacle ===
    "neon-block"
  ) {

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      "#ff3b81";

    ctx.fillStyle =
      "#ff3b81";

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


  /* DIAMOND */

  else if (
    settings.obstacle ===
    "diamond"
  ) {

    ctx.rotate(
      Math.PI / 4
    );

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      "#ff4d65";

    ctx.fillStyle =
      "#ff4d65";

    ctx.fillRect(
      -size / 2,
      -size / 2,
      size,
      size
    );

  }


  /* ROCK */

  else if (
    settings.obstacle ===
      "rock" ||
    settings.obstacle ===
      "rock-fast"
  ) {

    ctx.shadowBlur = 12;

    ctx.shadowColor =
      "#b77b46";

    ctx.fillStyle =
      settings.obstacle ===
        "rock-fast"
        ? "#d08a4b"
        : "#b77b46";

    drawRock(
      size
    );

  }


  /* FRUIT */

  else if (
    settings.obstacle ===
    "fruit-hazard"
  ) {

    ctx.shadowBlur = 12;

    ctx.shadowColor =
      "#ff637d";

    ctx.font =
      `${size + 8}px Arial`;

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.fillText(
      "🍊",
      0,
      0
    );

  }


  /* CORAL */

  else if (
    settings.obstacle ===
    "coral"
  ) {

    ctx.shadowBlur = 15;

    ctx.shadowColor =
      "#ff668f";

    ctx.strokeStyle =
      "#ff668f";

    ctx.lineWidth = 7;

    ctx.lineCap =
      "round";

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
      0
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

  }


  /* SAND */

  else if (
    settings.obstacle ===
    "sand"
  ) {

    ctx.shadowBlur = 12;

    ctx.shadowColor =
      "#e6a34d";

    ctx.fillStyle =
      "#e6a34d";

    ctx.beginPath();

    ctx.arc(
      0,
      10,
      size / 2,
      Math.PI,
      0
    );

    ctx.fill();

  }


  /* TREE */

  else if (
    settings.obstacle ===
    "tree"
  ) {

    ctx.shadowBlur = 12;

    ctx.shadowColor =
      "#43b86b";

    ctx.fillStyle =
      "#43b86b";

    ctx.beginPath();

    ctx.arc(
      0,
      -10,
      size / 2,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      "#70472d";

    ctx.fillRect(
      -5,
      5,
      10,
      size / 2
    );

  }


  /* COMET */

  else if (
    settings.obstacle ===
    "comet"
  ) {

    ctx.shadowBlur = 18;

    ctx.shadowColor =
      "#c3e6ff";

    ctx.fillStyle =
      "#c3e6ff";

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      size / 2,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
      "#718cff";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
      -size / 2,
      0
    );

    ctx.lineTo(
      -size * 1.5,
      size
    );

    ctx.stroke();

  }


  /* ICEBERG */

  else if (
    settings.obstacle ===
    "iceberg"
  ) {

    ctx.shadowBlur = 15;

    ctx.shadowColor =
      "#86d8ef";

    ctx.fillStyle =
      "#86d8ef";

    ctx.beginPath();

    ctx.moveTo(
      0,
      -size
    );

    ctx.lineTo(
      size * .7,
      size * .6
    );

    ctx.lineTo(
      -size * .7,
      size * .6
    );

    ctx.closePath();

    ctx.fill();

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
   TREE
========================================================= */

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
      ? 22
      : 15;


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
      event.key ===
        "ArrowLeft" ||
      event.key.toLowerCase() ===
        "a"
    ) {

      event.preventDefault();

      moveLeft();

    }


    if (
      event.key ===
        "ArrowRight" ||
      event.key.toLowerCase() ===
        "d"
    ) {

      event.preventDefault();

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
