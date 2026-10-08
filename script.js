// ==========================================
// 1. DATA KUIS
// ==========================================

// Daftar 5 Pertanyaan
const questions = [
    {
        question: "Saat dikabari teman buat nongkrong di hari libur, respons utamamu:",
        answers: [
            { text: "Tanya dulu siapa yang traktir. Kalau gratis, langsung gas.", category: "A" },
            { text: "Aduh, punggungku pegel. Mending rebahan di kasur.", category: "B" },
            { text: "Ayo aja, itung-itung cari hiburan liatin orang di jalan.", category: "C" }
        ]
    },
    {
        question: "Kamu melihat ada keributan atau drama di grup WhatsApp kelas/tongkrongan:",
        answers: [
            { text: "Diam-diam nyimak tapi ambil screenshot.", category: "A" },
            { text: "Bodo amat, mending lanjut tidur aja.", category: "B" },
            { text: "Bikin es teh manis, duduk manis, dan menikmati keributan.", category: "C" }
        ]
    },
    {
        question: "Apa barang yang wajib ada di dalam tas atau saku kamu saat pergi?",
        answers: [
            { text: "Kantong kresek atau totebag (kalau ada makanan sisa buat dibungkus).", category: "A" },
            { text: "Minyak angin, koyo, atau Fresh Care. Wajib!", category: "B" },
            { text: "Gak bawa apa-apa yang penting bawa diri yang santai.", category: "C" }
        ]
    },
    {
        question: "Kalau disuruh nunggu 1 jam karena temanmu telat, kamu bakal...",
        answers: [
            { text: "Numpang ngadem di minimarket sambil baca majalah gratis.", category: "A" },
            { text: "Nyari kursi kosong, selonjoran, bengong.", category: "B" },
            { text: "Scroll tiktok atau liatin orang lewat. Seru aja.", category: "C" }
        ]
    },
    {
        question: "Pilih satu prinsip hidup yang paling menggambarkan dirimu:",
        answers: [
            { text: "Pantang pulang sebelum kenyang.", category: "A" },
            { text: "Sehat itu mahal, rebahan adalah jalan ninjaku.", category: "B" },
            { text: "Hidup itu santai aja, nikmati prosesnya kaya nonton orang nguli.", category: "C" }
        ]
    }
];

// Daftar 3 Hasil (Result)
const resultsData = {
    A: {
        title: "Tukang Parkir Gaib Minimarket",
        desc: "Kamu adalah tipe orang yang suka observasi dalam diam, tapi selalu muncul di saat yang tepat (terutama pas ada untungnya). Pas teman lagi butuh bantuan, kamu hilang entah ke mana. Tapi pas ada makanan gratis atau lagi bagi-bagi untung, kamu tiba-tiba nongol."
    },
    B: {
        title: "Remaja Jompo",
        desc: "Berjiwa tua yang terjebak di tubuh muda. Energimu gampang habis (low battery) dan butuh kenyamanan ekstra. Usia boleh 20-an, tapi tulang punggung berasa kayak pensiunan PNS. Isi tasmu bukan makeup atau gadget, tapi FreshCare, Tolak Angin, dan koyo.."
    },
    C: {
        title: "Warga Penonton Proyek Jalanan",
        desc: "Kamu menemukan kedamaian batin dengan melihat orang lain bekerja keras. Gampang terhibur oleh hal sepele, sangat santai, dan merupakan lambang inner peace sejati di tengah kerasnya dunia."
    }
};

// ==========================================
// 2. VARIABEL & LOGIKA SISTEM KUIS
// ==========================================

let currentQuestionIndex = 0;
let scores = { A: 0, B: 0, C: 0 };

// Mengambil elemen HTML berdasarkan ID
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

const resultTitle = document.getElementById('result-title');
const resultDesc = document.getElementById('result-desc');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleLabel = themeToggle.querySelector('.theme-toggle-label');

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    themeToggle.title = nextTheme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode';
    themeToggleLabel.innerText = nextTheme === 'dark' ? 'Mode terang' : 'Mode gelap';
});

// Tombol Mulai ditekan
startBtn.addEventListener('click', startQuiz);

// Tombol Main Lagi ditekan
restartBtn.addEventListener('click', () => {
    location.reload(); // Me-refresh web agar kembali ke halaman awal index.html
});

function startQuiz() {
    // Reset skor dan urutan soal
    currentQuestionIndex = 0;
    scores = { A: 0, B: 0, C: 0 };

    // Atur tampilan (Sembunyikan Start/Result, Tampilkan Question)
    startScreen.classList.remove('d-block');
    startScreen.classList.add('d-none');
    resultScreen.classList.remove('d-block');
    resultScreen.classList.add('d-none');
    
    questionScreen.classList.remove('d-none');
    questionScreen.classList.add('d-block');

    showQuestion();
}

function showQuestion() {
    // Ambil data pertanyaan saat ini
    const currentQuestion = questions[currentQuestionIndex];

    // Update teks pertanyaan dan progress
    questionText.innerText = currentQuestion.question;
    progressText.innerText = `Soal ${currentQuestionIndex + 1} dari ${questions.length}`;
    
    // Update Progress Bar
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Kosongkan pilihan jawaban sebelumnya
    optionsContainer.innerHTML = '';

    // Buat tombol untuk setiap pilihan jawaban
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        // Tambahkan class Bootstrap agar tombolnya rapi
        button.classList.add('btn', 'btn-outline-primary', 'btn-option');
        button.innerText = answer.text;
        
        // Aksi saat tombol jawaban ditekan
        button.addEventListener('click', () => selectAnswer(answer.category));
        
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(category) {
    // Tambah skor berdasarkan kategori yang dipilih
    scores[category]++;
    currentQuestionIndex++;

    // Cek apakah masih ada soal tersisa
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    // Sembunyikan layar pertanyaan, tampilkan layar hasil
    questionScreen.classList.remove('d-block');
    questionScreen.classList.add('d-none');
    
    resultScreen.classList.remove('d-none');
    resultScreen.classList.add('d-block');

    // Update Progress bar sampai penuh di akhir
    progressBar.style.width = `100%`;

    // Cari kategori dengan skor tertinggi
    // (Membandingkan skor A, B, dan C)
    let highestScoreCategory = 'A';
    if (scores['B'] > scores[highestScoreCategory]) highestScoreCategory = 'B';
    if (scores['C'] > scores[highestScoreCategory]) highestScoreCategory = 'C';

    // Ambil data hasil berdasarkan kategori skor tertinggi
    const finalResult = resultsData[highestScoreCategory];

    // Tampilkan ke layar
    resultTitle.innerText = finalResult.title;
    resultDesc.innerText = finalResult.desc;
}