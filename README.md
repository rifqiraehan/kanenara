<p align="center"><img src="https://github.com/user-attachments/assets/6b70ed1a-f4e0-4ace-9225-b19287b1ca65"></p>

## Description
Kanenara adalah aplikasi pelacak keuangan yang dirancang untuk membantu pengguna mengelola akun, mencatat transaksi, dan memvisualisasikan aliran keuangan harian. Aplikasi ini menawarkan fitur-fitur intuitif untuk mempermudah pengelolaan keuangan pribadi secara efisien.

## Technologies used
- **HTML, CSS, JavaScript**: Untuk pengembangan antarmuka pengguna dan logika aplikasi.
- **Dexie.js**: Digunakan untuk pengelolaan database lokal berbasis IndexedDB.
- **Chart.js**: Untuk visualisasi data berupa grafik pemasukan dan pengeluaran.
- **Tailwind CSS**: Untuk styling dan desain responsif.
- **Font Awesome**: Untuk ikon yang digunakan dalam antarmuka pengguna.

## Features
1. **Total Balance**: Menampilkan total saldo dari semua akun.
2. **Daily Flow**: Grafik aliran keuangan harian menggunakan Chart.js.
3. **Pengelolaan Akun**:
   - Tambah, edit, dan hapus akun.
   - Penyesuaian saldo awal akun.
4. **Pengelolaan Transaksi**:
   - Tambah, edit, dan hapus transaksi (pemasukan, pengeluaran, transfer).
5. **Pengaturan Mata Uang**:
   - Pilihan mata uang utama (USD atau IDR).
   - Konversi nilai transaksi berdasarkan nilai tukar.
6. **Pengaturan Bahasa**:
   - Pilihan bahasa aplikasi (Bahasa Indonesia atau English).
7. **Manajemen Data**:
   - Ekspor data ke file JSON.
   - Impor data dari file JSON.
   - Reset data aplikasi ke kondisi awal.
8. **Notifikasi Kustom**: Menampilkan pesan sukses, warning, atau error pada operasi aplikasi.
9. **Dukungan Offline**: Aplikasi dapat digunakan tanpa koneksi internet.

## Setup instructions
1. Clone repository ini:
   ```bash
   git clone https://github.com/rifqiraehan/kanenara.git
   ```
2. Buka file `index.html` di browser untuk menjalankan aplikasi.
3. Pastikan koneksi internet tersedia untuk memuat library eksternal seperti Dexie.js dan Chart.js.
4. Unduh file 'dummy-data.json', lalu gunakan fitur ekspor pada menu pengaturan di dalam aplikasi untuk melakukan pengujian.

## AI support explanation
Selama pengembangan aplikasi ini, AI digunakan untuk meningkatkan produktivitas dan efisiensi. Berikut adalah peran AI dalam pengembangan:
- **Penulisan Kode**: Membantu menulis fungsi-fungsi utama seperti pengelolaan akun, transaksi, dan pengaturan.
- **Debugging**: Membantu menemukan dan memperbaiki error dalam kode.
- **Optimasi**: Memberikan saran untuk meningkatkan performa aplikasi.
- **Dokumentasi**: Membantu membuat dokumentasi kode dan menjelaskan sebuah fungsi yang mudah dimengerti.
- **Rekomendasi Pengembangan Fitur**: Memberikan saran teknologi yang relevan dan praktik terbaik (best practice) dalam membangun fitur aplikasi sesuai kebutuhan.

Penggunaan AI memungkinkan pengembangan aplikasi menjadi lebih cepat dan terstruktur, serta memastikan kualitas kode yang lebih baik. Teknik prompting yang efektif dilakukan dengan pemberian konteks yang jelas, seperti struktur file, isi kode, algoritma dan tujuan fungsi, atau detail error yang muncul, agar AI dapat memberikan respons yang lebih tepat sasaran. Selain itu, AI dapat dimanfaatkan untuk mempercepat proses pengembangan, misalnya dengan meminta revisi kode atau penjelasan tambahan, sehingga pekerjaan menjadi lebih efisien. Penting untuk diingat bahwa AI sebaiknya digunakan sebagai pendamping, bukan sebagai pengganti, guna memastikan hasil akhir tetap selaras dengan kebutuhan spesifik dari aplikasi yang sedang dikembangkan.
