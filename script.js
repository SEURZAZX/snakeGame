document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("gameBoard");
  const scoreDisplay = document.getElementById("score");
  const speedDisplay = document.getElementById("speed");
  const startButton = document.getElementById("startButton");
  const messageDisplay = document.getElementById("message");

  // Pengaturan Game
  const gridSize = 20; // 20x20 kotak
  const cellSize = 20; // Ukuran setiap kotak dalam piksel
  let snake = [{ x: 10, y: 10 }]; // Posisi awal ular (kepala di tengah)
  let food = {}; // Posisi makanan
  let direction = "right"; // Arah awal ular
  let score = 0;
  let gameInterval;
  let gameSpeed = 150; // Kecepatan game dalam milidetik (makin kecil, makin cepat)
  let isGameOver = false;

  // Mengatur ukuran papan game secara dinamis
  gameBoard.style.width = `${gridSize * cellSize}px`;
  gameBoard.style.height = `${gridSize * cellSize}px`;
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  // Fungsi untuk membuat sel papan game
  function createGridCells() {
    gameBoard.innerHTML = ""; // Bersihkan papan
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");
      gameBoard.appendChild(cell);
    }
  }

  // Fungsi untuk menggambar ular dan makanan di papan
  function draw() {
    // Hapus kelas 'snake', 'head', 'food' dari semua sel
    document.querySelectorAll(".grid-cell").forEach((cell) => {
      cell.classList.remove("snake", "head", "food");
    });

    // Gambar makanan
    const foodIndex = food.y * gridSize + food.x;
    document.querySelectorAll(".grid-cell")[foodIndex].classList.add("food");

    // Gambar ular
    snake.forEach((segment, index) => {
      const snakeIndex = segment.y * gridSize + segment.x;
      const cell = document.querySelectorAll(".grid-cell")[snakeIndex];
      cell.classList.add("snake");
      if (index === 0) {
        // Kepala ular
        cell.classList.add("head");
      }
    });
  }

  // Fungsi untuk memindahkan ular
  function moveSnake() {
    if (isGameOver) return;

    const head = { ...snake[0] }; // Salin posisi kepala

    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    // Cek tabrakan dengan dinding
    if (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize ||
      checkCollision(head) // Cek tabrakan dengan tubuh sendiri
    ) {
      endGame();
      return;
    }

    snake.unshift(head); // Tambahkan kepala baru

    // Cek apakah makan makanan
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreDisplay.textContent = score;
      generateFood(); // Buat makanan baru
      increaseSpeed(); // Tingkatkan kecepatan
    } else {
      snake.pop(); // Hapus ekor jika tidak makan
    }

    draw(); // Gambar ulang papan
  }

  // Fungsi untuk mengecek tabrakan dengan tubuh ular
  function checkCollision(head) {
    // Mulai dari segmen ke-4 untuk menghindari tabrakan dengan 3 segmen pertama (terlalu pendek)
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  // Fungsi untuk membuat makanan di posisi acak
  function generateFood() {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (
      // Pastikan makanan tidak muncul di atas tubuh ular
      snake.some(
        (segment) =>
          segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
      )
    );
    food = newFoodPosition;
  }

  // Fungsi untuk meningkatkan kecepatan game
  function increaseSpeed() {
    if (gameSpeed > 50) {
      // Batas kecepatan maksimal
      gameSpeed -= 5; // Kurangi interval waktu
      speedDisplay.textContent = `${gameSpeed}ms`;
      clearInterval(gameInterval); // Hentikan interval lama
      gameInterval = setInterval(moveSnake, gameSpeed); // Mulai interval baru
    }
  }

  // Fungsi untuk mengubah arah ular
  function changeDirection(event) {
    if (isGameOver) return;

    const keyPressed = event.key;
    const currentDirection = direction;

    // Mencegah ular berbalik arah 180 derajat
    if (keyPressed === "ArrowUp" && currentDirection !== "down") {
      direction = "up";
    } else if (keyPressed === "ArrowDown" && currentDirection !== "up") {
      direction = "down";
    } else if (keyPressed === "ArrowLeft" && currentDirection !== "right") {
      direction = "left";
    } else if (keyPressed === "ArrowRight" && currentDirection !== "left") {
      direction = "right";
    }
  }

  // Fungsi untuk memulai game
  function startGame() {
    if (gameInterval) clearInterval(gameInterval); // Hentikan game sebelumnya jika ada

    // Reset semua status game
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    score = 0;
    gameSpeed = 150;
    isGameOver = false;

    scoreDisplay.textContent = score;
    speedDisplay.textContent = `${gameSpeed}ms`;
    messageDisplay.textContent = ""; // Hapus pesan game over
    startButton.textContent = "Mulai Ulang Game";

    createGridCells(); // Buat ulang sel grid
    generateFood(); // Buat makanan pertama
    draw(); // Gambar kondisi awal
    gameInterval = setInterval(moveSnake, gameSpeed); // Mulai pergerakan ular
    document.addEventListener("keydown", changeDirection); // Dengarkan tombol panah
  }

  // Fungsi untuk mengakhiri game
  function endGame() {
    isGameOver = true;
    clearInterval(gameInterval); // Hentikan pergerakan ular
    document.removeEventListener("keydown", changeDirection); // Berhenti mendengarkan tombol
    messageDisplay.textContent = `Game Over! Skor Anda: ${score}`;
    messageDisplay.style.color = "#dc3545";
    startButton.textContent = "Main Lagi"; // Ubah teks tombol
  }

  // Event listener untuk tombol mulai
  startButton.addEventListener("click", startGame);

  // Inisialisasi awal
  createGridCells();
  draw(); // Gambar papan kosong dengan ular di posisi awal
});
