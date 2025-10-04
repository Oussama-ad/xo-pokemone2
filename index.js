var playerTurn, moves, isGameOver, span, restartButton;
playerTurn = "x";
moves = 0;
isGameOver = false;
span = document.getElementsByTagName("span");
restartButton = '<button onclick="playAgain()"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg></button>';

// Pokémon selection logic
var playerPokemon = { x: null, o: null };
var availablePokemon = ["pikachuu.png", "to3ban.png", "Unown.png", "o.png"];
var currentChoosingPlayer = "x";

// Pokémon points
var pokemonPoints = {
  "pikachuu.png": 3,
  "to3ban.png": 2,
  "Unown.png": 4,
  "o.png": 1
};

// Leaderboard data (saved in browser)
var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

function showPokemonModal(player) {
  currentChoosingPlayer = player;
  document.getElementById("pokemon-modal").style.display = "flex";
  document.getElementById("modal-title").textContent = `Player ${player.toUpperCase()}: Choose your Pokémon!`;

  // Filter out already chosen Pokémon for O
  var list = document.getElementById("pokemon-list");
  list.innerHTML = "";
  availablePokemon.forEach(function (poke) {
    if (player === "o" && poke === playerPokemon.x) return;
    var img = document.createElement("img");
    img.src = `public/${poke}`;
    img.className = "pokemon-choice";
    img.setAttribute("data-pokemon", poke);
    img.style.width = "80px";
    img.style.cursor = "pointer";
    img.onclick = function () {
      selectPokemon(poke);
    };
    list.appendChild(img);
  });
}

function selectPokemon(poke) {
  playerPokemon[currentChoosingPlayer] = poke;
  document.getElementById("pokemon-modal").style.display = "none";
  if (currentChoosingPlayer === "x") {
    showPokemonModal("o");
  }
}

window.onload = function () {
  showPokemonModal("x");
  updateTurnIndicator();
  renderLeaderboard(); // display leaderboard at start
};

function updateTurnIndicator() {
  var indicator = document.getElementById("turn-indicator");
  if (window.isGameOver) {
    indicator.textContent = "";
  } else {
    indicator.textContent = "Player " + playerTurn.toUpperCase() + "'s turn";
  }
}

function play(y) {
  if (y.dataset.player == "none" && window.isGameOver == false) {
    if (!playerPokemon.x || !playerPokemon.o) return; // Wait until both choose

    if (playerTurn == "x") {
      y.innerHTML = `<img src="public/${playerPokemon.x}" alt="X" style="height:70px;width:70px;vertical-align:middle;">`;
      y.dataset.player = "x";
      playerTurn = "o";
    } else if (playerTurn == "o") {
      y.innerHTML = `<img src="public/${playerPokemon.o}" alt="O" style="height:70px;width:70px;vertical-align:middle;">`;
      y.dataset.player = "o";
      playerTurn = "x";
    }
    moves++;
    updateTurnIndicator();
  }

  // Win Types
  checkWinner(1, 2, 3);
  checkWinner(4, 5, 6);
  checkWinner(7, 8, 9);
  checkWinner(1, 4, 7);
  checkWinner(2, 5, 8);
  checkWinner(3, 6, 9);
  checkWinner(1, 5, 9);
  checkWinner(3, 5, 7);

  // No Winner
  if (moves == 9 && isGameOver == false) {
    draw();
  }
}

function checkWinner(a, b, c) {
  a--;
  b--;
  c--;
  if (
    span[a].dataset.player === span[b].dataset.player &&
    span[b].dataset.player === span[c].dataset.player &&
    (span[a].dataset.player === "x" || span[a].dataset.player === "o") &&
    isGameOver == false
  ) {
    span[a].parentNode.className += " activeBox";
    span[b].parentNode.className += " activeBox";
    span[c].parentNode.className += " activeBox";
    gameOver(a);
  }
}

function playAgain() {
  document.getElementsByClassName("alert")[0].remove();
  resetGame();
  window.isGameOver = false;
  for (var k = 0; k < span.length; k++) {
    span[k].parentNode.className = span[k].parentNode.className.replace("activeBox", "");
  }
  updateTurnIndicator();
}

function resetGame() {
  for (i = 0; i < span.length; i++) {
    span[i].dataset.player = "none";
    span[i].innerHTML = "&nbsp;";
  }
  playerTurn = "x";
  updateTurnIndicator();
}

function gameOver(a) {
  var winner = span[a].dataset.player;
  var winnerPokemon = playerPokemon[winner];

  var gameOverAlertElement =
    "<b>GAME OVER </b><br><br> Player " +
    winner.toUpperCase() +
    ' Wins!!! <br><br>' +
    restartButton;

  var div = document.createElement("div");
  div.className = "alert";
  div.innerHTML = gameOverAlertElement;
  document.getElementsByTagName("body")[0].appendChild(div);

  window.isGameOver = true;
  moves = 0;
  updateTurnIndicator();

  // Update leaderboard
  updateLeaderboard(winnerPokemon);

  // Re-ask Pokémon after game ends
  setTimeout(function () {
    playerPokemon.x = null;
    playerPokemon.o = null;
    showPokemonModal("x");
  }, 1200);
}

function draw() {
  var drawAlertElement = "<b>DRAW!!!</b><br><br>" + restartButton;
  var div = document.createElement("div");
  div.className = "alert";
  div.innerHTML = drawAlertElement;
  document.getElementsByTagName("body")[0].appendChild(div);
  window.isGameOver = true;
  moves = 0;
  updateTurnIndicator();

  // Re-ask Pokémon choices after draw
  setTimeout(function () {
    playerPokemon.x = null;
    playerPokemon.o = null;
    showPokemonModal("x");
  }, 1200);
}

/* ---------------- Leaderboard Functions ---------------- */

function updateLeaderboard(winnerPokemon) {
  if (!leaderboard[winnerPokemon]) leaderboard[winnerPokemon] = 0;
  leaderboard[winnerPokemon] += pokemonPoints[winnerPokemon] || 1; // Default +1 if missing
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  var tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  // Sort Pokémon by score descending
  var sorted = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

  sorted.forEach(([poke, score]) => {
    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="public/${poke}" style="width:40px;height:40px;vertical-align:middle;"> ${poke.replace(".png", "")}</td>
      <td>${score}</td>
    `;
    tbody.appendChild(tr);
  });
}

function resetLeaderboard() {
  localStorage.removeItem("leaderboard");
  leaderboard = {};
  renderLeaderboard();
}
