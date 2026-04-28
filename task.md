# 📋 Project Tasks – Website Pengumuman LPDSA
## Universitas Abdurrab

> **Lembaga:** LPDSA (Lembaga Pangkalan Data, SPMI, dan Akreditasi)
> **Framework:** Laravel
> **Status:** In Progress

---

## 🔍 FASE 0 – Analisis Proyek

- [x] Analisis struktur proyek Laravel yang sudah ada
- [x] Identifikasi versi Laravel, PHP, dan dependensi yang digunakan
- [x] Review konfigurasi database yang sudah ada
- [x] Identifikasi stack frontend yang digunakan (Blade / Livewire / Vue / React)
- [x] Catat konvensi penamaan dan struktur folder proyek
- [x] Tentukan pendekatan implementasi berdasarkan hasil analisis

---

## 🎨 FASE 1 – Desain & Setup

- [x] Tentukan palet warna utama sesuai identitas Universitas Abdurrab
- [x] Pilih tipografi yang sesuai untuk konteks akademik
- [ ] Buat layout wireframe untuk landing page
- [ ] Buat layout wireframe untuk halaman admin
- [ ] Setup template/tema base yang responsif (mobile-friendly)
- [x] Konfigurasi asset pipeline (Vite / Mix)
- [x] Setup storage:link untuk file upload

---

## 🗄️ FASE 2 – Database & Model

### Migrasi
- [x] Buat migrasi tabel `users` (sesuaikan jika sudah ada)
- [x] Buat migrasi tabel `categories` (kategori pengumuman)
- [x] Buat migrasi tabel `announcements` (pengumuman utama)
- [x] Buat migrasi tabel `announcement_attachments` (lampiran)
- [x] Buat migrasi tabel `event_details` (detail event khusus)
- [x] Buat migrasi tabel `menus` (menu navigasi)
- [x] Buat migrasi tabel `static_pages` (halaman statis: Tentang & Kontak)
- [x] Buat migrasi tabel `banners` (banner/hero landing page)
- [x] Buat migrasi tabel `activity_logs` (log aktivitas admin)

### Model & Relasi
- [x] Buat model `User` dengan role (Super Admin / Admin)
- [x] Buat model `Category` dengan slug otomatis
- [x] Buat model `Announcement` dengan soft delete
- [x] Buat model `AnnouncementAttachment` (relasi ke Announcement)
- [x] Buat model `EventDetail` (relasi ke Announcement)
- [x] Buat model `Menu` dengan support internal & eksternal link
- [x] Buat model `StaticPage`
- [x] Buat model `Banner`
- [x] Buat model `ActivityLog`

---

## 🌱 FASE 3 – Seeder & Factory

- [x] Buat `UserSeeder` – akun Super Admin dan Admin default
- [x] Buat `CategorySeeder` – minimal 5 kategori contoh (Akademik, Akreditasi, SPMI, Umum, Event)
- [x] Buat `AnnouncementSeeder` – minimal 10 pengumuman dummy
  - [x] Minimal 3 pengumuman bertipe event (dengan event detail)
  - [x] Variasi pengumuman dengan lampiran link dan dokumen
- [x] Buat `MenuSeeder` – menu navigasi default (Home, Pengumuman, Tentang, Kontak)
- [x] Buat `StaticPageSeeder` – konten default halaman Tentang & Kontak
- [x] Buat `BannerSeeder` – banner default landing page
- [x] Jalankan dan verifikasi semua seeder berjalan tanpa error

---

## 🔐 FASE 4 – Autentikasi & Otorisasi

- [x] Konfigurasi autentikasi Laravel (login & logout)
- [x] **Hapus / nonaktifkan fitur registrasi publik**
- [x] Buat middleware untuk proteksi route admin
- [x] Setup Laravel Policy untuk setiap resource (Announcement, Category, dll.)
- [x] Setup Gate untuk pemisahan role Super Admin dan Admin
- [x] Pastikan semua route admin terproteksi

---

## 🖥️ FASE 5 – Halaman Publik (Frontend)

### 5.1 Landing Page
- [x] Implementasi layout dasar dengan header & footer
- [x] Buat komponen Banner/Hero Section (data dari database)
- [x] Tampilkan nama lembaga LPDSA secara prominens
- [x] Tampilkan daftar pengumuman terbaru
- [x] Implementasi menu navigasi dinamis (dari database)

### 5.2 Halaman Arsip & Filter Pengumuman
- [x] Tampilkan semua pengumuman dengan pagination
- [x] Implementasi filter berdasarkan kategori
- [ ] Implementasi filter berdasarkan tahun dan bulan
- [x] Implementasi search berdasarkan kata kunci (judul/isi)

### 5.3 Halaman Detail Pengumuman
- [x] Tampilkan judul, isi, dan gambar/brosur pengumuman
- [x] Tampilkan daftar lampiran (link & dokumen yang dapat diunduh)
- [x] Tampilkan blok event detail khusus (jika tipe event)
- [x] Tampilkan kategori dan tanggal publikasi
- [ ] Navigasi ke pengumuman sebelum/sesudah

### 5.4 Halaman Pencarian
- [x] Form pencarian dengan input kata kunci
- [x] Tampilkan hasil pencarian yang informatif
- [x] Tampilan "tidak ditemukan" jika hasil kosong

### 5.5 Halaman Tentang LPDSA
- [x] Tampilkan profil, visi & misi lembaga
- [ ] Tampilkan struktur organisasi
- [x] Konten diambil dari tabel `static_pages`

### 5.6 Halaman Kontak
- [x] Tampilkan informasi kontak (alamat, email, telepon)
- [ ] Embed Google Maps lokasi LPDSA
- [x] Konten diambil dari tabel `static_pages`

### 5.7 Halaman 404 Custom
- [ ] Desain halaman error 404 sesuai tema universitas
- [ ] Tombol kembali ke halaman utama

### 5.8 Sitemap / Peta Situs
- [ ] Generate halaman sitemap statis
- [ ] Daftarkan semua halaman publik yang tersedia

---

## ⚙️ FASE 6 – Panel Admin (Backend)

### 6.1 Dashboard Admin
- [x] Tampilkan total pengumuman (keseluruhan & per kategori)
- [x] Tampilkan total kategori dan total pengguna
- [x] Tampilkan daftar pengumuman terbaru
- [x] Tampilkan daftar aktivitas terbaru (logs)
- [ ] Implementasi grafik sederhana aktivitas pengumuman (bulanan)

### 6.2 Manajemen Pengumuman (CRUD)
- [x] Halaman daftar pengumuman dengan filter dan search
- [x] Form tambah pengumuman baru
  - [x] Input judul dan isi (rich text editor)
  - [x] Pilih kategori
  - [x] Set status (draft / published) dan tanggal publikasi
  - [x] Upload gambar/brosur
  - [ ] Tambah lampiran (link eksternal)
  - [ ] Tambah lampiran (upload dokumen: PDF, DOCX, dll.)
  - [x] Toggle dan isi form event detail khusus
    - [x] Tanggal & waktu mulai/selesai
    - [x] Lokasi/venue
    - [x] Narasumber / pembicara
    - [ ] Kuota peserta
    - [ ] Tautan pendaftaran
- [x] Form edit pengumuman
- [x] Konfirmasi dan fungsi hapus pengumuman (soft delete)
- [ ] Halaman detail pengumuman di admin

### 6.3 Manajemen Kategori (CRUD)
- [x] Halaman daftar kategori
- [x] Form tambah kategori (nama, deskripsi, slug otomatis)
- [x] Form edit kategori
- [x] Fungsi hapus kategori (validasi: tidak bisa hapus jika masih digunakan)

### 6.4 Manajemen Menu Navigasi (CRUD)
- [x] Halaman daftar menu dengan urutan tampilan
- [x] Form tambah menu (label, tipe: internal/eksternal, URL/path, urutan)
- [x] Form edit menu
- [x] Fungsi hapus menu
- [ ] Fitur atur ulang urutan menu (drag & drop atau input order)

### 6.5 Manajemen Pengguna / Admin (CRUD)
- [x] Halaman daftar pengguna
- [x] Form tambah pengguna (nama, email, password, role)
- [x] Form edit pengguna
- [x] Fungsi hapus pengguna (tidak bisa hapus diri sendiri)
- [x] Reset password pengguna

### 6.6 Manajemen Halaman Statis
- [x] Form edit konten halaman **Tentang LPDSA** (rich text editor)
- [x] Form edit konten halaman **Kontak**
- [ ] Preview perubahan sebelum disimpan

### 6.7 Manajemen Banner / Hero
- [x] Halaman daftar banner
- [x] Form tambah banner (judul, teks, upload gambar, urutan, status aktif)
- [x] Form edit banner
- [x] Fungsi hapus banner / nonaktifkan banner

### 6.8 Log Aktivitas
- [ ] Implementasi pencatatan log otomatis pada setiap aksi CRUD
- [x] Halaman daftar log aktivitas (siapa, aksi apa, kapan, pada data apa)
- [x] Filter log berdasarkan pengguna, jenis aksi, dan rentang tanggal
- [ ] Fungsi hapus log lama (opsional)

---

## 🧪 FASE 7 – Testing

### Unit Test
- [ ] Test model `Announcement` (relasi, scope, soft delete)
- [ ] Test model `Category` (slug generator)
- [ ] Test model `Menu` (tipe internal vs eksternal)
- [ ] Test model `User` (role validation)

### Feature Test
- [ ] Test autentikasi (login berhasil, login gagal, logout)
- [ ] Test middleware: tamu tidak bisa akses admin
- [ ] Test CRUD Pengumuman (create, read, update, delete)
- [ ] Test validasi form pengumuman (field wajib, format file)
- [ ] Test upload gambar dan dokumen lampiran
- [ ] Test CRUD Kategori
- [ ] Test CRUD Menu
- [ ] Test CRUD Pengguna
- [ ] Test filter & pencarian pengumuman (publik)
- [ ] Test halaman publik dapat diakses tanpa login (landing, detail, arsip, dll.)
- [ ] Test soft delete dan restore pengumuman
- [ ] Test pencatatan log aktivitas

---

## 🚀 FASE 8 – Finalisasi & Optimasi

- [ ] Implementasi eager loading untuk mencegah N+1 query
- [ ] Optimasi query yang berat dengan indexing database
- [ ] Audit keamanan: validasi semua input, proteksi CSRF, XSS
- [ ] Pastikan semua file upload divalidasi tipe dan ukurannya
- [ ] Review dan bersihkan route yang tidak digunakan
- [ ] Uji responsivitas di berbagai ukuran layar (mobile, tablet, desktop)
- [ ] Uji kompatibilitas browser
- [ ] Review keseluruhan UI/UX
- [ ] Dokumentasi cara install dan konfigurasi proyek (README.md)

---

## 📊 Ringkasan Task

| Fase | Deskripsi | Jumlah Task |
|------|-----------|-------------|
| 0 | Analisis Proyek | 6 |
| 1 | Desain & Setup | 7 |
| 2 | Database & Model | 18 |
| 3 | Seeder & Factory | 7 |
| 4 | Autentikasi & Otorisasi | 6 |
| 5 | Halaman Publik | 25 |
| 6 | Panel Admin | 40 |
| 7 | Testing | 16 |
| 8 | Finalisasi & Optimasi | 10 |
| **Total** | | **~135 task** |

---

*Dokumen ini dibuat sebagai panduan pengembangan proyek website LPDSA – Universitas Abdurrab.*
*Perbarui status task (✅/❌) seiring progress pengembangan.*