const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let player = { x: 180, y: 500, width: 40, height: 60, speed: 5 };
let keys = {};

let score = 0;
let gameOver = false;
let jeets = [];
let treasures = [];
let frame = 0;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function spawnJeet() {
  jeets.push({ x: Math.random() * 360, y: -40, size: 40 });
}
function spawnTreasure() {
  treasures.push({ x: Math.random() * 360, y: -40, size: 30 });
}

function drawPlayer() {
  const img = document.getElementById("richie");
  ctx.drawImage(img, player.x, player.y, player.width, player.height);
}

function drawJeets() {
  jeets.forEach(j => {
    j.y += 4;
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(j.x, j.y, j.size / 2, 0, Math.PI * 2);
    ctx.fill();
    if (collision(player, j)) gameOver = true;
  });
}

function drawTreasures() {
  treasures.forEach(t => {
    t.y += 3;
    ctx.fillStyle = "gold";
    ctx.fillRect(t.x, t.y, t.size, t.size);
    if (collision(player, t)) {
      score++;
      t.y = 1000; // hide
    }
  });
}

function collision(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function update() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += player.speed;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawPlayer();
  drawJeets();
  drawTreasures();
  drawScore();

  frame++;
  if (frame % 60 === 0) spawnJeet();
  if (frame % 180 === 0) spawnTreasure();

  if (!gameOver) requestAnimationFrame(gameLoop);
  else alert("Game Over! Score: " + score);
}

const img = new Image();
img.src = "assets/richie.png";
img.id = "richie";
img.onload = () => requestAnimationFrame(gameLoop);
document.body.appendChild(img);
