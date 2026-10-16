# Dokumentasi Spesifikasi API Sistem Akademik (Integrasi Data LPDSA)

Dokumen ini ditujukan bagi **Tim Pengembang Sistem Akademik ("Sistem Sebelah")** Universitas Abdurrab sebagai panduan implementasi endpoint API untuk kebutuhan sinkronisasi data master unit akademik (Universitas, Fakultas, dan Program Studi) ke dalam sistem **LPDSA (Lembaga Pangkalan Data, SPMI, dan Akreditasi)**.

---

## 1. Latar Belakang & Tujuan Integrasi

Sistem LPDSA memerlukan data master unit akademik terkini dan akurat untuk:
1. Pencatatan dan pengelolaan peringkat akreditasi (**BAN-PT / LAM**).
2. Pemetaan jenjang studi program studi (**D3, D4, S1, S2, S3, Profesi**).
3. Pengelompokan program studi ke dalam fakultas induk masing-masing.
4. Publikasi informasi akreditasi resmi kepada publik dan civitas akademika.

Integrasi berjalan melalui metode **Pull Data (HTTP GET)** yang dipicu oleh Administrator LPDSA melalui tombol *"Sinkronisasi dari API"* atau scheduler berkala.

---

## 2. Ringkasan Endpoint

| Komponen | Spesifikasi |
|---|---|
| **Metode HTTP** | `GET` |
| **Path Rekomendasi** | `/api/v1/academic-units` (atau `/api/v1/prodi-fakultas`) |
| **Format Konten** | `application/json` |
| **Autentikasi** | `Bearer Token` via Header `Authorization` (Dapat dikonfigurasi di menu Admin LPDSA) |
| **Karakter Set** | `UTF-8` |

---

## 3. Header Permintaan (Request Headers)

Sistem LPDSA akan mengirimkan HTTP Request dengan header sebagai berikut:

```http
GET /api/v1/academic-units HTTP/1.1
Host: akademik.univrab.ac.id
Accept: application/json
Authorization: Bearer <API_TOKEN_DARI_SISTEM_SEBELAH>
User-Agent: LPDSA-Univrab-Client/1.0
```

> **Catatan Autentikasi:**  
> Token dapat diisi dan diubah kapan saja oleh Admin LPDSA pada menu **Admin > Pengaturan Sistem > Integrasi API**.

---

## 4. Parameter Query (Opsional)

Jika sistem sebelah mendukung penyaringan data, endpoint dapat menerima parameter opsional berikut:

| Parameter | Tipe | Contoh | Deskripsi |
|---|---|---|---|
| `is_active` | `boolean` / `integer` | `1` atau `true` | Hanya mengambil unit yang aktif |
| `type` | `string` | `study_program` | Menyaring berdasarkan tipe (`university`, `faculty`, `study_program`) |
| `updated_since` | `string (ISO 8601)` | `2026-01-01T00:00:00Z` | Hanya mengambil data yang berubah setelah tanggal tersebut |

---

## 5. Struktur Respons JSON

### Status Sukses (HTTP 200 OK)

Endpoint wajib mengembalikan payload JSON dengan format objek pembungkus (`status`, `data`) atau langsung berupa array objek pada kunci `data`.

```json
{
  "status": "success",
  "message": "Data unit akademik berhasil diambil",
  "data": [
    {
      "code": "UNIVRAB",
      "name": "Universitas Abdurrab",
      "type": "university",
      "level": null,
      "faculty_name": null,
      "is_active": true
    },
    {
      "code": "FKIK",
      "name": "Fakultas Kedokteran dan Ilmu Kesehatan",
      "type": "faculty",
      "level": null,
      "faculty_name": null,
      "is_active": true
    },
    {
      "code": "11201",
      "name": "Kedokteran",
      "type": "study_program",
      "level": "S1",
      "faculty_name": "Fakultas Kedokteran dan Ilmu Kesehatan",
      "is_active": true
    },
    {
      "code": "11901",
      "name": "Profesi Dokter",
      "type": "study_program",
      "level": "Profesi",
      "faculty_name": "Fakultas Kedokteran dan Ilmu Kesehatan",
      "is_active": true
    },
    {
      "code": "73201",
      "name": "Farmasi",
      "type": "study_program",
      "level": "S1",
      "faculty_name": "Fakultas Farmasi dan Ilmu Kesehatan",
      "is_active": true
    },
    {
      "code": "55201",
      "name": "Teknik Informatika",
      "type": "study_program",
      "level": "S1",
      "faculty_name": "Fakultas Teknik",
      "is_active": true
    },
    {
      "code": "13462",
      "name": "Kebidanan",
      "type": "study_program",
      "level": "D3",
      "faculty_name": "Fakultas Farmasi dan Ilmu Kesehatan",
      "is_active": true
    }
  ]
}
```

---

## 6. Definisi Field Objek Unit Akademik

Setiap item di dalam array `data` memiliki spesifikasi atribut sebagai berikut:

| Field | Tipe Data | Wajib? | Deskripsi & Aturan Nilai |
|---|---|---|---|
| `code` | `string` | Disarankan | Kode unit unik (misal Kode Prodi PDDIKTI: `73201`, `11201`, atau singkatan fakultas: `FT`). Maksimal 50 karakter. |
| `name` | `string` | **Wajib** | Nama resmi unit akademik. Contoh: `"Teknik Informatika"`, `"Fakultas Farmasi dan Ilmu Kesehatan"`. Maksimal 255 karakter. |
| `type` | `string` | **Wajib** | Jenis unit akademik. Nilai yang valid:<br>• `university` (Tingkat Universitas/Perguruan Tinggi)<br>• `faculty` (Tingkat Fakultas)<br>• `study_program` (Tingkat Program Studi / Prodi) |
| `level` | `string` | **Wajib untuk Prodi** | Jenjang pendidikan khusus untuk `study_program`.<br>Nilai standar:<br>• `"D3"` (Diploma 3)<br>• `"D4"` (Diploma 4 / Sarjana Terapan)<br>• `"S1"` (Sarjana)<br>• `"S2"` (Magister)<br>• `"S3"` (Doktor)<br>• `"Profesi"` (Program Profesi Dokter/Apoteker/Ners)<br>*(Kosongkan atau `null` jika entitas bertipe `university` atau `faculty`)* |
| `faculty_name` | `string` | Disarankan untuk Prodi | Nama lengkap fakultas yang menaungi program studi terkait. Contoh: `"Fakultas Farmasi dan Ilmu Kesehatan"`. |
| `is_active` | `boolean` | Opsional | `true` jika unit/prodi masih aktif beroperasi, `false` jika telah ditutup/alih bentuk. Default: `true`. |

---

## 7. Respons Kode Status HTTP & Penanganan Kesalahan

Endpoint diharapkan mengembalikan kode status HTTP standar sesuai kondisi:

### 1. HTTP 200 OK (Berhasil)
Data berhasil ditemukan dan dikembalikan dalam format JSON yang valid.

### 2. HTTP 401 Unauthorized (Autentikasi Gagal)
Terjadi jika token tidak disertakan atau token tidak valid/kedaluwarsa.
```json
{
  "status": "error",
  "message": "Token otentikasi tidak valid atau telah kedaluwarsa."
}
```

### 3. HTTP 403 Forbidden (Akses Ditolak)
Terjadi jika token tidak memiliki hak akses (*permission*) untuk membaca master data akademik.
```json
{
  "status": "error",
  "message": "Klien tidak memiliki izin untuk mengakses data unit akademik."
}
```

### 4. HTTP 500 Internal Server Error (Kendala Server)
```json
{
  "status": "error",
  "message": "Terjadi kesalahan internal pada server database akademik."
}
```

---

## 8. Mekanisme Fallback & Ketahanan di Sistem LPDSA

Untuk menjamin kelancaran operasional LPDSA:
1. Jika endpoint URL belum diisi atau server sistem sebelah sedang mengalami *downtime*, sistem LPDSA **tidak akan crash**.
2. Service LPDSA ([`AcademicApiService.php`](file:///home/xymine/project/php/lpdsa/web/app/Services/AcademicApiService.php)) secara otomatis mengaktifkan data fallback standar Univrab (1 Institusi Universitas, 4 Fakultas, dan 16 Program Studi D3/S1/Profesi).
3. Log peringatan akan dicatat sehingga tim admin mengetahui status koneksi API.

---

## 9. Referensi Master Data Fakultas & Prodi Univrab Saat Ini

Sebagai acuan pencocokan (*mapping*) nama, berikut adalah struktur unit yang saat ini aktif di Univrab:

### A. Institusi
- **Universitas Abdurrab** (`code: UNIVRAB`)

### B. Fakultas
1. **Fakultas Kedokteran dan Ilmu Kesehatan** (`code: FKIK`)
2. **Fakultas Farmasi dan Ilmu Kesehatan** (`code: FFIK`)
3. **Fakultas Teknik** (`code: FT`)
4. **Fakultas Psikologi dan Ilmu Sosial Politik** (`code: FISIP`)

### C. Program Studi & Jenjang Contoh
- `[S1]` Kedokteran (*Fakultas Kedokteran dan Ilmu Kesehatan*)
- `[Profesi]` Pendidikan Profesi Dokter (*Fakultas Kedokteran dan Ilmu Kesehatan*)
- `[S1]` Farmasi (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[D3]` Fisioterapi (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[D3]` Analis Farmasi dan Makanan (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[D3]` Kebidanan (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[D3]` Keperawatan (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[D4]` Teknologi Laboratorium Medis (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[S1]` Fisioterapi (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[S1]` Kebidanan (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[Profesi]` Pendidikan Profesi Bidan (*Fakultas Farmasi dan Ilmu Kesehatan*)
- `[S1]` Teknik Informatika (*Fakultas Teknik*)
- `[S1]` Teknik Sipil (*Fakultas Teknik*)
- `[S1]` Ilmu Komunikasi (*Fakultas Psikologi dan Ilmu Sosial Politik*)
- `[S1]` Hubungan Internasional (*Fakultas Psikologi dan Ilmu Sosial Politik*)
- `[S1]` Psikologi (*Fakultas Psikologi dan Ilmu Sosial Politik*)

---

## 10. Pengujian Koneksi (Testing Guide)

Tim sistem sebelah dapat menguji endpoint menggunakan cURL:

```bash
curl -X GET "https://akademik.univrab.ac.id/api/v1/academic-units" \
     -H "Accept: application/json" \
     -H "Authorization: Bearer test_token_rahasia"
```

Setelah endpoint siap, masukkan URL dan Token ke dalam portal LPDSA di:
`http://<domain-lpdsa>/admin/settings` (Tab **Integrasi API**), lalu klik **Sinkronisasi dari API** pada menu `http://<domain-lpdsa>/admin/accreditations`.
