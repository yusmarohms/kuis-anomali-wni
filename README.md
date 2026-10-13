# 🧠 Kuis Kepribadian: Anomali WNI

Kuis kepribadian berbasis web yang lucu untuk menebak "tipe warga negara" seperti apa kamu di dunia nyata.

[🚀 Mainkan Kuisnya di Sini!](https://kuis-anomali-wni.vercel.app/) *(Pastikan untuk mengganti link ini dengan URL Vercel Anda jika berbeda)*

---

## ✨ Fitur Utama

Aplikasi ini telah melalui berbagai pembaruan untuk meningkatkan pengalaman pengguna. Berikut adalah fitur-fitur yang tersedia:

**🎮 Gameplay & Logika Kuis:**
- **Bank Soal Diperbanyak:** Tersedia 20 pertanyaan pilihan.
- **Acak Soal:** Sistem akan memilih 10 soal secara acak setiap kali permainan dimulai.
- **Logika Dinamis:** Menghitung skor terbanyak dari pertanyaan untuk menampilkan kemungkinan hasil unik.
- **Perhitungan Skor Akurat:** Menghitung skor dan presentase total hingga 100%.
- **Penanganan Khusus:** Sistem secara otomatis menangani hasil seri (draw) dan soal yang terlewati.

**⏱️ Timer & Aksesibilitas:**
- **Timer 30 Detik:** Batas waktu 30 detik untuk setiap soal.
- **Opsi Nonaktifkan Timer:** Pemain dapat mematikan fitur timer jika ingin bermain santai.
- **Aksesibilitas:** Fitur pengumuman timer yang ramah untuk pembaca layar (screen reader).

**📊 Hasil & Berbagi:**
- **Deskripsi Lengkap:** Hasil kuis disertai dengan deskripsi kepribadian yang lebih mendalam.
- **Kartu Hasil (PNG):** Fitur untuk mengunduh kartu hasil kuis sebagai gambar PNG.
- **Foto Kustom:** Kartu hasil sengaja dibiarkan kosong di bagian foto agar pemain bisa menambahkan foto mereka sendiri.
- **Fitur Berbagi:** Bagikan hasil kuis langsung ke WhatsApp, X (Twitter), Telegram, atau melalui fitur berbagi bawaan perangkat.
- **Statistik Lokal:** Menyimpan dan menampilkan statistik hasil kuis sebelumnya di perangkat pengguna.

**🎨 UI/UX & Teknis:**
- **Single Page Application (SPA):** Perpindahan antar halaman terasa mulus tanpa reload.
- **Desain Modern & Responsif:** Antarmuka (UI) yang rapi dan nyaman dimainkan di HP maupun laptop.
- **Mode Gelap/Terang (Dark/Light Mode):** Menyesuaikan kenyamanan mata pengguna.
- **Metadata & SEO:** Dilengkapi dengan Open Graph, metadata media sosial, dan favicon khusus.
- **Modular:** Kode timer, suara, dan penyimpanan (storage) telah dipisahkan ke dalam modul tersendiri agar lebih rapi.
- **Error Handling:** Penanganan error (seperti `handleTimeout is not defined`) telah ditambahkan dengan baik.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5 murni**
- **Vanilla JavaScript (ES6)**
- **CSS Lokal** (Kustomisasi styling dan class utilitas pendukung, tanpa CDN eksternal seperti Tailwind CDN)
- **Vercel** (untuk Hosting & CI/CD otomatis)

---

## 📁 Struktur Proyek

Proyek ini telah dimodularisasi agar lebih mudah dikelola. Berikut adalah struktur direktorinya:

```text
kuis-anomali-wni/
├── images/             # Aset gambar dan media
├── .gitignore          # Konfigurasi Git ignore
├── README.md           # Dokumentasi proyek
├── data.js             # Data JSON soal kuis
├── favicon.svg         # Ikon website
├── index.html          # Halaman utama berisi struktur UI lengkap
├── package.json        # Konfigurasi proyek dan dependensi
├── script.js           # Logika kuis dan manipulasi DOM utama
├── sound.js            # Modul untuk efek suara
├── storage.js          # Modul untuk penyimpanan lokal (local storage)
├── style.css           # Customisasi styling utama
├── timer.js            # Modul logika timer 30 detik
└── utilities.css       # Class utilitas pendukung (seperti d-block, d-none)
