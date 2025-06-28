const words = [
  "qalam", "baran", "kolan", "sarok", "zarok", "diwar", "berik", "penir", "nivro",
  "bezar", "qitar", "melak", "afsar", "duhok", "zakho", "qamis", "ribar", "pivaz",
  "stran", "fanos", "jgara", "ninok", "dikel", "kashi", "tebax", "sonda", "golav",
  "bngah", "pshik", "gelas", "parda", "korsi", "papor", "hejir", "kolav", "senik",
  "bohar", "frcha", "fstaq", "fafon", "peshi", "raqam", "tabit", "splet", "hetar",
  "pambi", "landk", "jaras", "gezar", "havin", "qodik", "pelav", "taman", "pikam",
  "chadr", "silav", "sibar","kelan"
];

let correctWord = "";
let currentRow = 0;
let currentGuess = "";
let score = 0;

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const result = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreDisplay = document.getElementById("score");
const tipsBtn = document.getElementById('tipsBtn');
const tipsPopup = document.getElementById('tipsPopup');

function initGame() {
  currentRow = 0;
  currentGuess = "";
  result.textContent = "";
  restartBtn.style.display = "none";
  nextBtn.style.display = "none";

  board.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 5; j++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }

  document.querySelectorAll(".key").forEach(k => {
    k.classList.remove("used", "correct", "present", "absent");
  });

  correctWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  console.log("New word:", correctWord);

  updateScoreDisplay();
}

(function buildKeyboard() {
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "←"]
  ];

  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "key-row";
    row.forEach(key => {
      const button = document.createElement("button");
      button.textContent = key;
      button.className = "key";
      button.onclick = () => handleKey(key);
      rowDiv.appendChild(button);
    });
    keyboard.appendChild(rowDiv);
  });
})();

document.addEventListener("keydown", e => {
  if (result.textContent) return;
  if (e.key === "Backspace") handleKey("←");
  else if (e.key === "Enter") handleKey("Enter");
  else if (/^[a-zA-ZçÇêÊîÎûÛşŞöÖğĞ]$/.test(e.key)) {
    handleKey(e.key.toUpperCase());
  }
});

function handleKey(key) {
  if (result.textContent) return;

  const row = board.children[currentRow];
  const tiles = row.children;

  if (key === "←") {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      tiles[currentGuess.length].textContent = "";
    }
  } else if (key === "Enter") {
    if (currentGuess.length !== 5) return;
    checkGuess(currentGuess);
  } else {
    if (currentGuess.length < 5) {
      tiles[currentGuess.length].textContent = key;
      currentGuess += key.toLowerCase();
      markKeyAsUsed(key);
    }
  }
}

function checkGuess(guess) {
  const row = board.children[currentRow];
  const tiles = row.children;
  const wordArray = correctWord.split("");
  const guessArray = guess.split("");

  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === wordArray[i]) {
      tiles[i].classList.add("correct");
      markKeyClass(guessArray[i], "correct");
      wordArray[i] = null;
      guessArray[i] = null;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessArray[i]) {
      if (wordArray.includes(guessArray[i])) {
        tiles[i].classList.add("present");
        markKeyClass(guessArray[i], "present");
        wordArray[wordArray.indexOf(guessArray[i])] = null;
      } else {
        tiles[i].classList.add("absent");
        markKeyClass(guessArray[i], "absent");
      }
    }
  }

  if (guess === correctWord) {
    addScoreForLine(currentRow);
    showResult("win");
  } else {
    currentRow++;
    currentGuess = "";
    if (currentRow === 5) {
      showResult("lose");
    }
  }
}

function addScoreForLine(line) {
  const pointsByLine = [5, 4, 3, 2, 1];
  if (line < pointsByLine.length) {
    score += pointsByLine[line];
  }
  updateScoreDisplay();
}

function updateScoreDisplay() {
  scoreDisplay.textContent = "Score: " + score;
  window.score = score; // expose score globally for saving on back button
}

function showResult(status) {
  result.textContent = correctWord.toUpperCase();
  restartBtn.style.display = status === "lose" ? "block" : "none";
  nextBtn.style.display = status === "win" ? "block" : "none";
}

function markKeyAsUsed(letter) {
  document.querySelectorAll(".key").forEach(btn => {
    if (btn.textContent.toUpperCase() === letter.toUpperCase()) {
      btn.classList.add("used");
    }
  });
}

function markKeyClass(letter, className) {
  document.querySelectorAll(".key").forEach(btn => {
    if (btn.textContent.toUpperCase() === letter.toUpperCase()) {
      btn.classList.remove("correct", "present", "absent");
      btn.classList.add(className);
    }
  });
}

restartBtn.onclick = () => {
  score = 0;
  updateScoreDisplay();
  initGame();
};

nextBtn.onclick = () => {
  initGame();
};

tipsBtn.addEventListener('click', e => {
  e.stopPropagation();
  tipsPopup.classList.toggle('visible');
});

document.addEventListener('click', e => {
  if (!tipsPopup.contains(e.target) && !tipsBtn.contains(e.target)) {
    tipsPopup.classList.remove('visible');
  }
});

initGame();
