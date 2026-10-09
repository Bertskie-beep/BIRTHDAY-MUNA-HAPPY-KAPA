const folderButton = document.getElementById("folderButton");
const birthdayLetter = document.getElementById("birthdayLetter");
const songButton = document.getElementById("songButton");
const songIcon = document.getElementById("songIcon");
const songStatus = document.getElementById("songStatus");
const confettiButton = document.getElementById("confettiButton");
const confettiLayer = document.getElementById("confettiLayer");

folderButton.addEventListener("click", () => {
  const isOpen = birthdayLetter.classList.toggle("is-open");
  folderButton.classList.toggle("is-open", isOpen);
  folderButton.setAttribute("aria-expanded", String(isOpen));
  birthdayLetter.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    launchConfetti(35);
    setTimeout(() => birthdayLetter.scrollIntoView({ behavior: "smooth", block: "center" }), 180);
  }
});

// A small synthesized birthday melody; no external audio file is needed.
let audioContext = null;
let melodyTimers = [];
let isPlaying = false;
const melody = [
  [392, .28], [392, .28], [440, .55], [392, .55], [523.25, .55], [493.88, 1.0],
  [392, .28], [392, .28], [440, .55], [392, .55], [587.33, .55], [523.25, 1.0],
  [392, .28], [392, .28], [783.99, .55], [659.25, .55], [523.25, .55], [493.88, .55], [440, 1.0],
  [698.46, .28], [698.46, .28], [659.25, .55], [523.25, .55], [587.33, .55], [523.25, 1.0]
];

function playNote(frequency, startTime, duration) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.88);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

async function playBirthdayMelody() {
  if (isPlaying) {
    melodyTimers.forEach(clearTimeout);
    melodyTimers = [];
    isPlaying = false;
    songButton.setAttribute("aria-pressed", "false");
    songIcon.textContent = "♫";
    songButton.lastChild.textContent = " Play birthday song";
    songStatus.textContent = "Melody paused. Press play whenever you like.";
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    songStatus.textContent = "Your browser does not support the birthday melody.";
    return;
  }

  audioContext = audioContext || new AudioContextClass();
  await audioContext.resume();
  isPlaying = true;
  songButton.setAttribute("aria-pressed", "true");
  songIcon.textContent = "Ⅱ";
  songButton.lastChild.textContent = " Pause birthday song";
  songStatus.textContent = "A birthday melody just for you 💙";

  let cursor = audioContext.currentTime + 0.08;
  melody.forEach(([frequency, duration]) => {
    playNote(frequency, cursor, duration * 0.88);
    cursor += duration * 0.72;
  });

  const totalMs = (cursor - audioContext.currentTime) * 1000 + 200;
  melodyTimers.push(setTimeout(() => {
    isPlaying = false;
    songButton.setAttribute("aria-pressed", "false");
    songIcon.textContent = "♫";
    songButton.lastChild.textContent = " Play birthday song";
    songStatus.textContent = "Hope that brought a little extra joy to your day.";
    melodyTimers = [];
  }, totalMs));
}
songButton.addEventListener("click", playBirthdayMelody);

function launchConfetti(amount = 45) {
  const colors = ["#1b6e9b", "#77c3e3", "#d8b66c", "#b7e5f4", "#ffffff"];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.animationDelay = `${Math.random() * 0.65}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.6}s`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}
confettiButton.addEventListener("click", () => launchConfetti(65));
