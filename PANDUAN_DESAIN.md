# Panduan Sistem Desain LPDSA Universitas Abdurrab (Univrab Design System)

Dokumen ini merupakan pedoman standar resmi (*Single Source of Truth*) antarmuka UI/UX untuk seluruh halaman web publik dan halaman admin sistem **LPDSA (Lembaga Pangkalan Data, Penjaminan Mutu / SPMI, dan Fasilitasi Akreditasi)** Universitas Abdurrab.

Seluruh pengembangan halaman baru atau *refactor* halaman yang sudah ada **wajib** mengikuti pedoman ini untuk menjaga konsistensi identitas visual kampus, kualitas estetika yang premium, serta kenyamanan pengguna (*user experience*).

---

## 1. Filosofi & Karakteristik Desain

Desain mengadopsi identitas visual resmi **Universitas Abdurrab** (`https://univrab.ac.id`) yang mencerminkan lembaga penjaminan mutu dan pangkalan data yang:
1. **Akademik & Bermartabat**: Menggunakan perpaduan warna marun tua (*crimson/maroon*) khas Univrab dengan aksen emas hangat (*warm gold*).
2. **Modern & Elegan**: Menggabungkan tipografi modern (*Plus Jakarta Sans*), sudut kurva asimetris (*curved framing*), efek kaca (*glassmorphism*), dan pola titik dekoratif (*pattern-dots*).
3. **Dual-Theme Seamless**: Mendukung penuh **Mode Terang (Light Mode)** dan **Mode Gelap (Dark Mode)** dengan kontras yang nyaman di mata.
4. **Responsif & Hidup**: Memiliki mikro-animasi halus (*hover transitions, pulse indicators, scale effects*) tanpa mengorbankan performa.
5. **Aman & Robust**: Kompatibel penuh dengan Inertia.js (mencegah bug string URL null/undefined).

---

## 2. Palet Warna & Token Desain

### A. Warna Utama Brand (Univrab Crimson)
Digunakan sebagai warna identitas universitas, latar belakang hero banner, tombol primer, dan penanda navigasi aktif.

| Token Tailwind | Kode Hex | Penggunaan Utama |
|---|---|---|
| `bg-brand-50` / `text-brand-50` | `#fdf2f4` | Background badge / kontainer icon terang |
| `bg-brand-100` | `#fce5e8` | Border aksen ringan |
| `bg-brand-200` | `#f9ced5` | Border kartu aktif |
| `text-brand-700` / `bg-[#8B142C]` | `#8B142C` | **Warna Marun Resmi Univrab**, judul, tombol aksi |
| `bg-brand-800` | `#800000` | State hover tombol primer |
| `bg-brand-900` | `#5c0f1f` | Gradien awal hero banner |
| `bg-brand-950` | `#38050f` | Gradien akhir hero banner & dark surface |

### B. Warna Aksen Emas (Univrab Warm Gold)
Digunakan untuk menonjolkan elemen unggulan, status akreditasi, rating, call-to-action utama, dan indikator aktif.

| Token Tailwind | Kode Hex | Penggunaan Utama |
|---|---|---|
| `gold-50` | `#fefce8` | Background kontainer icon emas |
| `text-gold-300` | `#fde047` | Teks sorotan pada hero marun gelap |
| `bg-gold-400` / `text-gold-400` | `#facc15` | **Tombol CTA primer**, ikon sorotan, bintang |
| `bg-gold-500` | `#eab308` | Hover state tombol CTA emas |
| `text-gold-600` | `#ca8a04` | Ikon emas di mode terang |

### C. Permukaan Netral (Surfaces & Backgrounds)

| Elemen | Mode Terang (Light) | Mode Gelap (Dark) |
|---|---|---|
| **Latar Belakang Halaman** | `bg-slate-50` (`#f8fafc`) | `dark:bg-neutral-950` (`#0a0a0a`) |
| **Kartu Konten / Panel** | `bg-white` | `dark:bg-neutral-900` (`#171717`) |
| **Border / Pembatas** | `border-slate-200/80` | `dark:border-neutral-800` |
| **Teks Utama (Heading)** | `text-slate-900` | `dark:text-white` |
| **Teks Sekunder (Body)** | `text-slate-600` | `dark:text-neutral-400` |
| **Teks Keterangan (Muted)** | `text-slate-400` | `dark:text-neutral-500` |

### D. Warna Status Semantik

* **Unggul / Sukses / Aktif**: `emerald-600` (Light) / `emerald-400` (Dark) - Background: `emerald-50` / `dark:bg-emerald-950/50`
* **Baik Sekali / Fakultas / Info**: `blue-600` (Light) / `blue-400` (Dark) - Background: `blue-50` / `dark:bg-blue-950/50`
* **Baik / Peringatan / Draft**: `amber-500` (Light) / `amber-400` (Dark) - Background: `amber-50` / `dark:bg-amber-950/50`
* **Kedaluwarsa / Hapus / Bahaya**: `rose-600` / `red-600` - Background: `rose-50` / `dark:bg-rose-950/50`
* **Universitas / Institusi**: `purple-600` (Light) / `purple-400` (Dark) - Background: `purple-50` / `dark:bg-purple-950/50`

---

## 3. Pola Desain Khas Univrab (*Signature Patterns*)

### 1. Banner Hero Gradien Marun dengan Pola Titik
Digunakan secara **eksklusif** hanya pada bagian atas:
- **Landing Page Publik** (`/`)
- **Ringkasan Utama Dashboard Admin** (`/dashboard`)

> [!WARNING]
> **Larangan Penggunaan (Anti-Pattern):**
> **JANGAN PERNAH** menyematkan Banner Hero Gradien kartu besar ini pada halaman internal manajemen data / CRUD admin (seperti Kategori, Menu Navigasi, Unit Akademik, Pengumuman, Akreditasi, Pengguna, dsb).
> Banner besar menghabiskan ruang vertikal (*vertical real estate*) hingga 300px+, mendorong tabel operasional dan tombol aksi penting ke bawah layar (*below the fold*), serta mengganggu efisiensi kerja admin. Untuk seluruh halaman CRUD, gunakan **Standar Compact Header** di Bab 4.

```tsx
<div className="relative rounded-3xl bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 overflow-hidden">
    {/* Pola titik dekoratif Univrab */}
    <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

    <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300 border border-white/20 mb-4">
                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                <span>Portal Administrasi LPDSA Univrab</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Pusat Data & <span className="text-gold-300">Penjaminan Mutu</span>
            </h1>
            <p className="mt-2 text-sm text-white/80 max-w-2xl leading-relaxed">
                Kelola data akreditasi, sinkronisasi PDDIKTI, dan publikasi pengumuman universitas secara terintegrasi.
            </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-3">
            <Link
                href="/admin/announcements/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-400 hover:bg-gold-300 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-102 transition-all"
            >
                <Plus className="h-4 w-4" />
                <span>Buat Pengumuman</span>
            </Link>
        </div>
    </div>
</div>
```

### 2. Glassmorphism Eyebrow Pill
Badge penanda kategori atau modul dengan efek kaca dan titik berdenyut:

```tsx
<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300 border border-white/20">
    <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
    <span>LPDSA Universitas Abdurrab</span>
</div>
```

### 3. Bingkai Kurva Asimetris (*Asymmetrical Curved Framing*)
Ciri khas visual portal Univrab untuk elemen kartu visual, thumbnail gambar, atau container hero:

```tsx
<div className="rounded-tl-[36px] rounded-br-[36px] rounded-tr-2xl rounded-bl-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-100 dark:bg-neutral-800">
    {/* Konten gambar atau ilustrasi */}
</div>
```

### 4. Kartu Metrik Interaktif (*Stat Metric Cards*)
Untuk menampilkan data statistik dengan ikon squircle dan hover interaktif:

```tsx
<Link
    href="/admin/announcements"
    className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-lg transition-all duration-300"
>
    <div className="flex items-center justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Megaphone className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors" />
    </div>
    <div className="text-2xl font-black text-slate-900 dark:text-white">
        24
    </div>
    <div className="text-xs font-bold text-slate-600 dark:text-neutral-400 mt-1">
        Pengumuman Aktif
    </div>
</Link>
```

### 5. Kartu Tiga Pilar Layanan
Model kartu 3 pilar yang merepresentasikan modul utama LPDSA:

```tsx
<div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
    <div>
        <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 flex items-center justify-center text-brand-700 dark:text-gold-400 mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:text-gold-400 transition-colors">
            Pangkalan Data (PDDIKTI)
        </h3>
        <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
            Pemantauan data dosen, mahasiswa, dan pelaporan berkala pangkalan data pendidikan tinggi.
        </p>
    </div>
    <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">15 Prodi Aktif</span>
        <Link href="/admin/academic-units" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline">
            <span>Buka Unit</span>
            <ArrowRight className="h-3.5 w-3.5" />
        </Link>
    </div>
</div>
```

---

## 4. Standar Header Halaman Admin (Compact Header Standard)

Setiap halaman manajemen data (CRUD) di admin **wajib** menggunakan header yang ringkas (*compact*), fungsional, dan hemat ruang vertikal. Hal ini bertujuan agar data utama (metrik & tabel) langsung tampak di viewport awal tanpa perlu *scrolling*.

### A. Anatomi Komponen Header Admin:
1. **Ikon Squircle Modul**: Ikon Lucide terkait fungsi modul dalam kontainer `h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-900/50`.
2. **Judul Halaman**: `h1` dengan tipografi `text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white`.
3. **Deskripsi Ringkas**: Maksimal 1 kalimat padat `text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5`.
4. **Grup Tombol Aksi Kanan**:
   - **Aksi Sekunder (Opsional)**: `Button variant="outline"` dengan `rounded-xl border-slate-200 dark:border-neutral-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800` (misal: tautan relasi, pratinjau publik, tombol ekspor).
   - **Aksi Primer**: `Button` berwarna marun khas Univrab `bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs rounded-xl shadow-xs` (misal: "Tambah Kategori Baru", "Tambah Menu Baru", "Sinkronkan Data").

### B. Template Kode Header Admin Standar:

```tsx
{/* Header Halaman Admin Standar (Compact & Fungsional) */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
        {/* Ikon Squircle Marun Univrab */}
        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-900/50">
            <Tags className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Manajemen Kategori
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
                Kelola taksonomi kategori pengumuman, berita SPMI, dan agenda akreditasi Univrab.
            </p>
        </div>
    </div>

    {/* Tombol Aksi Kanan */}
    <div className="flex items-center gap-2.5">
        {/* Aksi Sekunder (Opsional) */}
        <Button
            variant="outline"
            asChild
            className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800"
        >
            <Link href="/admin/announcements">
                <Megaphone className="h-4 w-4 mr-1.5 text-[#8B142C] dark:text-gold-400" />
                <span>Lihat Pengumuman</span>
            </Link>
        </Button>

        {/* Aksi Primer */}
        <Button
            onClick={handleOpenCreateDialog}
            className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs shadow-xs"
        >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Tambah Kategori Baru</span>
        </Button>
    </div>
</div>
```

### C. Panduan Do's & Don'ts Header Admin:

| Aspek | ✅ Do (Wajib Diterapkan) | ❌ Don't (Dilarang) |
|---|---|---|
| **Ketinggian Vertikal** | Ringkas (50–65px), langsung menyatu dengan alur halaman | Memasang kartu banner hero gradien besar (300px+) dengan padding raksasa |
| **Ikon Modul** | Squircle `rounded-xl` marun Univrab di sisi kiri judul | Tanpa ikon atau memasang ilustrasi banner promosi yang mendominasi |
| **Posisi Aksi Utama** | Di sebelah kanan judul (`sm:justify-between`) agar cepat dijangkau | Tersembunyi di dalam kartu banner atau di bawah tabel |
| **Aksesibilitas Data** | Kartu metrik & tabel data langsung tampak di viewport tanpa harus *scroll* | Mengharuskan admin menggulir layar hanya untuk melihat baris pertama tabel |

---

## 5. Standar Filter & Toolbar Pencarian

Form pencarian dan filter harus menyatu dalam card panel berdesain bersih:

```tsx
<div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 mb-6 shadow-xs">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Input Cari */}
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
                type="text"
                placeholder="Cari kata kunci..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-slate-200 dark:border-neutral-800 text-xs"
            />
        </div>

        {/* Dropdown Filter */}
        <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs">
                <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="1">Akademik</SelectItem>
                <SelectItem value="2">Kemahasiswaan</SelectItem>
            </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
            <Button
                variant="ghost"
                onClick={resetFilter}
                className="rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            >
                <X className="h-3.5 w-3.5 mr-1" />
                Reset Filter
            </Button>
        )}
    </div>
</div>
```

---

## 6. Standar Tabel & Penyajian Data

1. **Header Tabel**:
   - Background: `bg-slate-50/75 dark:bg-neutral-800/50`
   - Tipografi: `text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400`
2. **Baris Data**:
   - Hover: `hover:bg-slate-50/60 dark:hover:bg-neutral-800/40 transition-colors`
   - Padding sel: `py-3.5 px-4 text-xs text-slate-700 dark:text-neutral-300`
3. **Paginasi Ramah Inertia**:
   - Gunakan elemen `<span>` dengan style `cursor-not-allowed` untuk tombol non-aktif (`link.url === null`).
   - Gunakan `<Link>` untuk halaman aktif dengan penanda marun `bg-[#8B142C] text-white font-bold`.

```tsx
<div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
    <div className="overflow-x-auto">
        <Table>
            <TableHeader className="bg-slate-50/75 dark:bg-neutral-800/50">
                <TableRow>
                    <TableHead className="text-xs font-bold uppercase tracking-wider">Nama Unit</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider">Tipe</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40">
                        <TableCell className="font-semibold text-slate-900 dark:text-white">
                            {item.name}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block mr-2" />
                            Aktif
                        </TableCell>
                        <TableCell className="text-right">
                            {/* Tombol aksi */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
</div>
```

---

## 7. Standar Tombol & Aksi (*Button Guidelines*)

| Tipe Tombol | Style Tailwind | Kapan Digunakan |
|---|---|---|
| **CTA Utama Emas** | `bg-gold-400 hover:bg-gold-300 text-neutral-950 font-bold rounded-full px-5 py-2.5 shadow-lg hover:scale-102 transition-all` | Aksi paling penting di dalam hero (misal: "Buat Pengumuman", "Tentang LPDSA") |
| **Primer Brand Marun** | `bg-[#8B142C] hover:bg-[#721024] text-white font-bold rounded-xl shadow-xs transition-colors` | Tombol simpan data, submit form, sinkronisasi |
| **Glass Pill (Hero)** | `glass-pill text-white hover:bg-white/20 border-white/20 rounded-full px-4 py-2 text-xs font-semibold` | Tombol sekunder di dalam latar belakang hero gelap |
| **Secondary Outline** | `border border-slate-300 dark:border-neutral-700 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800 text-xs font-semibold` | Tombol batal modal, ekspor CSV, tutup dialog |
| **Danger / Hapus** | `bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs text-xs` | Tombol konfirmasi hapus data permanen |
| **Ghost Link** | `hover:text-brand-700 dark:hover:text-gold-400 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-lg p-1.5` | Tombol icon aksi tabel (edit, view, delete) |

---

## 8. Standar Badge Status

### A. Peringkat Akreditasi
```tsx
// Unggul / A
<span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
    Unggul
</span>

// Baik Sekali / B
<span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    Baik Sekali
</span>

// Baik / C
<span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
    Baik
</span>
```

### B. Tipe Unit Akademik
```tsx
// Universitas
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
    Universitas
</span>

// Fakultas
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    Fakultas
</span>

// Program Studi
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
    Program Studi
</span>
```

---

## 9. Standar Dialog Modal & Konfirmasi

Untuk aksi kritis seperti penghapusan data atau konfirmasi perubahan status:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 border-slate-200 dark:border-neutral-800">
        <DialogHeader className="items-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Hapus Data Ini?
            </DialogTitle>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Seluruh data sertifikat dan arsip terkait akan ikut terhapus.
            </p>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2 sm:justify-center">
            <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl text-xs font-semibold"
            >
                Batal
            </Button>
            <Button
                onClick={handleConfirm}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
                Ya, Hapus Data
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

---

## 10. Standar Empty State (Data Kosong)

Jika tidak ada data yang ditemukan (misal setelah filter atau tabel kosong):

```tsx
<div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
    <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-gold-400 flex items-center justify-center mx-auto mb-4">
        <Search className="h-6 w-6" />
    </div>
    <h3 className="text-base font-bold text-slate-900 dark:text-white">
        Tidak Ada Data Ditemukan
    </h3>
    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
        Silakan periksa kata kunci pencarian Anda atau sesuaikan filter untuk melihat data lainnya.
    </p>
</div>
```

---

## 11. Checklist Implementasi Halaman Baru

Sebelum menyelesaikan pengerjaan halaman baru, pastikan seluruh checklist berikut terpenuhi:
- [ ] **Warna**: Menggunakan marun (`#8B142C` / `brand-700`) dan aksen emas (`gold-400`), tanpa menggunakan warna biru/merah polos bawaan browser.
- [ ] **Tipografi**: Menggunakan ukuran dan bobot font terstruktur (`font-black`, `font-bold`, `text-xs uppercase tracking-wider` untuk label/eyebrow).
- [ ] **Dark Mode**: Semua elemen diuji di mode gelap (`dark:bg-neutral-900`, `dark:border-neutral-800`, `dark:text-white`).
- [ ] **Kurva**: Menggunakan `rounded-2xl` atau `rounded-3xl` untuk kontainer utama, dan sudut asimetris (`rounded-tl-[36px] rounded-br-[36px]`) untuk kartu sorotan/hero.
- [ ] **Link Inertia**: Selalu memberikan fallback string (`url || '#'`) atau render sebagai `<span>` jika URL bernilai null/undefined untuk mencegah runtime crash.
- [ ] **Responsivitas**: Desain rapi dan tidak meluap (*overflow*) saat dibuka di perangkat mobile (lebar 360px - 414px).
- [ ] **Header Ringkas (Compact)**: Menggunakan standar header ringkas berikon squircle marun dan tombol aksi di kanan; TIDAK menggunakan hero banner gradien raksasa pada halaman CRUD/manajemen data.
- [ ] **Loading & Transition**: Tombol aksi memiliki state disabled dan spinner saat proses asynchronous berjalan.
