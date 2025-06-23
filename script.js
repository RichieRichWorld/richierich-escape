const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let richieImg = document.getElementById("richie");

let player = { x: 180, y: 500, w: 40, h: 60 };
let keys = {};
let jeets = [];
let treasures = [];
let score = 0;
let gameOver = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawPlayer() {
  ctx.drawImage(richieImg, player.x, player.y, player.w, player.h);
}

function spawnJeet() {
  jeets.push({ x: Math.random() * 360, y: -50, size: 40 });
}

function spawnTreasure() {
  treasures.push({ x: Math.random() * 360, y: -50, size: 30 });
}

function collision(a, b) {
  return a.x < b.x + b.size &&
         a.x + a.w > b.x &&
         a.y < b.y + b.size &&
         a.y + a.h > b.y;
}

function update() {
  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;

  jeets.forEach(j => j.y += 4);
  treasures.forEach(t => t.y += 3);

  jeets = jeets.filter(j => {
    if (collision(player, j)) gameOver = true;
    return j.y < canvas.height;
  });

  treasures = treasures.filter(t => {
    if (collision(player, t)) {
      score += 1;
      return false;
    }
    return t.y < canvas.height;
  });
}

function drawObjects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  ctx.fillStyle = "red";
  jeets.forEach(j => ctx.fillRect(j.x, j.y, j.size, j.size));
  ctx.fillStyle = "gold";
  treasures.forEach(t => ctx.fillRect(t.x, t.y, t.size, t.size));
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);
}

function gameLoop() {
  if (!gameOver) {
    update();
    drawObjects();
    if (Math.random() < 0.02) spawnJeet();
    if (Math.random() < 0.01) spawnTreasure();
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over! Score: " + score, 50, 300);
  }
}

richieImg.onload = () => {
  gameLoop();
}