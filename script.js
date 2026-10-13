import { questions, resultsData } from "./data.js";
import {
  storageGet,
  storageSet,
  storageGetJSON,
  storageRemove,
} from "./storage.js";
import {
  setSoundEnabled,
  sfxClick,
  sfxTimeout,
  sfxBack,
  sfxResult,
} from "./sound.js";
import {
  createQuizTimer,
  QUESTION_SECONDS,
  URGENT_SECONDS,
  TIMER_OPTIONS,
} from "./timer.js";

// ==========================================
// LOGIKA KUIS
// Data pertanyaan & hasil ada di data.js (dimuat lebih dulu di index.html).
// ==========================================

// ---------- Konstanta ----------
const PLAY_COUNT_KEY = "kuisAnomaliPlayCount"; // jumlah permainan selesai
const SOUND_KEY = "kuisAnomaliSound"; // "on" / "off"
const UNLOCKED_KEY = "kuisAnomaliUnlocked"; // daftar hasil yang pernah didapat
const LAST_RESULT_KEY = "kuisAnomaliLastResult"; // hasil terakhir
const OPTION_STAGGER_MS = 70; // jeda muncul tiap opsi jawaban
const QUESTION_COUNT_KEY = "kuisAnomaliQuestionCount"; // "5" / "10" / "all"
const TIMER_SECONDS_KEY = "kuisAnomaliTimerSeconds"; // "15" / "30" / "60"
const QUESTION_COUNT_OPTIONS = ["5", "10", "all"];
const DEFAULT_QUESTION_COUNT = "10";
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

// ---------- State ----------
let quizQuestions = []; // soal yang sudah diacak (salinan dari `questions`)
let currentQuestionIndex = 0;
let scores = {}; // contoh: { A: 2, B: 0, ... } dibuat di resetState()
let answerHistory = []; // kategori tiap soal yang sudah dijawab (null = waktu habis)
let lastAnswerCategory = null; // kategori jawaban terakhir (dipakai untuk tie-break)
let currentResult = null; // hasil akhir yang sedang ditampilkan
let currentWinnerKey = null;
let screenBeforeAll = null; // layar asal saat membuka "Semua hasil"
let timerEnabled = storageGet("kuisAnomaliTimer") !== "off";
let timer = null;
let soundEnabledLocal = true;
let questionCountSetting = loadQuestionCount(); // "5", "10", atau "all"
let timerSeconds = loadTimerSeconds(); // durasi per soal (detik)

// ---------- Elemen HTML ----------
const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const allResultsScreen = document.getElementById("all-results-screen");
const allScreens = [
  startScreen,
  questionScreen,
  resultScreen,
  allResultsScreen,
];

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const progressTrack = progressBar.parentElement;

const backBtn = document.getElementById("back-btn");
const timerText = document.getElementById("timer-text");
const timerBar = document.getElementById("timer-bar");

const resultTitle = document.getElementById("result-title");
const resultDesc = document.getElementById("result-desc");
const resultImage = document.getElementById("result-image");
const resultEmoji = document.getElementById("result-emoji");
const secondaryResult = document.getElementById("secondary-result");
const percentList = document.getElementById("percent-list");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const shareBtn = document.getElementById("share-btn");
const shareLabel = document.getElementById("share-label");
const shareStatus = document.getElementById("share-status");
const playCountEls = document.querySelectorAll(".play-count");

const showAllBtn = document.getElementById("show-all-btn");
const resultAllBtn = document.getElementById("result-all-btn");
const allBackBtn = document.getElementById("all-back-btn");
const allResultsGrid = document.getElementById("all-results-grid");
const collectionProgress = document.getElementById("collection-progress");
const lastResultNote = document.getElementById("last-result-note");

const themeToggle = document.getElementById("theme-toggle");
const themeToggleLabel = themeToggle.querySelector(".theme-toggle-label");
const soundToggle = document.getElementById("sound-toggle");
const soundIcon = document.getElementById("sound-icon");
const soundLabel = document.getElementById("sound-label");
const timerEnabledInput = document.getElementById("timer-enabled");
const downloadBtn = document.getElementById("download-btn");
const nativeShareBtn = document.getElementById("share-native-btn");
const whatsappBtn = document.getElementById("share-wa-btn");
const xShareBtn = document.getElementById("share-x-btn");
const telegramBtn = document.getElementById("share-telegram-btn");
const RESULT_COUNTS_KEY = "kuisAnomaliResultCounts";
const timerSettingText = document.getElementById("timer-setting-text");
const timerSecondsInputs = document.querySelectorAll('input[name="timer-seconds"]');
const questionCountInputs = document.querySelectorAll('input[name="question-count"]');
const resetDataBtn = document.getElementById("reset-data-btn");
const resetStatus = document.getElementById("reset-status");

// ==========================================
// UTILITAS
// ==========================================

// Menampilkan satu layar, menyembunyikan yang lain, lalu memicu efek fade-in.
function showScreen(screen) {
  allScreens.forEach((s) => {
    s.classList.toggle("d-none", s !== screen);
    s.classList.toggle("d-block", s === screen);
  });
  replayFadeIn(screen);
}

// Layar mana yang sedang tampil.
function isScreenVisible(screen) {
  return !screen.classList.contains("d-none");
}

// Memutar ulang animasi fade-in pada sebuah elemen.
function replayFadeIn(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth; // paksa reflow supaya animasi bisa diulang
  element.classList.add("fade-in");
}

// Mengacak array (Fisher-Yates) tanpa mengubah array asli.
function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Mengatur ulang skor dan urutan soal (soal & jawaban diacak tiap main).
function resetState() {
  stopTimer();
  if (timer) timer.reset();
  currentQuestionIndex = 0;
  lastAnswerCategory = null;
  currentResult = null;
  currentWinnerKey = null;
  answerHistory = [];
  scores = {};
  Object.keys(resultsData).forEach((key) => {
    scores[key] = 0;
  });
  quizQuestions = shuffle(questions)
    .slice(0, getQuestionTotal())
    .map((q) => ({
      ...q,
      answers: shuffle(q.answers),
    }));
}

// Mengubah progress bar (persen) beserta atribut aksesibilitasnya.
function setProgress(percent) {
  progressBar.style.width = `${percent}%`;
  progressTrack.setAttribute("aria-valuenow", String(Math.round(percent)));
}

// ==========================================
// COUNTER JUMLAH MAIN
// Disimpan di localStorage, jadi dihitung per browser/perangkat.
// ==========================================

function getPlayCount() {
  return parseInt(storageGet(PLAY_COUNT_KEY), 10) || 0;
}

function incrementPlayCount() {
  const next = getPlayCount() + 1;
  storageSet(PLAY_COUNT_KEY, String(next));
  return next;
}

function renderPlayCount() {
  const count = getPlayCount().toLocaleString("id-ID");
  playCountEls.forEach((el) => {
    el.textContent = count;
  });
}

// ==========================================
// EFEK SUARA (implementasi berada di sound.js)
// ==========================================
function loadSoundPreference() {
  soundEnabledLocal = storageGet(SOUND_KEY) !== "off";
  setSoundEnabled(soundEnabledLocal);
  renderSoundToggle();
}
function renderSoundToggle() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabledLocal));
  soundToggle.title = soundEnabledLocal
    ? "Matikan efek suara"
    : "Nyalakan efek suara";
  soundIcon.innerText = soundEnabledLocal ? "🔊" : "🔇";
  soundLabel.innerText = soundEnabledLocal ? "Suara nyala" : "Suara mati";
}
function toggleSound() {
  soundEnabledLocal = !soundEnabledLocal;
  setSoundEnabled(soundEnabledLocal);
  storageSet(SOUND_KEY, soundEnabledLocal ? "on" : "off");
  renderSoundToggle();
  if (soundEnabledLocal) sfxClick();
}

// ==========================================
// TIMER PER SOAL (30 detik, bisa dimatikan)
// ==========================================
function renderTimer(milliseconds, totalSeconds = QUESTION_SECONDS) {
  const seconds = Math.ceil(milliseconds / 1000),
    urgent = seconds <= URGENT_SECONDS;
  const visibleTimerText = `⏱ ${seconds} detik tersisa`;
  if (timerText.textContent !== visibleTimerText)
    timerText.textContent = visibleTimerText;
  const announcement = document.getElementById("timer-announcement");
  if (
    announcement &&
    (seconds === totalSeconds || [20, 10, 5, 4, 3, 2, 1].includes(seconds))
  ) {
    const message =
      seconds > 10
        ? `Waktu tersisa ${seconds} detik.`
        : `Perhatian, ${seconds} detik tersisa.`;
    if (announcement.textContent !== message)
      announcement.textContent = message;
  }
  timerText.classList.toggle("is-urgent", urgent);
  timerBar.classList.toggle("is-urgent", urgent);
  timerBar.style.width = `${Math.max(0, (milliseconds / (totalSeconds * 1000)) * 100)}%`;
}
function updateTimerSetting() {
  timerEnabled = timerEnabledInput.checked;
  storageSet("kuisAnomaliTimer", timerEnabled ? "on" : "off");
  renderQuizSettings();
}
function stopTimer() {
  if (timer) timer.stop();
}
function startTimer() {
  stopTimer();
  const track = document.querySelector(".timer-track");
  if (!timerEnabled) {
    timerText.textContent = "⏱ Timer nonaktif";
    timerText.classList.remove("is-urgent");
    const announcement = document.getElementById("timer-announcement");
    if (announcement)
      announcement.textContent =
        "Timer nonaktif. Tidak ada batas waktu untuk menjawab.";
    timerBar.style.width = "100%";
    track.classList.add("d-none");
    return;
  }
  track.classList.remove("d-none");
  timer = createQuizTimer({
    onTick: (milliseconds, seconds) => renderTimer(milliseconds, seconds),
    onTimeout: handleTimeout,
    seconds: timerSeconds,
  });
  timer.start();
}

// ==========================================
// ALUR KUIS
// ==========================================

// ---------- Pengaturan jumlah soal, durasi timer, dan reset data ----------
function loadQuestionCount() {
  const saved = storageGet(QUESTION_COUNT_KEY);
  return QUESTION_COUNT_OPTIONS.includes(saved) ? saved : DEFAULT_QUESTION_COUNT;
}

function loadTimerSeconds() {
  const saved = Number(storageGet(TIMER_SECONDS_KEY));
  return TIMER_OPTIONS.includes(saved) ? saved : QUESTION_SECONDS;
}

// Jumlah soal yang dimainkan: 5, 10, atau semua soal yang tersedia.
function getQuestionTotal() {
  if (questionCountSetting === "all") return questions.length;
  return Math.min(Number(questionCountSetting), questions.length);
}

// Menyamakan tampilan pengaturan di layar awal dengan nilai yang tersimpan.
function renderQuizSettings() {
  questionCountInputs.forEach((input) => {
    input.checked = input.value === questionCountSetting;
  });
  timerSecondsInputs.forEach((input) => {
    input.checked = Number(input.value) === timerSeconds;
    input.disabled = !timerEnabled;
  });
  timerSettingText.textContent = timerEnabled
    ? `Mode timer ${timerSeconds} detik per soal`
    : "Mode timer nonaktif";
}

// Menghapus progres (jumlah main, koleksi, hasil terakhir). Preferensi tetap disimpan.
function resetLocalData() {
  const confirmed = window.confirm(
    "Hapus jumlah main, koleksi hasil, dan hasil terakhir di perangkat ini? Pengaturan (tema, suara, timer, jumlah soal) tetap disimpan.",
  );
  if (!confirmed) return;
  [PLAY_COUNT_KEY, UNLOCKED_KEY, LAST_RESULT_KEY, RESULT_COUNTS_KEY].forEach(
    storageRemove,
  );
  renderPlayCount();
  renderLastResultNote();
  if (isScreenVisible(allResultsScreen)) renderAllResults();
  resetStatus.textContent = "Data lokal sudah dihapus.";
}

function startQuiz() {
  resetState();
  showScreen(questionScreen);
  showQuestion();
}

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  questionText.innerText = currentQuestion.question;
  const timerAnnouncement = document.getElementById("timer-announcement");
  if (timerAnnouncement) timerAnnouncement.textContent = "";
  progressText.innerText = `Soal ${currentQuestionIndex + 1} dari ${quizQuestions.length}`;
  setProgress((currentQuestionIndex / quizQuestions.length) * 100);
  backBtn.disabled = answerHistory.length === 0;

  // Buat tombol untuk setiap pilihan jawaban (dengan fade-in bertahap)
  optionsContainer.innerHTML = "";
  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-outline-primary", "btn-option", "fade-in");
    button.style.animationDelay = prefersReducedMotion.matches
      ? "0ms"
      : `${index * OPTION_STAGGER_MS}ms`;
    button.setAttribute("aria-keyshortcuts", String(index + 1));

    const key = document.createElement("span");
    key.className = "option-key";
    key.setAttribute("aria-hidden", "true");
    key.textContent = String(index + 1);

    const label = document.createElement("span");
    label.textContent = answer.text;

    button.append(key, label);
    button.addEventListener("click", () => selectAnswer(answer.category));
    optionsContainer.appendChild(button);
  });

  // Fade-in untuk judul soal; wrapper layar soal tidak perlu animasi ulang
  replayFadeIn(questionText);
  startTimer();
}

// Menyimpan jawaban (atau soal terlewat) lalu pindah ke soal berikutnya / hasil.
function advance(category) {
  if (category !== null) {
    scores[category]++;
    lastAnswerCategory = category;
  }
  answerHistory.push(category);
  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function selectAnswer(category) {
  // Abaikan klik ganda atau klik yang terjadi setelah layar soal ditutup.
  if (!isScreenVisible(questionScreen)) return;
  stopTimer();
  sfxClick();
  advance(category);
}

// Dipanggil timer.js saat 30 detik habis. Soal yang waktunya habis
// dicatat sebagai dilewati (null), bukan diberi kategori secara acak.
function handleTimeout() {
  if (!isScreenVisible(questionScreen)) return;
  sfxTimeout();
  advance(null);
}

// Kembali ke soal sebelumnya dan batalkan skor jawaban itu.
function goBack() {
  if (answerHistory.length === 0 || !isScreenVisible(questionScreen)) return;
  stopTimer();
  sfxBack();

  const previousCategory = answerHistory.pop();
  if (previousCategory !== null) scores[previousCategory]--;
  currentQuestionIndex--;

  // Cari kategori jawaban terakhir yang tersisa (untuk tie-break)
  lastAnswerCategory = null;
  for (let i = answerHistory.length - 1; i >= 0; i--) {
    if (answerHistory[i] !== null) {
      lastAnswerCategory = answerHistory[i];
      break;
    }
  }
  showQuestion();
}

// Pilih jawaban lewat keyboard (angka 1-5) dan Backspace/panah kiri untuk kembali.
function handleKeydown(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (!isScreenVisible(questionScreen)) return;

  if (/^[1-9]$/.test(event.key)) {
    const buttons = optionsContainer.querySelectorAll(".btn-option");
    const target = buttons[Number(event.key) - 1];
    if (target) {
      event.preventDefault();
      target.click();
    }
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    goBack();
  }
}

// Seri diputuskan oleh jawaban terakhir yang termasuk kategori seri.
// Jika semua soal terlewat, hasil default A digunakan secara konsisten.
function getWinnerCategory() {
  const highestScore = Math.max(...Object.values(scores));
  const tiedCategories = Object.keys(scores).filter(
    (key) => scores[key] === highestScore,
  );
  if (Object.values(scores).every((score) => score === 0)) return "A";
  if (tiedCategories.length === 1) return tiedCategories[0];
  for (let i = answerHistory.length - 1; i >= 0; i--) {
    if (tiedCategories.includes(answerHistory[i])) return answerHistory[i];
  }
  return tiedCategories.sort()[0];
}

function showResult() {
  stopTimer();
  setProgress(100);

  currentWinnerKey = getWinnerCategory();
  currentResult = resultsData[currentWinnerKey];

  resultTitle.innerText = currentResult.title;
  resultDesc.innerText = currentResult.desc;
  if (Object.values(scores).every((score) => score === 0)) {
    resultDesc.innerText +=
      " Catatan: semua soal terlewat, jadi hasil A ditampilkan sebagai hasil default—bukan penilaian kepribadian.";
  }
  const detail = document.getElementById("result-details");
  if (detail)
    detail.innerHTML = `<p><strong>Ciri khas:</strong> ${currentResult.traits || ""}</p><p><strong>Cocok jadi:</strong> ${currentResult.suitable || ""}</p><blockquote>${currentResult.quote || ""}</blockquote>`;
  showResultImage(currentResult);
  renderBreakdown(currentWinnerKey);

  // Reset tampilan tombol bagikan
  shareLabel.innerText = "Bagikan hasil";
  shareStatus.innerText = "";

  // Hitung 1 permainan selesai, simpan riwayat, lalu perbarui tampilan
  incrementPlayCount();
  renderPlayCount();
  saveResultHistory(currentWinnerKey);
  renderLastResultNote();

  showScreen(resultScreen);
  sfxResult();
  launchConfetti();
}

// Area foto sengaja dikosongkan agar pemilik website dapat memasang fotonya sendiri.
function showResultImage(result) {
  const frame = resultImage.closest(".result-image-frame");
  resultEmoji.classList.add("d-none");
  resultImage.onerror = () => {
    resultImage.removeAttribute("src");
    resultImage.classList.add("d-none");
    frame.setAttribute(
      "aria-label",
      "Tempat foto hasil kuis, siap diisi foto sendiri",
    );
  };
  if (result.image) {
    resultImage.alt = `Foto hasil: ${result.title}`;
    resultImage.src = result.image;
    resultImage.classList.remove("d-none");
    frame.removeAttribute("aria-label");
  } else {
    resultImage.removeAttribute("src");
    resultImage.alt = "";
    resultImage.classList.add("d-none");
    frame.setAttribute(
      "aria-label",
      "Tempat foto hasil kuis, siap diisi foto sendiri",
    );
  }
}

// Kembali ke halaman awal tanpa reload halaman.
function restartQuiz() {
  resetState();
  setProgress(0);
  showScreen(startScreen);
}

// ==========================================
// PERSENTASE KECOCOKAN & HASIL SEKUNDER
// ==========================================

function renderBreakdown(winnerKey) {
  const total = Object.values(scores).reduce((sum, n) => sum + n, 0);

  // Urutkan: pemenang paling atas, sisanya menurut skor terbesar
  const ordered = Object.keys(scores).sort((a, b) => {
    if (a === winnerKey) return -1;
    if (b === winnerKey) return 1;
    return scores[b] - scores[a];
  });

  percentList.innerHTML = "";
  const fills = [];
  const raw = ordered.map((key) => ({
    key,
    base:
      total > 0
        ? Math.floor((scores[key] / total) * 100)
        : key === winnerKey
          ? 100
          : 0,
    remainder: total > 0 ? ((scores[key] / total) * 100) % 1 : 0,
  }));
  let remaining = 100 - raw.reduce((sum, item) => sum + item.base, 0);
  raw
    .slice()
    .sort((a, b) => b.remainder - a.remainder)
    .forEach((item) => {
      if (remaining > 0) {
        item.base++;
        remaining--;
      }
    });
  const percentages = Object.fromEntries(
    raw.map((item) => [item.key, item.base]),
  );
  ordered.forEach((key) => {
    const percent = percentages[key];

    const row = document.createElement("div");
    row.className = "percent-row" + (key === winnerKey ? " is-winner" : "");

    const name = document.createElement("span");
    name.className = "percent-name";
    name.textContent = resultsData[key].title;

    const value = document.createElement("span");
    value.className = "percent-value";
    value.textContent = `${percent}%`;

    const track = document.createElement("div");
    track.className = "percent-track";
    const fill = document.createElement("div");
    fill.className = "percent-fill";
    track.appendChild(fill);

    row.append(name, value, track);
    percentList.appendChild(row);
    fills.push([fill, percent]);
  });

  // Isi bar setelah elemen tampil supaya transisi lebarnya terlihat
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fills.forEach(([fill, percent]) => {
        fill.style.width = `${percent}%`;
      });
    });
  });

  // Hasil sekunder: kategori kedua dengan skor > 0
  const runnerUp = ordered.find((key) => key !== winnerKey && scores[key] > 0);
  secondaryResult.textContent = runnerUp
    ? `Kamu juga punya sisi "${resultsData[runnerUp].title}".`
    : "Kamu 100% konsisten. Gak ada sisi lain yang kelihatan!";
}

// ==========================================
// RIWAYAT HASIL & KOLEKSI (localStorage)
// ==========================================

function getUnlocked() {
  try {
    const parsed = JSON.parse(storageGet(UNLOCKED_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveResultHistory(key) {
  const counts = storageGetJSON(RESULT_COUNTS_KEY, {});
  counts[key] = (Number(counts[key]) || 0) + 1;
  storageSet(RESULT_COUNTS_KEY, JSON.stringify(counts));
  const unlocked = getUnlocked();
  if (!unlocked.includes(key)) {
    unlocked.push(key);
    storageSet(UNLOCKED_KEY, JSON.stringify(unlocked));
  }
  storageSet(LAST_RESULT_KEY, key);
}

function renderLastResultNote() {
  const key = storageGet(LAST_RESULT_KEY);
  if (key && resultsData[key]) {
    lastResultNote.textContent = `Hasil terakhirmu: ${resultsData[key].title}`;
    lastResultNote.classList.remove("d-none");
  } else {
    lastResultNote.classList.add("d-none");
  }
}

// ==========================================
// HALAMAN "SEMUA HASIL"
// ==========================================

function renderAllResults() {
  const unlocked = getUnlocked();
  const keys = Object.keys(resultsData);
  const lastKey = storageGet(LAST_RESULT_KEY);

  collectionProgress.textContent = `Kamu sudah mendapat ${unlocked.length} dari ${keys.length} hasil`;
  allResultsGrid.innerHTML = "";

  keys.forEach((key) => {
    const data = resultsData[key];
    const isUnlocked = unlocked.includes(key);

    const card = document.createElement("article");
    card.className = "result-card" + (isUnlocked ? "" : " is-locked");

    const media = document.createElement("div");
    media.className = "result-card-media";
    media.setAttribute(
      "aria-label",
      "Tempat foto hasil, siap diisi foto sendiri",
    );
    if (data.image) {
      const img = document.createElement("img");
      img.src = data.image;
      img.alt = `Foto: ${data.title}`;
      img.addEventListener("error", () => {
        img.remove();
        media.setAttribute(
          "aria-label",
          "Tempat foto hasil kuis, siap diisi foto sendiri",
        );
      });
      img.addEventListener("load", () => media.removeAttribute("aria-label"));
      media.appendChild(img);
    }

    const badge = document.createElement("span");
    badge.className = "result-badge" + (isUnlocked ? "" : " is-locked");
    badge.textContent = isUnlocked
      ? key === lastKey
        ? "✓ Terakhir didapat"
        : "✓ Sudah didapat"
      : "Belum didapat";

    const title = document.createElement("h3");
    title.className = "result-card-title";
    title.textContent = data.title;

    const desc = document.createElement("p");
    desc.className = "result-card-desc";
    desc.textContent = data.desc;
    const detail = document.createElement("p");
    detail.className = "result-card-desc";
    detail.textContent = `Ciri khas: ${data.traits || ""}`;
    const counts = storageGetJSON(RESULT_COUNTS_KEY, {});
    const stat = document.createElement("p");
    stat.className = "result-card-stat";
    stat.textContent = `Hasil didapat: ${Number(counts[key]) || 0} kali`;
    card.append(media, badge, title, desc, detail, stat);
    allResultsGrid.appendChild(card);
  });
}

function openAllResults() {
  // Ingat layar asal. Jika sedang mengerjakan soal, timer dihentikan dulu.
  screenBeforeAll =
    [startScreen, resultScreen].find(isScreenVisible) || startScreen;
  renderAllResults();
  showScreen(allResultsScreen);
}

function closeAllResults() {
  showScreen(screenBeforeAll || startScreen);
}

// ==========================================
// KONFETI (library canvas-confetti)
// ==========================================

function launchConfetti() {
  if (typeof confetti !== "function") return; // CDN gagal dimuat, lewati saja
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#ff7968", "#ffbd57", "#8a76ef", "#62d2a9"];
  confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 }, colors });
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 250);
}

// ==========================================
// BAGIKAN HASIL (Clipboard API)
// ==========================================

function buildShareText() {
  const url = window.location.href.split("#")[0];
  return (
    `Hasil kuisku: aku adalah "${currentResult.title}"! 😆\n` +
    `Kamu Anomali WNI yang mana? Coba kuisnya di: ${url}`
  );
}

// Cadangan untuk browser lama / koneksi non-HTTPS yang tidak punya navigator.clipboard
function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

async function shareResult() {
  if (!currentResult) return;
  const text = buildShareText();
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      copied = true;
    } else copied = fallbackCopy(text);
  } catch {
    copied = fallbackCopy(text);
  }
  shareLabel.innerText = copied ? "Tersalin!" : "Gagal menyalin";
  shareStatus.innerText = copied
    ? "Tersalin! Tinggal tempel ke temanmu."
    : "Gagal menyalin, coba salin manual ya.";
  setTimeout(() => {
    shareLabel.innerText = "Bagikan hasil";
  }, 2500);
}
function openShare(url) {
  if (currentResult) window.open(url, "_blank", "noopener,noreferrer");
}
async function shareNative() {
  if (!currentResult) return;
  const text = buildShareText();
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Hasil Kuis Anomali WNI",
        text,
        url: window.location.href.split("#")[0],
      });
    } catch (error) {
      if (error.name !== "AbortError")
        shareStatus.textContent = "Fitur bagikan tidak tersedia.";
    }
  } else {
    shareStatus.textContent =
      "Menu berbagi perangkat tidak tersedia. Gunakan tombol platform.";
    await shareResult();
  }
}
function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const words = String(text || "").split(/\s+/);
  let line = "",
    lineCount = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount++;
      if (lineCount >= maxLines) break;
    } else line = test;
  }
  if (line && lineCount < maxLines)
    ctx.fillText(line, x, y + lineCount * lineHeight);
}
function downloadResultCard() {
  if (!currentResult) return;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    shareStatus.textContent = "Browser tidak mendukung pembuatan gambar.";
    return;
  }

  const drawCard = (photo = null) => {
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, "#fff8ec");
    gradient.addColorStop(0.55, "#f0ebff");
    gradient.addColorStop(1, "#c8f2df");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = "#7757dc";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KUIS ANOMALI WNI", 540, 100);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.strokeStyle = "#d8cbed";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(190, 155, 700, 590, 34);
    ctx.fill();
    ctx.stroke();
    if (photo) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(190, 155, 700, 590, 34);
      ctx.clip();
      const scale = Math.max(700 / photo.width, 590 / photo.height);
      const width = photo.width * scale;
      const height = photo.height * scale;
      ctx.drawImage(
        photo,
        190 + (700 - width) / 2,
        155 + (590 - height) / 2,
        width,
        height,
      );
      ctx.restore();
    }
    ctx.fillStyle = "#25213b";
    ctx.font = "bold 48px sans-serif";
    wrapCanvasText(ctx, currentResult.title, 540, 820, 850, 62);
    ctx.fillStyle = "#716d82";
    ctx.font = "28px sans-serif";
    wrapCanvasText(ctx, currentResult.desc, 540, 980, 850, 43, 5);
    ctx.fillStyle = "#7757dc";
    ctx.font = "bold 27px sans-serif";
    ctx.fillText("Kamu Anomali WNI yang mana?", 540, 1260);
    const link = document.createElement("a");
    link.download = "hasil-kuis-anomali-wni.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    shareStatus.textContent = "Kartu hasil berhasil dibuat.";
  };

  if (currentResult.image) {
    const photo = new Image();
    photo.onload = () => drawCard(photo);
    photo.onerror = () => drawCard();
    photo.src = currentResult.image;
  } else {
    drawCard();
  }
}

// ==========================================
// TEMA GELAP / TERANG
// ==========================================

function toggleTheme() {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
  themeToggle.title =
    nextTheme === "dark" ? "Aktifkan light mode" : "Aktifkan dark mode";
  themeToggleLabel.innerText =
    nextTheme === "dark" ? "Mode terang" : "Mode gelap";
}

// ==========================================
// INISIALISASI
// ==========================================

themeToggle.addEventListener("click", toggleTheme);
soundToggle.addEventListener("click", toggleSound);
startBtn.addEventListener("click", () => {
  sfxClick();
  startQuiz();
});
restartBtn.addEventListener("click", restartQuiz);
shareBtn.addEventListener("click", shareResult);
downloadBtn.addEventListener("click", downloadResultCard);
nativeShareBtn.addEventListener("click", shareNative);
whatsappBtn.addEventListener("click", () =>
  openShare(`https://wa.me/?text=${encodeURIComponent(buildShareText())}`),
);
xShareBtn.addEventListener("click", () =>
  openShare(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(buildShareText())}`,
  ),
);
telegramBtn.addEventListener("click", () =>
  openShare(
    `https://t.me/share/url?url=${encodeURIComponent(window.location.href.split("#")[0])}&text=${encodeURIComponent(`Hasil kuisku: ${currentResult?.title || ""}!`)}`,
  ),
);
timerEnabledInput.checked = timerEnabled;
timerEnabledInput.addEventListener("change", updateTimerSetting);
questionCountInputs.forEach((input) =>
  input.addEventListener("change", () => {
    questionCountSetting = input.value;
    storageSet(QUESTION_COUNT_KEY, input.value);
  }),
);
timerSecondsInputs.forEach((input) =>
  input.addEventListener("change", () => {
    timerSeconds = Number(input.value);
    storageSet(TIMER_SECONDS_KEY, String(timerSeconds));
    renderQuizSettings();
  }),
);
resetDataBtn.addEventListener("click", resetLocalData);
backBtn.addEventListener("click", goBack);
showAllBtn.addEventListener("click", openAllResults);
resultAllBtn.addEventListener("click", openAllResults);
allBackBtn.addEventListener("click", closeAllResults);
document.addEventListener("keydown", handleKeydown);

// Jeda timer saat tab tersembunyi agar hitungan tidak berjalan diam-diam di latar.
document.addEventListener("visibilitychange", () => {
  if (!isScreenVisible(questionScreen) || !timerEnabled || !timer) return;
  if (document.hidden) timer.pause();
  else timer.resume();
});

loadSoundPreference();
resetState();
renderPlayCount();
renderLastResultNote();
renderQuizSettings();
