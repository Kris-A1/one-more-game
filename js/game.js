/* =========================================================
   1M — ONE MORE
   COMPLETE GAME SCRIPT
   ========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("bestScore");
const multiplierElement = document.getElementById("multiplier");
const strikeDisplay = document.getElementById("strikeDisplay");

const overlay = document.getElementById("overlay");
const overlayLabel = document.getElementById("overlayLabel");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const startButton = document.getElementById("startButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const attackButton = document.getElementById("attackButton");

const animalChooser = document.getElementById("animalChooser");
const animalCards = document.querySelectorAll(".animal-card");

const levelName = document.getElementById("levelName");
const gameMessage = document.getElementById("gameMessage");
const attackInstruction = document.getElementById("attackInstruction");
const attackCount = document.getElementById("attackCount");

/* =========================================================
   LEVELS
   ========================================================= */

const LEVELS = {
  1: {
    name: "NEON RUN",
    world: "neon",
    color: "#42f5ff",
    obstacle: "#ff3b81",
    speed: 175,
    spawn: 0.95,
    strikes: 0,
    attack: false
  },

  2: {
    name: "NEON RUSH",
    world: "neon",
    color: "#42f5ff",
    obstacle: "#ff3b81",
    speed: 225,
    spawn: 0.78,
    strikes: 3,
    attack: false
  },

  3: {
    name: "ANIMAL RUN",
    world: "animal",
    color: "#7cff6b",
    obstacle: "#ffb347",
    speed: 210,
    spawn: 0.82,
    strikes: 3,
    attack: false
  },

  4: {
    name: "ANIMAL RUSH",
    world: "animal",
    color: "#7cff6b",
    obstacle: "#ff5577",
    speed: 265,
    spawn: 0.65,
    strikes: 3,
    attack: false
  },

  5: {
    name: "FRUIT RUN",
    world: "fruit",
    color: "#ffdd55",
    obstacle: "#ff4d6d",
    speed: 245,
    spawn: 0.70,
    strikes: 3,
    attack: false
  },

  6: {
    name: "OCEAN",
    world: "ocean",
    color: "#55ddff",
    obstacle: "#ffffff",
    speed: 255,
    spawn: 0.68,
    strikes: 5,
    attack: true
  },

  7: {
    name: "DESERT",
    world: "desert",
    color: "#ffd166",
    obstacle: "#ef8354",
    speed: 270,
    spawn: 0.64,
    strikes: 5,
    attack: true
  },

  8: {
    name: "FOREST",
    world: "forest",
    color: "#78e08f",
    obstacle: "#ff7675",
    speed: 280,
    spawn: 0.60,
    strikes: 5,
    attack: true
  },

  9: {
    name: "SPACE",
    world: "space",
    color: "#b388ff",
    obstacle: "#ff4d6d",
    speed: 295,
    spawn: 0.57,
    strikes: 5,
    attack: true
  },

  10: {
    name: "ANTARCTICA",
    world: "ice",
    color: "#9be7ff",
    obstacle: "#ffffff",
    speed: 310,
    spawn: 0.54,
    strikes: 5,
    attack: true
  }
};

/* =========================================================
   GAME STATE
   ========================================================= */

const params = new URLSearchParams(window.location.search);

let level = Number(params.get("level")) || 1;

if (level < 1 || level > 10) {
  level = 1;
}

const settings = LEVELS[level];

let running = false;
let gameOver = false;

let score = 0;
let bestScore = Number(localStorage.getItem("oneMoreBest") || 0);

let multiplier = 1;
let strikes = settings.strikes;
let attackCharges = settings.strikes;

let lastTime = 0;
let spawnTimer = 0;
let scoreTimer = 0;

let playerLane = 1;
let targetLane = 1;

let obstacles = [];
let particles = [];

let selectedAnimal = "BUNNY";

let canvasWidth = 360;
let canvasHeight = 490;

/* =========================================================
   CANVAS
   ========================================================= */

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();

  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvasWidth = width;
  canvasHeight = height;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

/* =========================================================
   UI
   ========================================================= */

bestScoreElement.textContent = bestScore;

function updateUI() {
  scoreElement.textContent = Math.floor(score);
  bestScoreElement.textContent = bestScore;

  multiplierElement.textContent = `x${multiplier}`;

  if (settings.strikes > 0) {
    strikeDisplay.classList.remove("hidden");
    strikeDisplay.innerHTML =
      `<span>STRIKES</span><strong>×${strikes}</strong>`;
  } else {
    strikeDisplay.classList.add("hidden");
  }

  if (attackButton) {
    if (settings.attack && running) {
      attackButton.classList.remove("hidden");
    } else {
      attackButton.classList.add("hidden");
    }
  }

  if (attackInstruction) {
    if (settings.attack) {
      attackInstruction.classList.remove("hidden");
    } else {
      attackInstruction.classList.add("hidden");
    }
  }

  if (attackCount) {
    attackCount.textContent = `×${attackCharges}`;
  }
}

function updateLevelUI() {
  levelName.textContent = settings.name;

  overlayLabel.textContent = `LEVEL ${level}`;

  overlayTitle.textContent = settings.name;

  if (level === 1) {
    overlayText.innerHTML =
      "Dodge everything.<br>How long can you survive?";
  } else if (level === 2) {
    overlayText.innerHTML =
      "Faster.<br>You have 3 strikes.";
  } else if (level === 3 || level === 4) {
    overlayText.innerHTML =
      "Choose your runner.<br>Dodge everything.";
  } else if (level === 5) {
    overlayText.innerHTML =
      "Fruit is falling.<br>Keep running.";
  } else if (level === 6) {
    overlayText.innerHTML =
      "Dive into the ocean.<br>Strike dangerous obstacles.";
  } else if (level === 7) {
    overlayText.innerHTML =
      "Cross the desert.<br>Strike obstacles.";
  } else if (level === 8) {
    overlayText.innerHTML =
      "Enter the forest.<br>Strike obstacles.";
  } else if (level === 9) {
    overlayText.innerHTML =
      "Reach space.<br>Strike obstacles.";
  } else {
    overlayText.innerHTML =
      "Survive Antarctica.<br>Strike everything in your way.";
  }

  if (level === 3 || level === 4) {
    animalChooser.classList.remove("hidden");
  } else {
    animalChooser.classList.add("hidden");
  }
}

/* =========================================================
   ANIMAL SELECTOR
   ========================================================= */

animalCards.forEach(card => {
  card.addEventListener("click", () => {
    animalCards.forEach(other => {
      other.classList.remove("selected");
    });

    card.classList.add("selected");

    selectedAnimal = card.dataset.animal || "BUNNY";
  });
});

/* =========================================================
   PLAYER
   ========================================================= */

const player = {
  x: 0,
  y: 0,
  width: 38,
  height: 42,
  lane: 1
};

function laneX(lane) {
  const laneWidth = canvasWidth / 3;

  return laneWidth * lane + laneWidth / 2;
}

function updatePlayer() {
  player.lane += (targetLane - player.lane) * 0.16;
  player.x = laneX(player.lane);
  player.y = canvasHeight - 70;
}

/* =========================================================
   OBSTACLES
   ========================================================= */

const fruitTypes = [
  "🍉",
  "🍍",
  "🍓",
  "🍑"
];

const animalTypes = [
  "🦊",
  "🐻",
  "🐗",
  "🦝"
];

function createObstacle() {
  const lane = Math.floor(Math.random() * 3);

  let type = "block";

  if (settings.world === "fruit") {
    type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
  }

  if (settings.world === "animal") {
    type = animalTypes[Math.floor(Math.random() * animalTypes.length)];
  }

  obstacles.push({
    lane,
    x: laneX(lane),
    y: -45,
    width: 38,
    height: 38,
    speed: settings.speed * (0.88 + Math.random() * 0.28),
    type,
    rotation: Math.random() * Math.PI * 2,
    destroyed: false
  });
}

function updateObstacles(dt) {
  for (const obstacle of obstacles) {
    obstacle.y += obstacle.speed * dt;
    obstacle.rotation += dt * 2;
  }

  for (const obstacle of obstacles) {
    if (!obstacle.destroyed && checkCollision(obstacle)) {
      hitObstacle(obstacle);
    }
  }

  obstacles = obstacles.filter(obstacle => {
    if (obstacle.destroyed) {
      return false;
    }

    if (obstacle.y > canvasHeight + 60) {
      score += 10;
      return false;
    }

    return true;
  });
}

/* =========================================================
   COLLISION
   ========================================================= */

function checkCollision(obstacle) {
  const px = player.x - player.width / 2;
  const py = player.y - player.height / 2;

  const ox = obstacle.x - obstacle.width / 2;
  const oy = obstacle.y - obstacle.height / 2;

  return (
    px < ox + obstacle.width &&
    px + player.width > ox &&
    py < oy + obstacle.height &&
    py + player.height > oy
  );
}

function hitObstacle(obstacle) {
  if (!running || obstacle.destroyed) {
    return;
  }

  if (settings.strikes <= 0) {
    endGame();
    return;
  }

  obstacle.destroyed = true;

  strikes--;
  multiplier = 1;

  createExplosion(obstacle.x, obstacle.y);

  showMessage(`STRIKE! ${strikes} LEFT`);

  if (strikes <= 0) {
    endGame();
  }
}

/* =========================================================
   ATTACK
   ========================================================= */

function attack() {
  if (!running || !settings.attack || attackCharges <= 0) {
    return;
  }

  attackCharges--;

  let destroyed = false;

  for (const obstacle of obstacles) {
    if (
      !obstacle.destroyed &&
      obstacle.lane === Math.round(player.lane) &&
      Math.abs(obstacle.y - player.y) < 125
    ) {
      obstacle.destroyed = true;
      destroyed = true;

      score += 35;
      multiplier = Math.min(multiplier + 1, 9);

      createExplosion(obstacle.x, obstacle.y);
    }
  }

  if (destroyed) {
    showMessage("STRIKE!");
  }

  updateUI();
}

attackButton.addEventListener("click", attack);

/* =========================================================
   MOVEMENT
   ========================================================= */

function moveLeft() {
  if (!running) {
    return;
  }

  targetLane = Math.max(0, targetLane - 1);
}

function moveRight() {
  if (!running) {
    return;
  }

  targetLane = Math.min(2, targetLane + 1);
}

leftButton.addEventListener("pointerdown", event => {
  event.preventDefault();
  moveLeft();
});

rightButton.addEventListener("pointerdown", event => {
  event.preventDefault();
  moveRight();
});

window.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    event.preventDefault();
    moveLeft();
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    event.preventDefault();
    moveRight();
  }

  if (event.code === "Space") {
    event.preventDefault();

    if (running) {
      attack();
    }
  }
});

/* =========================================================
   TOUCH SWIPE
   ========================================================= */

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", event => {
  const touch = event.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", event => {
  const touch = event.changedTouches[0];

  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) < 25 && Math.abs(dy) < 25) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) {
      moveLeft();
    } else {
      moveRight();
    }
  }
}, { passive: true });

/* =========================================================
   PARTICLES
   ========================================================= */

function createExplosion(x, y) {
  for (let i = 0; i < 16; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 180,
      vy: (Math.random() - 0.5) * 180,
      life: 0.55 + Math.random() * 0.35,
      maxLife: 0.8,
      size: 2 + Math.random() * 4
    });
  }
}

function updateParticles(dt) {
  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= dt;
  }

  particles = particles.filter(p => p.life > 0);
}

/* =========================================================
   BACKGROUNDS
   ========================================================= */

function drawBackground() {
  const gradient = ctx.createLinearGradient(
    0,
    0,
    0,
    canvasHeight
  );

  if (settings.world === "neon") {
    gradient.addColorStop(0, "#080d22");
    gradient.addColorStop(1, "#14051d");
  } else if (settings.world === "animal") {
    gradient.addColorStop(0, "#06150e");
    gradient.addColorStop(1, "#102b1a");
  } else if (settings.world === "fruit") {
    gradient.addColorStop(0, "#251005");
    gradient.addColorStop(1, "#401018");
  } else if (settings.world === "ocean") {
    gradient.addColorStop(0, "#041d38");
    gradient.addColorStop(1, "#03101e");
  } else if (settings.world === "desert") {
    gradient.addColorStop(0, "#351708");
    gradient.addColorStop(1, "#1e0905");
  } else if (settings.world === "forest") {
    gradient.addColorStop(0, "#061a10");
    gradient.addColorStop(1, "#031009");
  } else if (settings.world === "space") {
    gradient.addColorStop(0, "#09051d");
    gradient.addColorStop(1, "#020207");
  } else {
    gradient.addColorStop(0, "#071c2a");
    gradient.addColorStop(1, "#031017");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  drawWorldDetails();
}

function drawWorldDetails() {
  ctx.save();

  if (settings.world === "space") {
    ctx.fillStyle = "rgba(255,255,255,.7)";

    for (let i = 0; i < 45; i++) {
      const x = (i * 83) % canvasWidth;
      const y = (i * 137) % canvasHeight;

      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  if (settings.world === "ocean") {
    ctx.strokeStyle = "rgba(80,200,255,.12)";
    ctx.lineWidth = 2;

    for (let y = 80; y < canvasHeight; y += 55) {
      ctx.beginPath();

      for (let x = 0; x <= canvasWidth; x += 20) {
        ctx.lineTo(
          x,
          y + Math.sin(x * 0.04 + y) * 5
        );
      }

      ctx.stroke();
    }
  }

  if (settings.world === "forest") {
    ctx.fillStyle = "rgba(80,180,100,.08)";

    for (let i = 0; i < 12; i++) {
      const x = (i * 61) % canvasWidth;

      ctx.beginPath();
      ctx.arc(x, canvasHeight - 90, 45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (settings.world === "desert") {
    ctx.fillStyle = "rgba(255,210,120,.12)";

    for (let i = 0; i < 7; i++) {
      const x = i * 70 - 20;

      ctx.beginPath();
      ctx.arc(
        x,
        canvasHeight - 10,
        70,
        Math.PI,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  if (settings.world === "ice") {
    ctx.fillStyle = "rgba(180,240,255,.10)";

    for (let i = 0; i < 9; i++) {
      const x = i * 48;

      ctx.beginPath();
      ctx.moveTo(x, canvasHeight);
      ctx.lineTo(x + 25, canvasHeight - 80);
      ctx.lineTo(x + 55, canvasHeight);
      ctx.fill();
    }
  }

  ctx.restore();

  /* lanes */

  ctx.strokeStyle = "rgba(255,255,255,.07)";
  ctx.lineWidth = 1;

  for (let i = 1; i < 3; i++) {
    const x = (canvasWidth / 3) * i;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
}

/* =========================================================
   DRAW PLAYER
   ========================================================= */

function drawPlayer() {
  const x = player.x;
  const y = player.y;

  ctx.save();

  ctx.shadowBlur = 20;
  ctx.shadowColor = settings.color;

  if (level === 3 || level === 4) {
    drawAnimal(x, y);
  } else if (settings.world === "ocean") {
    drawFish(x, y);
  } else if (settings.world === "desert") {
    drawSun(x, y);
  } else if (settings.world === "forest") {
    drawPlant(x, y);
  } else if (settings.world === "space") {
    drawRobot(x, y);
  } else if (settings.world === "ice") {
    drawIceCube(x, y);
  } else {
    drawNeonPlayer(x, y);
  }

  ctx.restore();
}

function drawNeonPlayer(x, y) {
  ctx.fillStyle = settings.color;

  ctx.beginPath();
  ctx.roundRect(
    x - 17,
    y - 20,
    34,
    40,
    10
  );
  ctx.fill();

  ctx.fillStyle = "#06101c";

  ctx.beginPath();
  ctx.arc(x - 7, y - 5, 3, 0, Math.PI * 2);
  ctx.arc(x + 7, y - 5, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawAnimal(x, y) {
  const emojis = {
    BUNNY: "🐰",
    FOX: "🦊",
    CAT: "🐱",
    PANDA: "🐼"
  };

  ctx.shadowBlur = 0;

  ctx.font = "38px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    emojis[selectedAnimal] || "🐰",
    x,
    y
  );
}

function drawFish(x, y) {
  ctx.fillStyle = "#55ddff";

  ctx.beginPath();
  ctx.ellipse(x, y, 24, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x - 20, y);
  ctx.lineTo(x - 38, y - 14);
  ctx.lineTo(x - 38, y + 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#041522";

  ctx.beginPath();
  ctx.arc(x + 10, y - 4, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSun(x, y) {
  ctx.fillStyle = "#ffd166";

  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 4;

  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;

    ctx.beginPath();
    ctx.moveTo(
      x + Math.cos(a) * 28,
      y + Math.sin(a) * 28
    );

    ctx.lineTo(
      x + Math.cos(a) * 38,
      y + Math.sin(a) * 38
    );

    ctx.stroke();
  }
}

function drawPlant(x, y) {
  ctx.fillStyle = "#78e08f";

  ctx.beginPath();
  ctx.roundRect(x - 7, y - 2, 14, 25, 4);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(x - 14, y - 10, 13, 7, -0.6, 0, Math.PI * 2);
  ctx.ellipse(x + 14, y - 10, 13, 7, 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawRobot(x, y) {
  ctx.fillStyle = "#b388ff";

  ctx.fillRect(x - 18, y - 20, 36, 35);

  ctx.fillStyle = "#09051d";

  ctx.fillRect(x - 10, y - 10, 6, 6);
  ctx.fillRect(x + 4, y - 10, 6, 6);

  ctx.strokeStyle = "#b388ff";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x, y - 29);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y - 32, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#ff4d6d";
  ctx.fill();
}

function drawIceCube(x, y) {
  ctx.fillStyle = "#bcecff";

  ctx.beginPath();
  ctx.roundRect(
    x - 20,
    y - 20,
    40,
    40,
    8
  );
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  ctx.stroke();
}

/* =========================================================
   DRAW OBSTACLES
   ========================================================= */

function drawObstacles() {
  for (const obstacle of obstacles) {
    if (obstacle.destroyed) {
      continue;
    }

    ctx.save();

    ctx.translate(obstacle.x, obstacle.y);
    ctx.rotate(obstacle.rotation);

    if (typeof obstacle.type === "string" &&
        obstacle.type.includes("🍉")) {
      ctx.font = "32px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(obstacle.type, 0, 0);
    } else if (
      typeof obstacle.type === "string" &&
      ["🍍", "🍓", "🍑", "🦊", "🐻", "🐗", "🦝"].includes(obstacle.type)
    ) {
      ctx.font = "32px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(obstacle.type, 0, 0);
    } else {
      ctx.fillStyle = settings.obstacle;
      ctx.shadowBlur = 18;
      ctx.shadowColor = settings.obstacle;

      ctx.beginPath();
      ctx.roundRect(
        -19,
        -19,
        38,
        38,
        8
      );
      ctx.fill();

      ctx.fillStyle = "rgba(0,0,0,.28)";

      ctx.fillRect(
        -8,
        -8,
        16,
        16
      );
    }

    ctx.restore();
  }
}

/* =========================================================
   DRAW PARTICLES
   ========================================================= */

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(
      0,
      p.life / p.maxLife
    );

    ctx.fillStyle = settings.color;

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

  ctx.globalAlpha = 1;
}

/* =========================================================
   SCORE
   ========================================================= */

function updateScore(dt) {
  scoreTimer += dt;

  if (scoreTimer >= 0.1) {
    scoreTimer = 0;

    score += multiplier;

    if (
      score > 0 &&
      score % 100 === 0
    ) {
      multiplier = Math.min(
        multiplier + 1,
        9
      );
    }
  }
}

/* =========================================================
   GAME LOOP
   ========================================================= */

function gameLoop(timestamp) {
  if (!running) {
    return;
  }

  const dt = Math.min(
    (timestamp - lastTime) / 1000,
    0.035
  );

  lastTime = timestamp;

  spawnTimer += dt;

  if (spawnTimer >= settings.spawn) {
    spawnTimer = 0;

    createObstacle();

    if (Math.random() < 0.18) {
      createObstacle();
    }
  }

  updatePlayer();
  updateObstacles(dt);
  updateParticles(dt);
  updateScore(dt);

  drawBackground();
  drawObstacles();
  drawPlayer();
  drawParticles();

  updateUI();

  requestAnimationFrame(gameLoop);
}

/* =========================================================
   START
   ========================================================= */

function startGame() {
  running = true;
  gameOver = false;

  score = 0;
  multiplier = 1;

  strikes = settings.strikes;
  attackCharges = settings.strikes;

  obstacles = [];
  particles = [];

  playerLane = 1;
  targetLane = 1;

  spawnTimer = 0;
  scoreTimer = 0;

  gameMessage.textContent = "";

  overlay.style.display = "none";

  updateUI();

  resizeCanvas();

  lastTime = performance.now();

  requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", startGame);

/* =========================================================
   GAME OVER
   ========================================================= */

function endGame() {
  if (!running) {
    return;
  }

  running = false;
  gameOver = true;

  if (score > bestScore) {
    bestScore = Math.floor(score);

    localStorage.setItem(
      "oneMoreBest",
      bestScore
    );
  }

  updateUI();

  overlay.style.display = "flex";

  overlayLabel.textContent = "GAME OVER";
  overlayTitle.textContent = "ONE MORE?";
  overlayText.innerHTML =
    `SCORE ${Math.floor(score)}<br>BEST ${bestScore}`;

  startButton.textContent = "▶ PLAY AGAIN";

  animalChooser.classList.add("hidden");

  showMessage("");
}

/* =========================================================
   MESSAGE
   ========================================================= */

let messageTimer = null;

function showMessage(message) {
  gameMessage.textContent = message;

  clearTimeout(messageTimer);

  if (message) {
    messageTimer = setTimeout(() => {
      gameMessage.textContent = "";
    }, 900);
  }
}

/* =========================================================
   INITIAL DRAW
   ========================================================= */

function initialDraw() {
  resizeCanvas();

  updateLevelUI();
  updateUI();

  drawBackground();
  updatePlayer();
  drawPlayer();
}

initialDraw();
