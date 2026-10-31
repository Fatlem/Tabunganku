/** Sumber tunggal isi panduan. Isinya sama dengan PANDUAN.md: ubah keduanya bersamaan. */
export type IntroVisual = "logo" | "target" | "catat" | "ringkasan" | "privasi";
export interface IntroStep { visual: IntroVisual; title: string; body: string }
export interface GuideSection { id: string; title: string; intro?: string; ordered?: boolean; items: string[] }

export const INTRO_STEPS: IntroStep[] = [
  {
    "visual": "logo",
    "title": "Selamat datang di Tabunganku",
    "body": "Catat uang masuk dan keluar, atur alokasi, lalu capai target tabungan Anda. Pengenalan singkat ini hanya lima langkah."
  },
  {
    "visual": "target",
    "title": "Tentukan target tabungan",
    "body": "Isi gaji, target, dan tenggat di menu Alokasi. Aplikasi menghitung berapa yang harus ditabung tiap bulan dan membagi sisanya ke setiap kategori."
  },
  {
    "visual": "catat",
    "title": "Catat setiap transaksi",
    "body": "Tekan tombol + di tengah menu bawah. Pilih pemasukan atau pengeluaran, lalu isi nominal, kategori, dan dompet."
  },
  {
    "visual": "ringkasan",
    "title": "Pantau di Ringkasan",
    "body": "Lihat saldo, tren 6 bulan, dan pengeluaran per kategori. Bar berubah kuning atau merah saat limit hampir atau sudah terlewati."
  },
  {
    "visual": "privasi",
    "title": "Aman dan siap dipasang",
    "body": "Ikon mata menyembunyikan semua nominal. Pasang aplikasi ke layar utama agar terbuka layar penuh seperti aplikasi biasa."
  }
];

export const GUIDE: GuideSection[] = [
  {
    "id": "mulai",
    "title": "Mulai cepat",
    "ordered": true,
    "intro": "Lima langkah dari akun baru sampai melihat ringkasan pertama.",
    "items": [
      "Buka aplikasi, lalu pilih Daftar. Isi nama, username, email, dan kata sandi yang memenuhi semua syarat.",
      "Buka menu Alokasi. Isi gaji bulanan, target tabungan, dan tenggat (pilih bulan, atau tekan tombol 6, 12, atau 24 bulan).",
      "Periksa rencana yang muncul: nominal wajib tabung per bulan dan limit tiap kategori. Ganti mode bila perlu.",
      "Tekan tombol + (Catat) setiap ada uang masuk atau keluar.",
      "Buka Ringkasan untuk melihat saldo, grafik, dan progres target."
    ]
  },
  {
    "id": "akun",
    "title": "Akun dan keamanan",
    "items": [
      "Username 3–20 karakter (huruf, angka, titik, atau garis bawah) dan harus unik. Email dipakai untuk reset kata sandi.",
      "Kata sandi wajib minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan simbol. Indikator Lemah, Sedang, atau Kuat tampil saat Anda mengetik.",
      "Masuk memakai username dan kata sandi, bukan email.",
      "Ikon mata di kolom kata sandi menampilkan atau menyembunyikan teks, berguna untuk mengecek salah ketik.",
      "Lupa kata sandi: pilih \"Lupa kata sandi?\" di halaman masuk, isi email, lalu masukkan kode 6 digit dan kata sandi baru. Pada versi demo ini kode ditampilkan di layar karena belum ada server email.",
      "Ubah kata sandi kapan saja di Profil, bagian Ubah kata sandi.",
      "Keluar dan Hapus akun ada di Profil, bagian Zona sensitif. Hapus akun menghapus seluruh datanya."
    ]
  },
  {
    "id": "alokasi",
    "title": "Target tabungan dan mode alokasi",
    "intro": "Menu Alokasi menghitung berapa yang harus ditabung tiap bulan agar target tercapai tepat waktu.",
    "items": [
      "Isi Gaji bulanan, Target tabungan, dan Tenggat target. Semua isian awal kosong.",
      "Wajib tabung per bulan = target dibagi jumlah bulan sampai tenggat. Contoh: Rp 20.000.000 dalam 12 bulan menjadi sekitar Rp 1.666.667 per bulan.",
      "Sisa gaji (gaji dikurangi wajib tabung) otomatis dibagi ke kategori lain menurut porsinya. Dengan gaji Rp 5.700.000, sisanya sekitar Rp 4.033.333.",
      "Standar: menabung sesuai kebutuhan target.",
      "Hemat: menabung 10% lebih banyak dari kebutuhan sehingga target tercapai lebih cepat. Lama pencapaian ditampilkan.",
      "Manual: Anda menentukan sendiri limit tiap kategori dalam nominal atau persen. Jika total alokasi tidak sama dengan gaji, muncul peringatan.",
      "Jika gaji tidak cukup untuk menabung sebanyak itu, muncul pesan Target tidak terkejar. Perpanjang tenggat atau turunkan target.",
      "Dua progress bar menunjukkan tabungan bulan ini dan progres menuju target."
    ]
  },
  {
    "id": "kategori",
    "title": "Kategori dan limit",
    "items": [
      "Kategori bawaan: Tabungan, Uang Makan, Transportasi, Uang Jajan, dan Investasi.",
      "Tambah kategori sendiri di bagian Tambah kategori: isi nama (2–24 karakter) dan porsi dalam persen.",
      "Di mode Standar atau Hemat, ubah kolom Porsi untuk mengatur pembagian sisa gaji. Total porsi tidak harus 100%; aplikasi menyesuaikan otomatis supaya total alokasi sama dengan gaji.",
      "Kategori Tabungan bersifat tetap (nominalnya berasal dari target) dan tidak bisa dihapus.",
      "Kategori yang sudah dipakai di transaksi tidak bisa dihapus agar riwayat tetap utuh.",
      "Warna bar: hijau normal, kuning mulai 80% (Hampir habis), merah di atas 100% (Melebihi limit). Peringatan merah juga muncul di Ringkasan."
    ]
  },
  {
    "id": "catat",
    "title": "Mencatat transaksi",
    "ordered": true,
    "items": [
      "Tekan tombol + di tengah menu bawah.",
      "Pilih Pengeluaran atau Pemasukan, lalu isi nominal (harus lebih dari 0).",
      "Untuk pengeluaran, pilih kategori. Pilih juga dompet (Tunai, Bank, E-Wallet), tanggal, dan catatan bila perlu.",
      "Tekan Simpan transaksi. Anda diarahkan ke Riwayat.",
      "Untuk menabung, catat sebagai Pengeluaran dengan kategori Tabungan. Nominal itu menambah progres target."
    ]
  },
  {
    "id": "riwayat",
    "title": "Riwayat transaksi",
    "items": [
      "Daftar diurutkan dari tanggal terbaru.",
      "Filter berdasarkan bulan, kategori, dan dompet. Filter kategori hanya berlaku untuk pengeluaran.",
      "Hapus transaksi dengan ikon tempat sampah, lalu konfirmasi."
    ]
  },
  {
    "id": "ringkasan",
    "title": "Ringkasan dan grafik",
    "items": [
      "Saldo utama = seluruh pemasukan dikurangi seluruh pengeluaran sejak awal.",
      "Kartu Pemasukan dan Pengeluaran menampilkan bulan berjalan. Pengeluaran tidak menghitung kategori Tabungan; tabungan punya kartu Total tabungan sendiri.",
      "Kartu Target tabungan menunjukkan progres menuju target. Ketuk untuk membuka Alokasi.",
      "Tren 6 bulan membandingkan pemasukan dan pengeluaran. Diagram donat menunjukkan pembagian pengeluaran bulan ini per kategori.",
      "Ikon mata di kartu saldo menyembunyikan semua nominal, termasuk di grafik, menjadi Rp ••••••••. Pilihan ini diingat."
    ]
  },
  {
    "id": "profil",
    "title": "Profil dan preferensi",
    "items": [
      "Tema: Terang, Gelap, atau Sistem (mengikuti perangkat).",
      "Mata uang tampilan: IDR, USD, EUR, atau SGD. Hanya mengubah format; nominal tidak dikonversi.",
      "Reset semua data keuangan menghapus transaksi, target, dan alokasi, tetapi akun tetap ada.",
      "Panduan pemakaian dan Ulangi pengenalan ada di bagian Bantuan."
    ]
  },
  {
    "id": "pasang",
    "title": "Pasang di layar utama (PWA)",
    "items": [
      "Android (Chrome): tekan tombol Pasang aplikasi di bagian atas, atau menu titik tiga lalu Tambahkan ke layar utama.",
      "iPhone (Safari): tekan tombol Bagikan lalu Tambah ke Layar Utama. Safari tidak menampilkan tombol Pasang aplikasi.",
      "Komputer (Chrome atau Edge): klik ikon pasang di ujung kanan kolom alamat.",
      "Setelah dipasang, aplikasi terbuka layar penuh seperti aplikasi biasa. Halaman yang pernah dibuka tetap bisa diakses saat offline.",
      "Tombol pasang hanya muncul lewat HTTPS (atau localhost) dan setelah ikon PNG tersedia."
    ]
  },
  {
    "id": "data",
    "title": "Penyimpanan data dan privasi",
    "items": [
      "Semua data tersimpan di browser perangkat ini (localStorage) dan tidak dikirim ke server mana pun.",
      "Data tidak tersinkron antar perangkat. Akun di HP tidak otomatis ada di laptop.",
      "Menghapus data situs atau browser, atau memasang ulang aplikasi, akan menghapus data. Belum ada fitur cadangan.",
      "Akun dan reset kata sandi pada versi ini adalah simulasi untuk demo. Untuk dipakai banyak orang, dibutuhkan backend."
    ]
  },
  {
    "id": "masalah",
    "title": "Masalah umum",
    "items": [
      "Semua limit Rp0: isi gaji, target, dan tenggat di Alokasi. Tenggat harus bulan depan atau lebih.",
      "Muncul Target tidak terkejar: gaji lebih kecil dari wajib tabung per bulan. Perpanjang tenggat atau turunkan target.",
      "Lupa username: belum ada pemulihan username pada versi demo. Username tampil di Profil selama Anda masih masuk.",
      "Tombol Pasang aplikasi tidak muncul: pastikan memakai HTTPS dan file icon-192.png serta icon-512.png ada di folder public.",
      "Halaman tidak berubah setelah pembaruan: tutup lalu buka ulang aplikasi, atau hapus cache karena service worker menyimpan versi lama."
    ]
  }
];
