// ==========================================
// DATA KUIS (dipisah dari script.js)
// ==========================================
// File ini harus dimuat SEBELUM script.js di index.html.
// Setiap jawaban punya `category` (A-E) yang cocok dengan kunci di `resultsData`.
// Untuk menambah soal/hasil baru, cukup edit file ini; script.js tidak perlu diubah.

// ---------- Daftar 10 pertanyaan ----------
export const questions = [
  {
    question:
      "Saat dikabari teman buat nongkrong di hari libur, respons utamamu:",
    answers: [
      {
        text: "Tanya dulu siapa yang traktir. Kalau gratis, langsung gas.",
        category: "A",
      },
      {
        text: "Aduh, punggungku pegel. Mending rebahan di kasur.",
        category: "B",
      },
      {
        text: "Ayo aja, itung-itung cari hiburan liatin orang di jalan.",
        category: "C",
      },
      {
        text: "Gas! Tapi berangkatnya telat dan nyasar karena ngandelin feeling, bukan maps.",
        category: "D",
      },
      {
        text: "Cek saldo dulu. Kalau tinggal dua puluh ribu, mending masak mi instan di kos.",
        category: "E",
      },
    ],
  },
  {
    question:
      "Kamu melihat ada keributan atau drama di grup WhatsApp kelas/tongkrongan:",
    answers: [
      { text: "Diam-diam nyimak tapi ambil screenshot.", category: "A" },
      { text: "Bodo amat, mending lanjut tidur aja.", category: "B" },
      {
        text: "Bikin es teh manis, duduk manis, dan menikmati keributan.",
        category: "C",
      },
      {
        text: "Ikut nimbrung pakai stiker random yang gak nyambung sama topiknya.",
        category: "D",
      },
      { text: "Mute grupnya, lanjut hemat baterai dan kuota.", category: "E" },
    ],
  },
  {
    question:
      "Apa barang yang wajib ada di dalam tas atau saku kamu saat pergi?",
    answers: [
      {
        text: "Kantong kresek atau totebag (kalau ada makanan sisa buat dibungkus).",
        category: "A",
      },
      { text: "Minyak angin, koyo, atau Fresh Care. Wajib!", category: "B" },
      {
        text: "Gak bawa apa-apa yang penting bawa diri yang santai.",
        category: "C",
      },
      {
        text: "Helm yang dibawa masuk ke mana-mana, plus jas hujan walau cuaca cerah.",
        category: "D",
      },
      {
        text: "Sachet kecap, saus, dan sedotan cadangan hasil ambil dari warung.",
        category: "E",
      },
    ],
  },
  {
    question: "Kalau disuruh nunggu 1 jam karena temanmu telat, kamu bakal...",
    answers: [
      {
        text: "Numpang ngadem di minimarket sambil baca majalah gratis.",
        category: "A",
      },
      { text: "Nyari kursi kosong, selonjoran, bengong.", category: "B" },
      {
        text: "Scroll tiktok atau liatin orang lewat. Seru aja.",
        category: "C",
      },
      {
        text: "Susul aja pakai motor lewat jalan tikus yang cuma kamu yang tahu.",
        category: "D",
      },
      {
        text: "Pesan es teh paling murah, lalu duduk lama biar nggak rugi.",
        category: "E",
      },
    ],
  },
  {
    question: "Pilih satu prinsip hidup yang paling menggambarkan dirimu:",
    answers: [
      { text: "Pantang pulang sebelum kenyang.", category: "A" },
      { text: "Sehat itu mahal, rebahan adalah jalan ninjaku.", category: "B" },
      {
        text: "Hidup itu santai aja, nikmati prosesnya kaya nonton orang nguli.",
        category: "C",
      },
      {
        text: "Sein kiri, belok kanan. Hidup itu penuh kejutan.",
        category: "D",
      },
      {
        text: "Akhir bulan itu ujian, mi instan itu penyelamat.",
        category: "E",
      },
    ],
  },
  {
    question: "Hujan deras pas kamu mau pulang. Kamu akan...",
    answers: [
      {
        text: "Neduh di minimarket sampai reda, siapa tahu ada tester gratis.",
        category: "A",
      },
      {
        text: "Pesan ojol, pinggang nggak kuat kena angin dan hujan.",
        category: "B",
      },
      {
        text: "Neduh sambil nonton bapak-bapak ngecor jalan di tengah hujan.",
        category: "C",
      },
      {
        text: "Terobos aja pakai jas hujan, lampu sein nyala ke arah yang salah.",
        category: "D",
      },
      {
        text: "Nunggu reda sambil menghitung lebih hemat ojol atau jalan kaki.",
        category: "E",
      },
    ],
  },
  {
    question: "Nota makan di warung keluar dan waktunya bayar. Reaksimu:",
    answers: [
      {
        text: "Pura-pura sibuk cari dompet sampai ada yang bayarin.",
        category: "A",
      },
      {
        text: "Bayar sambil mengeluh harga, lalu minta dipijitin ibu warung.",
        category: "B",
      },
      {
        text: "Bayar santai, sambil memperhatikan tukang yang lagi benerin atap sebelah.",
        category: "C",
      },
      {
        text: "Bayar pakai uang receh yang dikumpulin di dasbor motor.",
        category: "D",
      },
      {
        text: "Hitung ulang tiap item di nota, jangan sampai ada yang kelebihan seribu.",
        category: "E",
      },
    ],
  },
  {
    question: "Weekend pagi, kamu biasanya bangun jam berapa?",
    answers: [
      {
        text: "Jam berapa pun, asal ada acara dengan makanan gratis.",
        category: "A",
      },
      {
        text: "Jam 4 subuh, badan sudah otomatis bangun, lalu tidur lagi.",
        category: "B",
      },
      {
        text: "Jam 7, lalu keluar rumah buat nonton tetangga renovasi.",
        category: "C",
      },
      { text: "Jam 10, buru-buru berangkat, helm kebalik.", category: "D" },
      {
        text: "Jam 11, sarapan merangkap makan siang pakai mi instan.",
        category: "E",
      },
    ],
  },
  {
    question: "Uang saku atau gaji baru masuk. Langkah pertamamu:",
    answers: [
      { text: "Cari promo dan diskon, beli yang ada bonusnya.", category: "A" },
      {
        text: "Beli stok koyo dan minyak angin untuk sebulan ke depan.",
        category: "B",
      },
      {
        text: "Traktir diri sendiri es teh, lalu duduk lihat jalanan.",
        category: "C",
      },
      {
        text: "Isi bensin eceran dan beli kopi, sisanya entah ke mana.",
        category: "D",
      },
      {
        text: "Bagi amplop: listrik, makan, jajan, dan sisanya disembunyikan dari diri sendiri.",
        category: "E",
      },
    ],
  },
  {
    question: "Ada teman minta bantuan buat pindahan rumah. Responsmu:",
    answers: [
      {
        text: "Tiba-tiba sinyal hilang, muncul lagi pas bagi-bagi snack.",
        category: "A",
      },
      {
        text: "Bilang pinggang lagi bermasalah, bagian mengawasi aja.",
        category: "B",
      },
      {
        text: "Datang, tapi cuma jadi penonton setia di pinggir.",
        category: "C",
      },
      {
        text: "Datang bawa motor, muatan terlalu tinggi, tetap dipaksain.",
        category: "D",
      },
      { text: "Datang asalkan dijanjikan makan siang gratis.", category: "E" },
    ],
  },

  {
    question: "Kalau ada acara keluarga yang durasinya tidak jelas, kamu...",
    answers: [
      {
        text: "Datang pas makanan mulai dibagikan, strategi paling aman.",
        category: "A",
      },
      {
        text: "Cari sofa dan menghemat energi untuk basa-basi.",
        category: "B",
      },
      { text: "Duduk di teras mengamati dinamika keluarga.", category: "C" },
      {
        text: "Salah masuk gang tapi tetap datang dengan percaya diri.",
        category: "D",
      },
      {
        text: "Bawa wadah sendiri kalau ada kemungkinan makanan sisa.",
        category: "E",
      },
    ],
  },
  {
    question: "Ketika alarm berbunyi di pagi hari, kamu biasanya...",
    answers: [
      { text: "Bangun kalau ada kabar sarapan gratis.", category: "A" },
      {
        text: "Matikan alarm, badan butuh rapat koordinasi dulu.",
        category: "B",
      },
      {
        text: "Lihat keluar jendela, memastikan dunia sudah mulai beraktivitas.",
        category: "C",
      },
      {
        text: "Bangun mendadak lalu mencari barang sambil panik.",
        category: "D",
      },
      {
        text: "Hitung berapa menit lagi bisa tidur tanpa terlambat.",
        category: "E",
      },
    ],
  },
  {
    question: "Teman mengajak liburan dadakan. Pilihanmu...",
    answers: [
      {
        text: "Setuju kalau konsumsi dan tiket bisa dapat promo.",
        category: "A",
      },
      {
        text: "Tanya apakah penginapannya punya kasur yang nyaman.",
        category: "B",
      },
      {
        text: "Ikut untuk duduk santai dan mengamati tempat baru.",
        category: "C",
      },
      {
        text: "Berangkat tanpa rencana, nanti juga ketemu jalan.",
        category: "D",
      },
      {
        text: "Buka kalkulator untuk membandingkan biaya sampai parkir.",
        category: "E",
      },
    ],
  },
  {
    question: "Ada diskon besar di aplikasi belanja. Kamu...",
    answers: [
      { text: "Beli karena diskonnya sayang kalau dilewatkan.", category: "A" },
      {
        text: "Cek apakah ada bantal leher atau alat pijat yang diskon.",
        category: "B",
      },
      {
        text: "Baca komentar orang sambil menikmati drama ulasan.",
        category: "C",
      },
      {
        text: "Checkout dulu, baru sadar alamat pengiriman masih alamat lama.",
        category: "D",
      },
      {
        text: "Bandingkan harga sebelum diskon dengan harga toko sebelah.",
        category: "E",
      },
    ],
  },
  {
    question: "Kalau sinyal internet tiba-tiba hilang, kamu...",
    answers: [
      {
        text: "Cari Wi-Fi gratis, siapa tahu sekalian dapat bonus.",
        category: "A",
      },
      { text: "Anggap semesta memberi izin untuk tidur.", category: "B" },
      {
        text: "Duduk di luar dan melihat kehidupan nyata sebentar.",
        category: "C",
      },
      {
        text: "Pindah tempat berkali-kali sambil mengangkat HP ke udara.",
        category: "D",
      },
      {
        text: "Matikan data supaya kuota tidak ikut menghilang.",
        category: "E",
      },
    ],
  },
  {
    question: "Di grup chat, kamu paling sering dikenal sebagai...",
    answers: [
      { text: "Detektif promo dan pemburu info konsumsi.", category: "A" },
      { text: "Orang yang membalas setelah bangun tidur.", category: "B" },
      { text: "Pembaca senyap yang tahu semua alur cerita.", category: "C" },
      {
        text: "Pengirim stiker yang konteksnya tidak bisa dijelaskan.",
        category: "D",
      },
      { text: "Pengingat patungan sampai nominal terakhir.", category: "E" },
    ],
  },
  {
    question: "Kalau harus memilih kendaraan untuk perjalanan dekat...",
    answers: [
      {
        text: "Apa saja asal ada kesempatan mampir beli jajanan.",
        category: "A",
      },
      {
        text: "Pilih yang paling adem dan tidak bikin badan pegal.",
        category: "B",
      },
      { text: "Jalan santai sambil memperhatikan sekitar.", category: "C" },
      {
        text: "Motor jadi andalan, rute ditentukan oleh insting.",
        category: "D",
      },
      { text: "Pilih yang paling hemat bensin dan parkir.", category: "E" },
    ],
  },
  {
    question: "Saat teman bilang, 'Tenang, aku sudah hafal jalan', kamu...",
    answers: [
      {
        text: "Tenang selama nanti ada tempat makan di tujuan.",
        category: "A",
      },
      {
        text: "Pasrah sambil menyiapkan posisi duduk ternyaman.",
        category: "B",
      },
      {
        text: "Nikmati perjalanan, tersesat pun bisa jadi tontonan.",
        category: "C",
      },
      {
        text: "Percaya penuh meski kalian sudah melewati tempat yang sama tiga kali.",
        category: "D",
      },
      { text: "Diam-diam buka maps dan hitung biaya tambahan.", category: "E" },
    ],
  },
  {
    question: "Ketika dompet menipis menjelang akhir bulan, kamu...",
    answers: [
      { text: "Mencari acara yang menyediakan konsumsi.", category: "A" },
      {
        text: "Mengurangi aktivitas yang menguras tenaga dan uang.",
        category: "B",
      },
      { text: "Tetap santai, hiburan melihat sekitar gratis.", category: "C" },
      {
        text: "Mencari ide dadakan yang mungkin berhasil, mungkin tidak.",
        category: "D",
      },
      {
        text: "Menyusun menu hemat dan menghitung setiap rupiah.",
        category: "E",
      },
    ],
  },
  {
    question: "Kalau hidupmu punya slogan, yang paling cocok adalah...",
    answers: [
      { text: "Kalau bisa gratis, kenapa harus bayar?", category: "A" },
      { text: "Energi terbatas, istirahat adalah prioritas.", category: "B" },
      { text: "Dunia adalah panggung, aku penonton VIP.", category: "C" },
      {
        text: "Rencana itu penting, improvisasi lebih sering terjadi.",
        category: "D",
      },
      { text: "Sedikit demi sedikit, yang penting saldo aman.", category: "E" },
    ],
  },
];

// ---------- Daftar 5 hasil ----------
// `image`  : path gambar hasil (taruh file-nya di folder images/).
// `emoji`  : cadangan yang tampil kalau gambar belum ada / gagal dimuat.
export const resultsData = {
  A: {
    title: "Tukang Parkir Gaib Minimarket",
    image: "",
    emoji: "🅿️",
    traits:
      "Ciri khas: radar makanan gratis aktif, ahli membaca situasi, dan selalu tahu kapan harus muncul",
    suitable: "pencari promo, koordinator konsumsi, atau auditor prasmanan",
    quote:
      "“Aku datang bukan karena lapar, tapi karena menghargai kesempatan.”",
    desc: "Kamu adalah tipe orang yang suka observasi dalam diam, tapi selalu muncul di saat yang tepat (terutama pas ada untungnya). Pas teman lagi butuh bantuan, kamu hilang entah ke mana. Tapi pas ada makanan gratis atau lagi bagi-bagi untung, kamu tiba-tiba nongol.",
  },
  B: {
    title: "Remaja Jompo",
    image: "",
    emoji: "🧓",
    traits:
      "Ciri khas: baterai sosial hemat daya, persediaan minyak angin lengkap, dan kemampuan rebahan tingkat nasional",
    suitable: "quality tester kasur atau konsultan kenyamanan",
    quote: "“Bukan malas, aku sedang menghemat energi.”",
    desc: "Berjiwa tua yang terjebak di tubuh muda. Energimu gampang habis dan butuh kenyamanan ekstra. Usia boleh 20-an, tapi tulang punggung berasa kayak pensiunan PNS. Isi tasmu bukan makeup atau gadget, tapi FreshCare, Tolak Angin, dan koyo.",
  },
  C: {
    title: "Warga Penonton Proyek Jalanan",
    image: "",
    emoji: "🚧",
    traits:
      "Ciri khas: rasa ingin tahu tinggi, santai menghadapi keramaian, dan bisa terhibur oleh aktivitas sederhana",
    suitable: "pengamat lingkungan atau komentator kehidupan",
    quote: "“Lanjutkan pekerjaan Anda, saya cuma menonton.”",
    desc: "Kamu menemukan kedamaian batin dengan melihat orang lain bekerja keras. Gampang terhibur oleh hal sepele, sangat santai, dan merupakan lambang inner peace sejati di tengah kerasnya dunia.",
  },
  D: {
    title: "Raja Sein Kiri Belok Kanan",
    image: "",
    emoji: "🛵",
    traits:
      "Ciri khas: spontan, percaya diri, dan punya hubungan unik dengan petunjuk arah",
    suitable: "penjelajah rute alternatif—dengan pendamping navigator",
    quote: "“Tenang, aku tahu jalan… kayaknya.”",
    desc: "Hidupmu penuh kejutan, terutama buat orang-orang di belakangmu. Kamu santai, spontan, dan selalu yakin jalan tikus buatanmu adalah rute tercepat. Gak ada yang bisa menebak arahmu, bahkan kamu sendiri.",
  },
  E: {
    title: "Anak Kos Penyintas Akhir Bulan",
    image: "",
    emoji: "🍜",
    traits:
      "Ciri khas: kalkulator selalu siaga, jago mengatur anggaran, dan kreatif mengolah persediaan seadanya",
    suitable: "manajer keuangan atau ahli strategi akhir bulan",
    quote: "“Bukan pelit, ini namanya perencanaan.”",
    desc: "Kamu ahli bertahan hidup dengan sumber daya seadanya. Mi instan adalah sahabat, saldo di bawah lima puluh ribu adalah keseharian, dan kamu paham betul cara membuat satu bungkus nasi cukup untuk dua kali makan.",
  },
};
